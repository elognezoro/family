// Auteurs des ressources de la banque, par discipline (et, au besoin, par
// niveau). Affichés dans l'accordéon « Auteurs » en tête de chaque tuile de
// discipline, sous chaque niveau. La clé '*' vaut pour tous les niveaux.
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

module.exports = { pour, AUTEURS };
