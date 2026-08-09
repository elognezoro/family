# Rapport de validation — moteur d'abonnement, parrainage & rétrocessions

> Phase 11 de l'ordre d'exécution (§41). État au moment de la livraison en aperçu.
> **Aucune mise en production sans validation explicite.**

## 1. Tests réussis

### Tests unitaires des fonctions financières pures — `npm test` : **15/15 ✓**
Tous les cas de référence de la spécification :
- §4 filleuls 1-3 (réduction 1 000, paiement 9 000, rétrocession 1 000) ; §5 filleul 4+ (plein tarif, rétrocession maintenue)
- §7 cas A (payé 10 000 → capacité 7 000) et cas B (payé 9 000 → capacité 6 000) ; plafond fonction du montant payé, jamais d'un nombre fixe de filleuls
- §8 rétrocession partielle (acquis 6 500 → accordée 500)
- §36 : 7 filleuls → encaissements 67 000, rétrocessions 7 000, RAR 60 000, coût net 3 000, 8e = 0
- §37 : parrain à 9 000 → six rétrocessions de 1 000 puis 0
- §21-§25 RAR (89 M / 8 900), statuts vert-orange-rouge configurables, marge contributive (67 080 000), CAC (2 000 / 1 000 / 0), coefficient K
- §27-§28 scénario 10 000 abonnés : CA 100 M, encaissements 96 M, RAR 89 M, RAR moyen 8 900, conservation 89 %, résultat contributif indicatif 67 080 000
- §2 : les règles suivent la politique versionnée, aucune constante codée en dur

### Test financier de bout en bout (serveur réel + base réelle) : **32/32 ✓**
Parcours complet parrain + 8 filleuls (§36 étendu) :
- déclarations aux bons montants (3 × 9 000 puis 5 × 10 000 — places promotionnelles épuisées)
- rétrocessions 1 000 × 7 puis **0 au 8e** (plafond atteint, coût net = 3 000)
- **double validation concurrente** du 4e filleul → UNE seule écriture (claim conditionnel + idempotencyKey)
- ledger : exactement 7 écritures de commission
- §19 : le 9e filleul voit « avantages déjà attribués »
- versement : 5 000 demandés (disponible 7 000 → 2 000, en attente 5 000) puis réglé par l'admin (versé 5 000)
- remboursement du filleul 7 : contre-écriture −1 000 (acquis 7 000 → 6 000), historique intact, accès révoqué
- KPI /admin/finance, snapshot quotidien (cron), export ledger CSV, page /parrainage (portefeuille + progression + QR)

Données de test intégralement nettoyées après exécution (0 résidu).

## 2. Tests échoués
Aucun au moment de la livraison. (Un premier passage avait révélé un timeout des
transactions interactives Prisma sur la latence Neon : corrigé — pré-lectures hors
transaction, timeout 30 s, verrou de ligne par parrain — puis 32/32.)

## 3. Migrations
- n° 3 `scripts/migrate-parrainage.js` : **appliquée** — 11 tables + 2 colonnes, additive,
  idempotente, 266 utilisateurs avant = 266 après.

