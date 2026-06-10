// Service d'envoi de SMS — notifications aux utilisateurs sur leur numéro renseigné.
//
// Fournisseur auto-détecté selon les variables d'environnement :
//  1) Twilio        → TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM
//  2) Passerelle HTTP → SMS_GATEWAY_URL (+ SMS_GATEWAY_METHOD, SMS_GATEWAY_AUTH)
//                       Les jetons {to} et {text} sont remplacés dans l'URL/le corps.
//  3) Aucun         → mode « journal » : le SMS est affiché dans la console.
//
// Tous les envois sont NON BLOQUANTS (erreurs avalées) et plafonnés en longueur.

const prisma = require('../data/prisma-store');

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = process.env.TWILIO_FROM;
const GATEWAY_URL = process.env.SMS_GATEWAY_URL;
const GATEWAY_METHOD = (process.env.SMS_GATEWAY_METHOD || 'GET').toUpperCase();
const GATEWAY_AUTH = process.env.SMS_GATEWAY_AUTH; // ex. "Bearer xxxx"

function provider() {
  if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM) return 'twilio';
  if (GATEWAY_URL) return 'gateway';
  return 'console';
}

function isConfigured() {
  return provider() !== 'console';
}

// Normalise un numéro en format compact (chiffres + éventuel +).
function normalize(phone) {
  return ('' + (phone || '')).replace(/[^\d+]/g, '');
}

async function viaTwilio(to, text) {
  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`;
  const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_TOKEN}`).toString('base64');
  const body = new URLSearchParams({ To: to, From: TWILIO_FROM, Body: text });
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!r.ok) throw new Error('Twilio HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
}

async function viaGateway(to, text) {
  const headers = {};
  if (GATEWAY_AUTH) headers.Authorization = GATEWAY_AUTH;
  if (GATEWAY_METHOD === 'POST') {
    if (GATEWAY_URL.includes('{to}') || GATEWAY_URL.includes('{text}')) {
      // URL templatisée même en POST
      const url = GATEWAY_URL.replace('{to}', encodeURIComponent(to)).replace('{text}', encodeURIComponent(text));
      const r = await fetch(url, { method: 'POST', headers });
      if (!r.ok) throw new Error('Gateway HTTP ' + r.status);
      return;
    }
    headers['Content-Type'] = 'application/json';
    const r = await fetch(GATEWAY_URL, { method: 'POST', headers, body: JSON.stringify({ to, text }) });
    if (!r.ok) throw new Error('Gateway HTTP ' + r.status);
    return;
  }
  // GET : substitution de {to} / {text} dans l'URL
  const url = GATEWAY_URL.replace('{to}', encodeURIComponent(to)).replace('{text}', encodeURIComponent(text));
  const r = await fetch(url, { method: 'GET', headers });
  if (!r.ok) throw new Error('Gateway HTTP ' + r.status);
}

// Envoi bas niveau : (numéro, texte). Retourne { ok, skipped }.
async function send(phone, text) {
  const to = normalize(phone);
  const msg = ('' + (text || '')).slice(0, 480); // ~3 segments max
  if (!to) {
    console.log('[sms] Ignoré : aucun numéro pour ce destinataire.');
    return { ok: false, skipped: true };
  }
  const p = provider();
  try {
    if (p === 'twilio') { await viaTwilio(to, msg); }
    else if (p === 'gateway') { await viaGateway(to, msg); }
    else {
      console.log('\n========== SMS (mode journal) ==========');
      console.log(`À     : ${to}`);
      console.log(`Texte : ${msg}`);
      console.log('========================================\n');
      return { ok: true, logged: true };
    }
    console.log(`[sms] Envoyé à ${to} via ${p}.`);
    return { ok: true };
  } catch (e) {
    console.error('[sms] Échec envoi :', e.message);
    return { ok: false, error: e.message };
  }
}

// Envoi à un utilisateur (récupère son numéro renseigné).
async function toUser(userId, text) {
  try {
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { phone: true } });
    if (!u || !u.phone) {
      console.log(`[sms] Ignoré : l'utilisateur ${userId} n'a pas de numéro renseigné.`);
      return { ok: false, skipped: true };
    }
    return await send(u.phone, text);
  } catch (e) {
    console.error('[sms] toUser échec :', e.message);
    return { ok: false, error: e.message };
  }
}

module.exports = { send, toUser, isConfigured, provider, normalize };
