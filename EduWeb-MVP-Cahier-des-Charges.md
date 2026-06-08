# EduWeb — Family & Coaching
## Cahier des charges MVP — Pour Claude Code

> Donne ce fichier à Claude Code avec la commande :
> `claude "Lis ce fichier et construis l'application complète étape par étape"`

---

## 1. Le projet en une phrase

Plateforme web de mise en relation entre **familles** et **coachs scolaires** en **Côte d'Ivoire**, avec vérification des profils, tarification transparente en FCFA, et suivi pédagogique.

---

## 2. Stack technique obligatoire

| Composant | Choix | Raison |
|-----------|-------|--------|
| Runtime | Node.js (LTS) | Simple, rapide |
| Framework | Express.js | Léger, flexible |
| Templating | EJS + express-ejs-layouts | Server-side rendering, SEO |
| ORM | Prisma | Type-safe, migrations faciles |
| Base de données | PostgreSQL (Neon.tech) | Cloud gratuit, serverless |
| Auth | bcrypt + express-session | Standard, fiable |
| Email | Resend (npm resend) | Gratuit 3000/mois, API simple |
| Upload | Multer | Standard Node.js |
| Géolocalisation | country-state-city (npm) | ISO 3166 + ISO 3166-2, 250 pays |
| Cartographie | Leaflet + OpenStreetMap | Gratuit, open source |
| Drapeaux | flag-icons (CDN) | SVG drapeaux 250 pays |
| Déploiement | Vercel | Gratuit, auto-deploy GitHub |
| CSS | Custom (pas de framework) | Charte graphique spécifique |

---

## 3. Rôles utilisateurs & accès

| Rôle | Accès | Création |
|------|-------|----------|
| **Parent** | `/parent/*` uniquement | Self-service via inscription |
| **Coach** | `/coach/*` uniquement | Self-service, nécessite validation admin |
| **Admin** | `/admin/*` + `/parent/*` + `/coach/*` | Pré-provisionné dans le seed (pas de self-service) |

Chaque espace est protégé par middleware RBAC. Un parent ne peut jamais accéder à `/coach` ou `/admin`.

---

## 4. Charte graphique

### Couleurs
```css
:root {
  --primary: #1E9E57;          /* Vert EduWeb */
  --primary-dark: #0E6B3A;     /* Vert foncé */
  --primary-light: #E2F3E8;    /* Vert surface */
  --amber: #F08A24;            /* Accent ambré */
  --amber-soft: #FCE7D2;       /* Ambré doux */
  --ink: #1A2A1A;              /* Texte principal */
  --ink-light: #7A8A7A;        /* Texte secondaire */
  --bg: #F4F6F0;               /* Fond page */
  --card: #FFFFFF;             /* Fond cartes */
  --border: #D4DED4;           /* Bordures */
  --danger: #DC3545;           /* Erreur */
  --success: #10B981;          /* Succès */
  --warning: #F59E0B;          /* Avertissement */
}
```

### Typographies (Google Fonts)
```
Titres : Fraunces (serif, display, variable weight)
Corps  : Schibsted Grotesk (sans-serif)
```

### Principes UI
- Coins arrondis (8-16px), ombres douces
- Responsive mobile-first (breakpoints : 480, 768, 1024px)
- Animations légères (transitions 0.2s ease)
- Vert dominant, accents ambrés pour les CTA secondaires
- Logo : fichier `public/images/logo.jpeg` (fourni séparément)
- Slogan : **"Apprendre • Progresser • Réussir ensemble"**

---

## 5. Base de données — Schéma Prisma complet

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-1.0.x", "rhel-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String
  name              String
  gender            String?               // "Femme" | "Homme"
  role              String    @default("parent")  // parent | coach | admin
  photo             String?
  phone             String?
  status            String    @default("active")  // active | suspended
  emailVerified     Boolean   @default(false)
  verifyToken       String?   @unique
  verifyTokenExpiry DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  families          Family[]
  coachProfile      CoachProfile?
  payments          Payment[]      @relation("UserPayments")
  sentMissions      Mission[]      @relation("ParentMissions")
  receivedMissions  Mission[]      @relation("CoachMissions")
  notifications     Notification[]
}

model Family {
  id           String    @id @default(uuid())
  ownerUserId  String
  label        String
  owner        User      @relation(fields: [ownerUserId], references: [id])
  learners     Learner[]
}

