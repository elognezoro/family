# EduWeb Concours — Maîtrise du Statut général de la Fonction Publique de Côte d’Ivoire

> **Base juridique exclusive du cours :** Loi n° 2023-892 du 23 novembre 2023 portant Statut général de la Fonction Publique, fichier source fourni. Le moteur doit afficher la référence d’article après chaque correction.

## 1. Finalité pédagogique

Formation intensive, progressive et adaptative destinée à transformer le texte juridique en connaissances mobilisables rapidement en concours. Objectif de maîtrise : **≥ 90 % sur trois examens blancs consécutifs**, avec un temps moyen ≤ 45 s par item standard et aucune faiblesse persistante sur une séquence.

### Compétences terminales
- Repérer la règle juridique exacte et son article.
- Distinguer les notions proches et les pièges de formulation.
- Mémoriser nombres, durées, autorités, listes et exceptions.
- Résoudre des mini-cas administratifs.
- Répondre sous contrainte de temps.
- Justifier une réponse par la règle du statut.

## 2. Architecture fonctionnelle attendue pour Claude Code

- Application web/PWA mobile-first.
- Profil apprenant + progression par séquence.
- Mode **Apprendre**, **S'entraîner**, **Défi**, **Examen blanc**, **Révision des erreurs**, **Flashcards**, **Jeux**.
- Chronomètre global et/ou par question, configurable.
- Correction immédiate en formatif ; correction différée en sommatif.
- Algorithme adaptatif : les articles mal maîtrisés réapparaissent plus souvent.
- Historique : score, temps, taux de confiance, articles fragiles, erreurs récurrentes.
- Favoris et carnet personnel de pièges.
- Recherche par article, mot-clé, titre, chapitre.
- Mode hors-ligne pour les contenus déjà chargés.

## 3. Audio et accessibilité

Chaque bloc narratif, consigne, option de réponse et feedback doit exposer un bouton `🔊 Écouter`. Prévoir Web Speech API en priorité, avec abstraction `TTSProvider` pour permettre ultérieurement un service cloud. Fonctions : lecture/pause/reprise/arrêt, vitesse 0,75× à 1,5×, surlignage de la phrase lue, lecture automatique optionnelle du feedback, désactivation mémorisée. Les évaluations doivent pouvoir lire la consigne sans révéler la réponse.

## 4. Méthode d'apprentissage EduWeb : C.L.A.I.R.

**C — Comprendre** la règle ; **L — Localiser** l'article ; **A — Associer** règle + exemple ; **I — Interroger** par exercices ; **R — Réactiver** par répétition espacée.

### Trucs et astuces transversaux
- **A-B-C-D = du plus conceptuel au plus exécutif** : A conçoit, B applique, C/D exécutent.
- **ADDS** pour les 4 positions : **A**ctivité, **D**étachement, **D**isponibilité, **S**ous les drapeaux.
- **30–6–36–60** : congé annuel 30 jours ; maladie courte 6 mois ; longue durée jusqu'à 36 mois ; congé exceptionnel maladie/accident professionnel jusqu'à 60 mois.
- **25/30 puis 50/3/6** : 1er degré, réduction max 25 % / 30 jours ; 2nd degré, réduction 50 % / 3 mois, exclusion max 6 mois.
- **2 + 1** : contrat de certains agents A ≤ 2 ans, renouvelable 1 fois ; maintien exceptionnel après limite d'âge ≤ 2 ans, renouvelable 1 fois.
- Transformer chaque nombre en flashcard recto-verso et chaque liste en exercice de classement.

## 5. Séquençage pédagogique

### Séquence 0 — Diagnostic et stratégie concours
**Articles : 1 à 6**  
**Objectif :** Comprendre le texte, sa logique et construire une méthode de mémorisation.

**Cours narratif — essentiels à maîtriser**

- **Art. 1** — Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.

- **Art. 2** — Les personnes soumises au statut ont la qualité de fonctionnaire.

- **Art. 3** — Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.

- **Art. 4** — Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.

- **Art. 5** — Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.

- **Art. 6** — Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 1 — Fonctionnaire, familles d'emplois et catégories
**Articles : 7 à 14**  
**Objectif :** Distinguer catégorie, grade, emploi, classe et échelon.

**Cours narratif — essentiels à maîtriser**

- **Art. 7** — Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.

- **Art. 8** — Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.

- **Art. 9** — À chaque catégorie sont rattachés des grades.

- **Art. 10** — Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.

- **Art. 11** — L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.

- **Art. 12** — Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.

- **Art. 13** — Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.

- **Art. 14** — Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 2 — Mobilité et agents contractuels
**Articles : 15 à 20**  
**Objectif :** Maîtriser mobilité, emplois supérieurs et régime des contractuels.

**Cours narratif — essentiels à maîtriser**

- **Art. 15** — Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.

- **Art. 16** — L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.

- **Art. 17** — Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.

- **Art. 18** — Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.

- **Art. 19** — En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.

- **Art. 20** — La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 3 — Droits fondamentaux
**Articles : 21 à 31**  
**Objectif :** Identifier liberté d'opinion, droits syndicaux, protection et conditions de travail.

**Cours narratif — essentiels à maîtriser**

- **Art. 21** — La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.

- **Art. 22** — Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.

- **Art. 23** — Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.

- **Art. 24** — Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.

- **Art. 25** — Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.

- **Art. 26** — Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.

- **Art. 27** — Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.

- **Art. 28** — La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.

- **Art. 29** — Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.

- **Art. 30** — L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.

- **Art. 31** — Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 4 — Obligations et déontologie
**Articles : 32 à 38**  
**Objectif :** Maîtriser loyauté, intégrité, conflits d'intérêts, secret, réserve et responsabilité.

**Cours narratif — essentiels à maîtriser**

- **Art. 32** — Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.

- **Art. 33** — Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.

- **Art. 34** — Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.

- **Art. 35** — Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.

- **Art. 36** — Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.

- **Art. 37** — Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.

- **Art. 38** — Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 5 — Organismes consultatifs
**Articles : 39 à 45**  
**Objectif :** Associer chaque organisme à ses compétences.

**Cours narratif — essentiels à maîtriser**

- **Art. 39** — Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.

- **Art. 40** — Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.

- **Art. 41** — La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.

- **Art. 42** — La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.

- **Art. 43** — Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.

- **Art. 44** — Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.

- **Art. 45** — Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 6 — Recrutement et titularisation
**Articles : 46 à 52**  
**Objectif :** Connaître recrutement, conditions d'accès, stage et titularisation.

**Cours narratif — essentiels à maîtriser**

- **Art. 46** — Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.

- **Art. 47** — Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.

- **Art. 48** — Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.

- **Art. 49** — Les modalités de chaque concours sont fixées par voie réglementaire.

- **Art. 50** — Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.

- **Art. 51** — La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.

- **Art. 52** — Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 7 — Positions administratives
**Articles : 53 à 67**  
**Objectif :** Distinguer activité, détachement, disponibilité et sous les drapeaux.

**Cours narratif — essentiels à maîtriser**

- **Art. 53** — Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.

- **Art. 54** — Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.

- **Art. 55** — Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.

- **Art. 56** — Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.

- **Art. 57** — Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.

- **Art. 58** — L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.

- **Art. 59** — Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.

- **Art. 60** — Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.

- **Art. 61** — Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.

- **Art. 62** — En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.

- **Art. 63** — Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).

- **Art. 64** — En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.

- **Art. 65** — Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.

- **Art. 66** — Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.

- **Art. 67** — Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 8 — Évaluation et avancement
**Articles : 68 à 73**  
**Objectif :** Comprendre évaluation permanente et mécanismes d'avancement.

**Cours narratif — essentiels à maîtriser**

- **Art. 68** — Le fonctionnaire est soumis à un système d'évaluation permanent.

- **Art. 69** — Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.

- **Art. 70** — Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.

- **Art. 71** — Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.

- **Art. 72** — Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.

- **Art. 73** — Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 9 — Formation, promotion et distinctions
**Articles : 74 à 80**  
**Objectif :** Relier formation continue, promotion et mérite.

**Cours narratif — essentiels à maîtriser**

- **Art. 74** — Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.

- **Art. 75** — La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.

- **Art. 76** — La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.

- **Art. 77** — Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.

- **Art. 78** — Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.

- **Art. 79** — L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.

- **Art. 80** — Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 10 — Rémunération
**Articles : 81 à 88**  
**Objectif :** Identifier les composantes de rémunération et les règles de retenue.

**Cours narratif — essentiels à maîtriser**

- **Art. 81** — Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.

- **Art. 82** — Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.

- **Art. 83** — Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.

- **Art. 84** — L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.

- **Art. 85** — L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.

- **Art. 86** — Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.

- **Art. 87** — Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.

- **Art. 88** — Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 11 — Congés et avantages sociaux
**Articles : 89 à 98**  
**Objectif :** Maîtriser durées, rémunération et régimes des congés.

**Cours narratif — essentiels à maîtriser**

- **Art. 89** — Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.

- **Art. 90** — Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.

- **Art. 91** — Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.

- **Art. 92** — Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.

- **Art. 93** — Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.

- **Art. 94** — La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.

- **Art. 95** — Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.

- **Art. 96** — Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.

- **Art. 97** — Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.

- **Art. 98** — Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 12 — Discipline
**Articles : 99 à 104**  
**Objectif :** Distinguer faute, sanctions, autorités, suspension et faute grave.

**Cours narratif — essentiels à maîtriser**

- **Art. 99** — Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.

- **Art. 100** — Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.

- **Art. 101** — Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.

- **Art. 102** — En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.

- **Art. 103** — Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.

- **Art. 104** — La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 13 — Cessation définitive et retraite
**Articles : 105 à 114**  
**Objectif :** Maîtriser les modes de cessation, retraite et pension.

**Cours narratif — essentiels à maîtriser**

- **Art. 105** — Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.

- **Art. 106** — Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.

- **Art. 107** — Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.

- **Art. 108** — Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.

- **Art. 109** — Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.

- **Art. 110** — Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.

- **Art. 111** — Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.

- **Art. 112** — Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.

- **Art. 113** — À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.

- **Art. 114** — Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

### Séquence 14 — Dispositions finales et révision générale
**Articles : 115 à 116**  
**Objectif :** Consolider l'ensemble du statut et préparer l'épreuve chronométrée.

**Cours narratif — essentiels à maîtriser**

- **Art. 115** — La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.

- **Art. 116** — La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.

**Activité guidée** : l'apprenant reformule chaque règle sans regarder le texte, puis associe la règle à son numéro d'article. Le système compare les mots-clés attendus et propose une reprise ciblée.

**Évaluation formative de fin de séquence** : 10 items tirés de la banque, 8 minutes, feedback immédiat, seuil conseillé 80 %. En dessous de 80 %, déclencher une micro-révision puis un nouveau tirage.

## 6. Typologie des exercices interactifs

1. QCM à réponse unique ; 2. QCM à réponses multiples ; 3. Vrai/Faux ; 4. Texte à trous ; 5. Flashcard article↔règle ; 6. Appariement ; 7. Classement/ordre ; 8. Glisser-déposer ; 9. Mini-cas ; 10. Repérage de l'intrus ; 11. Duel chronométré ; 12. Question à indice progressif.

## 7. Banque principale — 580 exercices interactifs

> La banque ci-dessous contient **5 exercices explicites pour chacun des 116 articles = 580 exercices**. Les distracteurs des QCM sont générés à partir des articles voisins mais le feedback renvoie toujours à l'article source. Claude Code doit matérialiser les distracteurs avant livraison et conserver `correct_answer` comme vérité de référence.

### EX-0001
- `article`: 1
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 1 ?
- `correct_answer`: Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.
- `feedback_correct`: Exact. Relire mentalement l'article 1 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.
- `audio`: true
- `difficulty`: 2


### EX-0002
- `article`: 1
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 1 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.
- `audio`: true
- `difficulty`: 1


### EX-0003
- `article`: 1
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 1 ?
- `correct_answer`: Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.
- `feedback_correct`: Exact. Relire mentalement l'article 1 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.
- `audio`: true
- `difficulty`: 2


### EX-0004
- `article`: 1
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération. » ?
- `correct_answer`: 1
- `feedback_correct`: Exact. Relire mentalement l'article 1 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.
- `audio`: true
- `difficulty`: 3


### EX-0005
- `article`: 1
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 1 : Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.
- `feedback_correct`: Exact. Relire mentalement l'article 1 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Champ d'application : personnes nommées à titre permanent, titularisées après stage probatoire, servant l'État ; les statuts particuliers peuvent déroger sauf pour introduire des conditions plus favorables en matière de rémunération.
- `audio`: true
- `difficulty`: 3


### EX-0006
- `article`: 2
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 2 ?
- `correct_answer`: Les personnes soumises au statut ont la qualité de fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 2 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les personnes soumises au statut ont la qualité de fonctionnaire.
- `audio`: true
- `difficulty`: 2


### EX-0007
- `article`: 2
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les personnes soumises au statut ont la qualité de fonctionnaire.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 2 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les personnes soumises au statut ont la qualité de fonctionnaire.
- `audio`: true
- `difficulty`: 1


### EX-0008
- `article`: 2
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 2 ?
- `correct_answer`: Les personnes soumises au statut ont la qualité de fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 2 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les personnes soumises au statut ont la qualité de fonctionnaire.
- `audio`: true
- `difficulty`: 2


### EX-0009
- `article`: 2
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les personnes soumises au statut ont la qualité de fonctionnaire. » ?
- `correct_answer`: 2
- `feedback_correct`: Exact. Relire mentalement l'article 2 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les personnes soumises au statut ont la qualité de fonctionnaire.
- `audio`: true
- `difficulty`: 3


### EX-0010
- `article`: 2
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les personnes soumises au statut ont la qualité de fonctionnaire. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 2 : Les personnes soumises au statut ont la qualité de fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 2 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les personnes soumises au statut ont la qualité de fonctionnaire.
- `audio`: true
- `difficulty`: 3


### EX-0011
- `article`: 3
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 3 ?
- `correct_answer`: Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.
- `feedback_correct`: Exact. Relire mentalement l'article 3 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.
- `audio`: true
- `difficulty`: 2


### EX-0012
- `article`: 3
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 3 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.
- `audio`: true
- `difficulty`: 1


### EX-0013
- `article`: 3
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 3 ?
- `correct_answer`: Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.
- `feedback_correct`: Exact. Relire mentalement l'article 3 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.
- `audio`: true
- `difficulty`: 2


### EX-0014
- `article`: 3
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité. » ?
- `correct_answer`: 3
- `feedback_correct`: Exact. Relire mentalement l'article 3 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.
- `audio`: true
- `difficulty`: 3


### EX-0015
- `article`: 3
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 3 : Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.
- `feedback_correct`: Exact. Relire mentalement l'article 3 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire appartient à une famille d'emplois ; une famille d'emplois regroupe des spécialités d'un même domaine général d'activité.
- `audio`: true
- `difficulty`: 3


### EX-0016
- `article`: 4
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 4 ?
- `correct_answer`: Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 4 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0017
- `article`: 4
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 4 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 1


### EX-0018
- `article`: 4
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 4 ?
- `correct_answer`: Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 4 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0019
- `article`: 4
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres. » ?
- `correct_answer`: 4
- `feedback_correct`: Exact. Relire mentalement l'article 4 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0020
- `article`: 4
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 4 : Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 4 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions d'âge d'accès aux emplois de la Fonction Publique sont fixées par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0021
- `article`: 5
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 5 ?
- `correct_answer`: Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.
- `feedback_correct`: Exact. Relire mentalement l'article 5 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.
- `audio`: true
- `difficulty`: 2


### EX-0022
- `article`: 5
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 5 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.
- `audio`: true
- `difficulty`: 1


### EX-0023
- `article`: 5
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 5 ?
- `correct_answer`: Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.
- `feedback_correct`: Exact. Relire mentalement l'article 5 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.
- `audio`: true
- `difficulty`: 2


### EX-0024
- `article`: 5
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois. » ?
- `correct_answer`: 5
- `feedback_correct`: Exact. Relire mentalement l'article 5 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.
- `audio`: true
- `difficulty`: 3


### EX-0025
- `article`: 5
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 5 : Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.
- `feedback_correct`: Exact. Relire mentalement l'article 5 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres déterminent les modalités communes d'application, les modalités particulières par catégories et les familles d'emplois.
- `audio`: true
- `difficulty`: 3


### EX-0026
- `article`: 6
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 6 ?
- `correct_answer`: Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.
- `feedback_correct`: Exact. Relire mentalement l'article 6 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.
- `audio`: true
- `difficulty`: 2


### EX-0027
- `article`: 6
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 6 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.
- `audio`: true
- `difficulty`: 1


