// Dons pour la banque de ressources didactiques — mobile money déclaré,
// vérifié par un administrateur (même modèle que la Formation et la librairie).
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go } = require('../middleware/auth');
const APP = require('../config/app');

router.get('/', async (req, res) => {
  const u = req.session.user || null;
  // Total des dons confirmés : affiché comme compteur de soutien (façade publique)
  let totalConfirme = 0;
  try {
    const agg = await prisma.don.aggregate({ where: { statut: 'confirme' }, _sum: { montant: true } });
    totalConfirme = agg._sum.montant || 0;
  } catch (e) { /* table pas encore migrée */ }
  res.render('dons', {
    title: 'Soutenir la banque de ressources — EduWeb',
    bodyClass: 'page-ressources',
    operateurs: APP.operateurs,
    numeroPaiement: APP.contact.phone,
    totalConfirme,
    prefill: { nom: u ? u.name : '', email: u ? u.email : '' },
  });
});

// Limitation de débit en mémoire : 5 déclarations / 10 min / IP (meilleur
// effort sur lambda — chaque instance a sa propre mémoire, mais cela suffit
// à casser les boucles de spam simples).
const _declarations = new Map();
function tropDeDeclarations(ip) {
  const maintenant = Date.now();
  const fenetre = 10 * 60 * 1000;
  const liste = (_declarations.get(ip) || []).filter((t) => maintenant - t < fenetre);
  if (liste.length >= 5) return true;
  liste.push(maintenant);
  _declarations.set(ip, liste);
  if (_declarations.size > 5000) _declarations.clear(); // borne mémoire
  return false;
}

router.post('/', async (req, res) => {
  // Piège à robots
  if ((req.body.website || '').trim()) return go(res, '/dons', 'error', 'Déclaration refusée.');
  if (tropDeDeclarations(req.ip || 'inconnu')) {
    return go(res, '/dons', 'error', 'Trop de déclarations d’affilée — patientez quelques minutes puis réessayez.');
  }

  const nom = (req.body.nom || '').trim();
  const telephone = (req.body.telephone || '').trim();
  const email = (req.body.email || '').trim();
  const message = (req.body.message || '').trim();
  const montant = parseInt(String(req.body.montant || '').replace(/[^\d]/g, ''), 10);
  const operateur = req.body.operateur;
  const refTransaction = (req.body.refTransaction || '').trim().slice(0, 60);

  if (nom.length < 2) return go(res, '/dons', 'error', 'Indiquez votre nom (ou un pseudonyme).');
  if (!Number.isInteger(montant) || montant < 100 || montant > 10000000) {
    return go(res, '/dons', 'error', 'Indiquez le montant versé (à partir de 100 FCFA).');
  }
  if (!APP.operateurs.some((o) => o.id === operateur)) return go(res, '/dons', 'error', 'Choisissez l’opérateur mobile money utilisé.');
  if (refTransaction.length < 4) return go(res, '/dons', 'error', 'Indiquez la référence (ID) de votre versement — reçue par SMS après le transfert.');
  if (telephone && !/^\+?[0-9 .-]{8,20}$/.test(telephone)) return go(res, '/dons', 'error', 'Le numéro de téléphone saisi est invalide (il est facultatif).');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return go(res, '/dons', 'error', 'L’adresse e-mail saisie est invalide (elle est facultative).');

  try {
    // Anti double-clic : une même référence de transaction (opérateur + montant)
    // n'est déclarée qu'une fois, quel que soit son statut actuel.
    const doublon = await prisma.don.findFirst({
      where: { refTransaction, operateur, montant },
      orderBy: { createdAt: 'desc' },
    });
    if (!doublon) {
      await prisma.don.create({
        data: {
          userId: req.session.user ? req.session.user.id : null,
          nom: nom.slice(0, 80),
          telephone: telephone ? telephone.slice(0, 20) : null,
          email: email ? email.slice(0, 120) : null,
          montant,
          operateur,
          refTransaction,
          message: message ? message.slice(0, 400) : null,
        },
      });
    }
    // Message générique : aucune saisie libre (nom, référence…) n'est
    // réinjectée dans le flash.
    return go(res, '/dons', 'success',
      `💛 Merci ! Votre don de ${montant.toLocaleString('fr-FR')} FCFA est déclaré : un administrateur vérifie le versement puis le confirme. Grâce à vous, la banque de ressources grandit.`);
  } catch (e) {
    console.error('[dons] déclaration :', e.message);
    return go(res, '/dons', 'error', 'La déclaration n’a pas pu être enregistrée. Réessayez dans un instant.');
  }
});

module.exports = router;
