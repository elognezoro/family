# Moteur d'abonnement, parrainage & rétrocessions — Phases 1 à 3

> Livrable préparatoire (audit, analyse des écarts, architecture) — **aucun code métier
> n'est encore écrit**, conformément à l'ordre d'exécution demandé (§41 de la spécification).
> L'implémentation (Phases 4 à 11) démarre après validation de ce document.

---

## PHASE 1 — AUDIT DE L'EXISTANT

Audit réalisé par 3 agents indépendants sur le code réel (parrainage, paiements, admin/infra).

### 1.1 Ce qui existe déjà et servira de socle

| Brique | État | Détail |
|---|---|---|
| **Code de parrainage par utilisateur** | ✅ Complet | `User.referralCode` unique (8 car.), généré à l'inscription (`routes/auth.js`) + rattrapage lazy (`services/referral.js`) |
| **Rattachement filleul → parrain** | ✅ Complet | Lien `/auth/register?ref=CODE` → `User.referredById`. **Strictement direct, 1 seul niveau** — déjà conforme §10 |
| **Page « Parrainage & gains »** | ✅ Complet | `views/referral.ejs` : code, lien, copie, WhatsApp, e-mail, filleuls, gains. Manquent : QR, SMS, Telegram, FB (§18) |
| **Commissions existantes (coaching)** | ✅ Complet | `Commission` : 10 % de la part plateforme sur missions (types `parent_payment`/`coach_accept`), écran admin de règlement (`/admin/commissions`), idempotence par `@@unique([missionId, type])` |
| **Codes promo** | ✅ Partiel | `PromoCode` (pct, usageMax, usageCount, expiration) consommés à 3 endroits — mais **aucun CRUD admin** |
| **Accès payant Formation** (venant d'être livré) | ✅ Complet | `FormationOffre` (formules admin : prix, durée, quota) + `FormationEnrollment` (versement mobile money déclaré : opérateur + référence + montant attendu, vérification humaine par l'admin, expiration, quota) |
| **RBAC admin** | ✅ Complet | Permissions `users/coaches/finance/formation` + super-admin |
| **Notifications** | ✅ Complet | E-mail (Resend), SMS (passerelle configurable), notifications in-app |
| **Serverless + Neon** | ✅ | Vercel (lambdas), pooling Neon, 1 cron quotidien existant (purge) |

### 1.2 Constats structurants (limites du socle)

1. **Les paiements sont déclaratifs, pas confirmés par un agrégateur.** `Payment.transactionId` est
   généré localement (`'TX-'+Date.now()`), sans statut de cycle de vie, sans webhook, sans signature.
   La « confirmation de paiement » réelle de la plateforme aujourd'hui, c'est **la vérification humaine
   par l'admin** (flux Formation). → Le moteur doit être conçu **agnostique de la source de
   confirmation** : la validation admin aujourd'hui, un webhook agrégateur (CinetPay/Wave/…) demain,
   appelant la même fonction de service idempotente.
2. **Aucun ledger, aucun portefeuille.** Les gains sont recalculés à la volée (`reduce` sur Commission).
   Pas de statuts fins, pas d'écritures inverses, pas d'historique de versements.
3. **Aucun paramètre commercial administrable ni historisé.** `referralPct`, tarifs, etc. sont codés
   en dur dans `config/app.js` ; `SiteStat` ne stocke que 2 réglages de purge, sans versionnage.
