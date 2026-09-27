/* Quiz des chants pédagogiques — une question à la fois, rétroaction immédiate
   avec correction commentée, note sur N, écran final « Je maîtrise / À revoir »
   et bouton « Réécouter la chanson ». */
(function () {
  var DATA = window.CHANT_QUIZ;
  if (!DATA || !DATA.questions) return;
  var total = DATA.questions.length;
  var blocs = document.querySelectorAll('.quiz-q');
  var resultats = {}; // i -> true/false (après vérification)
  var sequences = {}; // i -> ordre cliqué (questions de classement)
  var position = 0; // position dans le parcours mélangé

  // L'ordre des questions est MÉLANGÉ à chaque tentative (chargement ou
  // « Recommencer ») : il change d'un utilisateur et d'un essai à l'autre.
  function melanger() {
    var ordre = [];
    for (var k = 0; k < total; k++) ordre.push(k);
    for (var a = ordre.length - 1; a > 0; a--) {
      var b = Math.floor(Math.random() * (a + 1));
      var tmp = ordre[a]; ordre[a] = ordre[b]; ordre[b] = tmp;
    }
    return ordre;
  }
  var ordre = melanger();

  // Les PROPOSITIONS aussi sont mélangées à chaque tentative (QCU, QCM et
  // étiquettes de classement — Vrai/Faux garde son ordre conventionnel).
  // Les inputs conservent leur valeur d'origine : la correction par valeur
  // reste exacte ; seules les lettres affichées sont recalculées.
  function melangerPropositions() {
    Array.prototype.forEach.call(blocs, function (bloc) {
      var i = parseInt(bloc.getAttribute('data-i'), 10);
      var type = DATA.questions[i].type;
      var conteneur = null;
      if (type === 'qcu' || type === 'qcm') conteneur = bloc.querySelector('.fniv-radio');
      else if (type === 'classement') conteneur = bloc.querySelector('.classement__items');
      if (!conteneur) return;
      var enfants = Array.prototype.slice.call(conteneur.children);
      for (var a = enfants.length - 1; a > 0; a--) {
        var b = Math.floor(Math.random() * (a + 1));
        var t = enfants[a]; enfants[a] = enfants[b]; enfants[b] = t;
      }
      enfants.forEach(function (el) { conteneur.appendChild(el); });
    });
  }
  melangerPropositions();

  // Normalisation des réponses courtes : minuscules, sans accents ni ponctuation
  function normaliser(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function corriger(q, bloc, i) {
    if (q.type === 'qcu') {
      var choisi = bloc.querySelector('input:checked');
      if (!choisi) return { vide: true };
      var j = parseInt(choisi.value, 10);
      // Les propositions étant mélangées, la correction cite le TEXTE de la réponse
      return { ok: j === q.bonne, correction: '« ' + q.options[q.bonne] + ' »' };
    }
    if (q.type === 'qcm') {
      var coches = Array.prototype.map.call(bloc.querySelectorAll('input:checked'), function (c) { return parseInt(c.value, 10); }).sort();
      if (!coches.length) return { vide: true };
      var bonnes = q.bonnes.slice().sort();
      var ok = coches.length === bonnes.length && coches.every(function (v, k) { return v === bonnes[k]; });
      return { ok: ok, correction: bonnes.map(function (k) { return '« ' + q.options[k] + ' »'; }).join(', ') };
    }
    if (q.type === 'vraifaux') {
      var rep = bloc.querySelector('input:checked');
      if (!rep) return { vide: true };
      return { ok: (rep.value === 'vrai') === q.bonne, correction: q.bonne ? 'Vrai' : 'Faux' };
    }
    if (q.type === 'classement') {
      var seq = sequences[i] || [];
      if (seq.length < q.items.length) return { vide: true, classement: true };
      var ok2 = seq.every(function (v, k) { return v === q.ordre[k]; });
      return { ok: ok2, correction: q.ordre.map(function (k) { return q.items[k]; }).join(' → ') };
    }
    // réponse courte : chaque groupe de mots-clés doit apparaître (une variante suffit)
    var champ = bloc.querySelector('input[type="text"]');
    var texte = normaliser(champ && champ.value);
    if (!texte) return { vide: true };
    var ok3 = q.motsCles.every(function (groupe) {
      return groupe.some(function (variante) { return texte.indexOf(normaliser(variante)) !== -1; });
    });
    return { ok: ok3, correction: q.reponseAffichee };
  }

  function verrouiller(bloc, oui) {
    Array.prototype.forEach.call(bloc.querySelectorAll('input, .classement__item, .classement__reset'), function (el) { el.disabled = oui; });
    bloc.querySelector('.quiz-q__verifier').disabled = oui;
  }

  function afficherQuestion(pos) {
    position = pos;
    var i = ordre[pos];
    Array.prototype.forEach.call(blocs, function (b, k) { b.hidden = k !== i; });
    // Renumérotation à l'écran selon le parcours mélangé
    var num = blocs[i].querySelector('.quiz-q__enonce strong');
    if (num) num.textContent = 'Q' + (pos + 1) + '.';
    // Le libellé du bouton dépend de la POSITION dans le parcours mélangé
    var btn = blocs[i].querySelector('.quiz-q__suivante');
    if (btn) btn.textContent = pos === total - 1 ? '🏁 Voir mon résultat' : 'Question suivante →';
    document.getElementById('quizBilan').hidden = true;
    document.getElementById('quizEtape').textContent = 'Question ' + (pos + 1) + ' / ' + total;
    document.getElementById('quizBarre').style.width = Math.round(((pos + 1) / total) * 100) + '%';
    document.getElementById('quizProgression').hidden = false;
  }

  function afficherBilan() {
    Array.prototype.forEach.call(blocs, function (b) { b.hidden = true; });
    document.getElementById('quizProgression').hidden = true;
    var score = Object.keys(resultats).filter(function (k) { return resultats[k]; }).length;
    var bilan = document.getElementById('quizBilan');
    var maitrise = score >= Math.ceil(total * 0.8); // ≥ 80 % (ex. 8/10) : la leçon est maîtrisée
    bilan.querySelector('.quiz-bilan__titre').textContent = maitrise ? '✅ Je maîtrise !' : '🔁 À revoir';
    bilan.querySelector('.quiz-bilan__note').textContent = 'Ta note : ' + score + ' / ' + total;
    bilan.querySelector('.quiz-bilan__texte').textContent = maitrise
      ? (score === total
        ? 'Sans faute — bravo ! La leçon « ' + DATA.lecon + ' » est parfaitement maîtrisée.'
        : 'Bravo, la leçon « ' + DATA.lecon + ' » est maîtrisée. Relis la correction de la question manquée pour viser le sans-faute.')
      : 'La leçon « ' + DATA.lecon + ' » mérite encore un peu de travail. Réécoute la chanson — toutes les réponses y sont — puis recommence le quiz.';
    bilan.className = 'quiz-bilan ' + (maitrise ? 'quiz-bilan--top' : 'quiz-bilan--faible');
    bilan.hidden = false;
    bilan.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  Array.prototype.forEach.call(blocs, function (bloc) {
    var i = parseInt(bloc.getAttribute('data-i'), 10);
    var q = DATA.questions[i];
    var fb = bloc.querySelector('.quiz-q__feedback');
    var com = bloc.querySelector('.quiz-q__commentaire');
    var btnVerifier = bloc.querySelector('.quiz-q__verifier');
    var btnSuivante = bloc.querySelector('.quiz-q__suivante');

    // Classement : clique les items dans l'ordre, chaque clic reçoit son rang
    if (q.type === 'classement') {
      sequences[i] = [];
      var items = bloc.querySelectorAll('.classement__item');
      Array.prototype.forEach.call(items, function (item) {
        item.addEventListener('click', function () {
          var j = parseInt(item.getAttribute('data-j'), 10);
          if (sequences[i].indexOf(j) !== -1) return; // déjà classé
          sequences[i].push(j);
          var rang = item.querySelector('.classement__rang');
          rang.textContent = sequences[i].length;
          rang.hidden = false;
          item.classList.add('classement__item--choisi');
        });
      });
      bloc.querySelector('.classement__reset').addEventListener('click', function () {
        sequences[i] = [];
        Array.prototype.forEach.call(items, function (item) {
          item.classList.remove('classement__item--choisi');
          var rang = item.querySelector('.classement__rang');
          rang.hidden = true;
          rang.textContent = '';
        });
      });
    }

    btnVerifier.addEventListener('click', function () {
      var r = corriger(q, bloc, i);
      fb.hidden = false;
      if (r.vide) {
        fb.className = 'quiz-q__feedback quiz-q__feedback--vide';
        fb.textContent = q.type === 'courte' ? '✍️ Écris d’abord ta réponse.'
          : r.classement ? '👆 Clique chaque étiquette dans l’ordre avant de vérifier.'
          : '👆 Choisis d’abord une réponse.';
        return;
      }
      resultats[i] = r.ok;
      if (r.ok) {
        fb.className = 'quiz-q__feedback quiz-q__feedback--ok';
        fb.textContent = '✅ Bonne réponse ! (1 point)';
      } else {
        fb.className = 'quiz-q__feedback quiz-q__feedback--ko';
        fb.textContent = '❌ Pas tout à fait. La bonne réponse : ' + r.correction;
      }
      if (q.commentaire) {
        com.hidden = false;
        com.textContent = '💡 ' + q.commentaire;
      }
      verrouiller(bloc, true);
      btnSuivante.hidden = false;
      btnSuivante.focus();
    });

    btnSuivante.addEventListener('click', function () {
      if (position + 1 < total) afficherQuestion(position + 1);
      else afficherBilan();
    });
  });

  function reinitialiser() {
    resultats = {};
    Array.prototype.forEach.call(blocs, function (bloc) {
      var i = parseInt(bloc.getAttribute('data-i'), 10);
      var q = DATA.questions[i];
      verrouiller(bloc, false);
      Array.prototype.forEach.call(bloc.querySelectorAll('input'), function (inp) {
        if (inp.type === 'text') inp.value = '';
        else inp.checked = false;
      });
      if (q.type === 'classement') {
        sequences[i] = [];
        Array.prototype.forEach.call(bloc.querySelectorAll('.classement__item'), function (item) {
          item.classList.remove('classement__item--choisi');
          var rang = item.querySelector('.classement__rang');
          rang.hidden = true;
          rang.textContent = '';
        });
      }
      bloc.querySelector('.quiz-q__feedback').hidden = true;
      bloc.querySelector('.quiz-q__commentaire').hidden = true;
      bloc.querySelector('.quiz-q__suivante').hidden = true;
    });
    // Nouvelle tentative : nouvel ordre de questions ET de propositions
    ordre = melanger();
    melangerPropositions();
    afficherQuestion(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('quizRecommencer').addEventListener('click', reinitialiser);

  var btnReecouter = document.getElementById('quizReecouter');
  if (btnReecouter) {
    btnReecouter.addEventListener('click', function () {
      var media = document.querySelector('#chantMedia video, #chantMedia audio');
      if (!media) return;
      document.getElementById('chantMedia').scrollIntoView({ behavior: 'smooth', block: 'center' });
      try { media.currentTime = 0; media.play(); } catch (e) { /* lecture manuelle */ }
    });
  }

  // Démarrage : afficher la PREMIÈRE question du parcours mélangé (sans cela,
  // la question n° 1 du serveur s'affichait toujours en premier et une
  // question du parcours était sautée).
  afficherQuestion(0);
})();
