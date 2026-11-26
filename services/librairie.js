// Librairie EduWeb Éditions — mise en page du catalogue (/ouvrages).
//
// Un livre dont le niveau s'écrit « Niveau · Version » (ex. « CE1 · Livre
// apprenant ») appartient à une collection déclinée en plusieurs versions :
// les livres voisins (dans l'ordre d'affichage) de même titre forment une
// collection, et les versions d'un même niveau s'affichent côte à côte.
// Les autres livres restent dans la grille habituelle.
//
// La collection « Objectif Mention » se range en rubriques (RUBRIQUES) : cahiers
// de révision et annales du secondaire. Chaque rubrique forme un bloc unique,
// placé à l'endroit de son premier livre, rangé par discipline (dans l'ordre
// d'affichage) puis par classe (de la Sixième à la Terminale, série ensuite).
// - Cahier de révision : son titre l'annonce, suivi de la discipline
//   (« Cahier de révision de Mathématiques »).
// - Annale : son titre est la discipline (Physique-Chimie, Mathématiques, SVT…)
//   et son sous-titre annonce l'examen visé (« Préparation au BAC », « Préparation
//   au BEPC ») ou, pour les classes sans examen (Seconde, Première),
//   « Accompagnement tout au long de l'année ».
// La première rubrique qui reconnaît un livre l'emporte : un cahier de 3e
// « Préparation au BEPC » reste un cahier. La grille qui suit directement une
// rubrique prend le titre « Autres ouvrages » (sans lui, ses livres sembleraient
// appartenir à la dernière discipline) ; les autres grilles restent sans titre.
const SEP_VERSION = ' · ';
const TITRE_ANNALES = 'Annales du secondaire';
const TITRE_AUTRES = 'Autres ouvrages';
const ANNALE_RE = /^\s*pr[ée]paration\s+au\s+(bac(calaur[ée]at)?|bepc|brevet)\b|tout\s+au\s+long\s+de\s+l['’]\s*ann[ée]e/i;
const CAHIER_RE = /^\s*cahiers?\s+de\s+r[ée]visions?\b(?:\s*[—–:-]\s*|\s+)?(?:(?:de|des|du|en)\s+|d['’]\s*)?/i;

const majuscule = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const RUBRIQUES = [
  {
    cle: 'cahiers',
    titre: 'Cahiers de révision',
    prefixeAncre: 'cahiers-', // #cahiers-mathematiques, distinct de #mathematiques (annales)
    intro: 'Collection « Objectif Mention » : leçons et exercices corrigés, activités d’application et révisions progressives, du collège au lycée, rangés par discipline et par classe.',
    bandeau: null,
    discipline(livre) {
      const m = CAHIER_RE.exec(livre.titre || '');
      if (!m) return null;
      return majuscule(String(livre.titre).slice(m[0].length).trim()) || 'Autres disciplines';
    },
  },
  {
    cle: 'annales',
    titre: TITRE_ANNALES,
    prefixeAncre: '',
    intro: 'Collection « Objectif Mention » : résumés de cours, exercices et sujets corrigés pour réussir l’année, le BEPC et le BAC, rangés par discipline.',
    bandeau: 'Ces prix sont des prix de grossiste (par lot de 100 annales). Pour les prix de détail, contactez votre détaillant le plus proche.',
    discipline(livre) {
      return ANNALE_RE.test(livre.sousTitre || '') ? String(livre.titre || '').trim() || null : null;
    },
  },
];

// Rubrique et discipline d'un livre simple, ou null (version de collection, autre livre)
function rubriqueDe(livre) {
  if (!livre || (livre.niveau || '').indexOf(SEP_VERSION) > 0) return null;
  for (const rubrique of RUBRIQUES) {
    const discipline = rubrique.discipline(livre);
    if (discipline) return { rubrique, discipline };
  }
  return null;
}

function estAnnale(livre) {
  const r = rubriqueDe(livre);
  return !!r && r.rubrique.cle === 'annales';
}

// Rang scolaire d'un niveau (« Sixième » ou « 6ᵉ » 1 … « Terminale C » 7) et sa
// série (« C », « A1 »…). Un niveau inconnu (rang 99) passe après les classes
// connues, dans l'ordre d'affichage.
const CLASSES = [
  [/^(sixieme|6e|6eme)\b/, 1], [/^(cinquieme|5e|5eme)\b/, 2], [/^(quatrieme|4e|4eme)\b/, 3],
  [/^(troisieme|3e|3eme)\b/, 4], [/^(seconde|2nde|2nd|2de)\b/, 5], [/^(premiere|1re|1ere)\b/, 6], [/^(terminale|term|tle)\b/, 7],
];
function classeDe(niveau) {
  const n = String(niveau || '').normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g, '').trim(); // « 6ᵉ » → « 6e »
  for (const [re, rang] of CLASSES) {
    const m = re.exec(n);
    if (m) return { rang, serie: n.slice(m[0].length).trim() };
  }
  return { rang: 99, serie: '' };
}
function parClasse(a, b) {
  const ca = classeDe(a.niveau), cb = classeDe(b.niveau);
  return ca.rang - cb.rang || ca.serie.localeCompare(cb.serie, 'fr', { numeric: true });
}

// Ancre HTML d’une collection (« Leadership administratif et pédagogique » →
// « leadership-administratif-et-pedagogique ») : permet aux sites partenaires
// (ex. l’espace de formation EduWeb Planner) de renvoyer directement à
// l’annonce du livret : /ouvrages#leadership-administratif-et-pedagogique.
// Stable (dérivée du titre), unique (suffixe -2, -3… si deux collections
// portent le même titre), jamais vide (repli « collection »).
function ancreDe(titre, prises) {
  const base = String(titre || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'collection';
  let ancre = base;
  for (let n = 2; prises.has(ancre); n++) ancre = `${base}-${n}`;
  prises.add(ancre);
  return ancre;
}

function regrouper(livres) {
  const blocs = [];
  const ancres = new Set();
  const rubriques = new Map(); // clé de rubrique → bloc
  (livres || []).forEach((livre) => {
    const r = rubriqueDe(livre);
    if (r) {
      const { rubrique, discipline } = r;
      let bloc = rubriques.get(rubrique.cle);
      if (!bloc) {
        blocs.push(bloc = {
          type: 'rubrique', cle: rubrique.cle, titre: rubrique.titre, ancre: ancreDe(rubrique.titre, ancres),
          intro: rubrique.intro, bandeau: rubrique.bandeau, disciplines: [],
        });
        rubriques.set(rubrique.cle, bloc);
      }
      let d = bloc.disciplines.find((x) => x.discipline.toLowerCase() === discipline.toLowerCase());
      if (!d) bloc.disciplines.push(d = { discipline, ancre: ancreDe(rubrique.prefixeAncre + discipline, ancres), livres: [] });
      d.livres.push(livre);
      return;
    }
    const i = (livre.niveau || '').indexOf(SEP_VERSION);
    let bloc = blocs[blocs.length - 1];
    if (i <= 0) {
      if (!bloc || bloc.type !== 'grille') {
        blocs.push(bloc = bloc && bloc.type === 'rubrique'
          ? { type: 'grille', titre: TITRE_AUTRES, ancre: ancreDe(TITRE_AUTRES, ancres), livres: [] }
          : { type: 'grille', titre: null, ancre: null, livres: [] });
      }
      bloc.livres.push(livre);
      return;
    }
    const niveau = livre.niveau.slice(0, i).trim();
    const version = livre.niveau.slice(i + SEP_VERSION.length).trim();
    if (!bloc || bloc.type !== 'collection' || bloc.titre !== livre.titre) {
      blocs.push(bloc = { type: 'collection', titre: livre.titre, ancre: ancreDe(livre.titre, ancres), niveaux: [] });
    }
    let groupe = bloc.niveaux[bloc.niveaux.length - 1];
    if (!groupe || groupe.niveau !== niveau) {
      bloc.niveaux.push(groupe = { niveau, sousTitre: livre.sousTitre, versions: [] });
    }
    groupe.versions.push({ livre, version });
  });
  // Dans chaque discipline : de la Sixième à la Terminale (tri stable : à rang
  // égal, et pour les niveaux inconnus placés à la fin, l'ordre d'affichage)
  rubriques.forEach((bloc) => bloc.disciplines.forEach((d) => d.livres.sort(parClasse)));
  return blocs;
}

module.exports = { regrouper, ancreDe, estAnnale, rubriqueDe, classeDe, RUBRIQUES, SEP_VERSION, TITRE_ANNALES, TITRE_AUTRES };
