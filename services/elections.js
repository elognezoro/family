// Élections en ligne (élection du Président de l'AIDUS) — règles du scrutin.
//
// - Phases (heures UTC = GMT) : « test » jusqu'à la réinitialisation, « attente »
//   jusqu'à l'ouverture, « ouvert » pendant le vote, « clos » ensuite.
// - Réinitialisation : à reinitialiserA (ou au plus tard à l'ouverture), tous les
//   votes de test sont effacés, une seule fois (verrou en base) ; le super admin
//   peut la déclencher plus tôt.
// - Identité : l'électeur doit figurer dans la liste électorale (nom, prénom,
//   année d'entrée et année du diplôme, contrôlés) ; il choisit sa pièce d'identité
//   (CNI ou passeport ivoirien, format contrôlé ; une pièce = un vote) et confirme
//   son vote avec un code à 6 chiffres reçu par
//   e-mail, sur le même appareil (une adresse e-mail = un vote). En ligne, il joint
//   la photo de sa pièce, prise directement (réduite, gardée en base, vue par le Comité
//   électoral seulement). Sur le terminal du bureau de vote (présentiel), le
//   contrôle d'identité est fait par le bureau.
// - Candidats : ordre officiel de l'affiche (champ « ordre »).
// - Émargement : consultable à tout instant par le super admin et par les membres
//   du bureau de vote (enregistrés par e-mail, connexion par lien reçu par e-mail).
// - Secret du vote : l'ÉMARGEMENT (qui a voté, quand, d'où) et le BULLETIN (pour
//   qui) sont deux tables sans lien ; le bulletin n'a ni date ni électeur, et l'urne
//   est réécrite dans un ordre tiré au hasard à chaque vote (voir enregistrerVote).
//   Avant la confirmation, le choix reste dans la session de l'électeur, jamais en base.
// - Terminal du bureau de vote : cookie portant une clé aléatoire gardée en base
//   (révocable, effacée à la réinitialisation), vérifiée à chaque requête.
const crypto = require('crypto');
const { Prisma } = require('@prisma/client');
const horodatages = require('./horodatage');

const SCRUTIN = 'aidus-2026';
const DUREE_CODE = 15 * 60 * 1000; // validité du code de confirmation
const ESSAIS_MAX = 5; // codes faux avant annulation
const ENVOIS_MAX = 3; // envois du code par vote en attente
const DUREE_LIEN = 30 * 60 * 1000; // validité du lien de connexion d'un membre du bureau
const DUREE_SESSION_BUREAU = 12 * 3600 * 1000; // session d'un membre du bureau
const ENVOIS_ELECTEUR_MAX = 6; // codes envoyés au plus par électeur (anti-abus)
const NUL = 'nul'; // bulletin nul (aucune case cochée) : valeur de Bulletin.candidatId
const SECRET = process.env.SESSION_SECRET || 'eduweb_dev_secret';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Minuscules, sans accents, mots séparés par une espace
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
// Pièces d'identité acceptées (formats ivoiriens, x = chiffre) :
//   CNI : nouvelle carte « CIxxxxxxxxx » ou ancienne carte de 2010 « C xxxx xxxx xx » ;
//   passeport : 2 chiffres, 2 lettres, 5 chiffres (ex. 20AB12345).
const PIECES = { cni: 'CNI', passeport: 'Passeport' };
const normPiece = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
function pieceValide(type, numero) {
  const n = normPiece(numero);
  if (type === 'cni') return /^CI\d{9}$/.test(n) || /^C\d{10}$/.test(n);
  if (type === 'passeport') return /^\d{2}[A-Z]{2}\d{5}$/.test(n);
  return false;
}
// Valeur enregistrée (unique par scrutin) : « CNI CI123456789 », « PASSEPORT 20AB12345 »
const clePiece = (type, numero) => (type === 'passeport' ? 'PASSEPORT ' : 'CNI ') + normPiece(numero);
// Affichage lisible : ancienne CNI regroupée « C 1234 5678 90 »
function formatPiece(cle) {
  const [type, n = ''] = String(cle || '').split(' ');
  if (type === 'CNI' && /^C\d{10}$/.test(n)) return 'CNI C ' + n.slice(1, 5) + ' ' + n.slice(5, 9) + ' ' + n.slice(9);
  return (type === 'PASSEPORT' ? 'Passeport ' : 'CNI ') + n;
}
const annee = (s) => { const n = parseInt(String(s || '').trim(), 10); return n >= 1950 && n <= 2100 ? n : null; };

