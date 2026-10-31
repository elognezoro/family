// Protection du super-administrateur dans /admin/users : un admin ordinaire (permission
// « users ») ne change pas son rôle, ne le suspend pas, ne le supprime pas, ni à l'unité
// ni par lot ; le super admin le peut sur un autre super admin, sans jamais retirer le
// dernier super admin en fonction. Routes testées sur une base factice (aucun accès Neon).
// Exécution : npm test
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const ejs = require('ejs');
const express = require('express');

// ─── Base factice : seuls les comptes sont tenus, les autres tables ne font rien ───
let comptes = new Map();
const correspond = (u, where = {}) => Object.entries(where).every(([k, v]) => {
  if (v && typeof v === 'object' && 'in' in v) return v.in.includes(u[k]);
  if (v && typeof v === 'object' && 'notIn' in v) return !v.notIn.includes(u[k]);
  return u[k] === v;
});
const parmi = (where) => [...comptes.values()].filter((u) => correspond(u, where));
const user = {
  findUnique: async ({ where }) => (comptes.has(where.id) ? { ...comptes.get(where.id), coachProfile: null, families: [] } : null),
  findMany: async ({ where }) => parmi(where).map((u) => ({ ...u })),
  count: async ({ where }) => parmi(where).length,
  update: async ({ where, data }) => Object.assign(comptes.get(where.id), data),
  updateMany: async ({ where, data }) => { const c = parmi(where); c.forEach((u) => Object.assign(u, data)); return { count: c.length }; },
  delete: async ({ where }) => comptes.delete(where.id),
};
const neutre = new Proxy({}, { get: (t, m) => async () => (m === 'findMany' ? [] : m === 'count' ? 0 : null) });
const base = new Proxy({ user, $transaction: async (fn) => fn(base) }, { get: (t, k) => t[k] || neutre });

// Prisma et le service de taux de change (chargé dès config/app) sont remplacés avant
// tout chargement : ni base de production, ni appel réseau
const stub = (mod, exports) => {
  const f = require.resolve(mod);
  require.cache[f] = { id: f, filename: f, loaded: true, exports };
};
stub('../data/prisma-store', base);
stub('../services/fxrates', { meta: () => ({}), getRate: () => 1, ensureFresh: () => {} });
const APP = require('../config/app');
const garde = require('../services/garde-super-admin');

const SA = { id: 'sa', name: 'ZORO Élogne', email: 'sa@exemple.ci', role: 'admin', status: 'active', isSuperAdmin: true, permissions: '' };
const SA2 = { id: 'sa2', name: 'KONAN Aya', email: 'sa2@exemple.ci', role: 'admin', status: 'active', isSuperAdmin: true, permissions: '' };
const ADM = { id: 'adm', name: 'YAO Koffi', email: 'adm@exemple.ci', role: 'admin', status: 'active', isSuperAdmin: false, permissions: 'users' };
const PAR = { id: 'par', name: 'KOUASSI Ama', email: 'ama@exemple.ci', role: 'parent', status: 'active', isSuperAdmin: false, permissions: '' };
const session = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, isSuperAdmin: u.isSuperAdmin, permissions: u.permissions });

let acteur = null;
let serveur = null;
let racine = '';

before(async () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use((req, res, next) => { req.session = { user: acteur }; next(); });
  app.use('/admin', require('../routes/admin'));
  await new Promise((ok) => { serveur = app.listen(0, '127.0.0.1', ok); });
  racine = `http://127.0.0.1:${serveur.address().port}`;
});
after(() => serveur && serveur.close());
beforeEach(() => { comptes = new Map([SA, SA2, ADM, PAR].map((u) => [u.id, { ...u }])); });

// Poste un formulaire en tant que `qui` et renvoie le message flash de la redirection
async function poster(qui, chemin, champs) {
  acteur = session(qui);
  const corps = new URLSearchParams();
  Object.entries(champs || {}).forEach(([k, v]) => [].concat(v).forEach((x) => corps.append(k, x)));
  const r = await fetch(racine + chemin, { method: 'POST', body: corps, redirect: 'manual' });
  assert.equal(r.status, 302, `${chemin} : redirection attendue`);
  const loc = new URL(r.headers.get('location'), racine);
  return { type: loc.searchParams.get('mt'), message: loc.searchParams.get('mm') };
}