### EX-0028
- `article`: 6
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 6 ?
- `correct_answer`: Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.
- `feedback_correct`: Exact. Relire mentalement l'article 6 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.
- `audio`: true
- `difficulty`: 2


### EX-0029
- `article`: 6
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire. » ?
- `correct_answer`: 6
- `feedback_correct`: Exact. Relire mentalement l'article 6 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.
- `audio`: true
- `difficulty`: 3


### EX-0030
- `article`: 6
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 6 : Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.
- `feedback_correct`: Exact. Relire mentalement l'article 6 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est vis-à-vis de l'Administration dans une situation statutaire et réglementaire.
- `audio`: true
- `difficulty`: 3


### EX-0031
- `article`: 7
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 7 ?
- `correct_answer`: Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.
- `feedback_correct`: Exact. Relire mentalement l'article 7 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.
- `audio`: true
- `difficulty`: 2


### EX-0032
- `article`: 7
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 7 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.
- `audio`: true
- `difficulty`: 1


### EX-0033
- `article`: 7
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 7 ?
- `correct_answer`: Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.
- `feedback_correct`: Exact. Relire mentalement l'article 7 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.
- `audio`: true
- `difficulty`: 2


### EX-0034
- `article`: 7
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences. » ?
- `correct_answer`: 7
- `feedback_correct`: Exact. Relire mentalement l'article 7 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.
- `audio`: true
- `difficulty`: 3


### EX-0035
- `article`: 7
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 7 : Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.
- `feedback_correct`: Exact. Relire mentalement l'article 7 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont classés en quatre catégories hiérarchiques décroissantes A, B, C et D, selon diplômes, qualifications et expériences.
- `audio`: true
- `difficulty`: 3


### EX-0036
- `article`: 8
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 8 ?
- `correct_answer`: Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.
- `feedback_correct`: Exact. Relire mentalement l'article 8 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.
- `audio`: true
- `difficulty`: 2


### EX-0037
- `article`: 8
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 8 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.
- `audio`: true
- `difficulty`: 1


### EX-0038
- `article`: 8
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 8 ?
- `correct_answer`: Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.
- `feedback_correct`: Exact. Relire mentalement l'article 8 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.
- `audio`: true
- `difficulty`: 2


### EX-0039
- `article`: 8
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution. » ?
- `correct_answer`: 8
- `feedback_correct`: Exact. Relire mentalement l'article 8 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.
- `audio`: true
- `difficulty`: 3


### EX-0040
- `article`: 8
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 8 : Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.
- `feedback_correct`: Exact. Relire mentalement l'article 8 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Catégorie A : études, conception, direction, supervision ; B : application ; C et D : exécution.
- `audio`: true
- `difficulty`: 3


### EX-0041
- `article`: 9
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 9 ?
- `correct_answer`: À chaque catégorie sont rattachés des grades.
- `feedback_correct`: Exact. Relire mentalement l'article 9 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À chaque catégorie sont rattachés des grades.
- `audio`: true
- `difficulty`: 2


### EX-0042
- `article`: 9
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : À chaque catégorie sont rattachés des grades.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 9 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À chaque catégorie sont rattachés des grades.
- `audio`: true
- `difficulty`: 1


### EX-0043
- `article`: 9
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 9 ?
- `correct_answer`: À chaque catégorie sont rattachés des grades.
- `feedback_correct`: Exact. Relire mentalement l'article 9 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À chaque catégorie sont rattachés des grades.
- `audio`: true
- `difficulty`: 2


### EX-0044
- `article`: 9
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « À chaque catégorie sont rattachés des grades. » ?
- `correct_answer`: 9
- `feedback_correct`: Exact. Relire mentalement l'article 9 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À chaque catégorie sont rattachés des grades.
- `audio`: true
- `difficulty`: 3


### EX-0045
- `article`: 9
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : À chaque catégorie sont rattachés des grades. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 9 : À chaque catégorie sont rattachés des grades.
- `feedback_correct`: Exact. Relire mentalement l'article 9 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À chaque catégorie sont rattachés des grades.
- `audio`: true
- `difficulty`: 3


### EX-0046
- `article`: 10
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 10 ?
- `correct_answer`: Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.
- `feedback_correct`: Exact. Relire mentalement l'article 10 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.
- `audio`: true
- `difficulty`: 2


### EX-0047
- `article`: 10
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 10 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.
- `audio`: true
- `difficulty`: 1


### EX-0048
- `article`: 10
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 10 ?
- `correct_answer`: Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.
- `feedback_correct`: Exact. Relire mentalement l'article 10 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.
- `audio`: true
- `difficulty`: 2


### EX-0049
- `article`: 10
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi. » ?
- `correct_answer`: 10
- `feedback_correct`: Exact. Relire mentalement l'article 10 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.
- `audio`: true
- `difficulty`: 3


### EX-0050
- `article`: 10
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 10 : Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.
- `feedback_correct`: Exact. Relire mentalement l'article 10 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le grade est le titre acquis dans une catégorie ; il donne vocation à occuper un emploi. À chaque grade correspond une échelle avec classes et échelons ; le grade est distinct de l'emploi.
- `audio`: true
- `difficulty`: 3


### EX-0051
- `article`: 11
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 11 ?
- `correct_answer`: L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.
- `feedback_correct`: Exact. Relire mentalement l'article 11 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.
- `audio`: true
- `difficulty`: 2


### EX-0052
- `article`: 11
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 11 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.
- `audio`: true
- `difficulty`: 1


### EX-0053
- `article`: 11
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 11 ?
- `correct_answer`: L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.
- `feedback_correct`: Exact. Relire mentalement l'article 11 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.
- `audio`: true
- `difficulty`: 2


### EX-0054
- `article`: 11
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue. » ?
- `correct_answer`: 11
- `feedback_correct`: Exact. Relire mentalement l'article 11 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.
- `audio`: true
- `difficulty`: 3


### EX-0055
- `article`: 11
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 11 : L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.
- `feedback_correct`: Exact. Relire mentalement l'article 11 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'emploi est la profession exercée par le fonctionnaire en rapport avec une qualification acquise après formation initiale ou continue.
- `audio`: true
- `difficulty`: 3


### EX-0056
- `article`: 12
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 12 ?
- `correct_answer`: Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 12 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0057
- `article`: 12
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 12 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 1


### EX-0058
- `article`: 12
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 12 ?
- `correct_answer`: Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 12 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0059
- `article`: 12
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres. » ?
- `correct_answer`: 12
- `feedback_correct`: Exact. Relire mentalement l'article 12 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0060
- `article`: 12
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 12 : Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 12 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois sont créés ou supprimés selon les besoins de l'Administration, par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0061
- `article`: 13
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 13 ?
- `correct_answer`: Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 13 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0062
- `article`: 13
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 13 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 1


### EX-0063
- `article`: 13
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 13 ?
- `correct_answer`: Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 13 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0064
- `article`: 13
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres. » ?
- `correct_answer`: 13
- `feedback_correct`: Exact. Relire mentalement l'article 13 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0065
- `article`: 13
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 13 : Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 13 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires ont, dans leur famille d'emplois, un profil de carrière fixé par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0066
- `article`: 14
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 14 ?
- `correct_answer`: Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 14 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0067
- `article`: 14
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 14 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 1


### EX-0068
- `article`: 14
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 14 ?
- `correct_answer`: Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 14 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0069
- `article`: 14
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres. » ?
- `correct_answer`: 14
- `feedback_correct`: Exact. Relire mentalement l'article 14 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0070
- `article`: 14
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 14 : Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 14 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les grades et échelles de traitement sont fixés par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0071
- `article`: 15
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 15 ?
- `correct_answer`: Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.
- `feedback_correct`: Exact. Relire mentalement l'article 15 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.
- `audio`: true
- `difficulty`: 2


### EX-0072
- `article`: 15
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 15 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.
- `audio`: true
- `difficulty`: 1


### EX-0073
- `article`: 15
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 15 ?
- `correct_answer`: Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.
- `feedback_correct`: Exact. Relire mentalement l'article 15 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.
- `audio`: true
- `difficulty`: 2


### EX-0074
- `article`: 15
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade. » ?
- `correct_answer`: 15
- `feedback_correct`: Exact. Relire mentalement l'article 15 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.
- `audio`: true
- `difficulty`: 3


### EX-0075
- `article`: 15
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 15 : Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.
- `feedback_correct`: Exact. Relire mentalement l'article 15 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut changer d'emploi selon les besoins, une reconversion ou à sa demande ; l'inapte à un emploi actif peut être nommé à un emploi sédentaire de son grade.
- `audio`: true
- `difficulty`: 3


### EX-0076
- `article`: 16
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 16 ?
- `correct_answer`: L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.
- `feedback_correct`: Exact. Relire mentalement l'article 16 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.
- `audio`: true
- `difficulty`: 2


### EX-0077
- `article`: 16
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 16 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.
- `audio`: true
- `difficulty`: 1


### EX-0078
- `article`: 16
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 16 ?
- `correct_answer`: L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.
- `feedback_correct`: Exact. Relire mentalement l'article 16 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.
- `audio`: true
- `difficulty`: 2


### EX-0079
- `article`: 16
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables. » ?
- `correct_answer`: 16
- `feedback_correct`: Exact. Relire mentalement l'article 16 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.
- `audio`: true
- `difficulty`: 3


### EX-0080
- `article`: 16
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 16 : L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.
- `feedback_correct`: Exact. Relire mentalement l'article 16 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'accès à un emploi de fonctionnaire suit le statut ; les emplois supérieurs de l'État sont laissés à la discrétion du Gouvernement ; la nomination d'un non-fonctionnaire n'entraîne pas titularisation et ces nominations sont révocables.
- `audio`: true
- `difficulty`: 3


### EX-0081
- `article`: 17
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 17 ?
- `correct_answer`: Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.
- `feedback_correct`: Exact. Relire mentalement l'article 17 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.
- `audio`: true
- `difficulty`: 2


### EX-0082
- `article`: 17
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 17 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.
- `audio`: true
- `difficulty`: 1


### EX-0083
- `article`: 17
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 17 ?
- `correct_answer`: Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.
- `feedback_correct`: Exact. Relire mentalement l'article 17 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.
- `audio`: true
- `difficulty`: 2


### EX-0084
- `article`: 17
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap. » ?
- `correct_answer`: 17
- `feedback_correct`: Exact. Relire mentalement l'article 17 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.
- `audio`: true
- `difficulty`: 3


### EX-0085
- `article`: 17
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 17 : Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.
- `feedback_correct`: Exact. Relire mentalement l'article 17 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Aucune discrimination ne doit intervenir pour l'accès, la carrière ou la retraite en raison notamment de la race, ethnie, clan, tribu, couleur de peau, sexe, opinion, origine, appartenance syndicale, religieuse, sociale ou handicap.
- `audio`: true
- `difficulty`: 3


### EX-0086
- `article`: 18
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 18 ?
- `correct_answer`: Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.
- `feedback_correct`: Exact. Relire mentalement l'article 18 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 2


### EX-0087
- `article`: 18
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 18 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 1


### EX-0088
- `article`: 18
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 18 ?
- `correct_answer`: Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.
- `feedback_correct`: Exact. Relire mentalement l'article 18 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 2


### EX-0089
- `article`: 18
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois. » ?
- `correct_answer`: 18
- `feedback_correct`: Exact. Relire mentalement l'article 18 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 3


### EX-0090
- `article`: 18
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 18 : Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.
- `feedback_correct`: Exact. Relire mentalement l'article 18 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les emplois civils sont en principe occupés par des fonctionnaires ; des agents contractuels peuvent exceptionnellement occuper certains emplois A ou fonctions de cabinet. Le contrat visé pour certains emplois A est au plus de deux ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 3


### EX-0091
- `article`: 19
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 19 ?
- `correct_answer`: En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.
- `feedback_correct`: Exact. Relire mentalement l'article 19 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.
- `audio`: true
- `difficulty`: 2


### EX-0092
- `article`: 19
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 19 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.
- `audio`: true
- `difficulty`: 1


### EX-0093
- `article`: 19
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 19 ?
- `correct_answer`: En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.
- `feedback_correct`: Exact. Relire mentalement l'article 19 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.
- `audio`: true
- `difficulty`: 2


### EX-0094
- `article`: 19
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert. » ?
- `correct_answer`: 19
- `feedback_correct`: Exact. Relire mentalement l'article 19 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.
- `audio`: true
- `difficulty`: 3


### EX-0095
- `article`: 19
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 19 : En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.
- `feedback_correct`: Exact. Relire mentalement l'article 19 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de vacance dans l'Enseignement supérieur, des enseignants du supérieur de rang A peuvent être recrutés par contrat d'assimilation lorsque leur qualification le requiert.
- `audio`: true
- `difficulty`: 3


### EX-0096
- `article`: 20
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 20 ?
- `correct_answer`: La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.
- `feedback_correct`: Exact. Relire mentalement l'article 20 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.
- `audio`: true
- `difficulty`: 2


### EX-0097
- `article`: 20
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 20 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.
- `audio`: true
- `difficulty`: 1


### EX-0098
- `article`: 20
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 20 ?
- `correct_answer`: La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.
- `feedback_correct`: Exact. Relire mentalement l'article 20 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.
- `audio`: true
- `difficulty`: 2


### EX-0099
- `article`: 20
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade. » ?
- `correct_answer`: 20
- `feedback_correct`: Exact. Relire mentalement l'article 20 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.
- `audio`: true
- `difficulty`: 3


### EX-0100
- `article`: 20
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 20 : La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.
- `feedback_correct`: Exact. Relire mentalement l'article 20 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La nomination d'un contractuel n'entraîne pas sa titularisation dans un grade.
- `audio`: true
- `difficulty`: 3


### EX-0101
- `article`: 21
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 21 ?
- `correct_answer`: La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.
- `feedback_correct`: Exact. Relire mentalement l'article 21 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.
- `audio`: true
- `difficulty`: 2


### EX-0102
- `article`: 21
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 21 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.
- `audio`: true
- `difficulty`: 1


### EX-0103
- `article`: 21
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 21 ?
- `correct_answer`: La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.
- `feedback_correct`: Exact. Relire mentalement l'article 21 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.
- `audio`: true
- `difficulty`: 2


### EX-0104
- `article`: 21
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée. » ?
- `correct_answer`: 21
- `feedback_correct`: Exact. Relire mentalement l'article 21 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.
- `audio`: true
- `difficulty`: 3


### EX-0105
- `article`: 21
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 21 : La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.
- `feedback_correct`: Exact. Relire mentalement l'article 21 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liberté d'opinion est reconnue ; son expression doit respecter Constitution/statut, s'exercer hors service et avec la réserve appropriée.
- `audio`: true
- `difficulty`: 3


### EX-0106
- `article`: 22
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 22 ?
- `correct_answer`: Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 22 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.
- `audio`: true
- `difficulty`: 2


### EX-0107
- `article`: 22
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 22 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.
- `audio`: true
- `difficulty`: 1


### EX-0108
- `article`: 22
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 22 ?
- `correct_answer`: Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 22 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.
- `audio`: true
- `difficulty`: 2


### EX-0109
- `article`: 22
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire. » ?
- `correct_answer`: 22
- `feedback_correct`: Exact. Relire mentalement l'article 22 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.
- `audio`: true
- `difficulty`: 3


### EX-0110
- `article`: 22
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 22 : Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 22 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le dossier administratif ne doit faire état des opinions ou activités politiques, syndicales, religieuses ou philosophiques du fonctionnaire.
- `audio`: true
- `difficulty`: 3


### EX-0111
- `article`: 23
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 23 ?
- `correct_answer`: Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.
- `feedback_correct`: Exact. Relire mentalement l'article 23 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.
- `audio`: true
- `difficulty`: 2


### EX-0112
- `article`: 23
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 23 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.
- `audio`: true
- `difficulty`: 1


### EX-0113
- `article`: 23
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 23 ?
- `correct_answer`: Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.
- `feedback_correct`: Exact. Relire mentalement l'article 23 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.
- `audio`: true
- `difficulty`: 2


### EX-0114
- `article`: 23
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail. » ?
- `correct_answer`: 23
- `feedback_correct`: Exact. Relire mentalement l'article 23 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.
- `audio`: true
- `difficulty`: 3


### EX-0115
- `article`: 23
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 23 : Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.
- `feedback_correct`: Exact. Relire mentalement l'article 23 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit syndical est reconnu ; syndicats et représentativité sont régis par le Code du Travail.
- `audio`: true
- `difficulty`: 3


