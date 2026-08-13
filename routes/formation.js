// EduWeb Formation — tests psychotechniques (exerciseurs objectifs)
//
// Parcours : découverte publique → demande d'inscription (validée par un
// administrateur) → théorie & astuces → tests (entraînement ou conditions de
// concours), questions mélangées à chaque tentative et par utilisateur, en
// difficulté croissante → score + diagnostic de performance par IA +
// conseils de perspectives.

const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go, requireAuth } = require('../middleware/auth');
const bank = require('../data/formation');
const meta = require('../data/formation/meta');
const fpBank = require('../data/formation/fp');
const fpMeta = require('../data/formation/fp/meta');
const fpCours = require('../data/formation/fp/cours.json');
const fpJeux = require('../data/formation/fp/jeux-data');
const fpProgression = require('../services/fp-progression');
const scoring = require('../data/formation/scoring');

// Règles du cours à plat (jeu « Qui suis-je ? », fiches « À retenir »)
const FP_REGLES = fpCours.sequences.flatMap((s) => s.essentiels.map((e) => ({
  article: e.article,
  ref: 'Art. ' + e.article + (e.articleFin ? '-' + e.articleFin : ''),
  texte: e.texte,
  sequence: s.num,
})));
function fpRegle(article) {
  let couvrant = null;
  for (const r of FP_REGLES) {
    if (r.article === article) return r;
    const fin = r.ref.includes('-') ? parseInt(r.ref.split('-')[1], 10) : r.article;
    if (article >= r.article && article <= fin) couvrant = r;
  }
  return couvrant;
}
const diagnostic = require('../services/diagnostic');
const webauthn = require('../services/webauthn');
const email = require('../services/email');
const APP = require('../config/app');
const parrainageFin = require('../services/finance/parrainage');
const politiqueFin = require('../services/finance/politique');
const antifraude = require('../services/finance/antifraude');

// Fenêtre de validité de la vérification biométrique avant un test (10 min)
const BIOMETRIE_TTL_MS = 10 * 60 * 1000;

// ─── Aides ───
async function enrollmentOf(userId) {
  if (!userId) return null;
  try {
    return await prisma.formationEnrollment.findUnique({ where: { userId } });
  } catch (e) {
    // Table absente (migration pas encore appliquée) : la page reste consultable
    console.warn('[formation] enrollment indisponible :', e.message);
    return null;
  }
}

function isApproved(enr) { return !!(enr && enr.statut === 'approuve'); }
function isExpired(enr) { return !!(enr && enr.expiresAt && new Date(enr.expiresAt) < new Date()); }

// Formules d'accès actives (tarifs fixés par l'administrateur)
async function offresActives() {
  try {
    return await prisma.formationOffre.findMany({ where: { actif: true }, orderBy: [{ ordre: 'asc' }, { prix: 'asc' }] });
  } catch (e) { return []; }
}

// Quota de tests restant pour un inscrit (null = illimité)
async function quotaRestant(enr) {
  if (!enr || !enr.offreId) return null;
  try {
    const offre = await prisma.formationOffre.findUnique({ where: { id: enr.offreId } });
    if (!offre || offre.quotaTentatives == null) return null;
    const utilises = await prisma.quizAttempt.count({
      where: { userId: enr.userId, createdAt: { gte: enr.approvedAt || enr.createdAt } },
    });
    return Math.max(0, offre.quotaTentatives - utilises);
  } catch (e) { return null; }
}

// Réservé aux inscrits validés ET à l'accès en cours de validité
// (les admins ont accès pour contrôle)
async function requireApproved(req, res, next) {
  const user = req.session.user;
  if (!user) return go(res, '/auth/login', 'warning', 'Veuillez vous connecter pour continuer.');
  if (user.role === 'admin') { req.formationEnrollment = null; return next(); }
  const enr = await enrollmentOf(user.id);
  if (!isApproved(enr)) {
    return go(res, '/formation', 'warning', 'L’accès à la Formation est réservé : payez une formule ou demandez une autorisation, puis attendez la validation d’un administrateur.');
  }
  if (isExpired(enr)) {
    return go(res, '/formation', 'warning', 'Votre accès à la Formation a expiré. Renouvelez votre formule pour continuer.');
  }
  req.formationEnrollment = enr;
  next();
}