model Learner {
  id            String   @id @default(uuid())
  familyId      String
  sexe          String?            // "F" | "M"
  age           Int?
  pays          String   @default("ci")
  region        String?
  commune       String?
  quartier      String?
  cycle         String?            // prescolaire | primaire | secondaire1 | secondaire2_general | secondaire2_technique
  niveau        String?            // CP1, 6e, Terminale, etc.
  serie         String?            // A, C, D, G1, etc.
  family        Family   @relation(fields: [familyId], references: [id])
  needs         Need[]
  carnetEntries CarnetEntry[]
  missions      Mission[]
}

model Need {
  id            String   @id @default(uuid())
  learnerId     String
  disciplineId  String
  heuresSemaine Int      @default(2)
  mode          String   @default("presentiel")  // presentiel | visio | hybride
  createdAt     DateTime @default(now())
  learner       Learner  @relation(fields: [learnerId], references: [id])
}

model CoachProfile {
  id            String   @id @default(uuid())
  userId        String   @unique
  pays          String   @default("ci")
  zone          String?
  region        String?
  commune       String?
  quartier      String?
  adresse       String?
  gpsLat        Float?
  gpsLng        Float?
  presentation  String?
  experience    String?
  statut        String   @default("pending")  // pending | valide | refuse
  certifie      Boolean  @default(false)
  motifRefus    String?
  note          Float    @default(0)
  avisCount     Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id])
  niveaux       CoachNiveau[]
  disciplines   CoachDiscipline[]
  modes         CoachMode[]
  documents     CoachDocument[]
  avis          Avis[]
  carnetEntries CarnetEntry[]
  missions      Mission[]
}

model CoachNiveau {
  id        String       @id @default(uuid())
  profileId String
  niveauId  String
  profile   CoachProfile @relation(fields: [profileId], references: [id])
  @@unique([profileId, niveauId])
}

model CoachDiscipline {
  id           String       @id @default(uuid())
  profileId    String
  disciplineId String
  tarifMensuel Int          @default(30000)  // FCFA
  profile      CoachProfile @relation(fields: [profileId], references: [id])
  @@unique([profileId, disciplineId])
}

model CoachMode {
  id        String       @id @default(uuid())
  profileId String
  mode      String       // presentiel | visio | hybride
  profile   CoachProfile @relation(fields: [profileId], references: [id])
  @@unique([profileId, mode])
}

model CoachDocument {
  id        String       @id @default(uuid())
  profileId String
  type      String       // diplome | cni | cv | certificat
  filename  String
  url       String
  status    String       @default("pending")
  createdAt DateTime     @default(now())
  profile   CoachProfile @relation(fields: [profileId], references: [id])
}

model Payment {
  id            String   @id @default(uuid())
  parentUserId  String
  brut          Int      @default(0)
  remise        Int      @default(0)
  pct           Int      @default(0)
  promoCode     String?
  net           Int      @default(0)
  operateur     String?        // wave | orange | mtn | moov
  transactionId String?
  createdAt     DateTime @default(now())
  parent        User     @relation("UserPayments", fields: [parentUserId], references: [id])
}

model Mission {
  id             String        @id @default(uuid())
  parentUserId   String
  coachProfileId String?
  coachUserId    String?
  learnerId      String?
  statut         String        @default("pending")
  montant        Int?
  createdAt      DateTime      @default(now())
  parent         User          @relation("ParentMissions", fields: [parentUserId], references: [id])
  coach          User?         @relation("CoachMissions", fields: [coachUserId], references: [id])
  coachProfile   CoachProfile? @relation(fields: [coachProfileId], references: [id])
  learner        Learner?      @relation(fields: [learnerId], references: [id])
}

model PromoCode {
  code       String    @id
  pct        Int
  actif      Boolean   @default(true)
  usageMax   Int?
  usageCount Int       @default(0)
  expiration DateTime?
}

model CarnetEntry {
  id             String       @id @default(uuid())
  learnerId      String
  disciplineId   String
  coachProfileId String
  contenu        String
  note           Int          @default(3)  // 1 à 5
  createdAt      DateTime     @default(now())
  learner        Learner      @relation(fields: [learnerId], references: [id])
  coach          CoachProfile @relation(fields: [coachProfileId], references: [id])
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  type      String
  payload   String?
  lu        Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}

