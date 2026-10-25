// Guide d'utilisation de l'École chantée (/ressources/guide) — rubriques affichées par
// views/ressources-guide.ejs. Blocs : sous-titre, paragraphe, liste, etapes, tableau, encadre
// (ton : astuce | attention | exemple | info), faq. Seul balisage accepté dans les textes : **gras**.
// Rédigé le 2026-10-25 d'après le fonctionnement réel du site (banque, clips en
// 13 diapositives, quiz de 10 questions tirées au sort, essai de 2 questions, paiement unique
// de 200 FCFA) : à mettre à jour si ces fonctions changent.
module.exports = {
  "rubriques": [
    {
      "id": "decouvrir",
      "titre": "Découvrir l'École chantée",
      "icone": "🧭",
      "accroche": "L'École chantée met chaque leçon en chanson : un clip vidéo pour apprendre, un quiz pour vérifier ce que l'on a retenu. Voici, pas à pas, comment trouver une leçon, comprendre le clip, utiliser le quiz et débloquer une leçon payante.",
      "blocs": [
        {
          "type": "paragraphe",
          "texte": "L'École chantée est une banque de **leçons en chanson**, conçues d'après les programmes ivoiriens. Chaque leçon tient dans un court clip vidéo : elle est d'abord chantée, puis résumée, puis travaillée avec de petits défis corrigés. Un **quiz d'autoévaluation** accompagne chaque clip. Aucun compte n'est nécessaire. Un téléphone, une tablette ou un ordinateur connecté à Internet suffit (un clip pèse environ 5 à 7 Mo). Les clips actuels visent surtout le primaire et le collège : CE2 Éveil au milieu (Histoire, Géographie, EDHC, Sciences et Technologie), 6e Physique-Chimie, 6e SVT, etc. La banque s'enrichit régulièrement. À ne pas confondre : la page « Les chansons des annales » est réservée aux lecteurs d'un livre EduWeb Éditions et s'ouvre avec le code unique du livre."
        },
        {
          "type": "liste",
          "titre": "Pourquoi apprendre en chanson ?",
          "items": [
            "Mieux retenir : le rythme, la rime et le refrain répété aident à fixer les mots-clés, les définitions et les dates. L'élève peut fredonner la leçon à la maison ou sur le chemin de l'école.",
            "Apprendre avec plaisir : chanter rend la révision plus agréable. L'élève accepte plus volontiers de revoir plusieurs fois la même leçon.",
            "Parler : l'élève prononce le vocabulaire de la leçon, puis l'explique avec ses propres mots (diapositive « Je retiens » et corrections).",
            "Faire participer toute la classe : même dans une classe nombreuse, tout le monde chante le refrain en même temps, y compris les élèves timides.",
            "Bouger : les clips demandent de mimer les mots importants et de frapper dans les mains. Le geste associe une image et un mouvement à chaque idée : c'est une aide de plus pour s'en souvenir.",
            "Agir dans la vie réelle : la plupart des clips récents se terminent par une mission à faire avec un adulte, pour utiliser la leçon hors de l'école.",
            "Une limite à garder en tête : la chanson **complète** la leçon, elle ne la remplace pas. Elle aide à découvrir, à fixer et à réviser. L'explication de l'enseignant, la trace écrite et les exercices restent indispensables."
          ]
        },
        {
          "type": "sous-titre",
          "texte": "Trouver une leçon"
        },
        {
          "type": "etapes",
          "titre": "De la page d'accueil à la leçon, en 6 étapes",
          "etapes": [
            {
              "titre": "Ouvrez la banque",
              "texte": "Dans le menu du site, touchez l'onglet « École chantée » (sur ordinateur : cliquez). La page « Banque de ressources didactiques » s'ouvre (family.eduweb.ci/ressources). Dans ce guide, « toucher » veut dire « cliquer » sur un ordinateur."
            },
            {
              "titre": "Choisissez le cycle",
              "texte": "Dans la barre latérale « Choisis ton cycle », touchez : Cycle primaire (CP1 → CM2), 1er cycle secondaire (6e → 3e), 2nd cycle secondaire (2nde → Terminale) ou Cycle supérieur (BTS, licence, master…). Le site retient votre dernier choix pour la prochaine visite."
            },
            {
              "titre": "Ouvrez le niveau",
              "texte": "Touchez le niveau voulu, par exemple « CE2 ». Ouvrir un niveau referme les autres : la page reste lisible, même sur un petit écran."
            },
            {
              "titre": "Ouvrez la discipline",
              "texte": "Dans ce niveau, touchez la discipline, par exemple « Éveil au milieu », « Physique-Chimie » ou « SVT ». Les leçons apparaissent sous forme de cartes."
            },
            {
              "titre": "Repérez la bonne carte",
              "texte": "Lisez le titre : il indique la discipline, le numéro de la leçon, la séance et le thème. Exemple : « Histoire (H 04) · Séance 10 (S10) — Découvrons les Akan ». La carte contient aussi une courte description, un lecteur vidéo, un bouton « Plein écran » et un bouton « Télécharger » qui affiche la taille du fichier et, pour une leçon payante, le prix."
            },
            {
              "titre": "Ouvrez la page de la leçon",
              "texte": "Touchez le bouton orange « Chanson & évaluation ». La page de la leçon s'ouvre en deux parties : en haut, « Regarde le clip de la chanson » ; en dessous, « Teste-toi : le quiz de la leçon »."
            }
          ]
        },
        {
          "type": "encadre",
          "ton": "attention",
          "titre": "L'ordre des leçons n'est pas celui du livre",
          "texte": "Dans la banque, l'ordre des leçons peut différer de celui du livre ou du cahier de texte. Fiez-vous toujours au **titre** de la leçon (discipline, numéro, séance) et suivez la progression officielle de l'établissement. Enseignants : choisissez le clip qui correspond à la séance du jour. Parents : regardez le cahier de votre enfant pour savoir quelle leçon est en cours, puis cherchez-la par son titre (par exemple « EDHC (E 04) · Séance 10 — Ma parole, ta parole »)."
        },
        {
          "type": "sous-titre",
          "texte": "Comprendre un clip"
        },
        {
          "type": "tableau",
          "titre": "Les 13 diapositives d'un clip récent",
          "colonnes": [
            "Diapo",
            "Contenu",
            "À quoi elle sert"
          ],
          "lignes": [
            [
              "01",
              "Titre, thème de la leçon et objectif. Parfois un « Air africain suggéré » (style, tempo, instruments).",
              "Annoncer ce que l'on va apprendre. L'enseignant ou le parent lit l'objectif à voix haute : l'élève sait ce qu'on attend de lui."
            ],
            [
              "02",
              "Couplet 1. Consigne : « Mime les mots importants pendant que tu chantes. »",
              "Découvrir les premières notions. Le geste aide à fixer les mots-clés."
            ],
            [
              "03",
              "Refrain. Consigne : « Chante, frappe dans tes mains et reprends deux fois ! »",
              "Retenir l'idée centrale par la répétition. Toute la classe chante ensemble."
            ],
            [
              "04",
              "Couplet 2, avec la même consigne de mime.",
              "Ajouter de nouvelles notions, toujours avec des gestes."
            ],
            [
              "05",
              "Couplet 3, avec la même consigne de mime.",
              "Compléter la leçon : exemples, conséquences, bonnes attitudes."
            ],
            [
              "06",
              "« Je retiens » : les 3 idées-clés de la leçon. Consigne : « Dis ces trois idées avec tes propres mots. »",
              "Résumer la leçon. Cette diapositive peut servir de base à la trace écrite."
            ],
            [
              "07",
              "Défi 1 « À toi de jouer ! » : une question à choix unique et un vrai ou faux. Consignes : « Choisis, explique, puis passe au corrigé. » et « PAUSE ! Réponds avant la correction. »",
              "Vérifier la compréhension. On met la vidéo en pause et chacun répond : à l'oral, sur l'ardoise ou sur une feuille."
            ],
            [
              "08",
              "Correction 1 « Je vérifie et j'explique » : la bonne réponse et son explication.",
              "Se corriger et justifier. « Une bonne réponse devient solide quand tu sais dire pourquoi. »"
            ],
            [
              "09",
              "Défi 2 : une question à choix multiple et un texte à trous (mots proposés).",
              "S'entraîner sur d'autres formes de questions."
            ],
            [
              "10",
              "Correction 2.",
              "Se corriger et expliquer avec ses mots."
            ],
            [
              "11",
              "Défi 3 : un classement ou une remise en ordre, puis une situation à résoudre.",
              "Appliquer la leçon à un cas concret, comme dans une situation d'évaluation."
            ],
            [
              "12",
              "Correction 3.",
              "Se corriger et expliquer avec ses mots."
            ],
            [
              "13",
              "« Mission avec un adulte » : « Je chante, je retiens, j'agis ! ». Une petite tâche de la vie réelle, par exemple dessiner le plan de sa classe (leçon « Le plan de la classe »), proposer une règle de classe ou montrer des régions sur une carte. Consigne : « Reprends le refrain deux fois, puis raconte ce que tu as appris. »",
              "Réinvestir la leçon hors de l'école et associer la famille. C'est une petite activité d'intégration à faire à la maison."
            ]
          ]
        },
        {
          "type": "encadre",
          "ton": "astuce",
          "titre": "Bien utiliser les pauses",
          "texte": "Les diapositives 07, 09 et 11 posent les questions **avant** la correction. Appuyez sur pause. Laissez à l'élève le temps de chercher, puis relancez la vidéo pour vérifier. La plupart des clips récents suivent ce modèle en 13 diapositives. Les clips plus anciens (par exemple les premières leçons de Physique-Chimie 6e) sont plus courts : environ 7 diapositives avec des « repères ». La démarche reste la même : écouter, retenir, vérifier."
        },
        {
          "type": "sous-titre",
          "texte": "Le quiz d'autoévaluation"
        },
        {
          "type": "etapes",
          "titre": "Faire le quiz, pas à pas",
          "etapes": [
            {
              "titre": "Regardez d'abord le clip",
              "texte": "Le clip contient toutes les réponses du quiz. Regardez-le autant de fois que nécessaire avant de commencer."
            },
            {
              "titre": "Descendez jusqu'au quiz",
              "texte": "Allez à la partie « Teste-toi : le quiz de la leçon ». Le bouton haut-parleur 🔊 lit la consigne à voix haute. Le quiz présente une seule question à la fois, avec une barre de progression « Question 1 / 10 »."
            },
            {
              "titre": "Comprenez le tirage au sort",
              "texte": "Chaque leçon possède une banque de questions (souvent 14 à 20). À chaque tentative, le site tire au sort 10 questions (ou toutes, si la banque en compte moins) et les mélange. Les propositions de réponse sont aussi mélangées. Chaque tentative est donc différente : on ne peut pas retenir les réponses par leur place."
            },
            {
              "titre": "Répondez, puis touchez « Vérifier »",
              "texte": "Lisez la question, ou touchez le haut-parleur pour l'entendre avec ses propositions. Si la question est illustrée (plan, carte, schéma, dessin), observez bien l'image. Choisissez votre réponse, puis touchez « Vérifier »."
            },
            {
              "titre": "Lisez et écoutez la correction",
              "texte": "La correction est immédiate : « Bonne réponse ! (1 point) » ou « Pas tout à fait. La bonne réponse : … », suivie d'une explication. Elle est **lue à voix haute** automatiquement par la voix de synthèse du téléphone ou de l'ordinateur. Montez le volume ; en classe, branchez un haut-parleur si vous en avez un. Si vous n'entendez rien, la correction reste écrite à l'écran."
            },
            {
              "titre": "Passez à la question suivante",
              "texte": "Touchez « Question suivante → ». Sur la dernière question, le bouton devient « Voir mon résultat ». Avant d'y toucher, le bouton « ← Précédente » permet de revoir une question déjà faite : la réponse et la correction restent affichées. Une fois la note affichée, les questions ne sont plus visibles : notez au fur et à mesure celles que vous avez manquées."
            },
            {
              "titre": "Lisez votre note",
              "texte": "À la fin, le site affiche « Ta note : x / 10 ». Le tableau « Lire sa note », plus bas, vous dit quoi faire ensuite."
            }
          ]
        },
        {
          "type": "tableau",
          "titre": "Les 5 types de questions",
          "colonnes": [
            "Type de question",
            "Comment répondre",
            "Piège à éviter"
          ],
          "lignes": [
            [
              "Choix unique",
              "Lisez toutes les propositions, puis touchez la seule bonne réponse.",
              "Répondre trop vite sur la première proposition qui « sonne bien ». Les propositions changent de place à chaque tentative."
            ],
            [
              "Choix multiple (badge « plusieurs réponses »)",
              "Cochez toutes les bonnes réponses, et seulement elles.",
              "Cocher une seule réponse, ou ajouter une réponse fausse : dans les deux cas, la question n'est pas réussie."
            ],
            [
              "Vrai ou faux",
              "Décidez si la phrase est entièrement exacte.",
              "Ne pas lire jusqu'au bout. Un seul mot (« toujours », « jamais », un nom, une date) peut rendre la phrase fausse."
            ],
            [
              "Réponse courte",
              "Écrivez un seul mot. Les mots possibles sont souvent proposés dans la question. Majuscules, accents et ponctuation ne comptent pas.",
              "Écrire une phrase entière, ou se tromper de lettres. Recopiez avec soin le mot proposé."
            ],
            [
              "Remise en ordre (badge « clique dans l'ordre »)",
              "Touchez les étiquettes une par une, dans le bon ordre. En cas d'erreur, touchez « ↺ Refaire l'ordre » avant de vérifier.",
              "Commencer sans avoir réfléchi à l'ordre complet. Repérez d'abord la première et la dernière étiquette."
            ]
          ]
        },
        {
          "type": "tableau",
          "titre": "Lire sa note",
          "colonnes": [
            "Note obtenue",
            "Message affiché",
            "Que faire ensuite"
          ],
          "lignes": [
            [
              "8/10 ou plus (au moins 80 %)",
              "« Je maîtrise ! »",
              "La leçon est acquise. Notez le résultat. Vous pouvez « Recommencer le quiz » pour un nouveau tirage, ou passer à une autre leçon avec « Autres ressources »."
            ],
            [
              "Moins de 8/10",
              "« À revoir », avec le conseil de réécouter la chanson",
              "Touchez « Réécouter la chanson » : la page remonte au clip et le relance au début. Écoutez surtout les passages liés aux questions manquées (repérez-les pendant le quiz : une fois la note affichée, les questions ne sont plus visibles). Puis touchez « Recommencer le quiz » : de nouvelles questions sont tirées au sort."
            ]
          ]
        },
        {
          "type": "encadre",
          "ton": "attention",
          "titre": "Les notes ne sont pas enregistrées",
          "texte": "Le site ne garde **aucune** trace des notes : ni pour l'élève, ni pour l'enseignant, ni pour le parent. Pour suivre les progrès, notez chaque résultat dans un cahier ou sur une fiche de suivi (date, leçon, note). Exemple : « 3 novembre — Histoire H 04, Découvrons les Akan — 1er essai 6/10, 2e essai 9/10 ». Attention aussi : le quiz fonctionne uniquement avec une connexion Internet."
        },
        {
          "type": "sous-titre",
          "texte": "Gratuit ou payant ?"
        },
        {
          "type": "tableau",
          "titre": "Ce qui est gratuit, ce qui est payant",
          "colonnes": [
            "Contenu",
            "Accès",
            "Détail"
          ],
          "lignes": [
            [
              "Regarder un clip en ligne",
              "Toujours gratuit",
              "Autant de fois que vous voulez, sans compte."
            ],
            [
              "Quiz d'essai (leçons à téléchargement payant, c'est-à-dire la plupart des nouveaux clips)",
              "Gratuit",
              "2 questions tirées au sort, les mêmes pendant toute la visite. À la fin s'affichent « Fin du quiz d'essai » et le bouton de déblocage."
            ],
            [
              "Quiz complet",
              "200 FCFA par leçon (environ 0,30 €), en un seul paiement",
              "10 questions tirées dans toute la banque, à chaque tentative, aussi souvent que vous voulez."
            ],
            [
              "Téléchargement du clip",
              "Inclus dans les mêmes 200 FCFA",
              "Pour regarder la leçon sans connexion ou la projeter en classe."
            ],
            [
              "Certaines leçons plus anciennes",
              "Entièrement gratuites",
              "Quiz complet et téléchargement direct."
            ]
          ]
        },
        {
          "type": "etapes",
          "titre": "Payer et débloquer une leçon",
          "etapes": [
            {
              "titre": "Ouvrez la fenêtre de paiement",
              "texte": "À la fin du quiz d'essai, touchez « Quiz complet + téléchargement — 200 FCFA ». Dans la banque, le bouton « Télécharger » de la carte ouvre la même fenêtre. Un **seul paiement** débloque à la fois le quiz complet et le téléchargement de cette leçon."
            },
            {
              "titre": "Envoyez 200 FCFA",
              "texte": "Par Wave au (+225) 07 0985 8042, ou par Flooz (Moov Money) au (+225) 01 5263 3030. Gardez le SMS de confirmation : il contient la référence de la transaction."
            },
            {
              "titre": "Déclarez le paiement depuis le bon appareil",
              "texte": "Dans la fenêtre du site, indiquez l'opérateur, la référence reçue par SMS et une adresse e-mail (celle d'un parent convient). Faites cette déclaration depuis l'appareil qui servira le plus : par exemple le téléphone de l'élève à la maison, ou l'ordinateur relié au vidéoprojecteur en classe."
            },
            {
              "titre": "Attendez la validation",
              "texte": "Un administrateur vérifie le paiement. Pendant ce temps, la page de l'appareil qui a déclaré affiche « Paiement déclaré : vérification en cours ». Dès la validation, cet appareil se débloque **tout seul**, quelle que soit l'adresse e-mail indiquée : la page s'actualise d'elle-même. Un lien personnel arrive aussi par e-mail en moins de 12 heures. Le lien de téléchargement est valable 7 jours."
            },
            {
              "titre": "Sur un autre appareil",
              "texte": "Ouvrez le lien reçu par e-mail, ou connectez-vous avec un compte EduWeb qui a la même adresse e-mail. Exemple : le parent déclare le paiement depuis son téléphone, puis ouvre le lien de l'e-mail sur la tablette de son enfant."
            },
            {
              "titre": "Ne payez jamais deux fois",
              "texte": "Le quiz complet reste débloqué, même après l'expiration du lien de téléchargement. Les boutons affichent alors « Télécharger (déjà payé) » : vous ne payez jamais deux fois la même leçon."
            }
          ]
        },
        {
          "type": "sous-titre",
          "texte": "Les compétitions"
        },
        {
          "type": "encadre",
          "ton": "info",
          "titre": "Des épreuves chronométrées sur les leçons en chanson",
          "texte": "La page « Compétitions » propose des épreuves **chronométrées** sur les leçons en chanson. Elles sont ouvertes à tous, avec ou sans compte EduWeb. L'inscription est vérifiée par un code envoyé par e-mail. Le classement est automatique à la fin de l'épreuve. Pendant une compétition, le quiz d'entraînement des leçons concernées est mis en pause (« Quiz en pause pendant la compétition ») ; il revient à la fin. Conseil : entraînez-vous avec le clip et le quiz avant la date de l'épreuve."
        }
      ]
    },
    {
      "id": "enseignant",
      "titre": "Pour l'enseignant : exploiter les clips et les quiz en classe",
      "icone": "🧑‍🏫",
      "accroche": "Comment intégrer un clip chanté et son quiz dans une séance selon l'APC : préparer, conduire, évaluer, remédier et différencier. Une méthode pas à pas, illustrée par les leçons déjà en ligne.",
      "blocs": [
        {
          "type": "paragraphe",
          "texte": "Cette rubrique s'adresse surtout aux enseignants du primaire et du collège : les clips actuels visent d'abord ces niveaux. Elle montre, étape par étape, comment utiliser un clip chanté et son quiz avant, pendant et après la classe. Les exemples viennent des leçons de CE2 Éveil au milieu déjà en ligne. Tout ce qui est proposé ici fonctionne avec les outils actuels du site : la banque de leçons, le clip, le quiz de chaque leçon et les compétitions."
        },
        {
          "type": "sous-titre",
          "texte": "1. Les principes à garder en tête"
        },
        {
          "type": "liste",
          "items": [
            "Le clip **complète** votre leçon ; il ne la remplace pas. Vous gardez la situation d'apprentissage, les explications, la trace écrite et l'évaluation.",
            "Les clips récents suivent les grands moments d'une séance **APC** : un objectif, un contenu chanté, une synthèse, des exercices corrigés, puis une tâche dans la vie réelle (voir le tableau ci-dessous).",
            "Le clip contient toutes les réponses du quiz. Quand un élève échoue, il réécoute d'abord, puis il recommence.",
            "Le quiz est une autoévaluation **formative** : il sert à repérer les erreurs et à remédier, pas à classer ni à sanctionner.",
            "Le site n'enregistre pas les notes et n'offre aucun suivi des élèves. C'est vous qui notez les résultats, sur une fiche de suivi (modèle plus bas).",
            "Aucun compte n'est nécessaire pour la banque, les clips et les quiz. Un téléphone, une tablette ou un ordinateur connecté à Internet suffit.",
            "La plupart des clips récents ont 13 diapositives, toujours dans le même ordre : vos élèves prennent vite leurs repères. Les clips plus anciens (par exemple les premières leçons de Physique-Chimie 6e) sont plus courts : environ 7 diapositives avec des « repères ». Pour ceux-là, servez-vous des repères pour bâtir la trace écrite, et du quiz pour l'évaluation."
          ]
        },
        {
          "type": "tableau",
          "titre": "Ce que chaque partie apporte à votre démarche APC (clips récents)",
          "colonnes": [
            "Moment de la démarche APC",
            "Ce que le clip ou le quiz apporte",
            "Où le trouver"
          ],
          "lignes": [
            [
              "Présentation et situation d'apprentissage",
              "Le thème et l'objectif de la leçon, énoncés clairement.",
              "Diapositive 01 : titre, sous-titre, objectif"
            ],
            [
              "Développement : acquisition des habiletés",
              "Le contenu de la leçon, en chanson, avec des mimes.",
              "Couplets 1, 2 et 3 ; refrain (diapositives 02 à 05)"
            ],
            [
              "Synthèse et trace écrite",
              "Les trois idées-clés à reformuler, puis à copier.",
              "Diapositive 06 : « Je retiens »"
            ],
            [
              "Évaluation formative",
              "Six questions dans le clip, chacune suivie de sa correction expliquée ; puis 10 questions tirées au sort dans le quiz.",
              "Défis (diapositives 07, 09, 11) et corrections (08, 10, 12) ; quiz « Teste-toi » de la page de la leçon"
            ],
            [
              "Remédiation",
              "Réécouter la chanson, puis refaire le quiz avec de nouvelles questions.",
              "Boutons « Réécouter la chanson » et « Recommencer le quiz »"
            ],
            [
              "Intégration et réinvestissement",
              "Une petite tâche à faire dans la vie réelle, avec un adulte.",
              "Diapositive 13 : « Mission avec un adulte »"
            ]
          ]
        },
        {
          "type": "sous-titre",
          "texte": "2. Préparer la séance"
        },
        {
          "type": "etapes",
          "titre": "Avant la classe, en six étapes",
          "etapes": [
            {
              "titre": "Choisir la leçon",
              "texte": "Ouvrez l'onglet « École chantée » : la « Banque de ressources didactiques » s'affiche. Choisissez le cycle dans la barre latérale, puis ouvrez le niveau (par exemple « CE2 ») et la discipline (par exemple « Éveil au milieu »). Fiez-vous au **titre** de la carte, par exemple « Histoire (H 04) · Séance 10 (S10) — Découvrons les Akan ». L'ordre des leçons dans la banque peut différer de celui du livre ou du cahier de texte : suivez toujours la progression officielle de votre établissement. Le bouton orange « Chanson & évaluation » ouvre la page de la leçon : le clip, puis le quiz."
            },
            {
              "titre": "Visionner le clip en entier",
              "texte": "Regardez-le avant la classe, du début à la fin. Notez l'objectif, les mots difficiles, les trois idées de « Je retiens », les six questions des défis avec leurs réponses, et la mission. Repérez le moment exact de chaque « PAUSE ! » : vous devrez arrêter la vidéo à cet endroit, car la correction suit aussitôt."
            },
            {
              "titre": "Faire le quiz vous-même",
              "texte": "Faites une ou deux tentatives. Vous découvrez ainsi les types de questions (choix unique, choix multiple, vrai ou faux, réponse courte, remise en ordre, questions illustrées) et les erreurs probables de vos élèves. Attention : sur un clip payant non débloqué, vous ne verrez que le quiz d'essai de 2 questions."
            },
            {
              "titre": "Vérifier le matériel",
              "texte": "Testez l'écran ou le vidéoprojecteur (bouton « Plein écran »), le son (une petite enceinte aide beaucoup), la connexion et la batterie. Si la connexion de la classe est incertaine, **téléchargez le clip** (environ 5 à 7 Mo) pour le projeter sans connexion. Pour la plupart des nouveaux clips, le téléchargement est payant : 200 FCFA, et ce même paiement débloque le quiz complet. Payez depuis l'appareil qui servira en classe, et au moins la veille : la validation peut prendre jusqu'à 12 heures. Certaines leçons plus anciennes sont entièrement gratuites."
            },
            {
              "titre": "Préparer le matériel des élèves",
              "texte": "Ardoises et craies (ou feutres), cahiers, quelques étiquettes pour les exercices de remise en ordre, et la fiche de suivi (modèle plus bas)."
            },
            {
              "titre": "Écrire votre fiche de séance",
              "texte": "Notez la situation de départ, le minutage, les questions à poser après chaque couplet, la trace écrite prévue et les groupes de remédiation possibles."
            }
          ]
        },
        {
          "type": "sous-titre",
          "texte": "3. Une séance type de 45 minutes"
        },
        {
          "type": "tableau",
          "titre": "Séance type (exemple : « Ma parole, ta parole », EDHC E 04 · S10)",
          "colonnes": [
            "Moment",
            "Durée",
            "Ce que vous faites",
            "Ce que font les élèves",
            "Partie du clip utilisée"
          ],
          "lignes": [
            [
              "1. Mise en situation",
              "3 min",
              "Vous posez une situation proche des élèves : « Pour choisir le nom de l'équipe, tout le monde parle en même temps, et certains n'osent rien dire. Que faire pour que chacun donne son avis ? » Puis vous lisez l'objectif de la leçon.",
              "Ils donnent leur avis à l'oral et disent ce qu'ils savent déjà.",
              "Diapositive 01 : titre et objectif"
            ],
            [
              "2. Première écoute",
              "4 min",
              "Vous faites écouter le début du clip sans l'arrêter. Consigne : « Retenez deux mots importants. » Vous arrêtez avant le premier défi, pour ne pas dévoiler les corrections.",
              "Ils écoutent, puis écrivent deux mots sur l'ardoise.",
              "Diapositives 01 à 06"
            ],
            [
              "3. Étude des couplets",
              "8 min",
              "Vous repassez chaque couplet et faites une pause après chacun. Vous posez des questions (Qui ? Quoi ? Pourquoi ?) et expliquez les mots nouveaux : « liberté d'expression », « avis ».",
              "Ils répondent et miment les mots importants.",
              "Couplets 1, 2 et 3"
            ],
            [
              "4. Apprentissage du refrain",
              "3 min",
              "Vous faites répéter le refrain phrase par phrase, puis chanter en frappant dans les mains.",
              "Ils chantent le refrain deux fois, par groupes puis tous ensemble.",
              "Refrain"
            ],
            [
              "5. Synthèse et trace écrite",
              "5 min",
              "Vous arrêtez l'image sur « Je retiens ». Vous faites reformuler chaque idée, puis écrivez la trace écrite au tableau.",
              "Ils reformulent avec leurs mots, puis copient la trace écrite.",
              "Diapositive 06 : « Je retiens »"
            ],
            [
              "6. Défis du clip",
              "8 min",
              "Vous mettez en pause à chaque « PAUSE ! », lisez les questions, puis donnez le signal du vote. Vous relancez la correction et demandez toujours « pourquoi ? ».",
              "Ils répondent sur l'ardoise, la lèvent, se corrigent et expliquent.",
              "Défis 1 à 3 et corrections (diapositives 07 à 12)"
            ],
            [
              "7. Quiz collectif",
              "11 min",
              "Vous projetez le quiz. Rythme rapide : 30 secondes de réflexion, vote sur ardoise, un élève clique la réponse de la majorité puis « Vérifier », la classe écoute la correction. Vous faites justifier seulement quand les avis divergent. Vous notez les questions qui posent problème.",
              "Ils votent, justifient quand les avis divergent, écoutent l'explication.",
              "Aucune : quiz « Teste-toi » de la page de la leçon"
            ],
            [
              "8. Mission et clôture",
              "3 min",
              "Vous présentez la mission et vérifiez que chacun sait quoi faire, avec qui et pour quand. Vous notez la note de la classe sur la fiche de suivi.",
              "Ils reprennent le refrain deux fois et disent ce qu'ils ont appris.",
              "Diapositive 13 : « Mission avec un adulte »"
            ]
          ]
        },
        {
          "type": "tableau",
          "titre": "Variantes selon le temps disponible",
          "colonnes": [
            "Format",
            "Organisation",
            "Conseil"
          ],
          "lignes": [
            [
              "Séance de 30 min",
              "Mise en situation (3 min) ; première écoute (4 min) ; couplets et refrain (8 min) ; « Je retiens » et trace écrite (5 min) ; défis 1 et 2 avec pauses (7 min) ; mission (3 min).",
              "Le défi 3 et le quiz passent à la séance suivante, ou à la maison."
            ],
            [
              "Deux séances",
              "Séance 1 : mise en situation, écoute, couplets, refrain, « Je retiens », trace écrite, défi 1. Séance 2 : refrain chanté en rappel, défis 2 et 3, quiz collectif, bilan, mission.",
              "Ouvrez la séance 2 par le refrain : c'est un rappel rapide et joyeux."
            ],
            [
              "Sur une semaine",
              "Jour 1 : découverte du clip. Jour 2 : défis et trace écrite. Jour 3 : quiz collectif ou en groupes, puis remédiation. Jour 4 ou 5 : retour de la mission, nouvelle tentative du quiz, écriture d'un couplet.",
              "Le refrain devient le rituel d'entrée en classe de la semaine."
            ],
            [
              "Révision avant une évaluation",
              "Refrain, puis « Je retiens », puis une nouvelle tentative du quiz (de nouvelles questions sont tirées au sort).",
              "Enchaînez plusieurs leçons déjà vues : une dizaine de minutes par leçon suffit."
            ]
          ]
        },
        {
          "type": "sous-titre",
          "texte": "4. Exploiter le clip partie par partie"
        },
        {
          "type": "tableau",
          "titre": "Pour chaque partie : vos gestes, l'activité des élèves, la compétence travaillée",
          "colonnes": [
            "Partie du clip",
            "Ce que vous faites",
            "Ce que font les élèves",
            "Compétence travaillée"
          ],
          "lignes": [
            [
              "Titre et objectif (diapositive 01)",
              "Vous lisez l'objectif et l'écrivez au tableau. Si un « Air africain suggéré » est indiqué (style, tempo, instruments), vous donnez le rythme.",
              "Ils reformulent : « Aujourd'hui, j'apprends à… ». Ils disent ce qu'ils savent déjà.",
              "Entrer dans la tâche ; mobiliser ses acquis"
            ],
            [
              "Couplets 1, 2 et 3 (« Mime les mots importants pendant que tu chantes »)",
              "Vous passez un couplet à la fois. Vous faites une pause, posez deux ou trois questions et expliquez les mots nouveaux (« tronc », « membres », « légende », « aire historique »). Vous choisissez les gestes avec la classe.",
              "Ils repèrent les mots-clés, inventent les mimes et répondent aux questions.",
              "Compréhension orale ; vocabulaire de la discipline ; mémorisation par le geste"
            ],
            [
              "Refrain (« Chante, frappe dans tes mains et reprends deux fois ! »)",
              "Vous le faites apprendre phrase par phrase. Vous le reprenez en début et en fin de séance. Exemple : « Je t'écoute, tu m'écoutes » (« Ma parole, ta parole »).",
              "Ils chantent en frappant dans les mains, puis par groupes alternés (rangées, filles et garçons).",
              "Mémorisation de l'idée centrale ; expression musicale ; cohésion du groupe"
            ],
            [
              "« Je retiens » (diapositive 06)",
              "Vous arrêtez l'image. Trois élèves reformulent chacun une idée. Vous bâtissez la trace écrite avec leurs mots.",
              "Ils lisent, reformulent (« Dis ces trois idées avec tes propres mots »), puis copient.",
              "Synthèse ; reformulation ; trace écrite"
            ],
            [
              "Défi 1 : choix unique et vrai ou faux (diapositive 07)",
              "Vous mettez en pause dès que « PAUSE ! Réponds avant la correction » apparaît. Vous lisez les questions, laissez une minute, puis dites : « Ardoises levées ! »",
              "Ils écrivent leur réponse (la proposition choisie, ou V ou F), puis lèvent l'ardoise.",
              "Restituer une connaissance ; distinguer le vrai du faux"
            ],
            [
              "Défi 2 : choix multiple et texte à trous (diapositive 09)",
              "Vous rappelez qu'il peut y avoir plusieurs bonnes réponses. Vous écrivez au tableau les mots proposés pour le texte à trous.",
              "Ils notent toutes les bonnes réponses, et seulement elles. Ils complètent la phrase avec le bon mot, bien orthographié.",
              "Analyser ; trier ; vocabulaire et orthographe"
            ],
            [
              "Défi 3 : classement ou remise en ordre, puis situation à résoudre (diapositive 11)",
              "Vous faites travailler en binômes. Pour le classement ou la remise en ordre, vous affichez des étiquettes au tableau et les faites déplacer. Pour la situation, vous demandez : « Que fais-tu, et pourquoi ? »",
              "Ils discutent, rangent les éléments et proposent une solution argumentée.",
              "Raisonner ; résoudre une situation (cœur de l'APC) ; argumenter"
            ],
            [
              "Corrections 1 à 3 (diapositives 08, 10 et 12 : « Je vérifie et j'explique »)",
              "Vous relancez la vidéo. Après la bonne réponse, vous refaites une pause et demandez « pourquoi ? » : d'abord à un élève qui avait juste, puis à un élève qui s'était trompé.",
              "Ils comparent, corrigent l'ardoise et expliquent avec leurs mots (« BRAVO ! Explique avec tes mots »).",
              "Justifier ; s'autocorriger ; comprendre son erreur"
            ],
            [
              "« Mission avec un adulte » (diapositive 13)",
              "Vous lisez la mission (par exemple : dessiner le plan de sa classe, proposer une règle de classe, montrer des régions sur une carte). Vous la faites noter dans le cahier et prévoyez cinq minutes de retour à la séance suivante.",
              "Ils reprennent le refrain deux fois, racontent ce qu'ils ont appris, puis réalisent la mission à la maison.",
              "Réinvestir dans la vie réelle ; lien école-famille"
            ]
          ]
        },
        {
          "type": "encadre",
          "ton": "exemple",
          "titre": "Exemple complet : « Ma classe vue de dessus » (Géographie G 02 — Le plan de la classe · S7)",
          "texte": "Mise en situation : « Un nouvel élève arrive demain. Comment l'aider à trouver la porte, le tableau et sa table sans l'accompagner ? » Couplets : expliquez « vue de dessus », « contour », « ouvertures » et « légende » ; mime possible pour « vue de dessus » : la main à plat, au-dessus de la table. « Je retiens » : trace écrite en trois phrases. Remise en ordre : une question du quiz peut demander de ranger les étapes du plan (observer la classe, tracer le contour de la salle, placer les ouvertures et les tables, ajouter un titre et une légende) ; entraînez d'abord la classe avec des étiquettes au tableau. Quiz : plusieurs questions s'appuient sur l'image d'un plan (« Combien de tables d'élèves ? », « Où se trouve la porte ? ») ; faites observer le plan et sa légende avant de voter. Mission : à la séance suivante, faites présenter les plans réalisés et vérifiez, grâce à la légende, que l'on retrouve bien la porte. Prolongement en mathématiques : comptez les tables de votre propre classe, rangée par rangée (par exemple 6 rangées de 4 tables : combien de tables ?)."
        },
        {
          "type": "sous-titre",
          "texte": "5. Utiliser les quiz"
        },
        {
          "type": "tableau",
          "titre": "Quatre façons d'utiliser le quiz",
          "colonnes": [
            "Modalité",
            "Matériel",
            "Comment faire",
            "Points de vigilance"
          ],
          "lignes": [
            [
              "En collectif, au vidéoprojecteur",
              "Un ordinateur connecté, un vidéoprojecteur (ou un grand écran), le son, des ardoises",
              "Une seule tentative pour toute la classe. Chaque question est lue, votée sur ardoise, puis justifiée (voir les étapes ci-dessous).",
              "Cliquez la réponse de la majorité : la note obtenue est celle de la classe, pas celle d'un élève."
            ],
            [
              "En petits groupes, sur un appareil",
              "Un téléphone ou une tablette connecté par groupe de 3 à 5 élèves",
              "Donnez des rôles qui tournent à chaque question : lecteur (ou bouton 🔊), cliqueur, secrétaire qui note, porte-parole qui explique.",
              "Chaque groupe reçoit des questions différentes (tirage au sort) : comparez les erreurs, pas les notes."
            ],
            [
              "En salle informatique",
              "Un poste par élève ou par binôme, une connexion, des écouteurs si possible",
              "Chacun fait une tentative, note sa note, réécoute la chanson si besoin, puis recommence. Objectif : 8/10.",
              "Pour une leçon payante, chaque poste doit être débloqué : ouvrez sur le poste le lien personnel reçu par e-mail, ou connectez-vous à un compte EduWeb ayant l'adresse e-mail utilisée pour payer."
            ],
            [
              "À la maison",
              "Le téléphone d'un parent, une connexion",
              "Devoir : regarder le clip, faire le quiz, écrire la note dans le cahier et la faire signer.",
              "Sur un clip payant non débloqué, l'élève n'aura que le quiz d'essai de 2 questions ; le clip, lui, reste gratuit en ligne."
            ]
          ]
        },
        {
          "type": "etapes",
          "titre": "Le quiz collectif pas à pas",
          "etapes": [
            {
              "titre": "Préparer l'écran",
              "texte": "Ouvrez la page de la leçon (bouton orange « Chanson & évaluation ») et descendez jusqu'à « Teste-toi : le quiz de la leçon ». Réglez le son : la correction est lue à voix haute."
            },
            {
              "titre": "Lire la question",
              "texte": "Un élève lit la question, ou vous cliquez sur 🔊 : la question et ses propositions sont lues. Numérotez à voix haute les propositions affichées (1, 2, 3, 4). Si la question est illustrée (plan, carte, schéma, dessin), faites d'abord observer l'image."
            },
            {
              "titre": "Laisser réfléchir",
              "texte": "Accordez 30 secondes à une minute, en silence."
            },
            {
              "titre": "Voter sur l'ardoise",
              "texte": "Au signal, tout le monde lève l'ardoise : un numéro, plusieurs numéros pour un choix multiple, V ou F, un mot, ou un ordre (par exemple « 2-1-3 »)."
            },
            {
              "titre": "Faire justifier",
              "texte": "Repérez la réponse la plus fréquente. Si les avis divergent, faites parler un élève de chaque avis : « Pourquoi as-tu choisi cette réponse ? »"
            },
            {
              "titre": "Valider",
              "texte": "Un élève vient cliquer la réponse de la majorité, puis le bouton « Vérifier ». Ne cliquez jamais « Vérifier » avant le vote : la réponse est alors verrouillée et la correction s'affiche aussitôt."
            },
            {
              "titre": "Exploiter la correction",
              "texte": "Écoutez la correction lue. Faites reformuler l'explication par un élève. Si plus de la moitié de la classe s'est trompée, notez au tableau le numéro et le thème de la question."
            },
            {
              "titre": "Conclure",
              "texte": "Cliquez « Question suivante → ». Sur la dernière question, le bouton devient « Voir mon résultat ». Avant de cliquer, revenez si besoin sur les questions difficiles avec « ← Précédente » : une fois la note affichée, on ne peut plus revoir les questions. Notez la note de la classe. À 8/10 ou plus, le site affiche « Je maîtrise ! ». En dessous, il affiche « À revoir » : réécoutez la chanson et prévoyez une nouvelle tentative."
            }
          ]
        },
        {
          "type": "liste",
          "titre": "Tirer parti de chaque fonction du quiz",
          "items": [
            "Le **tirage au sort** : chaque leçon a une banque de questions (souvent 14 à 20). Chaque tentative tire 10 questions (ou toutes, si la banque en compte moins), dans un ordre mélangé, avec des propositions mélangées. Recommencer a donc un sens : l'élève ne peut pas retenir « c'était la deuxième réponse », il doit comprendre. Deux groupes voisins n'ont pas les mêmes questions.",
            "La correction commentée : après « Vérifier », le site affiche « Bonne réponse ! (1 point) » ou « Pas tout à fait », la bonne réponse, puis une explication. Ne passez pas trop vite : c'est le moment où l'on apprend. Exemple (« Découvrons les Akan ») : l'explication précise que les Lobi sont étudiés avec un autre groupe, le groupe Gour.",
            "La lecture à voix haute : la correction est lue automatiquement par la voix du téléphone ou de l'ordinateur (les émojis ne sont pas lus). Le bouton 🔊 de chaque question lit la question et ses propositions.",
            "Le bouton « ← Précédente » : il permet de revenir sur une question déjà faite ; la réponse et la correction restent affichées. Il ne sert que pendant le quiz : après « Voir mon résultat », les questions ne sont plus visibles.",
            "Le seuil de 8/10 : à partir de 8/10, le site affiche « Je maîtrise ! » ; en dessous, « À revoir ». Fixez ce seuil comme objectif commun de la classe.",
            "Les types de questions (détaillés dans le tableau « Les 5 types de questions » de la rubrique « Découvrir l'École chantée ») : avant chaque vote, rappelez la règle utile. « Plusieurs réponses » : toutes les bonnes réponses, et seulement elles. « Clique dans l'ordre » : écrire l'ordre complet sur l'ardoise (par exemple « 2-1-3 ») avant de cliquer. Réponse courte : un seul mot, souvent proposé dans la question.",
            "Les boutons de fin : « Réécouter la chanson » remonte au clip et le relance au début ; « Recommencer le quiz » lance un nouveau tirage ; « Autres ressources » permet de passer à d'autres leçons."
          ]
        },
        {
          "type": "sous-titre",
          "texte": "6. Évaluation formative et remédiation"
        },
        {
          "type": "etapes",
          "titre": "La démarche de remédiation",
          "etapes": [
            {
              "titre": "Repérer les erreurs fréquentes",
              "texte": "Pendant le quiz collectif, notez les questions où beaucoup d'ardoises étaient fausses. En travail individuel, demandez à chaque élève de noter dans son cahier, au fur et à mesure, le thème des questions ratées : une fois la note affichée, les questions ne sont plus visibles."
            },
            {
              "titre": "Chercher la réponse dans le clip",
              "texte": "Toutes les réponses y sont. Repérez la partie qui la contient : un couplet, le refrain, « Je retiens » ou une correction."
            },
            {
              "titre": "Regrouper les élèves",
              "texte": "Formez des groupes selon la note obtenue (tableau ci-dessous)."
            },
            {
              "titre": "Réécouter de façon ciblée",
              "texte": "Repassez seulement la partie utile, avec une pause et une question. Exemple (« Mon corps, j'en prends soin ») : si les élèves confondent membres supérieurs et membres inférieurs, repassez le passage sur les membres et faites montrer, sur soi, le bras, l'avant-bras, la cuisse et la jambe."
            },
            {
              "titre": "Recommencer le quiz",
              "texte": "Chaque nouvelle tentative propose d'autres questions. Visez 8/10. Évitez d'enchaîner les tentatives sans réécoute : l'élève devinerait au lieu d'apprendre."
            },
            {
              "titre": "Organiser le tutorat entre pairs",
              "texte": "Un élève qui a obtenu 8/10 ou plus accompagne deux ou trois camarades. Il explique « pourquoi », sans donner la réponse."
            },
            {
              "titre": "Vérifier plus tard",
              "texte": "Quelques jours après, en début de séance : refrain, puis nouvelle tentative du quiz. Notez le résultat sur la fiche de suivi."
            }
          ]
        },
        {
          "type": "tableau",
          "titre": "Regrouper les élèves selon la note (le site affiche seulement « Je maîtrise ! » ou « À revoir » : les trois groupes sont une proposition)",
          "colonnes": [
            "Note",
            "Message du site",
            "Groupe",
            "Ce que vous proposez"
          ],
          "lignes": [
            [
              "8, 9 ou 10 / 10",
              "« Je maîtrise ! »",
              "Tuteurs",
              "Aider un camarade ; écrire un nouveau couplet ; inventer une question avec son explication ; viser 10/10 avec un nouveau tirage."
            ],
            [
              "5, 6 ou 7 / 10",
              "« À revoir »",
              "Consolidation",
              "Réécouter les parties liées aux erreurs ; refaire les défis du clip en binôme ; recommencer le quiz."
            ],
            [
              "0 à 4 / 10",
              "« À revoir »",
              "Remédiation guidée",
              "Avec vous : réécoute couplet par couplet, mimes, relecture de « Je retiens », puis quiz en binôme avec un tuteur, en utilisant le bouton 🔊."
            ]
          ]
        },
        {
          "type": "tableau",
          "titre": "Modèle de fiche de suivi (le site n'enregistre pas les notes : recopiez ce tableau dans un cahier)",
          "colonnes": [
            "Élève",
            "Leçon et date",
            "Tentative 1",
            "Tentative 2",
            "Tentative 3",
            "Erreurs repérées",
            "Décision"
          ],
          "lignes": [
            [
              "Aya K.",
              "« Découvrons les Akan » (H 04 · S10), 20/10",
              "6/10",
              "9/10",
              "—",
              "Range les Lobi parmi les Akan",
              "Maîtrisé : devient tutrice"
            ],
            [
              "Yao B.",
              "« Mon corps, j'en prends soin » (ST 03 · S7-S8), 22/10",
              "4/10",
              "6/10",
              "8/10",
              "Confond membres supérieurs et inférieurs",
              "Maîtrisé après remédiation"
            ],
            [
              "Classe entière (quiz collectif)",
              "« Ma parole, ta parole » (E 04 · S10), 23/10",
              "7/10",
              "—",
              "—",
              "Ordre d'une prise de parole respectueuse",
              "Réécoute ciblée ; nouvelle tentative à la séance suivante"
            ],
            [
              "…",
              "…",
              "…",
              "…",
              "…",
              "…",
              "…"
            ]
          ]
        },
        {
          "type": "sous-titre",
          "texte": "7. Différencier"
        },
        {
          "type": "tableau",
          "titre": "Adapter le clip et le quiz à chaque élève",
          "colonnes": [
            "Élèves concernés",
            "Ce que vous proposez",
            "Fonctions du site utiles"
          ],
          "lignes": [
            [
              "Élèves en difficulté",
              "Découpez le clip partie par partie. Faites les défis en binôme. Fixez un objectif d'étape (6/10, puis 8/10). Proposez une réécoute à la maison.",
              "« Réécouter la chanson » ; « Recommencer le quiz » ; correction commentée"
            ],
            [
              "Élèves rapides",
              "Confiez-leur le tutorat. Faites écrire un nouveau couplet ou inventer une question de quiz avec son explication. Faites-leur présenter la mission à la classe.",
              "Nouveau tirage pour viser 10/10 ; compétitions"
            ],
            [
              "Élèves qui lisent mal",
              "Formez des binômes bon lecteur et lecteur fragile. Acceptez les réponses orales. Faites relire la question après l'écoute.",
              "Bouton 🔊 de chaque question ; correction lue automatiquement"
            ],
            [
              "Élèves malvoyants",
              "Placez-les près de l'écran. Lisez les questions à voix haute et décrivez oralement les images (plan, carte, dessin).",
              "Plein écran ; bouton 🔊 ; lecture automatique de la correction"
            ],
            [
              "Élèves malentendants",
              "Placez-les face à l'écran. Écrivez les consignes et le refrain au tableau. Utilisez beaucoup les mimes.",
              "Texte affiché sur les diapositives ; correction écrite à l'écran"
            ],
            [
              "Élèves ayant des difficultés motrices",
              "Un camarade clique ou écrit sous leur dictée. Acceptez les réponses orales ou montrées du doigt.",
              "Une question à la fois ; « ↺ Refaire l'ordre » pour corriger une remise en ordre"
            ],
            [
              "Élèves dont l'attention est fragile",
              "Proposez des séquences courtes et des rôles actifs (cliqueur, secrétaire, chef de mime).",
              "Une question à la fois ; barre de progression « Question n / 10 »"
            ]
          ]
        },
        {
          "type": "sous-titre",
          "texte": "8. Exploitations transversales"
        },
        {
          "type": "tableau",
          "titre": "Prolonger la leçon dans les autres disciplines",
          "colonnes": [
            "Domaine",
            "Activité proposée",
            "Exemple tiré d'une leçon"
          ],
          "lignes": [
            [
              "Expression orale",
              "Reformuler « Je retiens » ; justifier chaque réponse ; raconter la mission ; mini-débat réglé.",
              "« Ma parole, ta parole » : débat en quatre temps (demander la parole, présenter son idée, expliquer sa raison, écouter les autres avis)."
            ],
            [
              "Lecture",
              "Lire à voix haute les questions du quiz avant d'appuyer sur 🔊 ; lire la trace écrite.",
              "Lire la question, puis écouter la lecture du site pour vérifier les mots difficiles."
            ],
            [
              "Production d'écrit",
              "Écrire un nouveau couplet sur le même air : reprendre les mots-clés, chercher des rimes. Rédiger une légende ou la trace écrite.",
              "« Mon corps, j'en prends soin » : un couplet sur le brossage des dents ou sur le lavage des mains avant de manger."
            ],
            [
              "Éducation musicale",
              "Mimes, frappés, chant par groupes alternés, accompagnement avec des instruments locaux. S'appuyer sur l'« Air africain suggéré » (style, tempo, instruments) quand il est indiqué.",
              "Chorale de classe pour la fête de l'école ou une réunion de parents."
            ],
            [
              "Géographie, histoire, arts plastiques",
              "Dessiner un plan ; colorier une carte.",
              "« Ma classe vue de dessus » : plan avec titre et légende. « Découvrons les Akan » : situer le centre, l'est et le sud-est sur une carte de la Côte d'Ivoire."
            ],
            [
              "Mathématiques",
              "Compter, se repérer, reconnaître des formes.",
              "Plan de notre classe : 6 rangées de 4 tables, combien de tables ? Sur un plan, une table se dessine avec un rectangle."
            ],
            [
              "EDHC et vivre ensemble",
              "Construire une règle ou une charte de classe ; jeux de rôle.",
              "« Différents, et tous respectés » : la règle « Tout le monde peut participer ». « Ma parole, ta parole » : les règles de discussion de la classe."
            ],
            [
              "Lien avec les familles",
              "Mission avec un adulte ; quiz à la maison ; refrain chanté en famille.",
              "Le parent signe la note du quiz dans le cahier et raconte comment s'est passée la mission."
            ]
          ]
        },
        {
          "type": "sous-titre",
          "texte": "9. Les compétitions : motiver et entraîner"
        },
        {
          "type": "liste",
          "items": [
            "Le site organise des **épreuves chronométrées** sur les leçons en chanson (page « Compétitions »). Elles sont ouvertes à tous, avec ou sans compte EduWeb. L'inscription est vérifiée par un code envoyé par e-mail. Le classement est automatique à la fin.",
            "Annoncez une compétition comme objectif d'une séquence : les élèves ont une raison de réécouter et de s'entraîner.",
            "Entraînez la classe **avant** la compétition : quiz collectif, puis tentatives individuelles avec des tirages différents, jusqu'à 8/10.",
            "Attention : pendant une compétition, le quiz d'entraînement des leçons concernées est mis en pause (« Quiz en pause pendant la compétition »). Il revient à la fin. Prévoyez donc l'entraînement avant la date.",
            "Les plus jeunes ont besoin d'un adulte pour l'inscription (adresse e-mail et code).",
            "Valorisez les progrès de chacun, pas seulement le classement : comparez la note de la première tentative et celle du jour."
          ]
        },
        {
          "type": "sous-titre",
          "texte": "10. Contraintes fréquentes et solutions"
        },
        {
          "type": "tableau",
          "titre": "Des solutions réalistes pour chaque situation",
          "colonnes": [
            "Contrainte",
            "Solutions"
          ],
          "lignes": [
            [
              "Classe nombreuse",
              "Ardoises et vote collectif ; chant par rangées ; un chef de rangée note les résultats de sa rangée ; fiche de suivi tenue par groupe ; tuteurs pour la remédiation."
            ],
            [
              "Connexion faible ou coûteuse",
              "Ouvrez la page de la leçon avant l'arrivée des élèves, pour vérifier que tout s'affiche. Téléchargez le clip (environ 5 à 7 Mo) pour le projeter sans connexion. Le quiz demande une connexion : faites-le au moment où le réseau est disponible, ou à la maison."
            ],
            [
              "Aucune connexion en classe",
              "Projetez le clip téléchargé : les défis du clip, avec leurs corrections, servent d'évaluation en classe. Le quiz se fait à la maison ou lors d'une séance connectée."
            ],
            [
              "Un seul appareil",
              "Quiz collectif avec ardoises ; ou rotation : un groupe fait le quiz pendant que les autres font un travail écrit (trace écrite, couplet, dessin)."
            ],
            [
              "Pas de vidéoprojecteur",
              "Un ordinateur ou un téléphone relié à une petite enceinte pour le son. Recopiez le refrain et « Je retiens » au tableau. Faites passer les groupes devant l'écran pour les défis."
            ],
            [
              "Coût",
              "Regarder le clip en ligne est toujours gratuit. Sans paiement, le quiz d'un clip payant se limite à un quiz d'essai de 2 questions. Un seul paiement de **200 FCFA** par leçon débloque à la fois le quiz complet et le téléchargement du clip. Payez depuis l'appareil de la classe, au moins la veille. La marche à suivre complète est dans la rubrique « Découvrir l'École chantée », partie « Gratuit ou payant ? ». Certaines leçons plus anciennes sont entièrement gratuites."
            ],
            [
              "Temps limité",
              "Variante de 30 minutes ; mission et quiz à la maison ; refrain en rituel de deux minutes."
            ]
          ]
        },
        {
          "type": "sous-titre",
          "texte": "11. Les erreurs à éviter"
        },
        {
          "type": "tableau",
          "titre": "Erreurs fréquentes et bons réflexes",
          "colonnes": [
            "Erreur",
            "Pourquoi l'éviter",
            "À faire plutôt"
          ],
          "lignes": [
            [
              "Remplacer votre leçon par le clip",
              "Le clip ne pose pas la situation d'apprentissage et ne s'adapte pas à vos élèves.",
              "Intégrez-le à votre fiche de séance, à des moments précis."
            ],
            [
              "Projeter un clip que vous n'avez pas vu",
              "Un mot difficile ou une question peut vous surprendre devant la classe.",
              "Visionnez-le en entier et notez les réponses des défis."
            ],
            [
              "Suivre l'ordre de la banque",
              "Il peut différer de celui du livre et du cahier de texte.",
              "Fiez-vous aux titres et à la progression officielle."
            ],
            [
              "Laisser défiler les défis sans pause",
              "La correction arrive aussitôt : les élèves recopient sans réfléchir.",
              "Mettez en pause dès « PAUSE ! Réponds avant la correction »."
            ],
            [
              "Cliquer « Vérifier » avant le vote de la classe",
              "La réponse est verrouillée et la correction s'affiche : le vote n'a plus de sens.",
              "Vote sur ardoise d'abord, justification ensuite, clic en dernier."
            ],
            [
              "Accepter une bonne réponse sans explication",
              "Une réponse donnée au hasard ne prouve rien.",
              "Demandez toujours « pourquoi ? »."
            ],
            [
              "Faire du quiz une note de composition ou une sanction",
              "C'est une autoévaluation formative, et les questions changent à chaque tentative.",
              "Servez-vous-en pour repérer les erreurs et remédier."
            ],
            [
              "Faire recommencer le quiz sans réécoute",
              "L'élève devine au lieu de comprendre.",
              "Réécoute ciblée, puis nouvelle tentative."
            ],
            [
              "Ne pas noter les résultats",
              "Le site n'enregistre pas les notes.",
              "Tenez une fiche de suivi, ou faites écrire la note dans le cahier."
            ],
            [
              "Oublier la mission ou son retour",
              "La leçon reste à l'école ; l'intégration se perd.",
              "Faites noter la mission dans le cahier et prévoyez cinq minutes de retour."
            ],
            [
              "Prévoir l'entraînement pendant une compétition",
              "Le quiz d'entraînement des leçons concernées est en pause.",
              "Entraînez la classe avant la compétition."
            ],
            [
              "Payer sur un appareil et projeter depuis un autre",
              "Seul l'appareil qui a déclaré le paiement se débloque tout seul.",
              "Payez depuis l'appareil de la classe, ou ouvrez sur l'autre appareil le lien reçu par e-mail."
            ],
            [
              "Compter sur le quiz sans connexion",
              "Le quiz demande Internet.",
              "Téléchargez le clip pour la classe ; faites le quiz quand le réseau est disponible."
            ]
          ]
        }
      ]
    },
    {
      "id": "apprenant",
      "titre": "Pour l’apprenant : apprendre en chantant, pas à pas",
      "icone": "🎒",
      "accroche": "Tu veux retenir ta leçon facilement ? Regarde le clip, chante, mime, puis teste-toi avec le quiz. Voici comment faire, pas à pas.",
      "blocs": [
        {
          "type": "paragraphe",
          "texte": "L’École chantée est une banque de leçons en chanson. Chaque leçon a un clip vidéo et un quiz. Le clip t’aide à comprendre et à retenir. Le quiz te montre si tu as bien appris. Tu n’as pas besoin de compte. Il te faut un téléphone, une tablette ou un ordinateur, avec Internet."
        },
        {
          "type": "etapes",
          "titre": "🎵 Ma méthode en 10 étapes",
          "etapes": [
            {
              "titre": "Trouve ta leçon",
              "texte": "Dans le menu du site, appuie sur « École chantée ». Dans « Choisis ton cycle », appuie sur ton cycle : « Cycle primaire » ou « 1er cycle secondaire ». Le site s’en souviendra la prochaine fois. Ouvre ton niveau (par exemple « CE2 » ou « 6e »), puis ta matière (par exemple « Éveil au milieu » ou « SVT »). Fie-toi au titre de la leçon : l’ordre peut être différent de celui de ton livre. Sur la carte de ta leçon, appuie sur le bouton orange « 🎯 Chanson & évaluation »."
            },
            {
              "titre": "Regarde le clip en entier",
              "texte": "La première fois, regarde-le du début à la fin, sans t’arrêter. Mets le plein écran si tu veux. Écoute bien les paroles. Sur le premier écran, lis l’objectif de la leçon : c’est ce que tu sauras faire à la fin."
            },
            {
              "titre": "Chante le refrain et mime",
              "texte": "Le refrain revient plusieurs fois. Chante-le, frappe dans tes mains et reprends-le deux fois. Pendant les couplets, mime les mots importants. Exemple avec « Mon corps, j’en prends soin » : touche ta tête, ton tronc, tes bras et tes jambes quand la chanson parle des parties du corps."
            },
            {
              "titre": "Dis le « Je retiens » avec tes mots",
              "texte": "L’écran « Je retiens » donne les 3 idées importantes de la leçon. Fais pause. Lis-les une fois. Puis cache l’écran et redis-les avec tes propres mots. Exemple avec « Découvrons les Akan » : « Le groupe Akan, ce sont plusieurs peuples qui ont des liens, comme les Baoulé, les Agni et les Abron. »"
            },
            {
              "titre": "Fais une pause aux défis",
              "texte": "Le clip a 3 défis. Chaque défi pose 2 questions. Quand l’écran affiche « À toi de jouer ! », mets la vidéo sur pause. Réponds AVANT de voir la correction. Dis ta réponse à voix haute ou écris-la sur ton ardoise. Relance la vidéo : l’écran « Je vérifie et j’explique » donne la correction. Vérifie, puis dis pourquoi c’est la bonne réponse."
            },
            {
              "titre": "Fais le quiz",
              "texte": "Descends jusqu’à « Teste-toi : le quiz de la leçon ». Les questions arrivent une par une. Lis la question, ou écoute-la avec le bouton 🔊. Réponds de mémoire, sans remonter au clip. Choisis ta réponse, puis appuie sur « Vérifier »."
            },
            {
              "titre": "Lis et écoute la correction",
              "texte": "Le site te dit tout de suite « Bonne réponse ! » ou « Pas tout à fait ». Il donne la bonne réponse et une explication. Une voix lit cette correction pour toi. Écoute-la jusqu’au bout, même quand tu as juste. Puis appuie sur « Question suivante → ». Le bouton « ← Précédente » te permet de revoir une question déjà faite."
            },
            {
              "titre": "Écris ta note",
              "texte": "À la fin, tu lis « Ta note : … / 10 ». Le site **ne garde pas ta note**. Écris-la tout de suite dans ton cahier, avec la date et le titre de la leçon."
            },
            {
              "titre": "Recommence si « À revoir »",
              "texte": "8 sur 10 ou plus : « Je maîtrise ! ». Bravo ! Moins de 8 : « À revoir ». Ce n’est pas grave. Appuie sur « Réécouter la chanson » : le clip repart au début. Puis appuie sur « Recommencer le quiz ». Le quiz tire au sort de nouveau 10 questions : certaines seront nouvelles, et l’ordre change."
            },
            {
              "titre": "Fais la mission avec un adulte",
              "texte": "Le dernier écran du clip s’appelle « Mission avec un adulte ». Il te donne une petite tâche à faire dans la vraie vie. Exemple avec la leçon « Le plan de la classe » (chanson « Ma classe vue de dessus ») : dessiner le plan de ta classe. Fais-la avec un parent, un grand frère ou une grande sœur. Puis chante le refrain deux fois et raconte ce que tu as appris."
            }
          ]
        },
        {
          "type": "encadre",
          "ton": "astuce",
          "titre": "Le secret : tout est dans la chanson",
          "texte": "Le clip contient **toutes les réponses** du quiz. Tu peux le regarder autant de fois que tu veux. Le regarder en ligne est toujours gratuit. Attention : certains clips plus anciens sont plus courts. Ils n’ont pas toujours de défis, de « Je retiens » ni de mission. Fais alors seulement les étapes qui existent."
        },
        {
          "type": "tableau",
          "titre": "✏️ Comment répondre à chaque type de question",
          "colonnes": [
            "Type de question",
            "Comment la reconnaître",
            "Ce que tu fais",
            "Exemple tiré d’une leçon"
          ],
          "lignes": [
            [
              "Choix unique",
              "Plusieurs propositions. Une seule est juste.",
              "Lis toutes les propositions. Élimine celles qui sont fausses. Choisis la meilleure. Appuie sur « Vérifier ».",
              "« Quel peuple fait partie du groupe Akan ? » → les Baoulé (« Découvrons les Akan »)."
            ],
            [
              "Plusieurs réponses",
              "Le badge « plusieurs réponses ». La question dit souvent : « Choisis les deux bonnes réponses ».",
              "Coche **toutes les bonnes réponses, et seulement elles**. Une réponse oubliée ou une réponse en trop, et tu n’as pas le point.",
              "« Quand faut-il se laver les mains ? » → avant de manger ET après les toilettes (« Mon corps, j’en prends soin »)."
            ],
            [
              "Vrai ou faux",
              "Une phrase à juger : est-elle vraie ou fausse ?",
              "Lis la phrase mot par mot. Un petit mot peut la rendre fausse : « tous », « exactement », « seulement », « jamais ».",
              "« Tous les peuples Akan ont exactement les mêmes coutumes. » → Faux : leurs coutumes peuvent être différentes (« Découvrons les Akan »)."
            ],
            [
              "Mot à écrire",
              "Une case où tu écris. La question dit souvent « Choisis parmi : … ».",
              "Trouve le mot qui complète la phrase. Écris-le dans la case. Les majuscules, les accents et la ponctuation ne comptent pas.",
              "« Je t’écoute, tu m’… » Choisis parmi : écoutes, oublies, insultes. → écoutes (« Ma parole, ta parole »)."
            ],
            [
              "Remettre dans l’ordre",
              "Le badge « clique dans l’ordre » et des étiquettes à ranger.",
              "Clique les étiquettes de la première à la dernière. Tu t’es trompé ? Appuie sur « ↺ Refaire l’ordre » et recommence.",
              "Faire le plan de la classe : observer la classe → tracer le contour de la salle → placer les ouvertures et les tables → ajouter un titre et une légende (« Le plan de la classe »)."
            ],
            [
              "Question avec une image",
              "Un plan, une carte, un schéma ou un dessin au-dessus de la question.",
              "Observe l’image avant de répondre. Regarde la légende, les lettres et les couleurs. Puis lis les propositions.",
              "« Observe le plan. D’après la légende, que représente le trait vert épais ? » → le tableau (« Le plan de la classe »)."
            ]
          ]
        },
        {
          "type": "encadre",
          "ton": "exemple",
          "titre": "Exemple : je réfléchis à voix haute",
          "texte": "Question du quiz « Ma parole, ta parole » : « Ton ami veut choisir seul le jeu du groupe. Que proposes-tu ? » Je lis les 4 propositions. « Lui crier dessus » : non, ce n’est pas respectueux. « Chasser ceux qui hésitent » : non, on n’exclut personne. « Qu’il décide seul pour tout le monde » : non, les autres n’ont pas parlé. « Que chacun donne son avis » : oui ! La chanson dit que chacun peut donner son avis. J’appuie sur « Vérifier ». Puis je lis l’explication pour voir si ma raison était la bonne."
        },
        {
          "type": "etapes",
          "titre": "🔁 Si tu vois « À revoir »",
          "etapes": [
            {
              "titre": "Garde ton calme",
              "texte": "« À revoir » n’est pas une punition. Cela veut dire : encore un petit effort. Tout le monde se trompe quand il apprend."
            },
            {
              "titre": "Repère tes erreurs",
              "texte": "Pendant le quiz, quand tu lis « Pas tout à fait », regarde l’explication. Les mots importants y sont écrits en MAJUSCULES. Recopie-les sur ton ardoise ou dans ton cahier. Tu sauras quoi réécouter."
            },
            {
              "titre": "Réécoute la chanson",
              "texte": "Appuie sur « Réécouter la chanson ». Le clip repart au début. Écoute surtout les passages qui parlent de tes erreurs, et l’écran « Je retiens »."
            },
            {
              "titre": "Chante encore le refrain",
              "texte": "Le refrain porte souvent l’idée principale de la leçon. Exemple dans « Ma parole, ta parole » : « Je t’écoute, tu m’écoutes »."
            },
            {
              "titre": "Recommence le quiz",
              "texte": "Appuie sur « Recommencer le quiz ». Le quiz fait un **nouveau tirage** : tu auras des questions nouvelles et d’autres déjà vues, dans un autre ordre. Prends ton temps."
            },
            {
              "titre": "Compare tes notes",
              "texte": "Écris ta nouvelle note à côté de l’ancienne. Tu vois tes progrès."
            },
            {
              "titre": "Toujours « À revoir » ?",
              "texte": "Après 2 ou 3 essais, arrête pour aujourd’hui. Reviens demain. Tu peux aussi demander de l’aide à ton maître, à ta maîtresse, à ton professeur ou à un parent."
            }
          ]
        },
        {
          "type": "tableau",
          "titre": "📅 Apprendre sur plusieurs jours",
          "colonnes": [
            "Quand ?",
            "Ce que tu fais",
            "Pourquoi ?"
          ],
          "lignes": [
            [
              "Jour 1 (le jour de la leçon en classe)",
              "Regarde le clip, chante le refrain, réponds aux défis, fais le quiz une fois.",
              "Pour découvrir la chanson et la leçon."
            ],
            [
              "Jour 2",
              "Chante le refrain de mémoire, puis refais le quiz.",
              "Le quiz fait un nouveau tirage. Tu vérifies que tu as vraiment compris, et pas seulement retenu la place des réponses."
            ],
            [
              "Jour 3",
              "Fais la mission avec un adulte. Explique-lui la leçon.",
              "Expliquer à quelqu’un aide beaucoup à retenir."
            ],
            [
              "Une semaine plus tard",
              "Refais le quiz sans regarder le clip avant.",
              "Pour voir si tu te souviens encore."
            ],
            [
              "La veille d’une évaluation",
              "Regarde le clip une fois, puis refais le quiz. Vise 8 sur 10 ou plus.",
              "Pour réviser vite et bien."
            ]
          ]
        },
        {
          "type": "tableau",
          "titre": "📒 Ma fiche de notes (à recopier dans ton cahier)",
          "colonnes": [
            "Date",
            "Leçon",
            "Ma note",
            "Résultat",
            "Ce que je dois revoir"
          ],
          "lignes": [
            [
              "Lundi",
              "Découvrons les Akan",
              "6 / 10",
              "À revoir",
              "Les peuples Akan : Baoulé, Agni, Abron"
            ],
            [
              "Mardi",
              "Découvrons les Akan",
              "9 / 10",
              "Je maîtrise !",
              "Les Akan qui vivent près des lagunes"
            ],
            [
              "Jeudi",
              "Ma parole, ta parole",
              "8 / 10",
              "Je maîtrise !",
              "L’ordre d’une prise de parole"
            ]
          ]
        },
        {
          "type": "encadre",
          "ton": "info",
          "titre": "🔓 Tu ne vois que 2 questions ?",
          "texte": "C’est un **quiz d’essai**. Les 2 questions restent les mêmes pendant ta visite. À la fin, tu lis « Fin du quiz d’essai ». Ce n’est pas une panne. Pour avoir le quiz complet, il faut payer 200 FCFA pour cette leçon, avec le bouton « Quiz complet + téléchargement — 200 FCFA ». **Ne paie jamais seul** : montre l’écran à un adulte de ta famille. Un seul paiement débloque à la fois le quiz complet et le téléchargement du clip. En attendant, le clip reste gratuit : regarde-le autant que tu veux et réponds à ses défis. Certaines leçons sont entièrement gratuites."
        },
        {
          "type": "liste",
          "titre": "⭐ Mes bonnes habitudes",
          "items": [
            "**Ne réponds pas au hasard.** Réfléchis et élimine les propositions fausses. Si tu ne sais vraiment pas, note la question : tu réécouteras ce passage du clip après le quiz.",
            "Lis toutes les propositions avant de choisir. La première n’est pas toujours la bonne.",
            "**Explique pourquoi.** Après chaque réponse, dis à voix haute : « C’est juste parce que… ».",
            "**Écoute avec le 🔊.** Une question est longue ou difficile à lire ? Appuie sur 🔊 : le site la lit pour toi, avec les propositions.",
            "**Fais des pauses.** Une leçon à la fois. Après un moment d’écran, lève-toi, bouge et bois de l’eau.",
            "Garde ton ardoise ou ton cahier près de toi pour noter les mots nouveaux.",
            "Chante aussi sans écran : à la maison, sur le chemin de l’école, avec tes camarades.",
            "Utilise le téléphone d’un parent seulement avec sa permission. Regarder un clip utilise des données Internet (environ 5 à 7 Mo).",
            "Si d’autres personnes travaillent près de toi, baisse le son ou mets des écouteurs.",
            "Quand tu bloques, demande de l’aide : à ton maître, à ta maîtresse, à ton professeur, à tes parents."
          ]
        },
        {
          "type": "sous-titre",
          "texte": "Tes questions, nos réponses"
        },
        {
          "type": "faq",
          "items": [
            {
              "q": "Dois-je créer un compte ?",
              "r": "Non. Tu peux regarder les clips et faire les quiz sans compte."
            },
            {
              "q": "Le site garde-t-il ma note ?",
              "r": "Non. Écris ta note dans ton cahier à chaque fois. Sinon, tu ne pourras pas voir tes progrès."
            },
            {
              "q": "Pourquoi les questions changent quand je recommence ?",
              "r": "Chaque leçon a une grande réserve de questions, souvent 14 à 20. À chaque essai, le quiz en tire 10 au hasard. Il mélange aussi les questions et les propositions. C’est fait exprès : tu apprends vraiment la leçon, pas la place des réponses."
            },
            {
              "q": "Puis-je faire le quiz sans Internet ?",
              "r": "Non, le quiz a besoin d’Internet. Mais un clip téléchargé (après le paiement par un adulte) se regarde sans connexion."
            },
            {
              "q": "Je ne trouve pas ma leçon. Que faire ?",
              "r": "Vérifie ton cycle, ton niveau et ta matière. Lis bien les titres : l’ordre peut être différent de celui de ton livre. La banque s’enrichit régulièrement : ta leçon arrivera peut-être bientôt."
            },
            {
              "q": "L’adulte a payé, mais je vois encore 2 questions.",
              "r": "Une personne vérifie chaque paiement. Cela peut prendre jusqu’à 12 heures. Sur l’appareil qui a déclaré le paiement, la page affiche « Paiement déclaré : vérification en cours », puis se débloque toute seule. Sur un autre appareil, l’adulte ouvre le lien reçu par e-mail. On ne paie jamais deux fois pour la même leçon."
            },
            {
              "q": "Le quiz affiche « Quiz en pause pendant la compétition ».",
              "r": "Une compétition a lieu sur cette leçon. Le quiz d’entraînement revient à la fin de la compétition. Reviens un peu plus tard. Si tu veux participer à la compétition, demande à un adulte de t’aider à t’inscrire."
            },
            {
              "q": "Je n’entends pas la voix qui lit la correction.",
              "r": "La voix vient de ton téléphone ou de ton ordinateur. Monte le son de l’appareil. Tu peux aussi lire la correction à l’écran."
            }
          ]
        }
      ]
    },
    {
      "id": "parent",
      "titre": "Pour le parent d'élève : accompagner son enfant",
      "icone": "👪",
      "accroche": "Votre enfant apprend sa leçon en chantant, puis il se teste avec un quiz qui corrige chaque réponse. Voici comment l'accompagner en 15 à 20 minutes, sans faire le travail à sa place.",
      "blocs": [
        {
          "type": "paragraphe",
          "texte": "Vous n'avez pas besoin d'être enseignant, ni de connaître la leçon. Le clip contient toutes les réponses du quiz. Le quiz corrige chaque réponse, explique pourquoi et lit cette correction à voix haute. Même si vous lisez peu le français, vous pouvez aider : le bouton 🔊 lit la question et ses propositions. Votre rôle est simple : **encourager**, **accompagner** et faire parler votre enfant. C'est lui qui chante, qui répond et qui explique. Dans ce guide, « touchez » veut dire « cliquez » si vous êtes sur un ordinateur."
        },
        {
          "type": "tableau",
          "titre": "Votre rôle : ce qui aide, ce qui n'aide pas",
          "colonnes": [
            "Ce qui aide votre enfant",
            "Ce qu'il vaut mieux éviter"
          ],
          "lignes": [
            [
              "Le laisser tenir le téléphone et choisir lui-même ses réponses.",
              "Répondre à sa place pour obtenir une bonne note."
            ],
            [
              "Le laisser se tromper : l'erreur, suivie de l'explication, fait apprendre.",
              "Lui souffler la réponse avant qu'il touche « Vérifier »."
            ],
            [
              "Chanter le refrain avec lui en frappant dans les mains.",
              "Le laisser seul devant l'écran pendant une heure."
            ],
            [
              "Lui demander : « Pourquoi c'est la bonne réponse ? »",
              "Passer à la question suivante sans écouter l'explication."
            ],
            [
              "Féliciter l'effort : « Tu es passé de 5 à 7 ! »",
              "Gronder pour une note basse. Le quiz sert à apprendre, pas à punir."
            ],
            [
              "Faire réécouter le clip avant de recommencer le quiz.",
              "Faire refaire le quiz tout de suite, sans revoir le clip."
            ]
          ]
        },
        {
          "type": "etapes",
          "titre": "Une routine simple de 15 à 20 minutes (dans l'ordre du clip)",
          "etapes": [
            {
              "titre": "Choisir la bonne leçon (1 min)",
              "texte": "Demandez à votre enfant ce qu'il a étudié en classe, ou regardez son cahier. Sur family.eduweb.ci, ouvrez l'onglet « École chantée ». Dans « Choisis ton cycle », choisissez le cycle : le site retient ce choix pour la prochaine fois. Ouvrez le niveau (ex. CE2), puis la discipline (ex. Éveil au milieu). Fiez-vous au titre de la leçon : l'ordre de la banque peut différer de celui du cahier. Touchez ensuite le bouton orange « Chanson & évaluation »."
            },
            {
              "titre": "Regarder et chanter (5 min)",
              "texte": "Regardez le clip avec lui, en plein écran si l'écran est petit. Sur la première diapositive, lisez ensemble l'objectif de la leçon. Pendant les couplets, il mime les mots importants. Au refrain, chantez ensemble en frappant dans les mains, et reprenez-le deux fois."
            },
            {
              "titre": "Redire « Je retiens » (2 min)",
              "texte": "Mettez en pause sur la diapositive « Je retiens ». Lisez les trois idées-clés. Puis demandez-lui de les redire avec ses propres mots, sans regarder l'écran."
            },
            {
              "titre": "Faire les défis du clip (3 min)",
              "texte": "Les clips récents ont trois défis de deux questions. À chaque « PAUSE ! Réponds avant la correction », mettez la vidéo en pause. Il choisit sa réponse et dit pourquoi, à voix haute. Relancez : la correction s'affiche. Demandez-lui de redire l'explication avec ses mots. Un clip plus ancien, plus court, n'a pas toujours ces défis : passez alors à l'étape suivante."
            },
            {
              "titre": "Lire la mission (1 min)",
              "texte": "Sur la dernière diapositive, lisez ensemble la « Mission avec un adulte ». Ne la faites pas tout de suite : fixez ensemble un moment pour la faire, sans écran (voir plus bas)."
            },
            {
              "titre": "Faire le quiz (5 min)",
              "texte": "Sous le clip, descendez à « Teste-toi : le quiz de la leçon ». Votre enfant répond seul, une question à la fois, puis il touche « Vérifier » et « Question suivante → ». Écoutez avec lui la correction lue à voix haute. S'il lit encore lentement, touchez 🔊 pour faire lire la question. Le bouton « ← Précédente » permet de revoir une question déjà faite, avec sa correction."
            },
            {
              "titre": "Conclure (2 min)",
              "texte": "Recopiez le résultat sur la fiche de suivi. Si le site affiche « Je maîtrise ! » (8/10 ou plus), félicitez-le. S'il affiche « À revoir », prévoyez de réécouter le clip et de refaire le quiz le lendemain. Terminez par une ou deux questions des listes ci-dessous, téléphone rangé."
            }
          ]
        },
        {
          "type": "liste",
          "titre": "Questions à poser après le clip",
          "items": [
            "« Qu'est-ce que tu as appris aujourd'hui ? Dis-le en une phrase. »",
            "« Quelles sont les trois idées du “Je retiens” ? Dis-les avec tes mots. »",
            "« Chante-moi le refrain. Que veut dire cette phrase ? » Par exemple : « Je t'écoute, tu m'écoutes » dans « Ma parole, ta parole », ou « Notre amitié n'a pas de prix » dans « Différents, et tous respectés ».",
            "« Quel mot nouveau as-tu entendu ? Explique-le-moi. » Par exemple : « légende » dans « Le plan de la classe », ou « tronc » dans « Mon corps, j'en prends soin ».",
            "« Montre-moi le geste que tu as fait pour ce mot. » Le mime aide à retenir.",
            "« Où vois-tu cela autour de nous ? » Par exemple : « Quand te laves-tu les mains à la maison ? » ou « Comment chacun donne-t-il son avis dans notre famille ? »"
          ]
        },
        {
          "type": "liste",
          "titre": "Questions à poser pendant le quiz et à la fin",
          "items": [
            "Pendant le quiz, juste après une erreur : « Qu’a dit l’explication ? Redis-la avec tes mots. » Posez-la avant de toucher « Question suivante → » : une fois la note affichée, les questions et leurs corrections ne sont plus visibles.",
            "Pendant le quiz, pour une question avec une image (plan, carte, dessin) : « Montre-moi sur l’image comment tu as trouvé. »",
            "Juste après « Vérifier », pour une question « plusieurs réponses » : « Avais-tu coché toutes les bonnes réponses, et seulement elles ? »",
            "Juste après « Vérifier », pour une question « clique dans l’ordre » : « Explique-moi pourquoi cette étape vient avant l’autre. »",
            "À la fin : « Quelle question était la plus facile ? Laquelle était la plus difficile ? »",
            "À la fin : « Où se trouvait la réponse dans la chanson ? Chante-moi ce passage. »",
            "À la fin : « Que vas-tu faire pour avoir 8/10 la prochaine fois ? »"
          ]
        },
        {
          "type": "etapes",
          "titre": "La mission avec un adulte : comment la faire",
          "etapes": [
            {
              "titre": "Lire la mission ensemble",
              "texte": "Dans la plupart des clips récents, la dernière diapositive s'intitule « Mission avec un adulte — Je chante, je retiens, j'agis ! ». Elle propose une petite tâche de la vie réelle. Mettez en pause, lisez-la avec votre enfant et demandez-lui : « Qu'est-ce qu'on doit faire ? » Il répond avec ses mots."
            },
            {
              "titre": "Choisir un moment",
              "texte": "Le soir même ou le week-end. Dix à quinze minutes suffisent. Pas besoin de matériel coûteux : une feuille, un crayon et ce qui existe à la maison. Certaines missions sont prévues pour la classe (« en petit groupe », « règle de classe ») : à la maison, la famille joue le rôle du groupe, et l'enfant prépare son idée pour la présenter en classe."
            },
            {
              "titre": "Laisser l'enfant faire",
              "texte": "Vous guidez par des questions. C'est lui qui dessine, qui parle ou qui montre. Acceptez un travail imparfait : l'important est qu'il utilise ce qu'il a appris."
            },
            {
              "titre": "Reprendre le refrain et raconter",
              "texte": "Comme le demande le clip, il reprend le refrain deux fois, puis il raconte ce qu'il a appris."
            },
            {
              "titre": "Garder une trace",
              "texte": "Gardez le dessin, ou notez en une phrase ce qu'il a fait. Il pourra le montrer à son enseignant."
            }
          ]
        },
        {
          "type": "tableau",
          "titre": "Exemples tirés des leçons de CE2 (la consigne exacte est celle affichée dans le clip)",
          "colonnes": [
            "Leçon",
            "La mission du clip",
            "À la maison, avec vous",
            "Ce que vous vérifiez"
          ],
          "lignes": [
            [
              "« Le plan de la classe » (Géographie G 02, chanson « Ma classe vue de dessus »)",
              "Dessiner le plan de sa classe.",
              "Il dessine de mémoire sa classe vue de dessus. Pour prolonger, il dessine le plan de sa chambre ou de la cour.",
              "Les étapes de la chanson : observer, tracer le contour (les murs), placer les ouvertures (portes, fenêtres) et les tables, ajouter un titre et une légende qui explique les signes."
            ],
            [
              "« Ma parole, ta parole » (EDHC E 04)",
              "En petit groupe, proposer deux façons de rendre la cour plus agréable. Chacun donne une raison.",
              "La famille forme le petit groupe. Chacun propose une idée pour la cour de l'école ou de la maison, et dit pourquoi.",
              "Il demande la parole, dit son idée et sa raison, écoute les autres jusqu'au bout et reste poli même s'il n'est pas d'accord."
            ],
            [
              "« Découvrons les Akan » (Histoire H 04)",
              "Sur une carte, montrer le centre, l'est et le sud-est. Citer deux peuples Akan sans attribuer une coutume à tous.",
              "Avec une carte de la Côte d'Ivoire (livre, cahier ou carte dessinée), il montre ces trois zones. Il cite deux peuples Akan de la chanson : Baoulé, Agni ou Abron.",
              "Il ne dit pas que tous les Akan ont les mêmes coutumes : elles varient. Il parle de chaque peuple avec respect."
            ],
            [
              "« Mon corps, j'en prends soin » (Sciences et Technologie ST 03)",
              "Dessiner un personnage, écrire tête, tronc et membres, puis mimer le lavage des mains sans gaspiller l'eau.",
              "Il dessine et écrit les trois mots. Avant le repas, il se lave vraiment les mains avec de l'eau et du savon.",
              "Les trois parties sont bien placées. Il se lave les mains avant de manger et après les toilettes, sans laisser couler l'eau pour rien."
            ],
            [
              "« Différents, et tous respectés » (EDHC E 03)",
              "Proposer une règle de classe qui permet à chacun de participer aux jeux et aux apprentissages.",
              "Il présente sa règle de classe. Puis il propose une règle pour les jeux en famille ou entre voisins.",
              "La règle n'exclut personne : fille ou garçon, riche ou moins riche, enfant qui a un handicap."
            ]
          ]
        },
        {
          "type": "liste",
          "titre": "Suivre les progrès de votre enfant",
          "items": [
            "Le site **n'enregistre pas** les notes. Recopiez chaque résultat sur une fiche de suivi, dans un cahier (modèle ci-dessous).",
            "Le repère est **8/10** (80 %). À partir de cette note, le site affiche « Je maîtrise ! ». En dessous, il affiche « À revoir ».",
            "Le quiz d'essai d'une leçon payante (2 questions) donne une note sur 2, sans « Je maîtrise ! » ni « À revoir ». Le repère 8/10 concerne le quiz complet.",
            "Sous 8/10 : touchez « Réécouter la chanson » (le clip repart au début), puis « Recommencer le quiz ».",
            "Revenez sur la même leçon plusieurs jours, par exemple jour 1, jour 2 et jour 4. À chaque tentative du quiz complet, 10 questions sont tirées au sort dans la banque de la leçon, et les propositions sont mélangées. Une bonne note répétée montre que la leçon est comprise, pas apprise par cœur.",
            "Félicitez les progrès : passer de 5/10 à 7/10 est déjà une réussite.",
            "Montrez la fiche à l'enseignant (rencontre, cahier de liaison). Il ne voit pas les résultats sur le site : c'est votre fiche qui l'informe."
          ]
        },
        {
          "type": "tableau",
          "titre": "Exemple de fiche de suivi (à recopier dans un cahier)",
          "colonnes": [
            "Jour",
            "Leçon",
            "Note",
            "Ce qu'on fait ensuite"
          ],
          "lignes": [
            [
              "Lundi",
              "Le plan de la classe",
              "6/10",
              "« À revoir ». Réécouter le clip, refaire le quiz mardi."
            ],
            [
              "Mardi",
              "Le plan de la classe",
              "8/10",
              "« Je maîtrise ! » Faire la mission : dessiner le plan."
            ],
            [
              "Jeudi",
              "Le plan de la classe",
              "9/10",
              "Leçon acquise. Passer à la leçon suivante."
            ],
            [
              "Vendredi",
              "Mon corps, j'en prends soin",
              "7/10",
              "Redire le « Je retiens », refaire le quiz samedi."
            ]
          ]
        },
        {
          "type": "liste",
          "titre": "Temps d'écran et sécurité",
          "items": [
            "**Aucun compte** n'est nécessaire pour regarder les clips et faire les quiz. Votre enfant n'a pas à donner son nom. Pour un paiement, c'est votre adresse e-mail qui est demandée, pas la sienne.",
            "Une séance de 15 à 20 minutes suffit. Mieux vaut un peu chaque jour qu'une longue séance le week-end.",
            "Utilisez de préférence votre propre téléphone, près de vous. Vous savez ce que votre enfant regarde et vous partagez le moment.",
            "Réglez le volume à un niveau modéré : la correction est lue à voix haute automatiquement. Avec des écouteurs, baissez encore le son.",
            "Après la séance, reprenez le téléphone. Les questions et la mission se font sans écran.",
            "Un clip pèse environ 5 à 7 Mo. Le quiz demande aussi une connexion. Tenez-en compte pour votre forfait internet."
          ]
        },
        {
          "type": "tableau",
          "titre": "Le paiement expliqué simplement : gratuit ou payant ?",
          "colonnes": [
            "Ce que vous voulez faire",
            "Prix",
            "Ce qu'il faut savoir"
          ],
          "lignes": [
            [
              "Regarder le clip en ligne",
              "Toujours gratuit",
              "Autant de fois que vous voulez, sur téléphone, tablette ou ordinateur."
            ],
            [
              "Essayer le quiz d'une leçon payante",
              "Gratuit",
              "Quiz d'essai de 2 questions tirées au sort (les mêmes pendant la visite), avec leur correction. Il se termine par « Fin du quiz d'essai »."
            ],
            [
              "Quiz complet + téléchargement du clip",
              "200 FCFA par leçon",
              "Un seul paiement débloque les deux : le quiz complet (10 questions tirées au sort à chaque tentative) et le clip à garder sur l'appareil."
            ],
            [
              "Utiliser une leçon plus ancienne entièrement gratuite",
              "Gratuit",
              "Quiz complet et téléchargement direct, sans paiement."
            ],
            [
              "Revenir sur une leçon déjà payée",
              "Rien à repayer",
              "Sur l'appareil débloqué, le bouton de la carte affiche « Télécharger (déjà payé) »."
            ]
          ]
        },
        {
          "type": "etapes",
          "titre": "Payer une leçon, pas à pas",
          "etapes": [
            {
              "titre": "Ouvrir la fenêtre de paiement",
              "texte": "À la fin du quiz d'essai, touchez « Quiz complet + téléchargement — 200 FCFA ». Faites-le de préférence sur l'appareil que votre enfant utilise pour les quiz : c'est cet appareil qui se débloquera tout seul."
            },
            {
              "titre": "Envoyer 200 FCFA",
              "texte": "Par Wave au (+225) 07 0985 8042, ou par Flooz (Moov Money) au (+225) 01 5263 3030."
            },
            {
              "titre": "Garder le SMS",
              "texte": "L'opérateur vous envoie un SMS avec une **référence de transaction**. Vous en aurez besoin à l'étape suivante."
            },
            {
              "titre": "Déclarer le paiement",
              "texte": "Dans la fenêtre du site, indiquez l'opérateur (Wave ou Flooz), la référence reçue par SMS et VOTRE adresse e-mail de parent. Votre enfant n'a pas besoin d'avoir une adresse e-mail."
            },
            {
              "titre": "Attendre la validation",
              "texte": "La page affiche « Paiement déclaré : vérification en cours ». Un administrateur vérifie le paiement. Vous recevez un lien personnel par e-mail en **moins de 12 heures**. Regardez aussi le dossier des courriers indésirables."
            },
            {
              "titre": "Utiliser la leçon débloquée",
              "texte": "Sur l'appareil qui a déclaré le paiement, la page se débloque toute seule dès la validation, quelle que soit l'adresse e-mail indiquée : vous n'avez rien à faire. Sur un autre appareil, votre téléphone par exemple, ouvrez le lien reçu par e-mail, ou connectez-vous avec un compte EduWeb qui a la même adresse e-mail. Le lien de téléchargement est valable 7 jours ; le quiz complet, lui, reste débloqué ensuite. Vous ne payez jamais deux fois la même leçon."
            }
          ]
        },
        {
          "type": "encadre",
          "ton": "astuce",
          "titre": "Pas de connexion à la maison ?",
          "texte": "Après le paiement, téléchargez le clip là où vous avez du réseau (au travail, chez un proche, avec un forfait du jour), dans les 7 jours qui suivent la validation : ouvrez le lien reçu par e-mail, ou touchez « Télécharger (déjà payé) » sur la carte de la leçon, ou « Télécharger le clip (déjà payé) » sur sa page. Le clip reste alors sur le téléphone. Votre enfant peut le regarder et chanter **sans connexion**, autant de fois qu'il veut, et faire les défis du clip (pause, réponse à voix haute, correction). Attention : le quiz, lui, demande une connexion. Regroupez les quiz sur un moment où vous avez du réseau, par exemple dix minutes le week-end."
        },
        {
          "type": "faq",
          "items": [
            {
              "q": "Je ne trouve pas la leçon que mon enfant étudie. Que faire ?",
              "r": "Vérifiez le cycle choisi dans « Choisis ton cycle », puis le niveau et la discipline. Cherchez par le titre : l'ordre de la banque peut différer de celui du cahier. La banque s'enrichit régulièrement. Si la leçon n'y est pas encore, faites réviser une leçon déjà vue en classe."
            },
            {
              "q": "Le quiz affiche « Quiz en pause pendant la compétition ». Est-ce une panne ?",
              "r": "Non. Une compétition en cours utilise cette leçon. Le quiz d'entraînement revient à la fin de la compétition. Le clip reste disponible : votre enfant peut continuer à chanter et à réviser. Les compétitions sont ouvertes à tous, avec ou sans compte EduWeb."
            },
            {
              "q": "Le quiz d'essai pose toujours les mêmes questions. Pourquoi ?",
              "r": "C'est normal. Le quiz d'essai tire au sort 2 questions, qui restent les mêmes pendant la visite. Le quiz complet, lui, tire 10 questions au sort à chaque tentative."
            },
            {
              "q": "J'ai deux enfants. Dois-je payer deux fois la même leçon ?",
              "r": "Non. Le paiement débloque la leçon sur l'appareil qui l'a déclaré (et, avec le lien ou votre compte, sur vos autres appareils). Vos enfants peuvent faire le quiz complet chacun à son tour. Notez les résultats de chacun séparément."
            },
            {
              "q": "Mon enfant est au collège. La routine change-t-elle ?",
              "r": "Le principe reste le même : clip, défis, quiz, note. Laissez-le plus autonome. Il fait la séance seul, puis il vous explique la leçon et vous montre sa note. Des leçons de 6e sont déjà en ligne, par exemple en Physique-Chimie et en SVT."
            }
          ]
        }
      ]
    },
    {
      "id": "questions",
      "titre": "Questions fréquentes",
      "icone": "❓",
      "accroche": "Des réponses courtes aux questions que posent le plus souvent les enseignants, les parents et les élèves. Si votre question n'y figure pas, écrivez-nous : l'adresse e-mail et le numéro WhatsApp sont dans la partie « Contact », en bas de chaque page du site.",
      "blocs": [
        {
          "type": "faq",
          "items": [
            {
              "q": "Faut-il créer un compte pour utiliser l'École chantée ?",
              "r": "Non. La banque de ressources, les clips et les quiz s'utilisent **sans compte**. Il suffit d'un téléphone, d'une tablette ou d'un ordinateur connecté à Internet. Un compte EduWeb peut cependant vous aider à retrouver, sur un autre appareil, une leçon déjà payée (voir plus bas). Les compétitions sont elles aussi ouvertes avec ou sans compte."
            },
            {
              "q": "Est-ce gratuit ?",
              "r": "Regarder un clip en ligne est **toujours gratuit**, sur toutes les leçons. Le quiz d'essai de 2 questions est gratuit lui aussi. Certaines leçons plus anciennes sont entièrement gratuites : quiz complet et téléchargement direct. Pour la plupart des nouveaux clips, le quiz complet et le téléchargement coûtent 200 FCFA par leçon, en un seul paiement."
            },
            {
              "q": "Pourquoi le quiz ne me pose-t-il que 2 questions ?",
              "r": "Vous êtes sur une leçon payante qui n'est pas encore payée : c'est le **quiz d'essai**. Il propose 2 questions tirées au sort, qui restent les mêmes pendant toute la visite. À la fin s'affichent « Fin du quiz d'essai » et le bouton « Quiz complet + téléchargement — 200 FCFA ». Ce bouton permet de débloquer la leçon."
            },
            {
              "q": "Que débloque exactement le paiement ?",
              "r": "Un seul paiement de 200 FCFA débloque **à la fois** deux choses pour la leçon choisie. 1) Le quiz complet : 10 questions tirées au sort dans toute la banque de la leçon, à chaque tentative. 2) Le téléchargement du clip, pour le regarder sans connexion ou le projeter en classe. Le paiement vaut pour cette leçon seulement. Vous ne payez jamais deux fois la même leçon : le bouton affiche ensuite « Télécharger (déjà payé) »."
            },
            {
              "q": "Combien coûte une leçon et comment payer ?",
              "r": "200 FCFA par leçon (environ 0,30 €). 1) Envoyez 200 FCFA par Wave au (+225) 07 0985 8042, ou par Flooz (Moov Money) au (+225) 01 5263 3030. 2) Gardez le SMS de confirmation : il contient la **référence de la transaction**. 3) Sur le site, touchez « Télécharger » sur la carte de la leçon, ou « Quiz complet + téléchargement — 200 FCFA » à la fin du quiz d'essai. 4) Dans la fenêtre qui s'ouvre, indiquez l'opérateur, la référence et une adresse e-mail (celle d'un parent convient). 5) Un administrateur vérifie le paiement, puis vous envoie un lien personnel par e-mail."
            },
            {
              "q": "En combien de temps vais-je recevoir le lien ?",
              "r": "Après votre déclaration, un administrateur vérifie le paiement. Le lien personnel arrive par e-mail en **moins de 12 heures**. Ce lien de téléchargement reste valable 7 jours : téléchargez le clip pendant ces 7 jours. Ensuite, seul le lien de téléchargement expire : le quiz complet, lui, reste débloqué."
            },
            {
              "q": "J'ai payé, mais la page est toujours bloquée. Que faire ?",
              "r": "C'est normal tant que l'administrateur n'a pas vérifié le paiement. La page affiche alors « Paiement déclaré : vérification en cours ». **Ne payez pas une seconde fois.** Sur l'appareil qui a déclaré le paiement, la page se débloque toute seule dès la validation. Vous pouvez la laisser ouverte, ou revenir plus tard avec le même appareil et le même navigateur. Regardez aussi l'adresse e-mail indiquée, y compris le dossier des courriers indésirables (spam). Si rien n'a changé après 12 heures, écrivez-nous (voir la dernière question)."
            },
            {
              "q": "Le paiement a été déclaré sur le téléphone de mon enfant. Comment utiliser la leçon sur un autre appareil ?",
              "r": "Le téléphone de l'enfant se débloque tout seul dès la validation, même si l'adresse e-mail indiquée est celle d'un parent. Sur un autre appareil (téléphone du parent, ordinateur de l'école), vous avez deux solutions. 1) Ouvrir le lien personnel reçu par e-mail. 2) Vous connecter avec un compte EduWeb qui a la même adresse e-mail que celle donnée au paiement. Conseil : déclarez le paiement depuis l'appareil que l'élève utilisera le plus."
            },
            {
              "q": "Le quiz est-il le même à chaque fois ?",
              "r": "Non, pas le quiz complet. Chaque leçon a une banque de questions (souvent 14 à 20). À chaque tentative, le quiz **tire au sort** 10 questions (ou toutes, si la banque en compte moins) et les mélange. Les propositions de réponse sont aussi mélangées. Recommencer le quiz est donc un vrai nouvel entraînement. Seul le quiz d'essai garde les 2 mêmes questions pendant la visite."
            },
            {
              "q": "Les notes sont-elles enregistrées sur le site ?",
              "r": "Non. Le site **n'enregistre pas** les notes. La note « Ta note : x / 10 » s'affiche seulement à la fin du quiz. Pour suivre les progrès, notez chaque résultat dans un cahier ou sur une fiche de suivi : la date, la leçon, la note sur 10, et « Je maîtrise » ou « À revoir »."
            },
            {
              "q": "Que veut dire « Je maîtrise ! » ?",
              "r": "Ce message s'affiche quand l'élève obtient **8/10 ou plus** (80 %). En dessous de 8/10, le message est « À revoir ». Dans ce cas : 1) touchez « Réécouter la chanson » : le clip repart du début, et il contient toutes les réponses ; 2) touchez ensuite « Recommencer le quiz » pour un nouveau tirage de questions."
            },
            {
              "q": "Peut-on utiliser l'École chantée sans connexion Internet ?",
              "r": "En partie. Un clip **téléchargé** (après paiement, ou directement sur une leçon gratuite) se regarde sans connexion : c'est pratique pour le projeter en classe ou le revoir à la maison. En revanche, regarder un clip en ligne et faire le quiz demandent une connexion. Un clip pèse environ 5 à 7 Mo : téléchargez-le quand le réseau est bon, par exemple en Wi-Fi."
            },
            {
              "q": "Pourquoi le quiz affiche-t-il « Quiz en pause pendant la compétition » ?",
              "r": "Une compétition chronométrée en cours utilise cette leçon. Pour que l'épreuve reste équitable, le quiz d'entraînement et sa correction sont mis en pause. Ils **reviennent à la fin** de la compétition. Le clip reste visible pour réviser, et un bouton permet de participer à la compétition."
            },
            {
              "q": "L'ordre des leçons ne suit pas mon livre ou mon cahier de texte. Est-ce normal ?",
              "r": "Oui. L'ordre de la banque peut être différent de celui du livre ou du cahier de texte. Fiez-vous aux **titres** des leçons : discipline, code de la leçon et numéro de séance. Exemple : « Histoire (H 04) · Séance 10 (S10) — Découvrons les Akan ». Suivez toujours la progression officielle de votre établissement."
            },
            {
              "q": "La voix ne lit pas les questions ou les corrections. Que faire ?",
              "r": "La lecture à voix haute utilise la **synthèse vocale** de votre appareil (téléphone, tablette ou ordinateur). 1) Montez le volume et désactivez le mode silencieux. 2) Touchez le bouton 🔊 de la question : il lit la question et ses propositions. La correction, elle, est lue automatiquement après « Vérifier ». 3) Si l'appareil ne lit toujours pas, essayez un autre navigateur à jour ou un autre appareil. Les émojis ne sont jamais lus. Dans tous les cas, les questions et les corrections restent écrites à l'écran."
            },
            {
              "q": "À qui écrire en cas de problème ?",
              "r": "Écrivez à l'adresse e-mail ou au numéro WhatsApp affichés dans la partie « Contact », en bas de chaque page du site. Pour une réponse rapide, précisez le titre exact de la leçon. Pour un paiement, ajoutez l'opérateur (Wave ou Flooz), la référence de la transaction et l'adresse e-mail indiquée. Ne donnez jamais votre code secret Wave ou Flooz : il n'est pas nécessaire."
            }
          ]
        }
      ]
    }
  ]
};
