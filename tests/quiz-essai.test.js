// Quiz d'essai des leçons dont le clip est en téléchargement payant :
// tirage des questions d'essai, cookie signé des achats retenus (revérifiés en
// base), page du quiz (seules les questions d'essai sont envoyées au navigateur)
// et boutons « déjà payé » (jamais de second paiement).
// Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ejs = require('ejs');
const APP = require('../config/app');
const chants = require('../data/chants');
const acces = require('../services/acces-lecons');

const ID = '11111111-2222-3333-4444-555555555555';
const AUTRE = '66666666-7777-8888-9999-aaaaaaaaaaaa';

test('questions d’essai : 2 indices distincts, gardés pendant la session', () => {
  const session = {};
  const t = acces.questionsEssai(session, 'lecon-a', 16);
  assert.equal(t.length, 2);
  assert.notEqual(t[0], t[1]);
  t.forEach((i) => assert.ok(Number.isInteger(i) && i >= 0 && i < 16));
  for (let k = 0; k < 20; k++) assert.deepEqual(acces.questionsEssai(session, 'lecon-a', 16), t, 'même tirage au rechargement');
  // Une autre leçon a son propre tirage ; le premier reste gardé
  acces.questionsEssai(session, 'lecon-b', 12);
  assert.deepEqual(acces.questionsEssai(session, 'lecon-a', 16), t);
});

test('questions d’essai : tirage refait si la session est incohérente, banque de moins de 2 questions', () => {
  const session = { essaisQuiz: { x: [3, 3], y: [0, 99], z: 'abc' } };
  for (const slug of ['x', 'y', 'z']) {
    const t = acces.questionsEssai(session, slug, 10);
    assert.equal(new Set(t).size, 2);
    t.forEach((i) => assert.ok(i >= 0 && i < 10));
  }
  assert.deepEqual(acces.questionsEssai({}, 'mini', 1), [0]);
  assert.equal(acces.questionsEssai(null, 'sans-session', 5).length, 2);
});

test('questions d’essai : toutes les questions de la banque peuvent sortir', () => {
  const vues = new Set();
  for (let k = 0; k < 400; k++) acces.questionsEssai({}, 'l', 16).forEach((i) => vues.add(i));
  assert.equal(vues.size, 16);
});

test('questions d’essai : la session garde au plus 30 leçons', () => {
  const session = {};
  for (let k = 0; k < 50; k++) acces.questionsEssai(session, 'lecon-' + k, 8);
  assert.equal(Object.keys(session.essaisQuiz).length, 30);
  assert.ok(session.essaisQuiz['lecon-49'], 'la dernière leçon est gardée');
});

// Requête / réponse minimales pour le module « cookies »
function echange(cookie, user) {
  const entetes = {};
  const req = { headers: cookie ? { cookie } : {}, secure: false, connection: {}, session: user ? { user } : {} };
  const res = { getHeader: (n) => entetes[n.toLowerCase()], setHeader: (n, v) => { entetes[n.toLowerCase()] = v; } };
  return { req, res, cookiesPoses: () => [].concat(entetes['set-cookie'] || []).map((c) => c.split(';')[0]).join('; ') };
}

test('cookie des achats retenus : signé, cumulatif, falsification refusée', () => {
  const a = echange();
  assert.deepEqual(acces.achats(a.req, a.res), []);
  acces.retenirAchat(a.req, a.res, ID);
  const poses = a.cookiesPoses();
  assert.match(poses, /eduweb_lecons=/);
  assert.match(poses, /eduweb_lecons\.sig=/, 'cookie signé');

  const b = echange(poses);
  assert.deepEqual(acces.achats(b.req, b.res), [ID]);
  acces.retenirAchat(b.req, b.res, AUTRE);
  const c = echange(b.cookiesPoses());
  assert.deepEqual(acces.achats(c.req, c.res).sort(), [ID, AUTRE].sort());

  // Cookie modifié à la main (sans la bonne signature) : aucun achat
  const faux = poses.replace(/eduweb_lecons=[^;]*/, 'eduweb_lecons=' + AUTRE);
  const d = echange(faux);
  assert.deepEqual(acces.achats(d.req, d.res), []);
  const sansSig = echange('eduweb_lecons=' + ID);
  assert.deepEqual(acces.achats(sansSig.req, sansSig.res), [], 'sans signature');
  // Identifiant invalide : ignoré
  const e = echange();
  acces.retenirAchat(e.req, e.res, 'pas-un-uuid');
  assert.equal(e.cookiesPoses(), '');
});

