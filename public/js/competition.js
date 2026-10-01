/* Mode compétition — côté navigateur :
   1. inscription : vérification instantanée de l'e-mail (domaine qui reçoit du courrier) ;
   2. épreuve : chronomètre (fin = envoi automatique), étiquettes de classement
      cliquées dans l'ordre, protection contre la double remise et la sortie
      accidentelle. La correction, elle, est faite par le serveur. */
(function () {
  'use strict';

  // ─── 1. Inscription : état de l'e-mail ───
  var form = document.getElementById('compInscription');
  if (form) {
    var champ = document.getElementById('ci_email');
    var etat = document.getElementById('ciEmailEtat');
    var url = form.getAttribute('data-verif-url');
    var minuterie = null, derniere = '';
    function montrer(ok, texte) {
      etat.textContent = (ok === null ? '⏳ ' : ok ? '✅ ' : '❌ ') + texte;
      etat.className = 'hint comp-email-etat' + (ok === null ? '' : ok ? ' comp-email-etat--ok' : ' comp-email-etat--ko');
    }
    function verifier() {
      var v = champ.value.trim().toLowerCase();
      if (v === derniere) return;
      derniere = v;
      if (!v) { montrer(null, 'Un code de vérification vous sera envoyé à cette adresse.'); etat.className = 'hint comp-email-etat'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) { montrer(false, 'Adresse incomplète (ex. prenom@exemple.ci).'); return; }
      montrer(null, 'Vérification du domaine…');
      fetch(url + '?e=' + encodeURIComponent(v), { credentials: 'same-origin' })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (champ.value.trim().toLowerCase() === v) montrer(j.ok === null ? null : !!j.ok, j.message || ''); })
        .catch(function () { montrer(null, 'Vérification impossible pour le moment — le code envoyé par e-mail fera foi.'); });
    }
    champ.addEventListener('input', function () { clearTimeout(minuterie); minuterie = setTimeout(verifier, 600); });
    champ.addEventListener('blur', verifier);
    if (champ.value) verifier();
  }

  // ─── 2. Épreuve chronométrée ───
  var chrono = document.getElementById('compChrono');
  var epreuve = document.getElementById('compEpreuve');
  if (!chrono || !epreuve) return;

  var restant = parseInt(chrono.getAttribute('data-restant'), 10) || 0;
  var duree = parseInt(chrono.getAttribute('data-duree'), 10) || 1;
  var fin = Date.now() + restant;
  var txt = document.getElementById('compChronoTxt');
  var barre = document.getElementById('compChronoBarre');
  var remis = false;

  function remettre(auto) {
    if (remis) return;
    remis = true;
    var btn = document.getElementById('compRemettre');
    if (btn) { btn.disabled = true; btn.textContent = auto ? '⏱️ Temps écoulé — envoi…' : '⏳ Envoi…'; }
    window.removeEventListener('beforeunload', garde);
    if (auto) epreuve.submit(); // envoi des réponses déjà saisies
  }
  function tic() {
    var r = Math.max(0, fin - Date.now());
    var s = Math.ceil(r / 1000);
    txt.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
    barre.style.width = Math.max(0, Math.min(100, (r / duree) * 100)) + '%';
    chrono.classList.toggle('comp-chrono--alerte', r <= 60 * 1000);
    if (r <= 0) { remettre(true); return; }
    setTimeout(tic, 250);
  }
  tic();

  // Étiquettes de classement : chaque clic reçoit son rang → champ caché « 2,0,1,3 »
  Array.prototype.forEach.call(epreuve.querySelectorAll('[data-classement]'), function (bloc) {
    var cache = bloc.querySelector('input[type="hidden"]');
    var items = bloc.querySelectorAll('.classement__item');
    var seq = [];
    Array.prototype.forEach.call(items, function (item) {
      item.addEventListener('click', function () {
        var j = parseInt(item.getAttribute('data-j'), 10);
        if (seq.indexOf(j) !== -1) return;
        seq.push(j);
        var rang = item.querySelector('.classement__rang');
        rang.textContent = seq.length;
        rang.hidden = false;
        item.classList.add('classement__item--choisi');
        cache.value = seq.join(',');
      });
    });
    bloc.querySelector('.classement__reset').addEventListener('click', function () {
      seq = [];
      cache.value = '';
      Array.prototype.forEach.call(items, function (item) {
        item.classList.remove('classement__item--choisi');
        var rang = item.querySelector('.classement__rang');
        rang.hidden = true;
        rang.textContent = '';
      });
    });
  });

  // Sortie accidentelle (le chrono continue côté serveur, mais autant prévenir)
  function garde(e) { e.preventDefault(); e.returnValue = ''; }
  window.addEventListener('beforeunload', garde);

  epreuve.addEventListener('submit', function (e) {
    if (remis) { e.preventDefault(); return; }
    var sansReponse = Array.prototype.filter.call(epreuve.querySelectorAll('.quiz-q'), function (q) {
      var coche = q.querySelector('input:checked');
      var texte = q.querySelector('input[type="text"], input[type="hidden"]');
      return !coche && !(texte && texte.value.trim());
    }).length;
    if (sansReponse && !window.confirm(sansReponse + ' question(s) sans réponse. Remettre quand même ?')) { e.preventDefault(); return; }
    remettre(false);
  });
})();
