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

  // ═══════════ Physique-Chimie Troisième (vidéos des chapitres) ═══════════
  {
    slug: 'pc3-chant-1',
    discipline: 'Physique-Chimie',
    niveau: 'Troisième',
    numero: 1,
    titre: 'Masse et Poids',
    lecon: 'Masse et poids d’un corps (leçons 1 à 3 : masse et poids · forces · équilibre)',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/ressources/3e-masse-et-poids-62rcbQymoG2H7zW1hq1iA35FDfDsJd.mp4',
    quiz: [
      {
        type: 'qcu',
        question: 'Avec quel instrument mesure-t-on la MASSE d’un corps ?',
        options: ['Un dynamomètre', 'Une balance', 'Un thermomètre', 'Un voltmètre'],
        bonne: 1,
        commentaire: 'La masse (en kilogrammes) se mesure avec une balance ; le dynamomètre, lui, mesure le poids.',
      },
      {
        type: 'qcu',
        question: 'Le poids d’un corps s’exprime en :',
        options: ['kilogrammes (kg)', 'newtons (N)', 'mètres (m)', 'litres (L)'],
        bonne: 1,
        commentaire: 'Le poids est une force : il s’exprime en newtons (N). La masse, elle, s’exprime en kilogrammes.',
      },
      {
        type: 'qcu',
        question: 'Quelle relation lie le poids P, la masse m et l’intensité de la pesanteur g ?',
        options: ['P = m + g', 'P = m × g', 'P = m ÷ g', 'P = g ÷ m'],
        bonne: 1,
        commentaire: 'P = m × g, avec g ≈ 10 N/kg sur Terre — c’est la formule du refrain !',
      },
      {
        type: 'vraifaux',
        question: 'Quand un astronaute va de la Terre à la Lune, sa masse change mais son poids reste le même.',
        bonne: false,
        commentaire: 'C’est l’inverse : la masse ne change jamais, mais le poids varie avec le lieu (g est plus faible sur la Lune).',
      },
      {
        type: 'courte',
        question: 'Un sac a une masse de 5 kg. Avec g = 10 N/kg, calcule son poids (en newtons).',
        motsCles: [['50']],
        reponseAffichee: 'P = m × g = 5 × 10 = 50 N.',
        commentaire: 'On applique P = m × g : 5 kg × 10 N/kg = 50 N.',
      },
      {
        type: 'qcm',
        question: 'Coche tout ce qui est vrai à propos du POIDS d’un corps :',
        options: ['C’est une force', 'Il s’exprime en newtons', 'Il se mesure avec un dynamomètre', 'Il est identique en tout lieu de l’univers'],
        bonnes: [0, 1, 2],
        commentaire: 'Le poids est une force, mesurée en newtons au dynamomètre — et il varie selon le lieu (Terre, Lune…).',
      },
    ],
  },
  {
    slug: 'pc3-chant-2',
    discipline: 'Physique-Chimie',
    niveau: 'Troisième',
    numero: 2,
    titre: 'Travail et énergie',
    lecon: 'Travail, puissance et énergie mécanique (leçons 4 et 5)',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/3bacf5e4-3788-422b-8524-98a3c024dc2f.mp4',
    quiz: [
      {
        type: 'qcu',
        question: 'Le travail d’une force constante F qui déplace son point d’application d’une longueur L dans sa direction est :',
        options: ['W = F + L', 'W = F × L', 'W = F ÷ L', 'W = L ÷ F'],
        bonne: 1,
        commentaire: 'W = F × L : une force de 1 N qui déplace de 1 m effectue un travail de 1 joule.',
      },
      {
        type: 'qcu',
        question: 'Le travail s’exprime en :',
        options: ['newtons (N)', 'joules (J)', 'watts (W)', 'volts (V)'],
        bonne: 1,
        commentaire: 'Le travail (et l’énergie) s’expriment en joules (J).',
      },
      {
        type: 'qcu',
        question: 'La puissance est donnée par :',
        options: ['P = W × t', 'P = W ÷ t', 'P = t ÷ W', 'P = W + t'],
        bonne: 1,
        commentaire: 'La puissance, c’est le travail effectué par seconde : P = W ÷ t, en watts (W).',
      },
      {
        type: 'qcm',
        question: 'L’énergie mécanique d’un corps comprend :',
        options: ['l’énergie cinétique (liée au mouvement)', 'l’énergie potentielle de pesanteur (liée à l’altitude)', 'l’énergie électrique', 'l’énergie chimique'],
        bonnes: [0, 1],
        commentaire: 'Em = Ec + Ep : l’énergie mécanique est la somme de l’énergie cinétique et de l’énergie potentielle de pesanteur.',
      },
      {
        type: 'vraifaux',
        question: 'Un corps en mouvement possède de l’énergie cinétique.',
        bonne: true,
        commentaire: 'L’énergie cinétique est justement l’énergie que possède un corps DU FAIT de son mouvement.',
      },
      {
        type: 'courte',
        question: 'Une force de 20 N déplace une caisse de 5 m dans sa direction. Calcule le travail effectué (en joules).',
        motsCles: [['100']],
        reponseAffichee: 'W = F × L = 20 × 5 = 100 J.',
        commentaire: 'On applique W = F × L : 20 N × 5 m = 100 joules.',
      },
    ],
  },
  {
    slug: 'pc3-chant-3',
    discipline: 'Physique-Chimie',
    niveau: 'Troisième',
    numero: 3,
    titre: 'L’eau et le butane',
    lecon: 'L’eau (électrolyse et synthèse) et le butane, un alcane (leçons 6 et 7)',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/ressources/3e-Eau-et-le-butane-vmEShUUUJv7fVh3vZ1uyk83IA1nQyL.mp4',
    quiz: [
      {
        type: 'qcu',
        question: 'L’électrolyse de l’eau produit :',
        options: ['du dioxygène uniquement', 'du dihydrogène uniquement', 'du dihydrogène ET du dioxygène', 'du dioxyde de carbone'],
        bonne: 2,
        commentaire: 'L’électrolyse décompose l’eau en dihydrogène et dioxygène — avec deux fois plus de dihydrogène en volume.',
      },
      {
        type: 'qcu',
        question: 'Quel gaz détone (aboie) à l’approche d’une flamme ?',
        options: ['Le dioxygène', 'Le dihydrogène', 'Le dioxyde de carbone', 'La vapeur d’eau'],
        bonne: 1,
        commentaire: 'Le dihydrogène détone à la flamme ; le dioxygène, lui, ravive une flamme (point d’allumette incandescent).',
      },
      {
        type: 'vraifaux',
        question: 'L’eau est un corps composé, formé d’hydrogène et d’oxygène.',
        bonne: true,
        commentaire: 'L’électrolyse et la synthèse le prouvent : l’eau (H₂O) est composée d’hydrogène et d’oxygène.',
      },
      {
        type: 'qcu',
        question: 'Quelle est la formule chimique du butane ?',
        options: ['CH₄', 'C₂H₆', 'C₄H₁₀', 'CO₂'],
        bonne: 2,
        commentaire: 'Le butane, C₄H₁₀, est un alcane : 4 atomes de carbone et 10 atomes d’hydrogène.',
      },
      {
        type: 'qcm',
        question: 'La combustion COMPLÈTE du butane produit :',
        options: ['du dioxyde de carbone', 'de l’eau', 'du monoxyde de carbone', 'des suies (carbone)'],
        bonnes: [0, 1],
        commentaire: 'Complète : CO₂ + eau (flamme bleue). Incomplète : monoxyde de carbone et suies — signe de danger !',
      },
      {
        type: 'courte',
        question: 'Quel gaz toxique et inodore se forme lors d’une combustion incomplète du butane ?',
        motsCles: [['monoxyde', 'oxyde de carbone']],
        reponseAffichee: 'Le monoxyde de carbone (CO).',
        commentaire: 'Le monoxyde de carbone (CO) est mortel : il faut toujours bien aérer la pièce où l’on utilise le gaz.',
      },
    ],
  },
  {
    slug: 'pc3-chant-4',
    discipline: 'Physique-Chimie',
    niveau: 'Troisième',
    numero: 4,
    titre: 'Rouille et pH',
    lecon: 'L’oxydation du fer et le pH des solutions (leçons 10 à 12)',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/ressources/3e-Rouille-et-pH-R3qF04vVHKiGKzvVjodVxzmg0WvFAR.mp4',
    quiz: [
      {
        type: 'qcm',
        question: 'La formation de la rouille sur le fer nécessite :',
        options: ['le dioxygène de l’air', 'l’humidité (l’eau)', 'l’obscurité totale', 'le vide'],
        bonnes: [0, 1],
        commentaire: 'Le fer rouille en présence d’AIR HUMIDE : il faut à la fois le dioxygène et l’eau.',
      },
      {
        type: 'qcu',
        question: 'Comment protéger un objet en fer contre la rouille ?',
        options: ['Le laisser dehors sous la pluie', 'Le recouvrir de peinture ou de graisse', 'L’arroser régulièrement', 'Le frotter avec du sable humide'],
        bonne: 1,
        commentaire: 'Peinture, graisse, vernis ou revêtement de zinc isolent le fer de l’air humide et empêchent la rouille.',
      },
      {
        type: 'qcu',
        question: 'Une solution dont le pH est égal à 7 est :',
        options: ['acide', 'basique', 'neutre', 'salée'],
        bonne: 2,
        commentaire: 'pH = 7 : solution neutre (comme l’eau pure). En dessous : acide ; au-dessus : basique.',
      },
      {
        type: 'qcu',
        question: 'Le jus de citron a un pH voisin de 2. C’est une solution :',
        options: ['acide', 'neutre', 'basique', 'sans pH'],
        bonne: 0,
        commentaire: 'pH 2 < 7 : le jus de citron est nettement acide.',
      },
      {
        type: 'vraifaux',
        question: 'Plus le pH d’une solution est petit devant 7, plus la solution est acide.',
        bonne: true,
        commentaire: 'L’acidité augmente quand le pH diminue : pH 2 est plus acide que pH 5.',
      },
      {
        type: 'classement',
        question: 'Classe ces solutions de la PLUS ACIDE à la PLUS BASIQUE :',
        items: ['pH = 13', 'pH = 2', 'pH = 7'],
        ordre: [1, 2, 0],
        commentaire: 'Du plus acide au plus basique : pH 2 (acide) → pH 7 (neutre) → pH 13 (basique).',
      },
    ],
  },
  {
    slug: 'pc3-chant-5',
    discipline: 'Physique-Chimie',
    niveau: 'Troisième',
    numero: 5,
    titre: 'Optique : Les lunettes de Fatou',
    lecon: 'Les lentilles et les défauts de l’œil (leçons 8 et 9)',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/fd8fcdb4-c5e2-4753-a6eb-f08caad55a26.mp4',
    quiz: [
      {
        type: 'qcu',
        question: 'Une lentille à bords minces est une lentille :',
        options: ['convergente', 'divergente', 'plane', 'opaque'],
        bonne: 0,
        commentaire: 'Bords minces = convergente (elle rassemble la lumière) ; bords épais = divergente (elle l’écarte).',
      },
      {
        type: 'qcu',
        question: 'La vergence C d’une lentille se calcule par :',
        options: ['C = 1 ÷ f', 'C = f', 'C = f × f', 'C = 2 × f'],
        bonne: 0,
        commentaire: 'C = 1/f, avec f la distance focale en mètres.',
      },
      {
        type: 'qcu',
        question: 'La vergence s’exprime en :',
        options: ['mètres (m)', 'dioptries (δ)', 'newtons (N)', 'degrés (°)'],
        bonne: 1,
        commentaire: 'La vergence s’exprime en dioptries (δ), quand la distance focale est en mètres.',
      },
      {
        type: 'vraifaux',
        question: 'Plus la distance focale d’une lentille convergente est petite, plus la lentille est convergente.',
        bonne: true,
        commentaire: 'f petite → C = 1/f grande : la lentille fait converger la lumière plus fortement.',
      },
      {
        type: 'qcu',
        question: 'L’œil MYOPE voit mal de loin. On le corrige avec une lentille :',
        options: ['convergente', 'divergente', 'plane', 'colorée'],
        bonne: 1,
        commentaire: 'Myopie → lentille divergente ; hypermétropie → lentille convergente. Les lunettes de Fatou corrigent sa vue !',
      },
      {
        type: 'courte',
        question: 'Une lentille a une distance focale f = 0,5 m. Calcule sa vergence (en dioptries).',
        motsCles: [['2']],
        reponseAffichee: 'C = 1 ÷ f = 1 ÷ 0,5 = 2 dioptries (δ).',
        commentaire: 'C = 1/f : 1 ÷ 0,5 m = 2 δ.',
      },
    ],
  },
  {
    slug: 'pc3-chant-6',
    discipline: 'Physique-Chimie',
    niveau: 'Troisième',
    numero: 6,
    titre: 'La loi d’Ohm : U = R × I',
    lecon: 'La loi d’Ohm, les circuits en série et en dérivation, la puissance électrique',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/ressources/3e-Loid-Ohm---U-R-fois-I-tN9uWvJHznYFCyS0ICedmlfwKtTrN9.mp4',
    quiz: [
      {
        type: 'qcu',
        question: 'La loi d’Ohm s’écrit :',
        options: ['U = R × I', 'U = R + I', 'R = U × I', 'I = U × R'],
        bonne: 0,
        commentaire: 'U = R × I : la tension (V) est égale à la résistance (Ω) multipliée par l’intensité (A).',
      },
      {
        type: 'qcu',
        question: 'La résistance R s’exprime en :',
        options: ['volts (V)', 'ampères (A)', 'ohms (Ω)', 'watts (W)'],
        bonne: 2,
        commentaire: 'R en ohms (Ω), U en volts (V), I en ampères (A).',
      },
      {
        type: 'qcm',
        question: 'Dans un circuit EN SÉRIE :',
        options: ['l’intensité est la même en tout point', 'les tensions s’ajoutent', 'les intensités s’ajoutent', 'la tension est la même aux bornes de chaque dipôle'],
        bonnes: [0, 1],
        commentaire: 'En série : même intensité partout, et les tensions s’ajoutent. En dérivation, c’est l’inverse !',
      },
      {
        type: 'vraifaux',
        question: 'Dans un circuit en dérivation, la tension aux bornes de chaque dipôle est la même.',
        bonne: true,
        commentaire: 'En dérivation, tous les dipôles reçoivent la même tension — et ce sont les intensités qui s’ajoutent.',
      },
      {
        type: 'courte',
        question: 'Un résistor de R = 100 Ω est traversé par un courant d’intensité I = 0,2 A. Calcule la tension U (en volts).',
        motsCles: [['20']],
        reponseAffichee: 'U = R × I = 100 × 0,2 = 20 V.',
        commentaire: 'On applique la loi d’Ohm : U = R × I = 100 Ω × 0,2 A = 20 volts.',
      },
      {
        type: 'qcu',
        question: 'La puissance électrique reçue par un dipôle est :',
        options: ['P = U × I', 'P = U + I', 'P = U ÷ I', 'P = I ÷ U'],
        bonne: 0,
        commentaire: 'P = U × I, en watts (W) : c’est elle qu’on lit sur les appareils (ex. 60 W).',
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