// ─── Accueil de la section Formation ───
router.get('/', async (req, res) => {
  const user = req.session.user || null;
  const enr = user ? await enrollmentOf(user.id) : null;
  const offres = await offresActives();
  const expire = isExpired(enr);
  const restant = isApproved(enr) && !expire ? await quotaRestant(enr) : null;

  // §19 — information transparente du filleul avant paiement (pas encore de
  // demande en cours, ou demande refusée / accès expiré → il va (re)payer)
  let infoParrainage = null;
  const vaPayer = user && (!enr || enr.statut === 'refuse' || (enr.statut === 'approuve' && expire));
  if (vaPayer) {
    try {
      const info = await parrainageFin.infoFilleul(user.id);
      if (info && info.aParrain) infoParrainage = info;
    } catch (e) { /* moteur non migré */ }
  }

  // Progression par catégorie (pour les inscrits validés)
  let progression = null;
  let dernieres = [];
  if (user && ((isApproved(enr) && !expire) || user.role === 'admin')) {
    try {
      const attempts = await prisma.quizAttempt.findMany({
        where: { userId: user.id, statut: 'termine' },
        orderBy: { createdAt: 'desc' },
      });
      progression = {};
      for (const c of meta.CATEGORIES) {
        const das = attempts.filter((a) => a.categorie === c.id);
        // Le « meilleur » score n'agrège pas les modes : un entraînement (corrections
        // affichées) ne vaut pas un test en conditions de concours.
        const exam = das.filter((a) => a.mode === 'examen');
        const entr = das.filter((a) => a.mode !== 'examen');
        const pctMax = (arr) => (arr.length ? Math.max(...arr.map((a) => Math.round((a.score / a.nbQuestions) * 100))) : null);
        progression[c.id] = {
          tentatives: das.length,
          meilleurExamen: pctMax(exam),
          meilleurEntrainement: pctMax(entr),
        };
      }
      dernieres = attempts.slice(0, 5);
    } catch (e) { /* tables pas encore migrées */ }
  }

  // Lien de parrainage Formation : /formation?ref=CODE → bannière d'invitation
  // pour le visiteur ; son inscription (rôle Candidat proposé) portera le code.
  let refInvite = null;
  const refQuery = (req.query.ref || '').trim();
  if (refQuery && !user) {
    const parrain = await prisma.user.findUnique({ where: { referralCode: refQuery }, select: { name: true } }).catch(() => null);
    if (parrain) refInvite = { code: refQuery, parrainNom: parrain.name };
  }

  // Lien promo : /formation?promo=CODE → le code valide est pré-rempli dans le
  // formulaire de déclaration (et affiché au visiteur non connecté).
  let promoPrefill = null;
  const promoQuery = (req.query.promo || '').trim().toUpperCase();
  if (promoQuery) {
    const promo = await prisma.promoCode.findUnique({ where: { code: promoQuery } }).catch(() => null);
    if (promo && promo.actif && (!promo.expiration || promo.expiration > new Date())
      && (promo.usageMax == null || promo.usageCount < promo.usageMax)) {
      promoPrefill = { code: promo.code, pct: promo.pct };
    }
  }

  res.render('formation/accueil', {
    title: 'Formation — Tests psychotechniques — EduWeb',
    bodyClass: 'page-formation',
    categories: meta.CATEGORIES,
    niveaux: meta.NIVEAUX,
    promoPrefill,
    refInvite,
    enrollment: enr,
    approved: user && ((isApproved(enr) && !expire) || user.role === 'admin'),
    expire,
    quotaRestant: restant,
    infoParrainage,
    offres,
    operateurs: APP.operateurs,
    numeroPaiement: APP.contact.phone,
    progression,
    dernieres,
    totalQuestions: bank.totalCount(),
    totalFp: fpBank.totalCount(),
  });
});

