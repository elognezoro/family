// Données financières de la page « Parrainage & gains » (utilisée par
// /parrainage et /commercial) — tolérant : la page fonctionne même si le
// moteur financier n'est pas encore migré.
const prisma = require('../../data/prisma-store');

async function donnees(userId, linkCoaching, linkFormation) {
  const fin = { actif: false };
  try {
    const retrocession = require('./retrocession');
    const parrainageFin = require('./parrainage');
    const politiqueFin = require('./politique');
    fin.progression = await retrocession.progressionParrain(userId);
    fin.stats = await parrainageFin.statsParrain(userId);
    fin.slots = await parrainageFin.etatSlots(userId);
    fin.policy = await politiqueFin.active();
    fin.payouts = await prisma.payout.findMany({ where: { userId }, orderBy: { requestedAt: 'desc' }, take: 10 });
    try {
      const QRCode = require('qrcode');
      const opts = { width: 220, margin: 1, color: { dark: '#0E6B3A' } };
      fin.qr = await QRCode.toDataURL(linkCoaching, opts);
      fin.qrFormation = linkFormation ? await QRCode.toDataURL(linkFormation, { ...opts, color: { dark: '#B45309' } }) : null;
    } catch (e) { fin.qr = null; fin.qrFormation = null; }
    fin.actif = true;
  } catch (e) { /* tables du moteur absentes : section masquée */ }
  return fin;
}

module.exports = { donnees };
