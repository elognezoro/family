---
title: EduWeb Architecture Standards
version: 1.0
status: Official
category: Engineering Standards
code: STD-013
authors:
  - EduWeb Architecture Team
---

# ARCHITECTURE-STANDARDS.md

> Référentiel officiel d'architecture logicielle de l'écosystème EduWeb.
>
> **Note d'applicabilité (Family & Coaching)** : ce standard décrit l'architecture cible de
> l'écosystème (Next.js 15, Clean Architecture, DDD feature-based) partagée par EduWeb Planner,
> Governance, E-School, Booking… **Family & Coaching** est un module Express/EJS existant, plus
> simple et monolithique à petite échelle. Les principes transverses (modularité, faible
> couplage, sécurité by design, observabilité) s'appliquent ; la structure feature-based DDD
> complète est un objectif de refonte, non l'état actuel. Voir `docs/AUDIT-CONFORMITE-STANDARDS.md`.

---

# Sommaire

1. Vision
2. Objectifs
3. Principes d'architecture
4. Architecture globale
5. Domaines fonctionnels
6. Modularité
7. Dépendances
8. Flux de données
9. Architecture des couches
10. Communication
11. Évolutivité
12. Résilience
13. Sécurité
14. Observabilité
15. Décisions d'architecture (ADR)
16. Gouvernance
17. Anti-patterns
18. Checklist

---

# 1. Vision

EduWeb est une plateforme **Enterprise SaaS** dédiée à la transformation numérique de
l'éducation : EduWeb Planner, Governance, E-School, Family, Booking, futurs modules IA et
services ministériels. Tous les modules partagent une architecture commune.

---

# 2. Objectifs

Évolutivité ; disponibilité ; maintenabilité ; modularité ; sécurité ; simplicité. Toute
nouvelle fonctionnalité s'ajoute sans remettre en cause les modules existants.

---

# 3. Principes d'architecture

DDD ; Clean Architecture ; SOLID ; DRY ; KISS ; YAGNI ; API First ; Security by Design ;
Privacy by Design ; Performance by Design.

---

# 4. Architecture globale

```
Navigateur → Next.js 15 → Server Actions → Application Services → Domain Services → Repositories → Prisma ORM → Neon PostgreSQL → Cloud Storage
```

Composants faiblement couplés.

---

# 5. Domaines fonctionnels

Chaque domaine possède ses entités, services, repositories, événements : Identity, Schools,
Students, Teachers, Planning, Attendance, Evaluation, Reporting, Administration, Payments,
Notifications, Documents. Aucun domaine ne doit devenir un « God Module ».

---

# 6. Modularité

Chaque module est autonome (`features/{students,teachers,schools,planning,reports,governance,family,booking}`).
Les dépendances transversales passent par des interfaces.

---

# 7. Dépendances

Les dépendances pointent toujours vers le centre métier : `UI → Application → Domain → Infrastructure`.
Le domaine ne dépend jamais de Prisma, Next.js, React, ni d'un fournisseur cloud.

---

# 8. Flux de données

`Interface → Validation → Application → Domaine → Repository → Base de données`. Le flux inverse
ne contourne jamais les règles métier.

---

# 9. Architecture des couches

- **Présentation** : interface et expérience utilisateur.
- **Application** : cas d'usage, orchestration.
- **Domaine** : règles métier, entités, invariants.
- **Infrastructure** : Prisma, Neon, stockage, notifications, API externes.

---

# 10. Communication

Interne : Server Actions, Services. Externe : REST API, Webhooks. Les modules communiquent via
des contrats stables.

---

# 11. Évolutivité

Compatibilité ascendante ; faible couplage ; forte cohésion. Un nouveau module n'impose pas de
modifier les modules existants.

---

# 12. Résilience

Fonctionnement en cas de défaillance partielle : retries ; timeouts ; files d'attente ;
journalisation ; reprise sur incident.

---

# 13. Sécurité

Toutes les couches : authentification ; RBAC ; validation ; audit ; chiffrement. La sécurité
est transversale.

---

# 14. Observabilité

Opérations critiques observables : logs ; métriques ; traces ; alertes. Chaque requête possède
un identifiant de corrélation.

---

# 15. Décisions d'architecture (ADR)

Toute décision structurante fait l'objet d'un ADR (ex. ADR-001 Neon PostgreSQL, ADR-002 Server
Actions, ADR-003 Architecture Feature-Based, ADR-004 Prisma ORM). Conservés dans `docs/adr/`.

---

# 16. Gouvernance

Toute évolution importante est revue par l'équipe architecture, respecte les standards, met à
jour la documentation. Les standards sont versionnés.

---

# 17. Anti-patterns

- ❌ Architecture monolithique non modulaire.
- ❌ Dépendances circulaires.
- ❌ Logique métier dans l'interface.
- ❌ Accès direct à Prisma depuis React.
- ❌ Services géants.
- ❌ Couplage fort entre modules.
- ❌ Duplication des règles métier.
- ❌ Modules sans propriétaire.

---

# 18. Checklist

- [ ] Domaine identifié.
- [ ] Cas d'usage défini.
- [ ] Dépendances vérifiées.
- [ ] Interfaces documentées.
- [ ] ADR créé si nécessaire.
- [ ] Sécurité validée.
- [ ] Tests exécutés.
- [ ] Documentation mise à jour.
- [ ] Revue d'architecture effectuée.
- [ ] Compatibilité vérifiée.

---

# Documents associés

- CLAUDE.md
- BACKEND-STANDARDS.md (STD-012)
- API-STANDARDS.md (STD-011)
- DDD-STANDARDS.md
- CLEAN-CODE-STANDARDS.md
- SECURITY-STANDARDS.md

---

# Fin du document
