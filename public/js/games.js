/* EduWeb — Espace de jeu (accueil)
 * 4 mini-jeux 100 % côté navigateur, pour écoliers CE1 → CM2 :
 * Table de multiplication · Calcul rapide · Vocabulaire · Logique.
 * Aucun compte requis ; meilleur score mémorisé localement (localStorage). */
(function () {
  'use strict';
  const root = document.getElementById('games-app');
  if (!root) return;

  const LEVELS = ['CE1', 'CE2', 'CM1', 'CM2'];
  const ROUND = 10; // questions par partie
  let level = 'CE1';

  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rnd(0, arr.length - 1)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function options4(correct, genDistractor) {
    const set = new Set([String(correct)]);
    let guard = 0;
    while (set.size < 4 && guard++ < 80) { const d = genDistractor(); if (d != null) set.add(String(d)); }
    return shuffle(Array.from(set));
  }

  /* ───────── Générateurs de questions ───────── */

  function genMult() {
    const max = { CE1: 5, CE2: 6, CM1: 9, CM2: 10 }[level];
    const a = rnd(2, max), b = rnd(2, max), correct = a * b;
    const opts = options4(correct, () => { const d = correct + rnd(-10, 10); return d > 0 && d !== correct ? d : null; });
    return { prompt: a + ' × ' + b + ' = ?', options: opts, answer: String(correct) };
  }

  function genCalc() {
    let a, b, op, correct;
    if (level === 'CE1') { op = pick(['+', '−']); a = rnd(2, 20); b = rnd(1, 20); if (op === '−' && b > a) { const t = a; a = b; b = t; } correct = op === '+' ? a + b : a - b; }
    else if (level === 'CE2') { op = pick(['+', '−', '×']); if (op === '×') { a = rnd(2, 5); b = rnd(2, 9); correct = a * b; } else { a = rnd(10, 99); b = rnd(1, 60); if (op === '−' && b > a) { const t = a; a = b; b = t; } correct = op === '+' ? a + b : a - b; } }
    else if (level === 'CM1') { op = pick(['+', '−', '×', '÷']); if (op === '×') { a = rnd(2, 9); b = rnd(2, 12); correct = a * b; } else if (op === '÷') { b = rnd(2, 9); correct = rnd(2, 9); a = b * correct; } else { a = rnd(20, 200); b = rnd(10, 120); if (op === '−' && b > a) { const t = a; a = b; b = t; } correct = op === '+' ? a + b : a - b; } }
    else { op = pick(['+', '−', '×', '÷']); if (op === '×') { a = rnd(6, 12); b = rnd(6, 12); correct = a * b; } else if (op === '÷') { b = rnd(2, 12); correct = rnd(2, 12); a = b * correct; } else { a = rnd(50, 500); b = rnd(20, 350); if (op === '−' && b > a) { const t = a; a = b; b = t; } correct = op === '+' ? a + b : a - b; } }
    const span = Math.max(5, Math.round(Math.abs(correct) * 0.2));
    const opts = options4(correct, () => { const d = correct + rnd(-span, span); return d !== correct ? d : null; });
    return { prompt: a + ' ' + op + ' ' + b + ' = ?', options: opts, answer: String(correct) };
  }

  function genLogic() {
    const types = (level === 'CE1' || level === 'CE2') ? ['arith', 'arith'] : ['arith', 'arith2', 'geom'];
    const t = pick(types);
    let seq = [], step = 1;
    if (t === 'geom') { let v = rnd(1, 3); const r = pick([2, 3]); for (let i = 0; i < 5; i++) { seq.push(v); v *= r; } step = seq[seq.length - 1] - seq[seq.length - 2]; }
    else { let v = rnd(1, 12); step = t === 'arith2' ? rnd(3, 9) : pick([1, 2, 2, 3, 5, 10]); for (let i = 0; i < 5; i++) { seq.push(v); v += step; } }
    const answer = seq.pop();
    const opts = options4(answer, () => { const d = answer + rnd(-Math.max(1, step), Math.max(1, step)) * pick([1, 1, 2]); return d > 0 && d !== answer ? d : null; });
    return { prompt: seq.join(' , ') + ' , ?', options: opts, answer: String(answer), note: 'Quel nombre vient ensuite ?' };
  }

  // Banque de vocabulaire : synonymes & contraires par niveau.
  const SYN = {
    CE1: [['content', 'heureux'], ['joli', 'beau'], ['rapide', 'vite'], ['ami', 'copain'], ['grand', 'immense'], ['petit', 'minuscule'], ['gentil', 'aimable'], ['fatigué', 'épuisé']],
    CE2: [['content', 'joyeux'], ['beau', 'magnifique'], ['drôle', 'amusant'], ['calme', 'tranquille'], ['courageux', 'brave'], ['malin', 'rusé'], ['débuter', 'commencer'], ['triste', 'malheureux']],
    CM1: [['heureux', 'ravi'], ['effrayé', 'apeuré'], ['bizarre', 'étrange'], ['célèbre', 'connu'], ['terminer', 'achever'], ['fabriquer', 'construire'], ['rapide', 'prompt'], ['content', 'satisfait']],
    CM2: [['courageux', 'intrépide'], ['intelligent', 'astucieux'], ['immense', 'colossal'], ['calme', 'serein'], ['ancien', 'antique'], ['célèbre', 'renommé'], ['fatigué', 'exténué'], ['rapide', 'fulgurant']],
  };
  const ANT = {
    CE1: [['grand', 'petit'], ['chaud', 'froid'], ['jour', 'nuit'], ['content', 'triste'], ['rapide', 'lent'], ['propre', 'sale'], ['haut', 'bas'], ['plein', 'vide']],
    CE2: [['ancien', 'nouveau'], ['ouvert', 'fermé'], ['facile', 'difficile'], ['monter', 'descendre'], ['gagner', 'perdre'], ['riche', 'pauvre'], ['fort', 'faible'], ['début', 'fin']],
    CM1: [['augmenter', 'diminuer'], ['accepter', 'refuser'], ['présent', 'absent'], ['clair', 'sombre'], ['rare', 'fréquent'], ['autoriser', 'interdire'], ['ancien', 'récent'], ['victoire', 'défaite']],
    CM2: [['abondant', 'rare'], ['généreux', 'avare'], ['sincère', 'hypocrite'], ['agile', 'maladroit'], ['humide', 'sec'], ['courageux', 'peureux'], ['ordinaire', 'exceptionnel'], ['visible', 'invisible']],
  };
  function genVocab() {
    const useSyn = Math.random() < 0.5;
    const bank = (useSyn ? SYN : ANT)[level];
    const pair = pick(bank);
    const word = pair[0], answer = pair[1];
    const pool = bank.map((p) => p[1]).filter((w) => w !== answer);
    const opts = options4(answer, () => pick(pool));
    return { prompt: (useSyn ? 'Synonyme de « ' : 'Contraire de « ') + word + ' » ?', options: opts, answer: answer };
  }

  const GAMES = [
    { id: 'mult', name: 'Table de multiplication', sym: '×', desc: 'Révise tes tables.', gen: genMult },
    { id: 'calc', name: 'Calcul rapide', sym: '+−', desc: 'Additions, soustractions…', gen: genCalc },
    { id: 'vocab', name: 'Vocabulaire', sym: 'Aa', desc: 'Synonymes & contraires.', gen: genVocab },
    { id: 'logic', name: 'Logique', sym: '?', desc: 'Trouve la suite.', gen: genLogic },
  ];

  /* ───────── État & rendu ───────── */
  let state = null; // { game, q, idx, score, startedAt }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const bestKey = (g) => 'eduweb_game_best_' + g + '_' + level;
  function getBest(g) { try { return parseInt(localStorage.getItem(bestKey(g)) || '0', 10) || 0; } catch (e) { return 0; } }
  function setBest(g, v) { try { localStorage.setItem(bestKey(g), String(v)); } catch (e) {} }

  function levelPills() {
    return '<div class="games-levels" role="group" aria-label="Niveau">' +
      LEVELS.map((l) => '<button type="button" class="games-level' + (l === level ? ' is-active' : '') + '" data-level="' + l + '">' + l + '</button>').join('') +
      '</div>';
  }

  function renderMenu() {
    state = null;
    root.innerHTML =
      '<div class="games-bar"><span class="games-bar__label">Choisis ton niveau :</span>' + levelPills() + '</div>' +
      '<div class="games-menu">' +
      GAMES.map((g) => {
        const best = getBest(g.id);
        return '<button type="button" class="game-card" data-game="' + g.id + '">' +
          '<span class="game-card__icon game-card__icon--' + g.id + '">' + g.sym + '</span>' +
          '<span class="game-card__name">' + g.name + '</span>' +
          '<span class="game-card__desc">' + g.desc + '</span>' +
          (best ? '<span class="game-card__best">★ Record : ' + best + '/' + ROUND + '</span>' : '<span class="game-card__best game-card__best--none">Jouer →</span>') +
          '</button>';
      }).join('') +
      '</div>';
  }

  function nextQuestion() {
    state.idx++;
    if (state.idx > ROUND) return renderResult();
    state.q = state.game.gen();
    renderPlay();
  }

  function renderPlay() {
    const g = state.game, q = state.q;
    root.innerHTML =
      '<div class="game-play">' +
      '<div class="game-play__top">' +
        '<button type="button" class="game-quit" data-quit>← Quitter</button>' +
        '<span class="game-play__title">' + g.name + ' · ' + level + '</span>' +
        '<span class="game-play__score">Score : <strong>' + state.score + '</strong></span>' +
      '</div>' +
      '<div class="game-progress"><span style="width:' + Math.round((state.idx - 1) / ROUND * 100) + '%"></span></div>' +
      '<div class="game-count">Question ' + state.idx + ' / ' + ROUND + '</div>' +
      (q.note ? '<p class="game-note">' + esc(q.note) + '</p>' : '') +
      '<div class="game-q">' + esc(q.prompt) + '</div>' +
      '<div class="game-options">' +
        q.options.map((o) => '<button type="button" class="game-opt" data-opt="' + esc(o) + '">' + esc(o) + '</button>').join('') +
      '</div>' +
      '</div>';
  }

  function answer(val, btn) {
    const q = state.q;
    const opts = root.querySelectorAll('.game-opt');
    opts.forEach((b) => { b.disabled = true; if (b.dataset.opt === q.answer) b.classList.add('is-correct'); });
    const correct = val === q.answer;
    if (correct) { state.score++; if (btn) btn.classList.add('is-correct'); }
    else if (btn) btn.classList.add('is-wrong');
    const sc = root.querySelector('.game-play__score strong'); if (sc) sc.textContent = state.score;
    setTimeout(nextQuestion, correct ? 550 : 950);
  }

  function renderResult() {
    const secs = Math.round((Date.now() - state.startedAt) / 1000);
    const score = state.score, g = state.game;
    const prevBest = getBest(g.id);
    const record = score > prevBest;
    if (record) setBest(g.id, score);
    const pct = score / ROUND;
    const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
    const msg = pct >= 0.9 ? 'Bravo, champion ! 🎉' : pct >= 0.6 ? 'Très bien joué !' : pct >= 0.3 ? 'Bien, continue à t’entraîner !' : 'Courage, réessaie !';
    root.innerHTML =
      '<div class="game-result">' +
      '<div class="game-result__stars">' + ('★★★'.slice(0, stars) || '') + '<span class="game-result__stars-off">' + '★★★'.slice(0, 3 - stars) + '</span></div>' +
      '<div class="game-result__score">' + score + ' / ' + ROUND + '</div>' +
      '<p class="game-result__msg">' + msg + (record ? ' <span class="game-result__record">Nouveau record !</span>' : '') + '</p>' +
      '<p class="game-result__meta">' + g.name + ' · ' + level + ' · ' + secs + ' s</p>' +
      '<div class="game-result__actions">' +
        '<button type="button" class="btn btn--primary" data-replay>Rejouer</button>' +
        '<button type="button" class="btn btn--ghost" data-menu>Autre jeu</button>' +
      '</div>' +
      '</div>';
  }

  function startGame(id) {
    const game = GAMES.find((g) => g.id === id);
    if (!game) return;
    state = { game: game, idx: 0, score: 0, startedAt: Date.now(), q: null };
    nextQuestion();
  }

  /* ───────── Délégation d'événements ───────── */
  root.addEventListener('click', function (e) {
    const lvl = e.target.closest('[data-level]');
    if (lvl) { level = lvl.dataset.level; if (state) renderMenu(); else renderMenu(); return; }
    const card = e.target.closest('[data-game]');
    if (card) { startGame(card.dataset.game); return; }
    const opt = e.target.closest('[data-opt]');
    if (opt && !opt.disabled) { answer(opt.dataset.opt, opt); return; }
    if (e.target.closest('[data-quit]') || e.target.closest('[data-menu]')) { renderMenu(); return; }
    if (e.target.closest('[data-replay]')) { startGame(state.game.id); return; }
  });

  renderMenu();
})();