### EX-0116
- `article`: 24
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 24 ?
- `correct_answer`: Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.
- `feedback_correct`: Exact. Relire mentalement l'article 24 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.
- `audio`: true
- `difficulty`: 2


### EX-0117
- `article`: 24
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 24 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.
- `audio`: true
- `difficulty`: 1


### EX-0118
- `article`: 24
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 24 ?
- `correct_answer`: Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.
- `feedback_correct`: Exact. Relire mentalement l'article 24 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.
- `audio`: true
- `difficulty`: 2


### EX-0119
- `article`: 24
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération. » ?
- `correct_answer`: 24
- `feedback_correct`: Exact. Relire mentalement l'article 24 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.
- `audio`: true
- `difficulty`: 3


### EX-0120
- `article`: 24
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 24 : Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.
- `feedback_correct`: Exact. Relire mentalement l'article 24 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le droit de grève est reconnu pour la défense des intérêts professionnels ; il respecte liberté du travail, négociations, préavis et service minimum ; l'absence pour grève entraîne une réduction proportionnelle de rémunération.
- `audio`: true
- `difficulty`: 3


### EX-0121
- `article`: 25
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 25 ?
- `correct_answer`: Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.
- `feedback_correct`: Exact. Relire mentalement l'article 25 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.
- `audio`: true
- `difficulty`: 2


### EX-0122
- `article`: 25
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 25 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.
- `audio`: true
- `difficulty`: 1


### EX-0123
- `article`: 25
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 25 ?
- `correct_answer`: Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.
- `feedback_correct`: Exact. Relire mentalement l'article 25 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.
- `audio`: true
- `difficulty`: 2


### EX-0124
- `article`: 25
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres. » ?
- `correct_answer`: 25
- `feedback_correct`: Exact. Relire mentalement l'article 25 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.
- `audio`: true
- `difficulty`: 3


### EX-0125
- `article`: 25
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 25 : Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.
- `feedback_correct`: Exact. Relire mentalement l'article 25 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les syndicats déposent statuts et liste d'administrateurs ; ils peuvent exercer des recours contre certains actes réglementaires et décisions portant atteinte aux intérêts de leurs membres.
- `audio`: true
- `difficulty`: 3


### EX-0126
- `article`: 26
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 26 ?
- `correct_answer`: Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.
- `feedback_correct`: Exact. Relire mentalement l'article 26 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.
- `audio`: true
- `difficulty`: 2


### EX-0127
- `article`: 26
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 26 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.
- `audio`: true
- `difficulty`: 1


### EX-0128
- `article`: 26
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 26 ?
- `correct_answer`: Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.
- `feedback_correct`: Exact. Relire mentalement l'article 26 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.
- `audio`: true
- `difficulty`: 2


### EX-0129
- `article`: 26
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail. » ?
- `correct_answer`: 26
- `feedback_correct`: Exact. Relire mentalement l'article 26 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.
- `audio`: true
- `difficulty`: 3


### EX-0130
- `article`: 26
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 26 : Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.
- `feedback_correct`: Exact. Relire mentalement l'article 26 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Une protection et une décharge partielle de travail sont accordées aux responsables syndicaux selon le Code du Travail.
- `audio`: true
- `difficulty`: 3


### EX-0131
- `article`: 27
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 27 ?
- `correct_answer`: Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.
- `feedback_correct`: Exact. Relire mentalement l'article 27 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.
- `audio`: true
- `difficulty`: 2


### EX-0132
- `article`: 27
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 27 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.
- `audio`: true
- `difficulty`: 1


### EX-0133
- `article`: 27
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 27 ?
- `correct_answer`: Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.
- `feedback_correct`: Exact. Relire mentalement l'article 27 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.
- `audio`: true
- `difficulty`: 2


### EX-0134
- `article`: 27
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable. » ?
- `correct_answer`: 27
- `feedback_correct`: Exact. Relire mentalement l'article 27 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.
- `audio`: true
- `difficulty`: 3


### EX-0135
- `article`: 27
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 27 : Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.
- `feedback_correct`: Exact. Relire mentalement l'article 27 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire bénéficie d'une protection de la collectivité dans l'exercice de ses fonctions ; pour faute de service, la collectivité répond des condamnations civiles sauf faute personnelle détachable.
- `audio`: true
- `difficulty`: 3


### EX-0136
- `article`: 28
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 28 ?
- `correct_answer`: La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.
- `feedback_correct`: Exact. Relire mentalement l'article 28 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.
- `audio`: true
- `difficulty`: 2


### EX-0137
- `article`: 28
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 28 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.
- `audio`: true
- `difficulty`: 1


### EX-0138
- `article`: 28
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 28 ?
- `correct_answer`: La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.
- `feedback_correct`: Exact. Relire mentalement l'article 28 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.
- `audio`: true
- `difficulty`: 2


### EX-0139
- `article`: 28
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable. » ?
- `correct_answer`: 28
- `feedback_correct`: Exact. Relire mentalement l'article 28 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.
- `audio`: true
- `difficulty`: 3


### EX-0140
- `article`: 28
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 28 : La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.
- `feedback_correct`: Exact. Relire mentalement l'article 28 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La collectivité protège contre menaces, violences, voies de fait, injures, diffamations ou outrages et répare le préjudice ; elle peut agir contre les auteurs et contre l'agent en cas de faute détachable.
- `audio`: true
- `difficulty`: 3


### EX-0141
- `article`: 29
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 29 ?
- `correct_answer`: Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.
- `feedback_correct`: Exact. Relire mentalement l'article 29 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.
- `audio`: true
- `difficulty`: 2


### EX-0142
- `article`: 29
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 29 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.
- `audio`: true
- `difficulty`: 1


### EX-0143
- `article`: 29
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 29 ?
- `correct_answer`: Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.
- `feedback_correct`: Exact. Relire mentalement l'article 29 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.
- `audio`: true
- `difficulty`: 2


### EX-0144
- `article`: 29
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion. » ?
- `correct_answer`: 29
- `feedback_correct`: Exact. Relire mentalement l'article 29 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.
- `audio`: true
- `difficulty`: 3


### EX-0145
- `article`: 29
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 29 : Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.
- `feedback_correct`: Exact. Relire mentalement l'article 29 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Droits : rémunération, congé annuel, absences spéciales, congés maladie, parentaux, maternité/allaitement, paternité, visite médicale annuelle, couverture sociale, formation continue, promotion.
- `audio`: true
- `difficulty`: 3


### EX-0146
- `article`: 30
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 30 ?
- `correct_answer`: L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.
- `feedback_correct`: Exact. Relire mentalement l'article 30 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.
- `audio`: true
- `difficulty`: 2


### EX-0147
- `article`: 30
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 30 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.
- `audio`: true
- `difficulty`: 1


### EX-0148
- `article`: 30
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 30 ?
- `correct_answer`: L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.
- `feedback_correct`: Exact. Relire mentalement l'article 30 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.
- `audio`: true
- `difficulty`: 2


### EX-0149
- `article`: 30
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public. » ?
- `correct_answer`: 30
- `feedback_correct`: Exact. Relire mentalement l'article 30 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.
- `audio`: true
- `difficulty`: 3


### EX-0150
- `article`: 30
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 30 : L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.
- `feedback_correct`: Exact. Relire mentalement l'article 30 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'État assure des conditions de travail adéquates pour l'accomplissement de la mission de service public.
- `audio`: true
- `difficulty`: 3


### EX-0151
- `article`: 31
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 31 ?
- `correct_answer`: Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.
- `feedback_correct`: Exact. Relire mentalement l'article 31 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.
- `audio`: true
- `difficulty`: 2


### EX-0152
- `article`: 31
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 31 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.
- `audio`: true
- `difficulty`: 1


### EX-0153
- `article`: 31
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 31 ?
- `correct_answer`: Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.
- `feedback_correct`: Exact. Relire mentalement l'article 31 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.
- `audio`: true
- `difficulty`: 2


### EX-0154
- `article`: 31
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail. » ?
- `correct_answer`: 31
- `feedback_correct`: Exact. Relire mentalement l'article 31 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.
- `audio`: true
- `difficulty`: 3


### EX-0155
- `article`: 31
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 31 : Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.
- `feedback_correct`: Exact. Relire mentalement l'article 31 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les conditions de travail concernent notamment environnement, moyens, santé et sécurité au travail.
- `audio`: true
- `difficulty`: 3


### EX-0156
- `article`: 32
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 32 ?
- `correct_answer`: Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.
- `feedback_correct`: Exact. Relire mentalement l'article 32 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.
- `audio`: true
- `difficulty`: 2


### EX-0157
- `article`: 32
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 32 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.
- `audio`: true
- `difficulty`: 1


### EX-0158
- `article`: 32
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 32 ?
- `correct_answer`: Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.
- `feedback_correct`: Exact. Relire mentalement l'article 32 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.
- `audio`: true
- `difficulty`: 2


### EX-0159
- `article`: 32
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation. » ?
- `correct_answer`: 32
- `feedback_correct`: Exact. Relire mentalement l'article 32 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.
- `audio`: true
- `difficulty`: 3


### EX-0160
- `article`: 32
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 32 : Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.
- `feedback_correct`: Exact. Relire mentalement l'article 32 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire sert avec loyauté, dignité, intégrité et dévouement, consacre son temps de travail aux tâches confiées et ne peut exercer une activité privée lucrative professionnelle sauf dérogation.
- `audio`: true
- `difficulty`: 3


### EX-0161
- `article`: 33
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 33 ?
- `correct_answer`: Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.
- `feedback_correct`: Exact. Relire mentalement l'article 33 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.
- `audio`: true
- `difficulty`: 2


### EX-0162
- `article`: 33
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 33 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.
- `audio`: true
- `difficulty`: 1


### EX-0163
- `article`: 33
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 33 ?
- `correct_answer`: Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.
- `feedback_correct`: Exact. Relire mentalement l'article 33 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.
- `audio`: true
- `difficulty`: 2


### EX-0164
- `article`: 33
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée. » ?
- `correct_answer`: 33
- `feedback_correct`: Exact. Relire mentalement l'article 33 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.
- `audio`: true
- `difficulty`: 3


### EX-0165
- `article`: 33
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 33 : Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.
- `feedback_correct`: Exact. Relire mentalement l'article 33 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut prendre d'intérêts dans une entreprise sous contrôle ou en relation avec son administration ; l'activité lucrative du conjoint doit être déclarée.
- `audio`: true
- `difficulty`: 3


### EX-0166
- `article`: 34
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 34 ?
- `correct_answer`: Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.
- `feedback_correct`: Exact. Relire mentalement l'article 34 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.
- `audio`: true
- `difficulty`: 2


### EX-0167
- `article`: 34
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 34 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.
- `audio`: true
- `difficulty`: 1


### EX-0168
- `article`: 34
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 34 ?
- `correct_answer`: Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.
- `feedback_correct`: Exact. Relire mentalement l'article 34 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.
- `audio`: true
- `difficulty`: 2


### EX-0169
- `article`: 34
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions. » ?
- `correct_answer`: 34
- `feedback_correct`: Exact. Relire mentalement l'article 34 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.
- `audio`: true
- `difficulty`: 3


### EX-0170
- `article`: 34
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 34 : Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.
- `feedback_correct`: Exact. Relire mentalement l'article 34 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire ne peut solliciter ni recevoir dons, gratifications ou avantages en raison de ses fonctions.
- `audio`: true
- `difficulty`: 3


### EX-0171
- `article`: 35
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 35 ?
- `correct_answer`: Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.
- `feedback_correct`: Exact. Relire mentalement l'article 35 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.
- `audio`: true
- `difficulty`: 2


### EX-0172
- `article`: 35
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 35 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.
- `audio`: true
- `difficulty`: 1


### EX-0173
- `article`: 35
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 35 ?
- `correct_answer`: Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.
- `feedback_correct`: Exact. Relire mentalement l'article 35 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.
- `audio`: true
- `difficulty`: 2


### EX-0174
- `article`: 35
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes. » ?
- `correct_answer`: 35
- `feedback_correct`: Exact. Relire mentalement l'article 35 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.
- `audio`: true
- `difficulty`: 3


### EX-0175
- `article`: 35
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 35 : Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.
- `feedback_correct`: Exact. Relire mentalement l'article 35 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est tenu au secret et à la discrétion professionnels ainsi qu'à l'obligation de réserve ; la levée de la discrétion relève d'une décision expresse du Ministre compétent, hors cas prévus par les textes.
- `audio`: true
- `difficulty`: 3


### EX-0176
- `article`: 36
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 36 ?
- `correct_answer`: Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.
- `feedback_correct`: Exact. Relire mentalement l'article 36 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.
- `audio`: true
- `difficulty`: 2


### EX-0177
- `article`: 36
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 36 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.
- `audio`: true
- `difficulty`: 1


### EX-0178
- `article`: 36
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 36 ?
- `correct_answer`: Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.
- `feedback_correct`: Exact. Relire mentalement l'article 36 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.
- `audio`: true
- `difficulty`: 2


### EX-0179
- `article`: 36
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion. » ?
- `correct_answer`: 36
- `feedback_correct`: Exact. Relire mentalement l'article 36 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.
- `audio`: true
- `difficulty`: 3


### EX-0180
- `article`: 36
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 36 : Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.
- `feedback_correct`: Exact. Relire mentalement l'article 36 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire doit satisfaire aux demandes d'information du public dans le respect des règles de secret/discrétion.
- `audio`: true
- `difficulty`: 3


### EX-0181
- `article`: 37
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 37 ?
- `correct_answer`: Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.
- `feedback_correct`: Exact. Relire mentalement l'article 37 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.
- `audio`: true
- `difficulty`: 2


### EX-0182
- `article`: 37
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 37 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.
- `audio`: true
- `difficulty`: 1


### EX-0183
- `article`: 37
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 37 ?
- `correct_answer`: Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.
- `feedback_correct`: Exact. Relire mentalement l'article 37 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.
- `audio`: true
- `difficulty`: 2


### EX-0184
- `article`: 37
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne. » ?
- `correct_answer`: 37
- `feedback_correct`: Exact. Relire mentalement l'article 37 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.
- `audio`: true
- `difficulty`: 3


### EX-0185
- `article`: 37
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 37 : Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.
- `feedback_correct`: Exact. Relire mentalement l'article 37 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque fonctionnaire est responsable des tâches confiées et doit suivre les instructions du supérieur ; la responsabilité des subordonnés ne le dégage pas de la sienne.
- `audio`: true
- `difficulty`: 3


### EX-0186
- `article`: 38
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 38 ?
- `correct_answer`: Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.
- `feedback_correct`: Exact. Relire mentalement l'article 38 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.
- `audio`: true
- `difficulty`: 2


### EX-0187
- `article`: 38
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 38 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.
- `audio`: true
- `difficulty`: 1


### EX-0188
- `article`: 38
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 38 ?
- `correct_answer`: Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.
- `feedback_correct`: Exact. Relire mentalement l'article 38 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.
- `audio`: true
- `difficulty`: 2


### EX-0189
- `article`: 38
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute. » ?
- `correct_answer`: 38
- `feedback_correct`: Exact. Relire mentalement l'article 38 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.
- `audio`: true
- `difficulty`: 3


### EX-0190
- `article`: 38
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 38 : Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.
- `feedback_correct`: Exact. Relire mentalement l'article 38 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le manquement aux obligations constitue une faute disciplinaire, sans préjudice d'autres manquements constitutifs de faute.
- `audio`: true
- `difficulty`: 3


### EX-0191
- `article`: 39
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 39 ?
- `correct_answer`: Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.
- `feedback_correct`: Exact. Relire mentalement l'article 39 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.
- `audio`: true
- `difficulty`: 2


### EX-0192
- `article`: 39
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 39 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.
- `audio`: true
- `difficulty`: 1


### EX-0193
- `article`: 39
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 39 ?
- `correct_answer`: Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.
- `feedback_correct`: Exact. Relire mentalement l'article 39 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.
- `audio`: true
- `difficulty`: 2


### EX-0194
- `article`: 39
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline. » ?
- `correct_answer`: 39
- `feedback_correct`: Exact. Relire mentalement l'article 39 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.
- `audio`: true
- `difficulty`: 3


### EX-0195
- `article`: 39
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 39 : Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.
- `feedback_correct`: Exact. Relire mentalement l'article 39 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Organismes consultatifs : Comité Consultatif, Commission de Réforme, Commission Administrative de Recours, Conseil de Santé et Sécurité au Travail, Conseil de Discipline.
- `audio`: true
- `difficulty`: 3


