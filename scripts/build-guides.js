/* Régénère les guides utilisateurs EduWeb (Word .docx + PDF) — contenu à jour. */
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, LevelFormat, Footer, PageNumber, TabStopType,
  TableOfContents, PageBreak, ShadingType,
} = require('docx');
const PDFDocument = require('pdfkit');

const OUT = path.join(__dirname, '..', 'guides');
const ARIAL = 'C:/Windows/Fonts/arial.ttf';
const ARIALB = 'C:/Windows/Fonts/arialbd.ttf';
const ARIALI = 'C:/Windows/Fonts/ariali.ttf';
const DATE = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
const GREEN = '0E6B3A', GREEN2 = '1E9E57';

// Sections communes ajoutées à chaque guide
const LANG_SECTION = { h: 'Langue de lecture', blocks: [
  ['p', "L'application est disponible en 14 langues. Sur votre tableau de bord, la carte « Langue de lecture » permet de choisir la langue d'affichage ; votre choix est mémorisé pour vos prochaines visites."],
  ['ul', ['Français, Anglais, Arabe, Espagnol, Coréen, Mandarin (chinois), Russe, Ukrainien, Allemand, Portugais, Italien, Turc, Wolof, Swahili.']],
] };
const HELP_SECTION = { h: "Besoin d'aide ?", blocks: [
  ['p', "Une carte « Besoin d'aide ? » figure sur votre tableau de bord, et un bouton flottant « Aide » (en bas à droite de l'écran) vous permet d'ouvrir ce guide à tout moment."],
] };
const INSTALL_SECTION = { h: "Installer l'application sur votre appareil", blocks: [
  ['p', "EduWeb est une application web installable : vous pouvez l'ajouter à l'écran d'accueil de votre téléphone ou au bureau de votre ordinateur, puis l'ouvrir comme une application classique — en plein écran, sans la barre du navigateur, avec l'icône EduWeb. L'installation est gratuite, rapide et ne passe par aucun magasin d'applications."],
  ['astuce', "Cette étape n'est pas obligatoire : vous pouvez très bien utiliser EduWeb dans votre navigateur. L'installer sert seulement à l'ouvrir plus vite la prochaine fois, en appuyant sur une icône, comme une application ordinaire."],
  ['h3', 'Android (Chrome)'],
  ['ol', [
    'Ouvrez family.eduweb.ci dans Chrome.',
    "Touchez la bannière « Installer l'application » si elle apparaît ; sinon, ouvrez le menu (les trois petits points alignés, en haut à droite).",
    "Choisissez « Installer l'application » (ou « Ajouter à l'écran d'accueil »), puis confirmez.",
  ]],
  ['h3', 'iPhone / iPad (Safari)'],
  ['ol', [
    'Ouvrez family.eduweb.ci dans Safari.',
    'Touchez le bouton Partager (le carré surmonté d\'une flèche vers le haut).',
    "Faites défiler, choisissez « Sur l'écran d'accueil », puis « Ajouter ».",
  ]],
  ['h3', 'Ordinateur (Chrome ou Edge)'],
  ['ol', [
    'Ouvrez family.eduweb.ci.',
    "Cliquez sur la petite icône d'installation (un écran avec une flèche vers le bas), à droite de la barre d'adresse (la barre, en haut, où l'on écrit l'adresse du site).",
    'Cliquez sur « Installer ».',
  ]],
  ['p', "Une fois installée, l'icône EduWeb apparaît sur votre écran d'accueil (ou votre bureau) et l'application se met à jour automatiquement à chaque connexion à Internet."],
  ['note', "En cas de coupure d'Internet, l'application affiche une page d'attente claire et se recharge automatiquement dès le retour de la connexion. La consultation des pages nécessite une connexion active."],
] };
// Section autonome « espace de jeu » (accueil, public), proposée aux familles.
const JEUX_SECTION = { h: "Espace de jeu (accueil)", blocks: [
  ['p', "Sur la page d'accueil, un espace de jeu gratuit propose des mini-jeux éducatifs aux écoliers, du préscolaire au CM2 — sans aucun compte. Idéal pour réviser en s'amusant."],
  ['ul', [
    'Rubriques : Nombres, Calcul, Lecture, Vocabulaire et Logique (tables de multiplication, calcul rapide, comparaisons, syllabes, suites…).',
    'Choix du niveau (Préscolaire, CP, CE1, CE2, CM1, CM2) et difficulté croissante au fil de la partie.',
    'Score, chronomètre et meilleur score enregistré sur l\'appareil.',
    'Lecture audio de la consigne (bouton « Écouter ») et effets sonores — un bouton dédié permet de couper le son.',
  ]],
] };

// Section d'accueil pour grands débutants du numérique — ajoutée en tête de chaque guide.
const PREMIERS_PAS = { h: "Bien démarrer — à lire en premier", blocks: [
  ["p", "Ce guide est fait pour tout le monde, même si vous n'avez pas l'habitude des téléphones ou des ordinateurs. Avancez à votre rythme : vous ne pouvez rien « casser », et il est toujours possible de revenir en arrière."],
  ["astuce", "Pour utiliser EduWeb, il vous faut seulement deux choses : un appareil connecté à Internet (téléphone Android, iPhone ou ordinateur) et une adresse e-mail. Si vous n'en avez pas, faites-vous aider pour créer une adresse gratuite (par exemple une adresse Gmail)."],
  ["h3", "Quelques mots à connaître"],
  ["ul", [
    "Navigateur : le programme qui sert à ouvrir les sites Internet. Sur Android, c'est souvent « Chrome » ; sur iPhone, « Safari ».",
    "Adresse du site : ce que l'on écrit tout en haut de l'écran pour ouvrir EduWeb. La nôtre est : family.eduweb.ci",
    "Compte : votre espace personnel, protégé par votre e-mail et un mot de passe.",
    "E-mail (ou courriel) : votre adresse électronique, du type nom@exemple.com. Elle sert à créer votre compte et à recevoir les messages importants.",
    "Mot de passe : un code secret que vous choisissez (au moins 6 caractères). Ne le communiquez à personne.",
    "Bouton : une zone colorée sur laquelle on appuie pour agir (par exemple « Créer un compte »).",
    "Lien : un mot souligné ou coloré sur lequel on appuie pour aller à une autre page.",
    "Formulaire : une suite de cases à remplir (nom, e-mail, etc.).",
  ]],
  ["h3", "Les gestes de base"],
  ["ul", [
    "Toucher ou cliquer : appuyer une fois sur un bouton ou un lien — avec le doigt sur un téléphone, avec la souris sur un ordinateur.",
    "Faire défiler : glisser le doigt vers le haut ou vers le bas pour voir la suite de la page.",
    "Écrire : touchez une case ; un clavier apparaît (sur téléphone) pour taper votre texte.",
    "Revenir en arrière : la flèche « ← », en haut de l'écran, ramène à la page précédente.",
  ]],
  ["h3", "Ouvrir EduWeb (la première fois)"],
  ["ol", [
    "Ouvrez votre navigateur : l'icône « Chrome » (Android) ou « Safari » (iPhone).",
    "Tout en haut de l'écran, écrivez l'adresse : family.eduweb.ci",
    "Validez avec la touche « Entrée » ou « Aller » du clavier.",
    "La page d'accueil d'EduWeb s'affiche : vous êtes au bon endroit.",
  ]],
  ["attention", "Vérifiez bien l'adresse — family.eduweb.ci — sans espace. N'ouvrez jamais un lien reçu d'un inconnu qui imiterait le site, et ne donnez votre mot de passe à personne."],
  ["note", "Vous êtes perdu à un moment ? Deux réflexes simples : appuyez sur la flèche « ← » pour revenir en arrière, ou utilisez le bouton « Aide » (en bas à droite de l'écran), qui rouvre ce guide."],
] };