// Base simulée : enregistre la requête et renvoie la réponse prévue
function baseSimulee(reponse) {
  const appels = [];
  const ok = (v) => (v instanceof Error ? Promise.reject(v) : Promise.resolve(v));
  return {
    appels,
    achatTelechargement: {
      findFirst: (q) => { appels.push(q); return ok(reponse); },
      findMany: (q) => { appels.push(q); return ok(reponse); },
    },
  };
}
const RESS = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

test('achat du visiteur : revérifié en base (statut confirmé), par cookie ou par compte', async () => {
  // Sans cookie ni compte : aucune requête, essai
  const vide = baseSimulee({ id: ID });
  const x = echange();
  assert.equal(await acces.achatDuVisiteur(vide, x.req, x.res, [RESS]), null);
  assert.equal(vide.appels.length, 0);

  // Cookie : l'achat retenu doit être encore « confirme » en base
  const a = echange();
  acces.retenirAchat(a.req, a.res, ID);
  const b = echange(a.cookiesPoses());
  const base = baseSimulee({ id: ID, jeton: 'j', ressourceId: RESS });
  assert.deepEqual(await acces.achatDuVisiteur(base, b.req, b.res, [RESS]), { id: ID, jeton: 'j', ressourceId: RESS });
  const w = base.appels[0].where;
  assert.equal(w.statut, 'confirme');
  assert.deepEqual(w.ressourceId, { in: [RESS] });
  assert.deepEqual(w.OR, [{ id: { in: [ID] } }]);
  // Achat remis à vérifier / rejeté / supprimé : la base ne le renvoie plus → essai
  assert.equal(await acces.achatDuVisiteur(baseSimulee(null), b.req, b.res, [RESS]), null);

  // Compte connecté : par l'e-mail (casse ignorée), SANS écrire de cookie
  const c = echange(null, { email: ' Parent@Exemple.ci ', role: 'parent' });
  const base2 = baseSimulee({ id: AUTRE, jeton: 'k', ressourceId: RESS });
  assert.ok(await acces.achatDuVisiteur(base2, c.req, c.res, [RESS]));
  assert.deepEqual(base2.appels[0].where.OR, [{ email: { equals: 'Parent@Exemple.ci', mode: 'insensitive' } }]);
  assert.equal(c.cookiesPoses(), '', 'aucun cookie posé pour un compte');

  // Erreur de base : essai
  assert.equal(await acces.achatDuVisiteur(baseSimulee(new Error('panne')), b.req, b.res, [RESS]), null);
});

test('ressources payées : liste sans doublon, vide sans voie d’achat ou en cas de panne', async () => {
  const a = echange();
  acces.retenirAchat(a.req, a.res, ID);
  const b = echange(a.cookiesPoses());
  const base = baseSimulee([{ ressourceId: RESS }, { ressourceId: RESS }, { ressourceId: ID }]);
  assert.deepEqual((await acces.ressourcesPayees(base, b.req, b.res)).sort(), [RESS, ID].sort());
  assert.equal(base.appels[0].where.statut, 'confirme');
  const x = echange();
  assert.deepEqual(await acces.ressourcesPayees(baseSimulee([{ ressourceId: RESS }]), x.req, x.res), []);
  assert.deepEqual(await acces.ressourcesPayees(baseSimulee(new Error('panne')), b.req, b.res), []);
});

