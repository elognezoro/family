// EduWeb Formation — reconnaissance par empreinte digitale (WebAuthn, côté client)
// Utilise le capteur DE L'APPAREIL (empreinte, visage, code) : rien ne quitte l'appareil.

(function () {
  var panel = document.getElementById('bioPanel');
  if (!panel) return;

  var msg = document.getElementById('bioMsg');
  var supported = !!(window.PublicKeyCredential && navigator.credentials);

  function say(texte, ok) {
    msg.hidden = false;
    msg.textContent = texte;
    msg.className = 'fbio__msg ' + (ok ? 'fbio__msg--ok' : 'fbio__msg--err');
  }

  // base64url <-> ArrayBuffer
  function b2a(b64url) {
    var b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    var pad = b64.length % 4 ? '===='.slice(b64.length % 4) : '';
    var bin = atob(b64 + pad);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }
  function a2b(buf) {
    var bytes = new Uint8Array(buf);
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function post(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: body ? JSON.stringify(body) : '{}',
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || 'Erreur'); return j; }); });
  }

  // ─── Enregistrement ───
  var btnReg = document.getElementById('bioRegister');
  if (btnReg) btnReg.addEventListener('click', function () {
    if (!supported) return say('Cet appareil ne prend pas en charge la reconnaissance d’empreinte.', false);
    btnReg.disabled = true;
    post('/formation/biometrie/register-options')
      .then(function (options) {
        options.challenge = b2a(options.challenge);
        // v9 : user.id est la chaîne BRUTE (uuid) → encodage UTF-8, comme
        // le fait @simplewebauthn/browser (PAS un décodage base64url)
        options.user.id = new TextEncoder().encode(options.user.id).buffer;
        (options.excludeCredentials || []).forEach(function (c) { c.id = b2a(c.id); });
        return navigator.credentials.create({ publicKey: options });
      })
      .then(function (cred) {
        return post('/formation/biometrie/register-verify', {
          id: cred.id,
          rawId: a2b(cred.rawId),
          type: cred.type,
          response: {
            clientDataJSON: a2b(cred.response.clientDataJSON),
            attestationObject: a2b(cred.response.attestationObject),
            transports: cred.response.getTransports ? cred.response.getTransports() : [],
          },
          clientExtensionResults: cred.getClientExtensionResults(),
        });
      })
      .then(function (r) {
        if (r.ok) { say('Empreinte enregistrée ✅ — elle vous sera demandée avant chaque test.', true); setTimeout(function () { location.reload(); }, 1200); }
        else say(r.error || 'Enregistrement refusé.', false);
      })
      .catch(function (e) { say('Impossible d’enregistrer l’empreinte : ' + (e.message || 'opération annulée.'), false); });
    setTimeout(function () { btnReg.disabled = false; }, 3000);
  });

  // ─── Vérification avant le test ───
  var btnVer = document.getElementById('bioVerify');
  if (btnVer) btnVer.addEventListener('click', function () {
    if (!supported) return say('Cet appareil ne prend pas en charge la reconnaissance d’empreinte.', false);
    btnVer.disabled = true;
    post('/formation/biometrie/auth-options')
      .then(function (options) {
        options.challenge = b2a(options.challenge);
        (options.allowCredentials || []).forEach(function (c) { c.id = b2a(c.id); });
        return navigator.credentials.get({ publicKey: options });
      })
      .then(function (cred) {
        return post('/formation/biometrie/auth-verify', {
          id: cred.id,
          rawId: a2b(cred.rawId),
          type: cred.type,
          response: {
            clientDataJSON: a2b(cred.response.clientDataJSON),
            authenticatorData: a2b(cred.response.authenticatorData),
            signature: a2b(cred.response.signature),
            userHandle: cred.response.userHandle ? a2b(cred.response.userHandle) : null,
          },
          clientExtensionResults: cred.getClientExtensionResults(),
        });
      })
      .then(function (r) {
        if (r.ok) {
          say('Identité vérifiée ✅ — vous pouvez démarrer votre test.', true);
          btnVer.hidden = true;
          document.getElementById('bioText').textContent = 'Identité vérifiée ✅ — vous pouvez démarrer votre test.';
        } else say(r.error || 'Vérification refusée.', false);
      })
      .catch(function (e) { say('Vérification impossible : ' + (e.message || 'opération annulée.'), false); });
    setTimeout(function () { btnVer.disabled = false; }, 3000);
  });
})();
