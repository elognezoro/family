// Banque de ressources : barre latérale des cycles et accordéons exclusifs.
// - Un clic sur un cycle affiche son panneau sans recharger la page (les
//   boutons restent de vrais liens ?cycle=… si ce script ne se charge pas),
//   met l'adresse à jour et retient le choix pour la prochaine visite.
// - Ouvrir un accordéon referme les autres du même rang (même attribut name) :
//   natif dans les navigateurs récents, assuré ici pour les autres. La page est
//   recalée pour que le résumé cliqué ne saute pas quand un accordéon situé
//   au-dessus se referme.
(function () {
  'use strict';
  var CLE = 'eduweb.banque.cycle';
  var HAUT_BARRE = 96; // = top de .banque-cycles (sous l'en-tête collant du site)
  var boutons = Array.prototype.slice.call(document.querySelectorAll('.cycle-btn[data-cycle]'));
  var panneaux = Array.prototype.slice.call(document.querySelectorAll('[data-cycle-panel]'));

  function pauseMedias(racine) {
    racine.querySelectorAll('video, audio').forEach(function (m) { try { m.pause(); } catch (e) {} });
  }

  // ─── Cycles ───
  function existe(id) {
    return panneaux.some(function (p) { return p.getAttribute('data-cycle-panel') === id; });
  }

  function afficher(id, memoriser) {
    if (!existe(id)) return;
    panneaux.forEach(function (p) {
      var visible = p.getAttribute('data-cycle-panel') === id;
      if (!visible && !p.hidden) pauseMedias(p); // un clip du cycle quitté ne continue pas en fond
      p.hidden = !visible;
    });
    boutons.forEach(function (b) {
      var actif = b.getAttribute('data-cycle') === id;
      b.classList.toggle('is-actif', actif);
      if (actif) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    if (memoriser) {
      try { localStorage.setItem(CLE, id); } catch (e) { /* stockage indisponible : sans conséquence */ }
      try {
        var url = new URL(window.location.href);
        url.searchParams.set('cycle', id);
        history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch (e) {}
    }
  }

  if (boutons.length && panneaux.length) {
    boutons.forEach(function (b) {
      b.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return; // ouverture dans un nouvel onglet
        e.preventDefault();
        var id = b.getAttribute('data-cycle');
        afficher(id, true);
        // Le cycle choisi doit commencer à l'écran : toujours sur mobile (la barre est
        // au-dessus des panneaux) ; sur ordinateur, dès que son haut est sorti de l'écran
        // (clic depuis le bas d'un long cycle : la page a rétréci).
        var p = document.getElementById('cycle-' + id);
        if (!p) return;
        var mobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
        var haut = p.getBoundingClientRect().top;
        if (mobile || haut < HAUT_BARRE || haut > window.innerHeight) p.scrollIntoView({ block: 'start' });
        var titre = p.querySelector('.cycle-panel__titre');
        if (titre) { try { titre.focus({ preventScroll: true }); } catch (err) {} } // annonce le changement aux lecteurs d'écran
      });
    });

    // Sans ?cycle= dans l'adresse, on rouvre le dernier cycle choisi par ce visiteur
    try {
      var demande = new URL(window.location.href).searchParams.get('cycle');
      if (!demande) {
        var retenu = localStorage.getItem(CLE);
        if (retenu && existe(retenu)) afficher(retenu, false);
      }
    } catch (e) {}
  }

  // ─── Accordéons exclusifs ───
  // Position du résumé cliqué, mesurée AVANT que le navigateur ne referme l'accordéon
  // voisin ; la page est ensuite recalée de l'écart pour que ce résumé reste sous le doigt.
  function recaler(d) {
    if (typeof d._resumeAvant !== 'number') return;
    var resume = d.querySelector(':scope > summary');
    var ecart = resume ? resume.getBoundingClientRect().top - d._resumeAvant : 0;
    if (Math.abs(ecart) < 1) return;
    try { window.scrollBy({ top: ecart, behavior: 'instant' }); } catch (e) { window.scrollBy(0, ecart); }
  }

  document.querySelectorAll('.banque-layout details[name]').forEach(function (d) {
    var resume = d.querySelector(':scope > summary');
    if (resume) {
      resume.addEventListener('click', function () {
        if (d.open) { d._resumeAvant = undefined; return; } // on referme : rien ne bouge au-dessus
        d._resumeAvant = resume.getBoundingClientRect().top;
        // name natif : l'autre accordéon est déjà refermé à la prochaine image ; on recale avant l'affichage
        requestAnimationFrame(function () { recaler(d); });
      });
    }
    d.addEventListener('toggle', function () {
      if (!d.open) { pauseMedias(d); return; } // un accordéon refermé ne laisse pas un clip jouer en fond
      var nom = d.getAttribute('name');
      document.querySelectorAll('.banque-layout details[name]').forEach(function (autre) {
        if (autre !== d && autre.open && autre.getAttribute('name') === nom) autre.open = false;
      });
      recaler(d); // sans name natif : l'autre vient d'être refermé ici
      d._resumeAvant = undefined;
    });
  });
})();
