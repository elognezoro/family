// EduWeb Formation — reconnaissance par empreinte digitale (WebAuthn)
//
// Utilise l'authentificateur DE L'APPAREIL (capteur d'empreinte du téléphone,
// Windows Hello…) : l'empreinte ne quitte jamais l'appareil ; le serveur ne
// vérifie qu'une signature cryptographique. Optionnel : proposé avant un test
// pour attester que c'est bien le candidat inscrit qui compose.

const {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const prisma = require('../data/prisma-store');

const RP_NAME = 'EduWeb Family & Coaching';

// rpID = nom d'hôte (sans port) ; origin = URL d'origine attendue
function rpFrom(req) {
  const host = req.get('host') || 'localhost';
  const rpID = host.split(':')[0];
  const origin = `${req.protocol}://${host}`;
  return { rpID, origin };
}

const b64ToBuf = (s) => Buffer.from(s, 'base64url');
const bufToB64 = (b) => Buffer.from(b).toString('base64url');

async function credentialsOf(userId) {
  return prisma.webAuthnCredential.findMany({ where: { userId } });
}

// ─── Enregistrement de l'empreinte ───
async function registrationOptions(req, user) {
  const { rpID } = rpFrom(req);
  const existing = await credentialsOf(user.id);
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID,
    userID: user.id,
    userName: user.email,
    userDisplayName: user.name,
    attestationType: 'none',
    excludeCredentials: existing.map((c) => ({
      id: b64ToBuf(c.credentialId),
      type: 'public-key',
      transports: c.transports ? c.transports.split(',') : undefined,
    })),
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // capteur intégré à l'appareil
      residentKey: 'preferred',
      userVerification: 'required', // empreinte / visage / code de l'appareil
    },
  });
  req.session.webauthnChallenge = options.challenge;
  return options;
}

async function verifyRegistration(req, user, body) {
  const { rpID, origin } = rpFrom(req);
  const verification = await verifyRegistrationResponse({
    response: body,
    expectedChallenge: req.session.webauthnChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
  });
  req.session.webauthnChallenge = null;
  if (!verification.verified || !verification.registrationInfo) return false;
  const info = verification.registrationInfo;
  await prisma.webAuthnCredential.create({
    data: {
      userId: user.id,
      credentialId: bufToB64(info.credentialID),
      publicKey: bufToB64(info.credentialPublicKey),
      counter: info.counter || 0,
      transports: (body.response && body.response.transports || []).join(',') || null,
      label: 'Empreinte de l’appareil',
    },
  });
  return true;
}

// ─── Vérification avant un test ───
async function authenticationOptions(req, user) {
  const { rpID } = rpFrom(req);
  const creds = await credentialsOf(user.id);
  if (!creds.length) return null;
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    allowCredentials: creds.map((c) => ({
      id: b64ToBuf(c.credentialId),
      type: 'public-key',
      transports: c.transports ? c.transports.split(',') : undefined,
    })),
  });
  req.session.webauthnChallenge = options.challenge;
  return options;
}

async function verifyAuthentication(req, user, body) {
  const { rpID, origin } = rpFrom(req);
  const cred = await prisma.webAuthnCredential.findUnique({ where: { credentialId: body.id } });
  if (!cred || cred.userId !== user.id) return false;
  const verification = await verifyAuthenticationResponse({
    response: body,
    expectedChallenge: req.session.webauthnChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: true,
    authenticator: {
      credentialID: b64ToBuf(cred.credentialId),
      credentialPublicKey: b64ToBuf(cred.publicKey),
      counter: cred.counter,
    },
  });
  req.session.webauthnChallenge = null;
  if (!verification.verified) return false;
  await prisma.webAuthnCredential.update({
    where: { id: cred.id },
    data: { counter: verification.authenticationInfo.newCounter, lastUsedAt: new Date() },
  });
  // Attestation valable pour la session en cours (consultée au démarrage du test)
  req.session.biometrieOk = Date.now();
  return true;
}

async function hasCredential(userId) {
  try {
    return (await prisma.webAuthnCredential.count({ where: { userId } })) > 0;
  } catch (e) {
    // Table pas encore migrée : la biométrie est simplement indisponible
    return false;
  }
}

async function removeCredentials(userId) {
  await prisma.webAuthnCredential.deleteMany({ where: { userId } });
}

module.exports = {
  registrationOptions,
  verifyRegistration,
  authenticationOptions,
  verifyAuthentication,
  hasCredential,
  removeCredentials,
};