// ─── Demande d'accès ───
// Deux voies : « paye » (formule choisie + versement mobile money déclaré,
// vérifié par l'admin) ou « autorise » (autorisation gratuite à la discrétion
// de l'administrateur système).
router.post('/inscription', requireAuth, async (req, res) => {
  const user = req.session.user;
  const { niveau, objectif, type, offreId, operateur, refTransaction, promoCode } = req.body;
  if (!meta.niveau(niveau)) return go(res, '/formation', 'error', 'Choisissez un niveau valide.');

  const existing = await enrollmentOf(user.id);
  if (existing && existing.statut === 'approuve' && !isExpired(existing)) {
    return go(res, '/formation', 'success', 'Votre accès est déjà actif.');
  }
  if (existing && existing.statut === 'pending') return go(res, '/formation', 'warning', 'Votre demande est déjà en attente de validation.');

  // Champs propres à chaque voie
  const data = {
    niveau,
    objectif: (objectif || '').trim() || null,
    statut: 'pending',
    motifRefus: null,
    offreId: null,
    operateur: null,
    refTransaction: null,
    montantAttendu: null,
    promoCode: null,
    expiresAt: null,
  };

  let recapReduction = null;
  if (type === 'paye') {
    let offre = null;
    try { offre = await prisma.formationOffre.findUnique({ where: { id: offreId || '' } }); } catch (e) { /* below */ }
    if (!offre || !offre.actif) return go(res, '/formation', 'error', 'Choisissez une formule valide.');
    if (!APP.operateurs.some((o) => o.id === operateur)) return go(res, '/formation', 'error', 'Choisissez l’opérateur mobile money utilisé.');
    const ref = (refTransaction || '').trim();
    if (ref.length < 4) return go(res, '/formation', 'error', 'Indiquez la référence (ID) de votre versement mobile money.');

    // ─── Réductions NON CUMULABLES : parrainage (place promo) OU code promo —
    //     la plus avantageuse s'applique. ───
    let reductionParrainage = 0;
    let infoParrain = null;
    try {
      infoParrain = await parrainageFin.infoFilleul(user.id);
      if (infoParrain && infoParrain.aParrain && infoParrain.placeDisponible) {
        reductionParrainage = Math.round((offre.prix * infoParrain.tauxReduction) / 100);
      }
    } catch (e) { /* moteur non migré : pas de réduction parrainage */ }

    let reductionPromo = 0;
    const code = (promoCode || '').trim().toUpperCase();
    if (code) {
      const promo = await prisma.promoCode.findUnique({ where: { code } }).catch(() => null);
      const valide = promo && promo.actif && (!promo.expiration || promo.expiration > new Date())
        && (promo.usageMax == null || promo.usageCount < promo.usageMax);
      if (!valide) return go(res, '/formation', 'error', 'Code promo invalide ou expiré.');
      reductionPromo = Math.round((offre.prix * promo.pct) / 100);
    }

    let reduction = 0;
    let sourceReduction = null;
    if (reductionParrainage > 0 && reductionParrainage >= reductionPromo) {
      // Réserver la place promotionnelle (TTL) — en concurrence, le perdant retombe sur le promo/plein tarif
      try {
        const slot = await parrainageFin.reserverSlot(infoParrain.parrainUserId, user.id);
        if (slot) { reduction = reductionParrainage; sourceReduction = 'parrainage'; }
      } catch (e) { /* pas de place finalement */ }
    }
    if (!sourceReduction && reductionPromo > 0) {
      // Consommation ATOMIQUE et conditionnelle du code promo (jamais au-delà de
      // usageMax même en concurrence) — et pas de double consommation quand la
      // MÊME déclaration est re-soumise après un refus (même code déjà posé).
      const dejaCeCode = existing && existing.promoCode === code;
      if (!dejaCeCode) {
        const conso = await prisma.$executeRaw`UPDATE "PromoCode" SET "usageCount" = "usageCount" + 1
          WHERE "code" = ${code} AND "actif" = true AND ("usageMax" IS NULL OR "usageCount" < "usageMax")`;
        if (!conso) return go(res, '/formation', 'error', 'Code promo épuisé.');
      }
      reduction = reductionPromo;
      sourceReduction = 'promo:' + code;
    }

    const montant = offre.prix - reduction;
    data.accessType = 'paye';
    data.offreId = offre.id;
    data.operateur = operateur;
    data.refTransaction = ref;
    data.montantAttendu = montant;
    data.promoCode = sourceReduction && sourceReduction.startsWith('promo:') ? code : null;
    recapReduction = { offre, reduction, sourceReduction, montant, ref };

    // Signaux antifraude sur la déclaration (ne bloque pas — l'admin verra)
    try { await antifraude.controlerDeclaration(user.id, ref); } catch (e) { /* non bloquant */ }
  } else {
    data.accessType = 'autorise';
  }

  let enrId = existing && existing.id;
  try {
    if (existing) {
      await prisma.formationEnrollment.update({ where: { id: existing.id }, data });
    } else {
      const cree = await prisma.formationEnrollment.create({ data: Object.assign({ userId: user.id }, data) });
      enrId = cree.id;
    }
  } catch (e) {
    console.error('[formation] inscription impossible :', e.message);
    return go(res, '/formation', 'error', 'Le service d’inscription est momentanément indisponible. Réessayez dans un instant.');
  }

  // ─── Période d'abonnement (moteur financier) — idempotente PAR CONTENU de
  // déclaration (référence + formule + montant) : une re-déclaration identique
  // réutilise la même période (revivifiée en 'pending' si elle avait été
  // annulée par un refus) ; un contenu différent crée une NOUVELLE période et
  // annule les périodes en attente précédentes. Liaison enrollment↔période
  // ATOMIQUE (transaction). ───
  if (type === 'paye' && recapReduction) {
    try {
      const policy = await politiqueFin.active();
      const attr = await parrainageFin.attributionDe(user.id);
      const refClean = recapReduction.ref.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);
      const cleIdem = 'ENR:' + enrId + ':' + refClean + ':' + recapReduction.offre.id + ':' + recapReduction.montant;
      await prisma.$transaction(async (tx) => {
        let sub = await tx.subscription.findUnique({ where: { idempotencyKey: cleIdem } });
        if (sub && ['active', 'refunded'].includes(sub.statut)) {
          // Ce contenu exact a déjà été validé ou remboursé : ne pas le réutiliser
          throw new Error('DECLARATION_DEJA_TRAITEE');
        }
        if (sub) {
          // Même déclaration re-soumise (après refus par ex.) : revivifier en
          // attente — UNIQUEMENT depuis pending/cancelled (garde conditionnelle).
          await tx.subscription.updateMany({
            where: { id: sub.id, statut: { in: ['pending', 'cancelled'] } },
            data: { statut: 'pending' },
          });
        } else {
          try {
            sub = await tx.subscription.create({
              data: {
                userId: user.id,
                planId: recapReduction.offre.id,
                policyId: policy.id,
                referralId: attr ? attr.id : null,
                prixFacial: recapReduction.offre.prix,
                reduction: recapReduction.reduction,
                sourceReduction: recapReduction.sourceReduction,
                montantPaye: recapReduction.montant,
                operateur,
                refTransaction: recapReduction.ref,
                idempotencyKey: cleIdem,
              },
            });
          } catch (e) {
            if (e && e.code === 'P2002') sub = await tx.subscription.findUnique({ where: { idempotencyKey: cleIdem } }); // double envoi simultané
            else throw e;
          }
        }
        // Les autres périodes en attente de cet utilisateur deviennent caduques
        await tx.subscription.updateMany({
          where: { userId: user.id, statut: 'pending', id: { not: sub.id } },
          data: { statut: 'cancelled' },
        });
        await tx.formationEnrollment.update({ where: { id: enrId }, data: { subscriptionId: sub.id } });
      }, { timeout: 30000, maxWait: 10000 });
    } catch (e) {
      if (e.message === 'DECLARATION_DEJA_TRAITEE') {
        return go(res, '/formation', 'error', 'Cette référence de versement a déjà été utilisée pour un abonnement traité. Utilisez la référence du NOUVEAU versement.');
      }
      // Moteur non migré : l'accès Formation fonctionne quand même (sans rétrocessions)
      console.warn('[abonnement] période non enregistrée :', e.message);
    }
  }

  // Prévenir les administrateurs habilités (notification interne + e-mail)
  try {
    const admins = await prisma.user.findMany({ where: { role: 'admin', status: 'active' } });
    const habilites = admins.filter((a) => a.isSuperAdmin || (a.permissions || '').includes('formation'));
    const cibles = habilites.length ? habilites : admins.filter((a) => a.isSuperAdmin);
    await Promise.all(cibles.map((a) => prisma.notification.create({
      data: { userId: a.id, type: 'formation_demande', payload: JSON.stringify({ userId: user.id, name: user.name }) },
    })));
    cibles.forEach((a) => email.sendFormationRequest(a, user, niveau).catch(() => {}));
  } catch (e) { /* non bloquant */ }

  return go(res, '/formation', 'success', type === 'paye'
    ? 'Votre paiement déclaré va être vérifié par un administrateur. Vous serez prévenu par e-mail dès l’activation de votre accès.'
    : 'Votre demande d’autorisation a été envoyée. Un administrateur va l’examiner : vous serez prévenu par e-mail.');
});

