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
      {
        type: 'vraifaux',
        question: 'Les feux de brousse sont une action néfaste pour l’environnement.',
        bonne: true,
        commentaire: 'Les feux de brousse détruisent la végétation, les animaux et appauvrissent les sols.',
      },
      {
        type: 'qcu',
        question: 'Le braconnage, c’est :',
        options: ['la chasse illégale d’animaux', 'la plantation d’arbres', 'le tri des déchets', 'l’élevage des poulets'],
        bonne: 0,
        commentaire: 'Le braconnage est une chasse interdite : il surexploite les animaux et menace des espèces de disparition.',
      },
      {
        type: 'qcm',
        question: 'Quelles peuvent être les conséquences des actions néfastes de l’Homme ?',
        options: ['La disparition d’espèces animales', 'L’appauvrissement des sols', 'La pollution de l’eau', 'L’augmentation des forêts'],
        bonnes: [0, 1, 2],
        commentaire: 'Espèces qui disparaissent, sols appauvris, eau polluée : voilà les conséquences — les forêts, elles, diminuent.',
      },
      {
        type: 'qcu',
        question: 'Le défrichement consiste à :',
        options: ['débarrasser un terrain de sa végétation', 'planter des arbres', 'arroser les cultures', 'nourrir le bétail'],
        bonne: 0,
        commentaire: 'Défricher, c’est enlever la végétation d’un terrain — pratiqué sans mesure, cela détruit le milieu naturel.',
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
      {
        type: 'qcu',
        question: 'Prévenir, c’est :',
        options: ['agir AVANT que le mal n’arrive', 'punir les coupables', 'détruire la forêt', 'ignorer le problème'],
        bonne: 0,
        commentaire: 'Prévenir, c’est empêcher la dégradation avant qu’elle ne se produise — mieux vaut prévenir que guérir !',
      },
      {
        type: 'vraifaux',
        question: 'Le tri des ordures facilite leur traitement.',
        bonne: true,
        commentaire: 'Trier (plastique, verre, déchets verts…) permet de traiter et recycler chaque type d’ordures.',
      },
      {
        type: 'qcm',
        question: 'Quels gestes peux-tu faire, toi-même, pour protéger l’environnement ?',
        options: ['Jeter mes déchets à la poubelle', 'Économiser l’eau', 'Planter un arbre', 'Allumer un feu de brousse'],
        bonnes: [0, 1, 2],
        commentaire: 'Chacun peut agir : poubelle, économies d’eau, plantation d’arbres… Le feu de brousse, lui, détruit.',
      },
      {
        type: 'qcu',
        question: 'À quoi sert une réserve forestière ?',
        options: ['À protéger la forêt et les espèces qui y vivent', 'À produire du charbon', 'À chasser librement', 'À construire des maisons'],
        bonne: 0,
        commentaire: 'Une réserve forestière met la forêt et ses espèces à l’abri des actions destructrices.',
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
      {
        type: 'vraifaux',
        question: 'Une plante privée d’eau se fane puis finit par mourir.',
        bonne: true,
        commentaire: 'Sans eau, la plante se fane : l’eau est indispensable à sa vie et à sa croissance.',
      },
      {
        type: 'qcu',
        question: 'Dans une expérience, la plante « témoin » est celle qui :',
        options: ['est placée dans les conditions normales, pour comparer', 'ne reçoit jamais de lumière', 'est déjà morte', 'reçoit deux fois plus d’engrais'],
        bonne: 0,
        commentaire: 'Le témoin sert de référence : on le compare à la plante dont on a modifié UNE condition.',
      },
      {
        type: 'qcm',
        question: 'À quoi reconnaît-on qu’une plante grandit ?',
        options: ['Sa taille augmente', 'Sa masse augmente', 'De nouvelles feuilles apparaissent', 'Ses racines disparaissent'],
        bonnes: [0, 1, 2],
        commentaire: 'La croissance se mesure par l’augmentation de la taille et de la masse, et l’apparition de nouveaux organes.',
      },
      {
        type: 'courte',
        question: 'Comment appelle-t-on un être vivant capable de fabriquer lui-même sa propre matière ?',
        motsCles: [['autotrophe', 'autotrophie']],
        reponseAffichee: 'Un être autotrophe (c’est l’autotrophie).',
        commentaire: 'La plante verte est autotrophe : avec l’eau, les sels minéraux et la lumière, elle fabrique sa matière.',
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
      {
        type: 'qcu',
        question: 'Un vertébré est un animal qui possède :',
        options: ['une colonne vertébrale', 'des racines', 'uniquement une coquille', 'des pétales'],
        bonne: 0,
        commentaire: 'Les vertébrés (poissons, oiseaux, mammifères…) ont une colonne vertébrale.',
      },
      {
        type: 'vraifaux',
        question: 'Les vitamines sont utiles à la croissance, même en très petites quantités.',
        bonne: true,
        commentaire: 'Une toute petite quantité de vitamines suffit, mais leur absence provoque des maladies et freine la croissance.',
      },
      {
        type: 'qcu',
        question: 'Une alimentation qui apporte tous les groupes d’aliments en bonnes proportions est dite :',
        options: ['équilibrée', 'sucrée', 'grasse', 'sèche'],
        bonne: 0,
        commentaire: 'C’est l’alimentation équilibrée — variée et en bonnes proportions — qui assure la meilleure croissance.',
      },
      {
        type: 'qcm',
        question: 'Une mauvaise alimentation peut provoquer :',
        options: ['un retard de croissance', 'des maladies', 'un amaigrissement', 'une meilleure santé'],
        bonnes: [0, 1, 2],
        commentaire: 'Manger mal ou trop peu retarde la croissance, affaiblit et rend malade — sûrement pas en meilleure santé !',
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
      {
        type: 'qcu',
        question: 'Les organes MÂLES de la fleur sont :',
        options: ['les étamines', 'le pistil', 'les sépales', 'les pétales'],
        bonne: 0,
        commentaire: 'Les étamines produisent le pollen : ce sont les organes mâles. Le pistil est l’organe femelle.',
      },
      {
        type: 'vraifaux',
        question: 'Après la fécondation, l’ovule se transforme en graine.',
        bonne: true,
        commentaire: 'L’ovule fécondé devient la graine — c’est elle qui donnera une nouvelle plante.',
      },
      {
        type: 'qcu',
        question: 'Après la fécondation, l’ovaire se transforme en :',
        options: ['fruit', 'racine', 'feuille', 'tige'],
        bonne: 0,
        commentaire: 'L’ovaire devient le fruit, qui protège la ou les graines.',
      },
      {
        type: 'qcm',
        question: 'Qui peut transporter le pollen d’une fleur à l’autre ?',
        options: ['Les insectes', 'Le vent', 'L’Homme', 'Une pluie de pierres'],
        bonnes: [0, 1, 2],
        commentaire: 'Insectes, vent et même l’Homme assurent la pollinisation en transportant le pollen.',
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
      {
        type: 'vraifaux',
        question: 'Une graine peut germer sans eau.',
        bonne: false,
        commentaire: 'Impossible : l’eau est indispensable — c’est elle qui fait gonfler la graine et la « réveille ».',
      },
      {
        type: 'qcu',
        question: 'Une graine trop vieille :',
        options: ['germe mal ou pas du tout', 'germe encore mieux', 'devient une fleur', 'devient un fruit'],
        bonne: 0,
        commentaire: 'L’âge est un facteur interne : une graine trop vieille perd son pouvoir de germination.',
      },
      {
        type: 'qcu',
        question: 'La jeune plante issue de la germination s’appelle :',
        options: ['la plantule', 'le fruit', 'le pollen', 'l’ovule'],
        bonne: 0,
        commentaire: 'La plantule est la petite plante (radicule + tigelle + premières feuilles) sortie de la graine.',
      },
      {
        type: 'qcm',
        question: 'Quelles conditions favorisent la germination d’une graine ?',
        options: ['De l’eau', 'De l’air', 'Une température convenable', 'L’obscurité totale obligatoire'],
        bonnes: [0, 1, 2],
        commentaire: 'Eau + air + température convenable : les trois conditions externes de la germination.',
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
      {
        type: 'qcu',
        question: 'Chez les mammifères, la cellule reproductrice MÂLE est :',
        options: ['le spermatozoïde', 'l’ovule', 'le pollen', 'la radicule'],
        bonne: 0,
        commentaire: 'Le spermatozoïde est la cellule mâle ; l’ovule est la cellule femelle.',
      },
      {
        type: 'vraifaux',
        question: 'Après la naissance, le petit mammifère est nourri du lait de sa mère.',
        bonne: true,
        commentaire: 'C’est même ce qui donne leur nom aux mammifères : les mamelles produisent le lait qui nourrit le petit.',
      },
      {
        type: 'qcu',
        question: 'La période pendant laquelle le petit se développe dans le ventre de sa mère s’appelle :',
        options: ['la gestation', 'la germination', 'l’incubation', 'la floraison'],
        bonne: 0,
        commentaire: 'C’est la gestation (l’incubation, elle, concerne les œufs couvés des oiseaux).',
      },
      {
        type: 'qcm',
        question: 'Quelles caractéristiques décrivent la reproduction des mammifères ?',
        options: ['Fécondation interne', 'Développement interne', 'Viviparité', 'Ponte d’œufs'],
        bonnes: [0, 1, 2],
        commentaire: 'Fécondation interne + développement interne + viviparité : pas de ponte d’œufs chez les mammifères étudiés.',
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
      {
        type: 'qcu',
        question: 'Le fait de couver les œufs pour les garder au chaud s’appelle :',
        options: ['l’incubation', 'la gestation', 'la germination', 'l’éclosion'],
        bonne: 0,
        commentaire: 'La poule couve ses œufs : c’est l’incubation, qui maintient l’œuf aux environs de 38 °C.',
      },
      {
        type: 'qcu',
        question: 'La sortie du poussin hors de l’œuf s’appelle :',
        options: ['l’éclosion', 'la ponte', 'la fécondation', 'la germination'],
        bonne: 0,
        commentaire: 'À l’éclosion, le poussin casse la coquille et sort de l’œuf.',
      },
      {
        type: 'vraifaux',
        question: 'Chez les oiseaux, la fécondation a lieu à l’intérieur du corps de la poule.',
        bonne: true,
        commentaire: 'La fécondation est interne — c’est le développement de l’œuf pondu qui, lui, est externe.',
      },
      {
        type: 'qcm',
        question: 'Que sait-on de la poule ?',
        options: ['Elle pond des œufs', 'Elle est ovipare', 'Elle couve ses œufs', 'Elle allaite ses petits'],
        bonnes: [0, 1, 2],
        commentaire: 'La poule pond, couve : elle est ovipare. L’allaitement, c’est l’affaire des mammifères !',
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
      { type: 'qcu', question: 'Avec quel instrument mesure-t-on la MASSE d’un corps ?', options: ['Un dynamomètre', 'Une balance', 'Un thermomètre', 'Un voltmètre'], bonne: 1, commentaire: 'La masse (en kilogrammes) se mesure avec une balance ; le dynamomètre, lui, mesure le poids — une force, en newtons.' },
      { type: 'qcu', question: 'Le poids d’un corps s’exprime en :', options: ['kilogrammes (kg)', 'newtons (N)', 'mètres (m)', 'litres (L)'], bonne: 1, commentaire: 'Le poids est une force : il s’exprime en newtons (N). La masse, elle, s’exprime en kilogrammes.' },
      { type: 'qcu', question: 'Quelle relation lie le poids P, la masse m et l’intensité de la pesanteur g ?', options: ['P = m + g', 'P = m × g', 'P = m ÷ g', 'P = g ÷ m'], bonne: 1, commentaire: 'P = m × g, avec g ≈ 10 N/kg sur Terre — c’est la formule du refrain !' },
      { type: 'vraifaux', question: 'Quand un astronaute va de la Terre à la Lune, sa masse change mais son poids reste le même.', bonne: false, commentaire: 'C’est l’inverse : la masse ne change jamais (m = constante), mais le poids varie car g change avec le lieu.' },
      { type: 'qcu', question: 'Sur la Lune, l’intensité de la pesanteur vaut environ :', options: ['1,6 N/kg', '10 N/kg', '0 N/kg', '100 N/kg'], bonne: 0, commentaire: 'g(Lune) ≈ 1,6 N/kg : le poids y est environ 6 fois plus faible que sur Terre — P(Lune) = m × 1,6.' },
      { type: 'courte', question: 'Un sac a une masse de 5 kg. Avec g = 10 N/kg, calcule son poids (en newtons).', motsCles: [['50']], reponseAffichee: 'P = m × g = 5 × 10 = 50 N.', commentaire: 'On applique P = m × g : 5 kg × 10 N/kg = 50 N.' },
      { type: 'qcu', question: 'La masse volumique ρ d’un corps se calcule par :', options: ['ρ = m × V', 'ρ = m ÷ V', 'ρ = V ÷ m', 'ρ = m + V'], bonne: 1, commentaire: 'ρ = m / V : la masse volumique compare la masse au volume. Elle s’exprime en kg/m³ ou en g/cm³.' },
      { type: 'qcm', question: 'Quels sont les QUATRE caractères d’une force ?', options: ['Un point d’application', 'Une direction', 'Un sens', 'Une intensité', 'Une couleur'], bonnes: [0, 1, 2, 3], commentaire: 'Point d’application, direction, sens, intensité (mesurée au dynamomètre, en newtons) : les 4 caractères de toute force.' },
      { type: 'qcm', question: 'Deux forces maintiennent un solide en équilibre si elles ont :', options: ['la même droite d’action', 'la même intensité', 'des sens contraires', 'la même couleur'], bonnes: [0, 1, 2], commentaire: 'Trois conditions, pas une de moins : même droite d’action, même intensité, sens contraires (F₁ + F₂ = 0).' },
      { type: 'qcu', question: 'D’après la poussée d’Archimède, un objet plongé dans l’eau FLOTTE si :', options: ['il est moins dense que l’eau', 'il est plus dense que l’eau', 'il pèse plus de 1 kg', 'il est en métal'], bonne: 0, commentaire: 'L’eau exerce une poussée vers le haut : moins dense que l’eau → je flotte ; plus dense → je coule au fond.' },
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
      { type: 'qcu', question: 'Le travail d’une force constante F qui déplace son point d’application d’une longueur d dans sa direction est :', options: ['W = F + d', 'W = F × d', 'W = F ÷ d', 'W = d ÷ F'], bonne: 1, commentaire: 'W = F × d (cas où la force suit le chemin, θ = 0°) — la formule générale étant W = F × d × cos θ.' },
      { type: 'qcu', question: 'Le travail s’exprime en :', options: ['newtons (N)', 'joules (J)', 'watts (W)', 'volts (V)'], bonne: 1, commentaire: 'Le travail (et l’énergie) s’expriment en joules (J).' },
      { type: 'qcu', question: 'Une force qui AIDE le mouvement effectue un travail :', options: ['moteur', 'résistant', 'nul', 'invisible'], bonne: 0, commentaire: 'Si la force aide le mouvement, son travail est moteur ; si elle le freine, il est résistant.' },
      { type: 'qcu', question: 'La puissance, qui indique la RAPIDITÉ du travail, est donnée par :', options: ['P = W × t', 'P = W ÷ t', 'P = t ÷ W', 'P = W + t'], bonne: 1, commentaire: 'La puissance, c’est le travail divisé par la durée : P = W ÷ t, en watts (W).' },
      { type: 'qcu', question: 'Un watt correspond à :', options: ['1 joule par seconde', '1 newton par mètre', '1 kilogramme par seconde', '1 volt par ampère'], bonne: 0, commentaire: '1 watt = 1 joule par seconde : plus on fait le même travail vite, plus la puissance est grande.' },
      { type: 'courte', question: 'Une force de 20 N déplace une caisse de 5 m dans sa direction. Calcule le travail effectué (en joules).', motsCles: [['100']], reponseAffichee: 'W = F × d = 20 × 5 = 100 J.', commentaire: 'On applique W = F × d : 20 N × 5 m = 100 joules.' },
      { type: 'qcu', question: 'L’énergie cinétique d’un corps en mouvement se calcule par :', options: ['Ec = ½ × m × v²', 'Ec = m × g × h', 'Ec = m × v', 'Ec = F × d'], bonne: 0, commentaire: 'Ec = ½mv² : l’énergie de mouvement grandit très vite avec la vitesse (v au carré !).' },
      { type: 'qcu', question: 'L’énergie potentielle de pesanteur d’un corps situé à la hauteur h se calcule par :', options: ['Ep = m × g × h', 'Ep = ½ × m × v²', 'Ep = m ÷ h', 'Ep = g ÷ h'], bonne: 0, commentaire: 'Ep = mgh : c’est l’énergie « stockée » par l’altitude — là-haut, tu l’as trouvée !' },
      { type: 'qcm', question: 'L’énergie mécanique d’un corps comprend :', options: ['l’énergie cinétique (liée au mouvement)', 'l’énergie potentielle de pesanteur (liée à l’altitude)', 'l’énergie électrique', 'l’énergie chimique'], bonnes: [0, 1], commentaire: 'Em = Ec + Ep : l’énergie mécanique est la somme de l’énergie cinétique et de l’énergie potentielle de pesanteur.' },
      { type: 'vraifaux', question: 'Sans frottement, l’énergie mécanique se conserve : un corps qui descend perd de l’énergie potentielle et gagne de l’énergie cinétique.', bonne: true, commentaire: 'Em = Ec + Ep = constante sans frottement : ce qui descend prend de la vitesse — comme sur des montagnes russes !' },
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
      { type: 'qcu', question: 'L’électrolyse de l’eau produit :', options: ['du dioxygène uniquement', 'du dihydrogène uniquement', 'du dihydrogène ET du dioxygène', 'du dioxyde de carbone'], bonne: 2, commentaire: 'L’électrolyse décompose l’eau : 2 H₂O → 2 H₂ + O₂.' },
      { type: 'qcu', question: 'Lors de l’électrolyse de l’eau, le gaz qui se dégage à la CATHODE est :', options: ['le dihydrogène', 'le dioxygène', 'le dioxyde de carbone', 'la vapeur d’eau'], bonne: 0, commentaire: 'Cathode → dihydrogène (deux volumes) ; anode → dioxygène (un volume).' },
      { type: 'vraifaux', question: 'Dans l’électrolyse de l’eau, le volume de dihydrogène recueilli est le double du volume de dioxygène.', bonne: true, commentaire: 'V(H₂) : V(O₂) = 2 : 1 — « H₂ double, O₂ simple », comme dans le refrain !' },
      { type: 'qcu', question: 'Quel gaz détone (aboie) à l’approche d’une flamme ?', options: ['Le dioxygène', 'Le dihydrogène', 'Le dioxyde de carbone', 'La vapeur d’eau'], bonne: 1, commentaire: 'Le dihydrogène produit une petite détonation ; le dioxygène, lui, ravive une bûchette incandescente.' },
      { type: 'qcu', question: 'La synthèse de l’eau (2 H₂ + O₂ → 2 H₂O) se fait avec :', options: ['une explosion — le mélange est détonant', 'un simple refroidissement', 'une électrolyse', 'une filtration'], bonne: 0, commentaire: 'Deux volumes de H₂ et un de O₂ forment un mélange détonant : la synthèse est explosive — attention danger !' },
      { type: 'vraifaux', question: 'L’eau est un corps composé, formé d’hydrogène et d’oxygène.', bonne: true, commentaire: 'L’électrolyse et la synthèse le prouvent : l’eau (H₂O) est composée d’hydrogène et d’oxygène.' },
      { type: 'qcu', question: 'Quelle est la formule générale des ALCANES ?', options: ['CₙH₂ₙ₊₂', 'CₙHₙ', 'CₙH₂ₙ', 'C₂ₙHₙ'], bonne: 0, commentaire: 'Les alcanes suivent CₙH₂ₙ₊₂ : méthane CH₄, éthane C₂H₆, propane C₃H₈, butane C₄H₁₀ — une même famille !' },
      { type: 'qcu', question: 'Quelle est la formule chimique du butane (4 atomes de carbone) ?', options: ['CH₄', 'C₂H₆', 'C₃H₈', 'C₄H₁₀'], bonne: 3, commentaire: 'Le butane, C₄H₁₀ : 4 carbones et 10 hydrogènes — le méthane CH₄ n’en a qu’un.' },
      { type: 'qcm', question: 'La combustion COMPLÈTE du butane produit :', options: ['du dioxyde de carbone', 'de l’eau', 'du monoxyde de carbone', 'des suies (carbone)'], bonnes: [0, 1], commentaire: 'Complète : 2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O. Incomplète (air insuffisant) : du CO se forme — danger !' },
      { type: 'courte', question: 'Quel gaz toxique et inodore se forme lors d’une combustion incomplète du butane ?', motsCles: [['monoxyde', 'oxyde de carbone']], reponseAffichee: 'Le monoxyde de carbone (CO).', commentaire: 'Le monoxyde de carbone (CO) est mortel : il faut toujours bien aérer — fenêtre ouverte !' },
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
      { type: 'qcu', question: 'En chimie, OXYDER un corps, c’est :', options: ['lui faire gagner de l’oxygène', 'lui faire perdre de l’oxygène', 'le refroidir', 'le dissoudre dans l’eau'], bonne: 0, commentaire: 'Oxydation : gain d’oxygène ; réduction : perte d’oxygène. Le réducteur arrache l’oxygène, l’oxydant le donne.' },
      { type: 'qcu', question: 'La limaille de fer qui brûle dans le dioxygène forme :', options: ['l’oxyde magnétique de fer Fe₃O₄', 'du dioxyde de carbone', 'de l’eau', 'du calcaire'], bonne: 0, commentaire: '3 Fe + 2 O₂ → Fe₃O₄ : l’oxyde magnétique de fer.' },
      { type: 'qcu', question: 'Quel gaz trouble l’eau de chaux ?', options: ['Le dioxyde de carbone (CO₂)', 'Le dioxygène', 'Le dihydrogène', 'L’azote'], bonne: 0, commentaire: 'C + O₂ → CO₂, et CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O : l’eau de chaux qui se trouble démasque le gaz carbonique.' },
      { type: 'qcu', question: 'Dans la réaction Fe₂O₃ + 2 Al → Al₂O₃ + 2 Fe, le RÉDUCTEUR est :', options: ['l’aluminium', 'l’oxyde de fer Fe₂O₃', 'le fer produit', 'la chaleur'], bonne: 0, commentaire: 'L’aluminium arrache l’oxygène à l’oxyde de fer : il est réducteur ; l’oxyde ferrique, qui le donne, est l’oxydant.' },
      { type: 'qcu', question: 'Une solution dont le pH est égal à 7 est :', options: ['acide', 'basique', 'neutre', 'salée'], bonne: 2, commentaire: 'Le pH gradue de 0 à 14 : moins de 7 acide, 7 neutre (comme l’eau), plus de 7 basique.' },
      { type: 'qcu', question: 'Le jus de citron a un pH voisin de 2. C’est une solution :', options: ['acide', 'neutre', 'basique', 'sans pH'], bonne: 0, commentaire: 'pH 2 < 7 : le jus de citron est nettement acide.' },
      { type: 'vraifaux', question: 'Plus le pH d’une solution est petit devant 7, plus la solution est acide.', bonne: true, commentaire: 'L’acidité augmente quand le pH diminue : pH 2 est plus acide que pH 5.' },
      { type: 'classement', question: 'Classe ces solutions de la PLUS ACIDE à la PLUS BASIQUE :', items: ['pH = 13', 'pH = 2', 'pH = 7'], ordre: [1, 2, 0], commentaire: 'Du plus acide au plus basique : pH 2 (acide) → pH 7 (neutre) → pH 13 (basique).' },
      { type: 'qcu', question: 'Dans une solution BASIQUE, le B.B.T. prend la couleur :', options: ['jaune', 'verte', 'bleue', 'rouge'], bonne: 2, commentaire: 'B.B.T. : jaune en milieu acide, vert en milieu neutre, bleu en milieu basique — on peut aussi lire le pH au papier pH ou au pH-mètre.' },
      { type: 'qcu', question: 'Pour diluer un acide concentré en toute sécurité, on verse :', options: ['l’acide dans l’eau, lentement', 'l’eau dans l’acide, rapidement', 'les deux en même temps', 'peu importe l’ordre'], bonne: 0, commentaire: 'Toujours l’ACIDE dans l’EAU, lentement et avec protection : le pH remonte vers 7 et la solution devient moins dangereuse (C₁V₁ = C₂V₂).' },
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
      { type: 'qcu', question: 'Une lentille à bords minces est une lentille :', options: ['convergente', 'divergente', 'plane', 'opaque'], bonne: 0, commentaire: 'Bords minces = convergente (elle rassemble la lumière) ; bords épais = divergente (elle l’écarte).' },
      { type: 'qcu', question: 'Une lentille à bords épais est une lentille :', options: ['divergente', 'convergente', 'plane', 'colorée'], bonne: 0, commentaire: 'Bords épais = divergente — sa vergence est négative (C < 0), celle d’une convergente est positive (C > 0).' },
      { type: 'qcu', question: 'La vergence C d’une lentille se calcule par :', options: ['C = 1 ÷ f', 'C = f', 'C = f × f', 'C = 2 × f'], bonne: 0, commentaire: 'C = 1/f : la vergence est l’inverse de la distance focale (f en mètres).' },
      { type: 'qcu', question: 'La vergence s’exprime en :', options: ['mètres (m)', 'dioptries (δ)', 'newtons (N)', 'degrés (°)'], bonne: 1, commentaire: 'La vergence s’exprime en dioptries : 1 δ = 1 m⁻¹, quand f est en mètres.' },
      { type: 'vraifaux', question: 'Plus la distance focale d’une lentille convergente est petite, plus la lentille est convergente.', bonne: true, commentaire: 'f petite → C = 1/f grande : la lentille fait converger la lumière plus fortement.' },
      { type: 'courte', question: 'Une lentille a une distance focale f = 0,5 m. Calcule sa vergence (en dioptries).', motsCles: [['2']], reponseAffichee: 'C = 1 ÷ f = 1 ÷ 0,5 = 2 dioptries (δ).', commentaire: 'C = 1/f : 1 ÷ 0,5 m = 2 δ.' },
      { type: 'qcu', question: 'Chez l’œil MYOPE, l’image d’un objet lointain se forme :', options: ['avant la rétine', 'derrière la rétine', 'exactement sur la rétine', 'sur le cristallin'], bonne: 0, commentaire: 'L’œil myope est trop convergent : l’image tombe AVANT la rétine — d’où la vision floue de loin.' },
      { type: 'qcu', question: 'On corrige la MYOPIE avec une lentille :', options: ['divergente', 'convergente', 'plane', 'teintée'], bonne: 0, commentaire: 'Myopie → verre divergent, de vergence négative : C(verre) < 0. Et le tableau redevient net !' },
      { type: 'qcu', question: 'Chez l’HYPERMÉTROPE, l’image se forme derrière la rétine. On le corrige avec une lentille :', options: ['convergente', 'divergente', 'plane', 'sans vergence'], bonne: 0, commentaire: 'Hypermétropie → verres convergents, C(verre) > 0 — et Fatou lit sans plus se tordre !' },
      { type: 'qcu', question: 'La PRESBYTIE, qui gêne la vision de près, est due :', options: ['au cristallin qui vieillit et n’accommode plus', 'à un œil trop long', 'à une rétine colorée', 'aux paupières'], bonne: 0, commentaire: 'Avec l’âge, le cristallin fatigue et n’accommode plus de près : on lit avec un verre convergent.' },
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
      { type: 'qcu', question: 'La loi d’Ohm s’écrit :', options: ['U = R × I', 'U = R + I', 'R = U × I', 'I = U × R'], bonne: 0, commentaire: 'U = R × I : la tension (V) est égale à la résistance (Ω) multipliée par l’intensité (A).' },
      { type: 'qcu', question: 'La résistance R s’exprime en :', options: ['volts (V)', 'ampères (A)', 'ohms (Ω)', 'watts (W)'], bonne: 2, commentaire: 'R en ohms (Ω), U en volts (V), I en ampères (A).' },
      { type: 'qcu', question: 'La caractéristique U = f(I) d’un conducteur ohmique est :', options: ['une droite qui passe par l’origine', 'un cercle', 'une parabole', 'une droite qui évite l’origine'], bonne: 0, commentaire: 'La tension est proportionnelle à l’intensité : la caractéristique est une droite passant par l’origine, et R est sa pente.' },
      { type: 'courte', question: 'Un résistor de R = 100 Ω est traversé par un courant d’intensité I = 0,2 A. Calcule la tension U (en volts).', motsCles: [['20']], reponseAffichee: 'U = R × I = 100 × 0,2 = 20 V.', commentaire: 'On applique la loi d’Ohm : U = R × I = 100 Ω × 0,2 A = 20 volts.' },
      { type: 'qcm', question: 'Dans un circuit EN SÉRIE :', options: ['l’intensité est la même en tout point', 'les tensions s’ajoutent', 'les intensités s’ajoutent', 'la tension est la même aux bornes de chaque dipôle'], bonnes: [0, 1], commentaire: 'En série : I = I₁ = I₂, U = U₁ + U₂ — et les résistances s’ajoutent aussi : R(éq) = R₁ + R₂.' },
      { type: 'vraifaux', question: 'Dans un circuit en dérivation, la tension aux bornes de chaque branche est la même et les intensités s’additionnent.', bonne: true, commentaire: 'En dérivation : U = U₁ = U₂ et I = I₁ + I₂ (la loi des nœuds ne ment jamais) ; 1/R(éq) = 1/R₁ + 1/R₂.' },
      { type: 'qcu', question: 'La puissance électrique reçue par un dipôle est :', options: ['P = U × I', 'P = U + I', 'P = U ÷ I', 'P = I ÷ U'], bonne: 0, commentaire: 'P = U × I, en watts (W) : c’est elle qu’on lit sur les appareils (ex. 60 W).' },
      { type: 'qcu', question: 'L’énergie électrique consommée par un appareil se calcule par :', options: ['E = P × t', 'E = P ÷ t', 'E = U ÷ I', 'E = R × I'], bonne: 0, commentaire: 'E = P × t : en joules si P est en watts et t en secondes — ou en kWh si P est en kW et t en heures.' },
      { type: 'qcu', question: 'Le compteur électrique de la maison mesure l’énergie consommée en :', options: ['kilowattheures (kWh)', 'volts (V)', 'ohms (Ω)', 'newtons (N)'], bonne: 0, commentaire: 'Le compteur parle en kilowattheures — c’est lui qui fait payer la facture ! E(kWh) = P(kW) × t(h).' },
      { type: 'qcu', question: 'Une lampe alimentée SOUS sa tension nominale (U < Un) :', options: ['éclaire faiblement', 'éclaire normalement', 'risque de griller aussitôt', 'change de couleur'], bonne: 0, commentaire: 'U < Un : éclat faible ; U = Un : fonctionnement normal ; U > Un : risque de détérioration — ne dépasse pas la tension nominale !' },
    ],
  },

  // ─── Physique-Chimie 6e ───
  // Les questions illustrées (image/imageAlt) font reconnaître les symboles
  // normalisés : lampe, générateur, fil, interrupteur, moteur.
  {
    slug: 'pc6-chant-1',
    discipline: 'Physique-Chimie',
    niveau: 'Sixième',
    numero: 1,
    titre: 'Fais passer le courant',
    lecon: 'Le circuit électrique',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/ressources/Physique-Chimie-6e-Le-on-1---Fais-passer-le-courant-esbyv3mJRPhL63YfvgrnWifczqmrrE.mp4',
    quiz: [
      { type: 'qcm', question: 'Pour réaliser un circuit électrique simple, il faut obligatoirement :', options: ['un générateur (une pile)', 'un récepteur (une lampe ou un moteur)', 'des fils conducteurs', 'un morceau de plastique'], bonnes: [0, 1, 2], commentaire: 'Générateur + récepteur + fils conducteurs → circuit électrique. Le plastique est un isolant : il ne sert pas à faire passer le courant.' },
      { type: 'qcu', question: 'Observe ce symbole normalisé. Quel élément du circuit représente-t-il ?', image: '/images/quiz/circuit/symbole-lampe.svg', imageAlt: 'Un cercle barré d’une croix, relié par un trait de chaque côté', options: ['la lampe', 'le moteur', 'la pile (le générateur)', 'l’interrupteur'], bonne: 0, commentaire: 'Le cercle barré d’une croix est le symbole de la LAMPE. C’est un récepteur, un dipôle à deux bornes : le plot et le culot.' },
      { type: 'qcu', question: 'Observe ce symbole normalisé. Quel élément du circuit représente-t-il ?', image: '/images/quiz/circuit/symbole-generateur.svg', imageAlt: 'Deux traits parallèles, un long marqué + et un court marqué −', options: ['le générateur (la pile)', 'la lampe', 'le moteur', 'un fil conducteur'], bonne: 0, commentaire: 'Deux traits parallèles : c’est la PILE, le générateur qui fournit l’énergie. Le trait LONG marque la borne +, le trait COURT la borne −.' },
      { type: 'qcu', question: 'Observe ce symbole normalisé de l’interrupteur. Dans cette position :', image: '/images/quiz/circuit/symbole-interrupteur.svg', imageAlt: 'Un trait coupé par un petit levier relevé entre deux points', options: ['il est ouvert : le courant ne passe pas', 'il est fermé : le courant passe', 'il est cassé, il faut le changer', 'il laisse passer le courant dans un seul sens'], bonne: 0, commentaire: 'Le levier relevé laisse un vide dans le chemin : l’interrupteur est OUVERT, le circuit est coupé. Quand on l’abaisse, il ferme le chemin et le courant peut circuler.' },
      { type: 'vraifaux', question: 'Observe ce symbole normalisé : il représente une lampe.', image: '/images/quiz/circuit/symbole-moteur.svg', imageAlt: 'Un cercle contenant la lettre M, relié par un trait de chaque côté', bonne: false, commentaire: 'Faux : le cercle avec la lettre M est le symbole du MOTEUR. C’est un récepteur : quand le courant passe, son axe peut tourner. La lampe, elle, est un cercle barré d’une croix.' },
      { type: 'qcu', question: 'Sur ce schéma, la pile, l’interrupteur et la lampe sont reliés par des fils (de simples traits). L’interrupteur est ouvert. Que se passe-t-il ?', image: '/images/quiz/circuit/schema-circuit-ouvert.svg', imageAlt: 'Schéma : une pile, un interrupteur ouvert et une lampe reliés en boucle par des fils', options: ['la lampe reste éteinte : la boucle n’est pas fermée, le courant est coupé', 'la lampe brille normalement', 'la lampe brille plus fort', 'la pile se vide aussitôt'], bonne: 0, commentaire: 'Le courant ne circule que dans une boucle conductrice FERMÉE comprenant un générateur. Interrupteur ouvert = chemin coupé = lampe éteinte. On le ferme : la lampe s’allume.' },
      { type: 'qcu', question: 'Dans les fils, à l’extérieur de la pile, le sens conventionnel du courant va :', options: ['de la borne + vers la borne −', 'de la borne − vers la borne +', 'dans les deux sens en même temps', 'il n’a pas de sens'], bonne: 0, commentaire: 'Sens conventionnel : du plus vers le moins dans les fils extérieurs au générateur. On le trace par une flèche sur le schéma.' },
      { type: 'vraifaux', question: 'Le plastique est un conducteur : il laisse passer le courant électrique.', bonne: false, commentaire: 'Faux : le plastique est un ISOLANT, il s’oppose au passage du courant. Le cuivre, lui, est un conducteur : c’est pour cela que les fils sont en cuivre… gainés de plastique !' },
      { type: 'courte', question: 'Comment appelle-t-on l’élément du circuit qui fournit l’énergie électrique (par exemple la pile) ?', motsCles: [['generateur']], reponseAffichee: 'Le générateur.', commentaire: 'La pile est le GÉNÉRATEUR : elle fournit l’énergie. La lampe et le moteur reçoivent cette énergie : ce sont des récepteurs.' },
      { type: 'classement', question: 'Ma lampe reste éteinte ! Remets dans l’ordre les étapes de la bonne démarche, en sécurité.', items: ['Je coupe le circuit avant d’observer', 'Je cherche la panne : pile usée ? lampe abîmée ? fil débranché ?', 'Je teste avec le professeur, sur une petite pile', 'Je schématise une boucle claire et lisible'], ordre: [0, 1, 2, 3], commentaire: 'Sécurité d’abord : on COUPE le circuit avant tout contrôle, on cherche la panne, on teste uniquement sur une petite pile et sous encadrement, puis on dessine un schéma clair avec les symboles.' },
      // Représentations du cours : pile plate (1.1), pile cylindrique (1.2),
      // bornes de la lampe (2), montages qui allument la lampe (3, 4), schéma (4.2)
      { type: 'qcu', question: 'Observe cette pile plate. Laquelle de ses deux lames est la borne négative (−) ?', image: '/images/quiz/circuit/pile-plate-bornes.svg', imageAlt: 'Une pile plate vue de face, avec une lame longue et une lame courte qui dépassent du haut', options: ['la lame la plus longue', 'la lame la plus courte', 'les deux lames', 'aucune : les bornes sont sous la pile'], bonne: 0, commentaire: 'Sur une pile plate, la lame LONGUE est la borne négative (−) et la lame COURTE la borne positive (+).' },
      { type: 'qcu', question: 'Observe cette pile cylindrique. Où se trouve sa borne positive (+) ?', image: '/images/quiz/circuit/pile-cylindrique-bornes.svg', imageAlt: 'Une pile cylindrique vue de face, avec un petit téton sur le dessus et un fond plat', options: ['sur le petit téton du dessus', 'sur le fond plat', 'sur le côté', 'une pile cylindrique n’a pas de borne +'], bonne: 0, commentaire: 'Le petit téton du dessus est la borne positive (+) ; le fond plat est la borne négative (−).' },
      { type: 'qcu', question: 'Observe cette lampe. Comment s’appellent ses deux bornes ?', image: '/images/quiz/circuit/lampe-bornes.svg', imageAlt: 'Une lampe : l’ampoule en verre, la partie métallique à vis et la pointe au bout', options: ['le culot et le plot central', 'le verre et le filament', 'la borne + et la borne −', 'la lame et le téton'], bonne: 0, commentaire: 'Le CULOT (la partie métallique à vis) et le PLOT CENTRAL (la pointe au bout) : ce sont les deux bornes de la lampe, un dipôle.' },
      { type: 'qcu', question: 'Pour allumer cette lampe avec une pile plate, sans fil de connexion, je dois :', image: '/images/quiz/circuit/montage-pile-plate.svg', imageAlt: 'Une lampe posée sur une pile plate : son plot touche la lame courte et son culot touche la lame longue', options: ['mettre le plot sur une lame et le culot sur l’autre lame', 'poser la lampe sur une seule lame', 'mettre le plot et le culot sur la même lame', 'poser la lampe sur le dessus de la pile, loin des lames'], bonne: 0, commentaire: 'Chaque borne de la lampe doit toucher une borne différente de la pile : le plot sur une lame, le culot sur l’autre. Le courant traverse alors la lampe, qui s’allume.' },
      { type: 'qcu', question: 'Avec une pile cylindrique, le plot de la lampe touche déjà une borne de la pile. Que faut-il faire pour que la lampe s’allume ?', image: '/images/quiz/circuit/montage-pile-cylindrique.svg', imageAlt: 'Une lampe posée sur le téton d’une pile cylindrique ; un fil relie le fond de la pile au culot de la lampe', options: ['relier le culot à l’autre borne de la pile avec un fil de connexion', 'relier le culot à la même borne avec un fil', 'poser une deuxième lampe à côté', 'retourner la pile'], bonne: 0, commentaire: 'Plot sur une borne, culot relié à l’AUTRE borne par un fil de connexion : la boucle est fermée, la lampe s’allume. Que le plot touche le + ou le −, l’important est de relier les deux bornes de la lampe aux deux bornes de la pile.' },
      { type: 'qcu', question: 'Voici le schéma normalisé du circuit. Quels éléments reconnais-tu : en haut, en bas à gauche, en bas à droite ?', image: '/images/quiz/circuit/schema-circuit-ouvert.svg', imageAlt: 'Schéma : en haut un cercle barré d’une croix, en bas à gauche un interrupteur ouvert, en bas à droite deux traits parallèles', options: ['une lampe, un interrupteur, une pile', 'une pile, un interrupteur, une lampe', 'un moteur, une lampe, une pile', 'une lampe, une pile, un interrupteur'], bonne: 0, commentaire: 'En haut, le cercle barré d’une croix : la LAMPE. En bas à gauche, le levier relevé : l’INTERRUPTEUR (ouvert). En bas à droite, les deux traits parallèles : la PILE. Les traits qui les relient sont les fils de connexion.' },
    ],
  },
  {
    slug: 'pc6-chant-2',
    discipline: 'Physique-Chimie',
    niveau: 'Sixième',
    numero: 2,
    titre: 'Un geste pour commander',
    lecon: 'Commande d’un circuit électrique',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/ressources/Physique-Chimie-6e-Le-on-2---Commande-d-un-circuit-lectrique-M2iRYueVaT1WwHDuJjrxcSSN57J2bo.mp4',
    quiz: [
      // Propositions de longueurs voisines (relecture) : la bonne réponse ne doit
      // pas se repérer à sa taille — le détail va dans le commentaire.
      { type: 'qcu', question: 'Commander un circuit électrique, c’est :', options: ['ouvrir, fermer ou sélectionner un chemin', 'remplacer la pile du circuit par une neuve', 'ajouter une deuxième lampe dans le circuit', 'mesurer le courant qui passe dans les fils'], bonne: 0, commentaire: 'Commander, c’est agir sur le chemin électrique du courant : l’OUVRIR (le couper), le FERMER (le laisser passer) ou SÉLECTIONNER l’un de plusieurs chemins.' },
      { type: 'vraifaux', question: 'Quand je retire ma main d’un interrupteur, il revient tout seul à sa position de départ.', bonne: false, commentaire: 'Faux : l’interrupteur GARDE sa position quand ma main le laisse. C’est le bouton-poussoir qui revient automatiquement à sa position de repos.' },
      { type: 'qcu', question: 'Observe ce symbole normalisé. Dans cette position, l’interrupteur est :', image: '/images/quiz/circuit/symbole-interrupteur-ferme.svg', imageAlt: 'Un trait continu dont le levier, abaissé, relie les deux points de contact', options: ['fermé : le courant peut passer', 'ouvert : le courant est coupé', 'fermé : le courant est coupé', 'ouvert : le courant peut passer'], bonne: 0, commentaire: 'Le levier abaissé relie les deux contacts : l’interrupteur est FERMÉ et le courant peut passer. Levier relevé = interrupteur ouvert = courant coupé. Attention : en électricité, « fermé » veut dire que le chemin est continu, pas bloqué !' },
      { type: 'qcu', question: 'Pour comprendre une commande, on compare :', options: ['son état au repos et pendant l’action', 'sa couleur et sa taille sur la table', 'son prix et la marque du fabricant', 'le nombre de fils branchés sur ses bornes'], bonne: 0, commentaire: 'La bonne méthode : j’observe la commande AU REPOS, puis PENDANT L’ACTION, je compare les deux états, je dessine son symbole et j’explique sa fonction.' },
      { type: 'qcu', question: 'Observe ce symbole normalisé : un bouton-poussoir ouvert au repos. Que se passe-t-il quand j’appuie dessus ?', image: '/images/quiz/circuit/symbole-bouton-poussoir.svg', imageAlt: 'Deux points de contact séparés, une barre de contact au-dessus et une tige à pousser surmontée d’un bouton', options: ['il se ferme et le courant passe', 'il s’ouvre et le courant est coupé', 'il reste ouvert, rien ne change', 'il se bloque fermé pour toujours'], bonne: 0, commentaire: 'En appuyant, la barre vient toucher les deux contacts : le bouton se FERME et le courant passe tant que j’appuie. Dès que je relâche, il se rouvre.' },
      { type: 'qcu', question: 'Je relâche un bouton-poussoir ouvert au repos. Que devient-il ?', options: ['il revient ouvert et coupe le courant', 'il reste fermé et le courant passe', 'il garde la position que je lui ai donnée', 'il choisit un autre chemin pour le courant'], bonne: 0, commentaire: 'Un bouton-poussoir revient AUTOMATIQUEMENT à sa position de repos quand on le relâche : ouvert au repos, il revient à l’état ouvert et interrompt le courant dans sa branche. C’est l’interrupteur, lui, qui garde la position qu’on lui a donnée.' },
      { type: 'vraifaux', question: 'Un bouton-poussoir FERMÉ au repos s’ouvre quand on appuie dessus, puis se referme quand on le relâche.', bonne: true, commentaire: 'Vrai : c’est l’inverse du bouton ouvert au repos. Fermé au repos, j’appuie : il s’ouvre ; je relâche : il se referme encore.' },
      { type: 'qcu', question: 'Observe ce symbole normalisé : un commutateur. À quoi sert-il ?', image: '/images/quiz/circuit/symbole-commutateur.svg', imageAlt: 'Un point de contact à gauche dont le levier rejoint l’un des deux points de contact à droite', options: ['à choisir l’un de deux chemins', 'à couper le courant pour toujours', 'à fournir l’énergie au circuit', 'à allumer deux lampes en même temps'], bonne: 0, commentaire: 'Le commutateur SÉLECTIONNE un chemin parmi deux : selon la position du levier, c’est une lampe ou bien l’autre qui s’allume, jamais les deux à la fois.' },
      { type: 'qcu', question: 'Voici un montage va-et-vient. Combien de commutateurs comporte-t-il, et pour quoi faire ?', image: '/images/quiz/circuit/schema-va-et-vient.svg', imageAlt: 'Schéma : une pile à gauche, deux commutateurs reliés entre eux par deux fils, une lampe à droite', options: ['deux, pour commander une lampe de deux endroits', 'deux, pour allumer deux lampes différentes', 'un seul, pour allumer la lampe de deux endroits', 'aucun, la pile suffit à commander la lampe'], bonne: 0, commentaire: 'Un va-et-vient = DEUX commutateurs reliés par deux fils : chacun peut allumer ou éteindre la MÊME lampe, depuis deux points différents. Le schéma ne montre qu’une seule lampe, et un seul commutateur ne la commanderait que d’un endroit.' },
      { type: 'qcu', question: 'Dans un couloir, j’allume la lampe à l’entrée et je l’éteins à l’autre bout. Quel montage permet cela ?', options: ['un montage va-et-vient', 'un simple interrupteur', 'un seul bouton-poussoir', 'deux piles bout à bout'], bonne: 0, commentaire: 'Commander une même lampe depuis deux endroits différents, c’est exactement le rôle du montage VA-ET-VIENT : deux commutateurs reliés entre eux par deux fils.' },
      { type: 'classement', question: 'Remets dans l’ordre les étapes pour étudier une commande (le refrain de la chanson) :', items: ['J’observe la commande au repos', 'J’observe la commande pendant l’action', 'Je dessine son symbole', 'J’explique sa fonction'], ordre: [0, 1, 2, 3], commentaire: 'Au repos, puis pendant l’action, je dessine le symbole et j’explique la fonction : c’est la démarche pour comprendre n’importe quelle commande.' },
      { type: 'qcm', question: 'Parmi ces éléments, lesquels servent à COMMANDER un circuit ?', options: ['l’interrupteur', 'le bouton-poussoir', 'le commutateur', 'la lampe', 'la pile'], bonnes: [0, 1, 2], commentaire: 'Interrupteur, bouton-poussoir et commutateur sont des organes de commande : ils ouvrent, ferment ou sélectionnent un chemin. La lampe est un récepteur et la pile un générateur.' },
      { type: 'courte', question: 'Comment s’appelle la commande qui revient automatiquement à sa position de repos quand on la relâche ?', motsCles: [['poussoir']], reponseAffichee: 'Le bouton-poussoir.', commentaire: 'Le BOUTON-POUSSOIR : j’appuie, il change d’état ; je relâche, il revient tout seul au repos. L’interrupteur, lui, garde sa position.' },
      { type: 'courte', question: 'Comment s’appelle le montage qui permet de commander une même lampe depuis deux endroits différents ?', motsCles: [['va et vien', 'vas et vien']], reponseAffichee: 'Le montage va-et-vient.', commentaire: 'Le VA-ET-VIENT : deux commutateurs reliés entre eux, comme la lampe d’un couloir que l’on allume à l’entrée et que l’on éteint à l’autre bout.' },
      { type: 'qcu', question: 'En classe, avec quelle source réalise-t-on les montages de commande pour vérifier ses prévisions ?', options: ['une simple pile électrique', 'la prise de courant du mur', 'la batterie d’une voiture', 'aucune : on imagine le résultat'], bonne: 0, commentaire: 'Les montages se testent AVEC UNE PILE, sous encadrement : jamais la prise du secteur, qui est dangereuse. On prévoit, puis on vérifie avec la pile.' },
    ],
  },
  {
    slug: 'pc6-chant-3',
    discipline: 'Physique-Chimie',
    niveau: 'Sixième',
    numero: 3,
    titre: 'Protège le circuit',
    lecon: 'Court-circuit et protection des installations électriques',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/ressources/Physique-Chimie-6e-Le-on-3---Prot-ge-le-circuit-7IQ2n6FKth95faANiLf5J8U2KYJUkN.mp4',
    quiz: [
      { type: 'qcu', question: 'Un court-circuit, c’est :', options: ['deux bornes reliées par un très bon conducteur', 'deux bornes séparées par un isolant épais', 'une lampe branchée sur une pile neuve', 'un fil de connexion un peu trop long'], bonne: 0, commentaire: 'Un COURT-CIRCUIT, c’est deux bornes reliées par un très bon conducteur (un fil, un objet métallique) : le courant prend ce raccourci au lieu de passer par le récepteur.' },
      { type: 'qcu', question: 'Observe ce schéma : un fil relie directement les deux bornes de la lampe. Que se passe-t-il ?', image: '/images/quiz/circuit/schema-court-circuit.svg', imageAlt: 'Schéma : une pile, un interrupteur fermé, une lampe, et un fil supplémentaire qui relie directement les deux bornes de la lampe', options: ['la lampe s’éteint aussitôt', 'la lampe brille plus fort', 'la lampe clignote lentement', 'rien ne change dans le circuit'], bonne: 0, commentaire: 'Le fil contourne la lampe : le récepteur est COURT-CIRCUITÉ et s’éteint. Attention : la lampe étant le seul récepteur, ce fil relie aussi, à travers les fils et l’interrupteur fermé, les deux bornes de la PILE : un courant très intense circule et tout peut chauffer — il faut ouvrir l’interrupteur sans attendre.' },
      { type: 'qcu', question: 'Si l’on relie directement les deux bornes de la pile par un fil :', options: ['un courant très intense circule : tout peut chauffer', 'le courant s’arrête aussitôt dans tout le circuit', 'la pile se recharge toute seule pendant ce temps', 'la lampe s’allume juste un peu plus fort'], bonne: 0, commentaire: 'Court-circuiter la source, c’est le plus dangereux : un courant TRÈS INTENSE circule et les fils peuvent chauffer jusqu’à brûler.' },
      { type: 'classement', question: 'Remets dans l’ordre l’enchaînement qui rend un court-circuit dangereux :', items: ['Un court-circuit se produit', 'Le courant devient très intense (surintensité)', 'Les fils s’échauffent et peuvent brûler', 'Il faut interrompre le courant'], ordre: [0, 1, 2, 3], commentaire: 'Court-circuit → surintensité → échauffement : il faut INTERROMPRE le courant, c’est le rôle du fusible ou du disjoncteur.' },
      { type: 'qcm', question: 'Quels éléments protègent une installation en coupant le courant en cas de surintensité ?', options: ['le fusible', 'le disjoncteur', 'la lampe', 'la pile', 'le fil de connexion'], bonnes: [0, 1], commentaire: 'Le FUSIBLE et le DISJONCTEUR interrompent le courant en cas de surintensité : ils protègent les personnes et les biens. La lampe, la pile et les fils ne protègent rien.' },
      { type: 'qcu', question: 'Fusible et disjoncteur coupent le courant en cas de surintensité. Que protègent-ils ainsi ?', options: ['les personnes et les biens', 'seulement la pile du montage', 'uniquement la lampe voisine', 'rien : ils font briller la lampe'], bonne: 0, commentaire: 'Le FUSIBLE et le DISJONCTEUR interrompent le courant en cas de surintensité pour protéger les PERSONNES (les habitants) et les BIENS (l’installation) : sans eux, les fils peuvent chauffer et brûler.' },
      { type: 'qcu', question: 'Que fait le fusible quand le courant devient excessif ?', options: ['il fond et ouvre le circuit', 'il chauffe sans rien couper', 'il se referme tout seul', 'il fait briller la lampe'], bonne: 0, commentaire: 'Le fusible FOND lorsque le courant devient excessif : le circuit est ouvert, le courant ne passe plus. C’est son rôle de protection.' },
      { type: 'vraifaux', question: 'Un fusible qui a fondu se répare tout seul quand le courant redevient normal.', bonne: false, commentaire: 'Faux : un fusible fondu est hors d’usage. Il doit être correctement REMPLACÉ par un fusible du même type — jamais par un fil.' },
      { type: 'qcu', question: 'Que fait le disjoncteur quand une surintensité menace l’installation ?', options: ['il déclenche et coupe automatiquement', 'il fond comme le ferait un fusible', 'il augmente la force du courant', 'il allume un voyant rouge et attend'], bonne: 0, commentaire: 'Le DISJONCTEUR déclenche automatiquement : il coupe le courant. Contrairement au fusible, il ne fond pas : on peut le réarmer une fois le défaut corrigé.' },
      { type: 'qcu', question: 'Le disjoncteur a déclenché. Avant de le réarmer, je dois :', options: ['corriger le défaut qui a causé la coupure', 'le réarmer tout de suite plusieurs fois', 'remplacer le disjoncteur par un fil', 'attendre que le fusible refroidisse'], bonne: 0, commentaire: 'Le DÉFAUT doit être corrigé AVANT de réarmer le disjoncteur : sinon la surintensité revient aussitôt, et le danger avec elle.' },
      { type: 'qcu', question: 'Pourquoi ne faut-il JAMAIS remplacer un fusible par un fil métallique ?', options: ['cela supprime la protection contre un courant excessif', 'un fil métallique coûte bien plus cher qu’un fusible', 'la lampe ne pourrait plus jamais s’allumer ensuite', 'un fil métallique est beaucoup trop difficile à fixer'], bonne: 0, commentaire: 'Un fil ne fond pas : il laisse passer un courant excessif. Remplacer un fusible par un fil SUPPRIME la protection prévue — les fils peuvent chauffer et brûler.' },
      { type: 'qcm', question: 'Quelles situations créent un danger de court-circuit ?', options: ['un isolant abîmé', 'deux fils qui se touchent', 'des conducteurs mis à nu', 'un interrupteur ouvert', 'une lampe éteinte'], bonnes: [0, 1, 2], commentaire: 'Isolant abîmé, fils qui se touchent, conducteurs mis à nu : le courant peut prendre un raccourci. Un interrupteur ouvert ou une lampe éteinte ne créent aucun court-circuit.' },
      { type: 'classement', question: 'Remets dans l’ordre la démarche prudente pour chercher une panne sur un montage à pile :', items: ['Je coupe le courant', 'Je contrôle chaque élément utile', 'Je corrige le défaut trouvé', 'Je remplace correctement le fusible fondu (jamais par un fil)'], ordre: [0, 1, 2, 3], commentaire: 'Je COUPE, je CONTRÔLE chaque élément, je CORRIGE le défaut, puis je remplace correctement le fusible fondu — jamais par un fil.' },
      { type: 'vraifaux', question: 'Un élève peut chercher lui-même une panne sur une installation branchée sur le secteur.', bonne: false, commentaire: 'Faux : les élèves contrôlent uniquement des montages à petite pile. Sur le SECTEUR, c’est un adulte qualifié qui intervient.' },
      { type: 'courte', question: 'Comment s’appelle l’élément de protection qui FOND lorsque le courant devient excessif ?', motsCles: [['fusible']], reponseAffichee: 'Le fusible.', commentaire: 'Le FUSIBLE fond quand le courant devient excessif et ouvre le circuit. Une fois fondu, on le remplace correctement.' },
      { type: 'courte', question: 'Comment s’appelle l’élément de protection qui DÉCLENCHE automatiquement en cas de surintensité et que l’on peut réarmer ?', motsCles: [['disjoncteur']], reponseAffichee: 'Le disjoncteur.', commentaire: 'Le DISJONCTEUR déclenche automatiquement ; une fois le défaut corrigé, on peut le réarmer (il ne se remet pas en marche tout seul) — à la différence du fusible, qui fond et doit être remplacé.' },
      // Symbole normalisé du fusible (demandé par l'auteur : à maîtriser même s'il n'est pas dessiné dans le clip)
      { type: 'qcu', question: 'Observe ce symbole normalisé : un rectangle traversé par un trait. Quel élément de protection représente-t-il ?', image: '/images/quiz/circuit/symbole-fusible.svg', imageAlt: 'Un rectangle traversé dans sa longueur par un trait, relié par un trait de chaque côté', options: ['le fusible', 'la lampe', 'l’interrupteur', 'le moteur'], bonne: 0, commentaire: 'Un rectangle traversé par un trait : c’est le symbole du FUSIBLE, l’élément qui fond et ouvre le circuit quand le courant devient excessif. La lampe est un cercle barré d’une croix, le moteur un cercle avec un M, l’interrupteur un trait avec un levier.' },
    ],
  },
  {
    slug: 'pc6-chant-4',
    discipline: 'Physique-Chimie',
    niveau: 'Sixième',
    numero: 4,
    titre: 'La forme et le récipient',
    lecon: 'Solides et liquides',
    mediaType: null,
    mediaUrl: null, // clip audio de la banque (association automatique « Leçon 4 »)
    quiz: [
      { type: 'qcu', question: 'Un caillou ou un morceau de bois sont des :', options: ['solides compacts', 'solides divisés', 'liquides épais', 'gaz comprimés'], bonne: 0, commentaire: 'Caillou, morceau de bois : des SOLIDES COMPACTS. Ils gardent leur forme et on peut les prendre en main.' },
      { type: 'qcu', question: 'Le riz, le sel et le sable sont des :', options: ['solides divisés', 'solides compacts', 'liquides en grains', 'mélanges liquides'], bonne: 0, commentaire: 'Riz, sel, sable : des SOLIDES DIVISÉS, faits de grains. Chaque grain garde sa forme, même quand on les verse.' },
      { type: 'vraifaux', question: 'Quand on verse du sable, chaque grain garde sa forme.', bonne: true, commentaire: 'Vrai : le sable se verse, mais chaque grain reste un petit solide qui garde sa forme. C’est ce qui le distingue d’un liquide.' },
      { type: 'qcu', question: 'Un solide compact comme un caillou :', options: ['garde sa forme et se prend en main', 'prend la forme de son récipient', 'coule et glisse entre les doigts', 'change de volume quand on le verse'], bonne: 0, commentaire: 'Un solide compact a une FORME PROPRE : il la garde, et on peut le prendre en main. Prendre la forme du récipient ou couler entre les doigts, c’est le propre d’un liquide.' },
      { type: 'qcm', question: 'Pour comparer un solide et un liquide, qu’est-ce que j’observe ?', options: ['la forme', 'le volume', 'la façon de s’écouler', 'les grains et la surface au repos', 'la couleur du récipient'], bonnes: [0, 1, 2, 3], commentaire: 'J’observe les PROPRIÉTÉS : la forme, le volume, la façon de s’écouler, et je regarde aussi les grains et la surface au repos. Attention : le volume se conserve pour les deux ; ce sont la forme (propre ou non) et la surface au repos qui font vraiment la différence. La couleur du récipient n’a rien à voir.' },
      { type: 'vraifaux', question: 'Il suffit de verser un corps pour savoir si c’est un liquide.', bonne: false, commentaire: 'Faux : le sable aussi se verse ! Verser ne suffit pas : je regarde les grains (un solide divisé en a) et la surface au repos (celle d’un liquide est plane et horizontale).' },
      { type: 'qcu', question: 'L’eau versée dans un verre :', options: ['prend la forme du verre', 'garde sa forme en boule', 'devient un solide divisé', 'forme un tas au fond'], bonne: 0, commentaire: 'Un liquide n’a pas de forme propre : l’eau prend la forme du récipient qui la contient, elle coule et glisse entre les mains.' },
      { type: 'vraifaux', question: 'Un liquide a une forme propre.', bonne: false, commentaire: 'Faux : un liquide n’a pas de forme propre, il prend celle de son récipient. C’est le solide compact qui a une forme propre.' },
      { type: 'qcu', question: 'Je verse toute l’eau d’un flacon dans un verre, sans en perdre et à température constante. Son volume :', options: ['reste le même', 'devient plus grand', 'devient plus petit', 'dépend du verre'], bonne: 0, commentaire: 'Une même quantité de liquide GARDE SON VOLUME si rien ne se perd, à température constante — du flacon vers le verre, seule la forme change.' },
      { type: 'qcu', question: 'Observe ce verre incliné qui contient un liquide au repos. Comment est la surface libre du liquide ?', image: '/images/quiz/circuit/surface-libre.svg', imageAlt: 'Un verre penché posé sur une table ; le liquide qu’il contient a une surface bien horizontale, repérée par une ligne en pointillés', options: ['plane et horizontale', 'inclinée comme le verre', 'bombée vers le haut', 'en forme de tas'], bonne: 0, commentaire: 'La SURFACE LIBRE d’un liquide au repos est toujours PLANE et HORIZONTALE, même si le récipient est penché : je la trace au bon niveau.' },
      { type: 'qcu', question: 'Du sable déposé sur la table forme un tas. Que dois-je en conclure ?', options: ['le sable est un solide divisé', 'le sable est un solide compact', 'le sable est un liquide épais', 'le sable est un gaz'], bonne: 0, commentaire: 'Un liquide s’étale avec une surface plane et horizontale ; le sable, lui, forme un TAS : c’est un SOLIDE DIVISÉ, fait de grains qui sont des solides. Je ne dois pas me tromper !' },
      { type: 'qcu', question: 'Observe ce récipient de verrerie. Comment s’appelle-t-il ?', image: '/images/quiz/circuit/verrerie-becher.svg', imageAlt: 'Un récipient cylindrique en verre, large et ouvert, avec un petit bec verseur et des graduations', options: ['un bécher', 'un erlenmeyer', 'un verre à pied', 'un cristallisoir'], bonne: 0, commentaire: 'Cylindre large, ouvert, avec un bec verseur : c’est le BÉCHER. L’erlenmeyer, lui, a un col étroit et un fond large.' },
      { type: 'qcu', question: 'Observe ce récipient de verrerie. Comment s’appelle-t-il ?', image: '/images/quiz/circuit/verrerie-erlenmeyer.svg', imageAlt: 'Un récipient en verre en forme de cône, à fond plat large et à col étroit', options: ['un erlenmeyer', 'un bécher', 'un ballon', 'un tube à essais'], bonne: 0, commentaire: 'Fond large, parois en pente et col étroit : c’est l’ERLENMEYER. Le ballon est rond, le bécher est un cylindre.' },
      { type: 'qcu', question: 'Observe ce récipient de verrerie. Comment s’appelle-t-il ?', image: '/images/quiz/circuit/verrerie-eprouvette.svg', imageAlt: 'Un tube en verre haut et étroit, posé sur un pied, avec de nombreuses graduations sur toute sa hauteur', options: ['une éprouvette graduée', 'un cristallisoir en verre', 'un verre à pied', 'un tube à essais'], bonne: 0, commentaire: 'Haute, étroite, posée sur un pied et graduée sur toute sa hauteur : c’est l’ÉPROUVETTE GRADUÉE. Le tube à essais est petit, sans pied et sans graduations.' },
      { type: 'qcu', question: 'Observe ce récipient de verrerie. Comment s’appelle-t-il ?', image: '/images/quiz/circuit/verrerie-tube.svg', imageAlt: 'Un petit tube en verre étroit, ouvert en haut et arrondi au fond', options: ['un tube à essais', 'une éprouvette graduée', 'un bécher', 'un ballon'], bonne: 0, commentaire: 'Petit tube étroit au fond arrondi : c’est le TUBE À ESSAIS. L’éprouvette graduée est plus haute, posée sur un pied et graduée.' },
      { type: 'qcm', question: 'Que dois-je lire sur l’étiquette d’un flacon avant de m’en servir ?', options: ['le contenu', 'la quantité', 'les précautions', 'le prix du flacon', 'le nom du fabricant'], bonnes: [0, 1, 2], commentaire: 'Avant de me servir d’un flacon, je lis l’étiquette : le CONTENU, la QUANTITÉ et les PRÉCAUTIONS. Le prix et le fabricant ne servent pas à travailler en sécurité.' },
      { type: 'courte', question: 'Comment s’appelle la surface d’un liquide au repos, qui est plane et horizontale ?', motsCles: [['surface'], ['libre']], reponseAffichee: 'La surface libre.', commentaire: 'La SURFACE LIBRE d’un liquide au repos est plane et horizontale : c’est elle que je trace au bon niveau sur un schéma.' },
      { type: 'classement', question: 'Remets dans l’ordre les observations du refrain pour distinguer solide et liquide :', items: ['J’observe la forme', 'J’observe le volume', 'J’observe la façon de s’écouler', 'Je regarde les grains et la surface au repos'], ordre: [0, 1, 2, 3], commentaire: 'Le refrain : la forme, le volume, la façon de s’écouler — et comme verser ne suffit pas, je regarde aussi les grains et la surface au repos.' },
      { type: 'qcu', question: 'Lequel de ces corps est un liquide ?', options: ['l’eau', 'le sel', 'le sable', 'le riz'], bonne: 0, commentaire: 'L’EAU est un liquide : sans forme propre, elle prend la forme du récipient. Le sel, le sable et le riz sont des solides divisés.' },
      // Application de la diapositive 7 du clip vidéo
      { type: 'qcu', question: 'Le riz s’écoule quand on le verse. Est-ce un liquide ?', options: ['non, c’est un solide divisé fait de grains', 'oui, tout ce qui se verse est un liquide', 'oui, il prend la forme de son récipient', 'non, c’est un solide compact d’un seul bloc'], bonne: 0, commentaire: 'Non : le riz s’écoule, mais chaque grain est un petit solide qui garde sa forme — c’est un SOLIDE DIVISÉ. Pouvoir verser ne suffit pas pour reconnaître un liquide.' },
    ],
  },
  {
    slug: 'pc6-chant-5',
    discipline: 'Physique-Chimie',
    niveau: 'Sixième',
    numero: 5,
    titre: 'Invisible mais bien présent',
    lecon: 'Les gaz',
    mediaType: 'video',
    mediaUrl: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/ressources/Physique-Chimie-6e-Le-on-5---Les-gaz-54r84lZen95fg9YzE7UUJpRC5awC4J.mp4',
    quiz: [
      { type: 'vraifaux', question: 'L’air est invisible, donc ce n’est pas de la matière.', bonne: false, commentaire: 'Faux : invisible ne veut pas dire absent ! L’air est bien de la MATIÈRE : un ballon gonflé occupe de la place, des bulles dans l’eau montrent sa présence.' },
      { type: 'qcm', question: 'Quelles observations montrent que l’air est bien de la matière ?', options: ['un ballon gonflé occupe de la place', 'des bulles apparaissent dans l’eau', 'l’air est invisible', 'l’air n’a pas d’odeur'], bonnes: [0, 1], commentaire: 'Un ballon gonflé prend de la place et les bulles dans l’eau montrent la présence de l’air : il occupe un volume, c’est de la matière. Être invisible ou sans odeur ne prouve rien.' },
      { type: 'qcu', question: 'Un gaz placé dans un récipient :', options: ['remplit tout le récipient', 'reste au fond du récipient', 'garde sa forme en boule', 'flotte en haut sans bouger'], bonne: 0, commentaire: 'Un gaz occupe TOUT l’espace qui lui est proposé : il remplit le récipient qui le contient.' },
      { type: 'qcu', question: 'Contrairement à un solide, un gaz :', options: ['n’a ni forme propre ni volume propre', 'n’a pas de volume propre, mais une forme propre', 'n’a pas de forme propre, mais un volume propre', 'a une forme propre et un volume propre'], bonne: 0, commentaire: 'Un gaz n’a NI forme propre NI volume propre : il prend la forme du récipient et en remplit tout le volume. Le liquide, lui, garde son volume ; le solide garde forme et volume.' },
      { type: 'qcm', question: 'Quelles propriétés d’un gaz montrent qu’il est de la matière ?', options: ['compressible', 'expansible', 'élastique', 'invisible', 'incolore'], bonnes: [0, 1, 2], commentaire: 'Un gaz est COMPRESSIBLE, EXPANSIBLE et ÉLASTIQUE : on peut le comprimer, il peut se détendre et il reprend son volume. Ces propriétés montrent qu’il est de la matière.' },
      { type: 'courte', question: 'Complète le refrain : « Compressible, expansible, élastique aussi, un gaz est un ……… »', motsCles: [['fluide']], reponseAffichee: 'Un fluide.', commentaire: 'Un gaz est un FLUIDE : comme un liquide, il s’écoule et prend la forme de son récipient — et en plus, il est compressible, expansible et élastique.' },
      { type: 'qcu', question: 'Observe cette seringue bouchée : je pousse doucement le piston. Que se passe-t-il pour le gaz enfermé ?', image: '/images/quiz/circuit/seringue-comprimee.svg', imageAlt: 'Une seringue dont l’embout est bouché ; une flèche indique que l’on pousse le piston vers l’embout, le gaz enfermé occupe un volume réduit', options: ['son volume diminue et sa pression augmente', 'son volume augmente et sa pression diminue', 'son volume et sa pression diminuent ensemble', 'rien ne change tant que l’embout est bouché'], bonne: 0, commentaire: 'Seringue fermée, même quantité de gaz, température constante : quand le VOLUME DIMINUE, la PRESSION AUGMENTE — je le sens dans mon pouce qui pousse.' },
      { type: 'qcu', question: 'Même quantité de gaz, température constante : si le volume augmente, la pression…', options: ['diminue', 'augmente', 'reste la même', 'devient nulle'], bonne: 0, commentaire: 'Quand le volume AUGMENTE, la pression DESCEND (et inversement) — toujours pour la même quantité de gaz, à température constante.' },
      { type: 'qcm', question: 'Dans une seringue fermée, « si le volume diminue, la pression augmente ». Dans quelles conditions cette règle du clip est-elle vraie ?', options: ['pour la même quantité de gaz', 'à température constante', 'pour un gaz coloré', 'avec une seringue en verre'], bonnes: [0, 1], commentaire: 'La règle vaut pour la MÊME QUANTITÉ de gaz et à TEMPÉRATURE CONSTANTE : le couplet 2 et l’application du clip le répètent. La couleur du gaz ou la matière de la seringue n’y changent rien.' },
      { type: 'vraifaux', question: 'La pression traduit l’action du gaz sur les parois du récipient.', bonne: true, commentaire: 'Vrai : la PRESSION, c’est l’action du gaz sur les parois — et sur le piston de la seringue, par exemple.' },
      { type: 'qcu', question: 'Un gaz comprimé puis libéré :', options: ['tend à se détendre', 'reste comprimé', 'devient un liquide', 'perd sa pression pour toujours'], bonne: 0, commentaire: 'Comprimé puis libéré, le gaz tend à se DÉTENDRE : il est élastique et expansible.' },
      { type: 'qcm', question: 'Lesquels de ces corps sont des gaz ?', options: ['le dioxygène', 'le diazote', 'le dioxyde de carbone', 'le butane', 'le sable', 'l’eau'], bonnes: [0, 1, 2, 3], commentaire: 'Dioxygène, diazote, dioxyde de carbone et butane sont des GAZ. Le sable est un solide divisé, l’eau un liquide.' },
      { type: 'vraifaux', question: 'Tous les gaz ont exactement les mêmes propriétés.', bonne: false, commentaire: 'Faux : les gaz ne sont pas tous identiques. On les distingue par leurs PROPRIÉTÉS et par des TESTS adaptés.' },
      { type: 'qcu', question: 'Observe ce montage : un flacon retourné, rempli d’eau, dans lequel arrivent des bulles. À quoi sert-il ?', image: '/images/quiz/circuit/recueil-gaz-eau.svg', imageAlt: 'Une cuve pleine d’eau avec un flacon retourné dans lequel un tube amène des bulles de gaz qui montent et s’accumulent en haut du flacon', options: ['à recueillir un gaz sur l’eau', 'à mesurer la température de l’eau', 'à faire bouillir l’eau du flacon', 'à filtrer l’eau de la cuve'], bonne: 0, commentaire: 'C’est le RECUEIL d’un gaz sur l’eau : les bulles montent dans le flacon retourné et prennent la place de l’eau.' },
      { type: 'qcu', question: 'Le recueil d’un gaz sur l’eau convient seulement à un gaz :', options: ['peu soluble et sans réaction avec l’eau', 'très soluble, qui disparaît dans l’eau', 'qui réagit fortement avec l’eau froide', 'coloré, pour être facile à repérer'], bonne: 0, commentaire: 'Sur l’eau, on ne recueille qu’un gaz ASSEZ PEU SOLUBLE et NON RÉACTIF avec l’eau : sinon il se dissout ou réagit au lieu de remplir le flacon.' },
      { type: 'qcu', question: 'Comment conserver un gaz que l’on vient de recueillir ?', options: ['dans un récipient bien fermé', 'dans un récipient ouvert', 'dans un sac en papier', 'au fond d’une cuve à eau'], bonne: 0, commentaire: 'Un récipient BIEN FERMÉ permet de conserver le gaz : ouvert, il s’échapperait et remplirait toute la pièce.' },
      { type: 'vraifaux', question: 'Un gaz inconnu ou combustible, je peux le tester moi-même pour savoir ce que c’est.', bonne: false, commentaire: 'Faux : gaz inconnu ou combustible, je ne le teste PAS moi-même — c’est dangereux. Le professeur s’en charge avec les tests adaptés.' },
      { type: 'classement', question: 'Remets dans l’ordre les étapes du recueil d’un gaz sur l’eau :', items: ['Le gaz arrive par le tube sous le flacon retourné', 'Les bulles montent dans le flacon', 'Les bulles prennent la place de l’eau', 'Je ferme bien le récipient pour conserver le gaz'], ordre: [0, 1, 2, 3], commentaire: 'Le gaz arrive par le tube, les bulles montent dans le flacon retourné et prennent la place de l’eau ; un récipient bien fermé permet ensuite de conserver le gaz.' },
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
// `ressourceId` identifie la ressource de la banque dont la fréquentation est
// comptée quand le média est lu depuis la page du chant.
function mediaDe(chant, ressources) {
  const liste = (ressources || []).filter((x) => x.actif !== false);
  if (chant.mediaUrl) {
    const r = liste.find((x) => x.url === chant.mediaUrl);
    return { type: chant.mediaType, url: chant.mediaUrl, ressourceId: r ? r.id : null };
  }
  const r = liste.find((x) => pourRessource(x) === chant);
  if (r) return { type: (r.mime || '').startsWith('video') ? 'video' : 'audio', url: r.url, ressourceId: r.id };
  return { type: null, url: null, ressourceId: null };
}

function toutes() { return CHANTS; }

module.exports = { parSlug, pourRessource, mediaDe, toutes };
