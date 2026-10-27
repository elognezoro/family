// Élection en ligne (AIDUS) : phases et réinitialisation, contrôle d'identité par la
// liste électorale, pièces d'identité ivoiriennes (numéro, scan réduit), code de
// confirmation, secret du vote (le bulletin n'a ni électeur ni date), affiche
// officielle (ordre fixe), accès du bureau de vote à l'émargement, pages.
// Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ejs = require('ejs');
const el = require('../services/elections');

const S = {
  id: 'aidus-2026', titre: 'Élection du Président de l’AIDUS', sousTitre: null,
  debut: new Date('2026-10-29T09:00:00Z'), fin: new Date('2026-10-29T16:00:00Z'),
  reinitialiserA: new Date('2026-10-28T16:00:00Z'), reinitialiseLe: null, resultatsPublies: false,
};
const d = (iso) => new Date(iso);

test('phases du scrutin (heure GMT) et échéance de réinitialisation', () => {
  assert.equal(el.phase(S, d('2026-10-27T10:00:00Z')), 'test');
  assert.equal(el.phase(S, d('2026-10-28T15:59:59Z')), 'test');
  assert.equal(el.phase({ ...S, reinitialiseLe: d('2026-10-28T16:00:00Z') }, d('2026-10-28T17:00:00Z')), 'attente');
  assert.equal(el.phase({ ...S, reinitialiseLe: d('2026-10-28T16:00:00Z') }, d('2026-10-29T09:00:00Z')), 'ouvert');
  assert.equal(el.phase({ ...S, reinitialiseLe: d('2026-10-28T16:00:00Z') }, d('2026-10-29T16:00:00Z')), 'clos');
  // Réinitialisation manuelle avant l'échéance : fin des tests
  assert.equal(el.phase({ ...S, reinitialiseLe: d('2026-10-27T18:00:00Z') }, d('2026-10-27T18:05:00Z')), 'attente');
  // Sans date de test, ou date de test après l'ouverture : la réinitialisation se fait au plus tard à l'ouverture
  assert.deepEqual(el.echeanceReinitialisation({ ...S, reinitialiserA: null }), S.debut);
  assert.deepEqual(el.echeanceReinitialisation({ ...S, reinitialiserA: d('2026-11-01T00:00:00Z') }), S.debut);
  assert.ok(el.voteOuvert('test') && el.voteOuvert('ouvert') && !el.voteOuvert('attente') && !el.voteOuvert('clos'));
});

test('réinitialisation automatique : une seule fois, votes effacés, dans une transaction', async () => {
  const appels = [];
  let reinitialiseLe = null;
  let donnees = null;
  const tx = {
    scrutin: { updateMany: async ({ where, data }) => { appels.push('verrou'); if (where.reinitialiseLe === null && !reinitialiseLe) { reinitialiseLe = data.reinitialiseLe; donnees = data; return { count: 1 }; } return { count: 0 }; } },
    electeur: { updateMany: async () => appels.push('compteurs') },
    bulletin: { deleteMany: async () => appels.push('bulletins') },
    emargement: { deleteMany: async () => appels.push('emargements') },
    voteEnAttente: { deleteMany: async () => appels.push('attentes') },
    electionPiece: { deleteMany: async () => appels.push('pieces') },
  };
  const prisma = { $transaction: async (fn) => fn(tx), scrutin: { findUnique: async () => ({ ...S, reinitialiseLe }) } };
  // Avant l'échéance : rien
  assert.equal((await el.assurerReinitialisation(prisma, S, d('2026-10-28T12:00:00Z'))).reinitialiseLe, null);
  assert.deepEqual(appels, []);
  // Après : verrou puis effacement
  const apres = await el.assurerReinitialisation(prisma, S, d('2026-10-28T16:00:05Z'));
  assert.ok(apres.reinitialiseLe);
  assert.deepEqual(appels, ['verrou', 'bulletins', 'emargements', 'attentes', 'pieces', 'compteurs']);
  assert.equal(donnees.terminalCle, null, 'terminaux de test révoqués');
  // Une autre instance qui arrive juste après : le verrou est déjà pris, rien n'est effacé
  appels.length = 0;
  await el.assurerReinitialisation(prisma, S, d('2026-10-28T16:00:06Z'));
  assert.deepEqual(appels, ['verrou']);
});

