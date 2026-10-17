// Librairie EduWeb Éditions — mise en page du catalogue (/ouvrages).
//
// Un livre dont le niveau s'écrit « Niveau · Version » (ex. « CE1 · Livre
// apprenant ») appartient à une collection déclinée en plusieurs versions :
// les livres voisins (dans l'ordre d'affichage) de même titre forment une
// collection, et les versions d'un même niveau s'affichent côte à côte.
// Les autres livres restent dans la grille habituelle.
const SEP_VERSION = ' · ';

function regrouper(livres) {
  const blocs = [];
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
      blocs.push(bloc = { type: 'collection', titre: livre.titre, niveaux: [] });
    }
    let groupe = bloc.niveaux[bloc.niveaux.length - 1];
    if (!groupe || groupe.niveau !== niveau) {
      bloc.niveaux.push(groupe = { niveau, sousTitre: livre.sousTitre, versions: [] });
    }
    groupe.versions.push({ livre, version });
  });
  return blocs;
}

module.exports = { regrouper, SEP_VERSION };
