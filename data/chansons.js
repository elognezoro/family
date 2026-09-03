// Chansons mnémotechniques offertes avec certains ouvrages EduWeb Éditions.
// L'écoute se débloque en enregistrant le code de loterie inscrit dans
// l'annale (un code n'est utilisable que par un seul compte — règle déjà
// garantie par la loterie). Fichiers hébergés sur Vercel Blob (URL publiques
// non devinables).
const SERIES = [
  {
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

module.exports = { pourLivre };
