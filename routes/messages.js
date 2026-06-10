const express = require('express');
const multer = require('multer');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const msg = require('../services/messaging');
const storage = require('../services/storage');
const sms = require('../services/sms');
const prisma = require('../data/prisma-store');

router.use(requireAuth);

// Pièces jointes : 1 Mo max, en mémoire → stockage cloud (repli base64).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 Mo
  fileFilter: (req, file, cb) => {
    const ok = /\.(pdf|jpe?g|png|webp|gif|docx?|txt|xlsx?|pptx?)$/i.test(file.originalname);
    cb(ok ? null : new Error('Format non autorisé'), ok);
  },
});
function attachMiddleware(req, res, next) {
  upload.single('attachment')(req, res, (err) => {
    if (err) {
      req._attachError = err.code === 'LIMIT_FILE_SIZE'
        ? 'La pièce jointe dépasse 1 Mo.'
        : 'Pièce jointe invalide.';
    }
    next();
  });
}

function mapMessage(m, meId) {
  return {
    id: m.id,
    mine: m.senderId === meId,
    body: m.body,
    attachmentUrl: m.attachmentUrl || null,
    attachmentName: m.attachmentName || null,
    attachmentType: m.attachmentType || null,
    createdAt: m.createdAt,
  };
}

// ─── Page messagerie (conversations + fil actif éventuel) ───
router.get('/', async (req, res) => {
  const me = req.session.user;
  const conversations = await msg.listConversations(me.id);
  const contacts = await msg.contacts(me);

  let activeId = req.query.to || (conversations[0] && conversations[0].otherId) || null;
  if (activeId && !conversations.find((c) => c.otherId === activeId)) {
    if (!(await msg.canMessage(me, activeId))) activeId = null;
  }

  let activeOther = null;
  let messages = [];
  if (activeId) {
    const conv = conversations.find((c) => c.otherId === activeId);
    if (conv) activeOther = conv.other;
    else {
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
  res.json({ me: me.id, messages: messages.map((m) => mapMessage(m, me.id)) });
});

// ─── Envoi d'un message (texte et/ou pièce jointe ≤ 1 Mo) ───
router.post('/send', attachMiddleware, async (req, res) => {
  const me = req.session.user;
  const { to, body } = req.body;
  const wantsJson = (req.get('accept') || '').includes('application/json') || req.xhr || !!req.file;

  if (req._attachError) {
    if (wantsJson) return res.status(400).json({ error: req._attachError });
    return res.redirect('/messages' + (to ? '?to=' + encodeURIComponent(to) : ''));
  }

  // Pièce jointe → stockage cloud, repli base64 si indisponible
  let attachment = null;
  if (req.file && req.file.buffer) {
    let url;
    try {
      url = await storage.save(req.file.buffer, req.file.originalname, req.file.mimetype);
    } catch (e) {
      console.error('[message] Stockage indisponible, repli base64 :', e && e.message);
      url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    attachment = { url, name: req.file.originalname, type: req.file.mimetype };
  }

  const created = await msg.send(me, to, body, attachment);
  if (!created) {
    if (wantsJson) return res.status(400).json({ error: 'invalid' });
    return res.redirect('/messages' + (to ? '?to=' + encodeURIComponent(to) : ''));
  }

  // Notification SMS au destinataire — une seule fois tant qu'il n'a pas lu (anti-spam).
  try {
    const unreadFromMe = await prisma.message.count({ where: { senderId: me.id, recipientId: to, read: false } });
    if (unreadFromMe === 1) {
      const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
      sms.toUser(to, `EduWeb : nouveau message de ${me.name}. Répondez ici : ${baseUrl}/messages`)
        .catch((e) => console.error('[sms message]', e.message));
    }
  } catch (e) { /* non bloquant */ }

  if (wantsJson) return res.json({ ok: true, message: mapMessage(created, me.id) });
  res.redirect('/messages?to=' + encodeURIComponent(to));
});

// ─── Compteur de non-lus (badge en-tête) ───
router.get('/unread', async (req, res) => {
  const count = await msg.unreadCount(req.session.user.id);
  res.json({ count });
});

module.exports = router;
