/* EduWeb — interactions client */
(function () {
  'use strict';

  const EUR_RATE = window.EDUWEB_EUR_RATE || 656;

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initFlash();
    initTabs();
    initModals();
    initAccordions();
    initNameFormat();
    initDropzone();
    initDisciplinePickers();
    initLearnerCascade();
    initEurConversion();
    initPaymentConversion();
    initMap();
    initCounters();
    initReveal();
    initZonePaysSync();
    initPhoneIndicatif();
    initGpsLocate();
    initRegenerate();
  });

  /* ── Synchronise le pays (caché) du formulaire Zone avec le sélecteur ── */
  function initZonePaysSync() {
    document.addEventListener('eduweb:country-changed', function (e) {
      const zid = e.detail.zoneId;
      if (!zid) return;
      const hidden = document.getElementById(zid + '-pays');
      if (hidden) hidden.value = e.detail.code;
    });
  }

  /* ── Indicatif téléphonique auto selon le pays sélectionné ── */
  function initPhoneIndicatif() {
    const phone = document.querySelector('[data-phone-indicatif]');
    if (!phone) return;
    const codes = window.EDUWEB_DIALCODES || {};
    document.addEventListener('eduweb:country-changed', function (e) {
      const dc = codes[e.detail.code];
      if (!dc) return;
      phone.placeholder = dc + ' …';
      // Remplace l'indicatif de tête (+xxx) par celui du pays, en gardant le numéro local
      const cur = (phone.value || '').trim();
      const local = cur.replace(/^\+\d{1,4}(?=\D|$)\s*/, '').trim();
      phone.value = local ? dc + ' ' + local : dc + ' ';
      phone.dataset.autocode = dc + ' ';
    });
  }

  /* ── Détermination de la position GPS (bouton) ── */
  function initGpsLocate() {
    const btn = document.getElementById('gpsLocateBtn');
    if (!btn) return;
    const lat = document.getElementById('gpsLat');
    const lng = document.getElementById('gpsLng');
    const hint = document.getElementById('gpsHint');
    const link = document.getElementById('gpsMapLink');
    btn.addEventListener('click', function () {
      if (!navigator.geolocation) { if (hint) hint.textContent = 'Géolocalisation non disponible sur cet appareil.'; return; }
      if (hint) hint.textContent = 'Localisation en cours…';
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          const la = pos.coords.latitude.toFixed(6), lo = pos.coords.longitude.toFixed(6);
          if (lat) lat.value = la;
          if (lng) lng.value = lo;
          if (hint) hint.textContent = 'Position détectée ✓ (' + la + ', ' + lo + ')';
          if (link) { link.href = 'https://www.google.com/maps?q=' + la + ',' + lo; link.hidden = false; }
        },
        function () { if (hint) hint.textContent = 'Localisation refusée. Saisissez les coordonnées manuellement.'; },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }

  /* ── Régénération des textes de présentation ── */
  function initRegenerate() {
    const sug = window.EDUWEB_SUGGESTIONS || {};
    document.querySelectorAll('[data-regen]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const key = btn.dataset.regen;
        const ta = document.getElementById(key + 'Text');
        if (ta && sug[key]) { ta.value = sug[key]; ta.focus(); }
      });
    });
  }

  /* ── Animations d'apparition au défilement (tout le site) ── */
  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const selector = '.panel, .kpi, .role-card, .feature, .step, .showcase-card, ' +
      '.profile-card, .stat, .coach-result, .ministat, .learner-card, .need-block, ' +
      '.cta-band__inner, .section__head, .review-col > *';
    const els = Array.from(document.querySelectorAll(selector))
      .filter((el) => !el.closest('.modal, .cp-modal'));
    if (!els.length) return;

    els.forEach((el) => el.classList.add('reveal'));

    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Léger décalage en cascade pour les éléments voisins
        const siblings = Array.from(el.parentElement ? el.parentElement.children : []);
        const idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(idx * 60, 300) + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ── Compteurs animés (statistiques accueil) ── */
  function initCounters() {
    const nums = document.querySelectorAll('.stat__num[data-count]');
    if (!nums.length) return;
    const animate = (el) => {
      const target = parseInt(el.dataset.count || '0', 10);
      const dur = 1100;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
      }, { threshold: 0.4 });
      nums.forEach((n) => io.observe(n));
    } else {
      nums.forEach(animate);
    }
  }

  /* ── Menu mobile ── */
  function initNavToggle() {
    const t = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');
    if (t && nav) t.addEventListener('click', () => nav.classList.toggle('open'));
  }

  /* ── Flash auto-dismiss ── */
  function initFlash() {
    const f = document.getElementById('flash');
    if (f) setTimeout(() => f.classList.add('flash--out'), 5000);
    // Nettoie l'URL des params mt/mm
    if (location.search.includes('mt=')) {
      const u = new URL(location.href);
      u.searchParams.delete('mt');
      u.searchParams.delete('mm');
      history.replaceState({}, '', u.pathname + (u.search ? u.search : '') + location.hash);
    }
  }

  /* ── Onglets ── */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
      const tabs = wrap.querySelectorAll('.tab');
      const panels = wrap.querySelectorAll('.tab-panel');
      function activate(name) {
        tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
        panels.forEach((p) => p.classList.toggle('active', p.id === name));
      }
      tabs.forEach((t) =>
        t.addEventListener('click', () => {
          activate(t.dataset.tab);
          history.replaceState({}, '', '#' + t.dataset.tab);
        })
      );
      // État initial : hash ou premier onglet
      const hash = location.hash.replace('#', '');
      const exists = Array.from(tabs).some((t) => t.dataset.tab === hash);
      activate(exists ? hash : tabs[0] && tabs[0].dataset.tab);

      // Boutons qui basculent vers un onglet (+ défilement optionnel)
      wrap.querySelectorAll('[data-goto-tab]').forEach((btn) => {
        btn.addEventListener('click', () => {
          activate(btn.dataset.gotoTab);
          history.replaceState({}, '', '#' + btn.dataset.gotoTab);
          const sel = btn.dataset.scrollTo;
          if (sel) {
            const target = document.querySelector(sel);
            if (target) {
              setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.classList.add('flash-target');
                setTimeout(() => target.classList.remove('flash-target'), 1600);
              }, 60);
            }
          }
        });
      });
    });
  }

  /* ── Modals ── */
  function initModals() {
    document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
      btn.addEventListener('click', () => openModal(btn.dataset.openModal));
    });
    document.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') document.querySelectorAll('.modal:not([hidden])').forEach(closeModal);
    });
  }
  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal(m) {
    if (!m) return;
    m.hidden = true;
    document.body.style.overflow = '';
  }

  /* ── Accordéons ── */
  function initAccordions() {
    document.addEventListener('click', function (e) {
      const head = e.target.closest('.acc__head, .disc-picker__toggle');
      if (!head) return;
      if (head.classList.contains('disc-picker__toggle')) {
        const box = head.parentElement.querySelector('.disc-picker__box');
        if (box) box.hidden = !box.hidden;
        return;
      }
      const acc = head.closest('.acc');
      if (!acc) return;
      const willOpen = !acc.classList.contains('open');
      // Exclusivité : ouvrir un accordéon replie ses voisins du même groupe
      if (willOpen && acc.parentElement) {
        acc.parentElement.querySelectorAll(':scope > .acc.open').forEach(function (o) {
          if (o !== acc) o.classList.remove('open');
        });
      }
      acc.classList.toggle('open');
    });
  }

  /* ── Formatage des noms (NOM majuscules, Prénom capitalize) ── */
  function initNameFormat() {
    document.querySelectorAll('[data-uppercase]').forEach(function (el) {
      el.addEventListener('input', () => {
        const s = el.selectionStart;
        el.value = el.value.toUpperCase();
        el.setSelectionRange(s, s);
      });
    });
    document.querySelectorAll('[data-capitalize]').forEach(function (el) {
      // Capitalisation en direct : première lettre de chaque mot en majuscule
      el.addEventListener('input', () => {
        const start = el.selectionStart, end = el.selectionEnd;
        el.value = el.value.replace(/(^|\s)(\p{L})/gu, (m, sp, ch) => sp + ch.toUpperCase());
        try { el.setSelectionRange(start, end); } catch (e) {}
      });
    });
  }

  /* ── Dropzone documents ── */
  function initDropzone() {
    document.querySelectorAll('[data-dropzone]').forEach(function (dz) {
      const input = dz.querySelector('input[type="file"]');
      const nameEl = dz.querySelector('[data-dropzone-name]');
      if (!input) return;
      dz.addEventListener('click', () => input.click());
      ['dragover', 'dragenter'].forEach((ev) =>
        dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('is-drag'); })
      );
      ['dragleave', 'drop'].forEach((ev) =>
        dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('is-drag'); })
      );
      dz.addEventListener('drop', (e) => {
        if (e.dataTransfer.files.length) {
          input.files = e.dataTransfer.files;
          if (nameEl) nameEl.textContent = input.files[0].name;
        }
      });
      input.addEventListener('change', () => {
        if (nameEl && input.files.length) nameEl.textContent = input.files[0].name;
      });
    });
  }

  /* ── Sélecteur de disciplines : filtrage par cycle de l'apprenant ── */
  function initDisciplinePickers() {
    document.querySelectorAll('[data-discipline-picker]').forEach(function (picker) {
      const cycle = picker.dataset.cycle;
      if (!cycle) return;
      picker.querySelectorAll('.acc').forEach(function (acc) {
        if (acc.dataset.cycle !== cycle) acc.style.display = 'none';
        else acc.classList.add('open');
      });
    });
  }

  /* ── Cascade Cycle → Niveau → Série (ajout apprenant) ── */
  function initLearnerCascade() {
    const cycleSel = document.getElementById('learnerCycle');
    const niveauSel = document.getElementById('learnerNiveau');
    const serieField = document.getElementById('serieField');
    const serieSel = document.getElementById('learnerSerie');
    if (!cycleSel || !niveauSel) return;
    const NIV = window.EDUWEB_NIVEAUX || [];

    cycleSel.addEventListener('change', function () {
      const list = NIV.filter((n) => n.cycle === cycleSel.value);
      niveauSel.innerHTML = '<option value="">— Choisir —</option>';
      list.forEach((n) => {
        const o = document.createElement('option');
        o.value = n.id; o.textContent = n.label;
        niveauSel.appendChild(o);
      });
      if (serieField) serieField.hidden = true;
    });

    niveauSel.addEventListener('change', function () {
      const niv = NIV.find((n) => n.id === niveauSel.value);
      if (niv && niv.series && niv.series.length) {
        serieSel.innerHTML = '<option value="">— Choisir —</option>';
        niv.series.forEach((s) => {
          const o = document.createElement('option');
          o.value = s; o.textContent = s;
          serieSel.appendChild(o);
        });
        serieField.hidden = false;
      } else if (serieField) {
        serieField.hidden = true;
      }
    });
  }

  /* ── Estimation mensuelle dynamique (tarif horaire coach) ── */
  function fmtFCFA(n) { return Number(n || 0).toLocaleString('fr-FR') + ' FCFA'; }
  function initEurConversion() {
    document.querySelectorAll('[data-tarif]').forEach(function (input) {
      const out = input.parentElement.querySelector('[data-estimate]');
      const eng = parseInt(input.dataset.engagement || '0', 10);
      if (!out || !eng) return;
      input.addEventListener('input', () => {
        const v = parseInt(input.value || '0', 10);
        const facture = v * eng;
        const part = Math.round(facture * 0.8);
        out.textContent = '≈ ' + fmtFCFA(facture) + '/mois (' + eng + 'h) · vous : ' + fmtFCFA(part);
      });
    });
  }

  /* ── Conversion paiement ── */
  function initPaymentConversion() {
    const brut = document.getElementById('payBrut');
    const out = document.getElementById('payConv');
    if (!brut || !out) return;
    function upd() {
      const v = parseInt(brut.value || '0', 10);
      out.textContent = '≈ ' + Math.round((v / EUR_RATE) * 10) / 10 + ' € (taux 1 € = ' + EUR_RATE + ' FCFA)';
    }
    brut.addEventListener('input', upd);
    upd();
  }

  /* ── Carte Leaflet (avatars coachs + géolocalisation + distances) ── */
  function initMap() {
    const el = document.getElementById('map');
    if (!el || typeof L === 'undefined') return;
    let markers = [];
    try { markers = JSON.parse(el.dataset.markers || '[]'); } catch (e) {}

    const map = L.map(el).setView([7.54, -5.55], 7); // Côte d'Ivoire
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Marqueur « avatar » façon Snapchat (photo ou initiale)
    function coachIcon(m) {
      const inner = m.photo
        ? '<img src="' + m.photo + '" alt="">'
        : '<span>' + (m.initial || '?') + '</span>';
      const certif = m.certifie ? ' avatar-pin--certif' : '';
      return L.divIcon({
        className: '',
        html: '<div class="avatar-pin' + certif + '">' + inner +
              (m.certifie ? '<i class="avatar-pin__badge">★</i>' : '') + '</div>',
        iconSize: [50, 58],
        iconAnchor: [25, 56],
        popupAnchor: [0, -52],
      });
    }

    const coachBounds = [];
    const coachLatLng = {};
    markers.forEach(function (m) {
      const mk = L.marker([m.lat, m.lng], { icon: coachIcon(m) }).addTo(map);
      mk.bindPopup(
        '<strong>' + m.name + '</strong><br>' + (m.commune || '') +
        (m.certifie ? '<br>✅ Certifié' : '') +
        (m.note ? '<br>⭐ ' + m.note.toFixed(1) : '') +
        (m.hourly ? '<br>💰 ' + fmtFCFA(m.hourly) + '/h' : '') +
        '<span class="popup-dist" data-popup-dist="' + m.id + '"></span>'
      );
      coachLatLng[m.id] = { lat: m.lat, lng: m.lng };
      coachBounds.push([m.lat, m.lng]);
    });
    if (coachBounds.length) map.fitBounds(coachBounds, { padding: [50, 50], maxZoom: 13 });

    // Distance haversine (km)
    function distKm(a, b, c, d) {
      const R = 6371, toR = (x) => (x * Math.PI) / 180;
      const dLat = toR(c - a), dLng = toR(d - b);
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a)) * Math.cos(toR(c)) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    }
    function fmtDist(km) { return km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1) + ' km'; }

    let userMarker = null;
    function placeUser(lat, lng) {
      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.marker([lat, lng], {
        icon: L.divIcon({ className: '', html: '<div class="user-pin"><div class="user-pin__dot"></div></div>', iconSize: [26, 26], iconAnchor: [13, 13] }),
        zIndexOffset: 1000,
      }).addTo(map).bindPopup('<strong>Vous êtes ici</strong>');

      // Distances → popups coachs + cartes de résultats
      let nearest = null;
      markers.forEach(function (m) {
        const km = distKm(lat, lng, m.lat, m.lng);
        const popupSpan = document.querySelector('[data-popup-dist="' + m.id + '"]');
        if (popupSpan) popupSpan.textContent = ' · 📍 ' + fmtDist(km);
        const card = document.querySelector('.coach-result[data-coach-id="' + m.id + '"]');
        if (card) {
          const dEl = card.querySelector('[data-distance]');
          if (dEl) { dEl.hidden = false; dEl.textContent = '· 📍 à ' + fmtDist(km); }
          card.dataset.km = km;
        }
        if (!nearest || km < nearest.km) nearest = { km: km, m: m };
      });

      // Tri des cartes par distance croissante
      const list = document.querySelector('.recherche-list');
      if (list) {
        const cards = Array.from(list.querySelectorAll('.coach-result[data-km]'));
        cards.sort((x, y) => parseFloat(x.dataset.km) - parseFloat(y.dataset.km))
             .forEach((card) => list.appendChild(card));
      }

      // Recentrer pour inclure l'utilisateur + les coachs
      const all = coachBounds.concat([[lat, lng]]);
      map.fitBounds(all, { padding: [50, 50], maxZoom: 14 });

      const hint = document.getElementById('locateHint');
      if (hint && nearest) hint.textContent = 'Coach le plus proche : ' + nearest.m.name + ' (' + fmtDist(nearest.km) + ').';
    }

    function locate() {
      const hint = document.getElementById('locateHint');
      if (!navigator.geolocation) { if (hint) hint.textContent = 'Géolocalisation non disponible sur cet appareil.'; return; }
      if (hint) hint.textContent = 'Localisation en cours…';
      navigator.geolocation.getCurrentPosition(
        (pos) => placeUser(pos.coords.latitude, pos.coords.longitude),
        (err) => { if (hint) hint.textContent = 'Localisation refusée. Activez-la pour voir les distances.'; },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    }

    const btn = document.getElementById('locateBtn');
    if (btn) btn.addEventListener('click', locate);
    // Tentative automatique au chargement (le navigateur demandera l'autorisation)
    locate();
  }
})();
