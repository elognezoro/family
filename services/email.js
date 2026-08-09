// Service d'envoi d'emails via Resend.
// En l'absence de clé API (mode dev), les emails sont affichés dans la console.

const APP = require('../config/app');

let resend = null;
const apiKey = process.env.RESEND_API_KEY;
// Nom d'expéditeur affiché pour TOUS les emails, quelle que soit la valeur de RESEND_FROM.
const SENDER_NAME = 'EduWeb Family & Coaching';
// Adresse d'envoi : on récupère l'email de RESEND_FROM (format « Nom <email> » ou « email »)
// et on impose le nom d'expéditeur ci-dessus.
// Repli = adresse du domaine vérifié dans Resend. NE PAS remettre « onboarding@resend.dev » :
// cette adresse de test ne délivre qu'au propriétaire du compte Resend, jamais aux inscrits.
const RAW_FROM = process.env.RESEND_FROM || 'noreply@eduweb.ci';
const FROM_EMAIL = ((RAW_FROM.match(/<([^>]+)>/) || [null, RAW_FROM])[1] || RAW_FROM).trim();
// Format attendu par Resend : « Nom <email> » — SANS guillemets autour du nom
// (des guillemets littéraux empêchent certains clients d'afficher le nom).
const FROM = `${SENDER_NAME} <${FROM_EMAIL}>`;
// Base des liens contenus dans les emails (activation, réinitialisation…).
// Même logique que le reste de l'app : domaine canonique en production, toute
// URL « …vercel.app » ignorée (source unique : APP.baseUrl).
const BASE_URL = APP.baseUrl();

if (apiKey) {
  try {
    const { Resend } = require('resend');
    resend = new Resend(apiKey);
    console.log('[email] Resend activé. Expéditeur :', FROM);
  } catch (e) {
    console.warn('[email] Resend indisponible :', e.message);
  }
} else {
  console.log('[email] Mode dev : aucune clé Resend, les liens seront affichés dans la console.');
}

function shell(title, bodyHtml) {
  return `
  <div style="background:#F4F6F0;padding:32px 0;font-family:'Segoe UI',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(14,107,58,.12);">
          <tr><td style="background:linear-gradient(135deg,#1E9E57,#0E6B3A);padding:28px 32px;text-align:center;">
            <div style="font-size:24px;font-weight:800;color:#fff;letter-spacing:.5px;">EduWeb</div>
            <div style="font-size:13px;color:#E2F3E8;margin-top:4px;">${APP.slogan}</div>
          </td></tr>
          <tr><td style="padding:32px;color:#1A2A1A;font-size:15px;line-height:1.6;">
            <h1 style="font-size:20px;margin:0 0 16px;color:#0E6B3A;">${title}</h1>
            ${bodyHtml}
          </td></tr>
          <tr><td style="padding:20px 32px;background:#F4F6F0;text-align:center;color:#7A8A7A;font-size:12px;">
            © ${new Date().getFullYear()} EduWeb — Family &amp; Coaching · Côte d'Ivoire
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;"><tr><td style="border-radius:12px;background:#1E9E57;">
    <a href="${href}" style="display:inline-block;padding:14px 32px;color:#fff;text-decoration:none;font-weight:700;font-size:15px;border-radius:12px;">${label}</a>
  </td></tr></table>`;
}

async function send(to, subject, html) {
  if (resend) {
    try {
      // ⚠️ Le SDK Resend NE LÈVE PAS d'erreur sur un refus d'API : il renvoie
      // { data, error }. On doit donc vérifier `error` explicitement, sinon un
      // domaine non vérifié / une adresse refusée passerait pour un succès.
      const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });
      if (error) {
        console.error('[email] Resend a REFUSÉ l’envoi à ' + to + ' — ' +
          (error.name || '') + ' (' + (error.statusCode || '?') + ') : ' + (error.message || JSON.stringify(error)));
        return false;
      }
      console.log('[email] Envoyé à ' + to + ' — « ' + subject + ' » (id ' + (data && data.id) + ')');
      return true;
    } catch (e) {
      console.error('[email] Échec envoi (exception) :', e.message);
      return false;
    }
  }
  // Mode dev
  console.log('\n========== EMAIL (mode dev) ==========');
  console.log(`À      : ${to}`);
  console.log(`Sujet  : ${subject}`);
  const link = (html.match(/href="([^"]*verify[^"]*)"/) || [])[1];
  if (link) console.log(`LIEN   : ${link}`);
  console.log('======================================\n');
  return true;
}

