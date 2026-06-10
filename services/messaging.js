// Messagerie interne EduWeb : conversations directes parent ↔ coach et admin ↔ tous.
const prisma = require('../data/prisma-store');

// L'admin (support) destinataire par défaut quand un utilisateur écrit au support.
async function supportUser() {
  let u = await prisma.user.findFirst({
    where: { isSuperAdmin: true },
    select: { id: true, name: true, role: true },
  });
  if (!u) {
    u = await prisma.user.findFirst({ where: { role: 'admin' }, select: { id: true, name: true, role: true } });
  }
  return u;
}

// me (session user : {id, role}) peut-il écrire à otherId ?
async function canMessage(me, otherId) {
  if (!otherId || otherId === me.id) return false;
  const other = await prisma.user.findUnique({
    where: { id: otherId },
    select: { id: true, role: true, status: true },
  });
  if (!other || other.status === 'suspended') return false;

  // Admin ↔ tout le monde
  if (me.role === 'admin' || other.role === 'admin') return true;

  // Parent ↔ Coach : seulement s'ils partagent une mission (réservation)
  const pair =
    (me.role === 'parent' && other.role === 'coach') ||
    (me.role === 'coach' && other.role === 'parent');
  if (pair) {
    const parentId = me.role === 'parent' ? me.id : other.id;
    const coachId = me.role === 'coach' ? me.id : other.id;
    const m = await prisma.mission.findFirst({ where: { parentUserId: parentId, coachUserId: coachId } });
    return !!m;
  }
  return false;
}

// Liste des conversations de l'utilisateur (autre interlocuteur, dernier message, non-lus).
async function listConversations(userId) {
  const msgs = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { recipientId: userId }] },
    orderBy: { createdAt: 'desc' },
  });
  const convMap = new Map();
  for (const m of msgs) {
    const otherId = m.senderId === userId ? m.recipientId : m.senderId;
    if (!convMap.has(otherId)) convMap.set(otherId, { otherId, last: m, unread: 0 });
    if (m.recipientId === userId && !m.read) convMap.get(otherId).unread += 1;
  }
  const ids = [...convMap.keys()];
  if (!ids.length) return [];
  const users = await prisma.user.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, role: true, photo: true },
  });
  const uById = {};
  users.forEach((u) => { uById[u.id] = u; });
  return [...convMap.values()].map((c) => ({
    ...c,
    other: uById[c.otherId] || { id: c.otherId, name: 'Utilisateur supprimé', role: '', photo: null },
  }));
}

// Fil de discussion entre deux utilisateurs (ordre chronologique).
async function thread(userId, otherId) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, recipientId: otherId },
        { senderId: otherId, recipientId: userId },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });
}

// Marque comme lus les messages reçus de otherId.
async function markRead(userId, otherId) {
  await prisma.message.updateMany({
    where: { recipientId: userId, senderId: otherId, read: false },
    data: { read: true },
  });
}

function unreadCount(userId) {
  return prisma.message.count({ where: { recipientId: userId, read: false } });
}

async function send(me, otherId, body, attachment) {
  const text = (body || '').toString().trim();
  const hasAttach = !!(attachment && attachment.url);
  if (!text && !hasAttach) return null;
  if (!(await canMessage(me, otherId))) return null;
  return prisma.message.create({
    data: {
      senderId: me.id,
      recipientId: otherId,
      body: text.slice(0, 4000),
      attachmentUrl: hasAttach ? attachment.url : null,
      attachmentName: hasAttach ? attachment.name : null,
      attachmentType: hasAttach ? attachment.type : null,
    },
  });
}

// Contacts avec qui l'utilisateur peut démarrer une conversation.
async function contacts(user) {
  const list = [];
  const seen = new Set([user.id]);
  const add = (arr, extra) => {
    for (const u of arr) {
      if (seen.has(u.id)) continue;
      seen.add(u.id);
      list.push({ id: u.id, name: u.name, role: u.role, ...(extra || {}) });
    }
  };

  if (user.role === 'admin') {
    const us = await prisma.user.findMany({
      where: { id: { not: user.id } },
      select: { id: true, name: true, role: true },
      orderBy: { name: 'asc' },
    });
    add(us);
    return list;
  }

  if (user.role === 'parent') {
    const missions = await prisma.mission.findMany({
      where: { parentUserId: user.id, coachUserId: { not: null } },
      select: { coachUserId: true },
    });
    const ids = [...new Set(missions.map((m) => m.coachUserId).filter(Boolean))];
    if (ids.length) {
      const coaches = await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, role: true } });
      add(coaches);
    }
  }

  if (user.role === 'coach') {
    const missions = await prisma.mission.findMany({
      where: { coachUserId: user.id },
      select: { parentUserId: true },
    });
    const ids = [...new Set(missions.map((m) => m.parentUserId).filter(Boolean))];
    if (ids.length) {
      const parents = await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, name: true, role: true } });
      add(parents);
    }
  }

  // Tout le monde peut écrire au support.
  const support = await supportUser();
  if (support && !seen.has(support.id)) {
    list.push({ id: support.id, name: support.name + ' · Support', role: support.role, support: true });
  }
  return list;
}

module.exports = {
  supportUser, canMessage, listConversations, thread, markRead, unreadCount, send, contacts,
};