// ─── Sous-rubrique « Statut général de la Fonction Publique » ───
router.get('/fonction-publique', requireAuth, requireApproved, async (req, res) => {
  const user = req.session.user;
  // Progression par séquence (tentatives terminées du domaine)
  let attempts = [];
  try {
    attempts = await prisma.quizAttempt.findMany({
      where: { userId: user.id, categorie: fpMeta.DOMAINE.id, statut: 'termine' },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) { /* non bloquant */ }
  const parNiveau = {};
  for (const n of fpMeta.NIVEAUX_FP) {
    const das = attempts.filter((a) => a.niveau === n.id);
    parNiveau[n.id] = {
      tentatives: das.length,
      meilleur: das.length ? Math.max(...das.map((a) => Math.round((a.score / a.nbQuestions) * 100))) : null,
    };
  }
  res.render('formation/fp/hub', {
    title: 'Statut général de la Fonction Publique — Préparation aux concours — EduWeb',
    bodyClass: 'page-formation',
    domaine: fpMeta.DOMAINE,
    cours: fpCours,
    niveaux: fpMeta.NIVEAUX_FP,
    typesLabels: fpMeta.TYPES_LABELS,
    parNiveau,
    totalExercices: fpBank.totalCount(),
    sequencesDispo: fpBank.sequencesDisponibles(),
    dernieres: attempts.slice(0, 5),
    gamif: await fpProgression.profilGamif(user.id),
    aRevoir: await fpProgression.articlesARevoir(user.id, 20),
    meta,
  });
});

// ─── §9 Jeux d'apprentissage ───
router.get('/fonction-publique/jeux', requireAuth, requireApproved, async (req, res) => {
  res.render('formation/fp/jeux', {
    title: 'Jeux d’apprentissage — Fonction Publique — EduWeb',
    bodyClass: 'page-formation page-fp-jeux',
    domaine: fpMeta.DOMAINE,
    jeux: fpJeux.JEUX,
    gamif: await fpProgression.profilGamif(req.session.user.id),
  });
});

function melangerTab(a) {
  const c = [...a];
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
  return c;
}

// Données d'une partie (formatif : les corrections voyagent avec les items)
router.get('/fonction-publique/jeux/:id/data', requireAuth, requireApproved, (req, res) => {
  const id = req.params.id;
  if (id === 'quisuisje') {
    const tirage = melangerTab(FP_REGLES).slice(0, 10).map((r) => {
      const distracteurs = melangerTab(FP_REGLES.filter((x) => x.article !== r.article)).slice(0, 3).map((x) => x.article);
      const options = melangerTab([r.article].concat(distracteurs));
      return { regle: r.texte, options, bonne: options.indexOf(r.article), ref: r.ref, article: r.article };
    });
    return res.json({ jeu: id, items: tirage });
  }
  if (id === 'categories') return res.json({ jeu: id, colonnes: fpJeux.CATEGORIES.colonnes, items: melangerTab(fpJeux.CATEGORIES.items) });
  if (id === 'adds') return res.json({ jeu: id, colonnes: fpJeux.ADDS.colonnes, items: melangerTab(fpJeux.ADDS.items), chronoSec: 90 });
  if (id === 'chrono') return res.json({ jeu: id, items: melangerTab(fpJeux.CHRONO.items) });
  if (id === 'conseil') return res.json({ jeu: id, colonnes: fpJeux.CONSEIL.organismes, items: melangerTab(fpJeux.CONSEIL.items) });
  if (id === 'echelle') return res.json({ jeu: id, colonnes: fpJeux.ECHELLE.colonnes, items: melangerTab(fpJeux.ECHELLE.items) });
  if (id === 'millionnaire' || id === 'boss') {
    // Tirage dans la banque : QCM (et V/F pour le boss), difficulté croissante
    const nb = id === 'millionnaire' ? 18 : 20;
    const types = id === 'millionnaire' ? ['qcm'] : ['qcm', 'vrai_faux'];
    const tous = [];
    for (const s of fpBank.sequencesDisponibles()) {
      for (const q of require('../data/formation/fp/questions/s' + s + '.json').questions) {
        if (types.includes(q.type)) tous.push(q);
      }
    }
    const tirage = [];
    const parDiff = [1, 2, 3, 4, 5].map((d) => melangerTab(tous.filter((q) => q.difficulte === d)));
    const quotas = id === 'millionnaire' ? [4, 4, 4, 3, 3] : [4, 4, 4, 4, 4];
    parDiff.forEach((liste, di) => { tirage.push(...liste.slice(0, quotas[di])); });
    const items = tirage.slice(0, nb).sort((a, b) => a.difficulte - b.difficulte).map((q) => {
      const f = fpBank.fixerQuestion(q);
      return { question: f.question, options: f.options, bonne: f.bonneReponse, ref: f.reference, article: f.article, difficulte: f.difficulte, explication: f.explication };
    });
    return res.json({ jeu: id, items, vies: id === 'boss' ? 3 : null });
  }
  res.status(404).json({ error: 'jeu inconnu' });
});

// Fin de partie : XP (plafonné), badges, série, maîtrise des articles joués
router.post('/fonction-publique/jeux/resultat', requireAuth, requireApproved, async (req, res) => {
  const { jeu, score, total, articles, drapeaux } = req.body;
  const def = fpJeux.JEUX.find((j) => j.id === jeu);
  if (!def || !(Number(total) > 0)) return res.status(400).json({ error: 'partie invalide' });
  const ratio = Math.max(0, Math.min(1, Number(score) / Number(total)));
  const xp = Math.round(def.xpMax * ratio);
  if (Array.isArray(articles) && articles.length) {
    await fpProgression.majMaitrise(req.session.user.id, articles
      .filter((a) => a && Number.isInteger(a.article))
      .slice(0, 60)
      .map((a) => ({ article: a.article, correct: !!a.correct })));
  }
  const gains = await fpProgression.gagner(req.session.user.id, {
    xp,
    partie: true,
    drapeaux: { millionnaire: !!(drapeaux && drapeaux.millionnaire), boss: !!(drapeaux && drapeaux.boss) },
  });
  res.json(gains.ok ? gains : { ok: false, message: 'Progression indisponible pour le moment (la partie reste valable !).' });
});

// ─── §13 Carte de maîtrise + statistiques ───
router.get('/fonction-publique/progression', requireAuth, requireApproved, async (req, res) => {
  const userId = req.session.user.id;
  const [carte, stats, gamif, aRevoir, fiches] = await Promise.all([
    fpProgression.carte(userId),
    fpProgression.statsTableau(userId),
    fpProgression.profilGamif(userId),
    fpProgression.articlesARevoir(userId, 20),
    fpProgression.fichesARetenir(userId),
  ]);
  res.render('formation/fp/progression', {
    title: 'Ma carte de maîtrise — Fonction Publique — EduWeb',
    bodyClass: 'page-formation',
    domaine: fpMeta.DOMAINE,
    cours: fpCours,
    carte, stats, gamif, aRevoir,
    fiches: fiches.map((f) => ({ ...f, regle: fpRegle(f.article) })),
  });
});

router.get('/fonction-publique/cours/:num', requireAuth, requireApproved, (req, res) => {
  const num = parseInt(req.params.num, 10);
  const seq = fpCours.sequences.find((s) => s.num === num);
  if (!seq) return go(res, '/formation/fonction-publique', 'error', 'Séquence introuvable.');
  res.render('formation/fp/cours', {
    title: `Séquence ${seq.num} — ${seq.titre} — EduWeb`,
    bodyClass: 'page-formation',
    domaine: fpMeta.DOMAINE,
    seq,
    precedente: fpCours.sequences.find((s) => s.num === num - 1) || null,
    suivante: fpCours.sequences.find((s) => s.num === num + 1) || null,
    methode: fpCours.methode,
    base: fpCours.base,
  });
});

// ─── Théorie & astuces ───
router.get('/theorie', requireAuth, requireApproved, (req, res) => {
  res.render('formation/theorie-index', {
    title: 'Théorie et astuces — Formation EduWeb',
    bodyClass: 'page-formation',
    categories: meta.CATEGORIES,
    general: bank.theorie('general'),
  });
});

router.get('/theorie/:categorie', requireAuth, requireApproved, (req, res) => {
  const id = req.params.categorie;
  const fiche = bank.theorie(id);
  if (!fiche) return go(res, '/formation/theorie', 'error', 'Fiche introuvable.');
  res.render('formation/theorie', {
    title: `${fiche.titre} — Formation EduWeb`,
    bodyClass: 'page-formation',
    fiche,
    cat: meta.categorie(id),
    categories: meta.CATEGORIES,
    estGeneral: id === 'general',
  });
});

// ─── Choix d'un test ───
router.get('/tests', requireAuth, requireApproved, async (req, res) => {
  const user = req.session.user;
  const enr = req.formationEnrollment;
  const compteurs = {};
  for (const c of meta.CATEGORIES) {
    compteurs[c.id] = {};
    for (const n of meta.NIVEAUX) compteurs[c.id][n.id] = bank.countFor(c.id, n.id);
  }
  res.render('formation/tests', {
    title: 'Passer un test — Formation EduWeb',
    bodyClass: 'page-formation',
    categories: meta.CATEGORIES,
    niveaux: meta.NIVEAUX,
    reglages: meta.REGLAGES,
    niveauDefaut: (enr && enr.niveau) || 'bepc',
    quotaRestant: await quotaRestant(enr),
    expiresAt: enr && enr.expiresAt,
    compteurs,
    biometrie: {
      dispo: await webauthn.hasCredential(user.id),
      valide: !!(req.session.biometrieOk && Date.now() - req.session.biometrieOk < BIOMETRIE_TTL_MS),
    },
  });
});

// ─── Démarrer un test ───
// Deux domaines : psychotechnique (categorie + niveau scolaire) et
// fonction-publique (domaine=fp : séquences + palier pédagogique).
router.post('/tests/demarrer', requireAuth, requireApproved, async (req, res) => {
  const user = req.session.user;

  if (req.body.domaine === 'fp') {
    const retour = '/formation/fonction-publique';
    const palier = fpMeta.niveauFP(req.body.palier);
    if (!palier) return go(res, retour, 'error', 'Choisissez un palier valide.');
    // Séquences : 'toutes' ou liste de numéros
    let sequences = [];
    if (req.body.sequences && req.body.sequences !== 'toutes') {
      sequences = (Array.isArray(req.body.sequences) ? req.body.sequences : [req.body.sequences])
        .map((n) => parseInt(n, 10)).filter((n) => Number.isInteger(n) && n >= 0 && n <= 14);
    }
    const nbQ = [10, 15, 20, 30, 60].includes(Number(req.body.nb)) ? Number(req.body.nb) : palier.nbDefaut;

    if (req.formationEnrollment) {
      const restant = await quotaRestant(req.formationEnrollment);
      if (restant !== null && restant <= 0) {
        return go(res, '/formation', 'warning', 'Vous avez utilisé tous les tests de votre formule. Renouvelez pour continuer.');
      }
    }
    if (await webauthn.hasCredential(user.id)) {
      const ok = req.session.biometrieOk && Date.now() - req.session.biometrieOk < BIOMETRIE_TTL_MS;
      if (!ok) return go(res, retour, 'warning', 'Confirmez d’abord votre empreinte digitale depuis la page « Passer un test ».');
    }

    // Révision du jour : test ciblé sur les articles fragiles (répétition espacée)
    let articlesCibles = null;
    if (req.body.articles) {
      articlesCibles = String(req.body.articles).split(',')
        .map((n) => parseInt(n, 10)).filter((n) => Number.isInteger(n) && n >= 1 && n <= 116).slice(0, 40);
      if (!articlesCibles.length) articlesCibles = null;
    }

    const fixed = fpBank.buildTest(sequences, palier.id, nbQ, articlesCibles);
    if (!fixed || !fixed.length) return go(res, retour, 'error', 'Aucun exercice disponible pour cette combinaison pour le moment.');

    const tempsMaxSec = palier.mode === 'examen' ? fixed.reduce((s, q) => s + (q.duree || 45), 0) : null;
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        categorie: fpMeta.DOMAINE.id,
        niveau: palier.id,
        mode: palier.mode,
        nbQuestions: fixed.length,
        questions: JSON.stringify(fixed),
        tempsMaxSec,
      },
    });
    return res.redirect('/formation/tests/' + attempt.id);
  }

  const { categorie, niveau, mode, nb } = req.body;
  if (!meta.categorie(categorie) || categorie === fpMeta.DOMAINE.id) return go(res, '/formation/tests', 'error', 'Catégorie invalide.');
  if (!meta.niveau(niveau)) return go(res, '/formation/tests', 'error', 'Niveau invalide.');
  const leMode = ['entrainement', 'examen'].includes(mode) ? mode : 'entrainement';
  const nbQ = meta.REGLAGES.nbQuestionsChoix.includes(Number(nb)) ? Number(nb) : meta.REGLAGES.nbQuestionsDefaut;

  // Quota de la formule (appliqué côté serveur)
  if (req.formationEnrollment) {
    const restant = await quotaRestant(req.formationEnrollment);
    if (restant !== null && restant <= 0) {
      return go(res, '/formation', 'warning', 'Vous avez utilisé tous les tests de votre formule. Renouvelez ou passez à une formule supérieure pour continuer.');
    }
  }

  // Empreinte digitale : si l'utilisateur en a enregistré une, elle doit avoir
  // été vérifiée il y a moins de 10 minutes.
  if (await webauthn.hasCredential(user.id)) {
    const ok = req.session.biometrieOk && Date.now() - req.session.biometrieOk < BIOMETRIE_TTL_MS;
    if (!ok) return go(res, '/formation/tests', 'warning', 'Confirmez d’abord votre empreinte digitale (bouton « Vérifier mon identité »).');
  }

  const fixed = bank.buildTest(categorie, niveau, nbQ);
  if (!fixed || !fixed.length) return go(res, '/formation/tests', 'error', 'Aucune question disponible pour cette combinaison pour le moment.');

  const tempsMaxSec = leMode === 'examen'
    ? fixed.reduce((s, q) => s + (q.duree || 60), 0) + fixed.reduce((s, q) => s + (q.memoSec || 0), 0)
    : null;

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      categorie,
      niveau,
      mode: leMode,
      nbQuestions: fixed.length,
      questions: JSON.stringify(fixed),
      tempsMaxSec,
    },
  });
  res.redirect('/formation/tests/' + attempt.id);
});

