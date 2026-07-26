# Audit de conformité — Family & Coaching vs Standards EduWeb

> Confrontation du code réel de **EduWeb — Family & Coaching** (`family.eduweb.ci`) aux
> référentiels officiels de l'écosystème (STD-010 à STD-013 et suivants).
> Date : version en cours. Auteur : revue d'ingénierie.

---

## 0. Contexte & périmètre — à lire en premier

Les standards EduWeb décrivent une pile cible **Next.js 15 + Clean Architecture / DDD**
(Server Actions, Route Handlers, Repository Pattern, Zod, OpenAPI, S3/R2), partagée par les
modules **Planner, Governance, E-School, Booking**.

**Family & Coaching est différent** : application **Express 4 + EJS** rendue côté serveur
(formulaires POST + redirections avec message flash), **Prisma + Neon**, **Vercel Blob** pour
les fichiers, déployée sur **Vercel**. Il n'y a ni React, ni Server Actions, ni couche
Repository/DDD, ni API REST publique.

**Conséquence** : une grande partie des standards est **sans objet (N/A)** pour ce module —
non par non-conformité, mais parce qu'ils visent une autre architecture. Cet audit distingue :

- ✅ **Conforme** — respecté tel quel ;
- 🟠 **Écart corrigeable** — divergence réelle, corrigée ou corrigeable dans la pile actuelle ;
- ⬜ **N/A (pile)** — concerne Next.js/DDD, sans objet pour Express/EJS (objectif de refonte éventuelle).

---

## 1. STD-010 — Stockage des fichiers

