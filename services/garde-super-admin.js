// Protection du super-administrateur dans la gestion des utilisateurs (/admin/users).
// Un admin ordinaire (permission « users ») ne peut ni changer le rôle, ni suspendre ou
// réactiver, ni supprimer un compte super-administrateur. Le super admin le peut, sauf si
// l'action laisse la plateforme sans aucun super admin en fonction (rôle admin, compte
// actif) : sans lui, plus personne n'accède à la gestion des admins, aux élections…

const REFUS_ADMIN = 'Action réservée au super-administrateur : ce compte est super-administrateur.';
const REFUS_DERNIER = 'Action refusée : la plateforme doit garder au moins un super-administrateur actif.';

// L'acteur peut-il agir sur ce compte ?
function peutAgirSur(acteur, cible) {
  return !(cible && cible.isSuperAdmin) || !!(acteur && acteur.isSuperAdmin);
}

// Super admin qui a effectivement accès à l'administration
function enFonction(u) {
  return !!(u && u.isSuperAdmin && u.role === 'admin' && u.status === 'active');
}

// Message de refus, ou null si l'action est permise.
// `retire` : l'action fait perdre l'accès à l'administration aux cibles
// (rétrogradation, suspension, suppression).
async function refus(prisma, acteur, cibles, { retire }) {
  const supers = cibles.filter((c) => c && c.isSuperAdmin);
  if (!supers.length) return null;
  if (!supers.every((c) => peutAgirSur(acteur, c))) return REFUS_ADMIN;
  if (retire && supers.some(enFonction)) {
    const restants = await prisma.user.count({
      where: { isSuperAdmin: true, role: 'admin', status: 'active', id: { notIn: cibles.map((c) => c.id) } },
    });
    if (!restants) return REFUS_DERNIER;
  }
  return null;
}

module.exports = { REFUS_ADMIN, REFUS_DERNIER, peutAgirSur, enFonction, refus };