async function sendVerification(user, token) {
  const url = `${BASE_URL}/auth/verify?token=${token}`;
  const html = shell(
    'Activez votre compte',
    `<p>Bonjour <strong>${user.name}</strong>,</p>
     <p>Merci de vous être inscrit sur EduWeb. Cliquez sur le bouton ci-dessous pour activer votre compte :</p>
     ${button(url, '✅ Activer mon compte')}
     <p style="font-size:13px;color:#7A8A7A;">Ou copiez ce lien dans votre navigateur :<br>
     <a href="${url}" style="color:#1E9E57;word-break:break-all;">${url}</a></p>
     <p style="font-size:13px;color:#F08A24;margin-top:20px;">⏰ Ce lien expire dans 24 heures.</p>`
  );
  return send(user.email, 'Activez votre compte EduWeb', html);
}

// Lien de réinitialisation du mot de passe (valable 1 heure).
async function sendPasswordReset(user, token, baseUrl) {
  const url = `${baseUrl || BASE_URL}/auth/reset?token=${token}`;
  const html = shell(
    'Réinitialiser votre mot de passe',
    `<p>Bonjour <strong>${user.name}</strong>,</p>
     <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau :</p>
     ${button(url, '🔑 Choisir un nouveau mot de passe')}
     <p style="font-size:13px;color:#7A8A7A;">Ou copiez ce lien dans votre navigateur :<br>
     <a href="${url}" style="color:#1E9E57;word-break:break-all;">${url}</a></p>
     <p style="font-size:13px;color:#F08A24;margin-top:20px;">⏰ Ce lien expire dans 1 heure.</p>
     <p style="font-size:13px;color:#7A8A7A;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe reste inchangé.</p>`
  );
  return send(user.email, 'Réinitialisation de votre mot de passe EduWeb', html);
}

async function sendWelcome(user) {
  const url = `${BASE_URL}/auth/login`;
  const html = shell(
    'Bienvenue sur EduWeb ! 🎊',
    `<p>Bonjour <strong>${user.name}</strong>,</p>
     <p>Votre compte est maintenant <strong>activé</strong> ! Vous pouvez accéder à votre espace.</p>
     ${button(url, 'Accéder à mon espace →')}`
  );
  return send(user.email, 'Bienvenue sur EduWeb 🎊', html);
}

// ─── Formation (tests psychotechniques) ───

// À l'administrateur : nouvelle demande d'inscription à valider
async function sendFormationRequest(admin, candidate, niveau) {
  const url = `${BASE_URL}/admin/formation`;
  const html = shell(
    'Nouvelle demande — Formation',
    `<p>Bonjour <strong>${admin.name}</strong>,</p>
     <p><strong>${candidate.name}</strong> (${candidate.email}) demande l'accès à la section
     <strong>Formation — tests psychotechniques</strong> (niveau : ${niveau}).</p>
     ${button(url, 'Examiner la demande →')}`
  );
  return send(admin.email, 'Formation : nouvelle demande d’inscription', html);
}

// Au candidat : inscription validée
async function sendFormationApproved(user) {
  const url = `${BASE_URL}/formation`;
  const html = shell(
    'Votre inscription à la Formation est validée ! 🎓',
    `<p>Bonjour <strong>${user.name}</strong>,</p>
     <p>Bonne nouvelle : un administrateur a <strong>validé votre inscription</strong> à la section
     Formation — tests psychotechniques.</p>
     <p>Vous avez maintenant accès :</p>
     <ul>
       <li>aux <strong>fiches de théorie</strong> et aux trucs et astuces pour réussir ;</li>
       <li>à la <strong>banque de tests</strong> (entraînement libre ou conditions de concours) ;</li>
       <li>à votre <strong>diagnostic de performance</strong> après chaque test.</li>
     </ul>
     ${button(url, 'Commencer ma préparation →')}`
  );
  return send(user.email, 'Formation EduWeb : inscription validée 🎓', html);
}

// Au candidat : inscription refusée
async function sendFormationRejected(user, motif) {
  const html = shell(
    'Votre demande d’inscription à la Formation',
    `<p>Bonjour <strong>${user.name}</strong>,</p>
     <p>Votre demande d'accès à la section Formation n'a pas pu être validée pour le moment.</p>
     ${motif ? `<p><strong>Motif :</strong> ${motif}</p>` : ''}
     <p>Vous pouvez corriger ce qui est demandé puis soumettre une nouvelle demande depuis la page Formation.</p>
     ${button(`${BASE_URL}/formation`, 'Voir la page Formation →')}`
  );
  return send(user.email, 'Formation EduWeb : votre demande d’inscription', html);
}