// ─── Page du quiz ───
const chant = chants.toutes().find((c) => c.quiz.length >= 12);
const paiement = {
  prix: 200, euros: '0,30 €', delaiHeures: 12, validiteJours: 7, questionsEssai: acces.NB_ESSAI,
  operateurs: [{ id: 'wave', label: 'Wave', numero: '(+225) 07 0985 8042' }],
};
function page(accesQuiz, quiz, clipPaye = false) {
  const fichier = path.join(__dirname, '..', 'views', 'ressource-chant.ejs');
  return new Promise((ok, ko) => ejs.renderFile(fichier, {
    APP, chant, quiz, acces: accesQuiz,
    mediaType: 'video', mediaUrl: 'https://exemple.public.blob.vercel-storage.com/clip.mp4',
    ressourceId: ID, ressourceTitre: 'Leçon test', telechargementPayant: accesQuiz !== 'libre', clipPaye,
    paiement, prefill: { nom: '', email: '' }, verrou: null, formatDate: String, v: () => 'test',
  }, (err, html) => (err ? ko(err) : ok(html))));
}
const donnees = (html) => JSON.parse(html.match(/window\.CHANT_QUIZ = (.*);\s*<\/script>/)[1]);

test('page en essai : seules les 2 questions tirées (et leur corrigé) sont envoyées', async () => {
  const indices = acces.questionsEssai({}, chant.slug, chant.quiz.length);
  const html = await page('essai', indices.map((i) => chant.quiz[i]));
  assert.equal((html.match(/class="quiz-q"/g) || []).length, 2);
  const d = donnees(html);
  assert.equal(d.questions.length, 2);
  assert.deepEqual(d.questions.map((q) => q.question), indices.map((i) => chant.quiz[i].question));
  assert.deepEqual(d.essai, { banque: chant.quiz.length, complet: 10, prix: '200' });
  assert.equal(d.tailleTest, 2);
  // Aucune autre question de la banque (énoncé ou commentaire) dans la page
  const echappe = (s) => ejs.escapeXML(s);
  chant.quiz.forEach((q, i) => {
    if (indices.includes(i)) return;
    const memeTexte = indices.some((k) => chant.quiz[k].question === q.question);
    if (!memeTexte) assert.ok(!html.includes(echappe(q.question)) && !html.includes(JSON.stringify(q.question).slice(1, -1)), 'question ' + i + ' absente');
    if (q.commentaire && !indices.some((k) => chant.quiz[k].commentaire === q.commentaire)) {
      assert.ok(!html.includes(JSON.stringify(q.commentaire).slice(1, -1)), 'commentaire ' + i + ' absent');
    }
  });
  assert.match(html, /Quiz d'essai : 2 questions tirées au sort parmi les \d+ de la leçon/);
  assert.match(html, new RegExp('data-paiement="' + ID + '"[^>]*>🔓 Quiz complet \\+ téléchargement — 200 FCFA'));
  assert.match(html, /Un seul paiement de 200 FCFA débloque le quiz complet \(10 questions à chaque tentative\) et le téléchargement du clip/);
  assert.match(html, /id="modal-paiement"/);
  assert.match(html, /Refaire l’essai/);
  assert.match(html, /Déjà payé \?/);
  // Le bouton du clip invite toujours à payer
  assert.match(html, new RegExp('data-paiement="' + ID + '"[^>]*>⬇️ Télécharger le clip'));
});

test('page libre / admin / achat : toute la banque', async () => {
  for (const mode of ['libre', 'admin', 'achat']) {
    const html = await page(mode, chant.quiz);
    assert.equal((html.match(/class="quiz-q"/g) || []).length, chant.quiz.length, mode);
    const d = donnees(html);
    assert.equal(d.questions.length, chant.quiz.length);
    assert.equal(d.essai, null);
    assert.doesNotMatch(html, /🔓 Quiz complet \+ téléchargement/);
    assert.doesNotMatch(html, /Déjà payé \?/);
  }
  assert.match(await page('admin', chant.quiz), /Mode administrateur/);
  assert.match(await page('achat', chant.quiz), /Quiz complet débloqué grâce à ton paiement/);
  assert.doesNotMatch(await page('libre', chant.quiz), /id="modal-paiement"/, 'clip gratuit : pas de fenêtre de paiement');
});

test('clip déjà payé : téléchargement par le lien personnel, aucune invitation à payer', async () => {
  const html = await page('achat', chant.quiz, true);
  assert.match(html, new RegExp('href="/ressources/' + ID + '/telecharger"[^>]*>⬇️ Télécharger le clip \\(déjà payé\\)'));
  assert.doesNotMatch(html, /data-paiement=/, 'aucun bouton ne rouvre la fenêtre de paiement');
  assert.doesNotMatch(html, /Télécharger le clip\s*<span class="ress-carte__taille">/);
});
