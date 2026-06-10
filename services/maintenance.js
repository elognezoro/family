// Tâches d'entretien automatiques.
const prisma = require('../data/prisma-store');
const storage = require('./storage');

// Supprime les pièces jointes des messages de plus de `days` jours.
// Le fichier est retiré du stockage ; le texte du message est conservé.
async function purgeOldAttachments(days = 30) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const olds = await prisma.message.findMany({
    where: { attachmentUrl: { not: null }, createdAt: { lt: cutoff } },
    select: { id: true, body: true, attachmentUrl: true },
  });
  let purged = 0;
  for (const m of olds) {
    try { await storage.remove(m.attachmentUrl); } catch (e) { /* au mieux */ }
    try {
      await prisma.message.update({
        where: { id: m.id },
        data: {
          attachmentUrl: null,
          attachmentName: null,
          attachmentType: null,
          // Si le message n'avait que la pièce jointe, on laisse une trace lisible.
          body: m.body && m.body.trim() ? m.body : 'Pièce jointe expirée (supprimée après 1 mois)',
        },
      });
      purged += 1;
    } catch (e) { console.error('[maintenance] purge message', m.id, e.message); }
  }
  if (purged) console.log(`[maintenance] ${purged} pièce(s) jointe(s) expirée(s) purgée(s).`);
  return purged;
}

module.exports = { purgeOldAttachments };