// Au parrain : rétrocession gagnée grâce à un filleul payant
async function sendRetrocession(parrain, montant, filleulNom) {
  const url = `${BASE_URL}/parrainage`;
  const html = shell(
    'Vous avez gagné une rétrocession ! 💰',
    `<p>Bonjour <strong>${parrain.name}</strong>,</p>
     <p>Bonne nouvelle : l'abonnement de votre filleul <strong>${filleulNom}</strong> a été confirmé.
     Une rétrocession de <strong>${Number(montant).toLocaleString('fr-FR')} FCFA</strong> vient d'être créditée
     sur votre portefeuille de parrainage.</p>
     <p>Vous pouvez demander son versement (Wave, Orange Money, MTN MoMo, Moov Money) depuis votre espace.</p>
     ${button(url, 'Voir mon portefeuille →')}`
  );
  return send(parrain.email, `Rétrocession de ${Number(montant).toLocaleString('fr-FR')} FCFA créditée 💰`, html);
}

// Identifiants d'un compte créé par l'administrateur (compte « tout prêt »).
async function sendCredentials(user, password, loginUrl) {
  const html = shell(
    'Votre compte EduWeb est prêt 🎉',
    `<p>Bonjour <strong>${user.name}</strong>,</p>
     <p>Un compte a été créé pour vous sur EduWeb. Voici vos identifiants de connexion :</p>
     <ul style="line-height:1.9;font-size:15px;">
       <li>Adresse e-mail : <strong>${user.email}</strong></li>
       <li>Mot de passe : <strong>${password}</strong></li>
     </ul>
     ${button(loginUrl, 'Me connecter →')}
     <p style="font-size:13px;color:#7A8A7A;">Pour votre sécurité, pensez à modifier ce mot de passe après votre première connexion (menu « Mon compte »).</p>`
  );
  return send(user.email, 'Vos identifiants EduWeb', html);
}

// Notification au coach : nouvelle réservation reçue
async function sendBookingCoach(coachUser, info) {
  const html = shell(
    'Nouvelle réservation 📚',
    `<p>Bonjour <strong>${coachUser.name}</strong>,</p>
     <p>Vous avez reçu une nouvelle demande de mission :</p>
     <ul style="line-height:1.8;">
       <li>Discipline : <strong>${info.discipline}</strong></li>
       <li>Mode : <strong>${info.mode}</strong></li>
       <li>Engagement : <strong>${info.heures} h / mois</strong></li>
       <li>Vous percevez : <strong>${info.part}</strong></li>
     </ul>
     <p>Connectez-vous pour <strong>accepter ou refuser</strong> cette mission.</p>
     ${button(`${BASE_URL}/coach`, 'Voir la mission →')}`
  );
  return send(coachUser.email, 'Nouvelle réservation sur EduWeb', html);
}

// Confirmation au parent : réservation enregistrée
async function sendBookingParent(parentUser, info) {
  const html = shell(
    'Réservation enregistrée 🎉',
    `<p>Bonjour <strong>${parentUser.name}</strong>,</p>
     <p>Votre réservation a bien été enregistrée :</p>
     <ul style="line-height:1.8;">
       <li>Coach : <strong>${info.coach}</strong></li>
       <li>Discipline : <strong>${info.discipline}</strong></li>
       <li>Montant : <strong>${info.montant}</strong> / mois</li>
     </ul>
     <p>Le coach va confirmer la mission. Vous serez notifié de sa réponse.</p>
     ${button(`${BASE_URL}/parent`, 'Mon espace →')}`
  );
  return send(parentUser.email, 'Votre réservation EduWeb', html);
}

// Le service est-il configuré pour envoyer de vrais emails ?
function isConfigured() {
  return !!resend;
}

// Configuration courante (pour l'écran de diagnostic super-admin).
function config() {
  return { from: FROM, configured: !!resend };
}

// Diagnostic : envoie un email de test et renvoie le résultat DÉTAILLÉ
// (succès avec id, ou raison exacte du refus Resend).
async function sendTest(to) {
  const html = shell('E-mail de test ✅',
    '<p>Cet e-mail confirme que l’envoi fonctionne correctement.</p>' +
    '<p>Expéditeur configuré : <strong>' + FROM + '</strong></p>');
  if (!resend) {
    return { ok: false, configured: false, from: FROM,
      error: 'RESEND_API_KEY absente : aucun e-mail réel n’est envoyé (mode développement).' };
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject: 'Test d’envoi — EduWeb', html });
    if (error) {
      return { ok: false, configured: true, from: FROM,
        error: (error.name || 'erreur') + ' (' + (error.statusCode || '?') + ') : ' + (error.message || JSON.stringify(error)) };
    }
    return { ok: true, configured: true, from: FROM, id: data && data.id };
  } catch (e) {
    return { ok: false, configured: true, from: FROM, error: e.message };
  }
}

module.exports = { send, sendVerification, sendWelcome, sendPasswordReset, sendCredentials, sendBookingCoach, sendBookingParent, sendFormationRequest, sendFormationApproved, sendFormationRejected, sendRetrocession, isConfigured, config, sendTest, FROM };
