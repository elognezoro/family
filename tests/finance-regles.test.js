// Tests des règles financières pures (node:test — natif, zéro dépendance)
// Exécution : npm test
const { test } = require('node:test');
const assert = require('node:assert/strict');
const F = require('../services/finance/regles');

const P = F.POLICY_DEFAUT; // 10 000 / 10 % / 10 % / 3 places / plancher 3 000

// ═══ §4 — Les trois premiers filleuls ═══
test('§4 filleuls 1 à 3 : réduction 1 000, paiement 9 000, rétrocession 1 000', () => {
  for (const rang of [1, 2, 3]) {
    assert.equal(F.reductionFilleul(P, rang), 1000);
    assert.equal(F.prixFilleul(P, rang), 9000);
  }
  assert.equal(F.retrocessionTheorique(P), 1000);
  // Après 3 filleuls : encaissements 27 000, rétrocessions 3 000, revenu 24 000
  const encaissements = 3 * F.prixFilleul(P, 1);
  assert.equal(encaissements, 27000);
  assert.equal(encaissements - 3 * 1000, 24000);
});

// ═══ §5 — Quatrième filleul et suivants ═══
test('§5 filleul 4+ : aucune réduction, paiement 10 000, rétrocession 1 000 maintenue', () => {
  assert.equal(F.reductionFilleul(P, 4), 0);
  assert.equal(F.reductionFilleul(P, null), 0);
  assert.equal(F.prixFilleul(P, 4), 10000);
  assert.equal(F.retrocessionAccordee(P, 10000, 3000), 1000); // le parrain continue de percevoir
});

// ═══ §6-§7 — Plancher personnel : Rmax = MAX(0, A − M) ═══
test('§7 cas A : parrain ayant payé 10 000 → capacité totale 7 000', () => {
  assert.equal(F.capaciteRestante(10000, P, 0), 7000);
  assert.equal(F.coutEconomiqueNet(10000, 7000), 3000);
  assert.ok(F.plafondAtteint(10000, P, 7000));
  assert.equal(F.retrocessionAccordee(P, 10000, 7000), 0);
});

test('§7 cas B : parrain ayant payé 9 000 → capacité totale 6 000', () => {
  assert.equal(F.capaciteRestante(9000, P, 0), 6000);
  assert.equal(F.coutEconomiqueNet(9000, 6000), 3000);
  assert.equal(F.retrocessionAccordee(P, 9000, 6000), 0);
});

test('§7 le plafond dépend du montant payé, jamais d’un nombre fixe de filleuls', () => {
  // Un parrain qui aurait payé 5 000 (formule moins chère) : capacité 2 000 → 2 filleuls
  assert.equal(F.capaciteRestante(5000, P, 0), 2000);
  // Un parrain qui aurait payé 3 000 : capacité 0 d'emblée
  assert.equal(F.capaciteRestante(3000, P, 0), 0);
  // Payé moins que le plancher : jamais négatif
  assert.equal(F.capaciteRestante(2000, P, 0), 0);
});

// ═══ §8 — Dernière rétrocession partielle ═══
test('§8 exemple exact : payé 10 000, acquis 6 500 → rétrocession 500 (pas 1 000)', () => {
  assert.equal(F.capaciteRestante(10000, P, 6500), 500);
  assert.equal(F.retrocessionAccordee(P, 10000, 6500), 500);
});

// ═══ §36 — Test financier de référence : parrain payé 10 000, 7 filleuls ═══
test('§36 parrain 10 000 + 7 filleuls : encaissements 67 000, rétrocessions 7 000, RAR 60 000, coût net 3 000', () => {
  let acquis = 0;
  const encaissements = [];
  for (let n = 1; n <= 7; n++) {
    const rang = n <= 3 ? n : null; // 3 places promo puis plein tarif
    encaissements.push(F.prixFilleul(P, rang));
    acquis += F.retrocessionAccordee(P, 10000, acquis);
  }
  assert.deepEqual(encaissements, [9000, 9000, 9000, 10000, 10000, 10000, 10000]);
  const total = encaissements.reduce((a, b) => a + b, 0);
  assert.equal(total, 67000);
  assert.equal(acquis, 7000);
  assert.equal(total - acquis, 60000); // RAR associé aux 7 acquisitions
  assert.equal(F.coutEconomiqueNet(10000, acquis), 3000);
  // 8e filleul : plus rien
  assert.equal(F.retrocessionAccordee(P, 10000, acquis), 0);
});