model Avis {
  id             String       @id @default(uuid())
  coachProfileId String
  auteurNom      String?
  note           Int
  commentaire    String?
  createdAt      DateTime     @default(now())
  coach          CoachProfile @relation(fields: [coachProfileId], references: [id])
}
```

---

## 6. Pages & fonctionnalités MVP

### 6.1 Page d'accueil (`/`)
- Hero plein écran avec image de fond, slogan en badge "verre dépoli"
- Double bande défilante animée : drapeaux des 193 pays + noms de disciplines
- 3 cartes de rôle cliquables : Parent (vert), Coach (vert foncé), Admin (ambré)
- Footer professionnel : logo, liens espaces, contact (contact@eduweb.ci, +225, Abidjan)

### 6.2 Inscription (`/auth/register`)
- Champs : NOM (force majuscules), Prénom(s) (capitalize), email, mot de passe (min 6), confirmer, genre, type de compte (Parent/Coach)
- Logo EduWeb 220px en haut, centré, avec halo lumineux vert animé (CSS)
- Après soumission : compte créé avec `emailVerified: false`, email envoyé via Resend avec lien d'activation (token 32 bytes, expire 24h)
- Redirection vers `/auth/login` avec message via query params `?mt=success&mm=...`
- **Aucune session créée** — le compte est inactif

### 6.3 Connexion (`/auth/login`)
- Logo EduWeb 220px centré avec halo
- Champs : email, mot de passe, checkbox "Me maintenir connecté" (30 jours)
- **Blocage** si `emailVerified !== true` → message "Compte non activé" + lien "Renvoyer"
- Après connexion → redirection vers `/{role}`
- Lien "Pas de compte ? Créer un compte"

### 6.4 Vérification email (`/auth/verify?token=xxx`)
- Recherche token en base, vérifie expiration
- Active le compte (`emailVerified: true`), supprime le token
- Envoie un email de bienvenue
- Redirige vers login avec message de succès

### 6.5 Espace Parent (`/parent`)
- **Foyer "Ma Famille"** : ajouter/supprimer des apprenants
  - Apprenant **sans nom** (protection mineurs) : sexe, âge, pays, localisation (cascade ISO), cycle, niveau, série
  - Sélecteur de pays en modal centré (backdrop, recherche, 193 pays, drapeaux)
  - Cascade géo : CI → District/Région/Commune ; autres pays → ISO 3166-2
- **Besoins** : déclarer des disciplines pour chaque apprenant
  - Sélecteur de disciplines filtré par cycle (accordéon catégories, multi-sélection)
  - Mode : présentiel / visio / hybride (le label "hybride" doit afficher "Hybride (Présentiel et/ou à distance)")
  - Heures par semaine
- **Recherche de coachs** : carte Leaflet + filtres
- **Tableau de bord** : résumé besoins, missions, paiements

### 6.6 Espace Coach (`/coach`)
Layout : sidebar gauche + contenu principal à droite.

**Sidebar** :
- Photo de profil (avatar par défaut si absent)
- Nom, statut (badge vert/orange/rouge), genre
- Tarif moyen en FCFA + conversion EUR (1 EUR = 656 FCFA)
- Section documents (nombre téléversé, bouton ajouter)

**Contenu principal — 6 sections numérotées** :
1. **Identité** : nom, prénom, genre, téléphone
2. **Zone d'intervention** : pays (modal picker), cascade géo, quartier, adresse
3. **Compétences pédagogiques** : niveaux enseignés (accordéon par cycle, puces cliquables), modes d'enseignement
4. **Disciplines & tarifs** : accordéon par cycle, tarif en FCFA par discipline avec conversion EUR automatique
5. **Présentation** : texte libre (bio, méthodologie, expérience)
6. **Documents** : upload drag-and-drop (max 25 Mo), types : diplôme, CNI, CV, certificat

### 6.7 Espace Admin (`/admin`)
- **KPIs** en haut : total utilisateurs, coachs en attente, coachs validés, missions
- **Liste des coachs en attente** de validation
- **Examen d'un profil coach** (`/admin/coach-profile/:id`) :
  - Vue complète du profil, documents, niveaux, disciplines
  - Bouton **Valider** → `statut: 'valide'`
  - Bouton **Refuser** → modal avec textarea obligatoire (min 10 caractères), motif stocké dans `motifRefus`
  - Bouton **Certifier** → `certifie: true`, badge affiché sur le profil

### 6.8 Sélecteur de pays — Country Picker
Composant réutilisable (`public/js/country-picker.js`) activé par `<select data-country-picker>`.

- **Modal centré** (pas un dropdown) avec backdrop sombre + blur
- Titre "Sélectionner un pays" + bouton fermer ×
- Barre de recherche
- 193 pays ONU groupés par région (Afrique de l'Ouest en premier), avec drapeaux SVG
- Pays sélectionné affiché avec drapeau dans le bouton
- Fermeture : clic extérieur, Échap, ×
- Body scroll désactivé pendant ouverture
- Mobile : bottom-sheet (modal collé en bas)
- Déclenche l'événement `eduweb:country-changed` pour la cascade géo

### 6.9 Cascade géographique — Zone d'intervention
Composant (`public/js/zone-intervention.js`) qui écoute `eduweb:country-changed`.

- **Côte d'Ivoire** (`ci`) : cascade District (14) → Région (31) → Commune (API `/api/ci/...`)
- **Autres pays avec ISO 3166-2** : cascade Région/État/Province → Ville (via `country-state-city`)
- **Pays sans données** : saisie libre (inputs texte)
- Labels adaptés par pays : Région (FR), État (US), Wilaya (DZ), Préfecture (JP), Canton (CH)...

---

## 7. Référentiels à intégrer dans le seed

### 7.1 Comptes de démonstration
```javascript
// Tous avec emailVerified: true pour pouvoir se connecter
{ email: 'admin@eduweb.ci',       password: 'Admin@12345',   role: 'admin',  name: 'Administrateur EduWeb' }
{ email: 'parent@eduweb.ci',      password: 'Parent@12345',  role: 'parent', name: 'Mme Koné' }
{ email: 'coach.maths@eduweb.ci', password: 'Coach@12345',   role: 'coach',  name: 'M. Traoré Ibrahim' }
```

### 7.2 Niveaux d'enseignement (système éducatif ivoirien)
```javascript
const niveaux = [
  { id: 'prescolaire', cycle: 'prescolaire', label: 'Préscolaire' },
  { id: 'cp1', cycle: 'primaire', label: 'CP1' },
  { id: 'cp2', cycle: 'primaire', label: 'CP2' },
  { id: 'ce1', cycle: 'primaire', label: 'CE1' },
  { id: 'ce2', cycle: 'primaire', label: 'CE2' },
  { id: 'cm1', cycle: 'primaire', label: 'CM1' },
  { id: 'cm2', cycle: 'primaire', label: 'CM2' },
  { id: '6e',  cycle: 'secondaire1', label: '6ème' },
  { id: '5e',  cycle: 'secondaire1', label: '5ème' },
  { id: '4e',  cycle: 'secondaire1', label: '4ème' },
  { id: '3e',  cycle: 'secondaire1', label: '3ème' },
  { id: '2nde', cycle: 'secondaire2_general', label: 'Seconde' },
  { id: '1ere', cycle: 'secondaire2_general', label: 'Première', series: ['A','C','D'] },
  { id: 'tle',  cycle: 'secondaire2_general', label: 'Terminale', series: ['A','C','D'] },
];
```

### 7.3 Disciplines (taxonomie hiérarchique)
Structure : `{ id, cycle, domaine, matiere }`

**Préscolaire** : éveil langage, prélecture, préécriture, prémathématiques, activités motrices, éducation artistique, éveil scientifique

**Primaire** :
- Français → Lecture, Expression écrite, Grammaire, Conjugaison, Orthographe, Vocabulaire
- Mathématiques, EDHC, Sciences & Technologie, Histoire-Géo, Anglais, EPS, AEC

**Secondaire** :
- Français, Anglais, Espagnol, Allemand
- Mathématiques
- Physique-Chimie, SVT
- Histoire-Géographie, Philosophie
- TIC / Informatique / IA
- Arts, Musique, EPS

### 7.4 Codes promo
```javascript
['EDU10', 'EDU25', 'EDU50', 'EDU75', 'EDU100']  // 10% à 100%
```

### 7.5 Découpage administratif Côte d'Ivoire
14 districts officiels avec leurs régions et communes principales :
- Abidjan (Abidjan, Anyama, Bingerville, Songon...)
- Yamoussoukro (Bélier → Yamoussoukro, Toumodi, Didiévi...)
- Bas-Sassandra (San-Pédro, Tabou, Sassandra...)
- etc.

### 7.6 Liste des 193 pays ONU
Groupés par région : Afrique de l'Ouest (CI en premier), Afrique Centrale, Afrique de l'Est, Afrique du Nord, Afrique Australe, Europe, Amériques, Asie, Océanie, Moyen-Orient. Chaque pays avec son code ISO alpha-2 pour les drapeaux.

---

## 8. Tarification

| Cycle | Tarif | Unité |
|-------|-------|-------|
| Préscolaire | 50 000 FCFA | /mois/apprenant |
| Primaire | 60 000 FCFA | /mois/apprenant |
| Secondaire | 15 000 — 30 000 FCFA | /mois/discipline |

Conversion : **1 EUR = 656 FCFA**

Codes promo : réductions 10% → 100% (EDU100 = gratuit)

Paiement Mobile Money (simulé en MVP) : Wave, Orange Money, MTN MoMo, Moov Money.

---

## 9. Email — Templates Resend

### Email d'activation
- Header vert gradient (#1E9E57 → #0E6B3A) avec logo
- "EduWeb Family & Coaching" + slogan
- Corps : "Bonjour {nom}, merci de vous être inscrit. Cliquez pour activer :"
- Bouton CTA vert arrondi : "✅ Activer mon compte" → lien `{BASE_URL}/auth/verify?token={token}`
- Lien texte alternatif
- Warning : "⏰ Ce lien expire dans 24 heures."
- Footer : copyright + "Côte d'Ivoire"

### Email de bienvenue
- Header vert : "Bienvenue sur EduWeb ! 🎊"
- "Votre compte est maintenant activé !"
- Bouton : "Accéder à mon espace →"

---

## 10. Messages flash via URL

Comme express-session ne persiste pas les flash sur Vercel/Codespaces, utiliser des **query parameters** :

```javascript
// Fonction utilitaire
function go(res, path, type, text) {
  return res.redirect(path + '?mt=' + encodeURIComponent(type) + '&mm=' + encodeURIComponent(text));
}