function echeanceReinitialisation(s) {
  if (!s) return null;
  if (!s.reinitialiserA) return s.debut;
  return s.reinitialiserA < s.debut ? s.reinitialiserA : s.debut;
}

// Phase du scrutin à l'instant « maintenant » (s : ligne Scrutin)
function phase(s, maintenant = new Date()) {
  if (!s) return 'absent';
  if (!s.reinitialiseLe && maintenant < echeanceReinitialisation(s)) return 'test';
  if (maintenant < s.debut) return 'attente';
  if (maintenant < s.fin) return 'ouvert';
  return 'clos';
}
const voteOuvert = (ph) => ph === 'test' || ph === 'ouvert';

// Vote « réel » : émis après la fin des tests (reinitialiseLe) et après l'ouverture (debut).
// Une fois émis, il ne peut plus être ni modifié ni effacé, par personne (ici et par les
// verrous de la base : scripts/migrate-elections-integrite.js).
function filtreVotesReels(s) {
  if (!s || !s.reinitialiseLe) return null;
  const depuis = s.reinitialiseLe > s.debut ? s.reinitialiseLe : s.debut;
  return { scrutinId: s.id, voteLe: { gte: depuis } };
}
async function nbVotesReels(db, s) {
  const f = filtreVotesReels(s);
  return f ? db.emargement.count({ where: f }) : 0;
}

// Efface tous les votes du scrutin (bulletins, émargements, votes en attente) : votes de test
// seulement (refusé dès qu'un vote réel existe). Renvoie le nombre de votes effacés.
async function effacerVotes(tx, scrutinId) {
  const s = await tx.scrutin.findUnique({ where: { id: scrutinId } });
  if (await nbVotesReels(tx, s)) throw Object.assign(new Error('Des votes ont été émis le jour du scrutin : ils ne peuvent pas être effacés.'), { code: 'VOTES_REELS' });
  const n = await tx.emargement.count({ where: { scrutinId } });
  await tx.bulletin.deleteMany({ where: { scrutinId } });
  await tx.emargement.deleteMany({ where: { scrutinId } });
  await tx.voteEnAttente.deleteMany({ where: { scrutinId } });
  await tx.electionPiece.deleteMany({ where: { scrutinId } });
  await tx.electeur.updateMany({ where: { scrutinId, envoisCode: { gt: 0 } }, data: { envoisCode: 0 } });
  return n;
}

// Réinitialisation automatique, une seule fois (la première requête après l'échéance la fait)
async function assurerReinitialisation(prisma, s, maintenant = new Date()) {
  if (!s || s.reinitialiseLe || maintenant < echeanceReinitialisation(s)) return s;
  let effaces = null;
  await prisma.$transaction(async (tx) => {
    const verrou = await tx.scrutin.updateMany({ where: { id: s.id, reinitialiseLe: null }, data: { reinitialiseLe: maintenant, terminalCle: null } });
    if (verrou.count === 1) effaces = await effacerVotes(tx, s.id);
  }, { timeout: 30000 });
  if (effaces !== null) {
    await journaliser(prisma, { scrutinId: s.id, acteur: ACTEUR_SYSTEME, action: 'Réinitialisation automatique',
      details: `Fin de la période de test : ${effaces} vote(s) de test effacé(s), terminaux du bureau de vote révoqués. L’espace de vote est prêt pour le vrai scrutin.` }).catch((e) => console.error('[elections] journal :', e.message));
  }
  return prisma.scrutin.findUnique({ where: { id: s.id } });
}