## 4. Hypothèses (validées en cours de session)
1. « Abonnement » = accès **Formation** ; les formules admin (`FormationOffre`) sont les plans.
2. Le système de commissions **coaching** existant reste inchangé, à côté du moteur.
3. Réduction parrainage et code promo **non cumulables** (la plus avantageuse s'applique).
4. Versements **manuels** par l'admin (référence enregistrée) ; architecture prête pour un
   agrégateur : le webhook appellera la même fonction idempotente `confirmerPaiement`.
5. La rétrocession requiert que le parrain ait lui-même un abonnement **actif** (le plancher
   se calcule sur SON montant payé — §6) ; sans abonnement actif : filleul compté dans les
   statistiques, pas de rétrocession.
6. Un remboursement (contre-écriture) libère mécaniquement de la capacité de rétrocession
   (le coût net du parrain remonte) — conforme à la formule `A − R ≥ M`.

## 5. Paramètres actifs (politique commerciale v1 — administrable, versionnée)
`basePriceRef 10 000 · discountRate 10 % · commissionRate 10 % · places 3 · plancher 3 000 ·
TTL réservation 72 h · versement minimum 1 000 · cible RAR moyen 8 500 (orange < 95 %) ·
profondeur 1 (strictement direct, non modifiable)`

## 6. Scénario 10 000 abonnés (simulateur, préréglage §27)
CA facial 100 000 000 · réductions 4 000 000 · encaissements 96 000 000 ·
rétrocessions (borne prudente) 7 000 000 · **RAR 89 000 000** · **RAR moyen 8 900 FCFA**
(≥ cible 8 500 ✓) · conservation 89 % · frais de paiement 2 % = 1 920 000 ·
charges configurées 20 000 000 → **résultat contributif indicatif ≈ 67 080 000 FCFA**
(pas un bénéfice comptable — charges réelles à saisir dans le simulateur).

## 6 bis. Revue adversariale multi-agents (avant livraison)

18 findings rapportés par 3 relecteurs indépendants (conformité financière, sécurité,
concurrence), chacun contre-vérifié par un agent sceptique : **17 confirmés, tous corrigés**
avant la livraison, puis test de bout en bout re-exécuté (**33/33 ✓**). Les plus notables :

| Gravité | Problème | Correctif |
|---|---|---|
| critique | Rétrocession calculée sur `basePriceRef` au lieu du **tarif facial de la formule du filleul** | assiette = `Subscription.prixFacial` du filleul |
| critique | La clé d'idempotence pouvait ressusciter une période annulée / d'une autre formule | clé par CONTENU (réf + formule + montant), activation uniquement depuis `pending`, refus des références déjà traitées |
| important | Réduction « à vie » aux renouvellements d'un filleul promotionnel | la place confirmée = avantage consommé UNE fois |
| important | Réduction encaissée sans place quand la réservation expirait avant la validation | re-réclamation atomique d'une place à la validation, sinon refus explicite |
| important | Plancher franchissable via contre-écritures d'anciennes périodes | les contre-écritures ne comptent que si elles annulent une commission de la période |
| important | Refus admin inconditionnel écrasant une validation concurrente | réclamation conditionnelle (`pending` seulement) + renvoi vers « Rembourser » |
| important | Plafonds de versement jour/mois contournables en concurrence | contrôles sous verrou de portefeuille, dans la transaction |
| important | Injection de formules dans les exports CSV | neutralisation `=+-@`, guillemets, suppression des sauts de ligne |
| important | Liaison enrollment↔période non atomique | transaction unique |
| mineurs (×8) | promo double-consommée, abonnements jamais « expired », délai de sécurité non appliqué, politique du parrain vs filleul, etc. | tous corrigés (balayage au cron, délai appliqué au retrait, plancher = politique DU PARRAIN, taux/assiette = transaction DU FILLEUL…) |

## 7. Risques identifiés / limites assumées
- **Paiements déclaratifs** : la « confirmation » est humaine (l'admin compare la référence
  mobile money à son relevé). Le moteur est prêt pour un agrégateur, non branché.
- **Antifraude** : signaux implémentés (auto-parrainage par e-mail normalisé, téléphone
  identique, référence de transaction dupliquée, numéro de versement partagé, rythme
  anormal, remboursement après commission) — pas d'empreinte d'appareil ni d'IP
  (non collectées à ce jour) ; décisions toujours humaines (§31).
- **Snapshots** : les graphiques se remplissent au fil des jours (cron 23 h 30 UTC).
- Vercel serverless : pas de verrou inter-lambda hors base — toute la sérialisation
  passe par Postgres (claims conditionnels, contraintes uniques, FOR UPDATE).
- Revue adversariale multi-agents exécutée avant livraison ; les findings confirmés
  sont corrigés ou consignés dans la PR.
