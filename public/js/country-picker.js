/* EduWeb — Sélecteur de pays en modal centré (bottom-sheet sur mobile) */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('select[data-country-picker]').forEach(setup);
  });

  function flag(code) {
    return '<span class="fi fi-' + code + '"></span>';
  }

  function setup(select) {
    const groups = window.EDUWEB_COUNTRIES || [];
    const all = groups.flatMap((g) => g.countries.map((c) => ({ ...c, region: g.region })));

    // Cache le select natif
    select.style.display = 'none';

    // Bouton déclencheur
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'country-trigger';
    select.parentNode.insertBefore(trigger, select.nextSibling);

    function currentCountry() {
      return all.find((c) => c.code === select.value) || all[0];
    }
    function renderTrigger() {
      const c = currentCountry();
      trigger.innerHTML = c
        ? flag(c.code) + '<span>' + c.name + '</span><span class="country-trigger__caret">▾</span>'
        : 'Sélectionner un pays';
    }
    renderTrigger();

    // Modal
    const modal = document.createElement('div');
    modal.className = 'cp-modal';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="cp-modal__backdrop"></div>' +
      '<div class="cp-modal__dialog">' +
        '<div class="cp-modal__head">' +
          '<h3>Sélectionner un pays</h3>' +
          '<button type="button" class="cp-modal__close" aria-label="Fermer">&times;</button>' +
        '</div>' +
        '<div class="cp-modal__search"><input type="text" placeholder="Rechercher un pays…" autocomplete="off"></div>' +
        '<div class="cp-modal__list"></div>' +
      '</div>';
    document.body.appendChild(modal);

    const listEl = modal.querySelector('.cp-modal__list');
    const searchEl = modal.querySelector('.cp-modal__search input');

    function buildList(filter) {
      const f = (filter || '').trim().toLowerCase();
      listEl.innerHTML = '';
      groups.forEach((g) => {
        const matches = g.countries.filter((c) => c.name.toLowerCase().includes(f));
        if (!matches.length) return;
        const section = document.createElement('div');
        section.className = 'cp-group';
        section.innerHTML = '<div class="cp-group__title">' + g.region + '</div>';
        matches.forEach((c) => {
          const item = document.createElement('button');
          item.type = 'button';
          item.className = 'cp-item' + (c.code === select.value ? ' is-selected' : '');
          item.innerHTML = flag(c.code) + '<span>' + c.name + '</span>';
          item.addEventListener('click', () => choose(c.code));
          section.appendChild(item);
        });
        listEl.appendChild(section);
      });
      if (!listEl.children.length) {
        listEl.innerHTML = '<p class="cp-empty">Aucun pays trouvé.</p>';
      }
    }

    function open() {
      buildList('');
      searchEl.value = '';
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchEl.focus(), 50);
    }
    function close() {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
    function choose(code) {
      select.value = code;
      renderTrigger();
      close();
      select.dispatchEvent(new Event('change', { bubbles: true }));
      document.dispatchEvent(
        new CustomEvent('eduweb:country-changed', {
          detail: { code: code, zoneId: select.dataset.zoneId || null },
        })
      );
    }

    trigger.addEventListener('click', open);
    modal.querySelector('.cp-modal__close').addEventListener('click', close);
    modal.querySelector('.cp-modal__backdrop').addEventListener('click', close);
    searchEl.addEventListener('input', () => buildList(searchEl.value));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) close();
    });

    // Émet l'état initial pour la cascade géo
    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent('eduweb:country-changed', {
          detail: { code: select.value, zoneId: select.dataset.zoneId || null, initial: true },
        })
      );
    }, 0);
  }
})();
