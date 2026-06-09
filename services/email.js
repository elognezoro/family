// Service d'envoi d'emails via Resend.
// En l'absence de clé API (mode dev), les emails sont affichés dans la console.

const APP = require('../config/app');

let resend = null;
const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || 'EduWeb <onboarding@resend.dev>';
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

if (apiKey) {
  try {
    const { Resend } = require('resend');
    resend = new Resend(apiKey);
    console.log('[email] Resend activé.');
  } catch (e) {
    console.warn('[email] Resend indisponible :', e.message);
  }
} else {
  console.log('[email] Mode dev : aucune clé Resend, les liens seront affichés dans la console.');
}

function shell(title, bodyHtml) {
  return `
  <div style="background:#F4F6F0;padding:32px 0;font-family:'Segoe UI',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(14,107,58,.12);">
          <tr><td style="background:linear-gradient(135deg,#1E9E57,#0E6B3A);padding:28px 32px;text-align:center;">
            <div style="font-size:24px;font-weight:800;color:#fff;letter-spacing:.5px;">EduWeb</div>
            <div style="font-size:13px;color:#E2F3E8;margin-top:4px;">${APP.slogan}</div>
          </td></tr>
          <tr><td style="padding:32px;color:#1A2A1A;font-size:15px;line-height:1.6;">
            <h1 style="font-size:20px;margin:0 0 16px;color:#0E6B3A;">${title}</h1>
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:20px 32px;background:#F4F6F0;text-align:center;color:#7A8A7A;font-size:12px;">
            © ${new Date().getFullYear()} EduWeb — Family &amp; Coaching · Côte d'Ivoire
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;"><tr><td style="border-radius:12px;background:#1E9E57;">
    <a href="${href}" style="display:inline-block;padding:14px 32px;color:#fff;text-decoration:none;font-weight:700;font-size:15px;border-radius:12px;">${label}</a>
  </td></tr></table>`;
}

async function send(to, subject, html) {
  if (resend) {
    try {
      await resend.emails.send({ from: FROM, to, subject, html });
      console.log(`[email] Envoyé à ${to} — « ${subject} »`);
      return true;
    } catch (e) {
      console.error('[email] Échec envoi :', e.message);
      return false;
    }
  }
  // Mode dev
  console.log('\n========== EMAIL (mode dev) ==========');
  console.log(`À      : ${to}`);
  console.log(`Sujet  : ${subject}`);
  const link = (html.match(/href="([^"]*verify[^"]*)"/) || [])[1];
  if (link) console.log(`LIEN   : ${link}`);
  console.log('======================================\n');
  return true;
}

async function sendVerification(user, token) {
  const url = `${BASE_URL}/auth/verify?token=${token}`;
  const html = shell(
    'Activez votre compte',
    `<p>Bonjour <strong>${user.name}</strong>,</p>
     <p>Merci de vous être inscrit sur EduWeb. Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
     ${button(url, '✅ Activer mon compte')}
     <p style="font-size:13px;color:#7A8A7A;">Ou copiez ce lien dans votre navigateur :<br>
     <a href="${url}" style="color:#1E9E57;word-break:break-all;">${url}</a></p>
     <p style="font-size:13px;color:#F08A24;margin-top:20px;">⏰ Ce lien expire dans 24 heures.</p>`
  );
  return send(user.email, 'Activez votre compte EduWeb', html);
}

async function sendWelcome(user) {
  const url = `${BASE_URL}/auth/login`;
  const html = shell(
    'Bienvenue sur EduWeb ! 🎊',
    `<p>Bonjour <strong>${user.name}</strong>,</p>
     <p>Votre compte est maintenant <strong>activé</strong> ! Vous pouvez accéder à votre espace.</p>
     ${button(url, 'Accéder à mon espace →')}`
  );
  return send(user.email, 'Bienvenue sur EduWeb 🎊', html);
}

// Notification au coach : nouvelle réservation reçue
async function sendBookingCoach(coachUser, info) {
  const html = shell(
    'Nouvelle réservation 📚',
    `<p>Bonjour <strong>${coachUser.name}</strong>,</p>
     <p>Vous avez reçu une nouvelle demande de mission :</p>
     <ul style="line-height:1.8;">
       <li>Discipline : <strong>${info.discipline}</strong></li>
       <li>Mode : <strong>${info.mode}</strong></li>
       <li>Engagement : <strong>${info.heures} h / mois</strong></li>
       <li>Vous percevez : <strong>${info.part}</strong></li>
     </ul>
     <p>Connectez-vous pour <strong>accepter ou refuser</strong> cette mission.</p>
     ${button(`${BASE_URL}/coach`, 'Voir la mission →')}`
  );
  return send(coachUser.email, 'Nouvelle réservation sur EduWeb', html);
}

// Confirmation au parent : réservation enregistrée
async function sendBookingParent(parentUser, info) {
  const html = shell(
    'Réservation enregistrée 🎉',
    `<p>Bonjour <strong>${parentUser.name}</strong>,</p>
     <p>Votre réservation a bien été enregistrée :</p>
     <ul style="line-height:1.8;">
       <li>Coach : <strong>${info.coach}</strong></li>
       <li>Discipline : <strong>${info.discipline}</strong></li>
       <li>Montant : <strong>${info.montant}</strong> / mois</li>
     </ul>
     <p>Le coach va confirmer la mission. Vous serez notifié de sa réponse.</p>
     ${button(`${BASE_URL}/parent`, 'Mon espace →')}`
  );
  return send(parentUser.email, 'Votre réservation EduWeb', html);
}

// Le service est-il configuré pour envoyer de vrais emails ?
function isConfigured() {
  return !!resend;
}

module.exports = { send, sendVerification, sendWelcome, sendBookingCoach, sendBookingParent, isConfigured };