const LISTE = [
  { id: '1', nom: 'ASSA', prenom: 'Achy Mathieu', anneeEntree: 1990, anneeDiplome: 1992, arriveeEn: 1990 },
  { id: '2', nom: 'KOUAMÉ', prenom: 'Aya Marie-Claire', anneeEntree: 2015, anneeDiplome: 2017, arriveeEn: null },
  { id: '3', nom: 'Diallo', prenom: 'Fatou', anneeEntree: 2019, anneeDiplome: 2021, arriveeEn: 2018 },
];

test('identification : nom, prénom(s) et années contrôlés avec la liste électorale', () => {
  const t = (saisie) => { const r = el.trouverElecteur(LISTE, saisie); return r && r.id ? r.id : r; };
  assert.equal(t({ nom: 'assa', prenom: 'Mathieu', anneeEntree: '1990', anneeDiplome: '1992' }), '1');
  assert.equal(t({ nom: 'Kouame', prenom: 'aya marie claire', anneeEntree: 2015, anneeDiplome: 2017 }), '2', 'accents, casse, tirets');
  assert.equal(t({ nom: 'Mathieu', prenom: 'Assa', anneeEntree: 1990, anneeDiplome: 1992 }), '1', 'nom et prénom inversés');
  assert.equal(t({ nom: 'Diallo', prenom: 'Fatou', anneeEntree: 2018, anneeDiplome: 2021 }), '3', 'colonne « Arrivée en »');
  assert.equal(t({ nom: 'assa', prenom: 'Mathieu', anneeEntree: 1990, anneeDiplome: 1993 }), null, 'année du diplôme fausse');
  assert.equal(t({ nom: 'assa', prenom: 'Mathieu', anneeEntree: 1991, anneeDiplome: 1992 }), null, 'année d’entrée fausse');
  assert.equal(t({ nom: 'assa', prenom: 'Jean', anneeEntree: 1990, anneeDiplome: 1992 }), null, 'prénom faux');
  assert.equal(t({ nom: 'ass', prenom: 'Mathieu', anneeEntree: 1990, anneeDiplome: 1992 }), null, 'nom incomplet');
  const homonymes = LISTE.concat([{ id: '4', nom: 'ASSA', prenom: 'Mathieu', anneeEntree: 1990, anneeDiplome: 1992 }]);
  assert.equal(el.trouverElecteur(homonymes, { nom: 'assa', prenom: 'Mathieu', anneeEntree: 1990, anneeDiplome: 1992 }), 'ambigu');
});

test('pièces d’identité ivoiriennes : formats CNI (nouvelle, 2010) et passeport', () => {
  assert.ok(el.pieceValide('cni', 'CI123456789'));
  assert.ok(el.pieceValide('cni', 'ci 123 456 789'));
  assert.ok(el.pieceValide('cni', 'C 1234 5678 90'));
  assert.ok(!el.pieceValide('cni', 'CI12345678'), 'CI + 8 chiffres');
  assert.ok(!el.pieceValide('cni', 'C123456789'), 'C + 9 chiffres');
  assert.ok(!el.pieceValide('cni', '20AB12345'), 'un passeport n’est pas une CNI');
  assert.ok(el.pieceValide('passeport', '20AB12345'));
  assert.ok(el.pieceValide('passeport', '20 ab 12345'));
  assert.ok(!el.pieceValide('passeport', 'AB1234567'));
  assert.ok(!el.pieceValide('autre', 'CI123456789'));
  assert.equal(el.clePiece('cni', 'ci 123 456 789'), 'CNI CI123456789');
  assert.equal(el.clePiece('passeport', '20ab12345'), 'PASSEPORT 20AB12345');
  assert.equal(el.formatPiece('CNI C1234567890'), 'CNI C 1234 5678 90');
});

test('code de confirmation : 6 chiffres, haché, comparé à temps constant', () => {
  for (let k = 0; k < 50; k++) assert.match(el.genererCode(), /^\d{6}$/);
  const attente = { id: 'abc' };
  attente.codeHash = el.hacherCode('abc', '123456');
  assert.ok(el.codeJuste(attente, '123456'));
  assert.ok(el.codeJuste(attente, ' 123456 '));
  assert.ok(!el.codeJuste(attente, '123457'));
  assert.ok(!el.codeJuste(attente, '12345'));
  assert.ok(!el.codeJuste({ ...attente, id: 'autre' }, '123456'), 'code lié au vote en attente');
  assert.notEqual(attente.codeHash, '123456');
  assert.equal(el.masquerEmail('jean.dupont@gmail.com'), 'je••••••@gmail.com');
});

