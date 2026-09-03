// Chansons mnémotechniques offertes avec certains ouvrages EduWeb Éditions.
// L'écoute se débloque en enregistrant le code de loterie inscrit dans
// l'annale (un code n'est utilisable que par un seul compte — règle déjà
// garantie par la loterie). Fichiers hébergés sur Vercel Blob (URL publiques
// non devinables).
const SERIES = [
  {
    slug: '3e', // URL partageable : /chansons/3e
    titreLivre: 'Physique-Chimie',
    niveaux: ['troisième', 'troisieme', '3ème', '3eme', '3e'],
    label: 'Les chansons de l’annale — Physique-Chimie Troisième',
    chansons: [
      { titre: 'Masse et Poids', url: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/chansons/3e/masse-et-poids-Vj3vU2ByNZtVyUQgFSglWG6sGb5gAS.mp3' },
      { titre: 'Travail et Énergie', url: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/chansons/3e/travail-et-energie-tRV1ErsYQVZf7NkXsi4OkWiHGE0RC8.mp3' },
      { titre: 'Eau et butane', url: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/chansons/3e/eau-et-butane-n3qkfyi8rxXdBND2i4U8tPwmzAZxoo.mp3' },
      { titre: 'Rouille et pH', url: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/chansons/3e/rouille-et-ph-YhO0sTuzADiCcoi74rlpYRYqhjrtcb.mp3' },
      { titre: 'Les lentilles', url: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/chansons/3e/les-lentilles-MN0qMGFPHRFGcYg6yiuv7ejxZo0Sbt.mp3' },
      { titre: 'La loi d’Ohm', url: 'https://utytejuejflw8n4e.public.blob.vercel-storage.com/eduweb/chansons/3e/la-loi-d-ohm-OMssPX0jwaADYh3BcUfhqvPxnEku2s.mp3' },
    ],
  },
];

// Série de chansons associée à un livre de la librairie (par titre + niveau).
function pourLivre(livre) {
  if (!livre) return null;
  const t = (s) => (s || '').toLowerCase();
  return SERIES.find((s) =>
    t(livre.titre).includes(t(s.titreLivre)) &&
    s.niveaux.some((n) => t(livre.niveau).includes(n))
  ) || null;
}

function parSlug(slug) {
  return SERIES.find((s) => s.slug === String(slug || '').toLowerCase()) || null;
}

function toutes() { return SERIES; }

// L'écoute est réservée aux comptes ayant enregistré le code de loterie de
// leur annale (un code = un seul compte, garanti par la loterie).
async function aAcces(userId) {
  if (!userId) return false;
  try {
    const prisma = require('./prisma-store');
    return (await prisma.loterieCode.count({ where: { userId, statut: 'enregistre' } })) > 0;
  } catch (e) { return false; }
}

// Messages du parcours de déblocage (partagés par les deux pages).
const MESSAGES_DEBLOCAGE = {
  'introuvable': 'Ce code est introuvable. Vérifiez la saisie : il est inscrit dans votre livre au format EW-XXXX-XXX-0000-XXXXXX.',
  'deja-a-vous': 'Ce code est déjà enregistré sur votre compte : les chansons sont débloquées.',
  'deja-pris': 'Ce code a déjà été utilisé par une autre personne — chaque code d’annale n’est valable que pour un seul compte.',
  'serie-close': 'La série de cet ouvrage est clôturée. Contactez le support si besoin.',
};

module.exports = { pourLivre, parSlug, toutes, aAcces, MESSAGES_DEBLOCAGE };
