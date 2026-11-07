// Librairie EduWeb Éditions — mise en page du catalogue (/ouvrages).
//
// Un livre dont le niveau s'écrit « Niveau · Version » (ex. « CE1 · Livre
// apprenant ») appartient à une collection déclinée en plusieurs versions :
// les livres voisins (dans l'ordre d'affichage) de même titre forment une
// collection, et les versions d'un même niveau s'affichent côte à côte.
// Les autres livres restent dans la grille habituelle.
//
// Les annales du secondaire (collection « Objectif Mention ») sont réunies dans
// un bloc unique, placé à l'endroit de la première d'entre elles et rangé par
// discipline (le titre du livre : Physique-Chimie, Mathématiques, SVT…), dans
// l'ordre d'affichage. Une annale se reconnaît à son sous-titre, qui annonce
// l'examen visé : « Préparation au BAC », « Préparation au BEPC ». La grille qui
// suit directement ce bloc prend le titre « Autres ouvrages » (sans lui, ses livres
// sembleraient appartenir à la dernière discipline) ; les autres grilles restent
// sans titre, comme avant.
const SEP_VERSION = ' · ';
const TITRE_ANNALES = 'Annales du secondaire';
const TITRE_AUTRES = 'Autres ouvrages';
const ANNALE_RE = /^\s*pr[ée]paration\s+au\s+(bac(calaur[ée]at)?|bepc|brevet)\b/i;

function estAnnale(livre) {
  return !!livre && (livre.niveau || '').indexOf(SEP_VERSION) <= 0 && ANNALE_RE.test(livre.sousTitre || '');
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
  let annales = null;
  (livres || []).forEach((livre) => {
    if (estAnnale(livre)) {
      if (!annales) blocs.push(annales = { type: 'annales', titre: TITRE_ANNALES, ancre: ancreDe(TITRE_ANNALES, ancres), disciplines: [] });
      const nom = String(livre.titre || '').trim();
      let d = annales.disciplines.find((x) => x.discipline.toLowerCase() === nom.toLowerCase());
      if (!d) annales.disciplines.push(d = { discipline: nom, ancre: ancreDe(nom, ancres), livres: [] });
      d.livres.push(livre);
      return;
    }
    const i = (livre.niveau || '').indexOf(SEP_VERSION);
    let bloc = blocs[blocs.length - 1];
    if (i <= 0) {
      if (!bloc || bloc.type !== 'grille') {
        blocs.push(bloc = bloc && bloc.type === 'annales'
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
  return blocs;
}

module.exports = { regrouper, ancreDe, estAnnale, SEP_VERSION, TITRE_ANNALES, TITRE_AUTRES };