test('scan de la pièce d’identité : réduit (lisible, léger), refusé si trop petit ou illisible', async () => {
  const sharp = require('sharp');
  const grande = await sharp({ create: { width: 4000, height: 2600, channels: 3, background: '#d8e4f0' } }).png().toBuffer();
  const r = await el.optimiserPiece(grande);
  assert.equal(r.mime, 'image/jpeg');
  assert.equal(r.largeur, 1600);
  assert.equal(r.hauteur, 1040);
  assert.ok(r.taille < 600 * 1024 && r.taille === r.buffer.length);
  const moyenne = await sharp({ create: { width: 900, height: 600, channels: 3, background: '#fff' } }).jpeg().toBuffer();
  assert.equal((await el.optimiserPiece(moyenne)).largeur, 900, 'jamais agrandie');
  const petite = await sharp({ create: { width: 400, height: 260, channels: 3, background: '#fff' } }).jpeg().toBuffer();
  await assert.rejects(el.optimiserPiece(petite), /trop petite/);
  await assert.rejects(el.optimiserPiece(Buffer.from('%PDF-1.4 pas une image')), /Format non accepté/);
  // Les décodeurs SVG, HEIF, etc. ne sont jamais atteints : octets magiques contrôlés avant sharp
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000"><rect width="2000" height="2000"/></svg>');
  await assert.rejects(el.optimiserPiece(svg), /Format non accepté/);
  assert.equal(el.formatImage(grande), 'png');
  assert.equal(el.formatImage(moyenne), 'jpeg');
  assert.equal(el.formatImage(Buffer.from('RIFF0000WEBPVP8 ')), 'webp');
  assert.equal(el.formatImage(Buffer.from('\x00\x00\x00\x18ftypheic0000')), null, 'HEIC refusé');
});

test('terminal du bureau de vote : clé du scrutin, révocable, inactive après la clôture', () => {
  const ouvert = { ...S, reinitialiseLe: d('2026-10-28T16:00:00Z'), terminalCle: 'cle-aleatoire-123' };
  assert.ok(el.terminalValide(ouvert, 'cle-aleatoire-123'));
  assert.ok(!el.terminalValide(ouvert, 'aidus-2026'), 'l’ancien cookie constant ne vaut plus rien');
  assert.ok(!el.terminalValide(ouvert, ''));
  assert.ok(!el.terminalValide({ ...ouvert, terminalCle: null }, 'cle-aleatoire-123'), 'révoqué');
  assert.ok(!el.terminalValide({ ...ouvert, debut: d('2020-01-01T09:00:00Z'), fin: d('2020-01-01T16:00:00Z') }, 'cle-aleatoire-123'), 'vote clos');
});

test('libellés de date : « le jeudi 29 octobre 2026, de 09 h 00 à 16 h 00 GMT », bouton calculé', () => {
  assert.equal(el.plageGmt(S), 'le jeudi 29 octobre 2026, de 09 h 00 à 16 h 00 GMT');
  const attente = { ...S, reinitialiseLe: d('2026-10-28T16:00:00Z') };
  assert.equal(el.bouton(attente, d('2026-10-28T18:00:00Z')).libelle, 'Élection du Président de l’AIDUS — jeudi 29 octobre, 9 h – 16 h GMT');
  const decale = { ...attente, debut: d('2026-10-30T08:30:00Z'), fin: d('2026-10-30T17:00:00Z') };
  assert.equal(el.bouton(decale, d('2026-10-28T18:00:00Z')).libelle, 'Élection du Président de l’AIDUS — vendredi 30 octobre, 8 h 30 – 17 h GMT', 'suit les dates modifiées');
});

