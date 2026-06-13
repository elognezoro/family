// Niveaux d'enseignement — système éducatif ivoirien

const cycles = [
  { id: 'prescolaire', label: 'Préscolaire' },
  { id: 'primaire', label: 'Primaire' },
  { id: 'secondaire1', label: 'Secondaire 1er cycle (Collège)' },
  { id: 'secondaire2_general', label: 'Secondaire 2nd cycle — Général (Lycée)' },
  { id: 'secondaire2_technique', label: 'Secondaire 2nd cycle — Technique' },
  { id: 'connaissances_generales', label: 'Connaissances générales (valable aussi pour les parents)' },
];

// Spécialités transversales « Connaissances générales » — utiles aussi bien aux
// élèves qu'aux parents (développement personnel, méthodes, numérique…).
// Source unique réutilisée comme niveaux (compétences) ET comme disciplines
// (voir data/disciplines.js) afin de garder libellés et liste synchronisés.
const connaissancesSpecialites = [
  { slug: 'dev_perso', domaine: 'Développement personnel', label: 'Développement personnel' },
  { slug: 'confiance', domaine: 'Développement personnel', label: 'Confiance en soi & estime de soi' },
  { slug: 'stress', domaine: 'Développement personnel', label: 'Gestion du stress & des émotions' },
  { slug: 'organisation', domaine: 'Développement personnel', label: 'Gestion du temps & organisation' },
  { slug: 'prise_parole', domaine: 'Développement personnel', label: 'Prise de parole en public' },
  { slug: 'methodo', domaine: 'Méthodes & réussite', label: "Méthodologie d'apprentissage" },
  { slug: 'memorisation', domaine: 'Méthodes & réussite', label: 'Techniques de mémorisation' },
  { slug: 'orientation', domaine: 'Méthodes & réussite', label: 'Orientation scolaire & professionnelle' },
  { slug: 'examens', domaine: 'Méthodes & réussite', label: 'Préparation aux examens & concours' },
  { slug: 'methodo_recherche', domaine: 'Méthodes & réussite', label: 'Méthodologie de recherche' },
  { slug: 'informatique', domaine: 'Numérique & bureautique', label: "Initiation à l'informatique" },
  { slug: 'bureautique', domaine: 'Numérique & bureautique', label: 'Bureautique (Word, Excel, PowerPoint)' },
  { slug: 'communication', domaine: 'Langues & communication', label: 'Communication & expression orale' },
  { slug: 'anglais_conv', domaine: 'Langues & communication', label: 'Anglais conversationnel' },
  { slug: 'alphabetisation', domaine: 'Langues & communication', label: 'Alphabétisation des adultes' },
  { slug: 'parentalite', domaine: 'Parentalité', label: 'Accompagnement à la parentalité' },
  { slug: 'aide_enfant', domaine: 'Parentalité', label: 'Aider son enfant à apprendre' },
  { slug: 'budget_familial', domaine: 'Finances & entrepreneuriat', label: 'Gestion du budget familial' },
  { slug: 'agr', domaine: 'Finances & entrepreneuriat', label: "Idées & développement d'activités génératrices de revenus (AGR)" },
  { slug: 'entrepreneuriat', domaine: 'Finances & entrepreneuriat', label: "Initiation à l'entrepreneuriat" },
  { slug: 'epargne', domaine: 'Finances & entrepreneuriat', label: 'Épargne & éducation financière' },
];

const niveaux = [
  { id: 'prescolaire', cycle: 'prescolaire', label: 'Préscolaire' },

  { id: 'cp1', cycle: 'primaire', label: 'CP1' },
  { id: 'cp2', cycle: 'primaire', label: 'CP2' },
  { id: 'ce1', cycle: 'primaire', label: 'CE1' },
  { id: 'ce2', cycle: 'primaire', label: 'CE2' },
  { id: 'cm1', cycle: 'primaire', label: 'CM1' },
  { id: 'cm2', cycle: 'primaire', label: 'CM2' },

  { id: '6e', cycle: 'secondaire1', label: '6ème' },
  { id: '5e', cycle: 'secondaire1', label: '5ème' },
  { id: '4e', cycle: 'secondaire1', label: '4ème' },
  { id: '3e', cycle: 'secondaire1', label: '3ème' },

  { id: '2nde', cycle: 'secondaire2_general', label: 'Seconde', series: ['A', 'C'] },
  { id: '1ere', cycle: 'secondaire2_general', label: 'Première', series: ['A', 'C', 'D'] },
  { id: 'tle', cycle: 'secondaire2_general', label: 'Terminale', series: ['A', 'C', 'D'] },

  { id: '2nde_tech', cycle: 'secondaire2_technique', label: 'Seconde technique', series: ['G1', 'G2', 'F'] },
  { id: '1ere_tech', cycle: 'secondaire2_technique', label: 'Première technique', series: ['G1', 'G2', 'F'] },
  { id: 'tle_tech', cycle: 'secondaire2_technique', label: 'Terminale technique', series: ['G1', 'G2', 'F'] },

  // Connaissances générales (transversal) — chaque spécialité est un « niveau » sélectionnable.
  ...connaissancesSpecialites.map((s) => ({ id: 'cg_' + s.slug, cycle: 'connaissances_generales', label: s.label })),
];

function niveauxByCycle(cycleId) {
  return niveaux.filter((n) => n.cycle === cycleId);
}

function getNiveau(id) {
  return niveaux.find((n) => n.id === id);
}

function niveauLabel(id) {
  const n = getNiveau(id);
  return n ? n.label : id;
}

function cycleLabel(id) {
  const c = cycles.find((c) => c.id === id);
  return c ? c.label : id;
}

// Regroupe les niveaux par cycle (pour les accordéons)
function niveauxGrouped() {
  return cycles
    .map((c) => ({ ...c, niveaux: niveauxByCycle(c.id) }))
    .filter((g) => g.niveaux.length > 0);
}

module.exports = {
  cycles,
  niveaux,
  connaissancesSpecialites,
  niveauxByCycle,
  getNiveau,
  niveauLabel,
  cycleLabel,
  niveauxGrouped,
};
