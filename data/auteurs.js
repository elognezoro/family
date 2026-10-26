// Auteurs des ressources de la banque, par discipline (et, au besoin, par
// niveau). Affichés dans l'accordéon « Auteurs » en tête de chaque tuile de
// discipline, sous chaque niveau. La clé '*' vaut pour tous les niveaux.
// CONTRIBUTIONS_CHANTS : crédits affichés sur la page des chansons d'un domaine
// précis (ex. les chansons d'Histoire d'Éveil au milieu), quand un contributeur
// ne porte pas sur toute la discipline.
const AUTEURS = {
  'Physique-Chimie': {
    '*': {
      titre: 'Contributeurs — Conception, montage, synchronisation et contrôle scientifique',
      liste: [
        'Dr ZORO Elogne Guessan, MCf',
        'Dr KOUAKOU Lébé Prisca Marie-Sandrine Epse AKRE, MCf',
        'Dr MEITÉ Namory, MA',
        'Dr KOUAME Niamien Alfred, MA',
        'Dr Kouadio Aya Nelly Berthe épouse KOUADIO, MA',
        'Dr ALAO Latifatou Laye Epse ADOMON, Assistante',
        'Monsieur YEBOUN Dogbo François, Inspecteur en Chef, option Physique-Chimie, professeur au Lycée Moderne d’Alépé',
        'Monsieur KOUADIO Yao Antoine, Professeur de lycée, au lycée moderne Amon Tanoh Lambert Aboisso',
        'ETTIEN Kessé Kouao François Donatien, Professeur de lycée, au lycée moderne de garçons Gnaléga Mémé Jérémie de Bingerville',
      ],
    },
  },
  'Éveil au milieu': {
    '*': {
      titre: 'Contributeurs — Analyse critique des contenus',
      liste: [
        'Dr Ahiza Célestine NAMOI, Maître Assistante — chansons d’Histoire',
      ],
    },
  },
  'SVT': {
    '*': {
      titre: 'Contributeurs — Conception, montage, synchronisation et contrôle scientifique',
      liste: [
        'Dr ZORO Elogne Guessan, MCf',
        'Dr KOUAKOU Lébé Prisca Marie-Sandrine Epse AKRE, MCf',
        'Dr MEITÉ Namory, MA',
        'Dr KOUAME Niamien Alfred, MA',
        'Dr Kouadio Aya Nelly Berthe épouse KOUADIO, MA',
        'Dr COULIBALY Gaoussou, Chargé de Recherche',
        'Monsieur SEKA Chapaud Landry Vigile, Professeur de Lycée, option SVT, au Lycée Moderne Lucien Yebarth 2, San Pédro',
        'KOUADIO Désiré Junior, Développeur Web à EduWeb',
      ],
    },
  },
};

// Crédits par domaine de chansons : discipline + début de l'intitulé de la leçon
// (chant.lecon, ex. « Histoire (H 04) — Les Akan · Séance 10 (S10) »).
const CONTRIBUTIONS_CHANTS = [
  {
    discipline: 'Éveil au milieu',
    lecon: /^Histoire\s/,
    role: 'Analyse critique des contenus',
    noms: ['Dr Ahiza Célestine NAMOI, Maître Assistante'],
  },
];

// Comparaison tolérante (« Physique-Chimie », « physique chimie », « PHYSIQUE-CHIMIE »…)
const cle = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');

// Auteurs d'une discipline pour un niveau : entrée du niveau, sinon celle de tous les niveaux
function pour(discipline, niveau) {
  const d = Object.keys(AUTEURS).find((k) => cle(k) === cle(discipline));
  if (!d) return null;
  const parNiveau = AUTEURS[d];
  const n = Object.keys(parNiveau).find((k) => k !== '*' && cle(k) === cle(niveau));
  const entree = (n && parNiveau[n]) || parNiveau['*'] || null;
  return entree && entree.liste && entree.liste.length ? entree : null;
}

// Crédits à afficher sur la page d'une chanson : [{ role, noms }]
function pourChant(chant) {
  if (!chant) return [];
  return CONTRIBUTIONS_CHANTS
    .filter((c) => cle(c.discipline) === cle(chant.discipline) && c.lecon.test(chant.lecon || ''))
    .map((c) => ({ role: c.role, noms: c.noms.slice() }));
}

module.exports = { pour, pourChant, AUTEURS, CONTRIBUTIONS_CHANTS };