test('lien de connexion du bureau de vote : signé, sans donnée personnelle, valable 30 minutes', () => {
  const t0 = Date.now();
  const j = el.jetonBureau('membre-1', t0);
  assert.deepEqual(el.lireJetonBureau(j, t0 + 60000), { membreId: 'membre-1', emisLe: t0 });
  assert.doesNotMatch(Buffer.from(j.split('.')[0], 'base64url').toString(), /@/);
  assert.equal(el.lireJetonBureau(j, t0 + 31 * 60000), null, 'expiré');
  assert.equal(el.lireJetonBureau(el.jetonBureau('membre-2', t0).split('.')[0] + '.' + j.split('.')[1], t0), null, 'signature d’un autre membre');
  assert.equal(el.lireJetonBureau('n.importe.quoi', t0), null);
  assert.equal(el.lireJetonBureau('', t0), null);
  assert.equal(el.lireJetonBureau(j + './../../admin/elections/effacer-tests', t0 + 1000), null, 'jeton prolongé (traversée de chemin) refusé');
  assert.equal(el.lireJetonBureau(j + '.x', t0 + 1000), null, 'trois parties refusées');
});

test('messages après redirection : paramètres placés avant l’ancre', () => {
  const { go } = require('../middleware/auth');
  let cible = null;
  go({ redirect: (u) => { cible = u; } }, '/elections/aidus#vote', 'error', 'Code faux');
  assert.equal(cible, '/elections/aidus?mt=error&mm=Code%20faux#vote');
  go({ redirect: (u) => { cible = u; } }, '/admin?x=1', 'success', 'OK');
  assert.equal(cible, '/admin?x=1&mt=success&mm=OK');
});

test('secret du vote : bulletins sans électeur ni date, urne réécrite au hasard, choix jamais en base avant le vote', async () => {
  const crees = { ordres: new Set() };
  const urne = ['c1', 'c3', 'c1', 'c2', 'c3', 'c1'].map((c) => ({ candidatId: c }));
  const tx = {
    $queryRaw: async (morceaux) => { crees.verrou = morceaux.join('?'); return []; },
    voteEnAttente: { findUnique: async () => ({ id: 'w', scrutinId: S.id, electeurId: 'e1', candidatId: '', cni: 'CNI CI123456789', email: 'a@b.ci', mode: 'en_ligne', ip: '1.2.3.4', terminal: 't', pieceId: 'p1' }), findMany: async () => [{ pieceId: 'p0' }], deleteMany: async () => {} },
    electionPiece: { deleteMany: async ({ where }) => { crees.piecesEffacees = where.id.in; } },
    emargement: { create: async ({ data }) => { crees.emargement = data; } },
    bulletin: {
      findMany: async () => urne,
      deleteMany: async () => { crees.urneVidee = true; },
      createMany: async ({ data }) => { crees.bulletins = data; crees.ordres.add(data.map((b) => b.candidatId).join(',')); },
    },
  };
  const prisma = { $transaction: async (fn) => fn(tx) };
  await assert.rejects(el.enregistrerVote(prisma, { id: 'w', scrutinId: S.id }, ''), /choix absent/);
  for (let k = 0; k < 40; k++) await el.enregistrerVote(prisma, { id: 'w', scrutinId: S.id }, 'c2');
  assert.match(crees.verrou, /FOR UPDATE/, 'un enregistrement à la fois');
  assert.ok(crees.urneVidee);
  assert.equal(crees.bulletins.length, 7);
  assert.deepEqual(crees.bulletins.map((b) => b.candidatId).sort(), ['c1', 'c1', 'c1', 'c2', 'c2', 'c3', 'c3']);
  assert.ok(crees.bulletins.every((b) => Object.keys(b).sort().join() === 'candidatId,scrutinId'), 'ni électeur, ni date, ni identifiant prévisible');
  assert.ok(crees.ordres.size > 5, 'ordre de l’urne tiré au hasard à chaque vote');
  assert.equal(crees.emargement.electeurId, 'e1');
  assert.ok(!('candidatId' in crees.emargement), 'l’émargement ne dit pas pour qui');
  assert.equal(crees.emargement.pieceId, 'p1', 'la pièce jointe suit l’émargement');
  assert.deepEqual(crees.piecesEffacees, ['p0'], 'pièces des votes en attente remplacés effacées');
});

test('résultats visibles : public après publication et clôture ; super admin en test et après clôture', () => {
  assert.ok(!el.resultatsVisibles(S, 'ouvert', false));
  assert.ok(!el.resultatsVisibles(S, 'ouvert', true), 'personne pendant le vrai vote');
  assert.ok(el.resultatsVisibles(S, 'test', true));
  assert.ok(!el.resultatsVisibles(S, 'test', false));
  assert.ok(el.resultatsVisibles(S, 'clos', true));
  assert.ok(!el.resultatsVisibles(S, 'clos', false));
  assert.ok(el.resultatsVisibles({ ...S, resultatsPublies: true }, 'clos', false));
  assert.equal(el.bouton(S, d('2026-10-27T10:00:00Z')).phase, 'test');
  assert.equal(el.bouton({ ...S, reinitialiseLe: d('2026-10-28T16:00:00Z') }, d('2026-11-15T00:00:00Z')), null, 'bouton retiré 10 jours après');
});

