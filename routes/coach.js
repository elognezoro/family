const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');
const multer = require('multer');
const router = express.Router();

const prisma = require('../data/prisma-store');
const { go, requireRole } = require('../middleware/auth');
const niveauxData = require('../data/niveaux');
const disciplinesData = require('../data/disciplines');
const { countryName } = require('../data/countries');
const APP = require('../config/app');

router.use(requireRole('coach'));

// ─── Upload (Multer, max 25 Mo) ───
// Sur Vercel le système de fichiers est en lecture seule → on écrit dans /tmp
// (stockage éphémère, à remplacer par un stockage cloud ultérieurement).
const uploadDir = process.env.VERCEL ? os.tmpdir() : path.join(__dirname, '..', 'uploads');
try { if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /pdf|jpe?g|png|webp|doc|docx/i.test(path.extname(file.originalname));
    cb(ok ? null : new Error('Format non autorisé'), ok);
  },
});

async function getProfile(sessionUser) {
  const userId = sessionUser.id;
  let profile = await prisma.coachProfile.findUnique({
    where: { userId },
    include: { user: true, niveaux: true, disciplines: true, modes: true, documents: true, avis: true },
  });
  if (!profile) {
    if (sessionUser.role === 'coach') {
      // Vrai coach sans profil (cas limite) : on en crée un
      profile = await prisma.coachProfile.create({
        data: { userId, statut: 'pending' },
        include: { user: true, niveaux: true, disciplines: true, modes: true, documents: true, avis: true },
      });
    } else {
      // Admin en consultation (« Vue Coach ») : profil temporaire NON persisté
      const user = await prisma.user.findUnique({ where: { id: userId } });
      profile = {
        id: null, userId, user, statut: 'pending', certifie: false, motifRefus: null,
        pays: 'ci', region: null, commune: null, quartier: null, adresse: null,
        gpsLat: null, gpsLng: null, presentation: null, experience: null, note: 0, avisCount: 0,
        niveaux: [], disciplines: [], modes: [], documents: [], avis: [],
      };
    }
  }
  return profile;
}

// Tarif moyen FCFA
function tarifMoyen(disciplines) {
  if (!disciplines.length) return 0;
  return Math.round(disciplines.reduce((s, d) => s + (d.tarifMensuel || 0), 0) / disciplines.length);
}

// NOM en MAJUSCULES, Prénom(s) capitalisé(s)
function formatName(nom, prenom) {
  const NOM = (nom || '').trim().toUpperCase();
  const Prenom = (prenom || '')
    .trim().split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
  return [NOM, Prenom].filter(Boolean).join(' ') || NOM || Prenom;
}

// Sépare un "name" stocké en { nom, prenom } : les mots tout en majuscules de tête = NOM
function parseName(name) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  // Ignore les civilités de tête (M., Mme, Mlle, Dr, Pr…)
  const TITLES = /^(m|mr|mme|mlle|dr|pr|prof)\.?$/i;
  while (words.length && TITLES.test(words[0])) words.shift();
  if (!words.length) return { nom: '', prenom: '' };
  const nomWords = [];
  let i = 0;
  while (i < words.length && words[i] === words[i].toUpperCase() && /\p{L}/u.test(words[i])) {
    nomWords.push(words[i]); i++;
  }
  if (nomWords.length === 0) { nomWords.push(words[0]); i = 1; } // repli
  return { nom: nomWords.join(' '), prenom: words.slice(i).join(' ') };
}

// Suggestions de présentation générées à partir du profil (« en référence au CV »)
function buildSuggestions(profile) {
  const disc = [...new Set(profile.disciplines.map((d) => disciplinesData.disciplineLabel(d.disciplineId)))];
  const niv = [...new Set(profile.niveaux.map((n) => niveauxData.niveauLabel(n.niveauId)))];
  const zone = profile.commune || profile.region || 'votre zone';
  const discTxt = disc.length ? disc.join(', ') : 'plusieurs disciplines';
  const nivTxt = niv.length ? niv.join(', ') : 'différents niveaux';

  const presentation =
    `Coach pédagogue, j'accompagne les apprenants avec une méthode claire, progressive et bienveillante. ` +
    `J'interviens principalement en ${discTxt} pour les niveaux ${nivTxt}. ` +
    `Mon objectif : redonner confiance à chaque élève et ancrer durablement les apprentissages, à ${zone}.`;

  const experience =
    `Fort(e) d'une expérience dans l'enseignement et le soutien scolaire, j'ai accompagné de nombreux apprenants vers la réussite. ` +
    `Spécialité : ${discTxt}. Niveaux enseignés : ${nivTxt}. ` +
    `(Texte généré automatiquement à partir de votre profil — ajustez-le selon votre CV.)`;

  return { presentation, experience };
}

// ─── Tableau de bord coach ───
router.get('/', async (req, res) => {
  const profile = await getProfile(req.session.user);
  res.render('coach/dashboard', {
    title: 'Espace Coach — EduWeb',
    bodyClass: 'page-coach',
    profile,
    tarifMoyen: tarifMoyen(profile.disciplines),
    nameParts: parseName(profile.user.name),
    suggestions: buildSuggestions(profile),
    niveauxData,
    disciplinesData,
    countryName,
    APP,
  });
});

// ─── 1. Identité ───
router.post('/identite', async (req, res) => {
  const { nom, prenom, gender, phone } = req.body;
  const name = formatName(nom, prenom);
  await prisma.user.update({
    where: { id: req.session.user.id },
    data: { name: name || undefined, gender: gender || null, phone: phone || null },
  });
  if (name) req.session.user.name = name;
  return go(res, '/coach#identite', 'success', 'Identité mise à jour.');
});

