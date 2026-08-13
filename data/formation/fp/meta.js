// Métadonnées du module « Statut général de la Fonction Publique » (loi 2023-892)
// Architecture pédagogique : Débutant → Intermédiaire → Avancé → Expert → Simulation Concours

const DOMAINE = {
  id: 'fonction-publique',
  label: 'Statut général de la Fonction Publique',
  court: 'Fonction Publique',
  icon: 'shield',
  couleur: '#B45309',
  base: 'Loi n° 2023-892 du 23 novembre 2023',
};

// Paliers pédagogiques. `difficultes` et `types` filtrent le tirage ;
// le tirage s'élargit automatiquement si la banque filtrée est trop petite.
const NIVEAUX_FP = [
  {
    id: 'debutant', label: 'Débutant', icone: '🌱',
    desc: 'Découvrir les règles une à une : vrai/faux, QCM simples, textes à trous.',
    difficultes: [1, 2], types: ['vrai_faux', 'qcm', 'trous'], nbDefaut: 10, mode: 'entrainement',
    conseil: 'Lisez d’abord le cours de la séquence, puis validez ≥ 80 % avant de passer au palier suivant.',
  },
  {
    id: 'intermediaire', label: 'Intermédiaire', icone: '📘',
    desc: 'Relier les règles entre elles : associations, articles à retrouver, QCM plus fins.',
    difficultes: [2, 3], types: ['qcm', 'trous', 'association', 'vrai_faux'], nbDefaut: 15, mode: 'entrainement',
    conseil: 'Objectif ≥ 80 % : les erreurs indiquent les articles à revoir dans le cours.',
  },
  {
    id: 'avance', label: 'Avancé', icone: '📙',
    desc: 'Déjouer les pièges : QCM multi-réponses, classements de procédures, formulations trompeuses.',
    difficultes: [3, 4], types: ['qcm', 'multi', 'classement', 'association'], nbDefaut: 15, mode: 'entrainement',
    conseil: 'Aux multi-réponses, la sélection doit être EXACTE : ni oubli, ni réponse en trop.',
  },
  {
    id: 'expert', label: 'Expert', icone: '🎓',
    desc: 'Raisonner comme au concours : cas pratiques administratifs, croisements d’articles, exceptions.',
    difficultes: [4, 5], types: ['cas', 'multi', 'qcm', 'classement', 'association'], nbDefaut: 20, mode: 'entrainement',
    conseil: 'Sur un cas pratique, identifiez d’abord L’ARTICLE applicable, puis la solution suit.',
  },
  {
    id: 'simulation', label: 'Simulation Concours', icone: '⏱️',
    desc: 'Conditions réelles : tirage sur toutes les séquences choisies, chronomètre strict, correction à la fin.',
    difficultes: [2, 3, 4, 5], types: ['qcm', 'vrai_faux', 'trous', 'multi', 'association', 'classement', 'cas'],
    nbDefaut: 30, mode: 'examen',
    conseil: 'Maîtrise visée : ≥ 90 % sur trois simulations consécutives, ≤ 45 s par question standard.',
  },
];

const TYPES_LABELS = {
  qcm: 'QCM', vrai_faux: 'Vrai / Faux', trous: 'Texte à trous', multi: 'QCM multi-réponses',
  association: 'Association', classement: 'Classement', cas: 'Cas pratique',
};

function niveauFP(id) { return NIVEAUX_FP.find((n) => n.id === id) || null; }

module.exports = { DOMAINE, NIVEAUX_FP, TYPES_LABELS, niveauFP };