test('règle : seul un super admin agit sur un super admin, jamais au point de n’en laisser aucun', async () => {
  assert.equal(garde.peutAgirSur(ADM, SA), false);
  assert.equal(garde.peutAgirSur(ADM, PAR), true);
  assert.equal(garde.peutAgirSur(SA, SA2), true);
  assert.equal(garde.peutAgirSur(null, SA), false);
  assert.equal(garde.enFonction(SA), true);
  assert.equal(garde.enFonction({ ...SA, status: 'suspended' }), false);
  assert.equal(garde.enFonction({ ...SA, role: 'parent' }), false);
  assert.equal(garde.enFonction(ADM), false);

  let compte = null;
  const p = { user: { count: async ({ where }) => { compte = where; return 0; } } };
  assert.equal(await garde.refus(p, ADM, [PAR], { retire: true }), null, 'compte ordinaire : rien à vérifier');
  assert.equal(compte, null, 'aucune requête inutile');
  assert.equal(await garde.refus(p, ADM, [SA], { retire: false }), garde.REFUS_ADMIN, 'même une action sans perte d’accès');
  assert.equal(await garde.refus(p, SA, [SA2], { retire: false }), null, 'sans perte d’accès, pas de décompte');
  assert.equal(compte, null);
  assert.equal(await garde.refus(p, SA, [SA2], { retire: true }), garde.REFUS_DERNIER, 'aucun autre super admin en fonction');
  assert.deepEqual(compte, { isSuperAdmin: true, role: 'admin', status: 'active', id: { notIn: ['sa2'] } });
  const p1 = { user: { count: async () => 1 } };
  assert.equal(await garde.refus(p1, SA, [SA2], { retire: true }), null);
  // Un super admin déjà hors fonction (suspendu) peut être supprimé sans décompte
  assert.equal(await garde.refus(p, SA, [{ ...SA2, status: 'suspended' }], { retire: true }), null);
});

test('admin ordinaire : rôle, suspension et suppression du super admin refusés', async () => {
  for (const role of ['parent', 'coach', 'commercial', 'candidat', 'admin']) {
    assert.deepEqual(await poster(ADM, '/admin/user/sa/role', { role }), { type: 'error', message: garde.REFUS_ADMIN });
  }
  assert.deepEqual(await poster(ADM, '/admin/user/sa/toggle', {}), { type: 'error', message: garde.REFUS_ADMIN });
  assert.deepEqual(await poster(ADM, '/admin/user/sa/delete', {}), { type: 'error', message: garde.REFUS_ADMIN });
  assert.deepEqual(comptes.get('sa'), SA, 'compte super admin intact');
  // Réactiver un super admin suspendu n'est pas non plus de son ressort
  comptes.get('sa2').status = 'suspended';
  assert.deepEqual(await poster(ADM, '/admin/user/sa2/toggle', {}), { type: 'error', message: garde.REFUS_ADMIN });
  assert.equal(comptes.get('sa2').status, 'suspended');
});

test('admin ordinaire : les comptes ordinaires restent gérables', async () => {
  assert.equal((await poster(ADM, '/admin/user/par/role', { role: 'coach' })).type, 'success');
  assert.equal(comptes.get('par').role, 'coach');
  assert.equal((await poster(ADM, '/admin/user/par/toggle', {})).type, 'success');
  assert.equal(comptes.get('par').status, 'suspended');
  assert.equal((await poster(ADM, '/admin/user/par/delete', {})).type, 'success');
  assert.equal(comptes.has('par'), false);
});

test('admin ordinaire : les super admins sont écartés des actions par lot', async () => {
  const r = await poster(ADM, '/admin/users/bulk', { action: 'suspend', ids: ['sa', 'par', 'sa2'] });
  assert.deepEqual(r, { type: 'success', message: '1 compte(s) suspendu(s). 2 compte(s) super-administrateur écarté(s).' });
  assert.equal(comptes.get('par').status, 'suspended');
  assert.equal(comptes.get('sa').status, 'active');
  assert.equal(comptes.get('sa2').status, 'active');
  assert.deepEqual(await poster(ADM, '/admin/users/bulk', { action: 'delete', ids: ['sa', 'sa2'] }), { type: 'error', message: garde.REFUS_ADMIN });
  assert.ok(comptes.has('sa') && comptes.has('sa2'));
  const d = await poster(ADM, '/admin/users/bulk', { action: 'delete', ids: ['sa', 'par'] });
  assert.equal(d.message, '1 compte(s) supprimé(s). 1 compte(s) super-administrateur écarté(s).');
  assert.ok(comptes.has('sa') && !comptes.has('par'));
});

