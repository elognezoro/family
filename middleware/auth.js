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

// Redirige les utilisateurs déjà connectés (pages login/register)
function redirectIfAuth(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect(`/${req.session.user.role}`);
  }
  next();
}

module.exports = { go, requireAuth, requireRole, redirectIfAuth };
