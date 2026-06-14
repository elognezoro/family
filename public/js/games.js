/* EduWeb — Espace de jeu (accueil)
 * Mini-jeux QCM 100 % côté navigateur, du Préscolaire au CM2.
 * - Niveau scolaire : Préscolaire · CP · CE1 · CE2 · CM1 · CM2
 * - Difficulté croissante 1 → 3 au fil d'une manche (10 questions)
 * - Questions générées aléatoirement (anti-répétition immédiate)
 * - Chronomètre visible ; meilleur score mémorisé localement (localStorage)
 * Jeux classés par rubrique (Nombres, Calcul, Lecture, Français, Logique). */
(function () {
  'use strict';
  const root = document.getElementById('games-app');
  if (!root) return;

  const LEVELS = ['Préscolaire', 'CP', 'CE1', 'CE2', 'CM1', 'CM2'];
  const ROUND = 10;
  let level = 'CP';

  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rnd(0, arr.length - 1)];
  const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const diffFor = (idx) => (idx <= 3 ? 1 : idx <= 7 ? 2 : 3); // 1→3 croissant sur la manche

  function options4(correct, genDistractor) {
    const set = new Set([String(correct)]);
    let guard = 0;
    while (set.size < 4 && guard++ < 120) { const d = genDistractor(); if (d != null) set.add(String(d)); }
    return shuffle(Array.from(set));
  }

  /* ───────── Petits (Préscolaire / CP) ───────── */
  const EMOJIS = ['🍎', '⭐', '🐟', '🎈', '🌸', '🚗', '🐤', '🍌'];

  function genCount(lvl, d) {
    const max = (lvl === 'Préscolaire' ? [3, 5, 6] : [6, 8, 10])[d - 1];
    const n = rnd(1, max), emo = pick(EMOJIS);
    const opts = options4(n, () => { const x = rnd(1, max + 3); return x !== n ? x : null; });
    return { prompt: Array(n).fill(emo).join(' '), options: opts, answer: String(n), note: 'Combien y en a-t-il ?' };
  }
  function genCompare(lvl, d) {
    const max = (lvl === 'Préscolaire' ? [9, 19, 29] : [29, 59, 99])[d - 1];
    const nums = []; while (nums.length < 4) { const v = rnd(1, max); if (nums.indexOf(v) < 0) nums.push(v); }
    const askMax = Math.random() < 0.5;
    const answer = askMax ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
    return { prompt: nums.join('   '), options: shuffle(nums.map(String)), answer: String(answer), note: askMax ? 'Quel est le plus grand ?' : 'Quel est le plus petit ?' };
  }
  function genNeighbor(lvl, d) {
    const max = (lvl === 'Préscolaire' ? [9, 19, 29] : [29, 59, 99])[d - 1];
    const n = rnd(2, max), after = Math.random() < 0.5, answer = after ? n + 1 : n - 1;
    const opts = options4(answer, () => { const x = answer + rnd(-2, 2); return x >= 0 && x !== answer ? x : null; });
    return { prompt: String(n), options: opts, answer: String(answer), note: after ? 'Quel nombre vient juste après ?' : 'Quel nombre vient juste avant ?' };
  }
  function genShapes(lvl, d) {
    const shapes = ['🔴', '🔵', '🟡', '🟢'];
    const k = [2, 2, 3][d - 1], pat = shuffle(shapes).slice(0, k), len = 5, seq = [];
    for (let i = 0; i < len; i++) seq.push(pat[i % k]);
    const next = pat[len % k];
    return { prompt: seq.join(' ') + ' ?', options: shuffle(shapes.slice()), answer: next, note: 'Quelle forme vient ensuite ?' };
  }
  function genAddSimple(lvl, d) {
    const max = [5, 10, 20][d - 1], a = rnd(1, max), b = rnd(1, max), c = a + b;
    const opts = options4(c, () => { const x = c + rnd(-3, 3); return x >= 0 && x !== c ? x : null; });
    return { prompt: a + ' + ' + b + ' = ?', options: opts, answer: String(c) };
  }
  const SYLL = {
    1: [['chat', 1], ['lit', 1], ['roue', 1], ['papa', 2], ['vélo', 2], ['ami', 2], ['lapin', 2]],
    2: [['maman', 2], ['lapin', 2], ['école', 3], ['banane', 3], ['cadeau', 2], ['chocolat', 3]],
    3: [['banane', 3], ['crocodile', 3], ['téléphone', 3], ['ordinateur', 4], ['parapluie', 3], ['hélicoptère', 4]],
  };
  function genSyllables(lvl, d) {
    const e = pick(SYLL[d]);
    return { prompt: e[0], options: shuffle(['1', '2', '3', '4']), answer: String(e[1]), note: 'Combien de syllabes ?' };
  }

  /* ───────── Grands (CE1 → CM2) ───────── */
  function genMult(lvl, d) {
    const mx = { CE1: [4, 5, 6], CE2: [6, 7, 9], CM1: [8, 9, 10], CM2: [9, 11, 12] }[lvl][d - 1];
    const a = rnd(2, mx), b = rnd(2, mx), c = a * b;
    const opts = options4(c, () => { const x = c + rnd(-10, 10); return x > 0 && x !== c ? x : null; });
    return { prompt: a + ' × ' + b + ' = ?', options: opts, answer: String(c) };
  }
  function genCalc(lvl, d) {
    const cfg = {
      CE1: { ops: ['+', '−'], add: [10, 20, 30] }, CE2: { ops: ['+', '−', '×'], add: [40, 70, 100] },
      CM1: { ops: ['+', '−', '×', '÷'], add: [100, 150, 200] }, CM2: { ops: ['+', '−', '×', '÷'], add: [200, 350, 500] },
    }[lvl];
    let a, b, c, op = pick(cfg.ops), M = cfg.add[d - 1];
    if (op === '×') { const m = lvl === 'CE2' ? [5, 7, 9][d - 1] : [9, 10, 12][d - 1]; a = rnd(2, m); b = rnd(2, m); c = a * b; }
    else if (op === '÷') { const m = [6, 9, 12][d - 1]; b = rnd(2, m); c = rnd(2, m); a = b * c; }
    else { a = rnd(Math.ceil(M * 0.2), M); b = rnd(1, M); if (op === '−' && b > a) { const t = a; a = b; b = t; } c = op === '+' ? a + b : a - b; }
    const span = Math.max(3, Math.round(Math.abs(c) * 0.2));
    const opts = options4(c, () => { const x = c + rnd(-span, span); return x !== c ? x : null; });
    return { prompt: a + ' ' + op + ' ' + b + ' = ?', options: opts, answer: String(c) };
  }
  function genLogic(lvl, d) {
    const t = d === 1 ? 'arith' : d === 2 ? pick(['arith', 'arith2']) : pick(['arith2', 'geom']);
    let seq = [], step = 1;
    if (t === 'geom') { let v = rnd(1, 3); const r = pick([2, 3]); for (let i = 0; i < 5; i++) { seq.push(v); v *= r; } step = seq[4] - seq[3]; }
    else { let v = rnd(1, 12); step = t === 'arith2' ? rnd(3, 9) : pick([1, 2, 2, 3, 5, 10]); for (let i = 0; i < 5; i++) { seq.push(v); v += step; } }
    const answer = seq.pop();
    const opts = options4(answer, () => { const x = answer + rnd(-Math.max(1, step), Math.max(1, step)) * pick([1, 1, 2]); return x > 0 && x !== answer ? x : null; });
    return { prompt: seq.join(' , ') + ' , ?', options: opts, answer: String(answer), note: 'Quel nombre vient ensuite ?' };
  }
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
  function genVocab(lvl, d) {
    const useSyn = Math.random() < 0.5, bank = (useSyn ? SYN : ANT)[lvl], pair = pick(bank);
    const word = pair[0], answer = pair[1], pool = bank.map((p) => p[1]).filter((w) => w !== answer);
    return { prompt: (useSyn ? 'Synonyme de « ' : 'Contraire de « ') + word + ' » ?', options: options4(answer, () => pick(pool)), answer: answer };
  }

  const ALL_GAMES = [
    { id: 'compter', name: 'Compter', sym: '123', desc: 'Compte les objets.', rubric: 'Nombres', levels: ['Préscolaire', 'CP'], gen: genCount },
    { id: 'comparer', name: 'Plus grand / plus petit', sym: '><', desc: 'Compare les nombres.', rubric: 'Nombres', levels: ['Préscolaire', 'CP'], gen: genCompare },
    { id: 'voisins', name: 'Avant / après', sym: '±1', desc: 'Le nombre voisin.', rubric: 'Nombres', levels: ['Préscolaire', 'CP'], gen: genNeighbor },
    { id: 'formes', name: 'Suite de formes', sym: '◑', desc: 'Devine la suite.', rubric: 'Logique', levels: ['Préscolaire', 'CP'], gen: genShapes },
    { id: 'addsimple', name: 'Addition simple', sym: '+', desc: 'Petites additions.', rubric: 'Calcul', levels: ['CP'], gen: genAddSimple },
    { id: 'syllabes', name: 'Compter les syllabes', sym: 'Aa', desc: 'Combien de syllabes ?', rubric: 'Lecture', levels: ['CP'], gen: genSyllables },
    { id: 'mult', name: 'Table de multiplication', sym: '×', desc: 'Révise tes tables.', rubric: 'Calcul', levels: ['CE1', 'CE2', 'CM1', 'CM2'], gen: genMult },
    { id: 'calc', name: 'Calcul rapide', sym: '+−', desc: 'Additions, soustractions…', rubric: 'Calcul', levels: ['CE1', 'CE2', 'CM1', 'CM2'], gen: genCalc },
    { id: 'vocab', name: 'Vocabulaire', sym: 'Aa', desc: 'Synonymes & contraires.', rubric: 'Français', levels: ['CE1', 'CE2', 'CM1', 'CM2'], gen: genVocab },
    { id: 'logic', name: 'Logique', sym: '?', desc: 'Trouve la suite.', rubric: 'Logique', levels: ['CE1', 'CE2', 'CM1', 'CM2'], gen: genLogic },
  ];
  const ICON_CLASS = { Nombres: 'num', Calcul: 'calc', Lecture: 'read', 'Français': 'fr', Logique: 'logic' };

  /* ───────── État, chrono & rendu ───────── */
  let state = null, timerId = null;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmtTime = (s) => Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  const bestKey = (g) => 'eduweb_game_best_' + g + '_' + level;
  const getBest = (g) => { try { return parseInt(localStorage.getItem(bestKey(g)) || '0', 10) || 0; } catch (e) { return 0; } };
  const setBest = (g, v) => { try { localStorage.setItem(bestKey(g), String(v)); } catch (e) {} };
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function tick() { const el = document.getElementById('gtimer'); if (el && state) el.textContent = fmtTime(Math.round((Date.now() - state.startedAt) / 1000)); }

  function levelPills() {
    return '<div class="games-levels" role="group" aria-label="Niveau">' +
      LEVELS.map((l) => '<button type="button" class="games-level' + (l === level ? ' is-active' : '') + '" data-level="' + esc(l) + '">' + esc(l) + '</button>').join('') + '</div>';
  }
  function gameCard(g) {
    const best = getBest(g.id);
    return '<button type="button" class="game-card" data-game="' + g.id + '">' +
      '<span class="game-card__icon game-card__icon--' + (ICON_CLASS[g.rubric] || 'num') + '">' + esc(g.sym) + '</span>' +
      '<span class="game-card__name">' + g.name + '</span>' +
      '<span class="game-card__desc">' + g.desc + '</span>' +
      (best ? '<span class="game-card__best">★ Record : ' + best + '/' + ROUND + '</span>' : '<span class="game-card__best game-card__best--none">Jouer →</span>') +
      '</button>';
  }
  function renderMenu() {
    stopTimer(); state = null;
    const games = ALL_GAMES.filter((g) => g.levels.indexOf(level) > -1);
    const order = [], map = {};
    games.forEach((g) => { if (!map[g.rubric]) { map[g.rubric] = []; order.push(g.rubric); } map[g.rubric].push(g); });
    root.innerHTML =
      '<div class="games-bar"><span class="games-bar__label">Niveau :</span>' + levelPills() + '</div>' +
      order.map((r) => '<div class="games-rubric"><h3 class="games-rubric__title">' + esc(r) + '</h3><div class="games-menu">' + map[r].map(gameCard).join('') + '</div></div>').join('');
  }

  function nextQuestion() {
    state.idx++;
    if (state.idx > ROUND) return renderResult();
    const d = diffFor(state.idx);
    let q, guard = 0;
    // Aucune question déjà posée durant cette manche (anti-doublon sur tout le round).
    do { q = state.game.gen(level, d); } while (state.seen.has(q.prompt) && guard++ < 60);
    state.seen.add(q.prompt); state.q = q; state.diff = d;
    renderPlay();
  }
  function renderPlay() {
    const g = state.game, q = state.q;
    root.innerHTML =
      '<div class="game-play">' +
      '<div class="game-play__top">' +
        '<button type="button" class="game-quit" data-quit>← Quitter</button>' +
        '<span class="game-play__title">' + esc(g.name) + ' · ' + esc(level) + '</span>' +
        '<span class="game-play__score">Score : <strong>' + state.score + '</strong></span>' +
      '</div>' +
      '<div class="game-play__meta"><span class="game-badge">Niveau ' + state.diff + '/3</span>' +
        '<span class="game-timer"><span class="game-timer__dot"></span><span id="gtimer">' + fmtTime(Math.round((Date.now() - state.startedAt) / 1000)) + '</span></span></div>' +
      '<div class="game-progress"><span style="width:' + Math.round((state.idx - 1) / ROUND * 100) + '%"></span></div>' +
      '<div class="game-count">Question ' + state.idx + ' / ' + ROUND + '</div>' +
      (q.note ? '<p class="game-note">' + esc(q.note) + '</p>' : '') +
      '<div class="game-q">' + esc(q.prompt) + '</div>' +
      '<div class="game-options">' + q.options.map((o) => '<button type="button" class="game-opt" data-opt="' + esc(o) + '">' + esc(o) + '</button>').join('') + '</div>' +
      '</div>';
  }
  function answer(val, btn) {
    const q = state.q, opts = root.querySelectorAll('.game-opt');
    opts.forEach((b) => { b.disabled = true; if (b.dataset.opt === q.answer) b.classList.add('is-correct'); });
    const ok = val === q.answer;
    if (ok) { state.score++; if (btn) btn.classList.add('is-correct'); } else if (btn) btn.classList.add('is-wrong');
    const sc = root.querySelector('.game-play__score strong'); if (sc) sc.textContent = state.score;
    setTimeout(nextQuestion, ok ? 550 : 950);
  }
  function renderResult() {
    stopTimer();
    const secs = Math.round((Date.now() - state.startedAt) / 1000), score = state.score, g = state.game;
    const record = score > getBest(g.id); if (record) setBest(g.id, score);
    const pct = score / ROUND, stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
    const msg = pct >= 0.9 ? 'Bravo, champion ! 🎉' : pct >= 0.6 ? 'Très bien joué !' : pct >= 0.3 ? 'Bien, continue à t’entraîner !' : 'Courage, réessaie !';
    root.innerHTML =
      '<div class="game-result">' +
      '<div class="game-result__stars">' + '★'.repeat(stars) + '<span class="game-result__stars-off">' + '★'.repeat(3 - stars) + '</span></div>' +
      '<div class="game-result__score">' + score + ' / ' + ROUND + '</div>' +
      '<p class="game-result__msg">' + msg + (record ? ' <span class="game-result__record">Nouveau record !</span>' : '') + '</p>' +
      '<p class="game-result__meta">' + esc(g.name) + ' · ' + esc(level) + ' · ⏱ ' + fmtTime(secs) + '</p>' +
      '<div class="game-result__actions"><button type="button" class="btn btn--primary" data-replay>Rejouer</button>' +
      '<button type="button" class="btn btn--ghost" data-menu>Autre jeu</button></div>' +
      '</div>';
  }
  function startGame(id) {
    const game = ALL_GAMES.find((g) => g.id === id); if (!game) return;
    stopTimer();
    state = { game: game, idx: 0, score: 0, startedAt: Date.now(), q: null, seen: new Set(), diff: 1 };
    timerId = setInterval(tick, 1000);
    nextQuestion();
  }

  root.addEventListener('click', function (e) {
    const lvl = e.target.closest('[data-level]'); if (lvl) { level = lvl.dataset.level; renderMenu(); return; }
    const card = e.target.closest('[data-game]'); if (card) { startGame(card.dataset.game); return; }
    const opt = e.target.closest('[data-opt]'); if (opt && !opt.disabled) { answer(opt.dataset.opt, opt); return; }
    if (e.target.closest('[data-quit]') || e.target.closest('[data-menu]')) { renderMenu(); return; }
    if (e.target.closest('[data-replay]')) { startGame(state.game.id); return; }
  });

  renderMenu();
})();
