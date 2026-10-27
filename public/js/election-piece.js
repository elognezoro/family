// Pièce d'identité du vote en ligne (views/election.ejs, étape « bulletin »).
// La photo est prise directement (pas de choix de fichier) : l'appareil photo s'ouvre
// dans la page (caméra arrière), avec un cadre au format de la pièce ; secours : appareil
// photo du téléphone (champ « capture »). La photo est ensuite rognée par l'électeur,
// puis réduite (1 600 px au plus sur le grand côté, JPEG) et placée dans le formulaire.
// Le serveur contrôle et réduit l'image de nouveau (services/elections.js).
(function () {
  'use strict';

  // ── Calculs du cadre de rognage (purs ; testés dans tests/elections.test.js) ──
  var borner = function (v, min, max) { return Math.max(min, Math.min(max, v)); };
  var Cadre = {
    // Déplacement (coin « move ») ou redimensionnement par un coin (nw, ne, sw, se).
    // c : cadre de départ ; dx, dy : déplacement en pixels de l'image ; W×H : taille de l'image
    ajuster: function (c, coin, dx, dy, W, H, min) {
      var n = { x: c.x, y: c.y, w: c.w, h: c.h };
      if (coin === 'move') {
        n.x = borner(c.x + dx, 0, W - c.w);
        n.y = borner(c.y + dy, 0, H - c.h);
        return n;
      }
      if (coin.indexOf('w') >= 0) { var x = borner(c.x + dx, 0, c.x + c.w - min); n.w = c.w + c.x - x; n.x = x; }
      if (coin.indexOf('e') >= 0) n.w = borner(c.w + dx, min, W - c.x);
      if (coin.indexOf('n') >= 0) { var y = borner(c.y + dy, 0, c.y + c.h - min); n.h = c.h + c.y - y; n.y = y; }
      if (coin.indexOf('s') >= 0) n.h = borner(c.h + dy, min, H - c.y);
      return n;
    },
    // Quart de tour dans le sens horaire d'une image W×H : le cadre suit l'image
    pivoter: function (c, W, H) { return { x: H - (c.y + c.h), y: c.x, w: c.h, h: c.w }; },
    // Cadre-guide affiché sur la vidéo (object-fit: cover) → pixels de la vidéo, avec une marge
    depuisGuide: function (vw, vh, video, guide, marge) {
      var e = Math.max(video.width / vw, video.height / vh);
      var dx = (video.width - vw * e) / 2, dy = (video.height - vh * e) / 2;
      var w = guide.width / e, h = guide.height / e;
      var mx = w * (marge || 0), my = h * (marge || 0);
      var x = borner((guide.left - video.left - dx) / e - mx, 0, vw);
      var y = borner((guide.top - video.top - dy) / e - my, 0, vh);
      return { x: x, y: y, w: Math.min(vw - x, w + 2 * mx), h: Math.min(vh - y, h + 2 * my) };
    },
    // Taille de l'image envoyée : « max » pixels au plus sur le grand côté, jamais agrandie
    sortie: function (c, max) {
      var r = Math.min(1, max / Math.max(c.w, c.h));
      return { w: Math.round(c.w * r), h: Math.round(c.h * r) };
    },
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = Cadre; return; }

  var zone = document.getElementById('zonePiece');
  if (!zone) return;
  var form = zone.closest('form');
  var champ = document.getElementById('champPiece'); // photo envoyée (name="piece") ; capture : appareil photo du téléphone
  var dlg = document.getElementById('dlgPiece');
  var video = document.getElementById('videoPiece');
  var zoneCamera = dlg.querySelector('.piece-camera');
  var guide = dlg.querySelector('.piece-camera__guide');
  var toile = document.getElementById('toileRognage');
  var boite = document.getElementById('cadreRognage');
  var btnValider = dlg.querySelector('[data-action="valider"]');
  var apercu = document.getElementById('apercuPiece');
  var apercuImg = apercu.querySelector('img');
  var apercuInfo = apercu.querySelector('[data-info]');
  var btnRecadrer = document.getElementById('btnRecadrer');
  var erreurZone = document.getElementById('erreurPiece');
  var erreurCamera = document.getElementById('erreurCamera');
  var erreurRognage = document.getElementById('erreurRognage');
  var bouton = form.querySelector('[type="submit"]');
  var COTE_MAX = 1600, COTE_MIN = 600, SOURCE_MAX = 3200, LIMITE = 4 * 1024 * 1024;
  var RATIO = zone.dataset.type === 'passeport' ? 125 / 88 : 85.6 / 54; // format ID-1 (CNI) ou page de passeport
  var dejaJointe = zone.dataset.jointe === '1';
  var flux = null; // flux de la caméra en cours
  var demande = 0; // numéro de la dernière demande d'accès à la caméra (les réponses périmées sont ignorées)
  var source = null; // image à rogner (canvas, 3 200 px au plus)
  var cadre = null; // { x, y, w, h } en pixels de « source »
  var glisse = null; // geste de rognage en cours
  var prise = null; // { le, source } : heure de prise (horloge de l'appareil) et source de la photo en cours
  var piece = null; // { blob, w, h } : image validée
  var dataTransferOk = false;

  // Amélioration progressive : sans JavaScript, le simple champ « fichier » reste
  zone.querySelectorAll('[data-avec-js]').forEach(function (el) { el.hidden = false; });
  zone.querySelectorAll('[data-sans-js]').forEach(function (el) { el.hidden = true; });
  champ.removeAttribute('required');
  if (!window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) {
    dlg.querySelectorAll('[data-telephone]').forEach(function (el) { el.remove(); });
  }

  function message(el, texte) { el.textContent = texte || ''; el.hidden = !texte; }
  function ecran(nom) { dlg.querySelectorAll('[data-ecran]').forEach(function (e) { e.hidden = e.dataset.ecran !== nom; }); }
  function ouvrirDialogue() { if (dlg.open) return; if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  function fermerDialogue() {
    arreterCamera();
    if (!dlg.open) return;
    if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
  }

  // ── Appareil photo dans la page ──
  function placerGuide() {
    var r = zoneCamera.getBoundingClientRect();
    if (!r.width) return;
    var w = Math.min(r.width * 0.88, r.height * 0.8 * RATIO);
    guide.style.width = w + 'px';
    guide.style.height = w / RATIO + 'px';
  }
  function arreterCamera() {
    demande++; // une demande encore en cours sera arrêtée dès sa réponse
    if (flux) flux.getTracks().forEach(function (t) { t.stop(); });
    flux = null;
    video.srcObject = null;
  }
  function cameraIndisponible() {
    arreterCamera();
    dlg.classList.add('sans-camera');
    message(erreurCamera, dlg.querySelector('[data-telephone]')
      ? 'L’appareil photo ne peut pas s’ouvrir dans la page (autorisation refusée ?). Ouvrez l’appareil photo du téléphone pour photographier votre pièce.'
      : 'Aucun appareil photo utilisable : autorisez la caméra dans votre navigateur, ou votez depuis un téléphone ou un ordinateur équipé d’une caméra.');
  }
  function ouvrirCamera() {
    message(erreurCamera, '');
    dlg.classList.remove('sans-camera');
    ecran('camera');
    ouvrirDialogue();
    placerGuide();
    if (!window.isSecureContext || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return cameraIndisponible();
    arreterCamera(); // flux précédent éventuel
    var n = ++demande;
    navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } } })
      .then(function (f) {
        // Fenêtre fermée ou nouvelle demande entre-temps : ce flux ne sert plus, la caméra est éteinte
        if (!dlg.open || n !== demande) { f.getTracks().forEach(function (t) { t.stop(); }); return; }
        flux = f;
        video.srcObject = f;
        var lecture = video.play();
        if (lecture && lecture.catch) lecture.catch(function () {});
      })
      .catch(function () { if (n === demande) cameraIndisponible(); });
  }
  function declencher() {
    var vw = video.videoWidth, vh = video.videoHeight;
    if (!flux || !vw || !vh) return;
    var c = document.createElement('canvas');
    c.width = vw;
    c.height = vh;
    c.getContext('2d').drawImage(video, 0, 0, vw, vh);
    var initial = Cadre.depuisGuide(vw, vh, video.getBoundingClientRect(), guide.getBoundingClientRect(), 0.04);
    prise = { le: new Date().toISOString(), source: 'camera' };
    arreterCamera();
    rogner(c, initial);
  }

  // ── Photo prise avec l'appareil photo du téléphone (secours) ──
  function lireFichier(entree) {
    var f = entree.files && entree.files[0];
    if (!f) return;
    message(erreurZone, '');
    if (f.type && !/^image\//.test(f.type)) { entree.value = ''; remettre(); return message(erreurZone, 'Ce n’est pas une photo : reprenez la photo de votre pièce.'); }
    var url = URL.createObjectURL(f);
    var img = new Image();
    img.onload = function () {
      URL.revokeObjectURL(url);
      entree.value = ''; // l'image rognée prendra sa place
      var w = img.naturalWidth, h = img.naturalHeight;
      if (Math.max(w, h) < COTE_MIN) { remettre(); return message(erreurZone, 'Image trop petite pour être lisible : photographiez la pièce de plus près.'); }
      var r = Math.min(1, SOURCE_MAX / Math.max(w, h)); // les très grandes photos dépassent la mémoire des navigateurs mobiles
      var c = document.createElement('canvas');
      c.width = Math.round(w * r);
      c.height = Math.round(h * r);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      prise = { le: new Date(f.lastModified || Date.now()).toISOString(), source: 'appareil' }; // photo de l'appareil : prise à l'instant
      ouvrirDialogue();
      rogner(c, { x: 0, y: 0, w: c.width, h: c.height });
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      entree.value = '';
      remettre();
      message(erreurZone, /hei[cf]/i.test(f.type) || /\.hei[cf]$/i.test(f.name || '')
        ? 'Format HEIC non accepté : dans les réglages de l’appareil photo, choisissez « le plus compatible » (JPEG), puis reprenez la photo.'
        : 'Photo illisible : reprenez la photo de votre pièce.');
    };
    img.src = url;
  }

  // ── Rognage ──
  function rogner(c, initial) {
    source = c;
    cadre = initial;
    message(erreurRognage, '');
    ecran('rognage');
    var r = Math.min(1, 1400 / Math.max(c.width, c.height));
    toile.width = Math.round(c.width * r);
    toile.height = Math.round(c.height * r);
    toile.getContext('2d').drawImage(c, 0, 0, toile.width, toile.height);
    requestAnimationFrame(placerBoite);
  }
  function echelle() { return toile.getBoundingClientRect().width / source.width; }
  function placerBoite() {
    if (!source) return;
    var e = echelle();
    boite.style.left = cadre.x * e + 'px';
    boite.style.top = cadre.y * e + 'px';
    boite.style.width = cadre.w * e + 'px';
    boite.style.height = cadre.h * e + 'px';
    var tropPetit = Math.max(cadre.w, cadre.h) < COTE_MIN;
    message(erreurRognage, tropPetit ? 'Cadre trop petit pour que la pièce soit lisible : agrandissez-le, ou rapprochez-vous et reprenez la photo.' : '');
    btnValider.disabled = tropPetit;
  }
  function tailleMin(e) { return Math.max(40 / e, Math.max(source.width, source.height) * 0.05); }
  boite.addEventListener('pointerdown', function (ev) {
    if (glisse) return; // un seul doigt à la fois
    var e = echelle();
    glisse = { id: ev.pointerId, coin: (ev.target.dataset && ev.target.dataset.coin) || 'move', x: ev.clientX, y: ev.clientY, c: cadre, e: e };
    try { boite.setPointerCapture(ev.pointerId); } catch (err) { /* navigateur ancien */ }
    ev.preventDefault();
  });
  boite.addEventListener('pointermove', function (ev) {
    if (!glisse || ev.pointerId !== glisse.id) return;
    cadre = Cadre.ajuster(glisse.c, glisse.coin, (ev.clientX - glisse.x) / glisse.e, (ev.clientY - glisse.y) / glisse.e, source.width, source.height, tailleMin(glisse.e));
    placerBoite();
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) {
    boite.addEventListener(t, function (ev) { if (glisse && ev.pointerId === glisse.id) glisse = null; });
  });
  // Clavier : flèches = déplacer le cadre ; Maj + flèches = l'agrandir ou le réduire
  boite.addEventListener('keydown', function (ev) {
    var pas = Math.max(source.width, source.height) * 0.02;
    var d = { ArrowLeft: [-pas, 0], ArrowRight: [pas, 0], ArrowUp: [0, -pas], ArrowDown: [0, pas] }[ev.key];
    if (!d) return;
    ev.preventDefault();
    cadre = Cadre.ajuster(cadre, ev.shiftKey ? 'se' : 'move', d[0], d[1], source.width, source.height, tailleMin(echelle()));
    placerBoite();
  });
  function pivoter() {
    var c = document.createElement('canvas');
    c.width = source.height;
    c.height = source.width;
    var ctx = c.getContext('2d');
    ctx.translate(c.width, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(source, 0, 0);
    rogner(c, Cadre.pivoter(cadre, source.width, source.height));
  }
  function valider() {
    var t = Cadre.sortie(cadre, COTE_MAX);
    var c = document.createElement('canvas');
    c.width = t.w;
    c.height = t.h;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, t.w, t.h);
    ctx.drawImage(source, cadre.x, cadre.y, cadre.w, cadre.h, 0, 0, t.w, t.h);
    btnValider.disabled = true;
    (function encoder(q) {
      c.toBlob(function (b) {
        if (b && b.size > 700 * 1024 && q > 0.6) return encoder(q - 0.12);
        btnValider.disabled = false;
        if (!b || b.size > LIMITE) return message(erreurRognage, 'L’image n’a pas pu être préparée : réessayez.');
        piece = { blob: b, w: t.w, h: t.h, source: source, cadre: cadre, prise: prise }; // « Recadrer » repart de cette image
        attacher();
        fermerDialogue();
      }, 'image/jpeg', q);
    })(0.85);
  }

  // ── Image validée : placée dans le formulaire et montrée à l'électeur ──
  function attacher() {
    dataTransferOk = false;
    try {
      var dt = new DataTransfer();
      dt.items.add(new File([piece.blob], 'piece-identite.jpg', { type: 'image/jpeg' }));
      champ.files = dt.files;
      dataTransferOk = champ.files.length === 1;
    } catch (e) { /* navigateur ancien : envoi par fetch, voir plus bas */ }
    // Heure de prise et source : le serveur les incruste sous la photo avec son heure de réception
    document.getElementById('prisLePiece').value = piece.prise ? piece.prise.le : '';
    document.getElementById('sourcePiece').value = piece.prise ? piece.prise.source : '';
    if (/^blob:/.test(apercuImg.src)) URL.revokeObjectURL(apercuImg.src);
    apercuImg.src = URL.createObjectURL(piece.blob);
    apercuImg.hidden = false;
    apercu.hidden = false;
    apercuInfo.textContent = '✓ Pièce prête : ' + piece.w + ' × ' + piece.h + ' px, ' + Math.round(piece.blob.size / 1024) + ' Ko. Vérifiez que votre nom et le numéro sont lisibles.';
    btnRecadrer.hidden = false;
    document.getElementById('btnCamera').textContent = '📷 Reprendre la photo';
    message(erreurZone, '');
    zone.classList.add('is-prete');
  }
  // Fenêtre fermée sans valider : l'image validée auparavant reste jointe
  function remettre() { if (piece) attacher(); }

  // ── Commandes ──
  document.getElementById('btnCamera').addEventListener('click', ouvrirCamera);
  btnRecadrer.addEventListener('click', function () { if (!piece) return; prise = piece.prise; ouvrirDialogue(); rogner(piece.source, piece.cadre); });
  champ.addEventListener('change', function () { lireFichier(champ); });
  dlg.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-action]');
    if (!b) return;
    var a = b.dataset.action;
    if (a === 'declencher') declencher();
    else if (a === 'fermer') { fermerDialogue(); remettre(); }
    else if (a === 'telephone') { fermerDialogue(); champ.click(); }
    else if (a === 'reprendre') ouvrirCamera();
    else if (a === 'pivoter') pivoter();
    else if (a === 'entiere') { cadre = { x: 0, y: 0, w: source.width, h: source.height }; placerBoite(); }
    else if (a === 'valider') valider();
  });
  dlg.addEventListener('cancel', function () { arreterCamera(); remettre(); }); // touche Échap
  // L'événement « close » arrive après coup : la fenêtre a pu être rouverte entre-temps
  dlg.addEventListener('close', function () { if (!dlg.open) arreterCamera(); });
  window.addEventListener('resize', function () { if (dlg.open) { placerGuide(); placerBoite(); } });
  window.addEventListener('pagehide', arreterCamera);

  // Envoi : pièce obligatoire (sauf si déjà jointe) ; navigateur sans DataTransfer : envoi par fetch
  var texteBouton = bouton.textContent;
  form.addEventListener('submit', function (ev) {
    if (ev.defaultPrevented) return; // bulletin nul à confirmer : envoi déjà arrêté
    var fichier = champ.files && champ.files.length;
    if (!dejaJointe && !piece && !fichier) {
      ev.preventDefault();
      message(erreurZone, 'Joignez la photo de votre pièce d’identité : touchez « Photographier ma pièce ».');
      zone.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!piece || dataTransferOk) return;
    ev.preventDefault();
    var donnees = new FormData(form);
    donnees.set('piece', piece.blob, 'piece-identite.jpg');
    bouton.disabled = true;
    bouton.textContent = 'Envoi en cours…';
    fetch(form.action, { method: 'POST', body: donnees, credentials: 'same-origin' })
      .then(function (r) {
        var cible = r.url.split('#')[0];
        if (cible === location.href.split('#')[0]) location.reload();
        else location.href = cible + '#vote';
      })
      .catch(function () {
        bouton.disabled = false;
        bouton.textContent = texteBouton;
        message(erreurZone, 'Envoi impossible : vérifiez votre connexion, puis réessayez.');
      });
  });

  // Ouverture automatique de l'appareil photo, une fois par électeur identifié (pas après « Annuler »)
  var cle = 'eduweb:camera-piece:' + (zone.dataset.cle || '');
  var dejaProposee = false;
  try { dejaProposee = sessionStorage.getItem(cle) === '1'; sessionStorage.setItem(cle, '1'); } catch (e) { /* stockage indisponible */ }
  if (!dejaJointe && !dejaProposee) setTimeout(ouvrirCamera, 300);
})();
