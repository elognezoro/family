---
title: EduWeb Backend Standards
version: 1.0
status: Official
category: Engineering Standards
code: STD-012
authors:
  - EduWeb Architecture Team
---

# BACKEND-STANDARDS.md

> Référentiel officiel de développement Backend de l'écosystème EduWeb.
>
> **Note d'applicabilité (Family & Coaching)** : ce standard décrit une architecture
> Next.js + DDD + Clean Architecture (Server Actions, Application/Domain Services,
> Repository Pattern, Zod, événements métier). Family & Coaching est une application
> Express/EJS plus simple (routes → Prisma, services utilitaires). Les principes transverses
> (validation avant logique, RBAC, transactions Prisma, journalisation, secrets en variables
> d'environnement, tâches planifiées idempotentes) s'appliquent ; la structure en couches
> DDD complète est **sans objet** à cette échelle. Voir `docs/AUDIT-CONFORMITE-STANDARDS.md`.

---

# Sommaire

1. Objectifs
2. Philosophie
3. Architecture Backend
4. Organisation des dossiers
5. Couche Domaine
6. Couche Application
7. Couche Infrastructure
8. Repositories
9. Services
10. Server Actions
11. Route Handlers
12. Transactions
13. Gestion des erreurs
14. Validation
15. Journalisation
16. Tâches asynchrones
17. Planification des traitements
18. Événements métier
19. Performance
20. Sécurité
21. Tests
22. Documentation
23. Anti-patterns
24. Checklist

---

# 1. Objectifs

Le Backend doit être : fiable ; sécurisé ; évolutif ; modulaire ; testable ; indépendant de
l'interface utilisateur. La logique métier constitue le cœur du système.

---

# 2. Philosophie

DDD ; Clean Architecture ; SOLID ; Repository Pattern ; Service Layer ; Dependency Inversion.
Les frameworks sont des détails d'implémentation.

---

# 3. Architecture Backend

```
Client → Server Action → Application Service → Domain Service → Repository → Prisma → Neon PostgreSQL
```

Chaque couche possède une responsabilité unique.

---

# 4. Organisation des dossiers

```
src/features/students/{actions,services,repositories,schemas,types,validators,events,jobs,hooks,tests}
```

Les fonctionnalités sont isolées les unes des autres.

---

# 5. Couche Domaine

Entités ; objets valeur ; règles métier ; événements métier ; services de domaine. Ne dépend
ni de Prisma, ni de Next.js.

---

# 6. Couche Application

Orchestre les cas d'usage (inscrire un élève, générer un emploi du temps, publier un bulletin,
affecter un enseignant) sans logique technique.

---

# 7. Couche Infrastructure

Prisma ; Neon ; stockage des fichiers ; e-mails ; notifications ; intégrations externes.
Implémente les interfaces définies par le domaine.

---

# 8. Repositories

Un Repository par agrégat (`StudentRepository`, `TeacherRepository`…). Lecture ; écriture ;
pagination ; recherche. Jamais de règles métier dans un Repository.

---

# 9. Services

- **Services de domaine** : règles métier (`TimetableGeneratorService`).
- **Services applicatifs** : orchestration (`SchoolEnrollmentService`).

---

# 10. Server Actions

Point d'entrée principal : `Validation → Authentification → Autorisation → Service → Repository → Réponse`.
Restent légères, sans logique métier.

---

# 11. Route Handlers

Uniquement pour API publiques, Webhooks, OAuth, intégrations externes, export/import. Même
architecture que les Server Actions.

---

# 12. Transactions

```typescript
await prisma.$transaction(async (tx) => { ... });
```

Transactions courtes pour limiter les verrous.

---

# 13. Gestion des erreurs

Exceptions métier explicites (`ValidationException`, `BusinessException`, `ConflictException`,
`NotFoundException`, `UnauthorizedException`, `ForbiddenException`), converties en réponses homogènes.

---

# 14. Validation

`Requête → Validation (Zod) → Transformation → Service → Repository`. La logique métier ne
s'exécute jamais sur des données non validées.

---

# 15. Journalisation

Logger centralisé (DEBUG/INFO/WARN/ERROR). Chaque journal : identifiant utilisateur ;
horodatage ; identifiant de requête ; contexte fonctionnel.

---

# 16. Tâches asynchrones

Traitements longs en asynchrone (rapports, export Excel, PDF, e-mails, synchronisations),
rejouables en cas d'échec.

---

# 17. Planification des traitements

Traitements planifiés (emplois du temps, archivage annuel, sauvegardes, rappels parents,
échéances, recalcul de statistiques), idempotents et journalisés.

---

# 18. Événements métier

`StudentCreated`, `TeacherAssigned`, `TimetablePublished`, `AttendanceValidated` — pour
découpler les modules.

---

# 19. Performance

Limiter les accès base ; privilégier le batch ; cache pertinent ; réduire les échanges réseau.
Pas de requêtes redondantes.

---

# 20. Sécurité

Authentification ; RBAC ; validation ; journalisation ; protection contre les injections.
Secrets via variables d'environnement.

---

# 21. Tests

Chaque service : tests unitaires ; tests d'intégration ; jeux de données de démonstration.
Cas d'erreur testés autant que les cas nominaux.

---

# 22. Documentation

Chaque service documente : objectif ; paramètres ; dépendances ; exceptions ; événements publiés.
Documentation maintenue avec le code.

---

# 23. Anti-patterns

- ❌ Logique métier dans les Server Actions.
- ❌ Accès direct à Prisma depuis React.
- ❌ Repositories contenant des règles métier.
- ❌ Services géants.
- ❌ Transactions longues.
- ❌ Validation manuelle dispersée.
- ❌ Duplication de logique métier.
- ❌ Appels synchrones bloquants pour des traitements lourds.

---

# 24. Checklist

- [ ] Cas d'usage identifié.
- [ ] Validation Zod.
- [ ] Service dédié.
- [ ] Repository conforme.
- [ ] Transactions vérifiées.
- [ ] Journalisation présente.
- [ ] Gestion des erreurs homogène.
- [ ] Tests automatisés.
- [ ] Documentation mise à jour.
- [ ] Revue d'architecture validée.

---

# Documents associés

- CLAUDE.md
- API-STANDARDS.md (STD-011)
- ARCHITECTURE-STANDARDS.md
- DDD-STANDARDS.md
- SECURITY-STANDARDS.md
- TESTING-STANDARDS.md

---

# Fin du document
