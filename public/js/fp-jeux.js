// Jeux d'apprentissage « Fonction Publique » (§9) — moteur client.
// Formatif : la correction s'affiche immédiatement ; la partie envoie à la fin
// le score + les articles joués (maîtrise) et reçoit XP / badges / série.
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var liste = $('jeuxListe'), zone = $('jeuZone'), fin = $('jeuFin');
  if (!liste) return;
  var corps = $('jeuCorps'), fb = $('jeuFeedback');
  var jeuActuel = null, donnees = null, score = 0, index = 0, vies = 0, chronoT = null;
  var articlesJoues = []; // {article, correct}
  var lettres = ['A', 'B', 'C', 'D', 'E', 'F'];

  function montrer(el) { [liste, zone, fin].forEach(function (x) { x.hidden = x !== el; }); }
  function setScore(pts) { score = pts; $('jeuScore').textContent = pts + ' pt' + (pts > 1 ? 's' : ''); }
  function avance(t) { $('jeuAvance').textContent = t; }
  function feedback(ok, texte, ref) {
    fb.hidden = false;
    fb.className = 'player__feedback ' + (ok ? 'player__feedback--ok' : 'player__feedback--ko');
    fb.innerHTML = (ok ? '✅ ' : '❌ ') + '<span class="fbTxt"></span>' + (ref ? ' <span class="badge badge--soft">📖 ' + ref + '</span>' : '');
    fb.querySelector('.fbTxt').textContent = texte || '';
  }
  function boutonSuivant(cb) { var b = $('jeuSuivant'); b.hidden = false; b.onclick = function () { b.hidden = true; fb.hidden = true; cb(); }; }

  // ─── Lancement ───
  liste.addEventListener('click', function (e) {
    var card = e.target.closest('[data-jeu]');
    if (!card) return;
    lancer(card.getAttribute('data-jeu'), card.querySelector('h3').textContent);
  });
  $('jeuQuitter').onclick = function () { arreterChrono(); montrer(liste); };
  $('finAutres').onclick = function () { montrer(liste); };
  $('finRejouer').onclick = function () { if (jeuActuel) lancer(jeuActuel.id, jeuActuel.titre); };

  function lancer(id, titre) {
    fetch('/formation/fonction-publique/jeux/' + id + '/data', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        jeuActuel = { id: id, titre: titre };
        donnees = data; score = 0; index = 0; articlesJoues = [];
        $('jeuTitre').textContent = titre;
        setScore(0); fb.hidden = true; $('jeuSuivant').hidden = true;
        $('jeuVies').hidden = true; $('jeuChrono').hidden = true;
        montrer(zone);
        if (id === 'quisuisje') etapeQuiSuisJe();
        else if (id === 'chrono') etapeQcm(donnees.items, 'chrono');
        else if (id === 'millionnaire') { vies = 0; etapeMillionnaire(); }
        else if (id === 'boss') { vies = data.vies || 3; majVies(); etapeQcm(donnees.items, 'boss'); }
        else etapeClasser(); // categories / adds / conseil / echelle
      })
      .catch(function () { alert('Jeu indisponible pour le moment.'); });
  }

  function majVies() { $('jeuVies').hidden = false; $('jeuVies').textContent = '❤️'.repeat(Math.max(0, vies)); }
  function arreterChrono() { if (chronoT) { clearInterval(chronoT); chronoT = null; } }

  // ─── Qui suis-je ? (règle → article) ───
  function etapeQuiSuisJe() {
    var it = donnees.items[index];
    if (!it) return finir();
    avance((index + 1) + ' / ' + donnees.items.length);
    corps.innerHTML = '<p class="player__q-text">« <span id="qsjRegle"></span> »</p>'
      + '<p class="muted">À quel article rattachez-vous cette règle ? <button type="button" class="tts-btn tts-btn--inline" data-tts-target="#qsjRegle">🔊</button></p>'
      + '<div class="player__opts" id="qsjOpts"></div>';
    document.getElementById('qsjRegle').textContent = it.regle;
    var opts = document.getElementById('qsjOpts');
    it.options.forEach(function (art, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'opt-btn';
      b.innerHTML = '<span class="opt-btn__lettre">' + lettres[i] + '</span><span class="opt-btn__txt">Article ' + art + '</span>';
      b.onclick = function () {
        var ok = i === it.bonne;
        [...opts.children].forEach(function (x, xi) { x.disabled = true; if (xi === it.bonne) x.classList.add('opt-btn--bonne'); });
        if (!ok) b.classList.add('opt-btn--mauvaise'); else setScore(score + 1);
        articlesJoues.push({ article: it.article, correct: ok });
        feedback(ok, ok ? 'Bien vu !' : 'C’était l’article ' + it.options[it.bonne] + '.', it.ref);
        boutonSuivant(function () { index++; etapeQuiSuisJe(); });
      };
      opts.appendChild(b);
    });
  }

  // ─── Jeux de classement en colonnes (catégories / ADDS / conseil / échelle) ───
  function etapeClasser() {
    var it = donnees.items[index];
    if (!it) return finir();
    avance((index + 1) + ' / ' + donnees.items.length);
    if (jeuActuel.id === 'adds' && index === 0 && donnees.chronoSec) demarrerChronoGlobal(donnees.chronoSec);
    corps.innerHTML = '<p class="player__q-text" id="clTexte"></p><div class="player__opts" id="clOpts"></div>';
    document.getElementById('clTexte').textContent = it.texte || it.question;
    var opts = document.getElementById('clOpts');
    donnees.colonnes.forEach(function (col, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'opt-btn';
      b.innerHTML = '<span class="opt-btn__lettre">' + lettres[i] + '</span><span class="opt-btn__txt">' + col + '</span>';
      b.onclick = function () {
        var ok = i === it.bonne;
        [...opts.children].forEach(function (x, xi) { x.disabled = true; if (xi === it.bonne) x.classList.add('opt-btn--bonne'); });
        if (!ok) b.classList.add('opt-btn--mauvaise'); else setScore(score + 1);
        var art = parseInt((it.ref || '').replace(/\D+/g, ''), 10);
        if (art) articlesJoues.push({ article: art, correct: ok });
        feedback(ok, ok ? 'Exact.' : 'La bonne colonne : ' + donnees.colonnes[it.bonne] + '.', it.ref);
        boutonSuivant(function () { index++; etapeClasser(); });
      };
      opts.appendChild(b);
    });
  }

  function demarrerChronoGlobal(sec) {
    var el = $('jeuChrono'); el.hidden = false;
    var restant = sec;
    el.textContent = '⏱ ' + restant + ' s';
    chronoT = setInterval(function () {
      restant--; el.textContent = '⏱ ' + restant + ' s';
      if (restant <= 0) { arreterChrono(); feedback(false, 'Temps écoulé !'); finir(); }
    }, 1000);
  }

  // ─── QCM séquentiel (Chrono des durées / Boss final) ───
  function etapeQcm(items, modeJeu) {
    var it = items[index];
    if (!it || (modeJeu === 'boss' && vies <= 0)) return finir();
    avance((index + 1) + ' / ' + items.length);
    corps.innerHTML = '<p class="player__q-text" id="qcTexte"></p><div class="player__opts" id="qcOpts"></div>';
    document.getElementById('qcTexte').textContent = it.question;
    var opts = document.getElementById('qcOpts');
    it.options.forEach(function (o, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'opt-btn';
      b.innerHTML = '<span class="opt-btn__lettre">' + lettres[i] + '</span><span class="opt-btn__txt"></span>';
      b.querySelector('.opt-btn__txt').textContent = o;
      b.onclick = function () {
        var ok = i === it.bonne;
        [...opts.children].forEach(function (x, xi) { x.disabled = true; if (xi === it.bonne) x.classList.add('opt-btn--bonne'); });
        if (!ok) { b.classList.add('opt-btn--mauvaise'); if (modeJeu === 'boss') { vies--; majVies(); } }
        else setScore(score + 1);
        if (it.article) articlesJoues.push({ article: it.article, correct: ok });
        feedback(ok, ok ? 'Exact.' : (it.explication || 'À revoir.'), it.ref);
        boutonSuivant(function () { index++; etapeQcm(items, modeJeu); });
      };
      opts.appendChild(b);
    });
  }

  // ─── Millionnaire (15 paliers, 3 jokers, arrêt à la 1re erreur) ───
  var jokers = null;
  function etapeMillionnaire() {
    if (index === 0) jokers = { cinquante: true, article: true, echange: true };
    var it = donnees.items[index];
    if (!it || index >= 15) return finir({ millionnaire: index >= 15 });
    avance('Palier ' + (index + 1) + ' / 15 · difficulté ' + it.difficulte);
    corps.innerHTML = '<div class="fp-jokers">'
      + '<button type="button" class="btn btn--ghost btn--sm" id="jk50"' + (jokers.cinquante ? '' : ' disabled') + '>50 : 50</button>'
      + '<button type="button" class="btn btn--ghost btn--sm" id="jkArt"' + (jokers.article ? '' : ' disabled') + '>📖 Voir l’article</button>'
      + '<button type="button" class="btn btn--ghost btn--sm" id="jkEch"' + (jokers.echange ? '' : ' disabled') + '>🔄 Changer de question</button>'
      + '</div>'
      + '<p class="player__q-text" id="miTexte"></p><div class="player__opts" id="miOpts"></div>';
    document.getElementById('miTexte').textContent = it.question;
    var opts = document.getElementById('miOpts');
    it.options.forEach(function (o, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'opt-btn'; b.setAttribute('data-i', i);
      b.innerHTML = '<span class="opt-btn__lettre">' + lettres[i] + '</span><span class="opt-btn__txt"></span>';
      b.querySelector('.opt-btn__txt').textContent = o;
      b.onclick = function () {
        var ok = i === it.bonne;
        [...opts.children].forEach(function (x) { x.disabled = true; if (Number(x.getAttribute('data-i')) === it.bonne) x.classList.add('opt-btn--bonne'); });
        articlesJoues.push({ article: it.article, correct: ok });
        if (ok) {
          setScore(score + 1);
          feedback(true, 'Palier ' + (index + 1) + ' atteint !', it.ref);
          boutonSuivant(function () { index++; etapeMillionnaire(); });
        } else {
          b.classList.add('opt-btn--mauvaise');
          feedback(false, 'Mauvaise réponse — la partie s’arrête au palier ' + score + '. ' + (it.explication || ''), it.ref);
          boutonSuivant(function () { finir(); });
        }
      };
      opts.appendChild(b);
    });
    document.getElementById('jk50').onclick = function () {
      if (!jokers.cinquante) return; jokers.cinquante = false; this.disabled = true;
      var faux = [...opts.children].filter(function (x) { return Number(x.getAttribute('data-i')) !== it.bonne && !x.disabled; });
      faux.slice(0, 2).forEach(function (x) { x.disabled = true; x.style.opacity = 0.35; });
    };
    document.getElementById('jkArt').onclick = function () {
      if (!jokers.article) return; jokers.article = false; this.disabled = true;
      feedback(true, 'Indice : la réponse se trouve dans ' + (it.ref || 'le statut') + '.', it.ref);
    };
    document.getElementById('jkEch').onclick = function () {
      if (!jokers.echange) return; jokers.echange = false; this.disabled = true;
      var rechange = donnees.items[15 + (3 - (jokers.cinquante ? 0 : 0) - 0)] || donnees.items[donnees.items.length - 1];
      // remplacer la question courante par une question de réserve (indices 15-17)
      var reserve = donnees.items.slice(15).find(function (q) { return !q._utilisee; });
      if (reserve) { reserve._utilisee = true; donnees.items[index] = reserve; etapeMillionnaire(); }
    };
  }

  // ─── Fin de partie ───
  function finir(drapeauxSup) {
    arreterChrono();
    var total = jeuActuel.id === 'millionnaire' ? 15 : (donnees.items ? Math.min(donnees.items.length, jeuActuel.id === 'boss' ? 20 : donnees.items.length) : 1);
    var drapeaux = drapeauxSup || {};
    if (jeuActuel.id === 'boss' && vies > 0 && index >= total) drapeaux.boss = true;
    montrer(fin);
    $('finTitre').textContent = jeuActuel.titre + ' — ' + score + ' / ' + total;
    $('finDetail').textContent = 'Calcul de vos gains…';
    $('finBadges').innerHTML = '';
    fetch('/formation/fonction-publique/jeux/resultat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ jeu: jeuActuel.id, score: score, total: total, articles: articlesJoues, drapeaux: drapeaux }),
    }).then(function (r) { return r.json(); }).then(function (g) {
      if (g && g.ok) {
        $('finDetail').innerHTML = '⭐ <strong>+' + g.xpGagne + ' XP</strong> (total : ' + g.xpTotal + ' — niveau ' + g.niveau.label + ')'
          + (g.serie > 1 ? ' · 🔥 série de ' + g.serie + ' jours' : '')
          + (g.plafondAtteint ? '<br><span class="muted">Plafond d’XP quotidien atteint — revenez demain pour engranger davantage !</span>' : '');
        if (g.nouveauxBadges && g.nouveauxBadges.length) {
          $('finBadges').innerHTML = '<p><strong>🏅 Nouveau badge :</strong> '
            + g.nouveauxBadges.map(function (b) { return b.emoji + ' ' + b.label; }).join(' · ') + '</p>';
        }
      } else {
        $('finDetail').textContent = (g && g.message) || 'Partie terminée !';
      }
    }).catch(function () { $('finDetail').textContent = 'Partie terminée !'; });
  }
})();
