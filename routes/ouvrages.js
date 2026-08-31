// Librairie EduWeb Éditions — catalogue public et commandes en ligne.
// Les livres sont gérés par l'admin (/admin/livres) ; un livre avec un prix
// défini est commandable. Paiement : mobile money déclaré (vérifié par un
// administrateur, comme la Formation) ou à la livraison.
const express = require('express');
const router = express.Router();
const prisma = require('../data/prisma-store');
const { go } = require('../middleware/auth');
const APP = require('../config/app');

// Collection par défaut tant que la vitrine est vide (non commandable).
const COLLECTION_DEFAUT = [
  { id: null, titre: 'Physique-Chimie', niveau: 'Troisième', sousTitre: 'Préparation au BEPC', imageUrl: '/images/livres/livre-3e.jpg?v=om1', prix: null, description: null },
  { id: null, titre: 'Physique-Chimie', niveau: 'Terminale C', sousTitre: 'Préparation au Bac', imageUrl: '/images/livres/livre-tc.jpg?v=om1', prix: null, description: null },
  { id: null, titre: 'Physique-Chimie', niveau: 'Terminale D', sousTitre: 'Préparation au Bac', imageUrl: '/images/livres/livre-td.jpg?v=om1', prix: null, description: null },
];

async function chargerCatalogue() {
  try {
    const livres = await prisma.livreVitrine.findMany({
      where: { actif: true },
      orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }],
    });
    if (livres.length) return livres;
  } catch (e) { console.warn('[ouvrages] vitrine indisponible :', e.message); }
  return COLLECTION_DEFAUT;
}

// ─── Catalogue ───
router.get('/', async (req, res) => {
  res.render('ouvrages', {
    title: 'Nos ouvrages scolaires — Librairie EduWeb Éditions',
    bodyClass: 'page-ouvrages',
    livres: await chargerCatalogue(),
  });
});

// ─── Bon de commande ───
router.get('/:id/commander', async (req, res) => {
  let livre = null;
  try { livre = await prisma.livreVitrine.findUnique({ where: { id: req.params.id } }); } catch (e) { /* ci-dessous */ }
  if (!livre || !livre.actif) return go(res, '/ouvrages', 'error', 'Cet ouvrage n’est pas (ou plus) disponible.');
  if (livre.prix == null) return go(res, '/ouvrages', 'info', `« ${livre.titre} — ${livre.niveau} » n’est pas encore ouvert à la commande en ligne. Contactez-nous au ${APP.contact.phone}.`);
  const u = req.session.user || null;
  res.render('ouvrage-commander', {
    title: `Commander « ${livre.titre} — ${livre.niveau} » — EduWeb Éditions`,
    bodyClass: 'page-ouvrages',
    livre,
    operateurs: APP.operateurs,
    numeroPaiement: APP.contact.phone,
    prefill: {
      nom: u ? u.name : '',
      email: u ? u.email : '',
      telephone: u && u.phone ? u.phone : '',
    },
  });
});

router.post('/:id/commander', async (req, res) => {
  // Piège à robots : champ invisible pour les humains.
  if ((req.body.website || '').trim()) return go(res, '/ouvrages', 'error', 'Commande refusée.');

  let livre = null;
  try { livre = await prisma.livreVitrine.findUnique({ where: { id: req.params.id } }); } catch (e) { /* ci-dessous */ }
  if (!livre || !livre.actif || livre.prix == null) {
    return go(res, '/ouvrages', 'error', 'Cet ouvrage n’est pas (ou plus) disponible à la commande.');
  }
  const retour = `/ouvrages/${livre.id}/commander`;

  const nom = (req.body.nom || '').trim();
  const telephone = (req.body.telephone || '').trim();
  const email = (req.body.email || '').trim();
  const lieu = (req.body.lieu || '').trim();
  const note = (req.body.note || '').trim();
  const quantite = parseInt(req.body.quantite, 10);
  const modePaiement = req.body.modePaiement === 'mobile_money' ? 'mobile_money' : 'livraison';

  if (nom.length < 2) return go(res, retour, 'error', 'Indiquez votre nom complet.');
  if (!/^\+?[0-9 .-]{8,20}$/.test(telephone)) return go(res, retour, 'error', 'Indiquez un numéro de téléphone valide (8 chiffres minimum) : c’est lui qui nous permet de vous joindre pour la livraison.');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return go(res, retour, 'error', 'L’adresse e-mail saisie est invalide (elle est facultative).');
  if (lieu.length < 2) return go(res, retour, 'error', 'Indiquez votre ville / commune / point de livraison.');
  if (!Number.isInteger(quantite) || quantite < 1 || quantite > 50) return go(res, retour, 'error', 'La quantité doit être comprise entre 1 et 50 exemplaires.');

  let operateur = null;
  let refTransaction = null;
  if (modePaiement === 'mobile_money') {
    operateur = req.body.operateur;
    if (!APP.operateurs.some((o) => o.id === operateur)) return go(res, retour, 'error', 'Choisissez l’opérateur mobile money utilisé.');
    refTransaction = (req.body.refTransaction || '').trim().slice(0, 60);
    if (refTransaction.length < 4) return go(res, retour, 'error', 'Indiquez la référence (ID) de votre versement mobile money — reçue par SMS après le transfert.');
  }

  try {
    const commande = await prisma.livreCommande.create({
      data: {
        livreId: livre.id,
        livreTitre: `${livre.titre} — ${livre.niveau}`,
        userId: req.session.user ? req.session.user.id : null,
        nom: nom.slice(0, 80),
        telephone: telephone.slice(0, 20),
        email: email ? email.slice(0, 120) : null,
        quantite,
        lieu: lieu.slice(0, 120),
        note: note ? note.slice(0, 500) : null,
        modePaiement,
        operateur,
        refTransaction,
        montant: livre.prix * quantite,
      },
    });
    return res.redirect(`/ouvrages/commande/${commande.id}`);
  } catch (e) {
    console.error('[ouvrages] création de commande :', e.message);
    return go(res, retour, 'error', 'La commande n’a pas pu être enregistrée. Réessayez dans un instant.');
  }
});

// ─── Confirmation (récapitulatif) ───
router.get('/commande/:id', async (req, res) => {
  let commande = null;
  try { commande = await prisma.livreCommande.findUnique({ where: { id: req.params.id }, include: { livre: true } }); } catch (e) { /* ci-dessous */ }
  if (!commande) return go(res, '/ouvrages', 'error', 'Commande introuvable.');
  const texteWhatsapp = `Bonjour EduWeb Éditions, je viens de commander « ${commande.livreTitre} » ×${commande.quantite} (commande ${commande.id.slice(0, 8).toUpperCase()}).`;
  res.render('ouvrage-confirmation', {
    title: 'Commande enregistrée — EduWeb Éditions',
    bodyClass: 'page-ouvrages',
    commande,
    numeroPaiement: APP.contact.phone,
    lienWhatsapp: `https://wa.me/${APP.contact.whatsapp}?text=${encodeURIComponent(texteWhatsapp)}`,
  });
});

module.exports = router;
