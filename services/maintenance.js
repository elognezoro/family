// Tâches d'entretien automatiques.
const prisma = require('../data/prisma-store');
const storage = require('./storage');

// Paramètres de purge (ligne singleton SiteStat). Crée la ligne au besoin.
async function getSettings() {
  const s = await prisma.siteStat.upsert({ where: { id: 'site' }, create: { id: 'site' }, update: {} });
  return {
    purgeDays: s.purgeDays == null ? 30 : s.purgeDays,
    purgeHour: s.purgeHour == null ? 3 : s.purgeHour,
    lastPurgeAt: s.lastPurgeAt || null,
  };
}

async function saveSettings({ purgeDays, purgeHour }) {
  const days = Math.min(365, Math.max(1, parseInt(purgeDays, 10) || 30));
  const hour = Math.min(23, Math.max(0, parseInt(purgeHour, 10)));
  await prisma.siteStat.upsert({
    where: { id: 'site' },
    create: { id: 'site', purgeDays: days, purgeHour: hour },
    update: { purgeDays: days, purgeHour: hour },
  });
  return { purgeDays: days, purgeHour: hour };
}

// Supprime les pièces jointes des messages de plus de `days` jours.
// Le fichier est retiré du stockage ; le texte du message est conservé.
async function purgeOldAttachments(days) {
  if (days == null) days = (await getSettings()).purgeDays;
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
          body: m.body && m.body.trim() ? m.body : 'Pièce jointe expirée (supprimée après ' + days + ' jours)',
        },
      });
      purged += 1;
    } catch (e) { console.error('[maintenance] purge message', m.id, e.message); }
  }
  if (purged) console.log(`[maintenance] ${purged} pièce(s) jointe(s) expirée(s) purgée(s).`);
  return purged;
}

// Purge planifiée : ne s'exécute qu'à l'heure préférée (UTC), avec un filet de
// sécurité si rien n'a tourné depuis plus de 25 h (compatible plans Vercel daily).
async function runScheduledPurge(force) {
  const s = await getSettings();
  const now = new Date();
  const due = now.getUTCHours() === s.purgeHour;
  // Filet de sécurité : si rien n'a tourné depuis ~20 h, on purge quand même
  // (garantit une purge quotidienne même quand Vercel ne déclenche le cron qu'une fois/jour).
  const stale = !s.lastPurgeAt || (now - new Date(s.lastPurgeAt)) > 20 * 60 * 60 * 1000;
  if (!force && !due && !stale) return { skipped: true };
  const purged = await purgeOldAttachments(s.purgeDays);
  await prisma.siteStat.update({ where: { id: 'site' }, data: { lastPurgeAt: now } });
  return { purged };
}

module.exports = { getSettings, saveSettings, purgeOldAttachments, runScheduledPurge };