### EX-0196
- `article`: 40
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 40 ?
- `correct_answer`: Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.
- `feedback_correct`: Exact. Relire mentalement l'article 40 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.
- `audio`: true
- `difficulty`: 2


### EX-0197
- `article`: 40
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 40 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.
- `audio`: true
- `difficulty`: 1


### EX-0198
- `article`: 40
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 40 ?
- `correct_answer`: Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.
- `feedback_correct`: Exact. Relire mentalement l'article 40 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.
- `audio`: true
- `difficulty`: 2


### EX-0199
- `article`: 40
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale. » ?
- `correct_answer`: 40
- `feedback_correct`: Exact. Relire mentalement l'article 40 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.
- `audio`: true
- `difficulty`: 3


### EX-0200
- `article`: 40
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 40 : Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.
- `feedback_correct`: Exact. Relire mentalement l'article 40 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Comité Consultatif connaît des questions d'ordre général intéressant les fonctionnaires et peut être saisi notamment par le Ministre, un tiers de ses membres ou une centrale syndicale.
- `audio`: true
- `difficulty`: 3


### EX-0201
- `article`: 41
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 41 ?
- `correct_answer`: La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.
- `feedback_correct`: Exact. Relire mentalement l'article 41 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.
- `audio`: true
- `difficulty`: 2


### EX-0202
- `article`: 41
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 41 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.
- `audio`: true
- `difficulty`: 1


### EX-0203
- `article`: 41
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 41 ?
- `correct_answer`: La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.
- `feedback_correct`: Exact. Relire mentalement l'article 41 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.
- `audio`: true
- `difficulty`: 2


### EX-0204
- `article`: 41
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité. » ?
- `correct_answer`: 41
- `feedback_correct`: Exact. Relire mentalement l'article 41 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.
- `audio`: true
- `difficulty`: 3


### EX-0205
- `article`: 41
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 41 : La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.
- `feedback_correct`: Exact. Relire mentalement l'article 41 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission de Réforme donne un avis notamment sur allocations temporaires d'invalidité, rentes pour accident/maladie professionnelle et retraite pour invalidité.
- `audio`: true
- `difficulty`: 3


### EX-0206
- `article`: 42
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 42 ?
- `correct_answer`: La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.
- `feedback_correct`: Exact. Relire mentalement l'article 42 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.
- `audio`: true
- `difficulty`: 2


### EX-0207
- `article`: 42
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 42 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.
- `audio`: true
- `difficulty`: 1


### EX-0208
- `article`: 42
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 42 ?
- `correct_answer`: La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.
- `feedback_correct`: Exact. Relire mentalement l'article 42 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.
- `audio`: true
- `difficulty`: 2


### EX-0209
- `article`: 42
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension. » ?
- `correct_answer`: 42
- `feedback_correct`: Exact. Relire mentalement l'article 42 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.
- `audio`: true
- `difficulty`: 3


### EX-0210
- `article`: 42
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 42 : La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.
- `feedback_correct`: Exact. Relire mentalement l'article 42 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La Commission Administrative de Recours donne son avis notamment sur tableau annuel d'avancement de classe, licenciement pour insuffisance professionnelle et retenues sur pension.
- `audio`: true
- `difficulty`: 3


### EX-0211
- `article`: 43
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 43 ?
- `correct_answer`: Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.
- `feedback_correct`: Exact. Relire mentalement l'article 43 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.
- `audio`: true
- `difficulty`: 2


### EX-0212
- `article`: 43
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 43 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.
- `audio`: true
- `difficulty`: 1


### EX-0213
- `article`: 43
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 43 ?
- `correct_answer`: Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.
- `feedback_correct`: Exact. Relire mentalement l'article 43 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.
- `audio`: true
- `difficulty`: 2


### EX-0214
- `article`: 43
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie. » ?
- `correct_answer`: 43
- `feedback_correct`: Exact. Relire mentalement l'article 43 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.
- `audio`: true
- `difficulty`: 3


### EX-0215
- `article`: 43
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 43 : Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.
- `feedback_correct`: Exact. Relire mentalement l'article 43 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Santé et Sécurité au Travail donne son avis sur congés maladie, inaptitude physique/mentale, invalidité et reprise après congé maladie.
- `audio`: true
- `difficulty`: 3


### EX-0216
- `article`: 44
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 44 ?
- `correct_answer`: Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.
- `feedback_correct`: Exact. Relire mentalement l'article 44 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.
- `audio`: true
- `difficulty`: 2


### EX-0217
- `article`: 44
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 44 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.
- `audio`: true
- `difficulty`: 1


### EX-0218
- `article`: 44
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 44 ?
- `correct_answer`: Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.
- `feedback_correct`: Exact. Relire mentalement l'article 44 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.
- `audio`: true
- `difficulty`: 2


### EX-0219
- `article`: 44
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires. » ?
- `correct_answer`: 44
- `feedback_correct`: Exact. Relire mentalement l'article 44 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.
- `audio`: true
- `difficulty`: 3


### EX-0220
- `article`: 44
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 44 : Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.
- `feedback_correct`: Exact. Relire mentalement l'article 44 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le Conseil de Discipline donne son avis sur sanctions du second degré et demandes de retrait de sanctions disciplinaires.
- `audio`: true
- `difficulty`: 3


### EX-0221
- `article`: 45
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 45 ?
- `correct_answer`: Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.
- `feedback_correct`: Exact. Relire mentalement l'article 45 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.
- `audio`: true
- `difficulty`: 2


### EX-0222
- `article`: 45
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 45 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.
- `audio`: true
- `difficulty`: 1


### EX-0223
- `article`: 45
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 45 ?
- `correct_answer`: Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.
- `feedback_correct`: Exact. Relire mentalement l'article 45 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.
- `audio`: true
- `difficulty`: 2


### EX-0224
- `article`: 45
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs. » ?
- `correct_answer`: 45
- `feedback_correct`: Exact. Relire mentalement l'article 45 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.
- `audio`: true
- `difficulty`: 3


### EX-0225
- `article`: 45
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 45 : Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.
- `feedback_correct`: Exact. Relire mentalement l'article 45 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Des décrets en Conseil des Ministres fixent attributions, composition, organisation et fonctionnement des organismes consultatifs.
- `audio`: true
- `difficulty`: 3


### EX-0226
- `article`: 46
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 46 ?
- `correct_answer`: Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.
- `feedback_correct`: Exact. Relire mentalement l'article 46 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.
- `audio`: true
- `difficulty`: 2


### EX-0227
- `article`: 46
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 46 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.
- `audio`: true
- `difficulty`: 1


### EX-0228
- `article`: 46
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 46 ?
- `correct_answer`: Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.
- `feedback_correct`: Exact. Relire mentalement l'article 46 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.
- `audio`: true
- `difficulty`: 2


### EX-0229
- `article`: 46
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles. » ?
- `correct_answer`: 46
- `feedback_correct`: Exact. Relire mentalement l'article 46 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.
- `audio`: true
- `difficulty`: 3


### EX-0230
- `article`: 46
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 46 : Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.
- `feedback_correct`: Exact. Relire mentalement l'article 46 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires sont recrutés selon les besoins de l'État dans la limite des ressources disponibles.
- `audio`: true
- `difficulty`: 3


### EX-0231
- `article`: 47
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 47 ?
- `correct_answer`: Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.
- `feedback_correct`: Exact. Relire mentalement l'article 47 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.
- `audio`: true
- `difficulty`: 2


### EX-0232
- `article`: 47
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 47 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.
- `audio`: true
- `difficulty`: 1


### EX-0233
- `article`: 47
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 47 ?
- `correct_answer`: Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.
- `feedback_correct`: Exact. Relire mentalement l'article 47 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.
- `audio`: true
- `difficulty`: 2


### EX-0234
- `article`: 47
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite. » ?
- `correct_answer`: 47
- `feedback_correct`: Exact. Relire mentalement l'article 47 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.
- `audio`: true
- `difficulty`: 3


### EX-0235
- `article`: 47
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 47 : Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.
- `feedback_correct`: Exact. Relire mentalement l'article 47 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Recrutement par concours ou, à titre dérogatoire, par décret ; les concours établissent des listes par ordre de mérite.
- `audio`: true
- `difficulty`: 3


### EX-0236
- `article`: 48
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 48 ?
- `correct_answer`: Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 48 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.
- `audio`: true
- `difficulty`: 2


### EX-0237
- `article`: 48
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 48 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.
- `audio`: true
- `difficulty`: 1


### EX-0238
- `article`: 48
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 48 ?
- `correct_answer`: Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 48 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.
- `audio`: true
- `difficulty`: 2


### EX-0239
- `article`: 48
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire. » ?
- `correct_answer`: 48
- `feedback_correct`: Exact. Relire mentalement l'article 48 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.
- `audio`: true
- `difficulty`: 3


### EX-0240
- `article`: 48
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 48 : Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 48 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions de recrutement : nationalité ivoirienne, âge requis, droits civiques et bonne moralité, aptitudes physique et mentale, absence d'affection grave ou contagieuse selon la liste réglementaire ; dossier individuel par fonctionnaire.
- `audio`: true
- `difficulty`: 3


### EX-0241
- `article`: 49
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 49 ?
- `correct_answer`: Les modalités de chaque concours sont fixées par voie réglementaire.
- `feedback_correct`: Exact. Relire mentalement l'article 49 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités de chaque concours sont fixées par voie réglementaire.
- `audio`: true
- `difficulty`: 2


### EX-0242
- `article`: 49
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les modalités de chaque concours sont fixées par voie réglementaire.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 49 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités de chaque concours sont fixées par voie réglementaire.
- `audio`: true
- `difficulty`: 1


### EX-0243
- `article`: 49
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 49 ?
- `correct_answer`: Les modalités de chaque concours sont fixées par voie réglementaire.
- `feedback_correct`: Exact. Relire mentalement l'article 49 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités de chaque concours sont fixées par voie réglementaire.
- `audio`: true
- `difficulty`: 2


### EX-0244
- `article`: 49
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les modalités de chaque concours sont fixées par voie réglementaire. » ?
- `correct_answer`: 49
- `feedback_correct`: Exact. Relire mentalement l'article 49 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités de chaque concours sont fixées par voie réglementaire.
- `audio`: true
- `difficulty`: 3


### EX-0245
- `article`: 49
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les modalités de chaque concours sont fixées par voie réglementaire. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 49 : Les modalités de chaque concours sont fixées par voie réglementaire.
- `feedback_correct`: Exact. Relire mentalement l'article 49 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités de chaque concours sont fixées par voie réglementaire.
- `audio`: true
- `difficulty`: 3


### EX-0246
- `article`: 50
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 50 ?
- `correct_answer`: Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.
- `feedback_correct`: Exact. Relire mentalement l'article 50 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.
- `audio`: true
- `difficulty`: 2


### EX-0247
- `article`: 50
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 50 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.
- `audio`: true
- `difficulty`: 1


### EX-0248
- `article`: 50
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 50 ?
- `correct_answer`: Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.
- `feedback_correct`: Exact. Relire mentalement l'article 50 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.
- `audio`: true
- `difficulty`: 2


### EX-0249
- `article`: 50
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire. » ?
- `correct_answer`: 50
- `feedback_correct`: Exact. Relire mentalement l'article 50 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.
- `audio`: true
- `difficulty`: 3


### EX-0250
- `article`: 50
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 50 : Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.
- `feedback_correct`: Exact. Relire mentalement l'article 50 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les actes de nomination sont publiés au Journal Officiel de la République de Côte d'Ivoire.
- `audio`: true
- `difficulty`: 3


### EX-0251
- `article`: 51
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 51 ?
- `correct_answer`: La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.
- `feedback_correct`: Exact. Relire mentalement l'article 51 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.
- `audio`: true
- `difficulty`: 2


### EX-0252
- `article`: 51
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 51 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.
- `audio`: true
- `difficulty`: 1


### EX-0253
- `article`: 51
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 51 ?
- `correct_answer`: La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.
- `feedback_correct`: Exact. Relire mentalement l'article 51 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.
- `audio`: true
- `difficulty`: 2


### EX-0254
- `article`: 51
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public. » ?
- `correct_answer`: 51
- `feedback_correct`: Exact. Relire mentalement l'article 51 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.
- `audio`: true
- `difficulty`: 3


### EX-0255
- `article`: 51
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 51 : La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.
- `feedback_correct`: Exact. Relire mentalement l'article 51 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La titularisation confère définitivement un grade et ouvre le droit à poursuivre une carrière dans le service public.
- `audio`: true
- `difficulty`: 3


### EX-0256
- `article`: 52
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 52 ?
- `correct_answer`: Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.
- `feedback_correct`: Exact. Relire mentalement l'article 52 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.
- `audio`: true
- `difficulty`: 2


### EX-0257
- `article`: 52
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 52 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.
- `audio`: true
- `difficulty`: 1


### EX-0258
- `article`: 52
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 52 ?
- `correct_answer`: Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.
- `feedback_correct`: Exact. Relire mentalement l'article 52 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.
- `audio`: true
- `difficulty`: 2


### EX-0259
- `article`: 52
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement. » ?
- `correct_answer`: 52
- `feedback_correct`: Exact. Relire mentalement l'article 52 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.
- `audio`: true
- `difficulty`: 3


### EX-0260
- `article`: 52
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 52 : Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.
- `feedback_correct`: Exact. Relire mentalement l'article 52 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire nouvellement admis effectue un stage probatoire d'un an ; si non probant, une seconde année peut être autorisée ; après deux années non probantes, fin d'engagement.
- `audio`: true
- `difficulty`: 3


### EX-0261
- `article`: 53
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 53 ?
- `correct_answer`: Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.
- `feedback_correct`: Exact. Relire mentalement l'article 53 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.
- `audio`: true
- `difficulty`: 2


### EX-0262
- `article`: 53
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 53 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.
- `audio`: true
- `difficulty`: 1


### EX-0263
- `article`: 53
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 53 ?
- `correct_answer`: Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.
- `feedback_correct`: Exact. Relire mentalement l'article 53 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.
- `audio`: true
- `difficulty`: 2


### EX-0264
- `article`: 53
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux. » ?
- `correct_answer`: 53
- `feedback_correct`: Exact. Relire mentalement l'article 53 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.
- `audio`: true
- `difficulty`: 3


### EX-0265
- `article`: 53
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 53 : Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.
- `feedback_correct`: Exact. Relire mentalement l'article 53 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Positions du fonctionnaire : activité, détachement, disponibilité, sous les drapeaux.
- `audio`: true
- `difficulty`: 3


### EX-0266
- `article`: 54
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 54 ?
- `correct_answer`: Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.
- `feedback_correct`: Exact. Relire mentalement l'article 54 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.
- `audio`: true
- `difficulty`: 2


### EX-0267
- `article`: 54
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 54 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.
- `audio`: true
- `difficulty`: 1


### EX-0268
- `article`: 54
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 54 ?
- `correct_answer`: Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.
- `feedback_correct`: Exact. Relire mentalement l'article 54 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.
- `audio`: true
- `difficulty`: 2


### EX-0269
- `article`: 54
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées. » ?
- `correct_answer`: 54
- `feedback_correct`: Exact. Relire mentalement l'article 54 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.
- `audio`: true
- `difficulty`: 3


### EX-0270
- `article`: 54
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 54 : Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.
- `feedback_correct`: Exact. Relire mentalement l'article 54 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Activité : fonctionnaire régulièrement titularisé occupant effectivement un emploi ; sont aussi considérés en activité ceux en congé, stage, formation ou certaines absences autorisées.
- `audio`: true
- `difficulty`: 3


### EX-0271
- `article`: 55
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 55 ?
- `correct_answer`: Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.
- `feedback_correct`: Exact. Relire mentalement l'article 55 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.
- `audio`: true
- `difficulty`: 2


### EX-0272
- `article`: 55
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 55 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.
- `audio`: true
- `difficulty`: 1


### EX-0273
- `article`: 55
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 55 ?
- `correct_answer`: Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.
- `feedback_correct`: Exact. Relire mentalement l'article 55 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.
- `audio`: true
- `difficulty`: 2


### EX-0274
- `article`: 55
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable. » ?
- `correct_answer`: 55
- `feedback_correct`: Exact. Relire mentalement l'article 55 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.
- `audio`: true
- `difficulty`: 3


