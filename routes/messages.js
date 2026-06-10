const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const msg = require('../services/messaging');

router.use(requireAuth);

// ─── Page messagerie (conversations + fil actif éventuel) ───
router.get('/', async (req, res) => {
  const me = req.session.user;
  const conversations = await msg.listConversations(me.id);
  const contacts = await msg.contacts(me);

  // Interlocuteur actif : ?to=<id> (si autorisé), sinon la 1re conversation
  let activeId = req.query.to || (conversations[0] && conversations[0].otherId) || null;
  if (activeId && !conversations.find((c) => c.otherId === activeId)) {
    // conversation pas encore existante : on vérifie le droit d'écrire
    if (!(await msg.canMessage(me, activeId))) activeId = null;
  }

  let activeOther = null;
  let messages = [];
  if (activeId) {
    const conv = conversations.find((c) => c.otherId === activeId);
    if (conv) {
      activeOther = conv.other;
    } else {
      const c = contacts.find((x) => x.id === activeId);
      if (c) activeOther = c;
    }
    messages = await msg.thread(me.id, activeId);
    await msg.markRead(me.id, activeId);
  }

  res.render('messages', {
    title: 'Messagerie — EduWeb',
    bodyClass: 'page-messages',
    conversations,
    contacts,
    activeId,
    activeOther,
    messages,
  });
});

// ─── Fil de discussion (JSON, pour le rafraîchissement) ───
router.get('/thread/:id', async (req, res) => {
  const me = req.session.user;
  const otherId = req.params.id;
  const messages = await msg.thread(me.id, otherId);
  if (!messages.length && !(await msg.canMessage(me, otherId))) {
    return res.status(403).json({ error: 'forbidden' });
  }
  await msg.markRead(me.id, otherId);
  res.json({
    me: me.id,
    messages: messages.map((m) => ({ id: m.id, mine: m.senderId === me.id, body: m.body, createdAt: m.createdAt })),
  });
});

// ─── Envoi d'un message ───
router.post('/send', async (req, res) => {
  const me = req.session.user;
  const { to, body } = req.body;
  const created = await msg.send(me, to, body);
  const wantsJson = (req.get('accept') || '').includes('application/json') || req.xhr;
  if (!created) {
    if (wantsJson) return res.status(400).json({ error: 'invalid' });
    return res.redirect('/messages' + (to ? '?to=' + encodeURIComponent(to) : ''));
  }
  if (wantsJson) {
    return res.json({ ok: true, message: { id: created.id, mine: true, body: created.body, createdAt: created.createdAt } });
  }
  res.redirect('/messages?to=' + encodeURIComponent(to));
});

// ─── Compteur de non-lus (badge en-tête) ───
router.get('/unread', async (req, res) => {
  const count = await msg.unreadCount(req.session.user.id);
  res.json({ count });
});

module.exports = router;