// ─── Player ───
router.get('/tests/:id', requireAuth, requireApproved, async (req, res) => {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: req.params.id } });
  if (!attempt || attempt.userId !== req.session.user.id) return go(res, '/formation/tests', 'error', 'Test introuvable.');
  if (attempt.statut === 'termine') return res.redirect('/formation/tests/' + attempt.id + '/resultat');

  const fixed = JSON.parse(attempt.questions);
  const reponses = JSON.parse(attempt.reponses || '{}');
  res.render('formation/player', {
    title: 'Test en cours — Formation EduWeb',
    bodyClass: 'page-formation page-player',
    hideChrome: true,
    attempt,
    cat: meta.categorie(attempt.categorie),
    niv: meta.niveau(attempt.niveau),
    questionsClient: bank.pourClient(fixed),
    reponses,
    tempsEcouleSec: Math.floor((Date.now() - new Date(attempt.createdAt).getTime()) / 1000),
  });
});

// Enregistrer la réponse à UNE question (l'entraînement renvoie la correction)
router.post('/tests/:id/reponse', requireAuth, requireApproved, async (req, res) => {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: req.params.id } });
  if (!attempt || attempt.userId !== req.session.user.id) return res.status(404).json({ error: 'introuvable' });
  if (attempt.statut !== 'en_cours') return res.status(400).json({ error: 'test terminé' });

  // Mode examen : la limite de temps est appliquée CÔTÉ SERVEUR (le chrono du
  // navigateur n'est qu'un affichage). 30 s de grâce pour les latences réseau.
  if (attempt.mode === 'examen' && attempt.tempsMaxSec) {
    const ecoule = (Date.now() - new Date(attempt.createdAt).getTime()) / 1000;
    if (ecoule > attempt.tempsMaxSec + 30) {
      return res.status(409).json({ error: 'Temps écoulé', fini: true });
    }
  }

  const i = Number(req.body.i);
  const fixed = JSON.parse(attempt.questions);
  if (!(i >= 0 && i < fixed.length)) return res.status(400).json({ error: 'question invalide' });
  const q = fixed[i];

  // Réponse : `reponse` (tous types — nombre, tableau ou null) ; `choix`
  // conservé pour compatibilité avec les tests psychotechniques historiques.
  const brut = req.body.reponse !== undefined ? req.body.reponse : (req.body.choix === undefined ? null : req.body.choix);
  const rep = scoring.validerReponse(q, brut);
  if (rep === undefined) return res.status(400).json({ error: 'réponse invalide' });

  const reponses = JSON.parse(attempt.reponses || '{}');
  if (reponses[i] === undefined) { // première réponse seulement (pas de correction rejouée)
    reponses[i] = rep;
    await prisma.quizAttempt.update({ where: { id: attempt.id }, data: { reponses: JSON.stringify(reponses) } });
  }

  if (attempt.mode === 'entrainement') {
    return res.json({
      ok: true,
      correct: scoring.estCorrect(q, reponses[i]),
      correction: scoring.correctionDe(q),
      // compatibilité ancienne interface (choix unique)
      bonneReponse: q.bonneReponse,
      explication: q.explication,
      reference: q.reference || null,
    });
  }
  res.json({ ok: true });
});