// ── Journal des opérations (actions du super admin, opérations automatiques) ──
// Chaque entrée porte l'empreinte de la précédente (chaîne) : une entrée retirée ou modifiée
// directement en base se verrait ; la base refuse d'ailleurs toute modification ou suppression.
const ACTEUR_SYSTEME = 'Système (automatique)';
function empreinteJournal(e) {
  return crypto.createHash('sha256')
    .update([e.precedent || '', new Date(e.createdAt).toISOString(), e.acteur, e.action, e.details || ''].join('\n'))
    .digest('hex');
}
async function journaliser(prisma, { scrutinId, acteur, acteurId = null, action, details = null, ip = null }) {
  return prisma.$transaction(async (tx) => {
    // Une écriture à la fois : la chaîne ne se divise jamais
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${'journal-election:' + scrutinId}))::text AS verrou`;
    const dernier = await tx.journalElection.findFirst({ where: { scrutinId }, orderBy: { createdAt: 'desc' }, select: { empreinte: true, createdAt: true } });
    const maintenant = new Date();
    const createdAt = dernier && maintenant <= dernier.createdAt ? new Date(dernier.createdAt.getTime() + 1) : maintenant; // ordre strict
    const e = { scrutinId, acteur, acteurId, action, details, ip, precedent: dernier ? dernier.empreinte : null, createdAt };
    return tx.journalElection.create({ data: { id: crypto.randomUUID(), ...e, empreinte: empreinteJournal(e) } });
  }, { timeout: 15000 });
}
// Vérifie la chaîne (entrées dans l'ordre chronologique) : { ok, nombre, derniere } ou { ok: false, rupture }
function verifierJournal(entrees) {
  let precedent = null;
  for (const e of entrees) {
    if ((e.precedent || null) !== precedent || e.empreinte !== empreinteJournal(e)) return { ok: false, nombre: entrees.length, rupture: e };
    precedent = e.empreinte;
  }
  return { ok: true, nombre: entrees.length, derniere: precedent };
}
// Auteur d'une action, tel qu'inscrit au journal
function acteurDe(req) {
  const u = (req.session && req.session.user) || {};
  return { acteur: `${u.name || u.email || 'Super administrateur'} (super administrateur)`, acteurId: u.id || null, ip: req.ip || null };
}
// Contrôle public de l'urne : autant de bulletins que d'émargements
// (une seule instruction SQL, donc un seul instantané : pas de fausse alerte pendant un vote)
async function controleUrne(prisma, scrutinId) {
  const [r] = await prisma.$queryRaw`SELECT (SELECT count(*) FROM "Emargement" WHERE "scrutinId" = ${scrutinId})::int AS emargements, (SELECT count(*) FROM "Bulletin" WHERE "scrutinId" = ${scrutinId})::int AS bulletins`;
  return { emargements: r.emargements, bulletins: r.bulletins, coherent: r.emargements === r.bulletins };
}

async function charger(prisma, maintenant = new Date()) {
  let s = await prisma.scrutin.findUnique({ where: { id: SCRUTIN } });
  s = await assurerReinitialisation(prisma, s, maintenant);
  return s;
}

// L'électeur correspond-il à la saisie ? Nom exact (sans accents ni espaces),
// prénom(s) saisi(s) présents dans les prénoms de la liste, années exactes.
function correspond(e, saisie) {
  const nom = norm(saisie.nom).replace(/ /g, '');
  if (!nom || norm(e.nom).replace(/ /g, '') !== nom) return false;
  const prenomsListe = norm(e.prenom).split(' ').filter(Boolean);
  const prenomsSaisis = norm(saisie.prenom).split(' ').filter(Boolean);
  if (!prenomsSaisis.length || !prenomsSaisis.every((p) => prenomsListe.includes(p))) return false;
  if (annee(saisie.anneeDiplome) !== e.anneeDiplome) return false;
  const entrees = [e.anneeEntree, e.arriveeEn].filter(Boolean);
  return entrees.includes(annee(saisie.anneeEntree));
}

// Électeur de la liste correspondant à la saisie (nom et prénom acceptés aussi inversés) ;
// null si aucun, 'ambigu' si plusieurs.
function trouverElecteur(electeurs, saisie) {
  let trouves = electeurs.filter((e) => correspond(e, saisie));
  if (!trouves.length) trouves = electeurs.filter((e) => correspond(e, { ...saisie, nom: saisie.prenom, prenom: saisie.nom }));
  if (trouves.length > 1) return 'ambigu';
  return trouves[0] || null;
}

const emailsListe = (e) => String((e && e.emails) || '').split(',').map((x) => x.trim().toLowerCase()).filter((x) => EMAIL_RE.test(x));
function masquerEmail(m) {
  const [u, d] = String(m || '').split('@');
  if (!d) return '';
  return (u.length <= 2 ? u[0] + '•' : u.slice(0, 2) + '•'.repeat(Math.min(6, u.length - 2))) + '@' + d;
}

// Ordre tiré au hasard (Fisher-Yates, aléa cryptographique) : urne réécrite à chaque vote
function melanger(liste) {
  const t = liste.slice();
  for (let i = t.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

const genererCode = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0');
const hacherCode = (attenteId, code) => crypto.createHmac('sha256', SECRET).update(attenteId + ':' + String(code).trim()).digest('hex');
function codeJuste(attente, code) {
  if (!attente || !attente.codeHash || !/^\d{6}$/.test(String(code || '').trim())) return false;
  const a = Buffer.from(attente.codeHash, 'hex');
  const b = Buffer.from(hacherCode(attente.id, code), 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Enregistre le vote confirmé : émargement + bulletin anonyme, en une transaction.
// Les index uniques (électeur, CNI, e-mail) empêchent tout double vote, même simultané.
// candidatId vient de la session de l'électeur (jamais stocké avec son identité).
// Secret du vote : l'urne entière est réécrite, dans un ordre tiré au hasard, dans la
// transaction du vote. Tous les bulletins portent alors le même numéro de transaction
// (xmin) et leur ordre physique ne suit ni l'ordre des votes ni l'émargement.
// Le verrou sur la ligne du scrutin fait passer les enregistrements un par un.
async function enregistrerVote(prisma, attente, candidatId) {
  if (!candidatId) throw Object.assign(new Error('choix absent'), { code: 'ATTENTE' });
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT "id" FROM "Scrutin" WHERE "id" = ${attente.scrutinId} FOR UPDATE`;
    const encore = await tx.voteEnAttente.findUnique({ where: { id: attente.id } });
    if (!encore) throw Object.assign(new Error('attente introuvable'), { code: 'ATTENTE' });
    await tx.emargement.create({
      data: {
        scrutinId: encore.scrutinId, electeurId: encore.electeurId, cni: encore.cni, email: encore.email || null,
        mode: encore.mode, ip: encore.ip, terminal: encore.terminal, pieceId: encore.pieceId || null,
      },
    });
    // Nouveau bulletin, puis l'urne ENTIÈRE (nouveau compris) permutée en place : aucun bulletin
    // retiré, décompte inchangé par la permutation (la base vérifie l'un et l'autre)
    await tx.bulletin.create({ data: { scrutinId: encore.scrutinId, candidatId } });
    const urne = await tx.bulletin.findMany({ where: { scrutinId: encore.scrutinId }, select: { id: true, candidatId: true } });
    if (urne.length > 1) {
      const choix = melanger(urne.map((b) => b.candidatId));
      const valeurs = Prisma.join(urne.map((b, i) => Prisma.sql`(${b.id}, ${choix[i]})`));
      await tx.$executeRaw`UPDATE "Bulletin" AS b SET "candidatId" = v.c FROM (VALUES ${valeurs}) AS v(id, c) WHERE b."id" = v.id`;
    }
    const autres = await tx.voteEnAttente.findMany({ where: { scrutinId: encore.scrutinId, electeurId: encore.electeurId, id: { not: encore.id } }, select: { pieceId: true } });
    await tx.voteEnAttente.deleteMany({ where: { scrutinId: encore.scrutinId, electeurId: encore.electeurId } });
    await supprimerPieces(tx, autres.map((a) => a.pieceId));
  }, { timeout: 30000 });
}

