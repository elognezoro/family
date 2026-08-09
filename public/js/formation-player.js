// EduWeb Formation — déroulé d'un test psychotechnique
// Une question à la fois, difficulté croissante. Deux modes :
//  - entrainement : sans chrono, correction affichée après chaque réponse ;
//  - examen : chronométré (compte à rebours global), correction à la fin.
// Chaque réponse est enregistrée immédiatement côté serveur (reprise possible).

(function () {
  var T = window.FORMATION_TEST;
  if (!T) return;

  var $ = function (id) { return document.getElementById(id); };
  var memoBox = $('memoBox'), qBox = $('qBox'), endBox = $('endBox');
  var lettres = ['A', 'B', 'C', 'D'];

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

  // ─── Progression ───
  function majProgress() {
    $('pCount').textContent = 'Question ' + Math.min(idx + 1, T.questions.length) + ' / ' + T.questions.length;
    $('pFill').style.width = Math.round((idx / T.questions.length) * 100) + '%';
  }

  // ─── Affichage d'une question ───
  var repondu = false;
  var memoTimer = null; // référencé globalement pour être arrêté par terminer()

  function afficher() {
    if (idx >= T.questions.length) return terminer();
    var q = T.questions[idx];
    repondu = false;
    majProgress();

    // Phase de mémorisation éventuelle
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

  function montrerQuestion(q) {
    if (termine) return; // le temps a expiré pendant la mémorisation
    memoBox.hidden = true;
    qBox.hidden = false;
    $('qSousCat').textContent = (q.sousCategorie || '').replace(/-/g, ' ');
    $('qDiff').innerHTML = '●'.repeat(q.difficulte) + '<span>' + '●'.repeat(5 - q.difficulte) + '</span>';
    var txt = $('qText');
    txt.textContent = q.question;
    txt.classList.toggle('player__q-text--mono', !!q.mono);

    var opts = $('qOpts');
    opts.innerHTML = '';
    q.options.forEach(function (o, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt-btn' + (q.mono ? ' opt-btn--mono' : '');
      b.innerHTML = '<span class="opt-btn__lettre">' + lettres[i] + '</span><span class="opt-btn__txt"></span>';
      b.querySelector('.opt-btn__txt').textContent = o;
      b.onclick = function () { choisir(i); };
      opts.appendChild(b);
    });

    $('qFeedback').hidden = true;
    $('qNext').hidden = true;
    $('qSkip').hidden = false;

    // Lecture audio : la question puis les options
    $('qTts').onclick = function () {
      var texte = q.question + '. ' + q.options.map(function (o, i) { return 'Réponse ' + lettres[i] + ' : ' + o; }).join('. ');
      window.eduTTS && window.eduTTS.speak(texte, $('qTts'));
    };
  }

  // ─── Répondre ───
  // Un nouvel essai automatique en cas de coupure réseau, pour que la réponse
  // affichée localement soit bien enregistrée côté serveur.
  function envoyer(choix, dejaRetente) {
    return fetch('/formation/tests/' + T.id + '/reponse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ i: idx, choix: choix }),
    }).then(function (r) { return r.json().then(function (j) { j._status = r.status; return j; }); })
      .catch(function (e) {
        if (!dejaRetente) return new Promise(function (res) { setTimeout(res, 800); }).then(function () { return envoyer(choix, true); });
        throw e;
      });
  }

  function choisir(i) {
    if (repondu) return;
    repondu = true;
    T.reponses[idx] = i;
    var boutons = document.querySelectorAll('.opt-btn');
    boutons.forEach(function (b) { b.disabled = true; });
    boutons[i].classList.add('opt-btn--choisi');
    $('qSkip').hidden = true;

    envoyer(i).then(function (data) {
      if (data && data.fini) return terminer(); // le serveur a déclaré le temps écoulé
      if (T.mode === 'entrainement' && data && data.bonneReponse !== undefined) {
        // Correction immédiate
        boutons[data.bonneReponse].classList.add('opt-btn--bonne');
        if (i !== data.bonneReponse) boutons[i].classList.add('opt-btn--mauvaise');
        var fb = $('qFeedback');
        fb.hidden = false;
        fb.className = 'player__feedback ' + (data.correct ? 'player__feedback--ok' : 'player__feedback--ko');
        fb.innerHTML = (data.correct ? '✅ <strong>Bonne réponse !</strong> ' : '❌ <strong>Ce n’est pas ça.</strong> La bonne réponse était <strong>' + lettres[data.bonneReponse] + '</strong>. ')
          + '<span class="player__explication"></span>'
          + ' <button type="button" class="tts-btn tts-btn--inline" id="fbTts" aria-label="Écouter">🔊</button>';
        fb.querySelector('.player__explication').textContent = data.explication || '';
        var fbTts = document.getElementById('fbTts');
        fbTts.onclick = function () { window.eduTTS && window.eduTTS.speak(fb.innerText, fbTts); };
        $('qNext').hidden = false;
        $('qNext').focus();
      } else {
        // Examen : enchaîner directement
        suivante();
      }
    }).catch(function () { suivante(); });
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