### EX-0275
- `article`: 55
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 55 : Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.
- `feedback_correct`: Exact. Relire mentalement l'article 55 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Détachement : interruption temporaire pour exercer certains emplois ou mandats ; maintien de droits à formation, avancement, promotion, retraite ; prononcé sur demande ou d'office et révocable.
- `audio`: true
- `difficulty`: 3


### EX-0276
- `article`: 56
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 56 ?
- `correct_answer`: Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.
- `feedback_correct`: Exact. Relire mentalement l'article 56 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.
- `audio`: true
- `difficulty`: 2


### EX-0277
- `article`: 56
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 56 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.
- `audio`: true
- `difficulty`: 1


### EX-0278
- `article`: 56
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 56 ?
- `correct_answer`: Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.
- `feedback_correct`: Exact. Relire mentalement l'article 56 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.
- `audio`: true
- `difficulty`: 2


### EX-0279
- `article`: 56
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre. » ?
- `correct_answer`: 56
- `feedback_correct`: Exact. Relire mentalement l'article 56 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.
- `audio`: true
- `difficulty`: 3


### EX-0280
- `article`: 56
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 56 : Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.
- `feedback_correct`: Exact. Relire mentalement l'article 56 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché remis à disposition avant terme sans faute et non réintégrable faute de poste vacant continue d'être rémunéré par l'organisme de détachement jusqu'à réintégration ; faute grave : signalement au Ministre.
- `audio`: true
- `difficulty`: 3


### EX-0281
- `article`: 57
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 57 ?
- `correct_answer`: Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.
- `feedback_correct`: Exact. Relire mentalement l'article 57 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.
- `audio`: true
- `difficulty`: 2


### EX-0282
- `article`: 57
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 57 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.
- `audio`: true
- `difficulty`: 1


### EX-0283
- `article`: 57
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 57 ?
- `correct_answer`: Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.
- `feedback_correct`: Exact. Relire mentalement l'article 57 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.
- `audio`: true
- `difficulty`: 2


### EX-0284
- `article`: 57
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus. » ?
- `correct_answer`: 57
- `feedback_correct`: Exact. Relire mentalement l'article 57 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.
- `audio`: true
- `difficulty`: 3


### EX-0285
- `article`: 57
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 57 : Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.
- `feedback_correct`: Exact. Relire mentalement l'article 57 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le détaché ne peut en principe s'affilier au régime de retraite de l'organisme d'accueil ni acquérir à ce titre pension/allocation, sous peine de suspension de la pension de l'État, sauf cas prévus.
- `audio`: true
- `difficulty`: 3


### EX-0286
- `article`: 58
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 58 ?
- `correct_answer`: L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.
- `feedback_correct`: Exact. Relire mentalement l'article 58 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.
- `audio`: true
- `difficulty`: 2


### EX-0287
- `article`: 58
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 58 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.
- `audio`: true
- `difficulty`: 1


### EX-0288
- `article`: 58
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 58 ?
- `correct_answer`: L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.
- `feedback_correct`: Exact. Relire mentalement l'article 58 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.
- `audio`: true
- `difficulty`: 2


### EX-0289
- `article`: 58
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations. » ?
- `correct_answer`: 58
- `feedback_correct`: Exact. Relire mentalement l'article 58 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.
- `audio`: true
- `difficulty`: 3


### EX-0290
- `article`: 58
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 58 : L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.
- `feedback_correct`: Exact. Relire mentalement l'article 58 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'organisme d'accueil verse à l'IPS compétente une contribution pour les droits à pension du fonctionnaire détaché, sous réserve de dérogations.
- `audio`: true
- `difficulty`: 3


### EX-0291
- `article`: 59
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 59 ?
- `correct_answer`: Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.
- `feedback_correct`: Exact. Relire mentalement l'article 59 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.
- `audio`: true
- `difficulty`: 2


### EX-0292
- `article`: 59
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 59 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.
- `audio`: true
- `difficulty`: 1


### EX-0293
- `article`: 59
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 59 ?
- `correct_answer`: Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.
- `feedback_correct`: Exact. Relire mentalement l'article 59 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.
- `audio`: true
- `difficulty`: 2


### EX-0294
- `article`: 59
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté. » ?
- `correct_answer`: 59
- `feedback_correct`: Exact. Relire mentalement l'article 59 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.
- `audio`: true
- `difficulty`: 3


### EX-0295
- `article`: 59
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 59 : Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.
- `feedback_correct`: Exact. Relire mentalement l'article 59 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire détaché est rémunéré par l'organisme d'accueil ; la rémunération doit être au moins équivalente à celle de l'administration d'origine et tenir compte, le cas échéant, de la revalorisation liée à l'ancienneté.
- `audio`: true
- `difficulty`: 3


### EX-0296
- `article`: 60
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 60 ?
- `correct_answer`: Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 60 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0297
- `article`: 60
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 60 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 1


### EX-0298
- `article`: 60
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 60 ?
- `correct_answer`: Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 60 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0299
- `article`: 60
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres. » ?
- `correct_answer`: 60
- `feedback_correct`: Exact. Relire mentalement l'article 60 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0300
- `article`: 60
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 60 : Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 60 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Conditions, durée du détachement et modalités de réintégration sont déterminées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0301
- `article`: 61
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 61 ?
- `correct_answer`: Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.
- `feedback_correct`: Exact. Relire mentalement l'article 61 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.
- `audio`: true
- `difficulty`: 2


### EX-0302
- `article`: 61
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 61 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.
- `audio`: true
- `difficulty`: 1


### EX-0303
- `article`: 61
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 61 ?
- `correct_answer`: Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.
- `feedback_correct`: Exact. Relire mentalement l'article 61 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.
- `audio`: true
- `difficulty`: 2


### EX-0304
- `article`: 61
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut. » ?
- `correct_answer`: 61
- `feedback_correct`: Exact. Relire mentalement l'article 61 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.
- `audio`: true
- `difficulty`: 3


### EX-0305
- `article`: 61
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 61 : Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.
- `feedback_correct`: Exact. Relire mentalement l'article 61 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : activité suspendue temporairement, à la demande, pour raisons personnelles prévues par le statut.
- `audio`: true
- `difficulty`: 3


### EX-0306
- `article`: 62
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 62 ?
- `correct_answer`: En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.
- `feedback_correct`: Exact. Relire mentalement l'article 62 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.
- `audio`: true
- `difficulty`: 2


### EX-0307
- `article`: 62
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 62 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.
- `audio`: true
- `difficulty`: 1


### EX-0308
- `article`: 62
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 62 ?
- `correct_answer`: En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.
- `feedback_correct`: Exact. Relire mentalement l'article 62 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.
- `audio`: true
- `difficulty`: 2


### EX-0309
- `article`: 62
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite. » ?
- `correct_answer`: 62
- `feedback_correct`: Exact. Relire mentalement l'article 62 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.
- `audio`: true
- `difficulty`: 3


### EX-0310
- `article`: 62
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 62 : En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.
- `feedback_correct`: Exact. Relire mentalement l'article 62 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité, aucune rémunération et cessation des droits à formation, avancement, promotion et retraite.
- `audio`: true
- `difficulty`: 3


### EX-0311
- `article`: 63
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 63 ?
- `correct_answer`: Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).
- `feedback_correct`: Exact. Relire mentalement l'article 63 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).
- `audio`: true
- `difficulty`: 2


### EX-0312
- `article`: 63
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 63 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).
- `audio`: true
- `difficulty`: 1


### EX-0313
- `article`: 63
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 63 ?
- `correct_answer`: Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).
- `feedback_correct`: Exact. Relire mentalement l'article 63 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).
- `audio`: true
- `difficulty`: 2


### EX-0314
- `article`: 63
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois). » ?
- `correct_answer`: 63
- `feedback_correct`: Exact. Relire mentalement l'article 63 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).
- `audio`: true
- `difficulty`: 3


### EX-0315
- `article`: 63
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois). Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 63 : Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).
- `feedback_correct`: Exact. Relire mentalement l'article 63 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Disponibilité : accident/maladie grave du conjoint ou enfant (max 1 an renouvelable après avis), suivre conjoint fonctionnaire à l'étranger (1 an renouvelable), suivre conjoint non fonctionnaire (1 an renouvelable une seule fois), convenances personnelles (1 an renouvelable une seule fois).
- `audio`: true
- `difficulty`: 3


### EX-0316
- `article`: 64
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 64 ?
- `correct_answer`: En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.
- `feedback_correct`: Exact. Relire mentalement l'article 64 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.
- `audio`: true
- `difficulty`: 2


### EX-0317
- `article`: 64
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 64 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.
- `audio`: true
- `difficulty`: 1


### EX-0318
- `article`: 64
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 64 ?
- `correct_answer`: En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.
- `feedback_correct`: Exact. Relire mentalement l'article 64 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.
- `audio`: true
- `difficulty`: 2


### EX-0319
- `article`: 64
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales. » ?
- `correct_answer`: 64
- `feedback_correct`: Exact. Relire mentalement l'article 64 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.
- `audio`: true
- `difficulty`: 3


### EX-0320
- `article`: 64
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 64 : En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.
- `feedback_correct`: Exact. Relire mentalement l'article 64 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En disponibilité pour accident ou maladie d'un enfant, le fonctionnaire perçoit la totalité des allocations familiales.
- `audio`: true
- `difficulty`: 3


### EX-0321
- `article`: 65
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 65 ?
- `correct_answer`: Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.
- `feedback_correct`: Exact. Relire mentalement l'article 65 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.
- `audio`: true
- `difficulty`: 2


### EX-0322
- `article`: 65
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 65 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.
- `audio`: true
- `difficulty`: 1


### EX-0323
- `article`: 65
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 65 ?
- `correct_answer`: Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.
- `feedback_correct`: Exact. Relire mentalement l'article 65 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.
- `audio`: true
- `difficulty`: 2


### EX-0324
- `article`: 65
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration. » ?
- `correct_answer`: 65
- `feedback_correct`: Exact. Relire mentalement l'article 65 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.
- `audio`: true
- `difficulty`: 3


### EX-0325
- `article`: 65
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 65 : Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.
- `feedback_correct`: Exact. Relire mentalement l'article 65 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Un décret en Conseil des Ministres détermine mise en disponibilité et réintégration.
- `audio`: true
- `difficulty`: 3


### EX-0326
- `article`: 66
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 66 ?
- `correct_answer`: Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.
- `feedback_correct`: Exact. Relire mentalement l'article 66 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.
- `audio`: true
- `difficulty`: 2


### EX-0327
- `article`: 66
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 66 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.
- `audio`: true
- `difficulty`: 1


### EX-0328
- `article`: 66
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 66 ?
- `correct_answer`: Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.
- `feedback_correct`: Exact. Relire mentalement l'article 66 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.
- `audio`: true
- `difficulty`: 2


### EX-0329
- `article`: 66
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire. » ?
- `correct_answer`: 66
- `feedback_correct`: Exact. Relire mentalement l'article 66 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.
- `audio`: true
- `difficulty`: 3


### EX-0330
- `article`: 66
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 66 : Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.
- `feedback_correct`: Exact. Relire mentalement l'article 66 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sous les drapeaux : incorporation pour service légal ; perte de rémunération d'activité et perception de la solde militaire.
- `audio`: true
- `difficulty`: 3


### EX-0331
- `article`: 67
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 67 ?
- `correct_answer`: Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.
- `feedback_correct`: Exact. Relire mentalement l'article 67 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.
- `audio`: true
- `difficulty`: 2


### EX-0332
- `article`: 67
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 67 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.
- `audio`: true
- `difficulty`: 1


### EX-0333
- `article`: 67
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 67 ?
- `correct_answer`: Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.
- `feedback_correct`: Exact. Relire mentalement l'article 67 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.
- `audio`: true
- `difficulty`: 2


### EX-0334
- `article`: 67
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité. » ?
- `correct_answer`: 67
- `feedback_correct`: Exact. Relire mentalement l'article 67 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.
- `audio`: true
- `difficulty`: 3


### EX-0335
- `article`: 67
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 67 : Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.
- `feedback_correct`: Exact. Relire mentalement l'article 67 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pendant une période d'instruction militaire, le fonctionnaire est en congé avec son traitement d'activité.
- `audio`: true
- `difficulty`: 3


### EX-0336
- `article`: 68
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 68 ?
- `correct_answer`: Le fonctionnaire est soumis à un système d'évaluation permanent.
- `feedback_correct`: Exact. Relire mentalement l'article 68 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est soumis à un système d'évaluation permanent.
- `audio`: true
- `difficulty`: 2


### EX-0337
- `article`: 68
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire est soumis à un système d'évaluation permanent.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 68 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est soumis à un système d'évaluation permanent.
- `audio`: true
- `difficulty`: 1


### EX-0338
- `article`: 68
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 68 ?
- `correct_answer`: Le fonctionnaire est soumis à un système d'évaluation permanent.
- `feedback_correct`: Exact. Relire mentalement l'article 68 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est soumis à un système d'évaluation permanent.
- `audio`: true
- `difficulty`: 2


### EX-0339
- `article`: 68
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire est soumis à un système d'évaluation permanent. » ?
- `correct_answer`: 68
- `feedback_correct`: Exact. Relire mentalement l'article 68 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est soumis à un système d'évaluation permanent.
- `audio`: true
- `difficulty`: 3


### EX-0340
- `article`: 68
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire est soumis à un système d'évaluation permanent. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 68 : Le fonctionnaire est soumis à un système d'évaluation permanent.
- `feedback_correct`: Exact. Relire mentalement l'article 68 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est soumis à un système d'évaluation permanent.
- `audio`: true
- `difficulty`: 3


### EX-0341
- `article`: 69
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 69 ?
- `correct_answer`: Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 69 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.
- `audio`: true
- `difficulty`: 2


### EX-0342
- `article`: 69
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 69 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.
- `audio`: true
- `difficulty`: 1


### EX-0343
- `article`: 69
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 69 ?
- `correct_answer`: Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 69 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.
- `audio`: true
- `difficulty`: 2


### EX-0344
- `article`: 69
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire. » ?
- `correct_answer`: 69
- `feedback_correct`: Exact. Relire mentalement l'article 69 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.
- `audio`: true
- `difficulty`: 3


### EX-0345
- `article`: 69
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 69 : Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.
- `feedback_correct`: Exact. Relire mentalement l'article 69 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Chaque année, le fonctionnaire en activité ou détaché reçoit une note chiffrée et une appréciation générale ; résultat notifié au fonctionnaire.
- `audio`: true
- `difficulty`: 3


### EX-0346
- `article`: 70
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 70 ?
- `correct_answer`: Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 70 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0347
- `article`: 70
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 70 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 1


### EX-0348
- `article`: 70
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 70 ?
- `correct_answer`: Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 70 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0349
- `article`: 70
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les modalités d'évaluation sont fixées par décret en Conseil des Ministres. » ?
- `correct_answer`: 70
- `feedback_correct`: Exact. Relire mentalement l'article 70 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0350
- `article`: 70
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les modalités d'évaluation sont fixées par décret en Conseil des Ministres. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 70 : Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 70 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités d'évaluation sont fixées par décret en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0351
- `article`: 71
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 71 ?
- `correct_answer`: Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.
- `feedback_correct`: Exact. Relire mentalement l'article 71 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.
- `audio`: true
- `difficulty`: 2


### EX-0352
- `article`: 71
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 71 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.
- `audio`: true
- `difficulty`: 1


### EX-0353
- `article`: 71
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 71 ?
- `correct_answer`: Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.
- `feedback_correct`: Exact. Relire mentalement l'article 71 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.
- `audio`: true
- `difficulty`: 2


### EX-0354
- `article`: 71
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel. » ?
- `correct_answer`: 71
- `feedback_correct`: Exact. Relire mentalement l'article 71 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.
- `audio`: true
- `difficulty`: 3


### EX-0355
- `article`: 71
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 71 : Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.
- `feedback_correct`: Exact. Relire mentalement l'article 71 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Avancement : échelon et classe ; l'échelon tient compte ancienneté et évaluation ; la classe profite aux inscrits au mérite sur tableau annuel.
- `audio`: true
- `difficulty`: 3


### EX-0356
- `article`: 72
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 72 ?
- `correct_answer`: Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.
- `feedback_correct`: Exact. Relire mentalement l'article 72 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.
- `audio`: true
- `difficulty`: 2


### EX-0357
- `article`: 72
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 72 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.
- `audio`: true
- `difficulty`: 1


### EX-0358
- `article`: 72
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 72 ?
- `correct_answer`: Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.
- `feedback_correct`: Exact. Relire mentalement l'article 72 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.
- `audio`: true
- `difficulty`: 2


