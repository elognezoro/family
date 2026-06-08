// EduWeb — Seed de la base de données
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed EduWeb…');

  // ─── Codes promo (10% → 100%) ───
  const promos = [
    { code: 'EDU10', pct: 10 },
    { code: 'EDU25', pct: 25 },
    { code: 'EDU50', pct: 50 },
    { code: 'EDU75', pct: 75 },
    { code: 'EDU100', pct: 100 },
  ];
  for (const p of promos) {
    await prisma.promoCode.upsert({
      where: { code: p.code },
      update: { pct: p.pct, actif: true },
      create: { code: p.code, pct: p.pct, actif: true },
    });
  }
  console.log(`  ✓ ${promos.length} codes promo`);

  const hash = (pwd) => bcrypt.hashSync(pwd, 10);

  // ─── Admin ───
  await prisma.user.upsert({
    where: { email: 'admin@eduweb.ci' },
    update: {},
    create: {
      email: 'admin@eduweb.ci',
      passwordHash: hash('Admin@12345'),
      name: 'Administrateur EduWeb',
      role: 'admin',
      gender: 'Homme',
      emailVerified: true,
    },
  });

  // ─── Parent de démo + famille + apprenant ───
  const parent = await prisma.user.upsert({
    where: { email: 'parent@eduweb.ci' },
    update: {},
    create: {
      email: 'parent@eduweb.ci',
      passwordHash: hash('Parent@12345'),
      name: 'Mme Koné',
      role: 'parent',
      gender: 'Femme',
      emailVerified: true,
    },
  });
  let family = await prisma.family.findFirst({ where: { ownerUserId: parent.id } });
  if (!family) {
    family = await prisma.family.create({ data: { ownerUserId: parent.id, label: 'Ma Famille' } });
    const learner = await prisma.learner.create({
      data: {
        familyId: family.id,
        sexe: 'F',
        age: 14,
        pays: 'ci',
        region: 'abidjan',
        commune: 'Cocody',
        quartier: 'Riviera 2',
        cycle: 'secondaire1',
        niveau: '3e',
      },
    });
    await prisma.need.create({
      data: { learnerId: learner.id, disciplineId: 's1_maths', mode: 'presentiel', heuresSemaine: 3 },
    });
    await prisma.need.create({
      data: { learnerId: learner.id, disciplineId: 's1_pc', mode: 'hybride', heuresSemaine: 2 },
    });
  }

  // ─── Coach de démo (validé + certifié + géolocalisé) ───
  const coach = await prisma.user.upsert({
    where: { email: 'coach.maths@eduweb.ci' },
    update: {},
    create: {
      email: 'coach.maths@eduweb.ci',
      passwordHash: hash('Coach@12345'),
      name: 'M. Traoré Ibrahim',
      role: 'coach',
      gender: 'Homme',
      phone: '+225 07 11 22 33 44',
      emailVerified: true,
    },
  });
  let profile = await prisma.coachProfile.findUnique({ where: { userId: coach.id } });
  if (!profile) {
    profile = await prisma.coachProfile.create({
      data: {
        userId: coach.id,
        pays: 'ci',
        region: 'abidjan',
        commune: 'Cocody',
        quartier: 'Angré 8e tranche',
        adresse: 'Près du carrefour Saint Jean',
        gpsLat: 5.3897,
        gpsLng: -3.9847,
        presentation:
          "Professeur de mathématiques avec 10 ans d'expérience. J'accompagne les élèves du collège et du lycée vers la réussite avec une méthode claire et progressive.",
        experience: '10 ans — Lycée Classique d’Abidjan, cours particuliers',
        statut: 'valide',
        certifie: true,
        note: 4.7,
        avisCount: 12,
      },
    });
    const niveaux = ['6e', '5e', '4e', '3e', '2nde', '1ere', 'tle'];
    for (const niveauId of niveaux) {
      await prisma.coachNiveau.create({ data: { profileId: profile.id, niveauId } });
    }
    for (const mode of ['presentiel', 'hybride']) {
      await prisma.coachMode.create({ data: { profileId: profile.id, mode } });
    }
    const disc = [
      { id: 's1_maths', tarif: 25000 },
      { id: 's2_maths', tarif: 30000 },
      { id: 's1_pc', tarif: 28000 },
    ];
    for (const d of disc) {
      await prisma.coachDiscipline.create({
        data: { profileId: profile.id, disciplineId: d.id, tarifMensuel: d.tarif },
      });
    }
    await prisma.avis.create({
      data: { coachProfileId: profile.id, auteurNom: 'Mme Koné', note: 5, commentaire: 'Excellent coach, ma fille a beaucoup progressé.' },
    });
  }

  // ─── Second coach en attente (pour tester la validation admin) ───
  const coach2 = await prisma.user.upsert({
    where: { email: 'coach.lettres@eduweb.ci' },
    update: {},
    create: {
      email: 'coach.lettres@eduweb.ci',
      passwordHash: hash('Coach@12345'),
      name: 'Mlle Aya Brou',
      role: 'coach',
      gender: 'Femme',
      emailVerified: true,
    },
  });
  let profile2 = await prisma.coachProfile.findUnique({ where: { userId: coach2.id } });
  if (!profile2) {
    profile2 = await prisma.coachProfile.create({
      data: {
        userId: coach2.id,
        pays: 'ci',
        region: 'abidjan',
        commune: 'Yopougon',
        presentation: 'Spécialiste du français et de la littérature au collège.',
        statut: 'pending',
      },
    });
    await prisma.coachDiscipline.create({
      data: { profileId: profile2.id, disciplineId: 's1_francais', tarifMensuel: 20000 },
    });
  }

  // ─── Coachs de démo supplémentaires (vitrine accueil + carte) ───
  const extraCoaches = [
    {
      email: 'coach.pc@eduweb.ci', name: 'M. Koffi Yao', gender: 'Homme',
      commune: 'Cocody', quartier: 'Riviera Palmeraie', gpsLat: 5.358, gpsLng: -3.991,
      note: 4.9, avisCount: 18,
      presentation: 'Enseignant de Physique-Chimie passionné, j’aide les lycéens à maîtriser les sciences avec rigueur et clarté.',
      niveaux: ['2nde', '1ere', 'tle'],
      disc: [{ id: 's2_pc', tarif: 30000 }, { id: 's2_maths', tarif: 28000 }, { id: 's1_pc', tarif: 22000 }],
    },
    {
      email: 'coach.fr@eduweb.ci', name: 'Mme Aminata Cissé', gender: 'Femme',
      commune: 'Marcory', quartier: 'Zone 4', gpsLat: 5.296, gpsLng: -3.999,
      note: 4.6, avisCount: 9,
      presentation: 'Spécialiste du français et de l’anglais, j’accompagne les élèves du primaire au collège vers l’aisance à l’écrit comme à l’oral.',
      niveaux: ['cm1', 'cm2', '6e', '5e', '4e', '3e'],
      disc: [{ id: 's1_francais', tarif: 20000 }, { id: 's1_anglais', tarif: 20000 }, { id: 'pri_fr_lecture', tarif: 18000 }],
    },
  ];
  for (const ec of extraCoaches) {
    const u = await prisma.user.upsert({
      where: { email: ec.email },
      update: {},
      create: { email: ec.email, passwordHash: hash('Coach@12345'), name: ec.name, role: 'coach', gender: ec.gender, emailVerified: true },
    });
    const existing = await prisma.coachProfile.findUnique({ where: { userId: u.id } });
    if (!existing) {
      const p = await prisma.coachProfile.create({
        data: {
          userId: u.id, pays: 'ci', region: 'abidjan', commune: ec.commune, quartier: ec.quartier,
          gpsLat: ec.gpsLat, gpsLng: ec.gpsLng, presentation: ec.presentation,
          statut: 'valide', certifie: true, note: ec.note, avisCount: ec.avisCount,
        },
      });
      for (const niveauId of ec.niveaux) await prisma.coachNiveau.create({ data: { profileId: p.id, niveauId } });
      for (const mode of ['presentiel', 'hybride']) await prisma.coachMode.create({ data: { profileId: p.id, mode } });
      for (const d of ec.disc) await prisma.coachDiscipline.create({ data: { profileId: p.id, disciplineId: d.id, tarifMensuel: d.tarif } });
    }
  }

  console.log('  ✓ Comptes de démo : admin@eduweb.ci / parent@eduweb.ci / coach.maths@eduweb.ci');
  console.log('🌱 Seed terminé.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
