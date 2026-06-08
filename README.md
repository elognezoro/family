# EduWeb — Family & Coaching

Plateforme web de mise en relation entre **familles** et **coachs scolaires** en **Côte d'Ivoire** : vérification des profils, tarification transparente en FCFA, suivi pédagogique.

> Stack : Node.js · Express · EJS · Prisma · SQLite (local) / PostgreSQL (prod) · Leaflet · flag-icons

---

## 🚀 Démarrage rapide

```bash
npm install            # installe les dépendances + génère le client Prisma
npm run setup          # crée la base SQLite + applique le schéma + seed
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
DATABASE_URL="file:./dev.db"          # SQLite local
SESSION_SECRET="..."
RESEND_API_KEY=""                     # optionnel — vide = mode dev (console)
RESEND_FROM="EduWeb <onboarding@resend.dev>"
BASE_URL="http://localhost:3000"
PORT=3000
```

### Activer l'envoi réel d'emails
Renseignez `RESEND_API_KEY` (clé [resend.com](https://resend.com)) et redémarrez.

---

## ☁️ Déploiement (Vercel + PostgreSQL/Neon)

1. Dans `prisma/schema.prisma`, remplacez le bloc `datasource` par :
   ```prisma
   datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
   ```
   et décommentez la ligne `binaryTargets` du générateur.
2. Définissez `DATABASE_URL` (Neon) et les autres variables dans Vercel.
3. `npx prisma db push && npx prisma db seed`, puis déployez (`vercel.json` est fourni).

---

## 📁 Structure

```
server.js · routes/ · views/ · public/(css,js,images) · data/ · config/
middleware/ · services/ · prisma/(schema.prisma, seed.js) · uploads/
```

---

*EduWeb — Family & Coaching · MVP · Côte d'Ivoire · « Apprendre • Progresser • Réussir ensemble »*