// Pièces d'identité : suppression (votes en attente annulés, expirés ou remplacés)
async function supprimerPieces(db, ids) {
  const liste = (ids || []).filter(Boolean);
  if (liste.length) await db.electionPiece.deleteMany({ where: { id: { in: liste } } });
}
// garderPiece : « Changer de choix » (la pièce déjà envoyée resservira)
async function annulerAttente(prisma, attente, { garderPiece = false } = {}) {
  if (!attente) return;
  const r = await prisma.voteEnAttente.deleteMany({ where: { id: attente.id } });
  if (r.count && !garderPiece) await supprimerPieces(prisma, [attente.pieceId]);
}
// Votes en attente abandonnés depuis plus d'une heure : effacés avec leur pièce
async function purgerAttentes(prisma, scrutinId, maintenant = new Date()) {
  const vieux = await prisma.voteEnAttente.findMany({ where: { scrutinId, expireAt: { lt: new Date(maintenant.getTime() - 3600 * 1000) } }, select: { id: true, pieceId: true } });
  if (vieux.length) {
    await prisma.voteEnAttente.deleteMany({ where: { id: { in: vieux.map((v) => v.id) } } });
    await supprimerPieces(prisma, vieux.map((v) => v.pieceId));
  }
  // Pièces orphelines (parcours abandonné après « Changer de choix ») de plus de 2 heures
  const anciennes = await prisma.electionPiece.findMany({ where: { scrutinId, createdAt: { lt: new Date(maintenant.getTime() - 2 * 3600 * 1000) } }, select: { id: true } });
  if (!anciennes.length) return;
  const ids = anciennes.map((p) => p.id);
  const [emargees, attendues] = await Promise.all([
    prisma.emargement.findMany({ where: { pieceId: { in: ids } }, select: { pieceId: true } }),
    prisma.voteEnAttente.findMany({ where: { pieceId: { in: ids } }, select: { pieceId: true } }),
  ]);
  const utilisees = new Set(emargees.concat(attendues).map((x) => x.pieceId));
  await supprimerPieces(prisma, ids.filter((id) => !utilisees.has(id)));
}