test('super admin : agit sur un autre super admin, jamais sur lui-même', async () => {
  assert.equal((await poster(SA, '/admin/user/sa2/toggle', {})).type, 'success');
  assert.equal(comptes.get('sa2').status, 'suspended');
  assert.equal((await poster(SA, '/admin/user/sa2/toggle', {})).type, 'success');
  assert.equal(comptes.get('sa2').status, 'active');
  assert.equal((await poster(SA, '/admin/user/sa2/role', { role: 'parent' })).type, 'success');
  assert.equal(comptes.get('sa2').role, 'parent');
  assert.equal((await poster(SA, '/admin/users/bulk', { action: 'suspend', ids: ['sa2', 'par'] })).message, '2 compte(s) suspendu(s).');
  assert.equal((await poster(SA, '/admin/user/sa2/delete', {})).type, 'success');
  assert.equal(comptes.has('sa2'), false);
  // Soi-même : refus (le dernier super admin ne se retire pas)
  assert.equal((await poster(SA, '/admin/user/sa/role', { role: 'parent' })).message, 'Vous ne pouvez pas modifier votre propre rôle.');
  assert.equal((await poster(SA, '/admin/user/sa/toggle', {})).message, 'Vous ne pouvez pas suspendre votre propre compte.');
  assert.equal((await poster(SA, '/admin/user/sa/delete', {})).message, 'Vous ne pouvez pas supprimer votre propre compte.');
  assert.equal((await poster(SA, '/admin/users/bulk', { action: 'delete', ids: ['sa'] })).message, 'Aucun utilisateur sélectionné.');
  assert.deepEqual(comptes.get('sa'), SA);
});

test('super admin : le dernier super admin en fonction ne peut pas être retiré (session périmée)', async () => {
  // La session se dit encore super admin alors que la base ne la tient plus pour telle
  // (rafraîchissement de session en échec) : sa2 est alors le seul super admin en fonction
  comptes.get('sa').isSuperAdmin = false;
  for (const [chemin, champs] of [
    ['/admin/user/sa2/role', { role: 'parent' }],
    ['/admin/user/sa2/toggle', {}],
    ['/admin/user/sa2/delete', {}],
    ['/admin/users/bulk', { action: 'suspend', ids: ['sa2'] }],
    ['/admin/users/bulk', { action: 'delete', ids: ['sa2', 'par'] }],
  ]) {
    assert.deepEqual(await poster(SA, chemin, champs), { type: 'error', message: garde.REFUS_DERNIER }, chemin);
  }
  assert.deepEqual(comptes.get('sa2'), SA2);
  assert.ok(comptes.has('par'), 'le lot entier est refusé');
  // Sans perte d'accès (rôle admin conservé, réactivation par lot), l'action reste permise
  assert.equal((await poster(SA, '/admin/user/sa2/role', { role: 'admin' })).type, 'success');
  assert.equal((await poster(SA, '/admin/users/bulk', { action: 'activate', ids: ['sa2'] })).type, 'success');
});

// ─── Vue : boutons masqués ou désactivés pour un admin ordinaire ───
const rendre = (currentUser, users) => new Promise((ok, ko) => ejs.renderFile(
  path.join(__dirname, '..', 'views', 'admin', 'users.ejs'),
  { APP, users, filters: { role: '', q: '' }, counts: { all: users.length, parent: 1, coach: 0, admin: 3 }, currentUser, icon: () => '', countryGroups: [] },
  (e, h) => (e ? ko(e) : ok(h)),
));
const ligne = (html, u) => html.split('<tr>').find((l) => l.includes(u.email));
const liste = [SA, SA2, ADM, PAR].map((u) => ({ ...u, createdAt: new Date() }));

test('vue : un admin ordinaire n’a aucune commande sur un compte super admin', async () => {
  const html = await rendre(session(ADM), liste);
  for (const u of [SA, SA2]) {
    const l = ligne(html, u);
    assert.match(l, /Super-admin<\/span>/, 'compte signalé');
    assert.doesNotMatch(l, /class="bulk-check"/, 'pas de case de sélection');
    assert.match(l, /<select name="role"[^>]*disabled/, 'rôle verrouillé');
    assert.match(l, /<button class="badge badge--ok"[^>]*disabled[^>]*title="Compte super-administrateur : non modifiable"/, 'statut verrouillé');
    assert.doesNotMatch(l, /\/delete"/, 'pas de bouton de suppression');
  }
  const l = ligne(html, PAR);
  assert.doesNotMatch(l, /Super-admin/);
  assert.match(l, /class="bulk-check"/);
  assert.doesNotMatch(l, /disabled/);
  assert.match(l, /action="\/admin\/user\/par\/delete"/);
});

test('vue : le super admin garde ses commandes sur un autre super admin, pas sur lui-même', async () => {
  const html = await rendre(session(SA), liste);
  const autre = ligne(html, SA2);
  assert.match(autre, /Super-admin<\/span>/);
  assert.match(autre, /class="bulk-check"/);
  assert.doesNotMatch(autre, /disabled/);
  assert.match(autre, /action="\/admin\/user\/sa2\/delete"/);
  const soi = ligne(html, SA);
  assert.doesNotMatch(soi, /class="bulk-check"/);
  assert.match(soi, /<select name="role"[^>]*disabled/);
  assert.doesNotMatch(soi, /\/delete"/);
});
