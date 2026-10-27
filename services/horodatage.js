// Horodatage incrusté dans les photos de pièces d'identité (élection AIDUS).
// Le bandeau est dessiné pixel par pixel avec une police matricielle 5×7 (aucune police
// système : sur Vercel, le rendu de texte SVG par sharp n'a pas de polices). Il est ajouté
// SOUS la photo (rien de la pièce n'est masqué), par le serveur, à la réception : l'électeur
// ne peut ni le choisir ni le retirer.

// Police 5×7 : « # » = pixel allumé. Texte converti en majuscules sans accents.
const POLICE = {
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['#####', '...#.', '..#..', '...#.', '....#', '#...#', '.###.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['###..', '#..#.', '#...#', '#...#', '#...#', '#..#.', '###..'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#.#.#', '#...#', '#...#', '#...#'],
  N: ['#...#', '#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#.#.#', '#.#.#', '#.#.#', '.#.#.'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
  ':': ['.....', '.##..', '.##..', '.....', '.##..', '.##..', '.....'],
  '/': ['.....', '....#', '...#.', '..#..', '.#...', '#....', '.....'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '(': ['...#.', '..#..', '.#...', '.#...', '.#...', '..#..', '...#.'],
  ')': ['.#...', '..#..', '...#.', '...#.', '...#.', '..#..', '.#...'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  ',': ['.....', '.....', '.....', '.....', '.##..', '..#..', '.#...'],
  "'": ['..#..', '..#..', '.#...', '.....', '.....', '.....', '.....'],
  '?': ['.###.', '#...#', '....#', '...#.', '..#..', '.....', '..#..'],
};
const CELLULE = 6; // 5 colonnes de glyphe + 1 d'espacement
const LIGNE = 10; // 7 rangées de glyphe + 3 d'interligne

const normaliser = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’‘]/g, "'").toUpperCase();

// Coupe une ligne trop longue aux espaces (« max » caractères au plus)
function couper(ligne, max) {
  const mots = ligne.split(' ');
  const lignes = [];
  let courante = '';
  for (const mot of mots) {
    const essai = courante ? courante + ' ' + mot : mot;
    if (essai.length <= max) { courante = essai; continue; }
    if (courante) lignes.push(courante);
    courante = mot.length > max ? mot.slice(0, max) : mot;
  }
  if (courante) lignes.push(courante);
  return lignes;
}

// Bandeau RGBA (texte blanc sur fond sombre), de la largeur de la photo.
// Renvoie { buffer, width, height } (pixels bruts, 4 canaux).
function bandeau(lignesTexte, largeur) {
  const textes = lignesTexte.map(normaliser);
  const marge = Math.max(8, Math.round(largeur * 0.015));
  const plusLongue = Math.max(1, ...textes.map((l) => l.length));
  // Taille du texte : la plus grande qui tient sur une ligne, au moins 2 (lisible), au plus 4 ;
  // les lignes trop longues passent à la ligne
  const echelle = Math.max(largeur >= 240 ? 2 : 1, Math.min(4, Math.floor((largeur - 2 * marge) / (plusLongue * CELLULE))));
  const parLigne = Math.max(1, Math.floor((largeur - 2 * marge) / (CELLULE * echelle)));
  const lignes = textes.flatMap((l) => couper(l, parLigne));
  const hauteur = 2 * marge + lignes.length * LIGNE * echelle - 2 * echelle;
  const buffer = Buffer.alloc(largeur * hauteur * 4);
  for (let i = 0; i < largeur * hauteur; i++) { buffer[i * 4] = 24; buffer[i * 4 + 1] = 32; buffer[i * 4 + 2] = 28; buffer[i * 4 + 3] = 255; }
  lignes.forEach((ligne, n) => {
    const y0 = marge + n * LIGNE * echelle;
    [...ligne].forEach((car, k) => {
      const glyphe = POLICE[car] || POLICE['?'];
      const x0 = marge + k * CELLULE * echelle;
      for (let gy = 0; gy < 7; gy++) {
        for (let gx = 0; gx < 5; gx++) {
          if (glyphe[gy][gx] !== '#') continue;
          for (let dy = 0; dy < echelle; dy++) {
            for (let dx = 0; dx < echelle; dx++) {
              const x = x0 + gx * echelle + dx, y = y0 + gy * echelle + dy;
              if (x >= largeur || y >= hauteur) continue;
              const p = (y * largeur + x) * 4;
              buffer[p] = 255; buffer[p + 1] = 255; buffer[p + 2] = 255;
            }
          }
        }
      }
    });
  });
  return { buffer, width: largeur, height: hauteur, lignes, echelle };
}

// Date et heure GMT : « 29/10/2026 », « 10:42:13 »
const pad = (n) => String(n).padStart(2, '0');
const jour = (d) => `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
const heure = (d) => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
function duree(s) {
  const a = Math.abs(Math.round(s));
  if (a < 60) return `${a} S`;
  if (a < 3600) return `${Math.floor(a / 60)} MIN ${pad(a % 60)} S`;
  if (a < 86400) return `${Math.floor(a / 3600)} H ${pad(Math.floor((a % 3600) / 60))} MIN`;
  return `${Math.floor(a / 86400)} J ${Math.floor((a % 86400) / 3600)} H`;
}
const SOURCES = { camera: 'caméra du site', appareil: 'appareil photo du téléphone' };
const ECART_ALERTE = 15 * 60; // secondes : photo prise plus de 15 min avant sa réception

// Écart entre la prise (horloge de l'appareil) et la réception (serveur) ; alerte si inhabituel
function ecart(recuLe, prisLe) {
  if (!prisLe) return null;
  const s = (new Date(recuLe) - new Date(prisLe)) / 1000;
  return { secondes: Math.round(s), alerte: s > ECART_ALERTE || s < -300 };
}

// Lignes du bandeau incrusté dans la photo
function lignesHorodatage({ recuLe, prisLe, source, reference }) {
  const r = new Date(recuLe);
  const lignes = [`AIDUS 2026 - PHOTO RECUE PAR LE SITE LE ${jour(r)} A ${heure(r)} GMT - REF ${reference}`];
  if (prisLe) {
    const e = ecart(recuLe, prisLe);
    const p = new Date(prisLe);
    const quand = jour(p) === jour(r) ? heure(p) : `${jour(p)} ${heure(p)}`;
    lignes.push(`PRISE A ${quand} GMT, HEURE DE L'APPAREIL (${(SOURCES[source] || 'appareil').toUpperCase()})`
      + (e.secondes >= 0 ? ` - ${duree(e.secondes)} AVANT RECEPTION` : ` - APPAREIL EN AVANCE DE ${duree(e.secondes)}`));
  } else {
    lignes.push('HEURE DE PRISE NON FOURNIE PAR L\'APPAREIL');
  }
  return lignes;
}

// Résumé pour le Comité électoral (visionneuse, export CSV)
function infoHorodatage(piece, formatGmt) {
  if (!piece) return null;
  const e = ecart(piece.createdAt, piece.prisLe);
  return {
    recu: formatGmt(piece.createdAt),
    pris: piece.prisLe ? formatGmt(piece.prisLe) : null,
    source: SOURCES[piece.source] || null,
    ecartSecondes: e ? e.secondes : null,
    ecartTexte: e ? (e.secondes >= 0 ? `${duree(e.secondes).toLowerCase()} avant la réception` : `appareil en avance de ${duree(e.secondes).toLowerCase()}`) : null,
    alerte: e ? e.alerte : !piece.prisLe,
  };
}

// Heure de prise envoyée par le navigateur : gardée seulement si plausible (sinon null)
function prisePlausible(valeur, recuLe = new Date()) {
  const d = new Date(String(valeur || ''));
  if (isNaN(d)) return null;
  const s = (recuLe - d) / 1000;
  return s > 30 * 86400 || s < -86400 ? null : d;
}

module.exports = { POLICE, bandeau, couper, lignesHorodatage, infoHorodatage, prisePlausible, ecart, duree, SOURCES, ECART_ALERTE };
