// Migration n° 19 — intégrité du scrutin (élection AIDUS)
//   1. Table JournalElection : journal des actions du super admin (et des opérations
//      automatiques), chaîné par empreintes, impossible à modifier ou à vider.
//   2. MembreBureau.role ('bureau' | 'candidat') et MembreBureau.candidatId : accès des
//      candidats et de leurs représentants au journal.
//   3. Verrous de base de données (valables quel que soit le code qui s'exécute) :
//      - un vote émis le jour du scrutin (après la fin des tests et l'ouverture) ne peut être
//        ni supprimé ni modifié (seule la pièce jointe peut être retirée après vérification) ;
//      - aucun bulletin ne peut être retiré une fois de tels votes émis ; une mise à jour de
//        l'urne ne peut que permuter les bulletins (décompte par candidat inchangé) ;
//      - à la validation de chaque transaction : autant de bulletins que d'émargements ;
//      - candidats verrouillés dès l'heure d'ouverture ; heure d'ouverture figée et clôture
//        seulement prolongeable une fois des votes émis ; électeurs ayant voté non modifiables.
//   Aucune donnée existante n'est modifiée.
// Usage : node scripts/migrate-elections-integrite.js
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } } });
const sql = (s) => prisma.$executeRawUnsafe(s);

// Vote « réel » : émis après la fin des tests (reinitialiseLe) et après l'ouverture (debut)
const VOTE_REEL = (e, s) => `${s}."reinitialiseLe" IS NOT NULL AND ${e}."voteLe" >= ${s}."reinitialiseLe" AND ${e}."voteLe" >= ${s}."debut"`;