// Terminer : score, statistiques, diagnostic IA + perspectives
router.post('/tests/:id/terminer', requireAuth, requireApproved, async (req, res) => {
  const user = req.session.user;
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: req.params.id } });
  if (!attempt || attempt.userId !== user.id) return res.status(404).json({ error: 'introuvable' });
  if (attempt.statut === 'termine') return res.json({ ok: true, url: '/formation/tests/' + attempt.id + '/resultat' });

  // Idempotence : une seule terminaison possible (double clic / requêtes
  // concurrentes → un seul calcul de score et UN SEUL diagnostic IA).
  const claimed = await prisma.quizAttempt.updateMany({
    where: { id: attempt.id, statut: 'en_cours' },
    data: { statut: 'calcul' },
  });
  if (!claimed.count) return res.json({ ok: true, url: '/formation/tests/' + attempt.id + '/resultat' });

  const fixed = JSON.parse(attempt.questions);
  const reponses = JSON.parse(attempt.reponses || '{}');
  const score = fixed.reduce((s, q, i) => s + (scoring.estCorrect(q, reponses[i]) ? 1 : 0), 0);
  const dureeSec = Math.min(
    Math.floor((Date.now() - new Date(attempt.createdAt).getTime()) / 1000),
    (attempt.tempsMaxSec || 24 * 3600) + 60
  );

  // Historique des % précédents (même catégorie) pour commenter la progression
  let historique = [];
  try {
    const prev = await prisma.quizAttempt.findMany({
      where: { userId: user.id, categorie: attempt.categorie, statut: 'termine' },
      orderBy: { createdAt: 'asc' },
      select: { score: true, nbQuestions: true },
    });
    historique = prev.map((a) => Math.round((a.score / a.nbQuestions) * 100));
  } catch (e) { /* non bloquant */ }

  try {
    const enr = await enrollmentOf(user.id);
    const { stats, diagnostic: diag } = await diagnostic.generer(fixed, reponses, {
      categorie: attempt.categorie,
      niveau: attempt.niveau,
      objectif: enr && enr.objectif,
      dureeSec,
      historique: historique.concat([Math.round((score / fixed.length) * 100)]),
    });

    await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        score,
        dureeSec,
        statut: 'termine',
        finishedAt: new Date(),
        statsJson: JSON.stringify(stats),
        diagnostic: JSON.stringify(diag),
      },
    });
    // §10 Répétition espacée + §9 XP : uniquement pour la Fonction Publique,
    // en arrière-plan (jamais bloquant pour l'affichage du résultat)
    if (attempt.categorie === fpMeta.DOMAINE.id) {
      // Attendu (rapide) : sur serverless, une promesse non attendue peut être
      // interrompue à la fin de la requête. Les fonctions sont tolérantes.
      const resultats = fixed.map((q, i) => ({ article: q.article, correct: scoring.estCorrect(q, reponses[i]) }));
      await fpProgression.majMaitrise(user.id, resultats);
      await fpProgression.gagner(user.id, { xp: score * 2, partie: false });
    }

    res.json({ ok: true, url: '/formation/tests/' + attempt.id + '/resultat' });
  } catch (e) {
    // Échec du calcul : on rend la tentative reprenable plutôt que bloquée en « calcul »
    console.error('[formation] terminaison échouée :', e.message);
    await prisma.quizAttempt.updateMany({ where: { id: attempt.id, statut: 'calcul' }, data: { statut: 'en_cours' } }).catch(() => {});
    res.status(500).json({ error: 'Impossible de calculer le résultat. Réessayez.' });
  }
});