// ─── Sections « Formation — tests psychotechniques » (partagées, numérotées par guide) ───
const FORMATION_TESTS_SECTION = (n) => ({ h: `${n}. Se préparer aux concours (tests psychotechniques et Fonction Publique)`, blocks: [
  ['p', "EduWeb propose une rubrique « Préparation aux concours » pour réussir les concours d'instituteurs adjoints, de personnel de santé et les concours administratifs. Elle comporte DEUX parcours : les TESTS PSYCHOTECHNIQUES (678 questions corrigées — logique, calcul, vocabulaire, attention, organisation, mémoire, personnalité) et le STATUT GÉNÉRAL DE LA FONCTION PUBLIQUE (la loi n° 2023-892 maîtrisée article par article). Un seul accès couvre les deux."],
  ['h3', "Ouvrir la rubrique"],
  ['ol', [
    "Appuyez sur « Préparation concours » dans le menu du haut (ou sur « 🎓 Préparation aux concours » dans le menu de votre photo, en haut à droite).",
    "La page présente les deux parcours et les formules d'accès.",
    "Appuyez sur « Ouvrir le module » du parcours voulu : chaque module contient ses actions ET votre progression (catégories pour les tests psychotechniques, carte de maîtrise pour la Fonction Publique).",
  ]],
  ['h3', "Obtenir l'accès (payant ou autorisé)"],
  ['p', "L'accès aux tests est réservé. Deux possibilités :"],
  ['ol', [
    "PAYER UNE FORMULE : choisissez une formule (prix, durée et nombre de tests affichés), envoyez le montant par Mobile Money (Wave, Orange Money, MTN MoMo ou Moov Money) au numéro EduWeb indiqué à l'écran, PUIS déclarez votre versement dans le formulaire : opérateur utilisé + référence (l'identifiant reçu par SMS après votre transfert).",
    "OU DEMANDER UNE AUTORISATION GRATUITE : expliquez votre situation ; l'administrateur décide.",
  ]],
  ['p', "Dans les deux cas, un administrateur vérifie puis active votre accès : vous êtes prévenu par e-mail. Tant que ce n'est pas validé, la page affiche « en attente »."],
  ['astuce', "Vous avez un code promo ? Écrivez-le dans la case prévue au moment de la déclaration : la réduction s'applique au montant à payer. Si vous vous êtes inscrit avec le lien d'un parrain, une réduction de bienvenue peut s'appliquer automatiquement — la page vous le dit avant de payer."],
  ['attention', "Envoyez d'abord l'argent par Mobile Money, ensuite déclarez le versement avec la BONNE référence. Une référence introuvable retarde l'activation."],
  ['h3', "Apprendre la méthode (Théorie & astuces)"],
  ['ul', [
    "Chaque catégorie a sa fiche : c'est quoi, comment le reconnaître au concours, la méthode pas à pas, les trucs et astuces, et les pièges à éviter.",
    "Chaque type d'exercice est illustré par un exemple résolu, étape par étape.",
    "Partout, le bouton « 🔊 Écouter » lit le texte à voix haute — pratique si la lecture longue vous fatigue.",
  ]],
  ['h3', "Passer un test"],
  ['ol', [
    "Appuyez sur « Passer un test », puis choisissez : la catégorie, le niveau, le mode et le nombre de questions (10, 20 ou 30).",
    "Mode ENTRAÎNEMENT : sans chronomètre ; la correction expliquée s'affiche après chaque question. Idéal pour apprendre.",
    "Mode CONDITIONS DE CONCOURS : chronométré, correction à la fin — comme le vrai jour J.",
    "Répondez en touchant la réponse A, B, C ou D. « Je ne sais pas, passer » enregistre la question sans réponse.",
  ]],
  ['ul', [
    "Les questions vont du plus facile au plus difficile, et changent à chaque tentative : refaire un test, c'est toujours de nouvelles questions.",
    "Catégorie « Mémoire » : un contenu s'affiche quelques secondes, mémorisez-le bien — la question arrive après qu'il a disparu.",
  ]],
  ['h3', "La reconnaissance par empreinte digitale (facultative)"],
  ['p', "Sur la page « Passer un test », une carte « Reconnaissance par empreinte digitale » vous propose d'attester votre identité avant chaque épreuve. Comment ça fonctionne : c'est le capteur DE VOTRE APPAREIL qui vérifie votre doigt — le lecteur d'empreinte de votre téléphone, ou la reconnaissance de votre ordinateur (Windows Hello). Votre empreinte NE QUITTE JAMAIS votre appareil : EduWeb ne la voit pas et ne la stocke pas ; le site reçoit seulement une preuve chiffrée que c'est bien vous."],
  ['p', "Enregistrer votre empreinte (une seule fois par appareil) :"],
  ['ol', [
    "Ouvrez « Passer un test » et appuyez sur « Enregistrer mon empreinte » dans la carte.",
    "Votre appareil prend la main : posez le doigt sur le capteur (ou utilisez le visage ou le code de l'appareil, selon ce qu'il propose).",
    "Le message « Empreinte enregistrée ✅ » confirme : c'est terminé.",
  ]],
  ['p', "Avant chaque test, une fois l'empreinte enregistrée :"],
  ['ol', [
    "Appuyez sur « Vérifier mon identité », puis posez le doigt sur le capteur quand l'appareil le demande.",
    "Le message « Identité vérifiée ✅ » s'affiche : vous avez une dizaine de minutes pour démarrer votre test.",
    "Sans cette vérification, le bouton « Démarrer le test » vous renverra vers la carte d'empreinte.",
  ]],
  ['ul', [
    "C'est FACULTATIF : si vous n'enregistrez pas d'empreinte, les tests fonctionnent normalement.",
    "L'enregistrement vaut pour L'APPAREIL utilisé : si vous changez de téléphone ou d'ordinateur, refaites l'enregistrement sur le nouveau.",
    "Votre appareil doit avoir un capteur ET un verrouillage configuré (empreinte, visage ou code). Sinon, la carte vous indiquera que la biométrie n'est pas disponible — ce n'est pas bloquant.",
    "Le bouton « Supprimer l'empreinte » (dans la même carte) retire l'enregistrement à tout moment ; la vérification ne sera alors plus demandée.",
  ]],
  ['note', "Pourquoi cette option ? Pour les usages « sérieux » (préparation encadrée, familles qui partagent un appareil), elle atteste que c'est bien le candidat inscrit qui compose — et pas quelqu'un d'autre sur sa session."],
  ['h3', "Comprendre vos résultats"],
  ['ul', [
    "Après chaque test : votre score, vos points forts et vos points à travailler, un plan d'amélioration concret et des conseils d'orientation (quels concours correspondent à votre profil).",
    "La correction complète est disponible question par question, avec l'explication de la bonne réponse — et le bouton « 🔊 Écouter » sur chacune.",
    "« Mes résultats » garde l'historique de toutes vos tentatives pour suivre votre progression.",
  ]],
  ['h3', "Le second parcours : le Statut général de la Fonction Publique"],
  ['p', "Depuis la rubrique, ouvrez « Statut général de la Fonction Publique » : c'est un véritable cours de préparation, fondé exclusivement sur la loi n° 2023-892 du 23 novembre 2023."],
  ['ul', [
    "LE COURS : 15 séquences couvrant les 116 articles (droits, obligations, positions, discipline, retraite…), chaque règle essentielle expliquée article par article, avec lecture audio.",
    "LE PARCOURS : 5 paliers — Débutant → Intermédiaire → Avancé → Expert → SIMULATION CONCOURS. Montez de palier dès 80 % de réussite ; la Simulation reproduit les conditions réelles (chronomètre strict, correction à la fin), visez 90 %.",
    "LES EXERCICES : 580 exercices variés — QCM, questions-pièges, vrai/faux, textes à trous, QCM à PLUSIEURS bonnes réponses (cochez puis validez), ASSOCIATIONS (reliez chaque élément à la bonne proposition), CLASSEMENTS (remettez dans l'ordre avec les flèches) et CAS PRATIQUES administratifs.",
    "Chaque correction cite L'ARTICLE DE LOI : c'est la référence à retenir pour le jour du concours.",
    "Vous pouvez réviser TOUTES les séquences ou seulement celles que vous choisissez.",
  ]],
  ['astuce', "La bonne boucle de travail : lisez le cours d'une séquence → entraînez-vous en Débutant sur cette séquence → montez de palier dès 80 % → quand toutes les séquences sont solides, passez en Simulation Concours."],
  ['note', "Selon votre formule, votre accès peut avoir une durée (par exemple 90 jours) et un nombre de tests. Ils sont affichés dans votre espace Formation ; au bout, vous pouvez renouveler — votre historique est conservé."],
] });

const FORMATION_RETRO_SECTION = (n) => ({ h: `${n}. Parrainage Formation : gagner de l'argent réel`, blocks: [
  ['p', "En plus du parrainage classique, la Formation a son propre programme : chaque abonné peut inviter d'autres candidats et recevoir de l'argent RÉEL (des « rétrocessions »), versées par Mobile Money."],
  ['h3', "Comment ça marche"],
  ['ul', [
    "Vos 3 PREMIERS filleuls qui paient leur abonnement bénéficient chacun de 10 % de réduction (ils paient par exemple 9 000 au lieu de 10 000 FCFA).",
    "Chaque filleul direct qui paie vous rapporte 10 % du tarif de sa formule — dès le 1er et même après le 3e.",
    "Il y a une limite juste : vos gains s'arrêtent quand le coût réel de VOTRE propre abonnement descend à 3 000 FCFA. Exemple : vous avez payé 10 000 → vous pouvez gagner jusqu'à 7 000 FCFA pour la période.",
    "Seuls vos filleuls DIRECTS comptent : les filleuls de vos filleuls ne vous rapportent rien (mais eux aussi peuvent parrainer à leur tour).",
  ]],
  ['h3', "Deux liens différents — envoyez le bon !"],
  ['p', "Sur la page « Parrainage & gains », vous avez DEUX liens d'invitation, clairement expliqués chacun :"],
  ['ul', [
    "🎓 Le LIEN FORMATION : à envoyer aux candidats aux concours. Il ouvre la page des tests psychotechniques ; le compte créé est proposé en rôle « Candidat Tests Psychotechniques », et c'est CE lien qui alimente vos rétrocessions Formation.",
    "🏫 Le LIEN COACHING : à envoyer aux parents et aux enseignants. Il ouvre l'inscription classique et alimente vos commissions sur les missions de coaching.",
  ]],
  ['h3', "Suivre et retirer vos gains"],
  ['ol', [
    "Ouvrez « Parrainage & gains » (menu de votre photo).",
    "La rubrique « Parrainage Formation » montre : vos gains acquis, le montant disponible, ce qui vous reste à gagner avant la limite, et une barre de progression.",
    "Partagez votre LIEN FORMATION : boutons WhatsApp, Facebook, Messenger, Telegram, SMS, e-mail — ou faites scanner son QR code (chaque lien a le sien).",
    "Pour retirer : « Demander un versement », indiquez le montant, le moyen (Wave, Orange Money, MTN MoMo, Moov Money) et le numéro qui reçoit l'argent. L'équipe EduWeb traite la demande sous 72 h ouvrées.",
  ]],
  ['attention', "Un gain n'est compté que lorsque le filleul a réellement payé ET que l'administrateur a validé son paiement. Une inscription seule, sans paiement, ne rapporte rien."],
  ['note', "Après votre plafond, continuez d'inviter : les inscriptions comptent dans vos statistiques, et vos filleuls deviennent parrains à leur tour."],
] });