(async () => {
  console.log('Utilisateurs AVANT :', await prisma.user.count());

  await sql(`CREATE TABLE IF NOT EXISTS "JournalElection" (
    "id" TEXT NOT NULL, "scrutinId" TEXT NOT NULL,
    "acteur" TEXT NOT NULL, "acteurId" TEXT, "action" TEXT NOT NULL, "details" TEXT, "ip" TEXT,
    "precedent" TEXT, "empreinte" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "JournalElection_pkey" PRIMARY KEY ("id")
  )`);
  await sql(`CREATE INDEX IF NOT EXISTS "JournalElection_scrutinId_createdAt_idx" ON "JournalElection"("scrutinId", "createdAt")`);
  await sql(`ALTER TABLE "MembreBureau" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'bureau'`);
  await sql(`ALTER TABLE "MembreBureau" ADD COLUMN IF NOT EXISTS "candidatId" TEXT`);
  console.log('OK : JournalElection, MembreBureau.role, MembreBureau.candidatId');

  // 1. Journal : ni modification, ni suppression, ni vidage
  await sql(`CREATE OR REPLACE FUNCTION election_journal_immuable() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      RAISE EXCEPTION 'Journal de l''élection : les entrées ne peuvent être ni modifiées ni supprimées';
    END $$`);
  await sql(`DROP TRIGGER IF EXISTS journal_election_immuable ON "JournalElection"`);
  await sql(`CREATE TRIGGER journal_election_immuable BEFORE UPDATE OR DELETE ON "JournalElection" FOR EACH ROW EXECUTE FUNCTION election_journal_immuable()`);
  await sql(`DROP TRIGGER IF EXISTS journal_election_sans_vidage ON "JournalElection"`);
  await sql(`CREATE TRIGGER journal_election_sans_vidage BEFORE TRUNCATE ON "JournalElection" FOR EACH STATEMENT EXECUTE FUNCTION election_journal_immuable()`);

  // 2. Émargement d'un vote réel : ni suppression, ni modification (sauf la pièce jointe)
  await sql(`CREATE OR REPLACE FUNCTION election_emargement_protege() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE s RECORD;
    BEGIN
      SELECT "debut", "reinitialiseLe" INTO s FROM "Scrutin" WHERE "id" = OLD."scrutinId";
      IF FOUND AND s."reinitialiseLe" IS NOT NULL AND OLD."voteLe" >= s."reinitialiseLe" AND OLD."voteLe" >= s."debut" THEN
        IF TG_OP = 'DELETE' THEN
          RAISE EXCEPTION 'Vote émis le jour du scrutin : son émargement ne peut pas être supprimé';
        END IF;
        IF NEW."scrutinId" IS DISTINCT FROM OLD."scrutinId" OR NEW."electeurId" IS DISTINCT FROM OLD."electeurId"
          OR NEW."cni" IS DISTINCT FROM OLD."cni" OR NEW."email" IS DISTINCT FROM OLD."email"
          OR NEW."mode" IS DISTINCT FROM OLD."mode" OR NEW."voteLe" IS DISTINCT FROM OLD."voteLe"
          OR NEW."ip" IS DISTINCT FROM OLD."ip" OR NEW."terminal" IS DISTINCT FROM OLD."terminal" THEN
          RAISE EXCEPTION 'Vote émis le jour du scrutin : son émargement ne peut pas être modifié';
        END IF;
      END IF;
      IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
      RETURN NEW;
    END $$`);
  await sql(`DROP TRIGGER IF EXISTS emargement_protege ON "Emargement"`);
  await sql(`CREATE TRIGGER emargement_protege BEFORE UPDATE OR DELETE ON "Emargement" FOR EACH ROW EXECUTE FUNCTION election_emargement_protege()`);

  // 3. Bulletins : aucune suppression dès qu'un vote réel existe
  await sql(`CREATE OR REPLACE FUNCTION election_bulletins_non_retires() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM (SELECT DISTINCT "scrutinId" FROM anciens) a
        JOIN "Scrutin" s ON s."id" = a."scrutinId"
        JOIN "Emargement" e ON e."scrutinId" = s."id"
        WHERE ${VOTE_REEL('e', 's')}
      ) THEN
        RAISE EXCEPTION 'Des votes ont été émis le jour du scrutin : aucun bulletin ne peut être retiré de l''urne';
      END IF;
      RETURN NULL;
    END $$`);
  await sql(`DROP TRIGGER IF EXISTS bulletins_non_retires ON "Bulletin"`);
  await sql(`CREATE TRIGGER bulletins_non_retires AFTER DELETE ON "Bulletin" REFERENCING OLD TABLE AS anciens FOR EACH STATEMENT EXECUTE FUNCTION election_bulletins_non_retires()`);

  // 4. Bulletins : une mise à jour ne peut que permuter les bulletins (décompte inchangé)
  await sql(`CREATE OR REPLACE FUNCTION election_decompte_inchange() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF EXISTS (
        (SELECT "scrutinId", "candidatId", count(*) FROM anciens GROUP BY 1, 2
          EXCEPT SELECT "scrutinId", "candidatId", count(*) FROM nouveaux GROUP BY 1, 2)
        UNION ALL
        (SELECT "scrutinId", "candidatId", count(*) FROM nouveaux GROUP BY 1, 2
          EXCEPT SELECT "scrutinId", "candidatId", count(*) FROM anciens GROUP BY 1, 2)
      ) THEN
        RAISE EXCEPTION 'Urne : le décompte des bulletins par candidat ne peut pas être modifié';
      END IF;
      RETURN NULL;
    END $$`);
  await sql(`DROP TRIGGER IF EXISTS decompte_inchange ON "Bulletin"`);
  await sql(`CREATE TRIGGER decompte_inchange AFTER UPDATE ON "Bulletin" REFERENCING OLD TABLE AS anciens NEW TABLE AS nouveaux FOR EACH STATEMENT EXECUTE FUNCTION election_decompte_inchange()`);

  // 5. À la validation : autant de bulletins que d'émargements (pas de bulletin sans émargement)
  await sql(`CREATE OR REPLACE FUNCTION election_urne_coherente() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE nb INT; ne INT;
    BEGIN
      SELECT count(*) INTO nb FROM "Bulletin" WHERE "scrutinId" = NEW."scrutinId";
      SELECT count(*) INTO ne FROM "Emargement" WHERE "scrutinId" = NEW."scrutinId";
      IF nb <> ne THEN
        RAISE EXCEPTION 'Urne incohérente : % bulletin(s) pour % émargement(s)', nb, ne;
      END IF;
      RETURN NULL;
    END $$`);
  await sql(`DROP TRIGGER IF EXISTS bulletin_urne_coherente ON "Bulletin"`);
  await sql(`CREATE CONSTRAINT TRIGGER bulletin_urne_coherente AFTER INSERT ON "Bulletin" DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION election_urne_coherente()`);
  await sql(`DROP TRIGGER IF EXISTS emargement_urne_coherente ON "Emargement"`);
  await sql(`CREATE CONSTRAINT TRIGGER emargement_urne_coherente AFTER INSERT ON "Emargement" DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION election_urne_coherente()`);

  // 6. Candidats verrouillés dès l'heure d'ouverture
  await sql(`CREATE OR REPLACE FUNCTION election_candidats_verrouilles() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE d TIMESTAMP(3);
    BEGIN
      SELECT "debut" INTO d FROM "Scrutin" WHERE "id" = (CASE WHEN TG_OP = 'DELETE' THEN OLD."scrutinId" ELSE NEW."scrutinId" END);
      IF d IS NOT NULL AND (now() AT TIME ZONE 'UTC') >= d THEN
        RAISE EXCEPTION 'Vote ouvert : les candidats ne peuvent plus être ajoutés, modifiés ni retirés';
      END IF;
      IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
      RETURN NEW;
    END $$`);
  await sql(`DROP TRIGGER IF EXISTS candidats_verrouilles ON "ScrutinCandidat"`);
  await sql(`CREATE TRIGGER candidats_verrouilles BEFORE INSERT OR UPDATE OR DELETE ON "ScrutinCandidat" FOR EACH ROW EXECUTE FUNCTION election_candidats_verrouilles()`);

  // 7. Scrutin : une fois des votes réels émis, ouverture figée, clôture seulement prolongeable
  await sql(`CREATE OR REPLACE FUNCTION election_scrutin_protege() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF EXISTS (SELECT 1 FROM "Emargement" e WHERE e."scrutinId" = OLD."id"
                 AND OLD."reinitialiseLe" IS NOT NULL AND e."voteLe" >= OLD."reinitialiseLe" AND e."voteLe" >= OLD."debut") THEN
        IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Des votes ont été émis : le scrutin ne peut pas être supprimé'; END IF;
        IF NEW."debut" IS DISTINCT FROM OLD."debut" THEN RAISE EXCEPTION 'Des votes ont été émis : l''heure d''ouverture ne peut plus changer'; END IF;
        IF NEW."fin" < OLD."fin" THEN RAISE EXCEPTION 'Des votes ont été émis : la clôture ne peut pas être avancée'; END IF;
        IF NEW."reinitialiseLe" IS DISTINCT FROM OLD."reinitialiseLe" THEN RAISE EXCEPTION 'Des votes ont été émis : l''espace de vote ne peut plus être réinitialisé'; END IF;
      END IF;
      IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
      RETURN NEW;
    END $$`);
  await sql(`DROP TRIGGER IF EXISTS scrutin_protege ON "Scrutin"`);
  await sql(`CREATE TRIGGER scrutin_protege BEFORE UPDATE OR DELETE ON "Scrutin" FOR EACH ROW EXECUTE FUNCTION election_scrutin_protege()`);

  // 8. Électeur ayant voté (vote réel) : identité non modifiable
  await sql(`CREATE OR REPLACE FUNCTION election_electeur_protege() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN
      IF (NEW."scrutinId", NEW."civilite", NEW."nom", NEW."prenom", NEW."classe", NEW."anneeEntree", NEW."anneeDiplome", NEW."arriveeEn")
           IS DISTINCT FROM (OLD."scrutinId", OLD."civilite", OLD."nom", OLD."prenom", OLD."classe", OLD."anneeEntree", OLD."anneeDiplome", OLD."arriveeEn")
         AND EXISTS (SELECT 1 FROM "Emargement" e JOIN "Scrutin" s ON s."id" = e."scrutinId"
                     WHERE e."electeurId" = OLD."id" AND ${VOTE_REEL('e', 's')}) THEN
        RAISE EXCEPTION 'Cet électeur a voté le jour du scrutin : son identité ne peut plus être modifiée';
      END IF;
      RETURN NEW;
    END $$`);
  await sql(`DROP TRIGGER IF EXISTS electeur_protege ON "Electeur"`);
  await sql(`CREATE TRIGGER electeur_protege BEFORE UPDATE ON "Electeur" FOR EACH ROW EXECUTE FUNCTION election_electeur_protege()`);
  console.log('OK : verrous (journal, émargements, bulletins, urne, candidats, scrutin, électeurs)');

  console.log('Utilisateurs APRÈS :', await prisma.user.count());
  await prisma.$disconnect();
})().catch(async (e) => { console.error('ÉCHEC :', e.message); await prisma.$disconnect(); process.exit(1); });
