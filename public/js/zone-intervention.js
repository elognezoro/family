/* EduWeb — Cascade géographique (Zone d'intervention)
   Écoute l'événement eduweb:country-changed émis par country-picker.js */
(function () {
  'use strict';

  let ciTree = null; // cache de l'arbre Côte d'Ivoire

  document.addEventListener('eduweb:country-changed', function (e) {
    const { code, zoneId } = e.detail;
    const container = zoneId
      ? document.getElementById(zoneId)
      : document.querySelector('[data-zone-intervention]');
    if (!container) return;
    build(container, code);
  });

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function field(labelText, control) {
    const f = el('div', 'field');
    f.appendChild(el('label', null, labelText));
    f.appendChild(control);
    return f;
  }
  function select(name) {
    const s = document.createElement('select');
    s.name = name;
    return s;
  }
  function option(value, label, selected) {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = label;
    if (selected) o.selected = true;
    return o;
  }
  function fill(sel, items, placeholder, selectedVal) {
    sel.innerHTML = '';
    sel.appendChild(option('', placeholder));
    items.forEach((it) => sel.appendChild(option(it.id, it.label, it.id === selectedVal)));
  }

  async function build(container, code) {
    const preRegion = container.dataset.region || '';
    const preCommune = container.dataset.commune || '';
    container.innerHTML = '';

    if (code === 'ci') {
      return buildCI(container, preRegion, preCommune);
    }
    return buildOther(container, code, preRegion, preCommune);
  }

  /* ── Côte d'Ivoire : District → Région → Commune ── */
  async function buildCI(container, preRegion, preCommune) {
    if (!ciTree) {
      try { ciTree = await fetch('/api/ci/all').then((r) => r.json()); }
      catch (e) { ciTree = []; }
    }

    const districtSel = select('_district');
    const regionSel = select('region');
    const communeSel = select('commune');

    fill(districtSel, ciTree.map((d) => ({ id: d.id, label: d.label })), '— District —');

    // Pré-sélection : retrouver le district contenant la région
    let preDistrict = '';
    if (preRegion) {
      const d = ciTree.find((d) => d.regions.some((r) => r.id === preRegion));
      if (d) preDistrict = d.id;
    }

    function loadRegions(districtId, selR) {
      const d = ciTree.find((x) => x.id === districtId);
      fill(regionSel, d ? d.regions.map((r) => ({ id: r.id, label: r.label })) : [], '— Région —', selR);
      loadCommunes(districtId, selR, preCommune);
    }
    function loadCommunes(districtId, regionId, selC) {
      const d = ciTree.find((x) => x.id === districtId);
      const r = d && d.regions.find((x) => x.id === regionId);
      const communes = r ? r.communes.map((c) => ({ id: c, label: c })) : [];
      fill(communeSel, communes, '— Commune —', selC);
    }

    districtSel.addEventListener('change', () => loadRegions(districtSel.value, ''));
    regionSel.addEventListener('change', () => loadCommunes(districtSel.value, regionSel.value, ''));

    container.appendChild(field('District', districtSel));
    container.appendChild(field('Région', regionSel));
    container.appendChild(field('Commune', communeSel));

    if (preDistrict) {
      districtSel.value = preDistrict;
      loadRegions(preDistrict, preRegion);
    }
  }

  /* ── Autres pays : Région/État → Ville (ISO 3166-2) ── */
  async function buildOther(container, code, preRegion, preCommune) {
    let meta = { regionLabel: 'Région', hasStates: false };
    try { meta = await fetch('/api/geo/' + code + '/meta').then((r) => r.json()); }
    catch (e) {}

    if (!meta.hasStates) {
      // Saisie libre
      const r = document.createElement('input'); r.type = 'text'; r.name = 'region'; r.value = preRegion; r.placeholder = meta.regionLabel;
      const c = document.createElement('input'); c.type = 'text'; c.name = 'commune'; c.value = preCommune; c.placeholder = 'Ville / Commune';
      container.appendChild(field(meta.regionLabel, r));
      container.appendChild(field('Ville / Commune', c));
      return;
    }

    const regionSel = select('region');
    const citySel = select('commune');
    container.appendChild(field(meta.regionLabel, regionSel));
    container.appendChild(field('Ville', citySel));

    let states = { items: [] };
    try { states = await fetch('/api/geo/' + code + '/states').then((r) => r.json()); }
    catch (e) {}
    fill(regionSel, states.items || [], '— ' + meta.regionLabel + ' —', preRegion);

    async function loadCities(stateId, selC) {
      let cities = [];
      if (stateId) {
        try { cities = await fetch('/api/geo/' + code + '/cities/' + stateId).then((r) => r.json()); }
        catch (e) {}
      }
      fill(citySel, cities, '— Ville —', selC);
    }
    regionSel.addEventListener('change', () => loadCities(regionSel.value, ''));
    if (preRegion) loadCities(preRegion, preCommune);
  }
})();
