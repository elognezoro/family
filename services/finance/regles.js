// EduWeb — Règles financières PURES du moteur d'abonnement/parrainage.
//
// Aucune dépendance, aucun accès base : uniquement des fonctions déterministes,
// testées isolément (tests/finance-regles.test.js) AVANT toute intégration.
// Tous les montants sont des ENTIERS en FCFA (XOF) ; les taux sont des
// pourcentages entiers (10 = 10 %) — même convention que PromoCode.pct.
//
// Politique commerciale (policy) attendue :
// { basePrice, discountRate, commissionRate, discountedReferralsLimit,
//   minimumNetCost, referralDepth }
// Les valeurs par défaut de la spécification :
const POLICY_DEFAUT = {
  basePrice: 10000, // subscription_base_price
  discountRate: 10, // first_referrals_discount_rate (%)
  commissionRate: 10, // referrer_commission_rate (%)
  discountedReferralsLimit: 3, // places promotionnelles
  minimumNetCost: 3000, // plancher du coût économique net
  referralDepth: 1, // strictement direct
  devise: 'XOF',
};

const arrondi = (n) => Math.round(n);

// ─── Réductions (diminuent ce que PAIE le filleul — pas un mouvement d'argent) ───

// Réduction du filleul selon son rang promotionnel (1..limit → réduction ; sinon 0)
function reductionFilleul(policy, rangSlot) {
  if (!Number.isInteger(rangSlot) || rangSlot < 1 || rangSlot > policy.discountedReferralsLimit) return 0;
  return arrondi((policy.basePrice * policy.discountRate) / 100);
}

// Prix payé par le filleul pour son abonnement (base − réduction parrainage)
function prixFilleul(policy, rangSlot) {
  return policy.basePrice - reductionFilleul(policy, rangSlot);
}

// ─── Rétrocessions (argent RÉEL dû au parrain) ───

// Rétrocession théorique par filleul direct payant : commissionRate % du tarif
// facial — identique que le filleul ait payé 9 000 ou 10 000 (§1, §5).
function retrocessionTheorique(policy) {
  return arrondi((policy.basePrice * policy.commissionRate) / 100);
}

// Capacité restante de rétrocession du parrain (§6-§7) :
// Rmax = MAX(0, A − M − déjà acquis), où A = montant réellement payé PAR LE PARRAIN.
// JAMAIS un nombre fixe de filleuls : tout découle du montant payé (§7).
function capaciteRestante(montantPayeParrain, policy, retrocessionsDejaAcquises) {
  return Math.max(0, montantPayeParrain - policy.minimumNetCost - retrocessionsDejaAcquises);
}

// Rétrocession effectivement accordée (§8 — dernière rétrocession partielle) :
// commission_to_grant = MIN(théorique, capacité restante)
function retrocessionAccordee(policy, montantPayeParrain, retrocessionsDejaAcquises) {
  const theorique = retrocessionTheorique(policy);
  const capacite = capaciteRestante(montantPayeParrain, policy, retrocessionsDejaAcquises);
  return Math.min(theorique, capacite);
}

// Coût économique net du parrain pour la période : A − R (contraint ≥ plancher par construction)
function coutEconomiqueNet(montantPaye, retrocessionsAcquises) {
  return montantPaye - retrocessionsAcquises;
}

// Le plafond personnel est-il atteint ? (plus aucune rétrocession possible)
function plafondAtteint(montantPayeParrain, policy, retrocessionsDejaAcquises) {
  return capaciteRestante(montantPayeParrain, policy, retrocessionsDejaAcquises) <= 0;
}

// ─── Indicateurs de pilotage ───

// §21 — RAR : Revenu Après Réductions et Rétrocessions
// RAR = CA facial − réductions accordées − rétrocessions acquises
//     = encaissements réels − rétrocessions acquises
function rar({ caFacial, reductionsAccordees, retrocessionsAcquises }) {
  return caFacial - reductionsAccordees - retrocessionsAcquises;
}
function rarMoyen(rarTotal, nbAbonnesPayants) {
  return nbAbonnesPayants > 0 ? rarTotal / nbAbonnesPayants : 0;
}

// §22 — statut du RAR moyen vs cible (seuils configurables, en % de la cible)
function statutRar(rarMoyenActuel, cible, { seuilOrangePct = 95 } = {}) {
  if (cible <= 0) return 'vert';
  if (rarMoyenActuel >= cible) return 'vert';
  if (rarMoyenActuel >= (cible * seuilOrangePct) / 100) return 'orange';
  return 'rouge';
}