// Usage
return go(res, '/auth/login', 'success', 'Compte activé !');
```

```ejs
<!-- Dans les vues -->
<% if (locals.mt && locals.mm) { %>
  <div class="flash flash--<%= mt %>"><%- mm %></div>
<% } %>
```

Types : `success` (vert), `error` (rouge), `warning` (jaune), `info` (bleu).

---

## 11. Structure des fichiers attendue

```
eduweb-family-coaching/
├── server.js
├── package.json
├── vercel.json
├── .env.example
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── config/
│   ├── app.js
│   └── icons.js
├── data/
│   ├── prisma-store.js
│   ├── niveaux.js
│   ├── disciplines.js
│   ├── countries.js
│   ├── regions.js
│   └── geo-service.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── parent.js
│   ├── coach.js
│   ├── admin.js
│   └── api.js
├── services/
│   └── email.js
├── views/
│   ├── layouts/main.ejs
│   ├── index.ejs
│   ├── auth/login.ejs
│   ├── auth/register.ejs
│   ├── parent/dashboard.ejs
│   ├── parent/recherche.ejs
│   ├── coach/dashboard.ejs
│   ├── admin/dashboard.ejs
│   └── admin/coach-profile.ejs
├── public/
│   ├── css/style.css
│   ├── js/app.js
│   ├── js/country-picker.js
│   ├── js/zone-intervention.js
│   └── images/
└── uploads/
```

---

## 12. Configuration déploiement

### vercel.json
```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "server.js" }]
}
```

### package.json scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

### Variables d'environnement (.env.example)
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
SESSION_SECRET=changez_moi_en_production
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=EduWeb <onboarding@resend.dev>
BASE_URL=http://localhost:3000
```

