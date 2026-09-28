// Fréquentation des ressources didactiques : signale au serveur la première
// lecture d'un média (consultation) et les clics « Plein écran / Ouvrir »
// (consultation) ou « Télécharger » (téléchargement), puis met à jour le
// compteur affiché. Portée : tout conteneur [data-ressource-id].
(function () {
  'use strict';
  var envoyes = {};

  function formater(n) {
    try { return n.toLocaleString('fr-FR'); } catch (e) { return String(n); }
  }

  function afficher(conteneur, type, n) {
    var val = conteneur.querySelector('[data-stat-val="' + type + '"]');
    if (!val) return;
    val.setAttribute('data-n', String(n));
    val.textContent = formater(n);
    var lib = conteneur.querySelector('[data-stat-lib="' + type + '"]');
    if (lib) lib.textContent = n > 1 ? lib.getAttribute('data-pluriel') : lib.getAttribute('data-singulier');
  }

  function compter(conteneur, type) {
    var id = conteneur.getAttribute('data-ressource-id');
    if (!id || (type !== 'vue' && type !== 'telechargement')) return;
    var cle = id + ':' + type;
    if (envoyes[cle]) return;
    envoyes[cle] = true;
    var url = '/ressources/' + encodeURIComponent(id) + '/stat/' + type;
    try {
      if (!(navigator.sendBeacon && navigator.sendBeacon(url))) {
        fetch(url, { method: 'POST', keepalive: true, credentials: 'same-origin' }).catch(function () {});
      }
    } catch (e) { /* le compteur n'est jamais bloquant */ }
    var val = conteneur.querySelector('[data-stat-val="' + type + '"]');
    if (val) afficher(conteneur, type, (parseInt(val.getAttribute('data-n'), 10) || 0) + 1);
  }

  document.querySelectorAll('[data-ressource-id]').forEach(function (conteneur) {
    conteneur.querySelectorAll('video, audio').forEach(function (media) {
      media.addEventListener('play', function () { compter(conteneur, 'vue'); }, { once: true });
    });
    conteneur.querySelectorAll('[data-stat]').forEach(function (lien) {
      lien.addEventListener('click', function () { compter(conteneur, lien.getAttribute('data-stat')); });
    });
  });
})();
