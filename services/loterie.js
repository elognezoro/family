// Loterie EduWeb Éditions — codes des ouvrages, enregistrement des détenteurs,
// tirages au sort périodiques et notifications.
//
// Les codes suivent le format des livres imprimés :
//   EW-<ANNEE>-<NIVEAU>-<NUMERO>-<SIGNATURE>   ex. EW-2627-TLC-0457-Q7KMNW
// Signature HMAC-SHA256 (alphabet Crockford, 6 caractères). La recherche d'un
// code saisi est TOLÉRANTE aux fautes (majuscules, O→0, I/L→1, tirets/espaces
// ignorés) — identique au générateur Python d'origine.
const crypto = require('crypto');
const prisma = require('../data/prisma-store');
const email = require('./email');
const sms = require('./sms');

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // Crockford (sans I, L, O, U)
const SECRET = () => process.env.LOTERIE_SECRET || process.env.SESSION_SECRET || 'eduweb_loterie_dev';

// ─── Normalisation / format ───
function normaliser(saisie) {
  return String(saisie || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
    .replace(/O/g, '0').replace(/[IL]/g, '1');
}
function formater(annee, niveau, numero, signature) {
  return `EW-${annee}-${niveau}-${String(numero).padStart(4, '0')}-${signature}`;
}
function codeAnnee(anneeScolaire) {
  const [a, b] = String(anneeScolaire).split('-');
  return a.slice(-2) + b.slice(-2);
}
function signature(annee, niveau, numero) {
  const digest = crypto.createHmac('sha256', SECRET()).update(`${annee}:${niveau}:${String(numero).padStart(4, '0')}`).digest();
  let n = BigInt('0x' + digest.toString('hex'));
  let sig = '';
  for (let i = 0; i < 6; i++) { sig += ALPHABET[Number(n % 32n)]; n /= 32n; }
  return sig;
}

// ─── Génération d'une nouvelle série (futurs ouvrages) ───
async function genererSerie({ ouvrage, discipline, anneeScolaire, niveauCode, niveauLabel, nbCodes, createdById }) {
  const annee = codeAnnee(anneeScolaire);
  const niveau = String(niveauCode).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
  if (niveau.length !== 3) throw new Error('Le code niveau doit faire 3 caractères (ex. 3EM, TLC, 6EM).');
  const nb = Math.min(20000, Math.max(1, parseInt(nbCodes, 10) || 0));
  const serie = await prisma.loterieSerie.create({
    data: { ouvrage, discipline: discipline || null, anneeScolaire, codeAnnee: annee, niveauCode: niveau, niveauLabel, nbCodes: nb, createdById },
  });
  const lignes = [];
  for (let numero = 1; numero <= nb; numero++) {
    const code = formater(annee, niveau, numero, signature(annee, niveau, numero));
    lignes.push({ serieId: serie.id, numero, code, codeNorm: normaliser(code) });
  }
  // Insertion par lots (Neon supporte de gros createMany, on reste prudent)
  for (let i = 0; i < lignes.length; i += 1000) {
    await prisma.loterieCode.createMany({ data: lignes.slice(i, i + 1000) });
  }
  return serie;
}

// ─── Recherche / enregistrement d'un code par son détenteur ───
async function trouver(saisie) {
  const norm = normaliser(saisie);
  if (norm.length < 15) return null;
  return prisma.loterieCode.findUnique({ where: { codeNorm: norm }, include: { serie: true } });
}

async function enregistrer(userId, saisie) {
  const code = await trouver(saisie);
  if (!code) return { ok: false, motif: 'introuvable' };
  if (!code.serie.actif) return { ok: false, motif: 'serie-close' };
  if (code.statut === 'enregistre') {
    return { ok: false, motif: code.userId === userId ? 'deja-a-vous' : 'deja-pris', code };
  }
  // Réclamation conditionnelle : deux personnes ne peuvent pas enregistrer le même code
  const claim = await prisma.loterieCode.updateMany({
    where: { id: code.id, statut: 'libre' },
    data: { statut: 'enregistre', userId, enregistreAt: new Date() },
  });
  if (!claim.count) return { ok: false, motif: 'deja-pris', code };
  return { ok: true, code: await prisma.loterieCode.findUnique({ where: { id: code.id }, include: { serie: true } }) };
}

async function mesCodes(userId) {
  try {
    return await prisma.loterieCode.findMany({
      where: { userId },
      include: { serie: true },
      orderBy: { enregistreAt: 'desc' },
    });
  } catch (e) { return []; }
}

// ─── Réglages (admin système) ───
async function config() {
  try {
    return await prisma.loterieConfig.upsert({ where: { id: 'loterie' }, create: { id: 'loterie' }, update: {} });
  } catch (e) { return null; }
}
async function majConfig({ actif, nbParTirage, periodeJours, prochainTirage, canalEmail, canalSms, canalWhatsapp, messageTemplate }) {
  const data = {
    actif: !!actif,
    nbParTirage: Math.min(100, Math.max(1, parseInt(nbParTirage, 10) || 3)),
    periodeJours: Math.min(365, Math.max(1, parseInt(periodeJours, 10) || 30)),
    prochainTirage: prochainTirage ? new Date(prochainTirage) : null,
    canalEmail: !!canalEmail,
    canalSms: !!canalSms,
    canalWhatsapp: !!canalWhatsapp,
    messageTemplate: (messageTemplate || '').slice(0, 800),
  };
  return prisma.loterieConfig.upsert({ where: { id: 'loterie' }, create: { id: 'loterie', ...data }, update: data });
}

function messageLaureat(cfg, { nom, ouvrage, niveau, code }) {
  const defaut = 'Félicitations {nom} ! 🎉 Votre code {code} ({ouvrage} — {niveau}) a été tiré au sort à la loterie EduWeb Éditions. Contactez-nous au +225 01 5263 3030 pour recevoir votre lot.';
  return (cfg && cfg.messageTemplate ? cfg.messageTemplate : defaut)
    .replaceAll('{nom}', nom).replaceAll('{ouvrage}', ouvrage)
    .replaceAll('{niveau}', niveau).replaceAll('{code}', code);
}

// ─── Tirage au sort ───
// Candidats : codes ENREGISTRÉS d'une série active, jamais lauréats.
// crypto.randomInt garantit un tirage équitable et imprévisible.
async function tirer({ nb, acteurId, automatique }) {
  const cfg = await config();
  const nombre = Math.min(100, Math.max(1, parseInt(nb, 10) || (cfg ? cfg.nbParTirage : 3)));
  const candidats = await prisma.loterieCode.findMany({
    where: { statut: 'enregistre', serie: { actif: true }, userId: { not: null } },
    include: { serie: true },
  });
  const dejaLaureats = new Set((await prisma.loterieLaureat.findMany({ select: { codeId: true } })).map((l) => l.codeId));
  const pool = candidats.filter((c) => !dejaLaureats.has(c.id));
  if (!pool.length) return { ok: false, motif: 'aucun-participant' };

  const gagnants = [];
  const restants = [...pool];
  while (gagnants.length < Math.min(nombre, pool.length)) {
    const i = crypto.randomInt(restants.length);
    gagnants.push(restants.splice(i, 1)[0]);
  }

  const tirage = await prisma.$transaction(async (tx) => {
    const t = await tx.loterieTirage.create({
      data: { nbLaureats: gagnants.length, automatique: !!automatique, effectueParId: acteurId || null },
    });
    for (let r = 0; r < gagnants.length; r++) {
      await tx.loterieLaureat.create({
        data: { tirageId: t.id, codeId: gagnants[r].id, userId: gagnants[r].userId, rang: r + 1 },
      });
    }
    return t;
  }, { timeout: 30000, maxWait: 10000 });

  // Notifications (e-mail / SMS selon les réglages ; WhatsApp = envoi assisté depuis l'admin)
  const resultats = [];
  for (const [r, g] of gagnants.entries()) {
    const user = await prisma.user.findUnique({ where: { id: g.userId }, select: { id: true, name: true, email: true, phone: true } });
    const msg = messageLaureat(cfg, { nom: user.name, ouvrage: g.serie.ouvrage, niveau: g.serie.niveauLabel, code: g.code });
    let okEmail = false, okSms = false;
    if (cfg && cfg.canalEmail) okEmail = await email.sendLoterieLaureat(user, { ouvrage: g.serie.ouvrage, niveau: g.serie.niveauLabel, code: g.code, message: msg }).catch(() => false);
    if (cfg && cfg.canalSms && user.phone) okSms = await sms.toUser(user.id, msg.slice(0, 320)).then(() => true).catch(() => false);
    await prisma.loterieLaureat.updateMany({
      where: { tirageId: tirage.id, codeId: g.id },
      data: { notifieEmail: !!okEmail, notifieSms: !!okSms, notifieAt: new Date() },
    });
    resultats.push({ rang: r + 1, nom: user.name, code: g.code, ouvrage: g.serie.ouvrage, niveau: g.serie.niveauLabel });
  }
  return { ok: true, tirageId: tirage.id, laureats: resultats };
}

// Tirage automatique périodique (appelé par le cron quotidien)
async function tirageAutomatiqueSiEchu() {
  try {
    const cfg = await config();
    if (!cfg || !cfg.actif || !cfg.prochainTirage || new Date(cfg.prochainTirage) > new Date()) return null;
    const r = await tirer({ nb: cfg.nbParTirage, automatique: true });
    const prochain = new Date(Math.max(Date.now(), new Date(cfg.prochainTirage).getTime()) + cfg.periodeJours * 24 * 3600 * 1000);
    await prisma.loterieConfig.update({ where: { id: 'loterie' }, data: { prochainTirage: prochain } });
    console.log('[loterie] tirage automatique :', r.ok ? r.laureats.length + ' lauréat(s)' : r.motif);
    return r;
  } catch (e) { console.error('[loterie] tirage auto :', e.message); return null; }
}

// ─── Données publiques (page /loterie) ───
function masquerNom(nom) {
  const parties = String(nom || '').trim().split(/\s+/);
  return parties.map((p, i) => (i === 0 ? p.charAt(0) + '.' : p.charAt(0) + '***')).join(' ') || 'Lauréat';
}
async function statsPubliques() {
  try {
    const [participants, series, cfg, derniers] = await Promise.all([
      prisma.loterieCode.count({ where: { statut: 'enregistre' } }),
      prisma.loterieSerie.findMany({ where: { actif: true }, orderBy: { createdAt: 'desc' } }),
      config(),
      prisma.loterieLaureat.findMany({ orderBy: [{ notifieAt: 'desc' }, { rang: 'asc' }], take: 6 }),
    ]);
    const laureats = [];
    for (const l of derniers) {
      const [u, c] = await Promise.all([
        prisma.user.findUnique({ where: { id: l.userId }, select: { name: true } }),
        prisma.loterieCode.findUnique({ where: { id: l.codeId }, include: { serie: true } }),
      ]);
      laureats.push({ nom: masquerNom(u && u.name), ouvrage: c.serie.ouvrage, niveau: c.serie.niveauLabel, numero: c.numero });
    }
    return { actif: true, participants, series, prochainTirage: cfg && cfg.prochainTirage, laureats };
  } catch (e) { return { actif: false, participants: 0, series: [], prochainTirage: null, laureats: [] }; }
}

module.exports = { normaliser, genererSerie, trouver, enregistrer, mesCodes, config, majConfig, tirer, tirageAutomatiqueSiEchu, statsPubliques, masquerNom, messageLaureat, codeAnnee };
