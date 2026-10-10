// Banque de ressources : barre latérale des cycles et accordéons exclusifs.
// - Un clic sur un cycle affiche son panneau sans recharger la page (les
//   boutons restent de vrais liens ?cycle=… si ce script ne se charge pas),
//   met l'adresse à jour et retient le choix pour la prochaine visite.
// - Ouvrir un accordéon referme les autres du même rang (même attribut name) :
//   natif dans les navigateurs récents, assuré ici pour les autres.
(function () {
  'use strict';
  var CLE = 'eduweb.banque.cycle';
  var boutons = Array.prototype.slice.call(document.querySelectorAll('.cycle-btn[data-cycle]'));
  var panneaux = Array.prototype.slice.call(document.querySelectorAll('[data-cycle-panel]'));
  if (!boutons.length || !panneaux.length) return;

  function existe(id) {
    return panneaux.some(function (p) { return p.getAttribute('data-cycle-panel') === id; });
  }

  function afficher(id, memoriser) {
    if (!existe(id)) return;
    panneaux.forEach(function (p) {
      var visible = p.getAttribute('data-cycle-panel') === id;
      if (!visible && !p.hidden) {
        // un clip qui jouait dans le cycle quitté ne doit pas continuer en fond
        p.querySelectorAll('video, audio').forEach(function (m) { try { m.pause(); } catch (e) {} });
      }
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

  boutons.forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return; // ouverture dans un nouvel onglet
      e.preventDefault();
      afficher(b.getAttribute('data-cycle'), true);
      // sur mobile, la barre est au-dessus des panneaux : on amène le cycle à l'écran
      if (window.matchMedia && window.matchMedia('(max-width: 900px)').matches) {
        var p = document.getElementById('cycle-' + b.getAttribute('data-cycle'));
        if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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

  // Accordéons exclusifs : à l'ouverture, on referme les autres du même nom
  document.querySelectorAll('.banque-layout details[name]').forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) { // un accordéon refermé ne laisse pas un clip jouer en fond
        d.querySelectorAll('video, audio').forEach(function (m) { try { m.pause(); } catch (e) {} });
        return;
      }
      var nom = d.getAttribute('name');
      document.querySelectorAll('.banque-layout details[name]').forEach(function (autre) {
        if (autre !== d && autre.open && autre.getAttribute('name') === nom) autre.open = false;
      });
    });
  });
})();
