// Middleware d'authentification & contrôle d'accès basé sur les rôles (RBAC)

// Utilitaire flash via query params (persiste sur Vercel/Codespaces)
function go(res, path, type, text) {
  const sep = path.includes('?') ? '&' : '?';
  return res.redirect(
    path + sep + 'mt=' + encodeURIComponent(type) + '&mm=' + encodeURIComponent(text)
  );
}

// Doit être connecté
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return go(res, '/auth/login', 'warning', 'Veuillez vous connecter pour continuer.');
  }
  next();
}

// Restreint l'accès à un (ou plusieurs) rôle(s). L'admin a accès à tout.
function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.session && req.session.user;
    if (!user) {
      return go(res, '/auth/login', 'warning', 'Veuillez vous connecter pour continuer.');
    }
    if (user.role === 'admin' || roles.includes(user.role)) {
      return next();
    }
    return go(res, `/${user.role}`, 'error', 'Accès refusé : espace réservé.');
  };
}

// Restreint à une permission d'admin précise (le super-admin a tout)
function requirePerm(perm) {
  return (req, res, next) => {
    const u = req.session && req.session.user;
    if (!u) return go(res, '/auth/login', 'warning', 'Veuillez vous connecter pour continuer.');
    if (u.isSuperAdmin) return next();
    const perms = (u.permissions || '').split(',').map((s) => s.trim()).filter(Boolean);
    if (u.role === 'admin' && (!perm || perms.includes(perm))) return next();
    return go(res, '/admin', 'error', 'Accès refusé : vous n’avez pas la permission requise.');
  };
}

// Réservé au super-administrateur
function requireSuperAdmin(req, res, next) {
  const u = req.session && req.session.user;
  if (u && u.isSuperAdmin) return next();
  return go(res, '/admin', 'error', 'Action réservée au super-administrateur.');
}

// Redirige les utilisateurs déjà connectés (pages login/register)
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect(`/${req.session.user.role}`);
  }
  next();
}

module.exports = { go, requireAuth, requireRole, requirePerm, requireSuperAdmin, redirectIfAuth };