// ═══ §37 — Second test de référence : parrain payé 9 000 ═══
test('§37 parrain 9 000 : 6 rétrocessions de 1 000 puis 0', () => {
  let acquis = 0;
  const percues = [];
  for (let n = 1; n <= 7; n++) {
    const r = F.retrocessionAccordee(P, 9000, acquis);
    percues.push(r);
    acquis += r;
  }
  assert.deepEqual(percues, [1000, 1000, 1000, 1000, 1000, 1000, 0]);
  assert.equal(F.coutEconomiqueNet(9000, acquis), 3000);
});

// ═══ §21-§22 — RAR ═══
test('§21 RAR = CA facial − réductions − rétrocessions = encaissements − rétrocessions', () => {
  const r1 = F.rar({ caFacial: 100000, reductionsAccordees: 4000, retrocessionsAcquises: 7000 });
  assert.equal(r1, 89000);
  assert.equal(F.rarMoyen(r1, 10), 8900);
  assert.equal(F.rarMoyen(0, 0), 0); // pas de division par zéro
});

test('§22 statut RAR : vert / orange / rouge configurables', () => {
  assert.equal(F.statutRar(8600, 8500), 'vert');
  assert.equal(F.statutRar(8500, 8500), 'vert');
  assert.equal(F.statutRar(8200, 8500), 'orange'); // ≥ 95 % de la cible
  assert.equal(F.statutRar(7000, 8500), 'rouge');
  assert.equal(F.statutRar(8300, 8500, { seuilOrangePct: 99 }), 'rouge'); // seuil administrable
});

// ═══ §23 — Marge contributive ═══
test('§23 marge contributive = RAR − frais − commissions − coûts variables', () => {
  assert.equal(F.margeContributive(89000000, { fraisPaiement: 1920000, coutsVariables: 20000000 }), 67080000);
  assert.equal(F.margeContributiveMoyenne(67080000, 10000), 6708);
});

// ═══ §24 — Referral CAC ═══
test('§24 CAC : 2 000 pour un filleul promo, 1 000 ensuite, 0 après plafond', () => {
  assert.equal(F.referralCAC({ reduction: 1000, retrocession: 1000 }), 2000);
  assert.equal(F.referralCAC({ reduction: 0, retrocession: 1000 }), 1000);
  assert.equal(F.referralCAC({ reduction: 0, retrocession: 0 }), 0);
});

// ═══ §25 — Coefficient K ═══
test('§25 K = proportion de parrains × moyenne de filleuls payants', () => {
  assert.equal(F.coefficientK(0.4, 2.5), 1);
  assert.ok(F.coefficientK(0.2, 2) < 1);
  assert.ok(F.coefficientK(0.5, 3) > 1);
});

// ═══ §27-§28 — Scénario de référence 10 000 abonnés ═══
test('§27 scénario 10 000 abonnés : CA 100 M, encaissements 96 M, RAR 89 M, RAR moyen 8 900', () => {
  const s = F.simuler(F.SCENARIO_10000);
  assert.equal(s.caFacial, 100000000);
  assert.equal(s.reductions, 4000000);
  assert.equal(s.encaissements, 96000000);
  assert.equal(s.retrocessions, 7000000);
  assert.equal(s.rar, 89000000);
  assert.equal(s.rarMoyen, 8900);
  assert.equal(Math.round(s.tauxConservation), 89);
  // §28 : frais de paiement 2 % = 1 920 000 ; résultat contributif ≈ 67 080 000
  assert.equal(s.fraisPaiement, 1920000);
  assert.equal(s.resultatContributif, 67080000);
});

// ═══ Politique administrable (§2) : rien n'est codé en dur ═══
test('§2 les règles suivent la politique, pas des constantes', () => {
  const autre = { ...F.POLICY_DEFAUT, basePrice: 20000, discountRate: 5, commissionRate: 15, minimumNetCost: 5000, discountedReferralsLimit: 2 };
  assert.equal(F.reductionFilleul(autre, 1), 1000); // 5 % de 20 000
  assert.equal(F.reductionFilleul(autre, 3), 0); // limite 2 places
  assert.equal(F.retrocessionTheorique(autre), 3000); // 15 % de 20 000
  assert.equal(F.capaciteRestante(20000, autre, 0), 15000);
});