const guides = [
  {
    role: 'Parent',
    file: 'Guide-Parent-EduWeb',
    subtitle: 'Trouvez, réservez et suivez le bon coach pour vos enfants',
    intro: `Bienvenue sur EduWeb — Family & Coaching. EduWeb met en relation les familles et des enseignants-coachs vérifiés, du préscolaire au lycée, en Côte d'Ivoire et au-delà. En tant que parent, vous gérez vos apprenants, recherchez un coach adapté à leurs besoins, réservez et payez en ligne, suivez les missions et échangez directement avec le coach. Ce guide vous accompagne pas à pas.`,
    sections: [
      PREMIERS_PAS,
      { h: '1. Créer votre compte et vous connecter', blocks: [
        ['p', "Un compte vous donne accès à votre espace personnel. La création est gratuite et prend deux minutes."],
        ['ol', [
          "Sur la page d'accueil, appuyez sur le bouton « Créer un compte » (en haut à droite).",
          "Choisissez le rôle « Parent ».",
          "Remplissez le formulaire : votre NOM, votre ou vos prénom(s), une adresse e-mail valide, un mot de passe (au moins 6 caractères) et votre pays.",
          "Appuyez sur « Créer mon compte ».",
          "Ouvrez votre boîte e-mail : vous avez reçu un message d'EduWeb. Appuyez sur le lien qu'il contient pour activer votre compte (à faire dans les 24 heures).",
          "Revenez sur EduWeb, appuyez sur « Connexion », puis entrez votre e-mail et votre mot de passe.",
        ]],
        ['attention', "Saisissez votre e-mail sans faute : c'est à cette adresse qu'arrive le message d'activation, et elle vous servira à vous reconnecter à chaque fois. Notez votre mot de passe en lieu sûr."],
        ['astuce', "Vous ne trouvez pas l'e-mail d'activation ? Regardez dans le dossier « Spam » (courrier indésirable). Vous pouvez en redemander un depuis la page de connexion (« Compte non activé ? Renvoyer le lien »). Mot de passe oublié ? Le lien « Mot de passe oublié ? », sous la connexion, vous en fait choisir un nouveau."],
        ['p', "Une fois connecté, votre photo (ou votre initiale) en haut à droite ouvre votre espace, vos raccourcis et la déconnexion."],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Gérer vos apprenants', blocks: [
        ['p', "Un « apprenant », c'est l'enfant que vous souhaitez faire suivre. Vous pouvez en enregistrer plusieurs."],
        ['ol', [
          "Dans votre espace, appuyez sur « Ajouter un apprenant » (rubrique « Mes apprenants »).",
          "Renseignez ses informations : sexe, âge, et sa localisation (pays, région, commune, quartier).",
          "Indiquez sa scolarité : le cycle (préscolaire, primaire ou secondaire) et le niveau (par exemple CP1, 6e, Terminale).",
          "Décrivez ses besoins : la ou les matières à renforcer, le nombre d'heures par semaine, et le mode souhaité.",
          "Enregistrez.",
        ]],
        ['ul', [
          "Présentiel : le coach se déplace (ou l'enfant va chez lui).",
          "Visio : les cours se font à distance, par appel vidéo.",
          "Hybride : un mélange des deux.",
        ]],
        ['astuce', "Rien n'est définitif : vous pouvez modifier les informations et les besoins d'un apprenant à tout moment."],
      ]},
      { h: '3. Rechercher un coach', blocks: [
        ['p', "Un « coach » est un enseignant vérifié qui accompagnera votre enfant. La recherche part des besoins que vous avez indiqués."],
        ['ol', [
          "Ouvrez la fiche de votre apprenant.",
          "Appuyez sur « Rechercher un coach ».",
          "La liste des coachs adaptés s'affiche, accompagnée d'une carte.",
        ]],
        ['ul', [
          "Par défaut, la distance n'est pas un obstacle : la visio permet d'être suivi de partout.",
          "La proximité ne compte que si vous avez demandé un besoin uniquement en présentiel.",
          "Sur la carte, votre position et celle des coachs apparaissent, avec la distance qui vous sépare.",
        ]],
      ]},
      { h: '4. Comprendre les tarifs', blocks: [
        ['p', "Chaque coach fixe lui-même son tarif à l'heure. Voici comment lire les prix :"],
        ['ul', [
          "Les montants sont en FCFA, avec l'équivalent approximatif en euros (≈ …), mis à jour automatiquement.",
          "Il existe un engagement minimum par mois : 12 h/mois au préscolaire et au primaire, 16 h/mois au secondaire.",
          "La facture d'un mois se calcule ainsi : tarif horaire du coach × nombre d'heures d'engagement.",
        ]],
        ['astuce', "Exemple : un coach à 2 500 FCFA/h, au primaire (12 h/mois), revient à 2 500 × 12 = 30 000 FCFA par mois."],
      ]},
      { h: '5. Réserver et payer', blocks: [
        ['p', "« Réserver », c'est retenir un coach pour votre enfant. Le paiement se fait par Mobile Money, comme un transfert d'argent habituel."],
        ['ol', [
          "Sur la fiche d'un coach, appuyez sur « Réserver » : une facture s'affiche, avec le montant à payer.",
          "Si vous avez un code promo (par exemple EDU10, EDU25, EDU50…), écrivez-le dans la case « Code promo » : la réduction s'applique aussitôt.",
          "Appuyez pour payer, puis réglez le montant via Mobile Money : Wave, Orange Money, MTN MoMo ou Moov Money.",
        ]],
        ['attention', "Entrez le code promo AVANT de payer : une fois le paiement fait, la réduction ne peut plus être appliquée."],
        ['note', "Un code promo donne une réduction immédiate de 10 % à 100 % selon le code. Un même code peut avoir une date limite et un nombre d'utilisations limité."],
        ['p', "Après le paiement, la mission passe « en attente » jusqu'à ce que le coach l'accepte. Vous êtes prévenu de sa réponse par SMS (sur le numéro que vous avez indiqué) et dans l'application."],
      ]},
      { h: '6. Suivre les missions et évaluer le coach', blocks: [
        ['p', "Une « mission », c'est l'accompagnement d'un coach que vous avez réservé. Vous en suivez l'avancement dans la rubrique « Missions »."],
        ['ul', [
          "Chaque réservation y affiche son statut : en attente (le coach n'a pas encore répondu), active (en cours) ou refusée.",
          "À la fin d'une mission, laissez un avis et une note au coach : cela aide les autres familles à bien choisir.",
        ]],
      ]},
      { h: '7. Échanger par messagerie', blocks: [
        ['p', "La messagerie sert à discuter par écrit, directement dans l'application (comme une messagerie de type WhatsApp, mais intégrée)."],
        ['ol', [
          "Appuyez sur l'icône en forme de bulle (en haut de l'écran) pour l'ouvrir.",
          "Vous pouvez écrire à votre coach (une fois la réservation faite) et au « Support EduWeb » (l'équipe d'assistance).",
        ]],
        ['ul', [
          "Vous pouvez joindre un fichier (photo, document) de 1 Mo maximum.",
          "Un petit badge signale les messages non lus.",
        ]],
        ['note', "Les fichiers joints sont supprimés automatiquement après 1 mois (le texte des messages, lui, est conservé). Gardez une copie d'un document important en dehors de l'application."],
      ]},
      { h: '8. Parrainage & gains', blocks: [
        ['p', "Le parrainage vous permet de gagner de l'argent en invitant d'autres personnes sur EduWeb."],
        ['ol', [
          "Dans le menu (votre photo, en haut à droite), ouvrez « Parrainage & gains ».",
          "Vous y trouvez votre lien d'invitation personnel : copiez-le, ou partagez-le en un clic par WhatsApp ou par e-mail.",
        ]],
        ['ul', [
          "Toute personne qui s'inscrit avec votre lien devient votre « filleul ».",
          "Vous gagnez 10 % de la part d'EduWeb sur chaque mission d'un filleul — qu'un parent paie un coach, ou qu'un coach accepte une mission.",
        ]],
        ['note', "La page affiche DEUX liens distincts, chacun avec son explication : le lien COACHING (celui-ci) et le lien FORMATION, réservé aux candidats aux concours (voir la section « Parrainage Formation » plus loin). Envoyez le bon lien à la bonne personne."],
      ]},
      FORMATION_TESTS_SECTION(9),
      FORMATION_RETRO_SECTION(10),
      JEUX_SECTION,
      { h: '11. Sécurité & assistance', blocks: [
        ['ul', [
          "Ne communiquez votre mot de passe à personne. Au moindre doute, changez-le (menu « Mon compte »).",
          "Aucune équipe d'EduWeb ne vous demandera jamais votre mot de passe.",
          "Besoin d'aide ? Écrivez au Support depuis la messagerie, ou utilisez les coordonnées indiquées en bas de page.",
        ]],
      ]},
    ],
  },

  {
    role: 'Coach',
    file: 'Guide-Coach-EduWeb',
    subtitle: 'Constituez votre profil, recevez des missions et suivez vos revenus',
    intro: `En tant que coach EduWeb, vous créez un profil complet, le soumettez à validation, recevez des demandes de mission, les acceptez ou les refusez, suivez vos revenus (vous percevez 80 % de chaque mission) et échangez avec les familles. Ce guide détaille chaque étape, y compris les nouveautés : tarif libre, priorité de vos disciplines, photo recadrée automatiquement et enregistrement global du profil.`,
    sections: [
      PREMIERS_PAS,
      { h: '1. Créer votre compte', blocks: [
        ['p', "La création est gratuite et prend deux minutes."],
        ['ol', [
          "Sur la page d'accueil, appuyez sur « Créer un compte », puis choisissez le rôle « Coach ».",
          "Remplissez le formulaire : NOM, prénom(s), une adresse e-mail valide, un mot de passe (au moins 6 caractères) et votre pays, puis validez.",
          "Ouvrez votre boîte e-mail et appuyez sur le lien d'activation reçu (à faire dans les 24 heures).",
          "Revenez sur EduWeb et connectez-vous avec votre e-mail et votre mot de passe.",
        ]],
        ['astuce', "Pas d'e-mail d'activation ? Regardez dans le dossier « Spam ». Mot de passe oublié ? Le lien « Mot de passe oublié ? », sous la connexion, vous en fait choisir un nouveau."],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Votre tableau de bord', blocks: [
        ['p', "Le tableau de bord est votre page d'accueil de coach : il rassemble l'essentiel en un coup d'œil."],
        ['ul', [
          "Les missions reçues, vos revenus du mois et vos revenus totaux.",
          "Le taux de complétion de votre profil : plus il est complet, plus vous avez de chances d'être choisi.",
          "Le bouton « Configurer mon profil », accessible à tout moment.",
        ]],
      ]},
      { h: '3. Configurer votre profil (6 sections)', blocks: [
        ['p', "Votre profil est votre « vitrine » : c'est ce que voient les familles. Il se remplit en 6 parties. Prenez votre temps — vous pouvez revenir le compléter plus tard."],
        ['note', "Bon à savoir : le bouton « Enregistrer » d'une partie enregistre TOUTE la page en une seule fois. Vos saisies dans les autres parties ne sont pas perdues."],
        ['h3', '1. Identité'],
        ['p', "Votre pays, votre NOM et prénom(s), votre genre et votre téléphone. Ajoutez votre photo de profil depuis la barre latérale (sur le côté)."],
        ['note', "Photo : au moment de l'envoi, votre image est automatiquement recadrée en carré, redimensionnée (512 × 512) et remise droite. Pas besoin de la préparer : un simple cliché net suffit."],
        ['h3', "2. Zone d'intervention"],
        ['p', "Indiquez où vous intervenez : région, commune, quartier, adresse. Le bouton « Déterminer ma position » récupère automatiquement vos coordonnées (autorisez la localisation si le téléphone le demande)."],
        ['h3', '3. Compétences'],
        ['p', "Cochez les niveaux que vous enseignez et vos modes d'intervention : présentiel (vous vous déplacez), visio (à distance) ou hybride (les deux)."],
        ['h3', '4. Disciplines & tarifs'],
        ['ul', [
          "Choisissez vos matières (disciplines) et fixez librement votre tarif à l'heure (en FCFA ; l'équivalent en euros s'affiche).",
          "Aucun montant minimum n'est imposé : vous vous adaptez à toutes les bourses des familles.",
          "La facture d'un mois = votre tarif horaire × l'engagement (12 h préscolaire/primaire, 16 h secondaire). Vous percevez 80 % de chaque mission.",
        ]],
        ['h3', 'Connaissances générales (utile aussi aux parents)'],
        ['p', "En plus des niveaux scolaires, une rubrique « Connaissances générales » regroupe des spécialités utiles aux élèves ET aux parents : développement personnel, méthodes & réussite, numérique (informatique, bureautique, codage & développement web, robotique, IA), langues & communication, parentalité, finances & entrepreneuriat, santé & bien-être, arts & créativité…"],
        ['p', "Cochez celles que vous proposez dans « Compétences » (sous-rubrique Connaissances générales), puis fixez leur tarif ici, comme pour toute matière. Elles deviennent recherchables par les parents (y compris pour eux-mêmes)."],
        ['h3', 'Priorité de vos disciplines'],
        ['p', "Sous la liste des disciplines, un panneau « Priorité de vos disciplines » vous permet de les classer avec les boutons monter/descendre. La discipline classée n°1 est celle qui vous représente sur la page d'accueil (rubrique « Des coachs disponibles près de chez vous »). Appuyez sur « Enregistrer la priorité ». L'ordre est conservé même si vous modifiez ensuite vos tarifs."],
        ['h3', '5. Documents'],
        ['p', "Appuyez directement sur une ligne (« Diplôme(s) », « Pièce d'identité », « CV », « Certificat / Attestation ») pour envoyer le fichier correspondant (PDF, image ou Word, 25 Mo maximum). Le statut passe alors à « Fourni ». Ces pièces servent à faire valider votre profil."],
        ['h3', '6. Présentation'],
        ['p', "Un texte de présentation est rédigé automatiquement à partir de votre profil. Vous pouvez le modifier librement, ou appuyer sur « Régénérer » pour en obtenir un nouveau."],
      ]},
      { h: '4. Soumettre votre profil à validation', blocks: [
        ['p', "Une fois votre profil rempli, envoyez-le à l'équipe EduWeb pour vérification."],
        ['ol', [
          "Appuyez sur « Soumettre à validation ».",
          "Le statut évolue tout seul : en attente → validé, ou refusé (avec un motif qui explique pourquoi).",
        ]],
        ['astuce', "Pour une validation rapide : complétez les 6 parties, ajoutez tous vos documents et renseignez votre position. Un coach validé peut ensuite être « certifié » par l'administration — un gage de confiance supplémentaire auprès des familles."],
      ]},
      { h: '5. Recevoir et gérer les missions', blocks: [
        ['p', "Une « mission » est une demande d'accompagnement envoyée par un parent."],
        ['ol', [
          "Vos demandes apparaissent dans « Missions reçues ».",
          "Pour chacune, appuyez sur « Accepter » ou « Refuser ».",
        ]],
        ['p', "Le parent est prévenu de votre décision par SMS. Une mission acceptée devient « active »."],
      ]},
      { h: '6. Vos revenus', blocks: [
        ['p', "Vous percevez 80 % du montant de chaque mission (EduWeb conserve 20 % pour faire fonctionner la plateforme). Votre tableau de bord affiche vos revenus du mois et vos revenus totaux."],
      ]},
      { h: '7. Messagerie', blocks: [
        ['p', "La messagerie vous permet d'échanger par écrit, directement dans l'application."],
        ['ul', [
          "Vous discutez avec les parents avec qui vous partagez une mission, et avec le « Support EduWeb ».",
          "Vous pouvez joindre un fichier de 1 Mo maximum.",
        ]],
        ['note', "Les fichiers joints sont supprimés automatiquement après 1 mois ; le texte des messages est conservé."],
      ]},
      { h: '8. Parrainage & gains', blocks: [
        ['p', "Comme les parents, vous avez un lien d'invitation personnel (menu « Parrainage & gains »)."],
        ['p', "Il vous rapporte 10 % de la part d'EduWeb sur chaque mission d'un filleul (un parent qui paie un coach, ou un coach qui accepte une mission). Partagez-le en un clic par WhatsApp ou par e-mail."],
        ['note', "La page affiche DEUX liens distincts, chacun avec son explication : le lien COACHING (missions) et le lien FORMATION, réservé aux candidats aux concours (voir la section « Parrainage Formation » plus loin)."],
      ]},
      FORMATION_TESTS_SECTION(9),
      FORMATION_RETRO_SECTION(10),
    ],
  },

  {
    role: 'Commercial',
    file: 'Guide-Commercial-EduWeb',
    subtitle: 'Faites connaître EduWeb et soyez rémunéré sur vos recrutements',
    intro: `Le Commercial fait connaître EduWeb et motive des parents et des coachs à rejoindre la plateforme. Votre espace vous permet de suivre vos filleuls, les missions abouties et vos gains : vous touchez 10 % de la part d'EduWeb sur chaque mission générée par vos filleuls.`,
    sections: [
      PREMIERS_PAS,
      { h: '1. Créer votre compte', blocks: [
        ['p', "La création est gratuite et prend deux minutes."],
        ['ol', [
          "Sur la page d'accueil, appuyez sur « Créer un compte », puis choisissez le rôle « Commercial ».",
          "Remplissez le formulaire (NOM, prénom(s), e-mail valide, mot de passe d'au moins 6 caractères, pays) et validez.",
          "Ouvrez votre boîte e-mail et appuyez sur le lien d'activation reçu (à faire dans les 24 heures).",
          "Revenez sur EduWeb et connectez-vous avec votre e-mail et votre mot de passe.",
        ]],
        ['astuce', "Pas d'e-mail d'activation ? Regardez dans le dossier « Spam ». Mot de passe oublié ? Utilisez le lien « Mot de passe oublié ? » sous la connexion."],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Votre tableau de bord', blocks: [
        ['p', "Votre espace vous montre, en un coup d'œil, ce que votre parrainage a produit. Il comporte trois rubriques :"],
        ['ul', [
          "Filleuls inscrits : les parents et coachs que vous avez motivés à s'inscrire.",
          "Missions abouties : les actions de vos filleuls qui vous rapportent une commission.",
          "Gains : votre commission par mission et votre total (avec l'équivalent en euros).",
        ]],
      ]},
      { h: '3. Vos deux liens d\'invitation', blocks: [
        ['p', "C'est votre outil principal : des liens personnels qui vous relient à ceux que vous inscrivez. Votre page « Parrainage & gains » en affiche DEUX, bien distincts et expliqués :"],
        ['ul', [
          "🏫 Le LIEN COACHING : pour recruter des parents et des coachs — il alimente vos commissions sur les missions.",
          "🎓 Le LIEN FORMATION : pour recruter des candidats aux concours (rôle « Candidat Tests Psychotechniques » proposé à l'inscription) — il alimente vos rétrocessions Formation.",
          "Chaque lien a ses propres boutons de partage (WhatsApp, Facebook, Telegram, SMS, e-mail) et son propre QR code.",
        ]],
        ['attention', "Envoyez le bon lien à la bonne personne : un candidat inscrit via le lien coaching reste votre filleul, mais il n'arrivera pas directement sur la page des tests."],
      ]},
      { h: '4. Comment vous êtes rémunéré', blocks: [
        ['p', "Vous touchez 10 % de la part d'EduWeb (soit 2 % du montant de la mission) dans deux cas :"],
        ['ul', [
          "un filleul parent paie un coach, ou",
          "un filleul coach accepte une mission.",
        ]],
        ['note', "Une commission n'est comptée qu'une seule fois par mission et par type d'événement (protection contre les doublons)."],
      ]},
      { h: '5. Messagerie & assistance', blocks: [
        ['p', "Une question ? Depuis la messagerie (icône en forme de bulle, en haut de l'écran), écrivez au « Support EduWeb » : l'équipe vous répond."],
      ]},
      { h: '6. Bonnes pratiques', blocks: [
        ['ul', [
          "Parlez-en autour de vous, en priorité aux parents et aux enseignants.",
          "Mettez en avant les points forts : coachs vérifiés, paiement Mobile Money sécurisé, suivi des missions, prix affichés aussi en euros.",
          "Partagez votre lien largement, et aidez vos filleuls à s'inscrire (montrez-leur ce guide !).",
        ]],
      ]},
      { h: '7. Vendre la Formation — Tests psychotechniques', blocks: [
        ['p', "La section « Formation » est un excellent argument de recrutement : plus de 570 exercices corrigés pour préparer les concours (instituteurs adjoints, personnel de santé, concours administratifs), avec un bilan personnalisé après chaque test."],
        ['ul', [
          "Votre cible : les candidats aux concours — élèves en fin de collège/lycée, aides-soignants, jeunes diplômés, agents en reconversion.",
          "L'accès est payant (formules affichées sur la page Formation) ou accordé gratuitement par l'administrateur au cas par cas.",
          "Le candidat paie par Mobile Money au numéro EduWeb puis déclare son versement — l'administrateur vérifie et active l'accès.",
          "Toute personne inscrite avec VOTRE lien devient votre filleul : si elle s'abonne à la Formation, le programme de rétrocessions s'applique (voir section suivante).",
        ]],
        ['astuce', "Demandez à l'administrateur un CODE PROMO à votre nom (par exemple −10 %) : il vous fournira un « lien promo » qui applique la réduction automatiquement — un argument de vente très concret à partager par WhatsApp."],
      ]},
      FORMATION_RETRO_SECTION(8),
    ],
  },

  {
    role: 'Candidat',
    file: 'Guide-Candidat-EduWeb',
    subtitle: 'Préparez vos concours avec les tests psychotechniques',
    intro: `Le rôle « Candidat Tests Psychotechniques » est fait pour vous si vous préparez un concours : instituteurs adjoints, personnel de santé, concours administratifs. Votre espace est entièrement tourné vers la préparation : accès à la banque de tests, théorie et astuces avec lecture audio, deux modes d'entraînement, diagnostic personnalisé après chaque test — et un programme de parrainage qui peut financer une grande partie de votre abonnement.`,
    sections: [
      PREMIERS_PAS,
      { h: '1. Créer votre compte Candidat', blocks: [
        ['p', "La création est gratuite et prend deux minutes."],
        ['ol', [
          "Sur la page d'accueil (ou sur la page Formation), appuyez sur « Créer un compte », puis choisissez le rôle « Candidat Tests Psychotechniques ».",
          "Remplissez le formulaire : NOM, prénom(s), une adresse e-mail valide, un mot de passe (au moins 6 caractères) et votre pays, puis validez.",
          "Ouvrez votre boîte e-mail et appuyez sur le lien d'activation reçu (à faire dans les 24 heures).",
          "Revenez sur EduWeb et connectez-vous : vous arrivez sur votre espace Candidat.",
        ]],
        ['astuce', "Si quelqu'un vous a envoyé un lien d'invitation « Formation », utilisez-le pour créer votre compte : le bon rôle est déjà choisi, et vous pourrez bénéficier d'une réduction de bienvenue si une place promotionnelle est disponible chez votre parrain."],
        ['p', "Votre espace Candidat présente VOS DEUX ÉPREUVES côte à côte, chacune avec son résumé : Tests psychotechniques (tests passés, catégories travaillées, meilleur score en conditions de concours) et Statut général de la Fonction Publique (maîtrise des articles, XP, articles à réviser). Chaque épreuve a son bouton « Ouvrir le module » — c'est LÀ que se trouve la progression détaillée (par catégorie, ou carte des 116 articles). Votre statut d'accès et vos derniers tests sont affichés sur l'espace."],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      FORMATION_TESTS_SECTION(2),
      FORMATION_RETRO_SECTION(3),
      { h: '4. Messagerie & assistance', blocks: [
        ['p', "Une question ? Depuis la messagerie (icône en forme de bulle, en haut de l'écran), écrivez au « Support EduWeb » : l'équipe vous répond directement dans l'application."],
      ]},
      { h: '5. Sécurité', blocks: [
        ['ul', [
          "Ne communiquez votre mot de passe à personne — aucune équipe d'EduWeb ne vous le demandera jamais.",
          "Mot de passe oublié ? Le lien « Mot de passe oublié ? », sous la connexion, vous en fait choisir un nouveau par e-mail.",
          "L'empreinte digitale (facultative) protège vos épreuves : voir la section « Se préparer aux concours ».",
        ]],
      ]},
    ],
  },

  {
    role: 'Admin',
    file: 'Guide-Admin-EduWeb',
    subtitle: 'Pilotez la plateforme selon vos permissions',
    intro: `L'administrateur pilote la plateforme selon les permissions accordées par le super-administrateur : Gestion des utilisateurs, Validation des coachs, Finances & statistiques et/ou Formation & tests psychotechniques. Ce guide décrit les tâches courantes : gestion des coachs et des utilisateurs, vérification des paiements de la Formation, codes promo, rétrocessions de parrainage et pilotage financier.`,
    sections: [
      PREMIERS_PAS,
      { h: '1. Connexion et tableau de bord', blocks: [
        ['p', "Une fois connecté, votre tableau de bord donne une vue d'ensemble de la plateforme."],
        ['ul', [
          "Il présente des statistiques en temps réel et des cartes cliquables.",
          "Quatre permissions existent : Gestion des utilisateurs, Validation des coachs, Finances & statistiques, et Formation & tests psychotechniques. Vous ne voyez que les espaces correspondant aux permissions qui vous ont été accordées.",
        ]],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Gestion des utilisateurs', blocks: [
        ['p', "Permission requise : « Gestion des utilisateurs »."],
        ['ul', [
          "La liste se filtre par rôle (parents, coachs, admins) et se recherche par nom ou e-mail.",
          "Pour chaque personne, vous pouvez : créer un compte (activé aussitôt), changer son rôle, la suspendre ou la réactiver, ou la supprimer (avec ses données liées).",
        ]],
        ['h3', 'Actions par lot (plusieurs à la fois)'],
        ['p', "Cochez plusieurs comptes (ou « tout sélectionner »), puis choisissez l'action groupée : Réactiver, Suspendre ou Supprimer. Vous ne pouvez pas agir sur votre propre compte."],
        ['astuce', "Pour préparer un compte « tout prêt » à remettre à quelqu'un, utilisez « Créer un utilisateur » : vous pouvez générer un mot de passe et afficher les identifiants à copier (ou les envoyer par e-mail)."],
      ]},
      { h: '3. Coachs : rechercher, consulter, modifier', blocks: [
        ['p', "Permission requise : « Validation des coachs ». Le bouton « Coachs » du tableau de bord ouvre la recherche."],
        ['ul', [
          "Recherchez un coach par nom ou e-mail ; chaque résultat indique son statut et sa certification.",
          "Consulter : ouvre sa fiche d'examen (identité, zone, compétences, disciplines, documents).",
          "Modifier : ouvre son profil complet en mode administrateur — vous pouvez mettre à jour ses 6 parties, sa photo et la priorité de ses disciplines, en son nom.",
        ]],
        ['h3', 'Valider ou refuser'],
        ['ul', [
          "Depuis la fiche d'examen : « Valider » le profil, ou « Refuser » avec un motif (au moins 10 caractères).",
          "Vous pouvez aussi « Certifier » un coach, ou lui retirer sa certification.",
        ]],
        ['h3', 'Refus groupé (au même motif)'],
        ['p', "Sur le tableau de bord, dans la liste « Coachs en attente de validation », cochez plusieurs coachs (ou « tout sélectionner »). Une barre apparaît : saisissez un motif commun (au moins 10 caractères) et appuyez sur « Refuser la sélection ». Tous les coachs cochés sont refusés d'un coup, avec le même motif — pratique quand la raison est identique (par exemple un dossier incomplet)."],
        ['note', "Les tarifs et prétentions des coachs ne sont visibles que par l'administration."],
      ]},
      { h: '4. Finances & commissions', blocks: [
        ['p', "Permission requise : « Finances & statistiques »."],
        ['ul', [
          "La page « Commissions » récapitule les commissions à payer, regroupées par parrain.",
          "Vous pouvez marquer une commission « payée », ou régler d'un coup toutes celles d'un parrain — avant d'effectuer le versement réel par Mobile Money.",
        ]],
      ]},
      { h: '5. Messagerie', blocks: [
        ['p', "L'administrateur peut échanger avec tous les utilisateurs. De leur côté, les utilisateurs écrivent au « Support », et leurs messages vous parviennent."],
      ]},
      { h: '6. Votre compte', blocks: [
        ['p', "Depuis « Mon compte », vous pouvez modifier votre mot de passe. Conservez vos identifiants en lieu sûr et ne les partagez avec personne."],
      ]},
      { h: '7. Formation : formules, paiements et accès', blocks: [
        ['p', "Permission requise : « Formation & tests psychotechniques ». L'écran « Inscriptions Formation » (menu de votre photo) est votre poste de pilotage."],
        ['h3', "Créer les formules (les tarifs)"],
        ['ol', [
          "Dans « Formules d'accès (tarifs) », remplissez : le nom (ex. « Pack Concours »), le prix en FCFA, la durée en jours (vide = illimitée), le quota de tests (vide = illimité) et l'ordre d'affichage (1 = en premier dans les listes).",
          "« Enregistrer la formule ». Elle apparaît aussitôt sur la page publique Formation.",
          "« Désactiver » retire une formule de la vente sans toucher aux accès déjà validés.",
        ]],
        ['note', "Tant qu'aucune formule active n'existe, les candidats ne peuvent demander qu'une autorisation gratuite."],
        ['h3', "Vérifier un paiement déclaré"],
        ['ol', [
          "Chaque demande « 💳 Paiement déclaré » affiche : la formule, le MONTANT ATTENDU (après réduction éventuelle), l'opérateur et la référence de transaction saisie par le candidat.",
          "Ouvrez votre relevé Mobile Money et vérifiez que ce montant est bien arrivé avec cette référence.",
          "Argent reçu → « Paiement reçu, activer » : l'accès s'ouvre (avec sa durée), le candidat est prévenu par e-mail — et si un parrain est concerné, sa rétrocession est créditée automatiquement.",
          "Rien reçu ou référence fausse → « Refuser » avec un motif : le candidat peut corriger et re-déclarer.",
        ]],
        ['attention', "Ne validez JAMAIS sans avoir vu l'argent sur le relevé : la validation crédite définitivement l'accès et, le cas échéant, la rétrocession du parrain."],
        ['h3', "Autoriser gratuitement / révoquer"],
        ['ul', [
          "« Autoriser un utilisateur » : saisissez son e-mail et une durée éventuelle — accès immédiat sans paiement (partenariats, boursiers…).",
          "Un accès validé ne se retire pas par « Refuser » : utilisez « Rembourser » dans Finance & parrainage (la rétrocession du parrain est alors contre-passée proprement).",
        ]],
      ]},
      { h: '8. Codes promo & liens promo', blocks: [
        ['p', "Permission requise : « Finances & statistiques ». L'écran « Codes promo » crée des réductions et leurs liens partageables."],
        ['ol', [
          "Créez un code : nom (ex. CONCOURS2026), réduction en %, nombre d'utilisations maximum et date d'expiration (facultatifs).",
          "Chaque code a son LIEN PROMO (ex. family.eduweb.ci/formation?promo=CONCOURS2026) : la page Formation affiche la réduction et pré-remplit le code pour le candidat. Boutons « Copier » et « WhatsApp » intégrés.",
          "Le compteur d'utilisations se met à jour automatiquement ; « Désactiver » stoppe un code à tout moment.",
        ]],
        ['note', "Code promo et réduction parrainage ne se cumulent pas : la plus avantageuse s'applique automatiquement."],
      ]},
      { h: '9. Finance & parrainage : rétrocessions, versements, antifraude', blocks: [
        ['p', "Permission requise : « Finances & statistiques ». L'écran « Finance & parrainage » pilote l'économie de la Formation."],
        ['h3', "Les indicateurs"],
        ['ul', [
          "RAR (Revenu Après Réductions et Rétrocessions) : l'indicateur central. Le feu 🟢/🟠/🔴 compare le RAR moyen par abonné à la cible (8 500 FCFA par défaut).",
          "Aussi : CA facial, encaissements, réductions accordées, rétrocessions dues et versées, engagements restants, coût d'acquisition, coefficient de viralité K.",
          "Des graphiques d'évolution se remplissent jour après jour ; exports CSV et impression disponibles.",
        ]],
        ['h3', "Verser les rétrocessions"],
        ['ol', [
          "« Versements à traiter » liste les demandes des parrains : montant, moyen (Wave, Orange…), numéro bénéficiaire.",
          "Envoyez l'argent par Mobile Money, PUIS saisissez la référence du transfert et « Versé ✓ ».",
          "Problème ? « Échec ✗ » avec un motif : le montant est automatiquement recrédité au parrain.",
        ]],
        ['h3', "Antifraude et remboursements"],
        ['ul', [
          "« Signaux antifraude » : le système détecte les situations suspectes (même référence déclarée deux fois, même numéro de versement sur plusieurs comptes, rythme anormal…). C'est VOUS qui décidez : RAS, Suspect, ou Bloquer (les gains et versements du compte sont alors suspendus).",
          "« Rembourser » un abonnement : l'accès est révoqué et la rétrocession du parrain contre-passée — l'historique comptable reste intact (aucune écriture n'est jamais effacée).",
          "Le simulateur de rentabilité vous permet de tester des scénarios (1 000 à 100 000 abonnés) avant de changer les tarifs.",
        ]],
      ]},
      { h: '10. Éditions : librairie en ligne, commandes et loterie', blocks: [
        ['p', "Permission requise : « Éditions : librairie, commandes & loterie des ouvrages ». L'écran « Librairie des ouvrages » (menu de votre photo) gère le catalogue public /ouvrages et ses commandes."],
        ['h3', "Composer le catalogue (nombre de livres illimité)"],
        ['ol', [
          "« Ajouter un livre » : titre, niveau, sous-titre, DESCRIPTION (visible dans la librairie), PRIX en FCFA et couverture (JPG, PNG ou WebP, 3 Mo maximum — optimisée automatiquement).",
          "Le PRIX déclenche la vente : avec un prix, le bouton « Commander » apparaît sur /ouvrages ; sans prix, le livre reste en vitrine (« bientôt disponible »).",
          "L'ordre d'affichage classe le catalogue ; l'accueil du site présente les 6 premiers livres actifs, la librairie les montre tous.",
          "« Masquer » retire un livre de la vente sans le supprimer ; « Supprimer » l'efface — ses commandes déjà passées sont conservées.",
        ]],
        ['h3', "Traiter les commandes"],
        ['ol', [
          "Chaque commande affiche : l'ouvrage, la quantité, le MONTANT TOTAL, le nom et le téléphone de l'acheteur, le lieu de livraison et le mode de paiement.",
          "Paiement « 📱 mobile money » : l'acheteur déclare l'opérateur et la référence de son versement — vérifiez le relevé Mobile Money AVANT de confirmer, comme pour la Formation.",
          "Paiement « 💵 à la livraison » : appelez l'acheteur au numéro indiqué pour convenir de la remise ; il règle à la réception.",
          "Le suivi se fait en un clic : « Confirmer » (commande vérifiée, en préparation) → « Livrée ». « Annuler » reste possible avant la livraison, et une commande annulée peut être rouverte.",
          "« Export CSV » télécharge toutes les commandes (tableur) pour la logistique ou la comptabilité.",
        ]],
        ['note', "Les acheteurs n'ont pas besoin de compte EduWeb pour commander : le téléphone saisi est votre canal de contact. Rappelez-leur d'enregistrer le code de loterie de leur livre !"],
        ['h3', "La loterie des ouvrages"],
        ['ul', [
          "L'écran « Loterie (admin) » gère les séries de codes imprimés dans les livres, les périodes de tirage, le nombre de lauréats et les notifications (e-mail, SMS, WhatsApp).",
          "Générez une nouvelle série de codes pour chaque futur ouvrage ; exportez-la en CSV pour l'imprimeur.",
          "Les tirages peuvent être lancés manuellement ou automatiquement à l'échéance ; les lauréats apparaissent avec leur statut de notification.",
        ]],
      ]},
    ],
  },

  {
    role: 'Super-Admin',
    file: 'Guide-Super-Admin-EduWeb',
    subtitle: 'Gouvernance de la plateforme : administrateurs et paramètres',
    intro: `Le super-administrateur dispose de tous les pouvoirs d'un administrateur, sans restriction de permission, et de deux fonctions exclusives : la gestion des administrateurs et les paramètres de la plateforme. Il est aussi le destinataire du Support.`,
    sections: [
      PREMIERS_PAS,
      { h: '1. Vos pouvoirs', blocks: [
        ['p', "En tant que super-administrateur, vous avez tous les droits. En clair :"],
        ['ul', [
          "Vous accédez à TOUTES les fonctions d'administration, sans restriction de permission (voir le Guide Admin) : utilisateurs, coachs, finances, Formation (formules, paiements, codes promo, rétrocessions).",
          "Vous pouvez notamment rechercher n'importe quel coach (bouton « Coachs ») et consulter ou modifier son profil complet en son nom.",
          "Vous validez les coachs, y compris le refus groupé (cochez plusieurs coachs en attente, saisissez un motif commun, « Refuser la sélection »).",
          "En plus, deux fonctions vous sont réservées : la gestion des administrateurs et les paramètres de la plateforme (détaillées ci-dessous).",
        ]],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Gérer les administrateurs', blocks: [
        ['p', "Un « administrateur » est une personne à qui vous confiez une partie de la gestion. Depuis « Administrateurs » :"],
        ['ul', [
          "Nommez un administrateur à partir d'une adresse e-mail déjà inscrite, en lui donnant des permissions précises (Utilisateurs, Coachs, Finances).",
          "Modifiez ses permissions à tout moment, ou révoquez-le (il redevient alors un simple parent).",
        ]],
        ['note', "Vous ne pouvez pas vous révoquer vous-même, et un super-administrateur ne peut pas être révoqué. Par prudence, n'accordez que les permissions réellement nécessaires."],
      ]},
      { h: '3. Paramètres de la plateforme', blocks: [
        ['p', "Depuis « Paramètres », vous réglez le fonctionnement de la plateforme."],
        ['ul', [
          "Pièces jointes de la messagerie : choisissez le délai de conservation (de 1 à 365 jours ; 30 par défaut) et l'heure de la purge (en UTC).",
          "Le bouton « Lancer la purge maintenant » exécute le nettoyage immédiatement ; la date de la dernière purge est affichée.",
        ]],
        ['h3', "Modèle économique du coaching (missions)"],
        ['p', "Les deux taux du programme coaching historique — jusqu'ici fixes — se règlent désormais ici :"],
        ['ul', [
          "Part reversée au coach (%) : 80 % par défaut (la plateforme conserve le reste). Bornée entre 50 et 95.",
          "Commission de parrainage coaching (%) : la part de la commission des parrains (parents, coachs, commerciaux) sur les missions de leurs filleuls, en % de la part plateforme — 10 % par défaut (soit 2 % de la mission avec une part coach à 80 %).",
        ]],
        ['attention', "Un changement de taux ne vaut que pour les MISSIONS FUTURES : les commissions déjà enregistrées ne sont jamais recalculées. Ne confondez pas avec le modèle de la Formation (réductions/rétrocessions des abonnements), qui se règle dans « Finance & parrainage »."],
        ['p', "C'est aussi ici que se trouve le « Diagnostic e-mail », pour tester l'envoi des e-mails et voir l'expéditeur réellement utilisé."],
        ['note', "En production, la purge se déclenche aussi automatiquement chaque jour (tâche planifiée Vercel Cron)."],
      ]},
      { h: '4. Support', blocks: [
        ['p', "Le super-administrateur est le « Support » de la plateforme : c'est vous qui recevez les messages que les utilisateurs adressent au support depuis leur messagerie."],
      ]},
      { h: '5. Politique commerciale de la Formation (parrainage)', blocks: [
        ['p', "Le moteur d'abonnement de la Formation (réductions filleuls, rétrocessions, plancher) obéit à une « politique commerciale » que vous pilotez depuis « Finance & parrainage »."],
        ['ul', [
          "Paramètres : tarif facial de référence, % de réduction des premiers filleuls, % de rétrocession du parrain, nombre de places promotionnelles, plancher du coût net (3 000 FCFA par défaut), versement minimum, plafonds de versement, cible du RAR moyen.",
          "Chaque enregistrement crée une NOUVELLE VERSION : les transactions passées ne sont jamais recalculées — c'est la garantie d'un historique financier fiable.",
          "La permission « Formation & tests psychotechniques » s'attribue comme les autres, depuis « Administrateurs » : elle donne accès à la gestion des formules et à la validation des paiements.",
        ]],
        ['attention', "Changer les taux ou le plancher modifie l'économie du programme pour les NOUVEAUX abonnements uniquement. Utilisez le simulateur (en bas de « Finance & parrainage ») pour mesurer l'effet d'un changement avant de l'appliquer."],
      ]},
      { h: '6. Bonnes pratiques', blocks: [
        ['ul', [
          "Protégez tout particulièrement le compte super-administrateur : mot de passe solide, jamais partagé.",
          "Surveillez régulièrement les commissions à payer, les coachs en attente de validation, les paiements Formation déclarés et les demandes de versement des parrains.",
          "Gardez un œil sur le feu du RAR moyen (🟢/🟠/🔴) et sur les signaux antifraude : les seuils sont configurables dans la politique commerciale.",
          "N'attribuez les rôles d'administration qu'avec parcimonie, et à des personnes de confiance.",
        ]],
      ]},
    ],
  },
];

const INK = '#2A2A2A', MUTED = '#8A8A8A', RULE = '#E2E6E3';
const GLIGHT = '#EEF8F1';
const CALLOUTS = {
  note: { label: 'À noter', bg: '#EEF8F1', bar: '#1E9E57', fg: '#214634' },
  astuce: { label: 'Astuce', bg: '#EAF3FB', bar: '#2A77C6', fg: '#1B3A57' },
  attention: { label: 'Attention', bg: '#FDF3E6', bar: '#C9871C', fg: '#5A3D12' },
};

function numberedSections(g) {
  return g.sections.map((s, i) => ({ n: i + 1, title: String(s.h).replace(/^\s*\d+\.\s*/, ''), blocks: s.blocks }));
}

/* ─────────────── RENDU WORD (.docx) ─────────────── */
function buildDocx(g) {
  const secs = numberedSections(g);
  const numConfig = [{
    reference: 'bullets',
    levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 540, hanging: 260 } } } }],
  }];
  let olTotal = 0;
  secs.forEach((s) => s.blocks.forEach((b) => {
    if (b[0] === 'ol') {
      numConfig.push({ reference: 'num' + olTotal, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.',
        alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } }] });
      olTotal++;
    }
  }));

  const C = [];
  // ----- Couverture -----
  C.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1400, after: 0 },
    children: [new TextRun({ text: 'EduWeb', bold: true, size: 64, color: GREEN })] }));
  C.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 700 },
    children: [new TextRun({ text: 'FAMILY & COACHING', size: 18, color: GREEN2, characterSpacing: 30 })] }));
  C.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 },
    children: [new TextRun({ text: "GUIDE DE L'UTILISATEUR", size: 22, color: GREEN2, characterSpacing: 40 })] }));
  C.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 200 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: GREEN },
    children: [new TextRun({ text: '  ' + g.role + '  ', bold: true, size: 44, color: 'FFFFFF' })] }));
  C.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
    children: [new TextRun({ text: g.subtitle, italics: true, size: 24, color: '666666' })] }));
  C.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 0 },
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: GREEN2, space: 8 } },
    children: [new TextRun({ text: 'Document de formation', size: 18, color: '999999' })] }));
  C.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 },
    children: [new TextRun({ text: 'family.eduweb.ci · Version du ' + DATE, size: 16, color: '999999' })] }));
  C.push(new Paragraph({ children: [new PageBreak()] }));

  // ----- Sommaire -----
  C.push(new Paragraph({ spacing: { after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GREEN2, space: 6 } },
    children: [new TextRun({ text: 'Sommaire', bold: true, size: 36, color: GREEN })] }));
  C.push(new TableOfContents('Sommaire', { hyperlink: true, headingStyleRange: '1-1' }));
  C.push(new Paragraph({ children: [new PageBreak()] }));

  // ----- À propos / intro -----
  C.push(new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'À PROPOS DE CE GUIDE', bold: true, size: 18, color: GREEN2, characterSpacing: 20 })] }));
  C.push(new Paragraph({ spacing: { after: 260 },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: GREEN2, space: 14 } },
    children: [new TextRun({ text: g.intro, size: 22 })] }));

  // ----- Chapitres -----
  let olIdx = 0;
  secs.forEach((sec) => {
    C.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(sec.n + '.  ' + sec.title)] }));
    sec.blocks.forEach((b) => {
      const [type, val] = b;
      if (type === 'p') {
        C.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: val, size: 22 })] }));
      } else if (type === 'h3') {
        C.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(val)] }));
      } else if (type === 'ul') {
        val.forEach((it) => C.push(new Paragraph({ numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 40 }, children: [new TextRun({ text: it, size: 22 })] })));
      } else if (type === 'ol') {
        const ref = 'num' + olIdx; olIdx++;
        val.forEach((it) => C.push(new Paragraph({ numbering: { reference: ref, level: 0 },
          spacing: { after: 40 }, children: [new TextRun({ text: it, size: 22 })] })));
      } else if (type === 'note' || type === 'astuce' || type === 'attention') {
        const c = ({ note: { l: 'À noter', bar: GREEN2, bg: 'E8F5EC', fg: '1A3A28' },
          astuce: { l: 'Astuce', bar: '2A77C6', bg: 'EAF3FB', fg: '1B3A57' },
          attention: { l: 'Attention', bar: 'C9871C', bg: 'FDF3E6', fg: '5A3D12' } })[type];
        C.push(new Paragraph({
          spacing: { before: 80, after: 140 }, shading: { type: ShadingType.CLEAR, color: 'auto', fill: c.bg },
          border: {
            top: { style: BorderStyle.SINGLE, size: 2, color: c.bg, space: 6 },
            bottom: { style: BorderStyle.SINGLE, size: 2, color: c.bg, space: 6 },
            left: { style: BorderStyle.SINGLE, size: 18, color: c.bar, space: 10 },
            right: { style: BorderStyle.SINGLE, size: 2, color: c.bg, space: 6 },
          },
          children: [new TextRun({ text: c.l + ' — ', bold: true, size: 21, color: c.bar }), new TextRun({ text: val, size: 21, color: c.fg })],
        }));
      }
    });
  });

  const footer = new Footer({ children: [new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: 9026 }],
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 6 } },
    children: [
      new TextRun({ text: 'EduWeb — Guide ' + g.role, size: 16, color: '999999' }),
      new TextRun({ text: '\tPage ', size: 16, color: '999999' }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '999999' }),
      new TextRun({ text: ' / ', size: 16, color: '999999' }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '999999' }),
    ],
  })] });

  const doc = new Document({
    features: { updateFields: true },
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 30, bold: true, font: 'Arial', color: GREEN },
          paragraph: { spacing: { before: 340, after: 160 }, outlineLevel: 0,
            border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: GREEN2, space: 4 } } } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 24, bold: true, font: 'Arial', color: GREEN2 },
          paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 1 } },
      ],
    },
    numbering: { config: numConfig },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      footers: { default: footer },
      children: C,
    }],
  });
  return Packer.toBuffer(doc);
}

