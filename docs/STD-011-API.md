---
title: EduWeb API Standards
version: 1.0
status: Official
category: Engineering Standards
code: STD-011
authors:
  - EduWeb Architecture Team
---

# API-STANDARDS.md

> Référentiel officiel de conception des API de l'écosystème EduWeb.
>
> **Note d'applicabilité (Family & Coaching)** : ce standard vise la pile Next.js
> (Server Actions, Route Handlers, Zod, OpenAPI, Repository). Family & Coaching est une
> application Express/EJS rendue côté serveur (formulaires POST + redirections), avec quelques
> endpoints JSON internes. Une grande partie des règles (versionnement `/api/v1`, OpenAPI,
> pagination par curseur, enveloppe JSON systématique) est **sans objet** pour cette pile.
> Les principes transverses (RBAC, validation, ne pas exposer d'erreurs techniques, HTTPS,
> rate limiting) s'appliquent. Voir `docs/AUDIT-CONFORMITE-STANDARDS.md`.

---

# Sommaire

1. Objectifs
2. Philosophie
3. Architecture API
4. Types d'API
5. Convention REST
6. Versionnement
7. Authentification
8. Autorisation
9. Structure des requêtes
10. Structure des réponses
11. Pagination
12. Filtrage
13. Tri
14. Recherche
15. Gestion des erreurs
16. Validation
17. Idempotence
18. Transactions
19. Performance
20. Sécurité
21. Documentation
22. Dépréciation
23. Monitoring
24. Anti-patterns
25. Checklist

---

# 1. Objectifs

Les API EduWeb doivent être : cohérentes ; sécurisées ; rapides ; documentées ; versionnées ;
faciles à maintenir. Les consommateurs ne dépendent jamais d'implémentations internes.

---

# 2. Philosophie

Les **Server Actions** sont privilégiées pour les échanges internes (Next.js) ; les
**Route Handlers** sont réservés aux API publiques / intégrations externes. Conception **API First**.

---

# 3. Architecture API

```
Client → Server Action ou Route Handler → Service → Repository → Prisma → Neon PostgreSQL
```

Les composants React n'accèdent jamais directement à Prisma.

---

# 4. Types d'API

API internes ; API publiques ; Webhooks ; API partenaires ; API administratives. Chaque
catégorie possède ses propres règles de sécurité.

---

# 5. Convention REST

Ressources au pluriel (`/students`, `/teachers`, `/classes`…). Éviter les verbes dans les
routes (`/getStudents`, `/createTeacher`). Les verbes HTTP portent l'action.

---

# 6. Versionnement

API publiques versionnées (`/api/v1/students`, `/api/v2/students`). Les Server Actions internes
ne nécessitent pas de versionnement explicite.

---

# 7. Authentification

Session sécurisée ; JWT ; OAuth2 ; API Key (intégrations). Les identifiants ne transitent
jamais dans l'URL.

---

# 8. Autorisation

```
Utilisateur → Authentification → RBAC → Service → Repository
```

Une authentification valide ne suffit jamais à autoriser une action.

---

# 9. Structure des requêtes

Nomenclature cohérente : `GET /students?page=1&pageSize=20`, `?schoolId=123`, `?status=ACTIVE`.
Paramètres validés avec Zod.

---

# 10. Structure des réponses

```json
{ "success": true, "data": {}, "meta": {}, "error": null }
```

En cas d'erreur :

```json
{ "success": false, "data": null, "error": { "code": "VALIDATION_ERROR", "message": "Le champ 'email' est invalide." } }
```

Structure identique sur toutes les API.

---

# 11. Pagination

Toutes les listes importantes sont paginées :

```json
{ "data": [], "meta": { "page": 2, "pageSize": 20, "totalItems": 132, "totalPages": 7 } }
```

Les grandes collections privilégient la pagination par curseur.

---

# 12. Filtrage

Filtres explicites et combinables (`?schoolId=`, `?teacherId=`, `?academicYear=`, `?status=`).

---

# 13. Tri

`?sort=lastName&order=asc`. Plusieurs critères possibles.

---

# 14. Recherche

Recherche textuelle `?q=mathématiques`. Recherches avancées dans des endpoints dédiés.

---

# 15. Gestion des erreurs

| Code | Utilisation |
|------:|-------------|
| 200 | Succès |
| 201 | Création |
| 204 | Suppression sans contenu |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Ressource introuvable |
| 409 | Conflit |
| 422 | Validation |
| 429 | Trop de requêtes |
| 500 | Erreur interne |

Les messages techniques ne sont jamais exposés aux utilisateurs.

---

# 16. Validation

Toutes les entrées sont validées avec Zod, avant toute logique métier. Erreurs uniformisées.

---

# 17. Idempotence

Opérations sensibles (paiement, import, synchronisation) : clé d'idempotence. Les requêtes
répétées ne produisent pas plusieurs traitements identiques.

---

# 18. Transactions

Opérations multi-étapes : `Prisma Transaction`. L'API garantit la cohérence des données.

---

# 19. Performance

Limiter le volume des réponses ; sélectionner uniquement les champs nécessaires ; pagination ;
éviter les requêtes N+1 ; cache lorsque pertinent.

---

# 20. Sécurité

HTTPS uniquement ; Rate Limiting ; validation des entrées ; journalisation ; protection CSRF ;
RBAC. Les données sensibles sont masquées dans les journaux.

---

# 21. Documentation

API publiques documentées avec OpenAPI : objectif ; paramètres ; réponses ; exemples ; codes
d'erreur ; permissions requises.

---

# 22. Dépréciation

```
Annonce → Dépréciation → Migration → Suppression
```

La date de retrait est communiquée à l'avance.

---

# 23. Monitoring

Temps de réponse ; taux d'erreur ; volume ; ressources ; erreurs 5xx ; erreurs 4xx. Alertes
sur les API critiques.

---

# 24. Anti-patterns

- ❌ Routes contenant des verbes.
- ❌ Réponses incohérentes.
- ❌ Validation absente.
- ❌ Données sensibles dans les réponses.
- ❌ Pagination absente sur de grandes listes.
- ❌ SQL brut dans les Route Handlers.
- ❌ Logique métier dans les contrôleurs.
- ❌ Messages d'erreur techniques exposés.

---

# 25. Checklist

- [ ] Endpoint documenté.
- [ ] Validation Zod.
- [ ] Authentification vérifiée.
- [ ] Autorisation RBAC.
- [ ] Pagination si nécessaire.
- [ ] Gestion des erreurs conforme.
- [ ] Tests automatisés.
- [ ] Monitoring configuré.
- [ ] Documentation OpenAPI mise à jour.
- [ ] Revue de sécurité réalisée.

---

# Documents associés

- CLAUDE.md
- NEXTJS-STANDARDS.md
- BACKEND-STANDARDS.md
- SECURITY-STANDARDS.md
- AUTH-STANDARDS.md
- RBAC-STANDARDS.md
- TESTING-STANDARDS.md

---

# Fin du document
