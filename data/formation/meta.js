// EduWeb Formation — métadonnées des tests psychotechniques
// Catégories, niveaux et réglages communs (banque de questions dans ./questions/)

const CATEGORIES = [
  {
    id: 'logique',
    label: 'Raisonnement logique',
    icon: 'award',
    couleur: '#7C5CFC',
    desc: 'Suites de nombres et de lettres, analogies, intrus, dominos, matrices.',
  },
  {
    id: 'calcul',
    label: 'Aptitude numérique',
    icon: 'cash',
    couleur: '#0FA968',
    desc: 'Calcul mental, problèmes concrets, pourcentages, conversions, partages.',
  },
  {
    id: 'verbal',
    label: 'Aptitude verbale',
    icon: 'book',
    couleur: '#E8590C',
    desc: 'Synonymes, antonymes, analogies de mots, orthographe, conjugaison.',
  },
  {
    id: 'attention',
    label: 'Attention et précision',
    icon: 'eye',
    couleur: '#1C7ED6',
    desc: 'Comparaison de chaînes, comptage de symboles, codes, repérage d’erreurs.',
  },
  {
    id: 'organisation',
    label: 'Organisation et déduction',
    icon: 'settings',
    couleur: '#C2255C',
    desc: 'Logigrammes, classements, calendriers, ordonnancement de tâches.',
  },
  {
    id: 'memoire',
    label: 'Mémoire',
    icon: 'star',
    couleur: '#F08C00',
    desc: 'Mémorisation de mots, de chiffres et de fiches, puis restitution.',
  },
];

const NIVEAUX = [
  {
    id: 'prebepc',
    label: 'Avant le BEPC',
    sousTitre: 'Niveau CEPE à 5e',
    desc: 'Concours de base : agents, auxiliaires, préposés…',
  },
  {
    id: 'bepc',
    label: 'BEPC',
    sousTitre: 'Niveau 3e',
    desc: 'Concours d’instituteurs adjoints, de personnel de santé (IDE/SF préparatoires), agents administratifs…',
  },
  {
    id: 'superieur',
    label: 'BAC et plus',
    sousTitre: 'Concours administratifs A / B',
    desc: 'Concours de la fonction publique de catégories supérieures.',
  },
];

// Réglages des sessions de test
const REGLAGES = {
  nbQuestionsChoix: [10, 20, 30], // tailles de test proposées
  nbQuestionsDefaut: 20,
  // Modes : entrainement = sans chrono, correction immédiate ;
  //         examen = chronométré, correction à la fin (conditions de concours).
  modes: [
    { id: 'entrainement', label: 'Entraînement', desc: 'Sans chronomètre. La correction s’affiche après chaque question.' },
    { id: 'examen', label: 'Conditions de concours', desc: 'Chronométré. La correction s’affiche à la fin, comme au concours.' },
  ],
};

function categorie(id) { return CATEGORIES.find((c) => c.id === id) || null; }
function niveau(id) { return NIVEAUX.find((n) => n.id === id) || null; }

module.exports = { CATEGORIES, NIVEAUX, REGLAGES, categorie, niveau };