// ─── Résultat : score, correction expliquée, diagnostic IA, perspectives ───
router.get('/tests/:id/resultat', requireAuth, requireApproved, async (req, res) => {
  const attempt = await prisma.quizAttempt.findUnique({ where: { id: req.params.id } });
  if (!attempt || attempt.userId !== req.session.user.id) return go(res, '/formation/tests', 'error', 'Résultat introuvable.');
  if (attempt.statut !== 'termine') return res.redirect('/formation/tests/' + attempt.id);

  res.render('formation/resultat', {
    title: 'Résultat du test — Préparation aux concours — EduWeb',
    bodyClass: 'page-formation',
    attempt,
    cat: meta.categorie(attempt.categorie),
    niv: meta.niveau(attempt.niveau),
    questions: JSON.parse(attempt.questions),
    reponses: JSON.parse(attempt.reponses || '{}'),
    stats: attempt.statsJson ? JSON.parse(attempt.statsJson) : null,
    diag: attempt.diagnostic ? JSON.parse(attempt.diagnostic) : null,
    scoring,
  });
});

// ─── Historique ───
router.get('/historique', requireAuth, requireApproved, async (req, res) => {
  let attempts = [];
  try {
    attempts = await prisma.quizAttempt.findMany({
      where: { userId: req.session.user.id, statut: 'termine' },
      orderBy: { createdAt: 'desc' },
    });
  } catch (e) { /* table pas encore migrée */ }
  res.render('formation/historique', {
    title: 'Mes résultats — Formation EduWeb',
    bodyClass: 'page-formation',
    attempts,
    meta,
  });
});