function page(locals) {
  return new Promise((ok, ko) => ejs.renderFile(path.join(__dirname, '..', 'views', 'election.ejs'), locals, (e, h) => (e ? ko(e) : ok(h))));
}
const base = {
  pieceJointe: false, brouillon: {}, plageGmt: el.plageGmt, v: () => 'test',
  s: S, ph: 'test', candidats: [{ id: 'a', nom: 'BROU BOKA', presentation: null, photoUrl: 'https://x.test/brou.jpg' }, { id: 'b', nom: 'Lydie Yolande Abokan Dogbo', presentation: null, photoUrl: null }, { id: 'c', nom: 'Pascald DJADOU', presentation: 'Programme' }],
  part: { electeurs: 392, votants: 0, taux: 0, presentiel: 0, enLigne: 0 }, resultats: null, superAdmin: false,
  st: {}, attente: null, bureau: false, candidatChoisi: null, formatGmt: el.formatGmt, formatPiece: el.formatPiece, minutesCode: 15,
};

test('page de vote : affiche officielle (ordre fixe), étapes, pièce jointe obligatoire en ligne, processus expliqué', async () => {
  const id = await page({ ...base, etape: 'identification' });
  assert.match(id, /name="typePiece" value="cni"/);
  assert.match(id, /name="typePiece" value="passeport"/);
  assert.match(id, /Période de test/);
  assert.match(id, /Comment se déroule le vote/);
  assert.doesNotMatch(id, /hasard/);
  assert.match(id, /universite-senghor\.png/);
  assert.match(id, /Section Côte d’Ivoire \(AIDUS-CI\)/);
  const ordre = ['BROU BOKA', 'Lydie Yolande Abokan Dogbo', 'Pascald DJADOU'].map((n) => id.indexOf('affiche__nom">' + n));
  assert.ok(ordre.every((p, i) => p > 0 && (i === 0 || p > ordre[i - 1])), 'ordre de l’affiche respecté');
  assert.doesNotMatch(id, /type="radio" name="candidat"/, 'pas de case à cocher hors du bulletin');
  const bulletin = await page({ ...base, etape: 'bulletin', st: { nomAffiche: 'M. Jean KOFFI', aEmailListe: false, emailsMasques: [], cni: 'CNI C1234567890' } });
  assert.equal((bulletin.match(/type="radio" name="candidat"/g) || []).length, 3);
  assert.equal((bulletin.match(/class="affiche /g) || []).length, 1, 'une seule affiche sur le bulletin');
  assert.match(bulletin, /enctype="multipart\/form-data"/);
  assert.match(bulletin, /name="piece"[^>]*required/, 'sans JavaScript : champ fichier obligatoire');
  assert.match(bulletin, /id="btnCamera"/, 'bouton « Photographier ma pièce »');
  assert.match(bulletin, /id="champPiece" accept="image\/\*" capture="environment"/, 'photo prise directement (appareil photo du téléphone)');
  assert.doesNotMatch(bulletin, /btnFichier|Choisir une photo ou un scan|data-action="fichier"/, 'pas de choix de fichier');
  assert.match(bulletin, /<dialog class="piece-dlg" id="dlgPiece"/);
  assert.match(bulletin, /id="cadreRognage"/, 'rognage');
  assert.match(bulletin, /data-type="cni"/);
  assert.match(bulletin, /\/js\/election-piece\.js\?v=test/);
  assert.match(bulletin, /CNI C 1234 5678 90/, 'rappel de la pièce déclarée');
  assert.match(bulletin, /name="email"[^>]*required/);
  const bureau = await page({ ...base, etape: 'bulletin', bureau: true, st: { nomAffiche: 'M. Jean KOFFI', emailsMasques: [] } });
  assert.doesNotMatch(bureau, /name="email"[^>]*required/, 'e-mail facultatif au bureau de vote');
  assert.doesNotMatch(bureau, /name="piece"/, 'pièce contrôlée par le bureau, pas de scan');
  assert.doesNotMatch(bureau, /election-piece\.js|dlgPiece/, 'pas d’appareil photo sur le terminal du bureau');
  const passeport = await page({ ...base, etape: 'bulletin', st: { nomAffiche: 'M. K', emailsMasques: [], cni: 'PASSEPORT 20AB12345' } });
  assert.match(passeport, /data-type="passeport"/);
  assert.match(passeport, /page d’identité de votre passeport/);
  const code = await page({ ...base, etape: 'code', attente: { mode: 'en_ligne', email: 'a@b.ci' }, candidatChoisi: base.candidats[1] });
  assert.match(code, /name="code"/);
  assert.match(code, /Lydie Yolande Abokan Dogbo/);
  const ouvert = await page({ ...base, ph: 'attente', etape: 'identification' });
  assert.doesNotMatch(ouvert, /name="nom"/, 'pas de formulaire avant l’ouverture');
});

function pageEmargement(locals) {
  return new Promise((ok, ko) => ejs.renderFile(path.join(__dirname, '..', 'views', 'election-emargement.ejs'), locals, (e, h) => (e ? ko(e) : ok(h))));
}
test('liste d’émargement : connexion du bureau par e-mail, liste en direct, pièces jointes', async () => {
  const commun = { s: S, formatGmt: el.formatGmt, formatPiece: el.formatPiece, plageGmt: el.plageGmt };
  const connexion = await pageEmargement({ ...commun, mode: 'connexion', jeton: null });
  assert.match(connexion, /action="\/elections\/aidus\/emargement\/connexion"/);
  assert.doesNotMatch(connexion, /<table/);
  const confirmer = await pageEmargement({ ...commun, mode: 'confirmer', jeton: 'abc.def' });
  assert.match(confirmer, /action="\/elections\/aidus\/emargement\/acces\/abc.def"/);
  const piege = await pageEmargement({ ...commun, mode: 'confirmer', jeton: 'a.b/../../admin' });
  assert.match(piege, /acces\/a\.b%2F\.\.%2F\.\.%2Fadmin"/, 'chemin encodé dans le formulaire');
  const electeurs = [
    { id: '1', civilite: 'M.', nom: 'ASSA', prenom: 'Mathieu', classe: '1990-1992', emargements: [{ voteLe: d('2026-10-29T09:42:00Z'), mode: 'en_ligne', cni: 'CNI CI123456789', email: 'a@b.ci', ip: '1.2.3.4', pieceId: 'p1' }] },
    { id: '2', civilite: 'Mme', nom: 'KOUAMÉ', prenom: 'Aya', classe: '2015-2017', emargements: [] },
  ];
  const liste = { ...commun, mode: 'liste', electeurs, part: { electeurs: 2, votants: 1, taux: 50, presentiel: 0, enLigne: 1 }, ph: 'ouvert', maintenant: d('2026-10-29T10:00:00Z') };
  const membre = await pageEmargement({ ...liste, acces: { superAdmin: false, membre: { nom: 'Awa', email: 'awa@bureau.ci' } } });
  assert.match(membre, /\/elections\/aidus\/emargement\/pieces\/p1/);
  assert.match(membre, /29\/10 09:42/);
  assert.match(membre, /Se déconnecter/);
  assert.doesNotMatch(membre, /1\.2\.3\.4|a@b\.ci/, 'ni IP ni e-mail des votants pour les membres');
  const admin = await pageEmargement({ ...liste, acces: { superAdmin: true, membre: null } });
  assert.match(admin, /1\.2\.3\.4/);
  assert.doesNotMatch(admin, /Se déconnecter/);
});

test('page de vote : terminal du bureau, « A voté ! », erreurs, changer de choix', async () => {
  const fait = await page({ ...base, etape: 'fait', st: { fait: { le: '2026-10-29T10:00:00Z', mode: 'en_ligne' } } });
  assert.match(fait, /A voté !/);
  assert.match(fait, /action="\/elections\/aidus\/annuler"[^>]*id="formSuivant"/, 'nouveau vote possible');
  const terminal = await page({ ...base, etape: 'fait', bureau: true, st: { fait: { le: '2026-10-29T10:00:00Z', mode: 'presentiel' } } });
  assert.match(terminal, /Électeur suivant/);
  assert.match(terminal, /data-secondes="15"/);
  const terminalId = await page({ ...base, etape: 'identification', bureau: true });
  assert.match(terminalId, /data-terminal-bureau/, 'parcours effacé après inactivité sur le terminal');
  const apresErreur = await page({ ...base, etape: 'bulletin', brouillon: { candidat: 'b', email: 'x@y.ci' }, st: { nomAffiche: 'M. K', emailsMasques: [], cni: 'CNI CI123456789' } });
  assert.match(apresErreur, /value="b" required aria-label="Voter pour Lydie Yolande Abokan Dogbo" checked/, 'choix gardé après une erreur');
  assert.match(apresErreur, /value="x@y\.ci"/);
  const pieceDejaJointe = await page({ ...base, etape: 'bulletin', pieceJointe: true, st: { nomAffiche: 'M. K', emailsMasques: [], cni: 'CNI CI123456789' } });
  assert.match(pieceDejaJointe, /déjà jointe/);
  assert.doesNotMatch(pieceDejaJointe, /name="piece"[^>]*required/, 'pièce facultative si déjà envoyée');
  const code = await page({ ...base, etape: 'code', attente: { mode: 'en_ligne', email: 'a@b.ci' }, candidatChoisi: base.candidats[0] });
  assert.match(code, /action="\/elections\/aidus\/changer"/);
  assert.match(code, /data-un-envoi/);
  assert.match(fait + code, /le jeudi 29 octobre 2026, de 09 h 00 à 16 h 00 GMT/);
});

test('rognage de la photo de la pièce : déplacement, coins, rotation, cadre de la caméra', () => {
  const Cadre = require('../public/js/election-piece.js');
  const c = { x: 100, y: 100, w: 400, h: 250 };
  // Déplacement borné à l'image
  assert.deepEqual(Cadre.ajuster(c, 'move', 50, -20, 1000, 800, 40), { x: 150, y: 80, w: 400, h: 250 });
  assert.deepEqual(Cadre.ajuster(c, 'move', 5000, 5000, 1000, 800, 40), { x: 600, y: 550, w: 400, h: 250 });
  // Coin haut-gauche : le coin opposé ne bouge pas ; taille minimale respectée
  assert.deepEqual(Cadre.ajuster(c, 'nw', -50, -50, 1000, 800, 40), { x: 50, y: 50, w: 450, h: 300 });
  assert.deepEqual(Cadre.ajuster(c, 'nw', 1000, 1000, 1000, 800, 40), { x: 460, y: 310, w: 40, h: 40 });
  // Coin bas-droit : borné au bord de l'image
  assert.deepEqual(Cadre.ajuster(c, 'se', 9999, 9999, 1000, 800, 40), { x: 100, y: 100, w: 900, h: 700 });
  // Quart de tour : quatre rotations ramènent au cadre de départ
  let r = c, W = 1000, H = 800;
  for (let k = 0; k < 4; k++) { r = Cadre.pivoter(r, W, H); [W, H] = [H, W]; }
  assert.deepEqual(r, c);
  assert.deepEqual(Cadre.pivoter({ x: 10, y: 20, w: 100, h: 50 }, 1000, 800), { x: 730, y: 10, w: 50, h: 100 });
  // Cadre-guide sur une vidéo 1920×1080 affichée en 960×540 (object-fit: cover, sans recadrage)
  const g = Cadre.depuisGuide(1920, 1080, { left: 0, top: 0, width: 960, height: 540 }, { left: 80, top: 100, width: 800, height: 340 }, 0);
  assert.deepEqual(g, { x: 160, y: 200, w: 1600, h: 680 });
  // Vidéo portrait 1080×1920 dans un cadre 400×400 (recadrage vertical) : guide centré
  const p = Cadre.depuisGuide(1080, 1920, { left: 0, top: 0, width: 400, height: 400 }, { left: 20, top: 120, width: 360, height: 160 }, 0);
  // échelle 400/1080 ; vidéo affichée sur 711 px de haut, décalée de −155,6 px
  [['x', 54], ['y', 744], ['w', 972], ['h', 432]].forEach(([k, v]) => assert.ok(Math.abs(p[k] - v) < 1e-6, k + ' = ' + p[k]));
  // Image envoyée : 1 600 px au plus, jamais agrandie
  assert.deepEqual(Cadre.sortie({ w: 3000, h: 2000 }, 1600), { w: 1600, h: 1067 });
  assert.deepEqual(Cadre.sortie({ w: 900, h: 600 }, 1600), { w: 900, h: 600 });
});
