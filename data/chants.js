// Chants pédagogiques avec quiz — pages /ressources/chants/:slug.
// Chaque chant : son média (mediaType 'video' pour un clip, 'audio' pour une
// chanson seule — hébergé sur le stockage cloud ; null = clip à venir, le quiz
// est déjà disponible), la leçon qu'il porte, et son quiz noté sur 6.
// Types de questions :
//   qcu       : une seule bonne réponse (index dans options)
//   qcm       : plusieurs bonnes réponses (indices dans options)
//   vraifaux  : bonne = true | false
//   courte    : réponse libre — validée si chaque groupe de mots-clés est
//               présent (au moins UNE variante par groupe), accents/casse ignorés
//   classement: remettre les items dans l'ordre (ordre = indices attendus)
// Chaque question porte un « commentaire » : la correction commentée affichée
// après la vérification, que la réponse soit juste ou fausse.
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
        commentaire: 'Le déboisement détruit les arbres, une ressource naturelle. Reboiser, traiter les eaux ou créer un parc national protègent au contraire l’environnement.',
      },
      {
        type: 'qcm',
        question: 'Sélectionne les actions de surexploitation des ressources naturelles :',
        options: ['Surpâturage', 'Pêche intensive', 'Braconnage', 'Reboisement'],
        bonnes: [0, 1, 2],
        commentaire: 'Surpâturage, pêche intensive et braconnage prélèvent trop, trop vite : c’est la surexploitation. Le reboisement, lui, répare.',
      },
      {
        type: 'qcu',
        question: 'Le rejet d’ordures ménagères dans la nature est une action de :',
        options: ['reproduction', 'croissance', 'pollution', 'protection'],
        bonne: 2,
        commentaire: 'Jeter les ordures dans la nature salit l’eau, l’air et le sol : c’est une pollution.',
      },
      {
        type: 'vraifaux',
        question: 'L’utilisation irrationnelle des pesticides et des engrais peut dégrader l’environnement.',
        bonne: true,
        commentaire: 'Utilisés sans mesure, pesticides et engrais empoisonnent le sol et l’eau : leur usage doit rester raisonné.',
      },
      {
        type: 'qcu',
        question: 'Parmi ces propositions, laquelle n’est PAS une action néfaste ?',
        options: ['Feu de brousse', 'Braconnage', 'Reboisement', 'Défrichement'],
        bonne: 2,
        commentaire: 'Le reboisement est une action bénéfique : il remplace les arbres détruits.',
      },
      {
        type: 'courte',
        question: 'Cite les trois grandes catégories d’actions néfastes étudiées.',
        motsCles: [['destruction'], ['surexploitation'], ['pollution']],
        reponseAffichee: 'Destruction des ressources naturelles ; surexploitation des ressources naturelles ; pollution.',
        commentaire: 'Les trois familles d’actions néfastes de l’Homme : détruire, surexploiter, polluer.',
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
        commentaire: 'Reboiser, c’est replanter des arbres pour remplacer ceux qui ont été détruits.',
      },
      {
        type: 'qcm',
        question: 'Quels moyens permettent de lutter contre la dégradation de l’environnement ?',
        options: ['Traitement des eaux usées', 'Traitement des ordures', 'Reboisement', 'Feux de brousse'],
        bonnes: [0, 1, 2],
        commentaire: 'Traiter les eaux usées, traiter les ordures et reboiser protègent l’environnement ; les feux de brousse le dégradent.',
      },
      {
        type: 'vraifaux',
        question: 'La création de parcs nationaux et de réserves forestières contribue à la préservation de l’environnement.',
        bonne: true,
        commentaire: 'Parcs nationaux et réserves forestières mettent la nature à l’abri : c’est une mesure de préservation.',
      },
      {
        type: 'qcu',
        question: 'Une lutte utilisant des êtres vivants est appelée :',
        options: ['lutte mécanique', 'lutte biologique', 'lutte intensive', 'lutte minérale'],
        bonne: 1,
        commentaire: 'La lutte biologique utilise des êtres vivants (par exemple des insectes utiles) à la place des produits chimiques.',
      },
      {
        type: 'qcm',
        question: 'Quels supports peuvent servir à sensibiliser une population ?',
        options: ['Affiches', 'Dépliants', 'Panneaux', 'Feux de brousse'],
        bonnes: [0, 1, 2],
        commentaire: 'Affiches, dépliants et panneaux informent et sensibilisent la population ; le feu de brousse, lui, détruit.',
      },
      {
        type: 'courte',
        question: 'Complète la formule de la chanson : « Prévenir, ………………, sensibiliser. »',
        motsCles: [['proteger', 'protéger']],
        reponseAffichee: 'Protéger — « Prévenir, protéger, sensibiliser. »',
        commentaire: 'La formule de la chanson : Prévenir, protéger, sensibiliser.',
      },
    ],
  },
  {
    slug: 'svt6-chant-3',
    discipline: 'SVT',
    niveau: 'Sixième',
    numero: 3,
    titre: 'Pour grandir, la plante a besoin…',
    lecon: 'Les facteurs de croissance chez les plantes à fleurs',
    mediaType: null,
    mediaUrl: null, // clip à venir — le quiz est déjà disponible
    quiz: [
      {
        type: 'qcm',
        question: 'Quels facteurs interviennent dans la croissance d’une plante à fleurs ?',
        options: ['Eau', 'Sels minéraux', 'Lumière', 'Plastique'],
        bonnes: [0, 1, 2],
        commentaire: 'L’eau, les sels minéraux et la lumière font grandir la plante ; le plastique ne nourrit rien !',
      },
      {
        type: 'qcu',
        question: 'Quel facteur est apporté principalement par le sol ?',
        options: ['La lumière', 'Les sels minéraux', 'Le vent', 'La chaleur corporelle'],
        bonne: 1,
        commentaire: 'Les racines puisent dans le sol les sels minéraux, dissous dans l’eau.',
      },
      {
        type: 'vraifaux',
        question: 'La lumière fait partie des facteurs étudiés dans la croissance des plantes à fleurs.',
        bonne: true,
        commentaire: 'Sans lumière, la plante verte ne peut pas fabriquer sa matière : elle en a besoin pour grandir.',
      },
      {
        type: 'qcu',
        question: 'La notion déduite de l’étude de la croissance de la plante verte est :',
        options: ['viviparité', 'pollinisation', 'autotrophie', 'oviparité'],
        bonne: 2,
        commentaire: 'La plante verte fabrique elle-même sa propre matière à partir d’eau, de sels minéraux et de lumière : on dit qu’elle est autotrophe.',
      },
      {
        type: 'qcu',
        question: 'Pour étudier expérimentalement l’influence de l’eau, on doit idéalement :',
        options: [
          'modifier toutes les conditions à la fois',
          'comparer des plantes semblables en faisant varier l’apport d’eau',
          'utiliser deux espèces totalement différentes',
          'supprimer toute observation',
        ],
        bonne: 1,
        commentaire: 'Une bonne expérience ne fait varier QU’UN seul facteur à la fois : ici l’eau, tout le reste restant identique.',
      },
      {
        type: 'courte',
        question: 'Cite les trois facteurs essentiels chantés dans le refrain.',
        motsCles: [['eau'], ['sels', 'mineraux', 'minéraux'], ['lumiere', 'lumière']],
        reponseAffichee: 'Eau, sels minéraux, lumière.',
        commentaire: 'Le refrain de la chanson : eau, sels minéraux, lumière — les trois facteurs de croissance.',
      },
    ],
  },
  {
    slug: 'svt6-chant-4',
    discipline: 'SVT',
    niveau: 'Sixième',
    numero: 4,
    titre: 'Bien manger pour bien grandir',
    lecon: 'L’influence des aliments sur la croissance des vertébrés',
    mediaType: null,
    mediaUrl: null,
    quiz: [
      {
        type: 'qcm',
        question: 'Quels constituants sont cités dans les aliments des vertébrés ?',
        options: ['Protides', 'Lipides', 'Glucides', 'Vitamines'],
        bonnes: [0, 1, 2, 3],
        commentaire: 'Protides, lipides, glucides et vitamines : les quatre sont cités parmi les constituants des aliments.',
      },
      {
        type: 'qcu',
        question: 'Lequel de ces éléments fait aussi partie de la composition des aliments étudiée ?',
        options: ['Eau', 'Plastique', 'Sable', 'Encre'],
        bonne: 0,
        commentaire: 'L’eau entre aussi dans la composition des aliments — pas le plastique, le sable ni l’encre !',
      },
      {
        type: 'vraifaux',
        question: 'La quantité d’aliments consommés peut influencer la croissance d’un vertébré.',
        bonne: true,
        commentaire: 'Un vertébré qui mange trop peu grandit mal : la quantité d’aliments compte.',
      },
      {
        type: 'vraifaux',
        question: 'Seule la quantité compte ; la qualité des aliments n’a aucune influence sur la croissance.',
        bonne: false,
        commentaire: 'Faux : la qualité compte aussi ! Une alimentation variée et équilibrée favorise une bonne croissance.',
      },
      {
        type: 'qcu',
        question: 'Dans l’exemple du programme, les poussins ayant une alimentation plus diversifiée présentent :',
        options: ['une meilleure croissance', 'aucune croissance', 'une germination', 'une pollinisation'],
        bonne: 0,
        commentaire: 'Les poussins nourris avec une alimentation diversifiée grandissent mieux que les autres.',
      },
      {
        type: 'courte',
        question: 'Quels sont les deux aspects de l’alimentation dont il faut tenir compte pour la croissance ?',
        motsCles: [['quantite', 'quantité'], ['qualite', 'qualité']],
        reponseAffichee: 'La quantité et la qualité des aliments.',
        commentaire: 'Pour bien grandir, il faut surveiller les deux : la quantité ET la qualité des aliments.',
      },
    ],
  },
  {
    slug: 'svt6-chant-5',
    discipline: 'SVT',
    niveau: 'Sixième',
    numero: 5,
    titre: 'De la fleur à la graine',
    lecon: 'La formation de la graine',
    mediaType: null,
    mediaUrl: null,
    quiz: [
      {
        type: 'qcu',
        question: 'La pollinisation correspond :',
        options: [
          'à la germination d’une graine',
          'au transport du pollen des étamines jusqu’au pistil',
          'à la naissance d’un poussin',
          'à la croissance d’une racine',
        ],
        bonne: 1,
        commentaire: 'La pollinisation, c’est le voyage du pollen depuis les étamines (organes mâles) jusqu’au pistil (organe femelle).',
      },
      {
        type: 'qcu',
        question: 'La fécondation est :',
        options: [
          'l’union d’une cellule mâle et d’une cellule femelle',
          'le transport de l’eau',
          'la chute des pétales',
          'le gonflement d’une graine',
        ],
        bonne: 0,
        commentaire: 'La fécondation unit une cellule mâle (apportée par le pollen) et une cellule femelle (l’ovule).',
      },
      {
        type: 'qcm',
        question: 'Quels stades de la fleur sont étudiés ?',
        options: ['Bouton floral', 'Fleur épanouie', 'Fleur fanée', 'Radicule'],
        bonnes: [0, 1, 2],
        commentaire: 'On suit la fleur du bouton floral à la fleur fanée. La radicule, elle, appartient à la germination de la graine.',
      },
      {
        type: 'vraifaux',
        question: 'Le grain de pollen intervient dans la reproduction sexuée de la plante à fleurs.',
        bonne: true,
        commentaire: 'Le grain de pollen transporte la cellule reproductrice mâle : il est indispensable à la reproduction sexuée.',
      },
      {
        type: 'qcu',
        question: 'Quel organe contient les ovules ?',
        options: ['Le pistil', 'Le pétale', 'Le pédoncule uniquement', 'Le sépale uniquement'],
        bonne: 0,
        commentaire: 'Le pistil contient l’ovaire, qui renferme les ovules.',
      },
      {
        type: 'courte',
        question: 'Complète la chaîne : Pollinisation → ………………… → formation de la graine.',
        motsCles: [['fecondation', 'fécondation']],
        reponseAffichee: 'Fécondation — Pollinisation → fécondation → formation de la graine.',
        commentaire: 'La chaîne complète : pollinisation → fécondation → formation de la graine.',
      },
    ],
  },
  {
    slug: 'svt6-chant-6',
    discipline: 'SVT',
    niveau: 'Sixième',
    numero: 6,
    titre: 'Petite graine, réveille-toi !',
    lecon: 'La germination d’une graine',
    mediaType: null,
    mediaUrl: null,
    quiz: [
      {
        type: 'qcm',
        question: 'Quels sont les facteurs externes influençant la germination ?',
        options: ['Eau', 'Air', 'Température', 'Âge de la graine'],
        bonnes: [0, 1, 2],
        commentaire: 'L’eau, l’air et la température viennent du milieu : ce sont les facteurs externes. L’âge de la graine est un facteur interne.',
      },
      {
        type: 'qcm',
        question: 'Quels sont les facteurs internes étudiés ?',
        options: ['État de la graine', 'Âge de la graine', 'Lumière du Soleil', 'Air'],
        bonnes: [0, 1],
        commentaire: 'L’état et l’âge de la graine sont propres à la graine elle-même : ce sont les facteurs internes.',
      },
      {
        type: 'qcu',
        question: 'Quelle est la première étape mentionnée dans la germination ?',
        options: ['Apparition des feuilles', 'Gonflement de la graine', 'Floraison', 'Fécondation'],
        bonne: 1,
        commentaire: 'Tout commence par le gonflement de la graine, qui absorbe l’eau.',
      },
      {
        type: 'qcu',
        question: 'Quelle structure apparaît après le gonflement de la graine ?',
        options: ['Le pétale', 'La radicule', 'Le pistil', 'L’ovaire'],
        bonne: 1,
        commentaire: 'Après le gonflement sort la radicule, la toute petite racine de la future plante.',
      },
      {
        type: 'vraifaux',
        question: 'La tigelle et les premières feuilles apparaissent au cours de la germination.',
        bonne: true,
        commentaire: 'Après la radicule viennent la tigelle (petite tige) puis les premières feuilles.',
      },
      {
        type: 'classement',
        question: 'Replace dans l’ordre les étapes de la germination :',
        items: ['premières feuilles', 'gonflement', 'tigelle', 'radicule'],
        ordre: [1, 3, 2, 0],
        commentaire: 'L’ordre de la germination : gonflement → radicule → tigelle → premières feuilles.',
      },
    ],
  },
  {
    slug: 'svt6-chant-7',
    discipline: 'SVT',
    niveau: 'Sixième',
    numero: 7,
    titre: 'Du mâle au nouvel individu',
    lecon: 'La reproduction chez les mammifères',
    mediaType: null,
    mediaUrl: null,
    quiz: [
      {
        type: 'qcu',
        question: 'Chez les mammifères, la rencontre des cellules reproductrices constitue :',
        options: ['la germination', 'la fécondation', 'la pollinisation', 'l’éclosion'],
        bonne: 1,
        commentaire: 'La rencontre de la cellule mâle et de la cellule femelle s’appelle la fécondation.',
      },
      {
        type: 'qcu',
        question: 'La fécondation étudiée chez les mammifères est :',
        options: ['externe', 'interne', 'végétale', 'aérienne'],
        bonne: 1,
        commentaire: 'Chez les mammifères, la fécondation a lieu À L’INTÉRIEUR du corps de la femelle : elle est interne.',
      },
      {
        type: 'classement',
        question: 'Mets dans l’ordre les étapes du développement :',
        items: ['fœtus', 'œuf', 'nouvel individu', 'embryon'],
        ordre: [1, 3, 0, 2],
        commentaire: 'Le développement : œuf → embryon → fœtus → nouvel individu.',
      },
      {
        type: 'vraifaux',
        question: 'Chez les mammifères étudiés, le développement se déroule à l’intérieur de la femelle.',
        bonne: true,
        commentaire: 'Le petit se développe dans l’utérus de sa mère : le développement est interne.',
      },
      {
        type: 'qcu',
        question: 'Le fait que le jeune naisse vivant correspond à :',
        options: ['l’oviparité', 'la viviparité', 'la pollinisation', 'l’autotrophie'],
        bonne: 1,
        commentaire: 'Naître vivant et déjà formé, c’est la viviparité (ovipare = qui pond des œufs).',
      },
      {
        type: 'courte',
        question: 'Cite les trois notions essentielles du refrain final.',
        motsCles: [['fecondation', 'fécondation'], ['developpement', 'développement'], ['viviparite', 'viviparité', 'vivipare']],
        reponseAffichee: 'Fécondation interne, développement interne, viviparité.',
        commentaire: 'Le refrain final : fécondation interne, développement interne, viviparité.',
      },
    ],
  },
  {
    slug: 'svt6-chant-8',
    discipline: 'SVT',
    niveau: 'Sixième',
    numero: 8,
    titre: 'De l’œuf au poussin',
    lecon: 'La reproduction chez les oiseaux',
    mediaType: null,
    mediaUrl: null,
    quiz: [
      {
        type: 'qcu',
        question: 'Chez les oiseaux, l’individu mâle étudié est :',
        options: ['la poule', 'le coq', 'le poussin', 'l’œuf'],
        bonne: 1,
        commentaire: 'Le coq est le mâle ; la poule est la femelle et le poussin est le jeune.',
      },
      {
        type: 'qcu',
        question: 'Chez la poule, la cellule reproductrice femelle est :',
        options: ['l’ovule', 'le spermatozoïde', 'la radicule', 'le pollen'],
        bonne: 0,
        commentaire: 'La cellule reproductrice femelle est l’ovule ; le spermatozoïde est la cellule mâle.',
      },
      {
        type: 'qcu',
        question: 'La température indiquée dans le programme pour le développement de l’œuf est voisine de :',
        options: ['10 °C', '20 °C', '38 °C', '80 °C'],
        bonne: 2,
        commentaire: 'L’œuf doit être couvé aux alentours de 38 °C pour que l’embryon se développe.',
      },
      {
        type: 'classement',
        question: 'Replace dans l’ordre :',
        items: ['poussin', 'œuf', 'embryon'],
        ordre: [1, 2, 0],
        commentaire: 'Le développement chez les oiseaux : œuf → embryon → poussin.',
      },
      {
        type: 'vraifaux',
        question: 'Chez les oiseaux, le développement étudié est externe.',
        bonne: true,
        commentaire: 'L’œuf pondu se développe HORS du corps de la poule : le développement est externe.',
      },
      {
        type: 'qcu',
        question: 'La reproduction au cours de laquelle la femelle pond des œufs correspond à :',
        options: ['la viviparité', 'l’autotrophie', 'l’oviparité', 'la pollinisation'],
        bonne: 2,
        commentaire: 'Pondre des œufs, c’est l’oviparité (vivipare = donner naissance à un petit déjà formé).',
      },
    ],
  },
];