---

## 13. Commandes de démarrage

```bash
# 1. Initialiser le projet
npm init -y
npm install express express-session express-ejs-layouts ejs connect-flash bcrypt multer dotenv uuid @prisma/client resend country-state-city
npm install -D prisma

# 2. Initialiser Prisma
npx prisma init --datasource-provider postgresql

# 3. Copier le schéma Prisma (section 5 ci-dessus)
# 4. Synchroniser avec la base
npx prisma db push
npx prisma generate

# 5. Seeder la base
npx prisma db seed

# 6. Démarrer
npm start
```

---

## 14. Règles impératives

1. **Langue** : toute l'interface est en **français**
2. **Protection mineurs** : les apprenants sont enregistrés **sans nom** — identifiés par niveau/âge uniquement
3. **Devise** : tout affichage monétaire en **FCFA (XOF)** avec conversion EUR (1 EUR = 656 FCFA)
4. **Sélecteur de pays** : toujours en **modal centré** (jamais un dropdown qui déborde)
5. **Cascade géo CI** : 14 districts officiels → 31 régions → communes
6. **Hybride** : toujours afficher "Hybride (Présentiel et/ou à distance)"
7. **Flash messages** : via query params `?mt=&mm=` (pas connect-flash qui ne persiste pas sur Vercel)
8. **Prisma sur Vercel** : `binaryTargets` multiples obligatoires + `postinstall: "prisma generate"`
9. **NOM** : champ forcé en majuscules à la saisie ; **Prénom** : capitalize chaque mot
10. **Pas d'accès démo** sur la page de connexion (le projet est public)
11. **Git** : `git add -A && git commit -m "feat: ..." && git push origin main` après chaque fonctionnalité validée
12. **EJS** : ne jamais patcher par regex — toujours réécrire le fichier entier en cas de modification

---

*EduWeb — Family & Coaching · Cahier des charges MVP · v2.0 · Côte d'Ivoire*