### EX-0359
- `article`: 72
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement. » ?
- `correct_answer`: 72
- `feedback_correct`: Exact. Relire mentalement l'article 72 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.
- `audio`: true
- `difficulty`: 3


### EX-0360
- `article`: 72
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 72 : Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.
- `feedback_correct`: Exact. Relire mentalement l'article 72 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Durée moyenne d'avancement d'échelon peut être réduite pour mérite/distinction ou majorée après note insuffisante ; deux années consécutives de note sous le seuil empêchent l'avancement.
- `audio`: true
- `difficulty`: 3


### EX-0361
- `article`: 73
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 73 ?
- `correct_answer`: Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.
- `feedback_correct`: Exact. Relire mentalement l'article 73 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.
- `audio`: true
- `difficulty`: 2


### EX-0362
- `article`: 73
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 73 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.
- `audio`: true
- `difficulty`: 1


### EX-0363
- `article`: 73
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 73 ?
- `correct_answer`: Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.
- `feedback_correct`: Exact. Relire mentalement l'article 73 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.
- `audio`: true
- `difficulty`: 2


### EX-0364
- `article`: 73
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire. » ?
- `correct_answer`: 73
- `feedback_correct`: Exact. Relire mentalement l'article 73 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.
- `audio`: true
- `difficulty`: 3


### EX-0365
- `article`: 73
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 73 : Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.
- `feedback_correct`: Exact. Relire mentalement l'article 73 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pour certains détachements liés à mandat électif/syndical ou fonction ministérielle, l'avancement a lieu d'office sur base de l'ancienneté nécessaire.
- `audio`: true
- `difficulty`: 3


### EX-0366
- `article`: 74
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 74 ?
- `correct_answer`: Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.
- `feedback_correct`: Exact. Relire mentalement l'article 74 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.
- `audio`: true
- `difficulty`: 2


### EX-0367
- `article`: 74
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 74 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.
- `audio`: true
- `difficulty`: 1


### EX-0368
- `article`: 74
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 74 ?
- `correct_answer`: Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.
- `feedback_correct`: Exact. Relire mentalement l'article 74 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.
- `audio`: true
- `difficulty`: 2


### EX-0369
- `article`: 74
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel. » ?
- `correct_answer`: 74
- `feedback_correct`: Exact. Relire mentalement l'article 74 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.
- `audio`: true
- `difficulty`: 3


### EX-0370
- `article`: 74
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 74 : Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.
- `feedback_correct`: Exact. Relire mentalement l'article 74 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Formation continue : actions de formation/perfectionnement visant performances, efficacité et rendement professionnel.
- `audio`: true
- `difficulty`: 3


### EX-0371
- `article`: 75
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 75 ?
- `correct_answer`: La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.
- `feedback_correct`: Exact. Relire mentalement l'article 75 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.
- `audio`: true
- `difficulty`: 2


### EX-0372
- `article`: 75
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 75 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.
- `audio`: true
- `difficulty`: 1


### EX-0373
- `article`: 75
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 75 ?
- `correct_answer`: La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.
- `feedback_correct`: Exact. Relire mentalement l'article 75 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.
- `audio`: true
- `difficulty`: 2


### EX-0374
- `article`: 75
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger. » ?
- `correct_answer`: 75
- `feedback_correct`: Exact. Relire mentalement l'article 75 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.
- `audio`: true
- `difficulty`: 3


### EX-0375
- `article`: 75
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 75 : La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.
- `feedback_correct`: Exact. Relire mentalement l'article 75 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue comprend formations de promotion, stages et séminaires de renforcement des capacités en Côte d'Ivoire ou à l'étranger.
- `audio`: true
- `difficulty`: 3


### EX-0376
- `article`: 76
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 76 ?
- `correct_answer`: La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.
- `feedback_correct`: Exact. Relire mentalement l'article 76 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.
- `audio`: true
- `difficulty`: 2


### EX-0377
- `article`: 76
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 76 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.
- `audio`: true
- `difficulty`: 1


### EX-0378
- `article`: 76
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 76 ?
- `correct_answer`: La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.
- `feedback_correct`: Exact. Relire mentalement l'article 76 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.
- `audio`: true
- `difficulty`: 2


### EX-0379
- `article`: 76
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité. » ?
- `correct_answer`: 76
- `feedback_correct`: Exact. Relire mentalement l'article 76 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.
- `audio`: true
- `difficulty`: 3


### EX-0380
- `article`: 76
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 76 : La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.
- `feedback_correct`: Exact. Relire mentalement l'article 76 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La formation continue est un droit ; l'État doit l'assurer au fonctionnaire en activité.
- `audio`: true
- `difficulty`: 3


### EX-0381
- `article`: 77
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 77 ?
- `correct_answer`: Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.
- `feedback_correct`: Exact. Relire mentalement l'article 77 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.
- `audio`: true
- `difficulty`: 2


### EX-0382
- `article`: 77
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 77 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.
- `audio`: true
- `difficulty`: 1


### EX-0383
- `article`: 77
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 77 ?
- `correct_answer`: Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.
- `feedback_correct`: Exact. Relire mentalement l'article 77 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.
- `audio`: true
- `difficulty`: 2


### EX-0384
- `article`: 77
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret. » ?
- `correct_answer`: 77
- `feedback_correct`: Exact. Relire mentalement l'article 77 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.
- `audio`: true
- `difficulty`: 3


### EX-0385
- `article`: 77
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 77 : Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.
- `feedback_correct`: Exact. Relire mentalement l'article 77 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Promotion : passage au grade immédiatement supérieur, par concours internes ou exceptionnellement par décret.
- `audio`: true
- `difficulty`: 3


### EX-0386
- `article`: 78
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 78 ?
- `correct_answer`: Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.
- `feedback_correct`: Exact. Relire mentalement l'article 78 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.
- `audio`: true
- `difficulty`: 2


### EX-0387
- `article`: 78
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 78 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.
- `audio`: true
- `difficulty`: 1


### EX-0388
- `article`: 78
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 78 ?
- `correct_answer`: Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.
- `feedback_correct`: Exact. Relire mentalement l'article 78 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.
- `audio`: true
- `difficulty`: 2


### EX-0389
- `article`: 78
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle. » ?
- `correct_answer`: 78
- `feedback_correct`: Exact. Relire mentalement l'article 78 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.
- `audio`: true
- `difficulty`: 3


### EX-0390
- `article`: 78
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 78 : Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.
- `feedback_correct`: Exact. Relire mentalement l'article 78 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les modalités des concours de promotion prennent en compte l'ensemble des éléments d'appréciation de la valeur professionnelle.
- `audio`: true
- `difficulty`: 3


### EX-0391
- `article`: 79
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 79 ?
- `correct_answer`: L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.
- `feedback_correct`: Exact. Relire mentalement l'article 79 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.
- `audio`: true
- `difficulty`: 2


### EX-0392
- `article`: 79
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 79 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.
- `audio`: true
- `difficulty`: 1


### EX-0393
- `article`: 79
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 79 ?
- `correct_answer`: L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.
- `feedback_correct`: Exact. Relire mentalement l'article 79 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.
- `audio`: true
- `difficulty`: 2


### EX-0394
- `article`: 79
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion. » ?
- `correct_answer`: 79
- `feedback_correct`: Exact. Relire mentalement l'article 79 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.
- `audio`: true
- `difficulty`: 3


### EX-0395
- `article`: 79
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 79 : L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.
- `feedback_correct`: Exact. Relire mentalement l'article 79 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'acquisition en cours de carrière d'un diplôme, titre ou attestation de fin de formation peut, sous conditions réglementaires, donner droit à promotion.
- `audio`: true
- `difficulty`: 3


### EX-0396
- `article`: 80
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 80 ?
- `correct_answer`: Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.
- `feedback_correct`: Exact. Relire mentalement l'article 80 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.
- `audio`: true
- `difficulty`: 2


### EX-0397
- `article`: 80
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 80 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.
- `audio`: true
- `difficulty`: 1


### EX-0398
- `article`: 80
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 80 ?
- `correct_answer`: Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.
- `feedback_correct`: Exact. Relire mentalement l'article 80 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.
- `audio`: true
- `difficulty`: 2


### EX-0399
- `article`: 80
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume. » ?
- `correct_answer`: 80
- `feedback_correct`: Exact. Relire mentalement l'article 80 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.
- `audio`: true
- `difficulty`: 3


### EX-0400
- `article`: 80
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 80 : Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.
- `feedback_correct`: Exact. Relire mentalement l'article 80 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les fonctionnaires méritants, en activité ou retraite, peuvent recevoir une distinction honorifique ; exceptionnellement à titre posthume.
- `audio`: true
- `difficulty`: 3


### EX-0401
- `article`: 81
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 81 ?
- `correct_answer`: Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.
- `feedback_correct`: Exact. Relire mentalement l'article 81 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.
- `audio`: true
- `difficulty`: 2


### EX-0402
- `article`: 81
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 81 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.
- `audio`: true
- `difficulty`: 1


### EX-0403
- `article`: 81
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 81 ?
- `correct_answer`: Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.
- `feedback_correct`: Exact. Relire mentalement l'article 81 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.
- `audio`: true
- `difficulty`: 2


### EX-0404
- `article`: 81
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles. » ?
- `correct_answer`: 81
- `feedback_correct`: Exact. Relire mentalement l'article 81 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.
- `audio`: true
- `difficulty`: 3


### EX-0405
- `article`: 81
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 81 : Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.
- `feedback_correct`: Exact. Relire mentalement l'article 81 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Rémunération en contrepartie du service fait : traitement soumis à pension, indemnité de résidence, indemnité contributive au logement sous conditions, allocations familiales ; autres primes/indemnités/prestations possibles.
- `audio`: true
- `difficulty`: 3


### EX-0406
- `article`: 82
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 82 ?
- `correct_answer`: Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.
- `feedback_correct`: Exact. Relire mentalement l'article 82 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.
- `audio`: true
- `difficulty`: 2


### EX-0407
- `article`: 82
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 82 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.
- `audio`: true
- `difficulty`: 1


### EX-0408
- `article`: 82
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 82 ?
- `correct_answer`: Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.
- `feedback_correct`: Exact. Relire mentalement l'article 82 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.
- `audio`: true
- `difficulty`: 2


### EX-0409
- `article`: 82
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille. » ?
- `correct_answer`: 82
- `feedback_correct`: Exact. Relire mentalement l'article 82 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.
- `audio`: true
- `difficulty`: 3


### EX-0410
- `article`: 82
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 82 : Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.
- `feedback_correct`: Exact. Relire mentalement l'article 82 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le traitement soumis à retenue pour pension est l'élément principal de la rémunération ; il dépend de la valeur du point d'indice appliquée aux indices de la grille.
- `audio`: true
- `difficulty`: 3


### EX-0411
- `article`: 83
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 83 ?
- `correct_answer`: Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.
- `feedback_correct`: Exact. Relire mentalement l'article 83 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.
- `audio`: true
- `difficulty`: 2


### EX-0412
- `article`: 83
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 83 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.
- `audio`: true
- `difficulty`: 1


### EX-0413
- `article`: 83
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 83 ?
- `correct_answer`: Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.
- `feedback_correct`: Exact. Relire mentalement l'article 83 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.
- `audio`: true
- `difficulty`: 2


### EX-0414
- `article`: 83
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux. » ?
- `correct_answer`: 83
- `feedback_correct`: Exact. Relire mentalement l'article 83 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.
- `audio`: true
- `difficulty`: 3


### EX-0415
- `article`: 83
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 83 : Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.
- `feedback_correct`: Exact. Relire mentalement l'article 83 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes : suppléments pour prestations spéciales, manière exemplaire de servir ou sujétions ; indemnités : compensation de charges/aléas/frais ; prestations diverses : avantages pécuniaires, en nature ou sociaux.
- `audio`: true
- `difficulty`: 3


### EX-0416
- `article`: 84
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 84 ?
- `correct_answer`: L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 84 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.
- `audio`: true
- `difficulty`: 2


### EX-0417
- `article`: 84
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 84 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.
- `audio`: true
- `difficulty`: 1


### EX-0418
- `article`: 84
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 84 ?
- `correct_answer`: L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 84 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.
- `audio`: true
- `difficulty`: 2


### EX-0419
- `article`: 84
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension. » ?
- `correct_answer`: 84
- `feedback_correct`: Exact. Relire mentalement l'article 84 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.
- `audio`: true
- `difficulty`: 3


### EX-0420
- `article`: 84
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 84 : L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 84 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité de résidence est accessoire, non soumise à retenue pour pension et proportionnelle au traitement soumis à pension.
- `audio`: true
- `difficulty`: 3


### EX-0421
- `article`: 85
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 85 ?
- `correct_answer`: L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.
- `feedback_correct`: Exact. Relire mentalement l'article 85 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.
- `audio`: true
- `difficulty`: 2


### EX-0422
- `article`: 85
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 85 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.
- `audio`: true
- `difficulty`: 1


### EX-0423
- `article`: 85
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 85 ?
- `correct_answer`: L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.
- `feedback_correct`: Exact. Relire mentalement l'article 85 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.
- `audio`: true
- `difficulty`: 2


### EX-0424
- `article`: 85
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues. » ?
- `correct_answer`: 85
- `feedback_correct`: Exact. Relire mentalement l'article 85 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.
- `audio`: true
- `difficulty`: 3


### EX-0425
- `article`: 85
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 85 : L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.
- `feedback_correct`: Exact. Relire mentalement l'article 85 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : L'indemnité contributive au logement est accessoire, non soumise à retenue pour pension, destinée à aider le fonctionnaire à se loger selon les conditions prévues.
- `audio`: true
- `difficulty`: 3


### EX-0426
- `article`: 86
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 86 ?
- `correct_answer`: Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.
- `feedback_correct`: Exact. Relire mentalement l'article 86 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.
- `audio`: true
- `difficulty`: 2


### EX-0427
- `article`: 86
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 86 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.
- `audio`: true
- `difficulty`: 1


### EX-0428
- `article`: 86
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 86 ?
- `correct_answer`: Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.
- `feedback_correct`: Exact. Relire mentalement l'article 86 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.
- `audio`: true
- `difficulty`: 2


### EX-0429
- `article`: 86
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six. » ?
- `correct_answer`: 86
- `feedback_correct`: Exact. Relire mentalement l'article 86 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.
- `audio`: true
- `difficulty`: 3


### EX-0430
- `article`: 86
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 86 : Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.
- `feedback_correct`: Exact. Relire mentalement l'article 86 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Allocations familiales selon le nombre d'enfants à charge ; taux non hiérarchisés ; nombre d'enfants ouvrant droit limité à six.
- `audio`: true
- `difficulty`: 3


### EX-0431
- `article`: 87
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 87 ?
- `correct_answer`: Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 87 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.
- `audio`: true
- `difficulty`: 2


### EX-0432
- `article`: 87
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 87 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.
- `audio`: true
- `difficulty`: 1


### EX-0433
- `article`: 87
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 87 ?
- `correct_answer`: Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 87 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.
- `audio`: true
- `difficulty`: 2


### EX-0434
- `article`: 87
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires. » ?
- `correct_answer`: 87
- `feedback_correct`: Exact. Relire mentalement l'article 87 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.
- `audio`: true
- `difficulty`: 3


### EX-0435
- `article`: 87
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 87 : Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 87 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Primes, indemnités et allocations familiales ne sont pas soumises à retenue pour pension ; les primes peuvent toutefois subir certaines retenues réglementaires.
- `audio`: true
- `difficulty`: 3


### EX-0436
- `article`: 88
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 88 ?
- `correct_answer`: Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 88 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.
- `audio`: true
- `difficulty`: 2


### EX-0437
- `article`: 88
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 88 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.
- `audio`: true
- `difficulty`: 1


### EX-0438
- `article`: 88
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 88 ?
- `correct_answer`: Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 88 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.
- `audio`: true
- `difficulty`: 2


### EX-0439
- `article`: 88
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires. » ?
- `correct_answer`: 88
- `feedback_correct`: Exact. Relire mentalement l'article 88 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.
- `audio`: true
- `difficulty`: 3


### EX-0440
- `article`: 88
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 88 : Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 88 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Les retenues sur rémunération sont encadrées ; hors prélèvements obligatoires, elles passent notamment par saisie ou cession volontaire et respectent les quotités réglementaires.
- `audio`: true
- `difficulty`: 3