// ─── 2. Zone d'intervention ───
router.post('/zone', async (req, res) => {
  const profile = await getProfile(req.session.user);
  const { pays, region, commune, quartier, adresse, gpsLat, gpsLng } = req.body;
  await prisma.coachProfile.update({
    where: { id: profile.id },
    data: {
      pays: pays || 'ci',
      region: region || null,
      commune: commune || null,
      quartier: quartier || null,
      adresse: adresse || null,
      gpsLat: gpsLat ? parseFloat(gpsLat) : null,
      gpsLng: gpsLng ? parseFloat(gpsLng) : null,
    },
  });
  return go(res, '/coach#zone', 'success', 'Zone d’intervention mise à jour.');
});

// ─── 3. Compétences pédagogiques (niveaux + modes) ───
router.post('/competences', async (req, res) => {
  const profile = await getProfile(req.session.user);
  const niveaux = [].concat(req.body.niveaux || []).filter(Boolean);
  const modes = [].concat(req.body.modes || []).filter(Boolean);

  await prisma.coachNiveau.deleteMany({ where: { profileId: profile.id } });
  await prisma.coachMode.deleteMany({ where: { profileId: profile.id } });

  for (const niveauId of niveaux) {
    await prisma.coachNiveau.create({ data: { profileId: profile.id, niveauId } });
  }
  for (const mode of modes) {
    await prisma.coachMode.create({ data: { profileId: profile.id, mode } });
  }
  return go(res, '/coach#competences', 'success', 'Compétences mises à jour.');
});

// ─── 4. Disciplines & tarifs ───
router.post('/disciplines', async (req, res) => {
  const profile = await getProfile(req.session.user);
  // req.body.discipline = liste d'ids cochés ; tarif_<id> = tarif
  const selected = [].concat(req.body.discipline || []).filter(Boolean);

  const MAX = APP.TARIF_COACH_MAX; // plafond 30 000 FCFA
  let capped = false;
  await prisma.coachDiscipline.deleteMany({ where: { profileId: profile.id } });
  for (const disciplineId of selected) {
    const d = disciplinesData.getDiscipline(disciplineId);
    const cycle = d ? d.cycle : '';
    // Préscolaire & primaire : un tarif unique par cycle ; secondaire : par discipline
    const raw = (cycle === 'prescolaire' || cycle === 'primaire')
      ? req.body[`tarif_cycle_${cycle}`]
      : req.body[`tarif_${disciplineId}`];
    let tarif = parseInt(raw || String(MAX), 10);
    if (isNaN(tarif) || tarif < 0) tarif = MAX;
    if (tarif > MAX) { tarif = MAX; capped = true; } // prétention plafonnée
    await prisma.coachDiscipline.create({
      data: { profileId: profile.id, disciplineId, tarifMensuel: tarif },
    });
  }
  return go(res, '/coach#disciplines', capped ? 'warning' : 'success',
    capped
      ? `Disciplines enregistrées. Certains tarifs ont été plafonnés à ${APP.formatFCFA(MAX)} (maximum autorisé).`
      : 'Disciplines & tarifs mis à jour.');
});

// ─── 5. Présentation ───
router.post('/presentation', async (req, res) => {
  const profile = await getProfile(req.session.user);
  await prisma.coachProfile.update({
    where: { id: profile.id },
    data: {
      presentation: req.body.presentation || null,
      experience: req.body.experience || null,
    },
  });
  return go(res, '/coach#presentation', 'success', 'Présentation mise à jour.');
});

// ─── 6. Documents ───
router.post('/documents', upload.single('document'), async (req, res) => {
  try {
    const profile = await getProfile(req.session.user);
    if (!req.file) return go(res, '/coach#documents', 'error', 'Aucun fichier reçu.');
    await prisma.coachDocument.create({
      data: {
        profileId: profile.id,
        type: req.body.type || 'cv',
        filename: req.file.originalname,
        url: '/uploads/' + req.file.filename,
        status: 'pending',
      },
    });
    return go(res, '/coach#documents', 'success', 'Document téléversé.');
  } catch (e) {
    console.error(e);
    return go(res, '/coach#documents', 'error', e.message || 'Téléversement impossible.');
  }
});

router.post('/documents/:id/delete', async (req, res) => {
  const profile = await getProfile(req.session.user);
  const doc = await prisma.coachDocument.findUnique({ where: { id: req.params.id } });
  if (doc && doc.profileId === profile.id) {
    const filePath = path.join(__dirname, '..', doc.url);
    fs.existsSync(filePath) && fs.unlinkSync(filePath);
    await prisma.coachDocument.delete({ where: { id: req.params.id } });
  }
  return go(res, '/coach#documents', 'success', 'Document supprimé.');
});

// ─── Soumettre le profil à validation ───
router.post('/submit', async (req, res) => {
  const profile = await getProfile(req.session.user);
  if (profile.statut === 'refuse' || profile.statut === 'pending') {
    await prisma.coachProfile.update({
      where: { id: profile.id },
      data: { statut: 'pending', motifRefus: null },
    });
  }
  return go(res, '/coach', 'info', 'Profil soumis. Un administrateur l’examinera prochainement.');
});

// Photo de profil
router.post('/photo', upload.single('photo'), async (req, res) => {
  if (req.file) {
    const url = '/uploads/' + req.file.filename;
    await prisma.user.update({ where: { id: req.session.user.id }, data: { photo: url } });
    req.session.user.photo = url;
  }
  return go(res, '/coach', 'success', 'Photo mise à jour.');
});

module.exports = router;
