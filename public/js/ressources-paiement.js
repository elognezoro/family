// Téléchargement payant des ressources didactiques :
// - « Télécharger » d'une ressource payante ([data-paiement]) ouvre la fenêtre
//   d'invitation à payer au lieu de suivre le lien (repli : page de paiement) ;
// - la déclaration part en arrière-plan (réponse JSON) et la fenêtre affiche le
//   délai de réception du lien ;
// - « Copier » met le numéro de réception dans le presse-papiers ;
// - lecteurs protégés ([data-protege]) : pas de clic droit « Enregistrer sous »,
//   et « Plein écran » agrandit le lecteur au lieu d'ouvrir le fichier brut.
(function () {
  'use strict';
  var modal = document.getElementById('modal-paiement');

  function reinitialiser(bloc) {
    var form = bloc.querySelector('[data-paie-form]');
    var merci = bloc.querySelector('.paie-dl__merci');
    var erreur = bloc.querySelector('.paie-dl__erreur');
    if (form) form.hidden = false;
    if (merci) merci.hidden = true;
    if (erreur) erreur.hidden = true;
  }

  function ouvrir(lien) {
    if (!modal) return false;
    var form = modal.querySelector('[data-paie-form]');
    var id = lien.getAttribute('data-paiement');
    // Nouvelle ressource : nouvelle déclaration (la référence d'un autre achat ne resservira pas)
    if (form.getAttribute('data-ressource') !== id) {
      var ref = form.querySelector('input[name="refTransaction"]');
      if (ref) ref.value = '';
      form.setAttribute('data-ressource', id);
    }
    form.setAttribute('action', '/ressources/' + encodeURIComponent(id) + '/achat');
    modal.querySelector('[data-paie-titre]').textContent = '« ' + (lien.getAttribute('data-titre') || '') + ' »';
    reinitialiser(modal);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var fermer = modal.querySelector('.modal__close');
    if (fermer) fermer.focus();
    return true;
  }

  document.addEventListener('click', function (e) {
    var lien = e.target.closest('[data-paiement]');
    if (lien && ouvrir(lien)) { e.preventDefault(); return; }

    var copier = e.target.closest('[data-copier]');
    if (copier) {
      var texte = copier.getAttribute('data-copier');
      var libelle = copier.getAttribute('data-libelle') || copier.textContent;
      copier.setAttribute('data-libelle', libelle);
      var fait = function () {
        copier.textContent = 'Copié ✓';
        setTimeout(function () { copier.textContent = libelle; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texte).then(fait, function () {});
      }
      return;
    }

    var corriger = e.target.closest('[data-paie-corriger]');
    if (corriger) {
      var bloc = corriger.closest('.paie-dl');
      reinitialiser(bloc);
      var champ = bloc.querySelector('input[name="email"]');
      if (champ) { champ.focus(); champ.select(); }
      return;
    }

    var plein = e.target.closest('[data-plein-ecran]');
    if (plein) {
      var carte = plein.closest('[data-ressource-id]');
      var video = carte && carte.querySelector('video');
      if (!video) return;
      if (video.requestFullscreen) video.requestFullscreen().catch(function () {});
      else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen(); // iPhone
      if (video.paused) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    }
  });

  document.querySelectorAll('[data-paie-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.fetch || !window.FormData || !window.URLSearchParams) return; // envoi classique
      e.preventDefault();
      var bloc = form.closest('.paie-dl');
      var erreur = bloc.querySelector('.paie-dl__erreur');
      var bouton = form.querySelector('button[type="submit"]');
      var echec = function (message) {
        bouton.disabled = false;
        erreur.textContent = message;
        erreur.hidden = false;
      };
      erreur.hidden = true;
      bouton.disabled = true;
      fetch(form.getAttribute('action'), {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (d) {
          if (!d || !d.ok) return echec((d && d.erreur) || 'La déclaration n’a pas pu être envoyée. Réessayez dans un instant.');
          bouton.disabled = false;
          var merci = bloc.querySelector('.paie-dl__merci');
          merci.querySelector('[data-merci-email]').textContent = d.email || '';
          form.hidden = true;
          merci.hidden = false;
        })
        .catch(function () { echec('Connexion impossible — vérifiez votre réseau puis réessayez.'); });
    });
  });

  document.querySelectorAll('[data-protege]').forEach(function (media) {
    media.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
})();