// ─── Empreinte digitale (WebAuthn) ───
router.post('/biometrie/register-options', requireAuth, requireApproved, async (req, res) => {
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: req.session.user.id } });
    res.json(await webauthn.registrationOptions(req, dbUser));
  } catch (e) {
    console.error('[webauthn] options :', e.message);
    res.status(500).json({ error: 'Biométrie indisponible sur cet appareil.' });
  }
});

router.post('/biometrie/register-verify', requireAuth, requireApproved, async (req, res) => {
  try {
    const dbUser = await prisma.user.findUnique({ where: { id: req.session.user.id } });
    const ok = await webauthn.verifyRegistration(req, dbUser, req.body);
    if (ok) req.session.biometrieOk = Date.now();
    res.json({ ok });
  } catch (e) {
    console.error('[webauthn] register :', e.message);
    res.status(400).json({ ok: false, error: 'Enregistrement refusé.' });
  }
});

router.post('/biometrie/auth-options', requireAuth, requireApproved, async (req, res) => {
  try {
    const options = await webauthn.authenticationOptions(req, req.session.user);
    if (!options) return res.status(404).json({ error: 'Aucune empreinte enregistrée.' });
    res.json(options);
  } catch (e) {
    res.status(500).json({ error: 'Biométrie indisponible.' });
  }
});

router.post('/biometrie/auth-verify', requireAuth, requireApproved, async (req, res) => {
  try {
    const ok = await webauthn.verifyAuthentication(req, req.session.user, req.body);
    res.json({ ok });
  } catch (e) {
    console.error('[webauthn] verify :', e.message);
    res.status(400).json({ ok: false, error: 'Vérification refusée.' });
  }
});

router.post('/biometrie/supprimer', requireAuth, requireApproved, async (req, res) => {
  await webauthn.removeCredentials(req.session.user.id);
  req.session.biometrieOk = null;
  return go(res, '/formation/tests', 'success', 'Empreinte digitale supprimée.');
});

module.exports = router;