| Règle | Statut | Détail |
|---|---|---|
| Aucun fichier en base (Neon ne stocke que l'URL + métadonnées) | ✅ (corrigé) | Le repli **base64 → colonne DB** (documents coach, photo, pièces jointes) **a été supprimé** ; en cas d'échec du stockage, l'upload échoue proprement. `services/storage.js`, `routes/coach.js`, `routes/messages.js`. |
| Stockage objet compatible S3 | ✅ | **Vercel Blob** en production ; repli disque local `/uploads` en développement. |
| Nommage `UUID.extension` (jamais le nom d'origine) | ✅ (corrigé) | `safeName()` génère désormais `crypto.randomUUID() + ext`. Nom d'origine conservé en **métadonnée** (`CoachDocument.filename`, `Message.attachmentName`). URL non énumérable. |
| Validation type MIME / extension / taille | ✅ | `multer` (`fileFilter` + `limits`) : 1 Mo messagerie, 25 Mo documents coach ; images traitées via `sharp`. |
| Extensions exécutables interdites | ✅ | Liste blanche d'extensions dans les `fileFilter`. |
| Politique de conservation | ✅ | Purge automatique des pièces jointes de la messagerie (délai réglable, cron Vercel). |
| Optimisation image | ✅ | Photo de profil recadrée/redimensionnée 512×512 (WebP/JPEG), orientation EXIF corrigée. |
| **URL signées + expirantes pour documents sensibles** | 🟠 | **Limite de Vercel Blob** : accès `public` uniquement (pas d'URL signées natives). Mitigation appliquée : **URL non énumérables (UUID)**. Recommandation : servir les pièces sensibles (diplômes, CNI, CV) via une **route RBAC** qui ne divulgue pas l'URL Blob, ou migrer ces fichiers vers **S3/R2** (URL signées) comme le préconise le standard. |
| Antivirus, détection de fichiers orphelins, monitoring dédié | 🟠 | Absents. À prévoir (job de réconciliation Blob ↔ DB, alertes). |

**Corrections livrées dans cette PR** : nommage UUID + suppression totale du repli base64-en-base.

---

## 2. STD-011 — API

L'application n'est **pas API-first** : elle expose des pages HTML (EJS) et seulement quelques
endpoints JSON internes (`/api/stats`, `/messages/thread/:id`, `/messages/unread`).

| Règle | Statut | Détail |
|---|---|---|
| REST au pluriel / verbes HTTP | ⬜ N/A | Pas d'API REST publique ; routes orientées pages + actions (`/coach/documents`…). |
| Versionnement `/api/v1` | ⬜ N/A | Aucune API publique versionnée à maintenir. |
| Enveloppe JSON `{success,data,meta,error}` | ⬜ N/A | Les rares endpoints JSON renvoient des objets simples ; l'UI dépend de ce format. |
| Zod / OpenAPI | ⬜ N/A | Pile sans Zod ; validation manuelle. |
| Codes HTTP corrects | 🟠 partiel | Les endpoints JSON renvoient bien 400/403/503 ; les pages utilisent redirection + flash. |
| **Ne jamais exposer d'erreurs techniques** | ✅ (renforcé) | Messages utilisateur génériques ; `e.message` technique retiré du retour d'upload documents. |
| Authentification / RBAC / HTTPS | ✅ | Sessions signées, `requireAuth`/`requireRole`/`requirePerm`, HTTPS (Vercel), `trust proxy`. |
| Rate limiting | 🟠 | Non implémenté au niveau applicatif (Vercel offre une protection réseau de base). |

---

## 3. STD-012 — Backend & 4. STD-013 — Architecture

Ces référentiels décrivent **DDD / Clean Architecture** (couches Domaine / Application /
Infrastructure, Repositories, événements métier, feature-based). Family & Coaching est un
**monolithe Express** plus simple : `routes/*` → `services/*` → `Prisma`.

| Principe | Statut | Détail |
|---|---|---|
| Couches Domaine/Application/Repository, DDD | ⬜ N/A | Non structuré ainsi ; refonte lourde, non justifiée à cette échelle. |
| Validation avant logique métier | 🟠 partiel | Validation présente mais manuelle et dispersée (pas de Zod centralisé). |
| Transactions Prisma multi-écritures | 🟠 | `prisma.$transaction` peu utilisé ; certaines séquences (création user + profil/famille) gagneraient à être transactionnelles. |
| Journalisation centralisée + id de corrélation | 🟠 | `console.*` uniquement ; pas de logger structuré ni de request-id. |
| Traitements planifiés idempotents | ✅ | Purge quotidienne (Vercel Cron), idempotente. |
| Secrets via variables d'environnement | ✅ | `.env` / Vercel (jamais commités ; seul `.env.example` suivi). |
| Tests automatisés | 🟠 | Absents. |

---

## 5. Synthèse & recommandations priorisées

**Fait dans cette PR (STD-010) :**
1. ✅ Suppression du stockage de fichiers en base (repli base64) — corrige la violation majeure.
2. ✅ Nommage `UUID.extension` — supprime l'anti-pattern « nom d'origine = identifiant » et rend les URL non énumérables.
3. ✅ Retrait d'un message d'erreur technique exposé (upload documents).

**Recommandations réalisables ensuite (par priorité) :**
1. 🟠 **Documents sensibles** : servir diplômes/CNI/CV via une route RBAC (sans divulguer l'URL Blob), ou migrer vers S3/R2 pour des URL signées.
2. 🟠 **Transactions** : encapsuler les séquences multi-écritures dans `prisma.$transaction`.
3. 🟠 **Journalisation** : introduire un logger structuré + identifiant de requête.
4. 🟠 **Rate limiting** sur les endpoints sensibles (login, envoi d'e-mails, upload).
5. 🟠 **Réconciliation Blob ↔ DB** (détection des fichiers orphelins) + tests automatisés.

**Sans objet pour cette pile (objectifs de refonte, non des non-conformités) :** Server Actions,
Route Handlers versionnés, Zod/OpenAPI, Repository/DDD, enveloppe JSON standard. Ces éléments
concernent les modules Next.js de l'écosystème.

---

## 6. Référentiels enregistrés

- `docs/STD-010-FILE-STORAGE.md`
- `docs/STD-011-API.md`
- `docs/STD-012-BACKEND.md`
- `docs/STD-013-ARCHITECTURE.md`

> Les référentiels suivants (Sécurité, Auth, RBAC, Testing, Prisma, Database, Deployment, DDD,
> Clean Code, Next.js…) seront ajoutés dans `docs/` et évalués de la même façon dès leur réception.