// Plafond d'envois de code par électeur (atomique, partagé entre instances)
async function reserverEnvoi(prisma, electeurId) {
  const r = await prisma.electeur.updateMany({ where: { id: electeurId, envoisCode: { lt: ENVOIS_ELECTEUR_MAX } }, data: { envoisCode: { increment: 1 } } });
  return r.count === 1;
}

// Terminal du bureau de vote : la clé du cookie doit être celle du scrutin (révocable),
// et le vote ne doit pas être clos
function terminalValide(s, cle) {
  if (!s || !s.terminalCle || !cle || phase(s) === 'clos') return false;
  const a = Buffer.from(String(cle)), b = Buffer.from(s.terminalCle);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Scan ou photo de la pièce d'identité : orientation corrigée, 1 600 px au plus de côté,
// JPEG ~80 % (≈ 150 à 400 Ko : lisible sans être lourd). Refus si illisible ou trop petite.
// ⚠️ sharp chargé ici, jamais au niveau module (voir services/photo.js).
const PIECE_COTE_MAX = 1600;
const PIECE_COTE_MIN = 600;
// Seuls JPEG, PNG et WebP sont décodés (contrôle des octets magiques AVANT sharp :
// les décodeurs SVG, HEIF, etc. ne sont jamais atteints)
function formatImage(b) {
  if (!Buffer.isBuffer(b) || b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (b.slice(0, 4).toString('latin1') === 'RIFF' && b.slice(8, 12).toString('latin1') === 'WEBP') return 'webp';
  return null;
}
const PIECE_PIXELS_MAX = 60 * 1000 * 1000;
// horodatage (facultatif) : { recuLe, prisLe, source, reference } → bandeau incrusté sous la photo
async function optimiserPiece(buffer, horodatage = null) {
  const format = formatImage(buffer);
  if (!format) throw Object.assign(new Error('Format non accepté : reprenez la photo de votre pièce d’identité.'), { code: 'PIECE' });
  const sharp = require('sharp');
  const options = { limitInputPixels: PIECE_PIXELS_MAX };
  let meta;
  try { meta = await sharp(buffer, options).metadata(); } catch (e) { meta = null; }
  if (!meta || !meta.width || !meta.height || meta.format !== format) {
    throw Object.assign(new Error('Photo illisible : reprenez la photo de votre pièce d’identité.'), { code: 'PIECE' });
  }
  if (Math.max(meta.width, meta.height) < PIECE_COTE_MIN) {
    throw Object.assign(new Error('Image trop petite pour être lisible : photographiez la pièce de plus près, en bonne lumière.'), { code: 'PIECE' });
  }
  // Photo réduite (pixels bruts : une seule compression JPEG à la fin)
  const brut = await sharp(buffer, options).rotate()
    .resize(PIECE_COTE_MAX, PIECE_COTE_MAX, { fit: 'inside', withoutEnlargement: true })
    .removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = brut.info;
  const bande = horodatage ? horodatages.bandeau(horodatages.lignesHorodatage(horodatage), width) : null;
  const encoder = (qualite) => {
    let img = sharp(brut.data, { raw: { width, height, channels: brut.info.channels } });
    if (bande) {
      img = img.extend({ bottom: bande.height, background: { r: 24, g: 32, b: 28 } })
        .composite([{ input: bande.buffer, raw: { width: bande.width, height: bande.height, channels: 4 }, top: height, left: 0 }]);
    }
    return img.jpeg({ quality: qualite, mozjpeg: true }).toBuffer({ resolveWithObject: true });
  };
  let r = await encoder(80);
  if (r.data.length > 600 * 1024) r = await encoder(68);
  return { buffer: r.data, mime: 'image/jpeg', taille: r.data.length, largeur: r.info.width, hauteur: r.info.height };
}

// Lien de connexion d'un membre du bureau de vote : identifiant + date d'émission, signés
// (aucune donnée personnelle dans l'URL). Valable DUREE_LIEN, une seule fois (voir routes).
const signer = (texte) => crypto.createHmac('sha256', SECRET).update('bureau:' + texte).digest('base64url');
function jetonBureau(membreId, emisLe = Date.now()) {
  const charge = membreId + '.' + emisLe;
  return Buffer.from(charge).toString('base64url') + '.' + signer(charge);
}
function lireJetonBureau(jeton, maintenant = Date.now()) {
  if (!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(String(jeton || ''))) return null;
  const [b64, sig] = String(jeton).split('.');
  const charge = Buffer.from(b64, 'base64url').toString();
  const a = Buffer.from(sig), b = Buffer.from(signer(charge));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const [membreId, t] = charge.split('.');
  const emisLe = Number(t);
  if (!membreId || !emisLe || maintenant - emisLe > DUREE_LIEN || emisLe > maintenant + 60000) return null;
  return { membreId, emisLe };
}

async function participation(prisma, scrutinId) {
  const [electeurs, votants, presentiel] = await Promise.all([
    prisma.electeur.count({ where: { scrutinId } }),
    prisma.emargement.count({ where: { scrutinId } }),
    prisma.emargement.count({ where: { scrutinId, mode: 'presentiel' } }),
  ]);
  return { electeurs, votants, presentiel, enLigne: votants - presentiel, taux: electeurs ? Math.round((votants / electeurs) * 1000) / 10 : 0 };
}

// Résultats : bulletins dans l'urne, nuls, exprimés ; pourcentages des candidats calculés
// sur les suffrages exprimés, celui des nuls sur l'ensemble des bulletins
async function resultats(prisma, s) {
  const candidats = await prisma.scrutinCandidat.findMany({ where: { scrutinId: s.id }, orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }] });
  const groupes = await prisma.bulletin.groupBy({ by: ['candidatId'], where: { scrutinId: s.id }, _count: { _all: true } });
  const voixDe = (id) => (groupes.find((g) => g.candidatId === id) || { _count: { _all: 0 } })._count._all;
  const pour = (n, sur) => (sur ? Math.round((n / sur) * 1000) / 10 : 0);
  const total = groupes.reduce((n, g) => n + g._count._all, 0);
  const nuls = voixDe(NUL);
  const exprimes = total - nuls;
  const lignes = candidats.map((c) => {
    const voix = voixDe(c.id);
    return { id: c.id, nom: c.nom, voix, pourcentage: pour(voix, exprimes) };
  }).sort((a, b) => b.voix - a.voix);
  return { total, exprimes, nuls, pourcentageNuls: pour(nuls, total), pourcentageExprimes: total ? Math.round((100 - pour(nuls, total)) * 10) / 10 : 0, lignes };
}