// §23 — Marge contributive (PAS un bénéfice net)
function margeContributive(rarTotal, { fraisPaiement = 0, commissionsExternes = 0, coutsVariables = 0 } = {}) {
  return rarTotal - fraisPaiement - commissionsExternes - coutsVariables;
}
function margeContributiveMoyenne(marge, nbAbonnesPayants) {
  return nbAbonnesPayants > 0 ? marge / nbAbonnesPayants : 0;
}

// §24 — Coût d'acquisition par parrainage d'UN filleul
// = réduction accordée à ce filleul + rétrocession accordée au parrain + frais variables
function referralCAC({ reduction = 0, retrocession = 0, fraisVariables = 0 } = {}) {
  return reduction + retrocession + fraisVariables;
}

// §25 — Coefficient de viralité (analytique, pas une garantie)
// K = proportion d'utilisateurs qui parrainent × nb moyen de filleuls payants par parrain
function coefficientK(proportionParrains, moyenneFilleulsPayants) {
  return proportionParrains * moyenneFilleulsPayants;
}

// ─── Simulation (§26-§28) — agrégat pur, réutilisé par le simulateur admin ───
// params : { nbAbonnes, prixFacial, pctIssusParrainage, tauxReduction, nbFilleulsReduits,
//            tauxRetrocession, plancher, retrocessionsEstimees?, fraisPaiementPct,
//            commissionsExternes, coutsVariables, chargesFixes }
function simuler(params) {
  const p = params;
  const caFacial = p.nbAbonnes * p.prixFacial;
  const reduction = arrondi((p.prixFacial * p.tauxReduction) / 100);
  const reductions = p.nbFilleulsReduits * reduction;
  const encaissements = caFacial - reductions;
  // Rétrocessions : soit fournies (scénario précis), soit théorique = filleuls issus
  // du parrainage × rétrocession unitaire (borne haute, avant plafonds personnels)
  const nbIssusParrainage = arrondi((p.nbAbonnes * p.pctIssusParrainage) / 100);
  const retroUnitaire = arrondi((p.prixFacial * p.tauxRetrocession) / 100);
  const retrocessions = p.retrocessionsEstimees != null
    ? p.retrocessionsEstimees
    : nbIssusParrainage * retroUnitaire;
  const rarTotal = encaissements - retrocessions;
  const fraisPaiement = arrondi((encaissements * (p.fraisPaiementPct || 0)) / 100);
  const marge = margeContributive(rarTotal, {
    fraisPaiement,
    commissionsExternes: p.commissionsExternes || 0,
    coutsVariables: p.coutsVariables || 0,
  });
  const resultatContributif = marge - (p.chargesFixes || 0);
  return {
    caFacial,
    reductions,
    encaissements,
    nbIssusParrainage,
    retrocessions,
    rar: rarTotal,
    rarMoyen: rarMoyen(rarTotal, p.nbAbonnes),
    fraisPaiement,
    margeContributive: marge,
    margeContributiveMoyenne: margeContributiveMoyenne(marge, p.nbAbonnes),
    resultatContributif,
    tauxConservation: caFacial > 0 ? (rarTotal / caFacial) * 100 : 0,
  };
}

// Scénario de référence §27 — 10 000 abonnés (préconfiguré, modifiable)
const SCENARIO_10000 = {
  nom: 'Référence — 10 000 abonnés',
  nbAbonnes: 10000,
  prixFacial: 10000,
  pctIssusParrainage: 70, // 7 000 issus du parrainage
  tauxReduction: 10,
  nbFilleulsReduits: 4000,
  tauxRetrocession: 10,
  plancher: 3000,
  retrocessionsEstimees: 7000000, // borne haute prudente (§27)
  fraisPaiementPct: 2,
  commissionsExternes: 0,
  coutsVariables: 0,
  chargesFixes: 20000000,
};

module.exports = {
  POLICY_DEFAUT,
  SCENARIO_10000,
  reductionFilleul,
  prixFilleul,
  retrocessionTheorique,
  capaciteRestante,
  retrocessionAccordee,
  coutEconomiqueNet,
  plafondAtteint,
  rar,
  rarMoyen,
  statutRar,
  margeContributive,
  margeContributiveMoyenne,
  referralCAC,
  coefficientK,
  simuler,
};