function parSlug(slug) {
  return CHANTS.find((c) => c.slug === String(slug || '').toLowerCase()) || null;
}

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Niveau canonique (mêmes familles que le classement de la banque)
const NIVEAU_CLES = [
  [/sixi|(^|\D)6\s*(e|eme)/, '6e'], [/cinqu|(^|\D)5\s*(e|eme)/, '5e'],
  [/quatri|(^|\D)4\s*(e|eme)/, '4e'], [/troisi|(^|\D)3\s*(e|eme)/, '3e'],
  [/seconde|(^|\D)2\s*(nde?|de)/, '2nde'], [/premi|(^|\D)1\s*(re|ere)/, '1ere'],
  [/terminale|(^|\W)tle/, 'tle'],
];
function canonNiveau(s) {
  const n = norm(s);
  for (const [re, c] of NIVEAU_CLES) if (re.test(n)) return c;
  return n;
}

// Chant associé à une ressource de la banque : soit le MÊME fichier média,
// soit — pour les clips téléversés par l'admin — la reconnaissance
// automatique « même discipline + même niveau + numéro de leçon/chanson
// dans le titre » (réservée aux fichiers audio/vidéo).
function pourRessource(r) {
  if (!r || !r.url) return null;
  const direct = CHANTS.find((c) => c.mediaUrl === r.url);
  if (direct) return direct;
  if (!/^(audio|video)\//.test(r.mime || '')) return null;
  const m = norm(r.titre).match(/(?:lecon|chanson|chant)\s*n?\s*[°o]?\s*(\d+)/);
  if (!m) return null;
  const numero = parseInt(m[1], 10);
  const texteRef = norm(r.discipline || '') + ' ' + norm(r.titre);
  return CHANTS.find((c) =>
    c.numero === numero &&
    texteRef.includes(norm(c.discipline)) &&
    canonNiveau(r.niveau) === canonNiveau(c.niveau)
  ) || null;
}

// Média d'un chant : le sien, sinon celui de la ressource de la banque qui
// lui est associée (clip téléversé par l'admin).
function mediaDe(chant, ressources) {
  if (chant.mediaUrl) return { type: chant.mediaType, url: chant.mediaUrl };
  const r = (ressources || []).find((x) => x.actif !== false && pourRessource(x) === chant);
  if (r) return { type: (r.mime || '').startsWith('video') ? 'video' : 'audio', url: r.url };
  return { type: null, url: null };
}

function toutes() { return CHANTS; }

module.exports = { parSlug, pourRessource, mediaDe, toutes };