// Résultats visibles ? Public : publiés par le super admin après la clôture.
// Super admin : pendant la période de test (pour vérifier le comptage) et après la clôture.
function resultatsVisibles(s, ph, superAdmin) {
  if (s.resultatsPublies && ph === 'clos') return true;
  return !!superAdmin && (ph === 'test' || ph === 'clos');
}

// Bouton de l'accueil : jusqu'à 10 jours après la clôture
function bouton(s, maintenant = new Date()) {
  if (!s) return null;
  const ph = phase(s, maintenant);
  if (ph === 'clos' && maintenant - s.fin > 10 * 24 * 3600 * 1000) return null;
  const h = (d) => { const x = new Date(d); return x.getUTCHours() + ' h' + (x.getUTCMinutes() ? ' ' + String(x.getUTCMinutes()).padStart(2, '0') : ''); };
  const libelles = {
    test: 'Élection du Président de l’AIDUS — espace de vote (tests en cours)',
    attente: `Élection du Président de l’AIDUS — ${jourGmt(s.debut).replace(/ \d{4}$/, '')}, ${h(s.debut)} – ${h(s.fin)} GMT`,
    ouvert: 'Votez maintenant : élection du Président de l’AIDUS',
    clos: s.resultatsPublies ? 'Élection du Président de l’AIDUS : les résultats' : 'Élection du Président de l’AIDUS : vote clos',
  };
  return { phase: ph, libelle: libelles[ph] };
}

