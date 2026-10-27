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

test('réinitialisation automatique : une seule fois, votes effacés, dans une transaction, inscrite au journal', async () => {
  const appels = [];
  let reinitialiseLe = null;
  let donnees = null;
  const journal = [];
  const tx = {
    scrutin: {
      updateMany: async ({ where, data }) => { appels.push('verrou'); if (where.reinitialiseLe === null && !reinitialiseLe) { reinitialiseLe = data.reinitialiseLe; donnees = data; return { count: 1 }; } return { count: 0 }; },
      findUnique: async () => ({ ...S, reinitialiseLe }),
    },
    electeur: { updateMany: async () => appels.push('compteurs') },
    bulletin: { deleteMany: async () => appels.push('bulletins') },
    emargement: { deleteMany: async () => appels.push('emargements'), count: async ({ where }) => (where.voteLe ? 0 : 3) },
    $queryRaw: async () => [],
    journalElection: { findFirst: async () => null, create: async ({ data }) => { journal.push(data); return data; } },
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
  assert.equal(journal.length, 1, 'réinitialisation inscrite au journal');
  assert.equal(journal[0].acteur, el.ACTEUR_SYSTEME);
  assert.match(journal[0].details, /3 vote\(s\) de test effacé/);
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

test('secret du vote : bulletins sans électeur ni date, urne permutée au hasard (sans suppression), choix jamais en base avant le vote', async () => {
  const crees = { ordres: new Set() };
  const urne = ['c1', 'c3', 'c1', 'c2', 'c3', 'c1'].map((c, i) => ({ id: 'b' + i, candidatId: c }));
  let urneCourante = urne;
  const tx = {
    $queryRaw: async (morceaux) => { crees.verrou = morceaux.join('?'); return []; },
    $executeRaw: async (morceaux, valeurs) => {
      crees.requete = morceaux.join('?');
      const p = valeurs.values; // [id, candidat, id, candidat, …]
      crees.ids = p.filter((x, i) => i % 2 === 0);
      crees.bulletins = p.filter((x, i) => i % 2 === 1);
      crees.ordres.add(crees.bulletins.join(','));
    },
    voteEnAttente: { findUnique: async () => ({ id: 'w', scrutinId: S.id, electeurId: 'e1', candidatId: '', cni: 'CNI CI123456789', email: 'a@b.ci', mode: 'en_ligne', ip: '1.2.3.4', terminal: 't', pieceId: 'p1' }), findMany: async () => [{ pieceId: 'p0' }], deleteMany: async () => {} },
    electionPiece: { deleteMany: async ({ where }) => { crees.piecesEffacees = where.id.in; } },
    emargement: { create: async ({ data }) => { crees.emargement = data; } },
    bulletin: {
      findMany: async () => urneCourante,
      deleteMany: async () => { crees.urneVidee = true; },
      // Nouveau bulletin d'abord, puis l'urne entière (nouveau compris) est permutée
      create: async ({ data }) => { crees.nouveau = data; urneCourante = urne.concat([{ id: 'bN', candidatId: data.candidatId }]); return { id: 'bN', ...data }; },
    },
  };
  const prisma = { $transaction: async (fn) => fn(tx) };
  await assert.rejects(el.enregistrerVote(prisma, { id: 'w', scrutinId: S.id }, ''), /choix absent/);
  for (let k = 0; k < 40; k++) await el.enregistrerVote(prisma, { id: 'w', scrutinId: S.id }, 'c2');
  assert.match(crees.verrou, /FOR UPDATE/, 'un enregistrement à la fois');
  assert.ok(!crees.urneVidee, 'aucun bulletin supprimé (la base l’interdit le jour du scrutin)');
  assert.match(crees.requete, /UPDATE "Bulletin"/);
  assert.deepEqual(crees.ids, ['b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'bN'], 'toute l’urne, nouveau bulletin compris, est permutée');
  assert.equal(crees.bulletins.length, 7);
  assert.deepEqual(crees.bulletins.slice().sort(), ['c1', 'c1', 'c1', 'c2', 'c2', 'c3', 'c3'], 'la permutation ne change pas le décompte (nouveau vote inclus)');
  assert.deepEqual(Object.keys(crees.nouveau).sort(), ['candidatId', 'scrutinId'], 'ni électeur, ni date, ni identifiant prévisible');
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
  pieceJointe: false, brouillon: {}, plageGmt: el.plageGmt, v: () => 'test', proposerNul: false,
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
  assert.match(apresErreur, /value="b" aria-label="Voter pour Lydie Yolande Abokan Dogbo" checked/, 'choix gardé après une erreur');
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

test('bulletins nuls : aucune case cochée, confirmés, comptés à part ; pourcentages sur les exprimés', async () => {
  const prisma = {
    scrutinCandidat: { findMany: async () => [{ id: 'a', nom: 'BROU BOKA' }, { id: 'b', nom: 'Lydie Yolande Abokan Dogbo' }, { id: 'c', nom: 'Pascald DJADOU' }] },
    bulletin: { groupBy: async () => [{ candidatId: 'a', _count: { _all: 6 } }, { candidatId: 'b', _count: { _all: 3 } }, { candidatId: el.NUL, _count: { _all: 1 } }] },
  };
  const r = await el.resultats(prisma, S);
  assert.equal(r.total, 10);
  assert.equal(r.nuls, 1);
  assert.equal(r.exprimes, 9);
  assert.equal(r.pourcentageNuls, 10);
  assert.deepEqual(r.lignes.map((l) => [l.nom, l.voix, l.pourcentage]), [['BROU BOKA', 6, 66.7], ['Lydie Yolande Abokan Dogbo', 3, 33.3], ['Pascald DJADOU', 0, 0]]);
  assert.ok(!r.lignes.some((l) => l.id === el.NUL), 'le bulletin nul n’est pas un candidat');
  const vide = await el.resultats({ ...prisma, bulletin: { groupBy: async () => [] } }, S);
  assert.deepEqual([vide.total, vide.exprimes, vide.nuls, vide.pourcentageNuls], [0, 0, 0, 0]);

  const st = { nomAffiche: 'M. K', emailsMasques: [], cni: 'CNI CI123456789' };
  const bulletin = await page({ ...base, etape: 'bulletin', st });
  assert.doesNotMatch(bulletin, /name="candidat"[^>]*required/, 'aucune case obligatoire');
  assert.match(bulletin, /id="confirmNul" hidden/, 'confirmation cachée tant qu’on n’envoie pas sans choix');
  assert.match(bulletin, /name="nul" value="1"/);
  assert.match(bulletin, /votre bulletin sera <strong>nul<\/strong>/);
  const aConfirmer = await page({ ...base, etape: 'bulletin', st, proposerNul: true });
  assert.doesNotMatch(aConfirmer, /id="confirmNul" hidden/, 'sans JavaScript : la confirmation s’affiche après l’erreur');
  const code = await page({ ...base, etape: 'code', attente: { mode: 'en_ligne', email: 'a@b.ci' }, candidatChoisi: { id: el.NUL, nom: 'Bulletin nul (aucun candidat)', nul: true } });
  assert.match(code, /election-choix-confirme--nul">Bulletin nul \(aucun candidat\)/);
  const res = await page({ ...base, etape: 'identification', superAdmin: true, resultats: { ...r } });
  assert.match(res, /10 bulletins dans l’urne/);
  assert.match(res, /<strong>9<\/strong> exprimés/);
  assert.match(res, /<strong>1<\/strong> nul \(10 % des bulletins\)/);
  assert.match(res, /66,7 %/);
});

test('votes réels (jour du scrutin) : jamais effacés, même par le super admin', async () => {
  const ouvert = { ...S, reinitialiseLe: d('2026-10-28T16:00:00Z') };
  assert.deepEqual(el.filtreVotesReels(ouvert), { scrutinId: S.id, voteLe: { gte: S.debut } });
  assert.equal(el.filtreVotesReels(S), null, 'période de test : aucun vote réel');
  let efface = false;
  const tx = {
    scrutin: { findUnique: async () => ouvert },
    emargement: { count: async ({ where }) => (where.voteLe ? 2 : 2), deleteMany: async () => { efface = true; } },
    bulletin: { deleteMany: async () => { efface = true; } },
  };
  await assert.rejects(el.effacerVotes(tx, S.id), (e) => e.code === 'VOTES_REELS');
  assert.ok(!efface);
});

test('journal des opérations : chaîné par empreintes, toute altération détectée', async () => {
  const entrees = [];
  const prisma = {
    $transaction: async (fn) => fn(prisma),
    $queryRaw: async (morceaux) => { prisma.verrou = morceaux.join('?'); return []; },
    journalElection: {
      findFirst: async () => (entrees.length ? entrees[entrees.length - 1] : null),
      create: async ({ data }) => { entrees.push(data); return data; },
    },
  };
  await el.journaliser(prisma, { scrutinId: S.id, acteur: 'Awa (super administrateur)', action: 'Candidat ajouté', details: '« X »' });
  await el.journaliser(prisma, { scrutinId: S.id, acteur: 'Awa (super administrateur)', action: 'Dates modifiées', details: 'clôture prolongée' });
  await el.journaliser(prisma, { scrutinId: S.id, acteur: el.ACTEUR_SYSTEME, action: 'Réinitialisation automatique' });
  assert.match(prisma.verrou, /pg_advisory_xact_lock/, 'une écriture à la fois');
  assert.equal(entrees[0].precedent, null);
  assert.equal(entrees[1].precedent, entrees[0].empreinte);
  assert.ok(entrees[1].createdAt > entrees[0].createdAt && entrees[2].createdAt > entrees[1].createdAt, 'ordre strict');
  const v = el.verifierJournal(entrees);
  assert.ok(v.ok);
  assert.equal(v.nombre, 3);
  assert.equal(v.derniere, entrees[2].empreinte);
  // Altérations faites directement en base : toutes visibles
  assert.ok(!el.verifierJournal([entrees[0], entrees[2]]).ok, 'entrée retirée');
  assert.ok(!el.verifierJournal([entrees[0], { ...entrees[1], details: 'clôture avancée' }, entrees[2]]).ok, 'entrée modifiée');
  assert.ok(!el.verifierJournal([entrees[0], entrees[1], { ...entrees[2], acteur: 'Quelqu’un d’autre' }]).ok, 'auteur modifié');
  assert.equal(el.verifierJournal([]).ok, true);
  const acteur = el.acteurDe({ session: { user: { id: 'u1', name: 'Awa Koné' } }, ip: '1.2.3.4' });
  assert.deepEqual(acteur, { acteur: 'Awa Koné (super administrateur)', acteurId: 'u1', ip: '1.2.3.4' });
});

function pageJournal(locals) {
  return new Promise((ok, ko) => ejs.renderFile(path.join(__dirname, '..', 'views', 'election-journal.ejs'), locals, (e, h) => (e ? ko(e) : ok(h))));
}
test('page du journal : connexion, garanties, contrôles de l’urne, opérations', async () => {
  const commun = { s: S, formatGmt: el.formatGmt, plageGmt: el.plageGmt };
  const connexion = await pageJournal({ ...commun, mode: 'connexion' });
  assert.match(connexion, /name="page" value="journal"/);
  assert.doesNotMatch(connexion, /journal-entree/);
  const entrees = [];
  const prisma = { $transaction: async (fn) => fn(prisma), $queryRaw: async () => [], journalElection: { findFirst: async () => entrees[entrees.length - 1] || null, create: async ({ data }) => { entrees.push(data); return data; } } };
  await el.journaliser(prisma, { scrutinId: S.id, acteur: 'Awa (super administrateur)', action: 'Candidat modifié', details: '« A » : nom « A » → « B »' });
  const locaux = {
    ...commun, mode: 'journal', candidat: { nom: 'BROU BOKA' },
    acces: { superAdmin: false, membre: { nom: 'Kouassi', email: 'k@x.ci', role: 'candidat' } },
    entrees: entrees.slice().reverse(), verification: el.verifierJournal(entrees),
    controle: { emargements: 4, bulletins: 4, coherent: true }, part: { votants: 4, electeurs: 392, taux: 1 }, ph: 'ouvert', votesReels: 4, maintenant: d('2026-10-29T11:00:00Z'),
  };
  const h = await pageJournal(locaux);
  assert.match(h, /Journal intègre/);
  assert.match(h, /Urne cohérente/);
  assert.match(h, /Candidat modifié/);
  assert.match(h, /nom « A » → « B »/);
  assert.match(h, /candidat ou représentant de BROU BOKA/);
  assert.doesNotMatch(h, /Liste d’émargement<\/a>/, 'pas de lien vers l’émargement pour un représentant');
  const altere = await pageJournal({ ...locaux, verification: el.verifierJournal([{ ...entrees[0], details: 'falsifié' }]), controle: { emargements: 4, bulletins: 5, coherent: false } });
  assert.match(altere, /Chaîne rompue/);
  assert.match(altere, /Urne incohérente/);
});

test('liste d’émargement : un représentant de candidat est renvoyé vers le journal', async () => {
  const h = await pageEmargement({ s: S, formatGmt: el.formatGmt, formatPiece: el.formatPiece, plageGmt: el.plageGmt, mode: 'connexion', jeton: null, refuse: true });
  assert.match(h, /journal des opérations/);
  assert.match(h, /name="page" value="emargement"/);
});

test('horodatage des photos : heure de réception (serveur) incrustée sous la photo, heure de prise et écart', async () => {
  const hd = require('../services/horodatage');
  // Police : chaque glyphe fait 7 rangées de 5 pixels
  for (const [c, g] of Object.entries(hd.POLICE)) assert.ok(g.length === 7 && g.every((r) => r.length === 5), 'glyphe ' + c);
  assert.deepEqual(hd.couper('UN DEUX TROIS QUATRE', 9), ['UN DEUX', 'TROIS', 'QUATRE']);
  const recuLe = d('2026-10-29T10:42:13Z');
  const l = hd.lignesHorodatage({ recuLe, prisLe: d('2026-10-29T10:41:55Z'), source: 'camera', reference: '1A2B3C4D' });
  assert.match(l[0], /RECUE PAR LE SITE LE 29\/10\/2026 A 10:42:13 GMT - REF 1A2B3C4D/);
  assert.match(l[1], /PRISE A 10:41:55 GMT \(HEURE DE L'APPAREIL, NON RECALEE, CAMÉRA DU SITE\) - 18 S AVANT RECEPTION/);
  // Horloge de l'appareil décalée : l'heure de prise est recalée sur celle du serveur (décalage mesuré à l'envoi)
  const enRetard = hd.priseRecalee('2026-10-29T09:41:13Z', '2026-10-29T09:41:43Z', recuLe); // appareil en retard d'1 h, photo prise 30 s avant l'envoi
  assert.equal(Math.round(enRetard.decalage / 1000), 3630);
  assert.deepEqual(enRetard.prisLe, d('2026-10-29T10:41:43Z'));
  const lr = hd.lignesHorodatage({ recuLe, prisLe: enRetard.prisLe, source: 'camera', reference: 'X', decalage: enRetard.decalage });
  assert.match(lr[1], /RECALEE SUR LE SITE.*30 S AVANT RECEPTION/);
  assert.match(lr[2], /HORLOGE DE L'APPAREIL EN RETARD DE 1 H 00 MIN \(CORRIGEE/);
  assert.equal(hd.infoHorodatage({ createdAt: recuLe, prisLe: enRetard.prisLe, source: 'camera' }, el.formatGmt).alerte, false, 'électeur honnête au téléphone mal réglé : pas d’alerte');
  const enAvance = hd.priseRecalee('2026-10-29T10:45:13Z', '2026-10-29T11:43:13Z', recuLe); // appareil en avance d'1 h, photo prise 58 min avant l'envoi
  assert.equal(hd.infoHorodatage({ createdAt: recuLe, prisLe: enAvance.prisLe, source: 'appareil' }, el.formatGmt).alerte, true, 'photo ancienne détectée malgré l’horloge en avance');
  assert.equal(hd.priseRecalee('2026-10-29T10:41:55Z', '', recuLe).decalage, null, 'sans heure d’envoi : non recalée');
  assert.match(hd.lignesHorodatage({ recuLe, prisLe: null, reference: 'X' })[1], /NON FOURNIE/);
  // Heure de prise envoyée par le navigateur : invraisemblable → ignorée
  assert.equal(hd.prisePlausible('n’importe quoi', recuLe), null);
  assert.equal(hd.prisePlausible('2020-01-01T00:00:00Z', recuLe), null);
  assert.equal(hd.prisePlausible('2026-11-05T00:00:00Z', recuLe), null);
  assert.deepEqual(hd.prisePlausible('2026-10-29T10:41:55Z', recuLe), d('2026-10-29T10:41:55Z'));
  // Pour le Comité : alerte si la photo a été prise plus de 15 min avant sa réception, ou heure inconnue
  const fmt = el.formatGmt;
  assert.equal(hd.infoHorodatage({ createdAt: recuLe, prisLe: d('2026-10-29T10:40:00Z'), source: 'camera' }, fmt).alerte, false);
  const vieille = hd.infoHorodatage({ createdAt: recuLe, prisLe: d('2026-10-29T08:00:00Z'), source: 'appareil' }, fmt);
  assert.equal(vieille.alerte, true);
  assert.match(vieille.ecartTexte, /2 h 42 min avant la réception/);
  assert.equal(hd.infoHorodatage({ createdAt: recuLe, prisLe: null }, fmt).alerte, true);
  // Bandeau RGBA de la largeur de la photo, lisible (échelle ≥ 2) même sur une photo étroite
  const b = hd.bandeau(l, 700);
  assert.equal(b.width, 700);
  assert.equal(b.buffer.length, 700 * b.height * 4);
  assert.ok(b.echelle >= 2 && b.lignes.length > l.length, 'texte agrandi et passé à la ligne');
  // Incrusté sous la photo par optimiserPiece : la photo n'est pas recouverte
  const sharp = require('sharp');
  const photo = await sharp({ create: { width: 2400, height: 1500, channels: 3, background: '#d8e4f0' } }).jpeg().toBuffer();
  const sans = await el.optimiserPiece(photo);
  const avec = await el.optimiserPiece(photo, { recuLe, prisLe: d('2026-10-29T10:41:55Z'), source: 'camera', reference: '1A2B3C4D' });
  assert.equal(avec.largeur, sans.largeur);
  assert.ok(avec.hauteur > sans.hauteur, 'bandeau ajouté sous la photo');
  const { data, info } = await sharp(avec.buffer).raw().toBuffer({ resolveWithObject: true });
  const px = (x, y) => data[(y * info.width + x) * info.channels];
  assert.ok(px(10, 10) > 180, 'haut de la photo intact (clair)');
  let blancs = 0;
  for (let y = sans.hauteur + 2; y < info.height; y++) for (let x = 0; x < info.width; x += 2) if (px(x, y) > 200) blancs++;
  assert.ok(blancs > 200, 'texte blanc dans le bandeau');
});

test('liste d’émargement : horodatage de la pièce pour le Comité, alerte si écart inhabituel', async () => {
  const electeurs = [
    { id: '1', civilite: 'M.', nom: 'ASSA', prenom: 'Mathieu', classe: '1990-1992', emargements: [{ voteLe: d('2026-10-29T09:42:00Z'), mode: 'en_ligne', cni: 'CNI CI123456789', pieceId: 'p1' }] },
    { id: '2', civilite: 'Mme', nom: 'KOUAMÉ', prenom: 'Aya', classe: '2015-2017', emargements: [{ voteLe: d('2026-10-29T10:00:00Z'), mode: 'en_ligne', cni: 'CNI CI123456780', pieceId: 'p2' }] },
  ];
  const hd = require('../services/horodatage');
  const horodatagesPieces = {
    p1: hd.infoHorodatage({ createdAt: d('2026-10-29T09:41:50Z'), prisLe: d('2026-10-29T09:41:20Z'), source: 'camera' }, el.formatGmt),
    p2: hd.infoHorodatage({ createdAt: d('2026-10-29T09:59:50Z'), prisLe: d('2026-10-28T20:00:00Z'), source: 'appareil' }, el.formatGmt),
  };
  const h = await pageEmargement({ s: S, formatGmt: el.formatGmt, formatPiece: el.formatPiece, plageGmt: el.plageGmt, mode: 'liste', electeurs, horodatagesPieces,
    part: { electeurs: 2, votants: 2, taux: 100, presentiel: 0, enLigne: 2 }, ph: 'ouvert', maintenant: d('2026-10-29T10:05:00Z'), acces: { superAdmin: false, membre: { nom: 'Awa', email: 'awa@bureau.ci' } } });
  assert.match(h, /data-recu="jeudi 29 octobre 2026 à 09 h 41 GMT"/);
  assert.match(h, /data-source="caméra du site"/);
  assert.equal((h.match(/class="emargement-alerte"/g) || []).length, 1, 'une seule pièce à vérifier (prise la veille)');
  assert.match(h, /id="emVisionneuseHorodatage"/);
});