### EX-0441
- `article`: 89
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 89 ?
- `correct_answer`: Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.
- `feedback_correct`: Exact. Relire mentalement l'article 89 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.
- `audio`: true
- `difficulty`: 2


### EX-0442
- `article`: 89
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 89 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.
- `audio`: true
- `difficulty`: 1


### EX-0443
- `article`: 89
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 89 ?
- `correct_answer`: Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.
- `feedback_correct`: Exact. Relire mentalement l'article 89 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.
- `audio`: true
- `difficulty`: 2


### EX-0444
- `article`: 89
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service. » ?
- `correct_answer`: 89
- `feedback_correct`: Exact. Relire mentalement l'article 89 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.
- `audio`: true
- `difficulty`: 3


### EX-0445
- `article`: 89
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 89 : Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.
- `feedback_correct`: Exact. Relire mentalement l'article 89 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé annuel : 30 jours calendaires avec rémunération, en tenant compte des nécessités du service.
- `audio`: true
- `difficulty`: 3


### EX-0446
- `article`: 90
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 90 ?
- `correct_answer`: Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.
- `feedback_correct`: Exact. Relire mentalement l'article 90 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.
- `audio`: true
- `difficulty`: 2


### EX-0447
- `article`: 90
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 90 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.
- `audio`: true
- `difficulty`: 1


### EX-0448
- `article`: 90
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 90 ?
- `correct_answer`: Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.
- `feedback_correct`: Exact. Relire mentalement l'article 90 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.
- `audio`: true
- `difficulty`: 2


### EX-0449
- `article`: 90
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération. » ?
- `correct_answer`: 90
- `feedback_correct`: Exact. Relire mentalement l'article 90 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.
- `audio`: true
- `difficulty`: 3


### EX-0450
- `article`: 90
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 90 : Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.
- `feedback_correct`: Exact. Relire mentalement l'article 90 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maladie de courte durée : maximum 6 mois sur 12 mois consécutifs, avec intégralité de rémunération.
- `audio`: true
- `difficulty`: 3


### EX-0451
- `article`: 91
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 91 ?
- `correct_answer`: Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.
- `feedback_correct`: Exact. Relire mentalement l'article 91 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.
- `audio`: true
- `difficulty`: 2


### EX-0452
- `article`: 91
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 91 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.
- `audio`: true
- `difficulty`: 1


### EX-0453
- `article`: 91
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 91 ?
- `correct_answer`: Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.
- `feedback_correct`: Exact. Relire mentalement l'article 91 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.
- `audio`: true
- `difficulty`: 2


### EX-0454
- `article`: 91
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis. » ?
- `correct_answer`: 91
- `feedback_correct`: Exact. Relire mentalement l'article 91 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.
- `audio`: true
- `difficulty`: 3


### EX-0455
- `article`: 91
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 91 : Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.
- `feedback_correct`: Exact. Relire mentalement l'article 91 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Si les soins doivent se poursuivre après 6 mois, congé maladie longue durée jusqu'à 36 mois incluant les 6 premiers ; rémunération intégrale pendant les 12 premiers mois puis réduite de moitié ; à 36 mois, examen de reconversion/retraite selon avis.
- `audio`: true
- `difficulty`: 3


### EX-0456
- `article`: 92
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 92 ?
- `correct_answer`: Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.
- `feedback_correct`: Exact. Relire mentalement l'article 92 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.
- `audio`: true
- `difficulty`: 2


### EX-0457
- `article`: 92
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 92 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.
- `audio`: true
- `difficulty`: 1


### EX-0458
- `article`: 92
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 92 ?
- `correct_answer`: Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.
- `feedback_correct`: Exact. Relire mentalement l'article 92 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.
- `audio`: true
- `difficulty`: 2


### EX-0459
- `article`: 92
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis. » ?
- `correct_answer`: 92
- `feedback_correct`: Exact. Relire mentalement l'article 92 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.
- `audio`: true
- `difficulty`: 3


### EX-0460
- `article`: 92
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 92 : Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.
- `feedback_correct`: Exact. Relire mentalement l'article 92 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Accident ou maladie professionnelle : congé exceptionnel jusqu'à 60 mois avec intégralité de rémunération et remboursement des honoraires/frais médicaux ; ensuite retraite si impossibilité de reprise selon avis.
- `audio`: true
- `difficulty`: 3


### EX-0461
- `article`: 93
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 93 ?
- `correct_answer`: Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 93 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.
- `audio`: true
- `difficulty`: 2


### EX-0462
- `article`: 93
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 93 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.
- `audio`: true
- `difficulty`: 1


### EX-0463
- `article`: 93
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 93 ?
- `correct_answer`: Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 93 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.
- `audio`: true
- `difficulty`: 2


### EX-0464
- `article`: 93
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires. » ?
- `correct_answer`: 93
- `feedback_correct`: Exact. Relire mentalement l'article 93 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.
- `audio`: true
- `difficulty`: 3


### EX-0465
- `article`: 93
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 93 : Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 93 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Invalidité due à accident du travail ou maladie professionnelle : allocation temporaire d'invalidité cumulable avec la rémunération, selon conditions réglementaires.
- `audio`: true
- `difficulty`: 3


### EX-0466
- `article`: 94
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 94 ?
- `correct_answer`: La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.
- `feedback_correct`: Exact. Relire mentalement l'article 94 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.
- `audio`: true
- `difficulty`: 2


### EX-0467
- `article`: 94
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 94 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.
- `audio`: true
- `difficulty`: 1


### EX-0468
- `article`: 94
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 94 ?
- `correct_answer`: La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.
- `feedback_correct`: Exact. Relire mentalement l'article 94 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.
- `audio`: true
- `difficulty`: 2


### EX-0469
- `article`: 94
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents. » ?
- `correct_answer`: 94
- `feedback_correct`: Exact. Relire mentalement l'article 94 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.
- `audio`: true
- `difficulty`: 3


### EX-0470
- `article`: 94
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 94 : La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.
- `feedback_correct`: Exact. Relire mentalement l'article 94 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La liste des maladies professionnelles indemnisables est fixée conjointement par voie réglementaire par les ministres compétents.
- `audio`: true
- `difficulty`: 3


### EX-0471
- `article`: 95
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 95 ?
- `correct_answer`: Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.
- `feedback_correct`: Exact. Relire mentalement l'article 95 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.
- `audio`: true
- `difficulty`: 2


### EX-0472
- `article`: 95
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 95 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.
- `audio`: true
- `difficulty`: 1


### EX-0473
- `article`: 95
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 95 ?
- `correct_answer`: Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.
- `feedback_correct`: Exact. Relire mentalement l'article 95 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.
- `audio`: true
- `difficulty`: 2


### EX-0474
- `article`: 95
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret. » ?
- `correct_answer`: 95
- `feedback_correct`: Exact. Relire mentalement l'article 95 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.
- `audio`: true
- `difficulty`: 3


### EX-0475
- `article`: 95
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 95 : Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.
- `feedback_correct`: Exact. Relire mentalement l'article 95 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Congé maternité et repos d'allaitement rémunérés pour la femme fonctionnaire ; congé paternité à l'occasion de la naissance ; modalités fixées par décret.
- `audio`: true
- `difficulty`: 3


### EX-0476
- `article`: 96
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 96 ?
- `correct_answer`: Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.
- `feedback_correct`: Exact. Relire mentalement l'article 96 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.
- `audio`: true
- `difficulty`: 2


### EX-0477
- `article`: 96
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 96 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.
- `audio`: true
- `difficulty`: 1


### EX-0478
- `article`: 96
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 96 ?
- `correct_answer`: Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.
- `feedback_correct`: Exact. Relire mentalement l'article 96 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.
- `audio`: true
- `difficulty`: 2


### EX-0479
- `article`: 96
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret. » ?
- `correct_answer`: 96
- `feedback_correct`: Exact. Relire mentalement l'article 96 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.
- `audio`: true
- `difficulty`: 3


### EX-0480
- `article`: 96
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 96 : Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.
- `feedback_correct`: Exact. Relire mentalement l'article 96 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire a droit à un congé parental pour s'occuper de son enfant ; régime fixé par décret.
- `audio`: true
- `difficulty`: 3


### EX-0481
- `article`: 97
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 97 ?
- `correct_answer`: Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.
- `feedback_correct`: Exact. Relire mentalement l'article 97 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.
- `audio`: true
- `difficulty`: 2


### EX-0482
- `article`: 97
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 97 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.
- `audio`: true
- `difficulty`: 1


### EX-0483
- `article`: 97
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 97 ?
- `correct_answer`: Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.
- `feedback_correct`: Exact. Relire mentalement l'article 97 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.
- `audio`: true
- `difficulty`: 2


### EX-0484
- `article`: 97
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret. » ?
- `correct_answer`: 97
- `feedback_correct`: Exact. Relire mentalement l'article 97 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.
- `audio`: true
- `difficulty`: 3


### EX-0485
- `article`: 97
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 97 : Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.
- `feedback_correct`: Exact. Relire mentalement l'article 97 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire en activité a droit à des autorisations et permissions spéciales d'absence pour événements familiaux selon décret.
- `audio`: true
- `difficulty`: 3


### EX-0486
- `article`: 98
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 98 ?
- `correct_answer`: Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 98 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.
- `audio`: true
- `difficulty`: 2


### EX-0487
- `article`: 98
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 98 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.
- `audio`: true
- `difficulty`: 1


### EX-0488
- `article`: 98
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 98 ?
- `correct_answer`: Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 98 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.
- `audio`: true
- `difficulty`: 2


### EX-0489
- `article`: 98
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension. » ?
- `correct_answer`: 98
- `feedback_correct`: Exact. Relire mentalement l'article 98 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.
- `audio`: true
- `difficulty`: 3


### EX-0490
- `article`: 98
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 98 : Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 98 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire est affilié d'office à l'IPS-CGRAE et supporte les retenues prévues pour constituer ses droits à pension.
- `audio`: true
- `difficulty`: 3


### EX-0491
- `article`: 99
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 99 ?
- `correct_answer`: Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.
- `feedback_correct`: Exact. Relire mentalement l'article 99 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.
- `audio`: true
- `difficulty`: 2


### EX-0492
- `article`: 99
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 99 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.
- `audio`: true
- `difficulty`: 1


### EX-0493
- `article`: 99
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 99 ?
- `correct_answer`: Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.
- `feedback_correct`: Exact. Relire mentalement l'article 99 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.
- `audio`: true
- `difficulty`: 2


### EX-0494
- `article`: 99
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive. » ?
- `correct_answer`: 99
- `feedback_correct`: Exact. Relire mentalement l'article 99 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.
- `audio`: true
- `difficulty`: 3


### EX-0495
- `article`: 99
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 99 : Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.
- `feedback_correct`: Exact. Relire mentalement l'article 99 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Toute faute commise dans l'exercice expose à sanction disciplinaire ; sanction possible indépendamment des poursuites pénales ; pour faute grave de droit commun hors fonctions, situation administrative réglée après décision définitive.
- `audio`: true
- `difficulty`: 3


### EX-0496
- `article`: 100
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 100 ?
- `correct_answer`: Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 100 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.
- `audio`: true
- `difficulty`: 2


### EX-0497
- `article`: 100
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 100 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.
- `audio`: true
- `difficulty`: 1


### EX-0498
- `article`: 100
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 100 ?
- `correct_answer`: Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 100 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.
- `audio`: true
- `difficulty`: 2


### EX-0499
- `article`: 100
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension. » ?
- `correct_answer`: 100
- `feedback_correct`: Exact. Relire mentalement l'article 100 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.
- `audio`: true
- `difficulty`: 3


### EX-0500
- `article`: 100
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 100 : Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 100 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sanctions de 1er degré : avertissement, blâme, déplacement d'office, radiation du tableau d'avancement pour la période de référence, réduction de traitement max 25 % pendant max 30 jours. 2nd degré : réduction de 50 % max 3 mois, exclusion temporaire max 6 mois, abaissement d'échelon, abaissement de classe, rétrogradation, révocation avec ou sans suspension des droits à pension.
- `audio`: true
- `difficulty`: 3


### EX-0501
- `article`: 101
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 101 ?
- `correct_answer`: Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.
- `feedback_correct`: Exact. Relire mentalement l'article 101 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.
- `audio`: true
- `difficulty`: 2


### EX-0502
- `article`: 101
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 101 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.
- `audio`: true
- `difficulty`: 1


### EX-0503
- `article`: 101
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 101 ?
- `correct_answer`: Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.
- `feedback_correct`: Exact. Relire mentalement l'article 101 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.
- `audio`: true
- `difficulty`: 2


### EX-0504
- `article`: 101
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes. » ?
- `correct_answer`: 101
- `feedback_correct`: Exact. Relire mentalement l'article 101 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.
- `audio`: true
- `difficulty`: 3


### EX-0505
- `article`: 101
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 101 : Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.
- `feedback_correct`: Exact. Relire mentalement l'article 101 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pouvoir disciplinaire du 1er degré : autorités prévues (Président d'Institution, Ministre technique, Préfet, Directeur d'EP). Second degré : Ministre chargé de la Fonction Publique sur saisine et après consultation ; révocation prononcée par ce Ministre, qui a une compétence universelle sous réserve des textes.
- `audio`: true
- `difficulty`: 3


### EX-0506
- `article`: 102
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 102 ?
- `correct_answer`: En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.
- `feedback_correct`: Exact. Relire mentalement l'article 102 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.
- `audio`: true
- `difficulty`: 2


### EX-0507
- `article`: 102
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 102 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.
- `audio`: true
- `difficulty`: 1


### EX-0508
- `article`: 102
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 102 ?
- `correct_answer`: En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.
- `feedback_correct`: Exact. Relire mentalement l'article 102 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.
- `audio`: true
- `difficulty`: 2


### EX-0509
- `article`: 102
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue. » ?
- `correct_answer`: 102
- `feedback_correct`: Exact. Relire mentalement l'article 102 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.
- `audio`: true
- `difficulty`: 3


### EX-0510
- `article`: 102
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 102 : En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.
- `feedback_correct`: Exact. Relire mentalement l'article 102 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : En cas de faute grave, suspension immédiate possible ; aucune rémunération pendant suspension mais maintien des prestations familiales ; situation à régler sous 3 mois, sinon reprise intégrale de rémunération sauf poursuites pénales ; décision transmise au Ministre sous 30 jours sous peine de nullité ; aucune rémunération n'est versée au titre de la période de suspension quelle que soit l'issue.
- `audio`: true
- `difficulty`: 3


### EX-0511
- `article`: 103
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 103 ?
- `correct_answer`: Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.
- `feedback_correct`: Exact. Relire mentalement l'article 103 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.
- `audio`: true
- `difficulty`: 2


### EX-0512
- `article`: 103
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 103 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.
- `audio`: true
- `difficulty`: 1


### EX-0513
- `article`: 103
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 103 ?
- `correct_answer`: Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.
- `feedback_correct`: Exact. Relire mentalement l'article 103 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.
- `audio`: true
- `difficulty`: 2


### EX-0514
- `article`: 103
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service. » ?
- `correct_answer`: 103
- `feedback_correct`: Exact. Relire mentalement l'article 103 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.
- `audio`: true
- `difficulty`: 3


### EX-0515
- `article`: 103
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 103 : Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.
- `feedback_correct`: Exact. Relire mentalement l'article 103 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Faute grave : faits directement et personnellement commis, violation d'obligation statutaire ou règles de discipline/éthique/déontologie, et gravité empêchant le maintien dans le service.
- `audio`: true
- `difficulty`: 3


### EX-0516
- `article`: 104
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 104 ?
- `correct_answer`: La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 104 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0517
- `article`: 104
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 104 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 1


### EX-0518
- `article`: 104
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 104 ?
- `correct_answer`: La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 104 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 2


### EX-0519
- `article`: 104
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres. » ?
- `correct_answer`: 104
- `feedback_correct`: Exact. Relire mentalement l'article 104 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0520
- `article`: 104
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 104 : La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.
- `feedback_correct`: Exact. Relire mentalement l'article 104 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La procédure disciplinaire est déterminée par décret pris en Conseil des Ministres.
- `audio`: true
- `difficulty`: 3


### EX-0521
- `article`: 105
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 105 ?
- `correct_answer`: Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.
- `feedback_correct`: Exact. Relire mentalement l'article 105 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.
- `audio`: true
- `difficulty`: 2


### EX-0522
- `article`: 105
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 105 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.
- `audio`: true
- `difficulty`: 1


### EX-0523
- `article`: 105
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 105 ?
- `correct_answer`: Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.
- `feedback_correct`: Exact. Relire mentalement l'article 105 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.
- `audio`: true
- `difficulty`: 2


