// Librairie EduWeb Éditions — mise en page du catalogue (/ouvrages).
//
// Un livre dont le niveau s'écrit « Niveau · Version » (ex. « CE1 · Livre
// apprenant ») appartient à une collection déclinée en plusieurs versions :
// les livres voisins (dans l'ordre d'affichage) de même titre forment une
// collection, et les versions d'un même niveau s'affichent côte à côte.
// Les autres livres restent dans la grille habituelle.
const SEP_VERSION = ' · ';

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
  (livres || []).forEach((livre) => {
    const i = (livre.niveau || '').indexOf(SEP_VERSION);
    let bloc = blocs[blocs.length - 1];
    if (i <= 0) {
      if (!bloc || bloc.type !== 'grille') blocs.push(bloc = { type: 'grille', livres: [] });
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

module.exports = { regrouper, ancreDe, SEP_VERSION };
