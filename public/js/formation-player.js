// EduWeb Préparation aux concours — déroulé d'un test
// Types de questions : choix unique (QCM, vrai/faux, texte à trous, cas
// pratique), QCM MULTI-RÉPONSES, ASSOCIATION (appariements), CLASSEMENT.
// Deux modes : entraînement (correction expliquée après chaque question) et
// examen/simulation (chronomètre serveur, correction à la fin).
// Chaque réponse est enregistrée immédiatement côté serveur (reprise possible).

(function () {
  var T = window.FORMATION_TEST;
  if (!T) return;

  var $ = function (id) { return document.getElementById(id); };
  var memoBox = $('memoBox'), qBox = $('qBox'), endBox = $('endBox');
  var lettres = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Reprendre à la première question sans réponse
  var idx = 0;
  while (idx < T.questions.length && T.reponses[idx] !== undefined) idx++;

  // ─── Chronomètre ───
  var timerEl = $('pTimerVal');
  var restant = T.mode === 'examen' && T.tempsMaxSec
    ? Math.max(0, T.tempsMaxSec - (T.tempsEcouleSec || 0))
    : null;
  var ecoule = T.tempsEcouleSec || 0;

  function fmt(s) {
    var m = Math.floor(s / 60), ss = s % 60;
    return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
  }
  function tick() {
    if (restant !== null) {
      restant--;
      timerEl.textContent = fmt(Math.max(0, restant));
      if (restant <= 60) $('pTimer').classList.add('player__timer--urgent');
      if (restant <= 0) { clearInterval(timer); terminer(); return; }
    } else {
      ecoule++;
      timerEl.textContent = fmt(ecoule);
    }
  }
  timerEl.textContent = restant !== null ? fmt(restant) : fmt(ecoule);
  var timer = setInterval(tick, 1000);

  function majProgress() {
    $('pCount').textContent = 'Question ' + Math.min(idx + 1, T.questions.length) + ' / ' + T.questions.length;
    $('pFill').style.width = Math.round((idx / T.questions.length) * 100) + '%';
  }

  // ─── Envoi (un nouvel essai automatique en cas de coupure réseau) ───
  function envoyer(reponse, dejaRetente) {
    return fetch('/formation/tests/' + T.id + '/reponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ i: idx, reponse: reponse }),
    }).then(function (r) { return r.json().then(function (j) { j._status = r.status; return j; }); })
      .catch(function (e) {
        if (!dejaRetente) return new Promise(function (res) { setTimeout(res, 800); }).then(function () { return envoyer(reponse, true); });
        throw e;
      });
  }

  // ─── Affichage ───
  var repondu = false;
  var memoTimer = null;

  function afficher() {
    if (idx >= T.questions.length) return terminer();
    var q = T.questions[idx];
    repondu = false;
    majProgress();

    if (q.memo) {
      qBox.hidden = true;
      memoBox.hidden = false;
      $('memoContent').textContent = q.memo;
      var s = q.memoSec || 30;
      $('memoCount').textContent = s;
      memoTimer = setInterval(function () {
        s--;
        $('memoCount').textContent = s;
        if (s <= 0) { clearInterval(memoTimer); montrerQuestion(q); }
      }, 1000);
      $('memoReady').onclick = function () { clearInterval(memoTimer); montrerQuestion(q); };
      return;
    }
    montrerQuestion(q);
  }

  function chip(texte) {
    var s = document.createElement('span');
    s.className = 'badge badge--soft';
    s.textContent = texte;
    return s;
  }

  function montrerQuestion(q) {
    if (termine) return;
    memoBox.hidden = true;
    qBox.hidden = false;
    $('qSousCat').textContent = (q.sousCategorie || q.type || '').replace(/-/g, ' ').replace('_', ' / ');
    $('qDiff').innerHTML = '●'.repeat(q.difficulte) + '<span>' + '●'.repeat(5 - q.difficulte) + '</span>';
    var txt = $('qText');
    txt.textContent = q.question;
    txt.classList.toggle('player__q-text--mono', !!q.mono);

    var opts = $('qOpts');
    opts.innerHTML = '';
    $('qFeedback').hidden = true;
    $('qNext').hidden = true;
    $('qSkip').hidden = false;
    $('qValider').hidden = true;

    var type = q.type || 'qcm';
    if (q.gauche) type = 'association';
    else if (q.items) type = 'classement';

    if (type === 'multi') construireMulti(q, opts);
    else if (type === 'association') construireAssociation(q, opts);
    else if (type === 'classement') construireClassement(q, opts);
    else construireSimple(q, opts);

    // Lecture audio adaptée au type
    $('qTts').onclick = function () {
      var texte = q.question + '. ';
      if (q.options) texte += q.options.map(function (o, i) { return 'Réponse ' + lettres[i] + ' : ' + o; }).join('. ');
      if (q.gauche) texte += 'Éléments à associer : ' + q.gauche.join(', ') + '. Avec : ' + q.droite.join(', ');
      if (q.items) texte += 'Éléments à classer : ' + q.items.join(', ');
      window.eduTTS && window.eduTTS.speak(texte, $('qTts'));
    };
  }

  // ── Choix unique (QCM, vrai/faux, trous, cas) ──
  function construireSimple(q, opts) {
    q.options.forEach(function (o, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt-btn' + (q.mono ? ' opt-btn--mono' : '');
      b.innerHTML = '<span class="opt-btn__lettre">' + lettres[i] + '</span><span class="opt-btn__txt"></span>';
      b.querySelector('.opt-btn__txt').textContent = o;
      b.onclick = function () { repondreSimple(q, i); };
      opts.appendChild(b);
    });
  }
  function repondreSimple(q, i) {
    if (repondu) return;
    repondu = true;
    T.reponses[idx] = i;
    var boutons = document.querySelectorAll('#qOpts .opt-btn');
    boutons.forEach(function (b) { b.disabled = true; });
    boutons[i].classList.add('opt-btn--choisi');
    $('qSkip').hidden = true;
    envoyer(i).then(function (data) {
      if (data && data.fini) return terminer();
      if (T.mode === 'entrainement' && data && data.correction) {
        var bonne = data.correction.bonneReponse;
        boutons[bonne].classList.add('opt-btn--bonne');
        if (i !== bonne) boutons[i].classList.add('opt-btn--mauvaise');
        feedback(data, 'La bonne réponse était <strong>' + lettres[bonne] + '</strong>. ');
      } else { suivante(); }
    }).catch(function () { suivante(); });
  }

  // ── QCM multi-réponses ──
  function construireMulti(q, opts) {
    var note = document.createElement('p');
    note.className = 'muted player__aide';
    note.textContent = 'Plusieurs bonnes réponses : cochez TOUTES les bonnes, puis validez.';
    opts.appendChild(note);
    q.options.forEach(function (o, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt-btn opt-btn--coche';
      b.setAttribute('data-i', i);
      b.innerHTML = '<span class="opt-btn__lettre">' + lettres[i] + '</span><span class="opt-btn__txt"></span><span class="opt-btn__case">☐</span>';
      b.querySelector('.opt-btn__txt').textContent = o;
      b.onclick = function () {
        if (repondu) return;
        b.classList.toggle('opt-btn--choisi');
        b.querySelector('.opt-btn__case').textContent = b.classList.contains('opt-btn--choisi') ? '☑' : '☐';
        $('qValider').hidden = !document.querySelector('#qOpts .opt-btn--choisi');
      };
      opts.appendChild(b);
    });
    $('qValider').onclick = function () {
      if (repondu) return;
      var sel = [...document.querySelectorAll('#qOpts .opt-btn--choisi')].map(function (b) { return Number(b.getAttribute('data-i')); });
      if (!sel.length) return;
      repondu = true;
      T.reponses[idx] = sel;
      $('qValider').hidden = true;
      $('qSkip').hidden = true;
      var boutons = document.querySelectorAll('#qOpts .opt-btn');
      boutons.forEach(function (b) { b.disabled = true; });
      envoyer(sel).then(function (data) {
        if (data && data.fini) return terminer();
        if (T.mode === 'entrainement' && data && data.correction) {
          var bonnes = data.correction.bonnesReponses;
          boutons.forEach(function (b) {
            var i = Number(b.getAttribute('data-i'));
            if (isNaN(i)) return;
            if (bonnes.indexOf(i) !== -1) b.classList.add('opt-btn--bonne');
            else if (b.classList.contains('opt-btn--choisi')) b.classList.add('opt-btn--mauvaise');
          });
          feedback(data, 'Les bonnes réponses étaient : <strong>' + bonnes.map(function (i) { return lettres[i]; }).join(', ') + '</strong>. ');
        } else { suivante(); }
      }).catch(function () { suivante(); });
    };
  }

  // ── Association (appariement gauche → droite) ──
  function construireAssociation(q, opts) {
    var note = document.createElement('p');
    note.className = 'muted player__aide';
    note.textContent = 'Associez chaque élément de gauche à la bonne proposition, puis validez.';
    opts.appendChild(note);
    q.gauche.forEach(function (g, i) {
      var ligne = document.createElement('div');
      ligne.className = 'assoc-ligne';
      var lbl = document.createElement('div');
      lbl.className = 'assoc-ligne__gauche';
      lbl.textContent = g;
      var sel = document.createElement('select');
      sel.className = 'assoc-ligne__select';
      sel.setAttribute('data-g', i);
      var d0 = document.createElement('option');
      d0.value = ''; d0.textContent = '— Choisir —';
      sel.appendChild(d0);
      q.droite.forEach(function (d, j) {
        var o = document.createElement('option');
        o.value = j; o.textContent = d;
        sel.appendChild(o);
      });
      sel.onchange = function () {
        var tous = [...document.querySelectorAll('#qOpts select')].every(function (s) { return s.value !== ''; });
        $('qValider').hidden = !tous;
      };
      ligne.appendChild(lbl);
      ligne.appendChild(sel);
      opts.appendChild(ligne);
    });
    $('qValider').onclick = function () {
      if (repondu) return;
      var sels = [...document.querySelectorAll('#qOpts select')];
      if (sels.some(function (s) { return s.value === ''; })) return;
      var rep = sels.map(function (s) { return Number(s.value); });
      repondu = true;
      T.reponses[idx] = rep;
      $('qValider').hidden = true;
      $('qSkip').hidden = true;
      sels.forEach(function (s) { s.disabled = true; });
      envoyer(rep).then(function (data) {
        if (data && data.fini) return terminer();
        if (T.mode === 'entrainement' && data && data.correction) {
          var app = data.correction.appariement;
          var lignes = document.querySelectorAll('#qOpts .assoc-ligne');
          var detail = '';
          lignes.forEach(function (l, i) {
            var ok = rep[i] === app[i];
            l.classList.add(ok ? 'assoc-ligne--ok' : 'assoc-ligne--ko');
            if (!ok) detail += '« ' + q.gauche[i] + ' » → « ' + q.droite[app[i]] + ' » ; ';
          });
          feedback(data, detail ? 'Corrections : ' + detail : '');
        } else { suivante(); }
      }).catch(function () { suivante(); });
    };
  }

  // ── Classement (remettre dans le bon ordre) ──
  function construireClassement(q, opts) {
    var note = document.createElement('p');
    note.className = 'muted player__aide';
    note.textContent = 'Remettez les éléments dans le bon ordre avec les flèches, puis validez.';
    opts.appendChild(note);
    var liste = document.createElement('div');
    liste.className = 'class-liste';
    q.items.forEach(function (it, i) {
      var ligne = document.createElement('div');
      ligne.className = 'class-item';
      ligne.setAttribute('data-i', i);
      ligne.innerHTML = '<span class="class-item__pos"></span><span class="class-item__txt"></span>'
        + '<span class="class-item__fleches"><button type="button" class="class-fl" data-dir="-1">▲</button><button type="button" class="class-fl" data-dir="1">▼</button></span>';
      ligne.querySelector('.class-item__txt').textContent = it;
      liste.appendChild(ligne);
    });
    opts.appendChild(liste);
    function renum() {
      [...liste.children].forEach(function (l, p) { l.querySelector('.class-item__pos').textContent = (p + 1) + '.'; });
    }
    renum();
    liste.addEventListener('click', function (e) {
      if (repondu) return;
      var btn = e.target.closest('.class-fl');
      if (!btn) return;
      var ligne = btn.closest('.class-item');
      var dir = Number(btn.getAttribute('data-dir'));
      if (dir === -1 && ligne.previousElementSibling) liste.insertBefore(ligne, ligne.previousElementSibling);
      else if (dir === 1 && ligne.nextElementSibling) liste.insertBefore(ligne.nextElementSibling, ligne);
      renum();
      $('qValider').hidden = false;
    });
    $('qValider').hidden = false; // l'ordre initial est déjà une proposition
    $('qValider').onclick = function () {
      if (repondu) return;
      var rep = [...liste.children].map(function (l) { return Number(l.getAttribute('data-i')); });
      repondu = true;
      T.reponses[idx] = rep;
      $('qValider').hidden = true;
      $('qSkip').hidden = true;
      envoyer(rep).then(function (data) {
        if (data && data.fini) return terminer();
        if (T.mode === 'entrainement' && data && data.correction) {
          var ordre = data.correction.ordre;
          var ok = rep.length === ordre.length && rep.every(function (v, i) { return v === ordre[i]; });
          [...liste.children].forEach(function (l) { l.classList.add(ok ? 'assoc-ligne--ok' : 'assoc-ligne--ko'); });
          var bonOrdre = ordre.map(function (i, p) { return (p + 1) + '. ' + q.items[i]; }).join(' ; ');
          feedback(data, ok ? '' : 'Le bon ordre : ' + bonOrdre + '. ');
        } else { suivante(); }
      }).catch(function () { suivante(); });
    };
  }

  // ── Feedback commun (entraînement) ──
  function feedback(data, complement) {
    var fb = $('qFeedback');
    fb.hidden = false;
    fb.className = 'player__feedback ' + (data.correct ? 'player__feedback--ok' : 'player__feedback--ko');
    fb.innerHTML = (data.correct ? '✅ <strong>Bonne réponse !</strong> ' : '❌ <strong>Ce n’est pas ça.</strong> ' + (complement || ''))
      + '<span class="player__explication"></span>'
      + (data.reference ? ' <span class="badge badge--soft">📖 ' + data.reference + '</span>' : '')
      + ' <button type="button" class="tts-btn tts-btn--inline" id="fbTts" aria-label="Écouter">🔊</button>';
    fb.querySelector('.player__explication').textContent = data.explication || '';
    var fbTts = document.getElementById('fbTts');
    fbTts.onclick = function () { window.eduTTS && window.eduTTS.speak(fb.innerText, fbTts); };
    $('qNext').hidden = false;
    $('qNext').focus();
  }

  function suivante() {
    window.eduTTS && window.eduTTS.stop();
    idx++;
    afficher();
  }

  $('qNext').onclick = suivante;
  $('qSkip').onclick = function () {
    if (repondu) return;
    repondu = true;
    T.reponses[idx] = null;
    envoyer(null).then(suivante, suivante);
  };

  // ─── Fin du test ───
  var termine = false;
  function terminer() {
    if (termine) return;
    termine = true;
    clearInterval(timer);
    if (memoTimer) clearInterval(memoTimer);
    window.eduTTS && window.eduTTS.stop();
    memoBox.hidden = true;
    qBox.hidden = true;
    endBox.hidden = false;
    fetch('/formation/tests/' + T.id + '/terminer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    })
      .then(function (r) { return r.json(); })
      .then(function (data) { window.location.href = data.url || '/formation/historique'; })
      .catch(function () { window.location.href = '/formation/historique'; });
  }

  afficher();
})();
