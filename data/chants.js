// Chants pédagogiques avec quiz — pages /ressources/chants/:slug.
// Chaque chant : son média (mediaType 'video' pour un clip, 'audio' pour une
// chanson seule — hébergé sur le stockage cloud), la leçon qu'il porte, et
// son quiz. Types de questions :
//   qcu      : une seule bonne réponse (index dans options)
//   qcm      : plusieurs bonnes réponses (indices dans options)
//   vraifaux : bonne = true | false
//   courte   : réponse libre — validée si chaque groupe de mots-clés est
//              présent (au moins UNE variante par groupe), accents/casse ignorés
const CHANTS = [
  {
    slug: 'svt6-chant-1',
    discipline: 'SVT',
    niveau: 'Sixième',
    numero: 1,
    titre: 'Protégeons notre environnement',
    lecon: 'Les actions néfastes de l’Homme et leurs conséquences sur l’environnement',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/chansons/svt6/svt6-chant-1-clip-NXMowSyA0CAa8m6vWlI1h8zIAuTcYf.mp4',
    quiz: [
      {
        type: 'qcu',
        question: 'Laquelle de ces actions correspond à une destruction des ressources naturelles ?',
        options: ['Reboisement', 'Déboisement', 'Traitement des eaux', 'Création d’un parc national'],
        bonne: 1,
      },
      {
        type: 'qcm',
        question: 'Sélectionne les actions de surexploitation des ressources naturelles :',
        options: ['Surpâturage', 'Pêche intensive', 'Braconnage', 'Reboisement'],
        bonnes: [0, 1, 2],
      },
      {
        type: 'qcu',
        question: 'Le rejet d’ordures ménagères dans la nature est une action de :',
        options: ['reproduction', 'croissance', 'pollution', 'protection'],
        bonne: 2,
      },
      {
        type: 'vraifaux',
        question: 'L’utilisation irrationnelle des pesticides et des engrais peut dégrader l’environnement.',
        bonne: true,
      },
      {
        type: 'qcu',
        question: 'Parmi ces propositions, laquelle n’est PAS une action néfaste ?',
        options: ['Feu de brousse', 'Braconnage', 'Reboisement', 'Défrichement'],
        bonne: 2,
      },
      {
        type: 'courte',
        question: 'Cite les trois grandes catégories d’actions néfastes étudiées.',
        motsCles: [['destruction'], ['surexploitation'], ['pollution']],
        reponseAffichee: 'Destruction des ressources naturelles ; surexploitation des ressources naturelles ; pollution.',
      },
    ],
  },
  {
    slug: 'svt6-chant-2',
    discipline: 'SVT',
    niveau: 'Sixième',
    numero: 2,
    titre: 'Agissons pour la Terre',
    lecon: 'La lutte contre la dégradation de l’environnement',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/chansons/svt6/svt6-chant-2-clip-7WBKHbYemQgkDHLKEga7nkf36uOaVQ.mp4',
    quiz: [
      {
        type: 'qcu',
        question: 'Quelle action permet de remplacer des arbres détruits ?',
        options: ['Braconnage', 'Reboisement', 'Surpâturage', 'Défrichement'],
        bonne: 1,
      },
      {
        type: 'qcm',
        question: 'Quels moyens permettent de lutter contre la dégradation de l’environnement ?',
        options: ['Traitement des eaux usées', 'Traitement des ordures', 'Reboisement', 'Feux de brousse'],
        bonnes: [0, 1, 2],
      },
      {
        type: 'vraifaux',
        question: 'La création de parcs nationaux et de réserves forestières contribue à la préservation de l’environnement.',
        bonne: true,
      },
      {
        type: 'qcu',
        question: 'Une lutte utilisant des êtres vivants est appelée :',
        options: ['lutte mécanique', 'lutte biologique', 'lutte intensive', 'lutte minérale'],
        bonne: 1,
      },
      {
        type: 'qcm',
        question: 'Quels supports peuvent servir à sensibiliser une population ?',
        options: ['Affiches', 'Dépliants', 'Panneaux', 'Feux de brousse'],
        bonnes: [0, 1, 2],
      },
      {
        type: 'courte',
        question: 'Complète la formule de la chanson : « Prévenir, ………………, sensibiliser. »',
        motsCles: [['proteger', 'protéger']],
        reponseAffichee: 'Protéger — « Prévenir, protéger, sensibiliser. »',
      },
    ],
  },
];

function parSlug(slug) {
  return CHANTS.find((c) => c.slug === String(slug || '').toLowerCase()) || null;
}

// Chant associé à une ressource de la banque (même fichier média) : la carte
// affiche alors le bouton « Chanson & quiz ».
function pourRessource(r) {
  if (!r || !r.url) return null;
  return CHANTS.find((c) => c.mediaUrl === r.url) || null;
}

function toutes() { return CHANTS; }

module.exports = { parSlug, pourRessource, toutes };
