// Téléchargement payant des ressources didactiques :
// - « Télécharger » d'une ressource payante ([data-paiement]) ouvre la fenêtre
//   d'invitation à payer au lieu de suivre le lien (repli : page de paiement) ;
// - la déclaration part en arrière-plan (réponse JSON) et la fenêtre affiche le
//   délai de réception du lien ;
// - « Copier » met le numéro de réception dans le presse-papiers ;
// - lecteurs protégés ([data-protege]) : pas de clic droit « Enregistrer sous »,
//   et « Plein écran » agrandit le lecteur au lieu d'ouvrir le fichier brut ;
// - paiement déclaré depuis cet appareil ([data-attente-paiement], ou fenêtre
//   juste envoyée — ses boutons de paiement deviennent « en vérification ») :
//   la page interroge /ressources/:id/acces et s'actualise d'elle-même dès que
//   l'admin confirme, quelle que soit l'adresse e-mail saisie (souvent celle
//   d'un parent) : quiz complet et téléchargement (banque : la carte se met à
//   jour sur place, sans refermer les accordéons).
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
          // Cet appareil a retenu la déclaration : plus de bouton de paiement pour
          // cette ressource, et la page se débloquera d'elle-même dès la validation
          var cible = /\/ressources\/([^/]+)\/achat/.exec(form.getAttribute('action') || '');
          if (cible) { var idRes = decodeURIComponent(cible[1]); marquerEnAttente(idRes); surveiller(idRes); }
        })
        .catch(function () { echec('Connexion impossible — vérifiez votre réseau puis réessayez.'); });
    });
  });

  // ─── Attente de la validation du paiement ───
  // Interrogation toutes les 15 s (60 s après 10 min), suspendue quand la page
  // est cachée, relancée aussitôt quand l'élève revient sur la page. Une panne
  // passagère (réseau, 5xx) n'arrête jamais l'attente : seul un paiement rejeté
  // ou supprimé (attente: false) y met fin.
  var surveilles = {};
  function surveiller(id) {
    if (!id || surveilles[id] || !window.fetch) return;
    surveilles[id] = true;
    var debut = Date.now(), minuteur = null, enCours = false, fini = false;
    function planifier() {
      clearTimeout(minuteur);
      if (fini || document.hidden) return;
      minuteur = setTimeout(verifier, Date.now() - debut > 10 * 60 * 1000 ? 60000 : 15000);
    }
    function verifier() {
      if (fini || enCours) return;
      enCours = true;
      fetch('/ressources/' + encodeURIComponent(id) + '/acces', {
        credentials: 'same-origin', cache: 'no-store', headers: { Accept: 'application/json' },
      })
        .then(function (r) {
          if (r.status >= 500) throw new Error('HTTP ' + r.status); // panne passagère : on réessaie
          return r.json();
        })
        .then(function (d) {
          enCours = false;
          if (d && d.paye) { fini = true; debloquer(id); return; }
          if (d && d.attente === false) { fini = true; plusEnAttente(id); return; } // rejeté, supprimé
          planifier();
        })
        .catch(function () { enCours = false; planifier(); });
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearTimeout(minuteur); else verifier();
    });
    window.addEventListener('focus', verifier);
    planifier();
  }
  // Déclaration envoyée depuis cette page : plus aucun bouton de paiement pour
  // cette ressource (pas de second paiement) ; la page du chant se recharge à la
  // fermeture de la fenêtre pour afficher l'état d'attente rendu par le serveur.
  var rechargerALaFermeture = false;
  function marquerEnAttente(id) {
    document.querySelectorAll('[data-paiement="' + id + '"]').forEach(function (el) {
      var badge = document.createElement('span');
      badge.className = 'ress-carte__attente';
      badge.setAttribute('data-attente-paiement', id);
      badge.textContent = '⏳ Paiement en vérification — se débloque tout seul';
      el.parentNode.replaceChild(badge, el);
    });
    if (document.getElementById('quizDejaPaye')) rechargerALaFermeture = true;
  }
  document.addEventListener('click', function (e) {
    if (rechargerALaFermeture && e.target.closest('#modal-paiement [data-close-modal]')) window.location.reload();
  });
  document.addEventListener('keydown', function (e) {
    if (rechargerALaFermeture && e.key === 'Escape') window.location.reload();
  });

  // Paiement rejeté ou supprimé : une page rendue « en vérification » se recharge
  // une fois (le serveur rend alors l'état normal, sans bandeau : pas de boucle ;
  // garde-fou : au plus un rechargement par ressource toutes les 5 min). Fenêtre
  // de remerciement encore ouverte : on ne la coupe pas.
  function plusEnAttente(id) {
    var bandeaux = document.querySelectorAll('[data-attente-paiement="' + id + '"]');
    if (!bandeaux.length) return;
    if (document.querySelector('.paie-dl__merci:not([hidden])')) {
      bandeaux.forEach(function (el) { el.textContent = '⏳ Paiement déclaré — le lien arrivera par e-mail.'; });
      return;
    }
    var cle = 'eduweb_attente_' + id, avant = 0;
    try { avant = Number(sessionStorage.getItem(cle)) || 0; sessionStorage.setItem(cle, String(Date.now())); } catch (e) { /* stockage bloqué */ }
    if (Date.now() - avant > 5 * 60 * 1000) { window.location.reload(); return; }
    bandeaux.forEach(function (el) { el.textContent = 'Paiement non validé : recharge la page pour payer ou déclarer à nouveau.'; });
  }

  // Paiement validé. Banque : la carte se met à jour sur place (un rechargement
  // refermerait les accordéons et couperait le clip en lecture). Ailleurs (page
  // du chant, page de paiement) : la page se recharge — quiz complet, téléchargement.
  function debloquer(id) {
    var cartes = document.querySelectorAll('.ress-carte[data-ressource-id="' + id + '"]');
    if (cartes.length) {
      cartes.forEach(function (carte) {
        carte.querySelectorAll('[data-attente-paiement="' + id + '"], [data-paiement="' + id + '"]').forEach(function (el) {
          var a = document.createElement('a');
          a.className = 'btn ' + (carte.querySelector('video') ? 'btn--ghost' : 'btn--primary') + ' btn--sm';
          a.href = '/ressources/' + encodeURIComponent(id) + '/telecharger';
          a.rel = 'nofollow';
          a.textContent = '⬇️ Télécharger (déjà payé)';
          el.parentNode.replaceChild(a, el);
        });
      });
      var ok = document.querySelector('.paie-dl__merci:not([hidden]) .paie-dl__merci-titre');
      if (ok) ok.textContent = '✅ Paiement validé ! « Télécharger (déjà payé) » est disponible sur la carte.';
      return;
    }
    document.querySelectorAll('[data-attente-paiement="' + id + '"]').forEach(function (el) {
      el.textContent = '✅ Paiement validé ! La page se met à jour…';
      el.classList.add('quiz-note--ok');
    });
    var merci = document.querySelector('.paie-dl__merci:not([hidden]) .paie-dl__merci-titre');
    if (merci) merci.textContent = '✅ Paiement validé ! La page se met à jour…';
    setTimeout(function () { window.location.reload(); }, 1200);
  }
  document.querySelectorAll('[data-attente-paiement]').forEach(function (el) {
    surveiller(el.getAttribute('data-attente-paiement'));
  });

  document.querySelectorAll('[data-protege]').forEach(function (media) {
    media.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  });
})();