4. **Aucun audit log**, aucune historisation des actions admin sensibles.
5. **Aucun test automatisé** (pas même un framework installé) ; aucune protection CSRF ; pas de rate limiting.
6. **Faille existante repérée** : la commission `parent_payment` naît à la *réservation* (mission encore
   `pending`) et survit même si le coach refuse ; `usageCount` des promos est consommé avant la
   confirmation. → Le nouveau moteur ne reproduira pas ces patrons (validation d'abord, §11).
7. **1 graphique dans toute l'app** (accueil, Chart.js CDN) ; aucun export CSV/PDF.

---

## PHASE 2 — ANALYSE DES ÉCARTS (spec §1-§42 vs existant)

| Exigence de la spec | Existant | Écart |
|---|---|---|
| §1-§2 Paramètres administrables + historisés | ❌ codés en dur | **À créer** : politique commerciale versionnée |
| §3 Réduction ≠ rétrocession | Partiel (promo = réduction ; Commission = argent dû) | Formaliser les 2 mécanismes dans le moteur |
| §4-§5 3 premières places à −10 %, suite plein tarif | ❌ | **À créer** (slots promotionnels) |
| §6-§8 Plancher 3 000, plafond personnel `A − R ≥ M`, rétrocession partielle | ❌ | **À créer** (fonctions pures + contrôle transactionnel) |
| §10 Parrainage strictement direct | ✅ déjà 1 niveau | Conserver tel quel |
| §11 Filleul validé = payé et confirmé | ❌ (commission à la réservation) | Nouveau moteur : déclenchement à la **validation** uniquement |
| §12 Réservation concurrente des 3 places | ❌ | **À créer** (réservation avec TTL + transaction) |
| §13-§14 Portefeuille + ledger immuable | ❌ | **À créer** |
| §15 Versements configurables | Partiel (règlement déclaratif des commissions) | **À créer** : Payout avec statuts, minimum, limites |
| §16 Remboursements → écritures inverses | ❌ | **À créer** |
| §17-§19 Tableaux de bord utilisateur, partage, information filleul | Partiel (referral.ejs) | Étendre : QR, réseaux, progression, portefeuille, message filleul |
| §20-§25 Dashboard financier admin, RAR, marge, CAC, K | ❌ (compteurs simples) | **À créer** + snapshots quotidiens |
| §26-§28 Simulateur (préréglage 10 000 abonnés) | ❌ | **À créer** (fonctions pures réutilisées) |
| §29 Graphiques + exports | 1 graphique, 0 export | **À créer** (Chart.js déjà éprouvé ici + export CSV ; impression navigateur) |
| §30 Alertes de rentabilité | ❌ | **À créer** (évaluées au snapshot quotidien) |
| §31 Antifraude | ❌ | **À créer** (signaux + statuts + revue admin) |
| §34 Idempotence | Partiel (1 contrainte unique) | Généraliser : clés d'idempotence sur toute écriture financière |
| §35-§37 Tests automatisés | ❌ (aucun framework) | **À créer** : `node:test` (natif Node, zéro dépendance) |

**Réutilisé sans modification** : rattachement parrain/filleul, codes de parrainage, RBAC,
e-mail/SMS/notifications, flux de déclaration mobile money de la Formation, formules `FormationOffre`.

**Non touché** : le système de commissions **coaching** existant (10 % de la part plateforme sur les
missions) reste en l'état — le nouveau moteur concerne les **abonnements** et vit à côté.

---

## PHASE 3 — ARCHITECTURE PROPOSÉE

### 3.0 Décision de cadrage (à confirmer — voir questions en fin de document)

**L'« abonnement » = l'accès Formation.** Les `FormationOffre` deviennent les plans d'abonnement ;
le tarif facial initial de 10 000 FCFA est une formule de référence créée par l'admin (modifiable).
Le moteur est cependant conçu pour brancher demain d'autres produits d'abonnement.

### 3.1 Modèles de données (Prisma — tous ADDITIFS)

```
ReferralPolicy            ← politique commerciale VERSIONNÉE (§2, §42.18)
  id, version, basePriceRef, discountRate(‱), commissionRate(‱),
  discountedReferralsLimit, minimumNetCost, referralDepth(=1),
  payoutMinimum, payoutDailyLimit, payoutMonthlyLimit, rarTargetPct,
  alertThresholds(JSON), actif, effectiveFrom, createdById
  → chaque transaction stocke policyId + MONTANTS FIGÉS (jamais recalculés)

Subscription              ← une ligne PAR PÉRIODE d'abonnement (≠ FormationEnrollment qui
  id, userId, planId(FormationOffre), policyId, referralId?,        reste l'état d'accès)
  prixFacial, reduction, montantPaye, statut(pending|active|expired|cancelled|refunded),
  startedAt, expiresAt, idempotencyKey @unique

ReferralAttribution       ← filleul rattaché (étend l'existant sans le casser)
  id, parrainUserId, filleulUserId @unique, codeUtilise, statut(inscrit|paye|valide|fraude),
  subscriptionId?, slotPromo(1..3|null), validatedAt, signauxFraude(JSON)

ReferralPromotionSlot     ← les 3 places à −10 % (§12)
  id, parrainUserId, rang(1..3), statut(reserve|confirme|expire|libere),
  filleulUserId?, reservedAt, expiresAt(TTL), confirmedAt
  @@unique([parrainUserId, rang])  ← garantie « jamais plus de 3 » par contrainte DB
  Réservation à la déclaration de paiement (TTL 72 h — flux admin-vérifié) ;
  confirmation définitive DANS la transaction de validation ; libération auto à l'expiration.

FinancialWallet           ← cache dénormalisé par utilisateur (source de vérité = ledger)
  userId @unique, acquis, disponible, verse, enAttente, majAt

FinancialLedgerEntry      ← LEDGER IMMUABLE (§14) — aucune suppression, corrections par contre-écriture
  id, userId, type(REFERRAL_COMMISSION_CREATED|_VALIDATED|_AVAILABLE|PAYOUT_REQUESTED|
      PAYOUT_PROCESSING|PAYOUT_COMPLETED|PAYOUT_FAILED|REFERRAL_COMMISSION_CANCELLED|
      COMMISSION_REVERSED|REFUND_ADJUSTMENT|MANUAL_ADJUSTMENT),
  montant(signé, FCFA), devise('XOF'), taux, filleulSourceId?, subscriptionId?,
  payoutId?, referenceExterne?, motif?, statut, creePar(userId|'system'),
  idempotencyKey @unique, createdAt

Payout                    ← versement des rétrocessions (§15)
  id, userId, montant, frais, moyen(wave|orange|mtn|moov|virement),
  coordonneesBeneficiaire, statut(requested|processing|paid|failed|cancelled),
  requestedAt, processedAt, processedById, referenceExterne, motifEchec

FraudFlag                 ← signaux antifraude (§31)
  id, userId, type, severite, detail(JSON), statut(NORMAL|REVIEW|SUSPICIOUS|BLOCKED),
  createdAt, resolvedById, resolvedAt
  + User.fraudStatus (défaut NORMAL)

AuditLog                  ← traçabilité des actions sensibles (§42.11-12)
  id, acteurId, action, cibleType, cibleId, avant(JSON), apres(JSON), createdAt

ProfitabilitySnapshot     ← photo quotidienne des KPI (cron)
  id, jour @unique, caFacial, encaissements, reductions, retroAcquises, retroPayees,
  engagementsRestants, rar, rarMoyen, margeContributive, referralCac, coefK,
  abonnesActifs, nouveauxAbonnes, detail(JSON)

ProfitabilityScenario     ← simulateur (§26) — scénario « 10 000 abonnés » pré-enregistré
  id, nom, params(JSON), resultats(JSON), createdById, createdAt
```

`FormationEnrollment` reçoit un pointeur `subscriptionId?` (période courante) — rien d'autre ne change.

### 3.2 Services (logique 100 % côté serveur — §33, §42.13)

```
services/finance/
  regles.js        ← FONCTIONS PURES, testées isolément AVANT tout le reste (Phase 4) :
                     reductionFilleul(policy, rangSlot)
                     retrocessionTheorique(policy)              // = commissionRate × basePrice
                     capaciteRestante(paye, plancher, dejaAcquis) // = max(0, A − M − acquis)
                     retrocessionAccordee(theorique, capacite)  // = min(...)  → gère §8 partielle
                     coutEconomiqueNet(paye, retro)             // = A − R
                     rar(caFacial, reductions, retroAcquises)   // §21
                     margeContributive(rar, frais…)             // §23
                     referralCAC(reduction, retro, fraisVar)    // §24
                     coefficientK(pctParrains, moyFilleulsPayants) // §25
  abonnement.js    ← création/activation/expiration/renouvellement des Subscriptions
  parrainage.js    ← attribution, slots promotionnels (réservation TTL + confirmation transactionnelle)
  retrocession.js  ← LE point d'entrée unique « paiement confirmé » (idempotent) :
                     dans UNE transaction Prisma : activer l'abonnement, confirmer le slot,
                     calculer la rétrocession plafonnée, écrire le ledger, mettre à jour le wallet.
                     Appelé aujourd'hui par la validation admin, demain par un webhook agrégateur.
  payout.js        ← demandes de versement, contrôles (minimum, limites, délai), règlement
  rentabilite.js   ← snapshots quotidiens, KPI, alertes (§20-§25, §30)
  antifraude.js    ← signaux (§31), scoring, file de revue
```

### 3.3 Idempotence & concurrence (§12, §34)

- **Toute écriture financière** porte une `idempotencyKey` **unique en base**
  (ex. `COMM:{subscriptionId}` — un abonnement ne génère jamais 2 rétrocessions).
- La validation « paiement confirmé » utilise le patron déjà éprouvé dans la Formation :
  `updateMany({ where: { id, statut: 'pending' } })` → une seule des requêtes concurrentes gagne.
- Les 3 places promotionnelles sont garanties par `@@unique([parrainUserId, rang])` +
  réservation TTL + confirmation dans la transaction de validation.
- Le plafond du parrain est recontrôlé **dans la transaction** (lecture des rétrocessions acquises
  + écriture) — jamais d'après un solde caché.

### 3.4 Parcours utilisateur

1. **Filleul** clique le lien → à l'inscription, information transparente (§19) : place promo
   disponible → « Vous payez 9 000 au lieu de 10 000 » ; sinon message « avantages déjà attribués ».
2. Il choisit sa formule → le prix affiché intègre la réduction parrainage si un slot est réservé
   → il paie par mobile money et **déclare** son versement (flux Formation existant).
3. **Admin** vérifie la réception → « Paiement reçu, activer » → transaction unique :
   abonnement actif, slot confirmé, rétrocession du parrain créée (plafonnée §6-§8), ledger, wallet,
   notifications parrain + filleul.
4. **Parrain** voit dans « Mon parrainage » : gains acquis/disponibles/versés, capacité restante,
   barre de progression vers le plancher (§17), et demande son **versement** (numéro mobile money) ;
   l'admin traite le payout (statuts complets, référence externe).

### 3.5 Interfaces

- **Utilisateur** : extension de `views/referral.ejs` → onglets Abonnement / Parrainage
  (QR code SVG généré serveur, partage WhatsApp/Facebook/Messenger/Telegram/SMS/e-mail — messages
  administrables) / Rétrocessions (portefeuille) / Progression.
- **Admin** : nouvelle page `/admin/finance-parrainage` (permission `finance`) — KPI (RAR, RAR moyen
  avec badge vert/orange/rouge configurable, marge contributive, CAC, K), 10 graphiques (Chart.js,
  déjà utilisé sur l'accueil), exports CSV + impression, file des payouts, file antifraude,
  politique commerciale (versionnée), simulateur avec préréglage « 10 000 abonnés » (§27).

### 3.6 Tests (Phase 4 et Phase 10 — §35-§37)

Framework : **`node:test`** (natif Node 18+, aucune dépendance). Script `npm test`.
- Phase 4 : tests unitaires des fonctions pures (tous les cas §4-§8, §36, §37 : parrain à 10 000 →
  plafond 7 000 ; parrain à 9 000 → plafond 6 000 ; rétrocession partielle de 500 ; 4e/7e/8e filleul…).
- Phase 10 : tests d'intégration des flux (double validation concurrente, double webhook simulé,
  concurrence sur la 3e place, remboursement → contre-écriture, auto-parrainage bloqué…).

### 3.7 Ordre d'implémentation proposé (Phases 4 → 11)

| Phase | Contenu | Livraison |
|---|---|---|
| 4 | `regles.js` + tests unitaires complets | PR dédiée (aucun risque) |
| 5 | Migrations additives (10 tables) | Autorisation demandée avant application |
| 6 | Services + routes (abonnement, parrainage, rétrocession, wallet) | PR + aperçu |
| 7 | Payouts + remboursements/contre-écritures | même PR |
| 8 | Interfaces utilisateur + admin + simulateur | PR + aperçu |
| 9 | Antifraude + alertes | PR |
| 10 | Tests d'intégration complets | CI locale |
| 11 | Rapport de validation (tests, hypothèses, scénario 10 000, RAR simulé) | avant tout « publie » |

---

## QUESTIONS À TRANCHER AVANT LA PHASE 4

1. **Périmètre** : l'« abonnement » du moteur = l'accès **Formation** (recommandé — c'est le seul
   produit à abonnement ; les formules admin existantes deviennent les plans) ?
2. **Coexistence** : l'actuel système de commissions **coaching** (10 % de la part plateforme sur les
   missions) reste inchangé à côté du nouveau moteur (recommandé) ?
3. **Cumul réduction parrainage × code promo** : recommandation **non cumulable** (le plus avantageux
   s'applique) — sinon le RAR se dégrade doublement. Confirmer ?
4. **Versements** : traitement **manuel par l'admin** dans un premier temps (l'admin envoie le mobile
   money puis enregistre la référence — comme les commissions actuelles), l'architecture restant prête
   pour un agrégateur (CinetPay/Wave API) plus tard (recommandé) ?