### EX-0524
- `article`: 105
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès. » ?
- `correct_answer`: 105
- `feedback_correct`: Exact. Relire mentalement l'article 105 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.
- `audio`: true
- `difficulty`: 3


### EX-0525
- `article`: 105
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 105 : Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.
- `feedback_correct`: Exact. Relire mentalement l'article 105 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Cessation définitive avec perte de qualité : démission, licenciement, révocation, admission à la retraite, décès.
- `audio`: true
- `difficulty`: 3


### EX-0526
- `article`: 106
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 106 ?
- `correct_answer`: Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.
- `feedback_correct`: Exact. Relire mentalement l'article 106 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.
- `audio`: true
- `difficulty`: 2


### EX-0527
- `article`: 106
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 106 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.
- `audio`: true
- `difficulty`: 1


### EX-0528
- `article`: 106
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 106 ?
- `correct_answer`: Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.
- `feedback_correct`: Exact. Relire mentalement l'article 106 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.
- `audio`: true
- `difficulty`: 2


### EX-0529
- `article`: 106
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté. » ?
- `correct_answer`: 106
- `feedback_correct`: Exact. Relire mentalement l'article 106 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.
- `audio`: true
- `difficulty`: 3


### EX-0530
- `article`: 106
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 106 : Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.
- `feedback_correct`: Exact. Relire mentalement l'article 106 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Démission : volonté non équivoque de quitter définitivement ; devient irrévocable après acceptation régulière ; remboursement des cotisations pension ; impossibilité d'être recruté à nouveau pour l'emploi quitté.
- `audio`: true
- `difficulty`: 3


### EX-0531
- `article`: 107
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 107 ?
- `correct_answer`: Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.
- `feedback_correct`: Exact. Relire mentalement l'article 107 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.
- `audio`: true
- `difficulty`: 2


### EX-0532
- `article`: 107
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 107 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.
- `audio`: true
- `difficulty`: 1


### EX-0533
- `article`: 107
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 107 ?
- `correct_answer`: Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.
- `feedback_correct`: Exact. Relire mentalement l'article 107 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.
- `audio`: true
- `difficulty`: 2


### EX-0534
- `article`: 107
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret. » ?
- `correct_answer`: 107
- `feedback_correct`: Exact. Relire mentalement l'article 107 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.
- `audio`: true
- `difficulty`: 3


### EX-0535
- `article`: 107
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 107 : Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.
- `feedback_correct`: Exact. Relire mentalement l'article 107 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Licenciement non disciplinaire par arrêté du Ministre chargé de la Fonction Publique pour inaptitude physique/mentale, insuffisance professionnelle notoire ou perte de nationalité ; indemnité possible pour les deux premiers cas selon décret.
- `audio`: true
- `difficulty`: 3


### EX-0536
- `article`: 108
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 108 ?
- `correct_answer`: Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 108 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.
- `audio`: true
- `difficulty`: 2


### EX-0537
- `article`: 108
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 108 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.
- `audio`: true
- `difficulty`: 1


### EX-0538
- `article`: 108
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 108 ?
- `correct_answer`: Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 108 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.
- `audio`: true
- `difficulty`: 2


### EX-0539
- `article`: 108
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension. » ?
- `correct_answer`: 108
- `feedback_correct`: Exact. Relire mentalement l'article 108 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.
- `audio`: true
- `difficulty`: 3


### EX-0540
- `article`: 108
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 108 : Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.
- `feedback_correct`: Exact. Relire mentalement l'article 108 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire licencié dans les cas prévus est admis à la retraite s'il remplit les conditions d'ouverture du droit à pension.
- `audio`: true
- `difficulty`: 3


### EX-0541
- `article`: 109
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 109 ?
- `correct_answer`: Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.
- `feedback_correct`: Exact. Relire mentalement l'article 109 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.
- `audio`: true
- `difficulty`: 2


### EX-0542
- `article`: 109
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 109 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.
- `audio`: true
- `difficulty`: 1


### EX-0543
- `article`: 109
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 109 ?
- `correct_answer`: Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.
- `feedback_correct`: Exact. Relire mentalement l'article 109 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.
- `audio`: true
- `difficulty`: 2


### EX-0544
- `article`: 109
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres. » ?
- `correct_answer`: 109
- `feedback_correct`: Exact. Relire mentalement l'article 109 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.
- `audio`: true
- `difficulty`: 3


### EX-0545
- `article`: 109
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 109 : Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.
- `feedback_correct`: Exact. Relire mentalement l'article 109 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Hors licenciement de l'article 107, la cessation avec perte de qualité ne peut intervenir que selon des dispositions législatives spécifiques de dégagement des cadres.
- `audio`: true
- `difficulty`: 3


### EX-0546
- `article`: 110
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 110 ?
- `correct_answer`: Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.
- `feedback_correct`: Exact. Relire mentalement l'article 110 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 2


### EX-0547
- `article`: 110
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 110 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 1


### EX-0548
- `article`: 110
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 110 ?
- `correct_answer`: Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.
- `feedback_correct`: Exact. Relire mentalement l'article 110 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 2


### EX-0549
- `article`: 110
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois. » ?
- `correct_answer`: 110
- `feedback_correct`: Exact. Relire mentalement l'article 110 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 3


### EX-0550
- `article`: 110
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 110 : Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.
- `feedback_correct`: Exact. Relire mentalement l'article 110 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Pas de maintien au-delà de la limite d'âge applicable ; dérogation pour nécessité de service par décret, jusqu'à 2 ans, renouvelable une seule fois.
- `audio`: true
- `difficulty`: 3


### EX-0551
- `article`: 111
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 111 ?
- `correct_answer`: Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.
- `feedback_correct`: Exact. Relire mentalement l'article 111 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.
- `audio`: true
- `difficulty`: 2


### EX-0552
- `article`: 111
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 111 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.
- `audio`: true
- `difficulty`: 1


### EX-0553
- `article`: 111
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 111 ?
- `correct_answer`: Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.
- `feedback_correct`: Exact. Relire mentalement l'article 111 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.
- `audio`: true
- `difficulty`: 2


### EX-0554
- `article`: 111
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité. » ?
- `correct_answer`: 111
- `feedback_correct`: Exact. Relire mentalement l'article 111 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.
- `audio`: true
- `difficulty`: 3


### EX-0555
- `article`: 111
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 111 : Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.
- `feedback_correct`: Exact. Relire mentalement l'article 111 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Admission d'office à la retraite : atteinte de la limite d'âge applicable ou invalidité.
- `audio`: true
- `difficulty`: 3


### EX-0556
- `article`: 112
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 112 ?
- `correct_answer`: Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 112 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.
- `audio`: true
- `difficulty`: 2


### EX-0557
- `article`: 112
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 112 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.
- `audio`: true
- `difficulty`: 1


### EX-0558
- `article`: 112
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 112 ?
- `correct_answer`: Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 112 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.
- `audio`: true
- `difficulty`: 2


### EX-0559
- `article`: 112
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires. » ?
- `correct_answer`: 112
- `feedback_correct`: Exact. Relire mentalement l'article 112 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.
- `audio`: true
- `difficulty`: 3


### EX-0560
- `article`: 112
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 112 : Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.
- `feedback_correct`: Exact. Relire mentalement l'article 112 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Le fonctionnaire peut demander une retraite par anticipation selon les conditions légales et réglementaires.
- `audio`: true
- `difficulty`: 3


### EX-0561
- `article`: 113
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 113 ?
- `correct_answer`: À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.
- `feedback_correct`: Exact. Relire mentalement l'article 113 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.
- `audio`: true
- `difficulty`: 2


### EX-0562
- `article`: 113
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 113 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.
- `audio`: true
- `difficulty`: 1


### EX-0563
- `article`: 113
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 113 ?
- `correct_answer`: À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.
- `feedback_correct`: Exact. Relire mentalement l'article 113 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.
- `audio`: true
- `difficulty`: 2


### EX-0564
- `article`: 113
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur. » ?
- `correct_answer`: 113
- `feedback_correct`: Exact. Relire mentalement l'article 113 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.
- `audio`: true
- `difficulty`: 3


### EX-0565
- `article`: 113
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 113 : À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.
- `feedback_correct`: Exact. Relire mentalement l'article 113 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : À la retraite, le fonctionnaire a droit à une pension selon les lois et règlements en vigueur.
- `audio`: true
- `difficulty`: 3


### EX-0566
- `article`: 114
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 114 ?
- `correct_answer`: Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.
- `feedback_correct`: Exact. Relire mentalement l'article 114 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.
- `audio`: true
- `difficulty`: 2


### EX-0567
- `article`: 114
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 114 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.
- `audio`: true
- `difficulty`: 1


### EX-0568
- `article`: 114
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 114 ?
- `correct_answer`: Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.
- `feedback_correct`: Exact. Relire mentalement l'article 114 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.
- `audio`: true
- `difficulty`: 2


### EX-0569
- `article`: 114
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit. » ?
- `correct_answer`: 114
- `feedback_correct`: Exact. Relire mentalement l'article 114 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.
- `audio`: true
- `difficulty`: 3


### EX-0570
- `article`: 114
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 114 : Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.
- `feedback_correct`: Exact. Relire mentalement l'article 114 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : Sauf exceptions réglementaires, le cumul d'une pension de retraite et d'une rémunération publique donnant lieu à prélèvement pour pension est interdit.
- `audio`: true
- `difficulty`: 3


### EX-0571
- `article`: 115
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 115 ?
- `correct_answer`: La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.
- `feedback_correct`: Exact. Relire mentalement l'article 115 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.
- `audio`: true
- `difficulty`: 2


### EX-0572
- `article`: 115
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 115 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.
- `audio`: true
- `difficulty`: 1


### EX-0573
- `article`: 115
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 115 ?
- `correct_answer`: La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.
- `feedback_correct`: Exact. Relire mentalement l'article 115 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.
- `audio`: true
- `difficulty`: 2


### EX-0574
- `article`: 115
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992. » ?
- `correct_answer`: 115
- `feedback_correct`: Exact. Relire mentalement l'article 115 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.
- `audio`: true
- `difficulty`: 3


### EX-0575
- `article`: 115
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 115 : La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.
- `feedback_correct`: Exact. Relire mentalement l'article 115 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi abroge les dispositions antérieures contraires, notamment la loi n°92-570 du 11 septembre 1992.
- `audio`: true
- `difficulty`: 3


### EX-0576
- `article`: 116
- `type`: qcm
- `timer_seconds`: 35
- `prompt`: Quelle proposition correspond exactement à l'article 116 ?
- `correct_answer`: La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.
- `feedback_correct`: Exact. Relire mentalement l'article 116 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.
- `audio`: true
- `difficulty`: 2


### EX-0577
- `article`: 116
- `type`: vrai_faux
- `timer_seconds`: 35
- `prompt`: Vrai ou faux : La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.
- `correct_answer`: Vrai
- `feedback_correct`: Exact. Relire mentalement l'article 116 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.
- `audio`: true
- `difficulty`: 1


### EX-0578
- `article`: 116
- `type`: flashcard
- `timer_seconds`: 60
- `prompt`: Que faut-il retenir de l'article 116 ?
- `correct_answer`: La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.
- `feedback_correct`: Exact. Relire mentalement l'article 116 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.
- `audio`: true
- `difficulty`: 2


### EX-0579
- `article`: 116
- `type`: article_inverse
- `timer_seconds`: 35
- `prompt`: À quel article rattache-t-on la règle suivante : « La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023. » ?
- `correct_answer`: 116
- `feedback_correct`: Exact. Relire mentalement l'article 116 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.
- `audio`: true
- `difficulty`: 3


### EX-0580
- `article`: 116
- `type`: mini_cas
- `timer_seconds`: 60
- `prompt`: Un candidat rencontre une situation relevant de cette règle : La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023. Quelle règle doit-il mobiliser ?
- `correct_answer`: Article 116 : La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.
- `feedback_correct`: Exact. Relire mentalement l'article 116 et verbaliser la règle en une phrase.
- `feedback_incorrect`: Réponse à revoir. La règle de référence est : La loi est publiée au Journal Officiel et exécutée comme loi de l'État ; elle est datée du 23 novembre 2023.
- `audio`: true
- `difficulty`: 3


## 8. Évaluations sommatives chronométrées

### Sommatif A — Mi-parcours
- Portée : articles 1–67.
- 60 questions / 45 min.
- Répartition : 25 QCM, 10 V/F, 10 appariements, 10 mini-cas, 5 classements.
- Correction uniquement après validation finale.
- Réussite : 75 %. Recommandation : 85 % avant passage au niveau suivant.

### Sommatif B — Fin de parcours
- Portée : articles 68–116.
- 60 questions / 45 min.
- Même structure ; pénalité optionnelle de -0,25 pour réponse erronée en mode concours avancé.

### Examen blanc intégral
- 100 questions / 75 min.
- Tirage stratifié sur les 116 articles.
- Au moins 25 % de mini-cas et questions-pièges.
- Score /100 + score par séquence + temps moyen + articles fragiles.
- Maîtrise parfaite : ≥90/100 sur 3 examens blancs consécutifs.

## 9. Apprentissage par le jeu

- **Qui suis-je ?** : une règle apparaît, retrouver l'article.
- **Bataille des catégories** : classer A/B/C/D.
- **ADDS Express** : classer des situations dans les quatre positions.
- **Chrono 30–6–36–60** : retrouver les durées.
- **Conseil ou Commission ?** : associer organismes consultatifs et compétences.
- **Échelle disciplinaire** : ranger les sanctions du 1er et du 2nd degré.
- **Millionnaire Fonction Publique** : 15 questions de difficulté croissante, 3 jokers.
- **Boss final** : 20 questions sans erreur ; une erreur fait perdre une vie (3 vies).
- XP, badges, séries quotidiennes, niveaux Bronze/Argent/Or/Expert, sans empêcher l'accès pédagogique au contenu.

## 10. Répétition espacée et adaptation

Score de maîtrise par article sur 100. Après erreur : réactivation à J0, J1, J3, J7, J14, J30. Une bonne réponse rapide augmente davantage le score qu'une bonne réponse lente avec indices. Trois erreurs sur un même article déclenchent une fiche 'À retenir absolument'.

## 11. Modèle de données recommandé

```ts
interface Exercise {
  id: string; article: number; sequenceId: string; type: string;
  prompt: string; options?: string[]; correctAnswer: string | string[];
  feedbackCorrect: string; feedbackIncorrect: string; explanation?: string;
  timerSeconds: number; difficulty: 1|2|3|4|5; audio: boolean; tags: string[];
}
interface Attempt { exerciseId:string; correct:boolean; elapsedSeconds:number; confidence:1|2|3; timestamp:string }
interface ArticleMastery { article:number; score:number; nextReview:string; errors:number }
```

## 12. Règles impératives de génération des distracteurs

- Ne jamais inventer une règle absente du texte comme si elle était vraie.
- Pour les nombres, créer des distracteurs proches : ex. 30 jours → 20/45/60 ; 6 mois → 3/9/12 ; mais conserver la valeur légale comme réponse.
- Pour les autorités, utiliser uniquement des autorités présentes dans le statut.
- Pour les listes, permuter ou déplacer un élément d'une liste voisine.
- Afficher après correction : réponse, justification courte, article, bouton 'Voir la règle', bouton audio.

## 13. Tableau de bord

Afficher : progression globale, maîtrise par séquence, maîtrise par article, score moyen, temps moyen, nombre de questions traitées, série de jours, erreurs les plus fréquentes, prochain objectif, calendrier de révision. Une heatmap 1–116 permet de cliquer sur chaque article.

## 14. Critères d'acceptation Claude Code

- Les 580 exercices sont importables et identifiables EX-0001 à EX-0580.
- Aucun exercice ne doit perdre son article source.
- Audio fonctionnel pour narration, consignes et feedbacks.
- Chronomètre fonctionnel en formatif et sommatif.
- Mode examen sans feedback avant soumission.
- Reprise automatique des erreurs.
- Responsive mobile/desktop et PWA.
- Export des résultats CSV/PDF prévu côté application.
- Tests unitaires sur scoring, timer, tirage aléatoire, répétition espacée et persistance.

## 15. Note éditoriale

Le contenu pédagogique doit rester fidèle au texte de la loi fournie. Pour toute fonctionnalité de mise à jour juridique, prévoir un champ `legal_version` et une alerte lorsque la source de référence change. Ne jamais modifier silencieusement une règle juridique.