// Résumé mis en cache 60 s pour l'accueil (évite une requête par visite)
let _cache = { t: 0, valeur: null };
async function resumeAccueil(prisma) {
  if (Date.now() - _cache.t < 60 * 1000) return _cache.valeur;
  let valeur = null;
  try { valeur = bouton(await prisma.scrutin.findUnique({ where: { id: SCRUTIN } })); } catch (e) { valeur = null; }
  _cache = { t: Date.now(), valeur };
  return valeur;
}
const oublierCache = () => { _cache = { t: 0, valeur: null }; };

// Date lisible, heure de Greenwich (= Abidjan)
function formatGmt(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('fr-FR', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(':', ' h ') + ' GMT';
}
const jourGmt = (d) => formatGmt(d).replace(/ à .*$/, ''); // « jeudi 29 octobre 2026 »
const heureGmt = (d) => formatGmt(d).replace(/^.* à /, '').replace(/ GMT$/, ''); // « 09 h 00 »
// Plage du vote : « le jeudi 29 octobre 2026, de 09 h 00 à 16 h 00 GMT »
function plageGmt(s) {
  if (!s) return '';
  if (jourGmt(s.debut) === jourGmt(s.fin)) return `le ${jourGmt(s.debut)}, de ${heureGmt(s.debut)} à ${heureGmt(s.fin)} GMT`;
  return `du ${formatGmt(s.debut).replace(/ GMT$/, '')} au ${formatGmt(s.fin)}`;
}

module.exports = {
  SCRUTIN, NUL, DUREE_CODE, ESSAIS_MAX, ENVOIS_MAX, ENVOIS_ELECTEUR_MAX, EMAIL_RE, DUREE_LIEN, DUREE_SESSION_BUREAU,
  norm, PIECES, normPiece, pieceValide, clePiece, formatPiece, annee, phase, voteOuvert, echeanceReinitialisation,
  filtreVotesReels, nbVotesReels, effacerVotes, assurerReinitialisation, charger,
  ACTEUR_SYSTEME, empreinteJournal, journaliser, verifierJournal, acteurDe, controleUrne, correspond, trouverElecteur,
  emailsListe, masquerEmail, melanger, genererCode, hacherCode, codeJuste, enregistrerVote,
  supprimerPieces, annulerAttente, purgerAttentes, reserverEnvoi, terminalValide, formatImage, optimiserPiece, jetonBureau, lireJetonBureau,
  participation, resultats, resultatsVisibles, bouton, resumeAccueil, oublierCache, formatGmt, jourGmt, heureGmt, plageGmt,
};
