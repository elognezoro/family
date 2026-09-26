/* Quiz des chants pédagogiques — vérification question par question,
   puis appréciation globale de la maîtrise de la leçon. */
(function () {
  var DATA = window.CHANT_QUIZ;
  if (!DATA || !DATA.questions) return;
  var total = DATA.questions.length;
  var resultats = {}; // i -> true/false (après vérification)

  // Normalisation des réponses courtes : minuscules, sans accents ni ponctuation
  function normaliser(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function lettres(indices) {
    return indices.map(function (j) { return String.fromCharCode(65 + j); }).join(', ');
  }

  function corriger(q, bloc) {
    if (q.type === 'qcu') {
      var choisi = bloc.querySelector('input:checked');
      if (!choisi) return { vide: true };
      var j = parseInt(choisi.value, 10);
      return { ok: j === q.bonne, correction: lettres([q.bonne]) + '. ' + q.options[q.bonne] };
    }
    if (q.type === 'qcm') {
      var coches = Array.prototype.map.call(bloc.querySelectorAll('input:checked'), function (c) { return parseInt(c.value, 10); }).sort();
      if (!coches.length) return { vide: true };
      var bonnes = q.bonnes.slice().sort();
      var ok = coches.length === bonnes.length && coches.every(function (v, k) { return v === bonnes[k]; });
      return { ok: ok, correction: lettres(bonnes) + ' — ' + bonnes.map(function (j) { return q.options[j]; }).join(', ') };
    }
    if (q.type === 'vraifaux') {
      var rep = bloc.querySelector('input:checked');
      if (!rep) return { vide: true };
      return { ok: (rep.value === 'vrai') === q.bonne, correction: q.bonne ? 'Vrai' : 'Faux' };
    }
    // réponse courte : chaque groupe de mots-clés doit apparaître (une variante suffit)
    var champ = bloc.querySelector('input[type="text"]');
    var texte = normaliser(champ && champ.value);
    if (!texte) return { vide: true };
    var ok2 = q.motsCles.every(function (groupe) {
      return groupe.some(function (variante) { return texte.indexOf(normaliser(variante)) !== -1; });
    });
    return { ok: ok2, correction: q.reponseAffichee };
  }

  function verrouiller(bloc, oui) {
    Array.prototype.forEach.call(bloc.querySelectorAll('input'), function (inp) { inp.disabled = oui; });
    bloc.querySelector('.quiz-q__verifier').disabled = oui;
  }

  function majBilan() {
    if (Object.keys(resultats).length < total) return;
    var score = Object.keys(resultats).filter(function (k) { return resultats[k]; }).length;
    var bilan = document.getElementById('quizBilan');
    var titre = bilan.querySelector('.quiz-bilan__titre');
    var texte = bilan.querySelector('.quiz-bilan__texte');
    var note = score + ' / ' + total;
    if (score === total) {
      titre.textContent = '🌟 Excellent ! ' + note;
      texte.textContent = 'Bravo, tu maîtrises parfaitement la leçon « ' + DATA.lecon + ' ». Continue comme ça !';
      bilan.className = 'quiz-bilan quiz-bilan--top';
    } else if (score >= total - 1) {
      titre.textContent = '👏 Très bien ! ' + note;
      texte.textContent = 'La leçon « ' + DATA.lecon + ' » est presque parfaitement maîtrisée. Relis la question manquée et tu seras au top.';
      bilan.className = 'quiz-bilan quiz-bilan--top';
    } else if (score >= Math.ceil(total * 0.6)) {
      titre.textContent = '🙂 C’est bien ! ' + note;
      texte.textContent = 'Tu es sur la bonne voie pour la leçon « ' + DATA.lecon + ' ». Réécoute la chanson pour consolider les points manqués, puis recommence le quiz.';
      bilan.className = 'quiz-bilan quiz-bilan--moyen';
    } else {
      titre.textContent = '💪 Courage ! ' + note;
      texte.textContent = 'La leçon « ' + DATA.lecon + ' » n’est pas encore maîtrisée. Réécoute bien la chanson — toutes les réponses y sont — puis retente le quiz.';
      bilan.className = 'quiz-bilan quiz-bilan--faible';
    }
    bilan.hidden = false;
    bilan.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.quiz-q'), function (bloc) {
    var i = parseInt(bloc.getAttribute('data-i'), 10);
    var q = DATA.questions[i];
    var fb = bloc.querySelector('.quiz-q__feedback');
    bloc.querySelector('.quiz-q__verifier').addEventListener('click', function () {
      var r = corriger(q, bloc);
      fb.hidden = false;
      if (r.vide) {
        fb.className = 'quiz-q__feedback quiz-q__feedback--vide';
        fb.textContent = q.type === 'courte' ? '✍️ Écris d’abord ta réponse.' : '👆 Choisis d’abord une réponse.';
        return;
      }
      resultats[i] = r.ok;
      if (r.ok) {
        fb.className = 'quiz-q__feedback quiz-q__feedback--ok';
        fb.textContent = '✅ Bonne réponse !';
      } else {
        fb.className = 'quiz-q__feedback quiz-q__feedback--ko';
        fb.textContent = '❌ Pas tout à fait. La bonne réponse : ' + r.correction;
      }
      verrouiller(bloc, true);
      majBilan();
    });
  });

  document.getElementById('quizRecommencer').addEventListener('click', function () {
    resultats = {};
    document.getElementById('quizBilan').hidden = true;
    Array.prototype.forEach.call(document.querySelectorAll('.quiz-q'), function (bloc) {
      verrouiller(bloc, false);
      Array.prototype.forEach.call(bloc.querySelectorAll('input'), function (inp) {
        if (inp.type === 'text') inp.value = '';
        else inp.checked = false;
      });
      var fb = bloc.querySelector('.quiz-q__feedback');
      fb.hidden = true;
      fb.textContent = '';
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
