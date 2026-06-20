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
  ['h3', 'Android (Chrome)'],
  ['ol', [
    'Ouvrez family.eduweb.ci dans Chrome.',
    "Touchez la bannière « Installer l'application » si elle apparaît ; sinon, ouvrez le menu ⋮ (en haut à droite).",
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
    "Cliquez sur l'icône d'installation (un écran avec une flèche, ou ⊕) à droite de la barre d'adresse.",
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

const guides = [
  {
    role: 'Parent',
    file: 'Guide-Parent-EduWeb',
    subtitle: 'Trouvez, réservez et suivez le bon coach pour vos enfants',
    intro: `Bienvenue sur EduWeb — Family & Coaching. EduWeb met en relation les familles et des enseignants-coachs vérifiés, du préscolaire au lycée, en Côte d'Ivoire et au-delà. En tant que parent, vous gérez vos apprenants, recherchez un coach adapté à leurs besoins, réservez et payez en ligne, suivez les missions et échangez directement avec le coach. Ce guide vous accompagne pas à pas.`,
    sections: [
      { h: '1. Créer votre compte et vous connecter', blocks: [
        ['ol', [
          'Cliquez sur « Créer un compte » en haut à droite, puis choisissez le rôle « Parent ».',
          'Renseignez votre NOM, vos prénom(s), un email valide, un mot de passe (6 caractères minimum) et votre pays.',
          'Ouvrez l\'email d\'activation et cliquez sur le lien pour activer votre compte (valable 24 heures).',
          'Connectez-vous via « Connexion ». Votre photo (ou initiale) en haut à droite donne accès à votre espace, vos raccourcis et la déconnexion.',
        ]],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Gérer vos apprenants', blocks: [
        ['p', 'Depuis votre espace Parent, ajoutez chaque enfant à suivre :'],
        ['ul', [
          'Informations : sexe, âge, localisation (pays, région, commune, quartier).',
          'Scolarité : cycle (préscolaire, primaire, secondaire) et niveau.',
          'Besoins : disciplines à renforcer, nombre d\'heures par semaine et mode (présentiel, visio ou hybride).',
        ]],
        ['p', 'Vous pouvez modifier les besoins d\'un apprenant à tout moment.'],
      ]},
      { h: '3. Rechercher un coach', blocks: [
        ['p', 'Depuis la fiche d\'un apprenant, cliquez sur « Rechercher un coach ». La recherche porte sur le ou les besoins renseignés.'],
        ['ul', [
          'La position reste libre par défaut (la visio étant possible).',
          'Elle ne devient un critère de proximité que si le besoin est demandé exclusivement en présentiel.',
          'Sur la carte, votre position et celle des coachs s\'affichent, avec la distance.',
        ]],
      ]},
      { h: '4. Comprendre les tarifs', blocks: [
        ['ul', [
          'Montants en FCFA avec l\'équivalent en euros (≈ …), taux mis à jour automatiquement.',
          'Engagement mensuel minimal : 12 h/mois (préscolaire et primaire), 16 h/mois (secondaire).',
          'Facture mensuelle = tarif horaire du coach × engagement.',
        ]],
      ]},
      { h: '5. Réserver et payer', blocks: [
        ['ol', [
          'Sur la fiche d\'un coach, cliquez sur « Réserver » : une facture est générée.',
          'Si vous disposez d\'un code promo, saisissez-le dans le champ « Code promo » (ex. EDU10, EDU25, EDU50…) : la remise s\'applique aussitôt au montant à payer.',
          'Réglez le montant (remisé le cas échéant) via Mobile Money : Wave, Orange Money, MTN MoMo ou Moov Money.',
        ]],
        ['note', 'Code promo : il donne une réduction immédiate de 10 % à 100 % selon le code. Un même code peut avoir une durée de validité et un nombre d\'utilisations limités. Saisissez-le AVANT de payer pour que la remise soit prise en compte.'],
        ['p', 'La mission est créée au statut « en attente » jusqu\'à l\'acceptation du coach. Vous êtes notifié de sa réponse par SMS (sur votre numéro renseigné) et dans l\'application.'],
      ]},
      { h: '6. Suivre les missions et évaluer le coach', blocks: [
        ['ul', [
          'La rubrique Missions affiche le statut de chaque réservation (en attente, active, refusée).',
          'À l\'issue d\'une mission, laissez un avis et une note au coach.',
        ]],
      ]},
      { h: '7. Échanger par messagerie', blocks: [
        ['ul', [
          'L\'icône de message (en-tête) ouvre la messagerie : écrivez à votre coach (après réservation) et au Support EduWeb.',
          'Pièces jointes : 1 Mo maximum par fichier. Un badge signale les messages non lus.',
        ]],
        ['note', 'Les pièces jointes sont automatiquement supprimées après 1 mois (le texte des messages est conservé). Enregistrez hors de la plateforme un document important.'],
      ]},
      { h: '8. Parrainage & gains', blocks: [
        ['p', 'Depuis « Parrainage & gains » (menu), vous disposez d\'un lien d\'invitation unique.'],
        ['ul', [
          'Toute personne inscrite via votre lien devient votre filleul.',
          'Vous gagnez 10 % de la part EduWeb sur chaque mission d\'un filleul (parent qui paie un coach, ou coach qui accepte une mission).',
          'Partage en un clic par WhatsApp ou email.',
        ]],
      ]},
      JEUX_SECTION,
      { h: '9. Sécurité & assistance', blocks: [
        ['ul', [
          'Ne partagez jamais vos identifiants ; modifiez votre mot de passe en cas de doute.',
          'Pour toute aide, contactez le Support depuis la messagerie ou via les coordonnées ci-dessous.',
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
      { h: '1. Créer votre compte', blocks: [
        ['ol', [
          'Cliquez sur « Créer un compte » et choisissez le rôle « Coach ».',
          'Activez votre compte via le lien reçu par email, puis connectez-vous.',
        ]],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Votre tableau de bord', blocks: [
        ['ul', [
          'Vue d\'ensemble : missions reçues, revenus du mois et totaux, taux de complétion du profil.',
          'Le bouton « Configurer mon profil » reste accessible à tout moment.',
        ]],
      ]},
      { h: '3. Configurer votre profil (6 sections)', blocks: [
        ['note', "Le bouton « Enregistrer » d'une section enregistre l'ensemble de la page : toutes vos modifications sont sauvegardées en une fois."],
        ['h3', '1. Identité'],
        ['p', 'Pays, NOM et prénom(s), genre, téléphone. Ajoutez votre photo de profil depuis la barre latérale.'],
        ['note', 'Photo de profil : au dépôt, votre image est automatiquement recadrée au format carré et redimensionnée (512 × 512), orientation corrigée. Inutile de la préparer : un simple cliché convient.'],
        ['h3', '2. Zone d\'intervention'],
        ['p', 'Région, commune, quartier, adresse, et coordonnées GPS via « Déterminer ma position ».'],
        ['h3', '3. Compétences'],
        ['p', 'Sélectionnez les niveaux enseignés et vos modes d\'intervention (présentiel, visio, hybride).'],
        ['h3', '4. Disciplines & tarifs'],
        ['ul', [
          'Choisissez vos disciplines et fixez librement votre tarif horaire (en FCFA, équivalent € affiché).',
          'Aucun montant minimum n\'est imposé, afin de vous adapter à toutes les bourses des familles.',
          'Facture mensuelle = tarif horaire × engagement (12 h préscolaire/primaire, 16 h secondaire). Vous percevez 80 %.',
        ]],
        ['h3', 'Connaissances générales (valable aussi pour les parents)'],
        ['p', "En plus des cycles scolaires, un niveau transversal « Connaissances générales » regroupe, par rubrique, des spécialités utiles aux élèves ET aux parents : développement personnel, méthodes & réussite, numérique (initiation informatique, bureautique, codage & développement web, robotique, IA), langues & communication, parentalité, finances & entrepreneuriat, santé & bien-être, arts & créativité…"],
        ['p', "Cochez les spécialités que vous proposez dans la section « Compétences » (sous-rubrique Connaissances générales), puis fixez leur tarif ici, comme pour toute discipline. Elles deviennent recherchables par les parents (y compris pour eux-mêmes)."],
        ['h3', 'Priorité de vos disciplines (nouveauté)'],
        ['p', "Sous la liste des disciplines, un panneau « Priorité de vos disciplines » vous permet de les classer avec les boutons monter/descendre. La discipline classée n°1 est celle affichée comme votre spécialité sur la page d'accueil (rubrique « Des coachs disponibles près de chez vous »). Cliquez « Enregistrer la priorité ». L'ordre est conservé même si vous modifiez ensuite vos tarifs."],
        ['h3', '5. Documents'],
        ['p', 'Cliquez directement sur une ligne (« Diplôme(s) », « Pièce d\'identité », « CV », « Certificat / Attestation ») pour importer le fichier correspondant (PDF, image ou Word — 25 Mo max). Le statut passe à « Fourni ». Ces pièces permettent la validation de votre profil.'],
        ['h3', '6. Présentation'],
        ['p', 'Un texte est généré automatiquement à partir de votre profil. Modifiez-le librement ou cliquez « Régénérer ».'],
      ]},
      { h: '4. Soumettre votre profil à validation', blocks: [
        ['ul', [
          'Cliquez sur « Soumettre à validation ».',
          'Le statut évolue : en attente → validé ou refusé (avec un motif). Un coach validé peut ensuite être « certifié » par l\'administration.',
          'Conseil : complétez les 6 sections, ajoutez tous les documents et renseignez votre position GPS pour une validation rapide.',
        ]],
      ]},
      { h: '5. Recevoir et gérer les missions', blocks: [
        ['ul', [
          'Vos demandes apparaissent dans « Missions reçues ». Cliquez « Accepter » ou « Refuser ».',
          'Le parent est notifié de votre décision par SMS. Une mission acceptée devient « active ».',
        ]],
      ]},
      { h: '6. Vos revenus', blocks: [
        ['p', 'Vous percevez 80 % du montant de chaque mission (la plateforme conserve 20 %). Le tableau de bord affiche vos revenus du mois et vos revenus totaux.'],
      ]},
      { h: '7. Messagerie', blocks: [
        ['ul', [
          'Échangez avec les parents avec qui vous partagez une mission, et avec le Support EduWeb.',
          'Pièces jointes : 1 Mo maximum par fichier.',
        ]],
        ['note', 'Les pièces jointes de la messagerie sont supprimées automatiquement après 1 mois ; le texte des messages est conservé.'],
      ]},
      { h: '8. Parrainage & gains', blocks: [
        ['p', 'Votre lien d\'invitation vous rapporte 10 % de la part EduWeb sur chaque mission d\'un filleul (parent qui paie un coach, ou coach qui accepte une mission).'],
      ]},
    ],
  },

  {
    role: 'Commercial',
    file: 'Guide-Commercial-EduWeb',
    subtitle: 'Faites connaître EduWeb et soyez rémunéré sur vos recrutements',
    intro: `Le Commercial fait connaître EduWeb et motive des parents et des coachs à rejoindre la plateforme. Votre espace vous permet de suivre vos filleuls, les missions abouties et vos gains : vous touchez 10 % de la part d'EduWeb sur chaque mission générée par vos filleuls.`,
    sections: [
      { h: '1. Créer votre compte', blocks: [
        ['ol', [
          'Cliquez sur « Créer un compte » et choisissez le rôle « Commercial ».',
          'Activez votre compte via l\'email reçu, puis connectez-vous.',
        ]],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Votre tableau de bord', blocks: [
        ['p', 'Votre espace présente trois rubriques :'],
        ['ul', [
          'Filleuls inscrits : les parents et coachs que vous avez motivés à s\'inscrire.',
          'Missions abouties : les actions qualifiantes réalisées par vos filleuls.',
          'Gains : votre commission par mission et votre total (avec l\'équivalent en euros).',
        ]],
      ]},
      { h: '3. Votre lien d\'invitation', blocks: [
        ['ul', [
          'Vous disposez d\'un lien d\'invitation unique : toute personne inscrite via ce lien devient votre filleul.',
          'Partagez-le en un clic par WhatsApp ou email, ou copiez-le.',
        ]],
      ]},
      { h: '4. Comment vous êtes rémunéré', blocks: [
        ['p', 'Vous touchez 10 % de la part d\'EduWeb (soit 2 % du montant de la mission) lorsque :'],
        ['ul', [
          'un filleul parent paie un coach, ou',
          'un filleul coach accepte une mission.',
        ]],
        ['note', 'Une commission est comptée une seule fois par mission et par type d\'événement (protection anti-doublon).'],
      ]},
      { h: '5. Messagerie & assistance', blocks: [
        ['p', 'Depuis la messagerie, contactez le Support EduWeb pour toute question.'],
      ]},
      { h: '6. Bonnes pratiques', blocks: [
        ['ul', [
          'Ciblez les parents et les enseignants autour de vous.',
          'Mettez en avant : coachs vérifiés, paiement Mobile Money sécurisé, suivi des missions, équivalent en euros.',
          'Partagez votre lien largement et accompagnez vos filleuls lors de leur inscription.',
        ]],
      ]},
    ],
  },

  {
    role: 'Admin',
    file: 'Guide-Admin-EduWeb',
    subtitle: 'Pilotez la plateforme selon vos permissions',
    intro: `L'administrateur pilote la plateforme selon les permissions accordées par le super-administrateur : Gestion des utilisateurs, Validation des coachs et/ou Finances. Ce guide décrit les tâches courantes, dont la recherche et la modification du profil d'un coach.`,
    sections: [
      { h: '1. Connexion et tableau de bord', blocks: [
        ['ul', [
          'Le tableau de bord présente des statistiques en temps réel et des cartes interactives.',
          'Trois permissions possibles : Gestion des utilisateurs, Validation des coachs, Finances & statistiques. Vous ne voyez que les espaces correspondant à vos permissions.',
        ]],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Gestion des utilisateurs', blocks: [
        ['p', 'Permission requise : « Gestion des utilisateurs ».'],
        ['ul', [
          'Liste filtrable (parents, coachs, admins) avec recherche par nom ou email.',
          'Créer un utilisateur (activé immédiatement), changer son rôle, le suspendre/réactiver, ou le supprimer (avec ses données liées).',
        ]],
        ['h3', 'Actions par lot'],
        ['p', 'Cochez plusieurs comptes (ou « tout sélectionner »), puis appliquez une action groupée : Réactiver, Suspendre ou Supprimer. Vous ne pouvez pas agir sur votre propre compte.'],
      ]},
      { h: '3. Coachs : rechercher, consulter, modifier', blocks: [
        ['p', 'Permission requise : « Validation des coachs ». Le bouton « Coachs » du tableau de bord ouvre la recherche.'],
        ['ul', [
          'Recherchez un coach par nom ou email ; chaque résultat indique son statut et sa certification.',
          'Consulter : ouvre la fiche d\'examen (identité, zone, compétences, disciplines, documents).',
          'Modifier : ouvre le profil complet du coach en mode administrateur — vous pouvez mettre à jour ses 6 sections (identité, zone, compétences, disciplines & tarifs, documents, présentation), sa photo et la priorité de ses disciplines, au nom du coach.',
        ]],
        ['h3', 'Validation'],
        ['ul', [
          'Depuis la fiche d\'examen : Valider le profil, ou Refuser avec un motif (au moins 10 caractères).',
          'Certifier (ou retirer la certification d\') un coach.',
        ]],
        ['h3', 'Refus groupé (au même motif)'],
        ['p', 'Sur le tableau de bord, dans la liste « Coachs en attente de validation », cochez plusieurs coachs (ou « tout sélectionner »). Une barre apparaît : saisissez un motif commun (au moins 10 caractères) et cliquez « Refuser la sélection » pour refuser tous les coachs cochés en une seule action, avec le même motif. Pratique lorsque plusieurs candidatures sont refusées pour la même raison (ex. dossier incomplet).'],
        ['note', 'Les tarifs et prétentions des coachs ne sont visibles que par l\'administration.'],
      ]},
      { h: '4. Finances & commissions', blocks: [
        ['p', 'Permission requise : « Finances & statistiques ».'],
        ['ul', [
          'La page Commissions présente le récapitulatif des commissions à payer, regroupées par parrain.',
          'Marquez une commission « payée », ou réglez en une fois toutes celles d\'un parrain, avant le versement réel via Mobile Money.',
        ]],
      ]},
      { h: '5. Messagerie', blocks: [
        ['p', 'L\'administrateur peut échanger avec tous les utilisateurs. Les utilisateurs écrivent au « Support ».'],
      ]},
      { h: '6. Votre compte', blocks: [
        ['p', 'Depuis « Mon compte », modifiez votre mot de passe. Conservez vos identifiants en lieu sûr.'],
      ]},
    ],
  },

  {
    role: 'Super-Admin',
    file: 'Guide-Super-Admin-EduWeb',
    subtitle: 'Gouvernance de la plateforme : administrateurs et paramètres',
    intro: `Le super-administrateur dispose de tous les pouvoirs d'un administrateur, sans restriction de permission, et de deux fonctions exclusives : la gestion des administrateurs et les paramètres de la plateforme. Il est aussi le destinataire du Support.`,
    sections: [
      { h: '1. Vos pouvoirs', blocks: [
        ['ul', [
          'Vous accédez à toutes les fonctions d\'administration sans restriction (voir le Guide Admin) : utilisateurs, coachs, finances.',
          'Vous pouvez en particulier rechercher n\'importe quel coach (bouton « Coachs ») et consulter ou modifier son profil complet en mode administrateur.',
          'Validation des coachs, y compris le refus groupé (cochez plusieurs coachs en attente, saisissez un motif commun, « Refuser la sélection »).',
          'Vous disposez en plus de la gestion des administrateurs et des paramètres de la plateforme.',
        ]],
      ]},
      LANG_SECTION,
      HELP_SECTION,
      INSTALL_SECTION,
      { h: '2. Gérer les administrateurs', blocks: [
        ['p', 'Depuis « Administrateurs » :'],
        ['ul', [
          'Nommez un administrateur à partir d\'un email existant, avec des permissions précises (Utilisateurs, Coachs, Finances).',
          'Modifiez les permissions d\'un administrateur, ou révoquez-le (il redevient parent).',
        ]],
        ['note', 'Vous ne pouvez pas vous révoquer vous-même, et un super-administrateur ne peut pas être révoqué. N\'accordez que les permissions nécessaires.'],
      ]},
      { h: '3. Paramètres de la plateforme', blocks: [
        ['p', 'Depuis « Paramètres » :'],
        ['ul', [
          'Pièces jointes de la messagerie : réglez le délai de conservation (1 à 365 jours ; 30 par défaut) et l\'heure de purge (UTC).',
          'Utilisez « Lancer la purge maintenant » pour exécuter immédiatement le nettoyage ; la date de dernière purge est indiquée.',
        ]],
        ['note', 'En production, la purge est déclenchée chaque jour par une tâche planifiée (Vercel Cron).'],
      ]},
      { h: '4. Support', blocks: [
        ['p', 'Le super-administrateur est le destinataire « Support » de la messagerie : il reçoit les messages que les utilisateurs adressent au support.'],
      ]},
      { h: '5. Bonnes pratiques', blocks: [
        ['ul', [
          'Sécurisez tout particulièrement le compte super-administrateur.',
          'Surveillez régulièrement les commissions à payer et les profils coachs en attente de validation.',
          'Attribuez les rôles d\'administration avec parcimonie.',
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
