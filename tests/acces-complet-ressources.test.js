// Accès complet aux ressources didactiques, accordé compte par compte par le super admin
// (permission « ressources-complet ») : téléchargement direct des ressources payantes et
// quiz complet des leçons en chanson, sans paiement.
// Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ejs = require('ejs');
const APP = require('../config/app');
const chants = require('../data/chants');

const ID = '11111111-2222-3333-4444-555555555555';
const BLOB = 'https://exemple.public.blob.vercel-storage.com/eduweb/ressources/clip-abc.mp4';
const rendre = (vue, locaux) => new Promise((ok, ko) => ejs.renderFile(path.join(__dirname, '..', 'views', vue), locaux, (e, h) => (e ? ko(e) : ok(h))));

test('droit « ressources-complet » : reconnu quel que soit le rôle, jamais par défaut', () => {
  assert.equal(APP.PERM_RESSOURCES, 'ressources-complet');
  assert.equal(APP.accesRessourcesComplet({ role: 'parent', permissions: 'ressources-complet' }), true);
  assert.equal(APP.accesRessourcesComplet({ role: 'coach', permissions: 'x,ressources-complet' }), true);
  assert.equal(APP.accesRessourcesComplet({ role: 'parent', permissions: '' }), false);
  assert.equal(APP.accesRessourcesComplet({ role: 'admin', permissions: 'users,finance' }), false, 'les admins gardent leur propre régime');
  assert.equal(APP.accesRessourcesComplet(null), false);
  // Le droit n'ouvre aucune permission d'administration
  assert.equal(APP.hasPerm({ role: 'parent', permissions: 'ressources-complet' }, 'finance'), false);
});

function carte(locaux) {
  const r = {
    id: ID, titre: 'Leçon 1 — Le circuit', description: null, niveau: 'Sixième', discipline: 'Physique-Chimie',
    type: 'fichier', url: BLOB, mime: 'video/mp4', taille: 12 * 1048576, vues: 0, telechargements: 0, telechargementPayant: true,
  };
  return rendre('partials/banque-niveau.ejs', {
    n: { niveau: 'Sixième', total: 1, disciplines: [{ nom: 'Physique-Chimie', ressources: [r] }] }, groupe: 'niv', rangNiv: 1,
    chantDe: () => null, auteursDe: () => null, nombreFr: (x) => String(x || 0), paiement: { prix: 200, euros: '0,30 €' }, ...locaux,
  });
}

test('banque : carte payante en téléchargement direct pour un compte à accès complet', async () => {
  const libre = await carte({ accesComplet: true });
  assert.match(libre, new RegExp(`href="/ressources/${ID}/telecharger"[^>]*>⬇️ Télécharger <span class="ress-carte__taille">\\(12,0 Mo\\)`));
  assert.doesNotMatch(libre, /data-paiement=/, 'aucune invitation à payer');
  assert.doesNotMatch(libre, /200 FCFA/, 'aucun prix affiché');
  assert.doesNotMatch(libre, /déjà payé/);
  const ordinaire = await carte({});
  assert.match(ordinaire, /data-paiement=/, 'les autres visiteurs gardent le paiement');
  assert.match(ordinaire, /200 FCFA/);
});

test('leçon en chanson : quiz complet et clip téléchargeable pour un compte à accès complet', async () => {
  const chant = chants.toutes().find((c) => c.quiz.length >= 12);
  const html = await rendre('ressource-chant.ejs', {
    APP, chant, quiz: chant.quiz, acces: 'complet', accesComplet: true,
    mediaType: 'video', mediaUrl: BLOB, ressourceId: ID, ressourceTitre: 'Leçon test', telechargementPayant: true, clipPaye: false, attente: null,
    paiement: { prix: 200, euros: '0,30 €', delaiHeures: 12, validiteJours: 7, questionsEssai: 2, operateurs: [] },
    prefill: { nom: '', email: '' }, verrou: null, formatDate: String, v: () => 'test',
  });
  assert.match(html, /✅ Quiz complet : ton compte a un accès complet aux ressources/);
  assert.match(html, new RegExp(`href="/ressources/${ID}/telecharger"[^>]*data-stat="telechargement"[^>]*>⬇️ Télécharger le clip</a>`), 'téléchargement compté');
  assert.doesNotMatch(html, /data-paiement=/, 'aucune invitation à payer');
  assert.equal((html.match(/class="quiz-q"/g) || []).length, chant.quiz.length, 'toutes les questions de la leçon');
});

test('administration : le super admin accorde ou retire l’accès, les autres admins le voient seulement', async () => {
  const users = [
    { id: 'u1', name: 'LOE Grâce', email: 'loe@exemple.ci', role: 'parent', status: 'active', permissions: 'ressources-complet', createdAt: new Date() },
    { id: 'u2', name: 'KOUASSI Ama', email: 'ama@exemple.ci', role: 'parent', status: 'active', permissions: '', createdAt: new Date() },
  ];
  const locaux = (currentUser) => ({ APP, users, filters: { role: '', q: '' }, counts: { all: 2, parent: 2, coach: 0, admin: 0 }, currentUser, icon: () => '', countryGroups: [] });
  const superAdmin = await rendre('admin/users.ejs', locaux({ id: 'sa', isSuperAdmin: true, role: 'admin' }));
  assert.match(superAdmin, /action="\/admin\/user\/u1\/acces-ressources"[\s\S]*?name="accorder" value="0"[\s\S]*?📚 Accès complet aux ressources/, 'état voulu : retirer');
  assert.match(superAdmin, /action="\/admin\/user\/u2\/acces-ressources"[\s\S]*?name="accorder" value="1"[\s\S]*?📚 Accorder l’accès aux ressources/, 'état voulu : accorder');
  const admin = await rendre('admin/users.ejs', locaux({ id: 'a', isSuperAdmin: false, role: 'admin' }));
  assert.doesNotMatch(admin, /acces-ressources"/, 'pas de bouton pour un admin ordinaire');
  assert.equal((admin.match(/📚 Accès complet aux ressources/g) || []).length, 1, 'mention en lecture seule');
});
