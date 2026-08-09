// Journal d'audit des actions sensibles (§42.11-12) — trace persistante,
// jamais bloquant pour l'action principale.
const prisma = require('../../data/prisma-store');

async function log(acteurId, action, cibleType, cibleId, avant, apres) {
  try {
    await prisma.auditLog.create({
      data: {
        acteurId: acteurId || null,
        action,
        cibleType: cibleType || null,
        cibleId: cibleId != null ? String(cibleId) : null,
        avant: avant != null ? JSON.stringify(avant) : null,
        apres: apres != null ? JSON.stringify(apres) : null,
      },
    });
  } catch (e) {
    console.error('[audit] échec d’écriture :', e.message);
  }
}

module.exports = { log };
