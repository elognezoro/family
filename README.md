# EduWeb — Family & Coaching

Plateforme web de mise en relation entre **familles** et **coachs scolaires** en **Côte d'Ivoire** : vérification des profils, tarification transparente en FCFA, suivi pédagogique.

> Stack : Node.js · Express · EJS · Prisma · PostgreSQL (Neon) · cookie-session · Resend · Leaflet · flag-icons

---

## 🚀 Démarrage rapide

```bash
npm install            # installe les dépendances + génère le client Prisma
# Renseignez DATABASE_URL et DIRECT_URL (Neon) dans .env (voir .env.example)
npm run setup          # applique le schéma sur PostgreSQL + seed
npm start              # démarre sur http://localhost:3000
```

> `npm run setup` = `prisma generate && prisma db push && node prisma/seed.js`
> Pour repartir de zéro : `npm run db:reset`

Si `node`/`npm` ne sont pas reconnus dans le terminal, utilisez le chemin complet
(`"C:\Program Files\nodejs\npm.cmd"`) ou rouvrez le terminal après installation de Node.

---

## 👤 Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | `admin@eduweb.ci` | `Admin@12345` |
| **Parent** | `parent@eduweb.ci` | `Parent@12345` |
| **Coach** (validé + certifié) | `coach.maths@eduweb.ci` | `Coach@12345` |
| Coach (en attente de validation) | `coach.lettres@eduweb.ci` | `Coach@12345` |

Tous ces comptes sont déjà activés (`emailVerified: true`).

**Codes promo** : `EDU10`, `EDU25`, `EDU50`, `EDU75`, `EDU100` (10 % → 100 %).

---

## ✨ Fonctionnalités

- **Accueil** : hero animé, bandes défilantes (193 drapeaux + disciplines), 3 cartes de rôle.
- **Auth** : inscription (NOM en majuscules, Prénom capitalisé), activation par email,
  connexion avec « me maintenir connecté » (30 j), blocage des comptes non activés.
  - 📧 **Mode dev** : sans clé Resend, le lien d'activation s'affiche dans la console serveur.
- **Espace Parent** : foyer « Ma Famille » (apprenants **sans nom** — protection mineurs),
  cascade géo (CI : 14 districts → 31 régions → communes / autres pays : ISO 3166-2),
  déclaration de besoins, recherche de coachs avec **carte Leaflet**, paiement Mobile Money simulé.
- **Espace Coach** : profil en 6 sections (identité, zone, compétences, disciplines & tarifs
  avec conversion EUR, présentation, documents drag-and-drop), soumission à validation.
- **Espace Admin** : KPIs, validation / refus (motif obligatoire) / certification des coachs.
- **Sélecteur de pays** : modal centré (bottom-sheet sur mobile), recherche, drapeaux SVG.
- Design responsive mobile-first, charte EduWeb (vert/ambré, Fraunces + Schibsted Grotesk).

---

## ⚙️ Configuration (`.env`)

```env
DATABASE_URL="postgresql://…-pooler…/neondb?sslmode=require"  # poolée (runtime)
DIRECT_URL="postgresql://…/neondb?sslmode=require"           # directe (migrations)
SESSION_SECRET="chaîne_aléatoire_longue"
RESEND_API_KEY=""                     # vide = mode dev (lien dans la console)
RESEND_FROM="EduWeb <activation@votre-domaine>"
BASE_URL="http://localhost:3000"      # en prod : l'URL publique Vercel
```

### Activer l'envoi réel d'emails (Resend)
1. Créez un compte [resend.com](https://resend.com) + une **clé API**.
2. **Vérifiez votre domaine** (DNS SPF/DKIM) pour écrire à tous les visiteurs.
3. Renseignez `RESEND_API_KEY` et `RESEND_FROM` (adresse sur le domaine vérifié).

---

## ☁️ Déploiement sur Vercel

Le projet est **prêt pour Vercel** (PostgreSQL, sessions cookie, `vercel.json` avec `includeFiles`).

1. **Pousser sur GitHub**
   ```bash
   git remote add origin https://github.com/<vous>/eduweb.git
   git branch -M main && git push -u origin main
   ```
2. **Importer dans Vercel** : New Project → sélectionner le dépôt.
3. **Variables d'environnement** (Project Settings → Environment Variables) :
   `DATABASE_URL` (poolée), `DIRECT_URL` (directe), `SESSION_SECRET`,
   `RESEND_API_KEY`, `RESEND_FROM`, `BASE_URL` (l'URL Vercel, ex. `https://eduweb.vercel.app`).
   *(`VERCEL` est défini automatiquement par la plateforme.)*
4. **Deploy**. Le build exécute `prisma generate` (script `vercel-build`).
5. La base Neon est déjà initialisée (`prisma db push` + seed faits en local).
   Pour réinitialiser : `npx prisma db push && node prisma/seed.js` en local.
6. Après le 1ᵉʳ déploiement, mettez `BASE_URL` à l'URL réelle puis **redéployez**
   (les liens d'activation email pointeront vers le bon domaine).

> ⚠️ Uploads de documents : éphémères sur Vercel (FS en lecture seule, écriture dans `/tmp`).
> Brancher un stockage cloud (Vercel Blob / Cloudinary) pour les conserver durablement.

---

## 📁 Structure

```
server.js · routes/ · views/ · public/(css,js,images) · data/ · config/
middleware/ · services/ · prisma/(schema.prisma, seed.js) · uploads/
```

---

*EduWeb — Family & Coaching · MVP · Côte d'Ivoire · « Apprendre • Progresser • Réussir ensemble »*