/* ─────────────── RENDU PDF (.pdf) ─────────────── */
function buildPdf(g) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margins: { top: 52, bottom: 44, left: 62, right: 62 }, bufferPages: true });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.registerFont('AR', ARIAL);
    doc.registerFont('ARB', ARIALB);
    try { doc.registerFont('ARI', ARIALI); } catch (e) { doc.registerFont('ARI', ARIAL); }

    const G = '#' + GREEN, G2 = '#' + GREEN2;
    const W = doc.page.width, H = doc.page.height;
    const ML = doc.page.margins.left, MT = doc.page.margins.top;
    const CW = W - ML - doc.page.margins.right;
    const cBottom = () => H - doc.page.margins.bottom;
    const ensure = (h) => { if (doc.y + h > cBottom()) doc.addPage(); };

    function para(text, opt) {
      opt = opt || {};
      doc.font(opt.font || 'AR').fontSize(opt.size || 10).fillColor(opt.color || INK);
      const lg = opt.lineGap == null ? 2 : opt.lineGap;
      const h = doc.heightOfString(text, { width: CW, lineGap: lg });
      ensure(h + 2);
      doc.text(text, ML, doc.y, { width: CW, align: 'left', lineGap: lg });
      doc.moveDown(opt.after == null ? 0.28 : opt.after);
      doc.x = ML;
    }
    function h3(text) {
      ensure(24); doc.moveDown(0.12);
      const y0 = doc.y;
      doc.save(); doc.rect(ML, y0 + 1.5, 3, 12).fill(G2); doc.restore();
      doc.font('ARB').fontSize(11).fillColor(G).text(text, ML + 10, y0, { width: CW - 10 });
      doc.moveDown(0.22); doc.x = ML;
    }
    function bullets(items) {
      items.forEach((it) => {
        doc.font('AR').fontSize(10).fillColor(INK);
        const tw = CW - 16; const th = doc.heightOfString(it, { width: tw, lineGap: 2 });
        ensure(th + 4); const y0 = doc.y;
        doc.save(); doc.rect(ML + 2, y0 + 4.5, 4, 4).fill(G2); doc.restore();
        doc.font('AR').fontSize(10).fillColor(INK).text(it, ML + 16, y0, { width: tw, lineGap: 2 });
        doc.y = Math.max(doc.y, y0 + th); doc.moveDown(0.2); doc.x = ML;
      });
      doc.moveDown(0.08);
    }
    function steps(items) {
      items.forEach((it, i) => {
        const d = 17;
        doc.font('AR').fontSize(10).fillColor(INK);
        const tw = CW - d - 12; const th = doc.heightOfString(it, { width: tw, lineGap: 2 });
        const rowH = Math.max(d, th); ensure(rowH + 6); const y0 = doc.y;
        doc.save(); doc.circle(ML + d / 2, y0 + d / 2, d / 2).fill(G2);
        doc.fillColor('#FFFFFF').font('ARB').fontSize(9.5).text(String(i + 1), ML, y0 + (d - 9.5) / 2 - 0.5, { width: d, align: 'center' });
        doc.restore();
        doc.font('AR').fontSize(10).fillColor(INK).text(it, ML + d + 12, y0, { width: tw, lineGap: 2 });
        doc.y = y0 + rowH + 5; doc.x = ML;
      });
      doc.moveDown(0.08);
    }
    function callout(kind, text) {
      const c = CALLOUTS[kind] || CALLOUTS.note;
      const pad = 11, barW = 4; const innerW = CW - 2 * pad - barW;
      doc.font('ARB').fontSize(9.7); const labelH = doc.heightOfString(c.label, { width: innerW });
      doc.font('AR').fontSize(9.7); const bodyH = doc.heightOfString(text, { width: innerW, lineGap: 2 });
      const boxH = pad + labelH + 3 + bodyH + pad;
      ensure(boxH + 7); const y0 = doc.y;
      doc.save(); doc.roundedRect(ML, y0, CW, boxH, 7).fill(c.bg); doc.rect(ML, y0, barW, boxH).fill(c.bar); doc.restore();
      doc.fillColor(c.bar).font('ARB').fontSize(9.7).text(c.label, ML + pad + barW + 4, y0 + pad, { width: innerW });
      doc.fillColor(c.fg).font('AR').fontSize(9.7).text(text, ML + pad + barW + 4, y0 + pad + labelH + 3, { width: innerW, lineGap: 2 });
      doc.y = y0 + boxH + 7; doc.x = ML;
    }
    function renderBlocks(blocks) {
      blocks.forEach((b) => {
        const [type, val] = b;
        if (type === 'p') para(val);
        else if (type === 'h3') h3(val);
        else if (type === 'ul') bullets(val);
        else if (type === 'ol') steps(val);
        else if (type === 'note' || type === 'astuce' || type === 'attention') callout(type, val);
      });
    }

    const toc = [];
    function chapter(n, title) {
      ensure(40); doc.moveDown(0.1);
      const y0 = doc.y; const bs = 22;
      doc.save(); doc.roundedRect(ML, y0, bs, bs, 5).fill(G);
      doc.fillColor('#FFFFFF').font('ARB').fontSize(12).text(String(n), ML, y0 + (bs - 12) / 2 - 1, { width: bs, align: 'center' });
      doc.restore();
      const tx = ML + bs + 12, tw = CW - bs - 12;
      doc.font('ARB').fontSize(13.5).fillColor(G);
      const th = doc.heightOfString(title, { width: tw });
      const ty = y0 + Math.max(0, (bs - th) / 2);
      doc.text(title, tx, ty, { width: tw });
      const lineY = Math.max(y0 + bs, ty + th) + 5;
      doc.save(); doc.moveTo(ML, lineY).lineTo(ML + CW, lineY).lineWidth(1.2).strokeColor(G2).stroke(); doc.restore();
      doc.y = lineY + 4; doc.x = ML;
    }

    // ----- Couverture -----
    (function cover() {
      const bandH = 150;
      doc.save();
      doc.rect(0, 0, W, bandH).fill(G); doc.rect(0, bandH, W, 5).fill(G2);
      doc.fillColor('#FFFFFF').font('ARB').fontSize(32).text('EduWeb', 0, 50, { width: W, align: 'center' });
      doc.fillColor('#CDEBD8').font('AR').fontSize(9).text('F A M I L Y   &   C O A C H I N G', 0, 94, { width: W, align: 'center', characterSpacing: 2 });
      doc.restore();
      let y = bandH + 84;
      doc.fillColor(G2).font('ARB').fontSize(10).text("GUIDE DE L'UTILISATEUR", 0, y, { width: W, align: 'center', characterSpacing: 2.5 });
      y += 42;
      doc.font('ARB').fontSize(26);
      const roleW = doc.widthOfString(g.role) + 60, pillH = 46, pillX = (W - roleW) / 2;
      doc.save(); doc.roundedRect(pillX, y, roleW, pillH, 23).fill(G);
      doc.fillColor('#FFFFFF').font('ARB').fontSize(26).text(g.role, pillX, y + (pillH - 26) / 2 - 1, { width: roleW, align: 'center' });
      doc.restore();
      y += pillH + 30;
      doc.fillColor('#555555').font('ARI').fontSize(13).text(g.subtitle, ML, y, { width: CW, align: 'center' });
      y = doc.y + 22;
      const dW = 100;
      doc.save(); doc.moveTo((W - dW) / 2, y).lineTo((W + dW) / 2, y).lineWidth(2).strokeColor(G2).stroke(); doc.restore();
      const by = H - 96;
      doc.fillColor('#222222').font('ARB').fontSize(11).text('family.eduweb.ci', 0, by, { width: W, align: 'center' });
      doc.fillColor(MUTED).font('AR').fontSize(9).text('Document de formation — Version du ' + DATE, 0, by + 18, { width: W, align: 'center' });
      doc.save(); doc.rect(0, H - 10, W, 10).fill(G); doc.restore();
    })();

    doc.addPage(); const tocPageIndex = doc.bufferedPageRange().count - 1;
    doc.addPage();

    // ----- À propos (lead) -----
    doc.font('ARB').fontSize(8.5).fillColor(G2).text('À PROPOS DE CE GUIDE', ML, doc.y, { characterSpacing: 1.2 });
    doc.moveDown(0.3);
    { const y0 = doc.y, tw = CW - 14;
      doc.font('AR').fontSize(11).fillColor(INK);
      const th = doc.heightOfString(g.intro, { width: tw, lineGap: 2.5 });
      ensure(th + 4);
      const yy = doc.y;
      doc.save(); doc.rect(ML, yy, 3.5, th).fill(G2); doc.restore();
      doc.fillColor(INK).font('AR').fontSize(11).text(g.intro, ML + 14, yy, { width: tw, lineGap: 2.5 });
      doc.y = yy + th; doc.moveDown(0.5); doc.x = ML; void y0; }

    // ----- Chapitres -----
    numberedSections(g).forEach((sec) => {
      ensure(60);
      toc.push({ label: sec.n + '. ' + sec.title, page: doc.bufferedPageRange().count });
      chapter(sec.n, sec.title);
      renderBlocks(sec.blocks);
    });

    // ----- Sommaire -----
    doc.switchToPage(tocPageIndex);
    let ty = MT;
    doc.font('ARB').fontSize(20).fillColor(G).text('Sommaire', ML, ty);
    ty = doc.y + 6;
    doc.save(); doc.moveTo(ML, ty).lineTo(ML + CW, ty).lineWidth(1).strokeColor(G2).stroke(); doc.restore();
    ty += 18;
    const pageColW = 34;
    toc.forEach((e) => {
      doc.font('AR').fontSize(11).fillColor(INK);
      const titleW = CW - pageColW - 10;
      doc.text(e.label, ML, ty, { width: titleW, lineBreak: false, ellipsis: true });
      const tw = Math.min(doc.widthOfString(e.label), titleW);
      const dotsStart = ML + tw + 6, dotsEnd = ML + CW - pageColW - 4;
      if (dotsEnd > dotsStart) {
        doc.save(); doc.dash(1, { space: 2.5 }).moveTo(dotsStart, ty + 9).lineTo(dotsEnd, ty + 9).lineWidth(0.6).strokeColor('#CCCCCC').stroke(); doc.undash(); doc.restore();
      }
      doc.font('AR').fontSize(11).fillColor(INK).text(String(e.page), ML + CW - pageColW, ty, { width: pageColW, align: 'right', lineBreak: false });
      ty += 23;
    });

    // ----- En-têtes / pieds de page -----
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      if (i === 0) continue;
      doc.page.margins.top = 0; doc.page.margins.bottom = 0;
      doc.font('AR').fontSize(8).fillColor('#AEB4B0');
      doc.text('Guide ' + g.role, ML, 32, { width: CW / 2, align: 'left', lineBreak: false });
      doc.text('EduWeb · Family & Coaching', ML + CW / 2, 32, { width: CW / 2, align: 'right', lineBreak: false });
      doc.save(); doc.moveTo(ML, 46).lineTo(ML + CW, 46).lineWidth(0.5).strokeColor(RULE).stroke(); doc.restore();
      const fy = H - 40;
      doc.save(); doc.moveTo(ML, fy).lineTo(ML + CW, fy).lineWidth(0.5).strokeColor(RULE).stroke(); doc.restore();
      doc.font('AR').fontSize(8).fillColor(MUTED);
      doc.text('EduWeb — Guide ' + g.role, ML, fy + 6, { width: CW / 2, align: 'left', lineBreak: false });
      doc.text('Page ' + (i + 1) + ' / ' + range.count, ML + CW / 2, fy + 6, { width: CW / 2, align: 'right', lineBreak: false });
    }

    doc.end();
  });
}

(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  for (const g of guides) {
    const docxBuf = await buildDocx(g);
    fs.writeFileSync(path.join(OUT, g.file + '.docx'), docxBuf);
    const pdfBuf = await buildPdf(g);
    fs.writeFileSync(path.join(OUT, g.file + '.pdf'), pdfBuf);
    console.log('OK', g.file, '(.docx ' + docxBuf.length + ' o, .pdf ' + pdfBuf.length + ' o)');
  }
  console.log('Terminé :', guides.length, 'guides ×2 formats — version du', DATE);
})().catch((e) => { console.error('ERREUR:', e); process.exit(1); });
