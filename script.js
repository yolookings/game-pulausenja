/**
 * Pulau Senja — Candy Crush-style Match-3 with storyline
 */

const ROWS = 8;
const COLS = 8;
const CANDY_TYPES = [
  { id: 'ruby', emoji: '🔴', name: 'Ruby', color: '#ff4757' },
  { id: 'orange', emoji: '🟠', name: 'Jeruk', color: '#ff9f43' },
  { id: 'lemon', emoji: '🟡', name: 'Lemon', color: '#feca57' },
  { id: 'emerald', emoji: '🟢', name: 'Zamrud', color: '#2ed573' },
  { id: 'sapphire', emoji: '🔵', name: 'Safir', color: '#3742fa' },
  { id: 'amethyst', emoji: '🟣', name: 'Amethyst', color: '#a55eea' },
];

const STORAGE_KEY = 'pulauSenjaSave';

const state = {
  grid: [],
  selected: null,
  score: 0,
  moves: 0,
  levelIndex: 0,
  objectives: [],
  isAnimating: false,
  combo: 0,
  unlockedLevel: 0,
  levelStars: [],
  storyCallback: null,
};

const els = {
  screens: {
    menu: document.getElementById('screen-menu'),
    map: document.getElementById('screen-map'),
    story: document.getElementById('screen-story'),
    game: document.getElementById('screen-game'),
  },
  board: document.getElementById('board'),
  objectives: document.getElementById('objectives'),
  hudLevel: document.getElementById('hud-level-num'),
  hudMoves: document.getElementById('hud-moves'),
  hudScore: document.getElementById('hud-score'),
  comboDisplay: document.getElementById('combo-display'),
  levelMap: document.getElementById('level-map'),
  menuLevel: document.getElementById('menu-level'),
  menuStars: document.getElementById('menu-stars'),
  mapTotalStars: document.getElementById('map-total-stars'),
  storyChapter: document.getElementById('story-chapter'),
  storyAvatar: document.getElementById('story-avatar'),
  storyTitle: document.getElementById('story-title'),
  storyBody: document.getElementById('story-body'),
  overlayLevel: document.getElementById('overlay-level'),
  overlayFail: document.getElementById('overlay-fail'),
  overlayEnding: document.getElementById('overlay-ending'),
  overlayIntro: document.getElementById('overlay-intro'),
  winTitle: document.getElementById('win-title'),
  winText: document.getElementById('win-text'),
  winScore: document.getElementById('win-score'),
  winStars: document.getElementById('win-stars'),
  winIcon: document.getElementById('win-icon'),
  endingTitle: document.getElementById('ending-title'),
  endingText: document.getElementById('ending-text'),
  endingIcon: document.getElementById('ending-icon'),
};

/* ─── Story & Levels ─── */

const STORY = {
  intro: {
    chapter: 'Prolog',
    avatar: '🌅',
    title: 'Pulau Senja',
    text: 'Gelombang membasuh wajahmu di pantai keemasan. Di kejauhan, mercusuar berkedip lemah—hampir padam. Nenek Pulau berkata: "Kumpulkan permen cahaya di seluruh pulau. Hanya dengan mencocokkannya, fajar bisa kembali."',
  },
  chapters: [
    { chapter: 'Bab I — Pantai', avatar: '🏖️', title: 'Permen Pertama', text: 'Pasir pantai berkilauan seperti gula. Permen cahaya muncul dari kerang-kerang yang terbuka—cocokkan mereka untuk mengumpulkan Ruby, warna fajar pertama.' },
    { chapter: 'Bab I — Pantai', avatar: '🐚', title: 'Ombak Manis', text: 'Ombak membawa lebih banyak permen! Nenek tersenyum: "Bagus, anak muda. Mercusuar mulai berdenyut lagi." Lanjutkan sebelum pasang surut membawa cahaya pergi.' },
    { chapter: 'Bab I — Pantai', avatar: '🗼', title: 'Mercusuar', text: 'Kau menaiki mercusuar. Lampu besar itu membutuhkan 500 poin cahaya. "Cocokkan dengan bijak," bisik angin. "Setiap gerakan berharga."' },
    { chapter: 'Bab II — Hutan', avatar: '🌲', title: 'Hutan Kabut', text: 'Kabut tipis menyelimuti hutan. Permen Zamrud tumbuh di lumut—warna penjaga hutan yang jatuh. Bayangan berbisik: "Jangan takut, terus kumpulkan cahaya."' },
    { chapter: 'Bab II — Hutan', avatar: '🦋', title: 'Kupu-kupu Cahaya', text: 'Kupu-kupu bersayap permen terbang di antara pohon. Cocokkan Lemon dan Jeruk—dua warna yang disukai roh hutan. Pohon-pohon tua mulai bersinar.' },
    { chapter: 'Bab II — Hutan', avatar: '🕊️', title: 'Damai di Kabut', text: 'Bayangan Penjaga yang jatuh memudar saat kau mengumpulkan cukup Zamrud. "Terima kasih," bisiknya. "Bawakan cahaya ini ke gua utara."' },
    { chapter: 'Bab III — Gua', avatar: '🪨', title: 'Gua Utara', text: 'Gua gelap dan lembap. Permen Safir bersinar di dinding—warna harapan. Teka-teki kuno terukir: "Cocokkan tiga, dan harapan akan tumbuh."' },
    { chapter: 'Bab III — Gua', avatar: '💎', title: 'Kristal Harapan', text: 'Kristal besar di dalam gua membutuhkan 800 poin. Setiap kombinasi membuat dinding gua bersinar. Kau merasakan pecahan cahaya kedua hampir utuh.' },
    { chapter: 'Bab III — Gua', avatar: '✨', title: 'Jawaban Gua', text: '"Harapan"—kata yang tepat terungkap saat skor mencapai puncak. Pecahan kedua mengambang ke arahmu. Gua bergetar dengan cahaya keemasan.' },
    { chapter: 'Bab IV — Teluk', avatar: '🌊', title: 'Teluk Roh Air', text: 'Air teluk bersinar biru. Roh air muncul: "Manusia dari pantai... kumpulkan permen Amethyst untuk membuktikan hatimu tulus." Permen ungu muncul di permukaan air.' },
    { chapter: 'Bab IV — Teluk', avatar: '🧜', title: 'Berkat Roh Air', text: 'Roh air tersenyum saat Amethyst cukup terkumpul. Ombak membentuk jembatan cahaya. "Satu pecahan terakhir menunggu di puncak batu," katanya.' },
    { chapter: 'Bab V — Puncak', avatar: '⛰️', title: 'Puncak Batu', text: 'Di puncak, semua warna permen bersatu. Ini ujian terakhir—kumpulkan setiap warna, capai skor legendaris, dan nyalakan mercusuar selamanya!' },
  ],
  endingGood: {
    icon: '🌞',
    title: 'Fajar Abadi',
    text: 'Mercusuar menyala terang! Matahari terbit di atas Pulau Senja. Nenek tersenyum, roh air menari, dan bayangan Penjaga menemukan kedamaian. "Terima kasih," bisik pulau itu. "Kau membawa cahaya kembali."',
  },
  endingOk: {
    icon: '🌤️',
    title: 'Senja Hangat',
    text: 'Mercusuar menyala cukup terang. Fajar datang—meski tidak selamanya, cukup untuk menghidupkan pulau bertahun-tahun. Pulau Senja selamat, berkat permen cahayamu.',
  },
};

const LEVELS = [
  { moves: 25, objectives: [{ type: 'collect', candy: 'ruby', count: 12 }], stars: [500, 900, 1400] },
  { moves: 22, objectives: [{ type: 'collect', candy: 'orange', count: 15 }], stars: [600, 1000, 1500] },
  { moves: 20, objectives: [{ type: 'score', count: 500 }], stars: [500, 800, 1200] },
  { moves: 22, objectives: [{ type: 'collect', candy: 'emerald', count: 14 }], stars: [700, 1100, 1600] },
  { moves: 20, objectives: [{ type: 'collect', candy: 'lemon', count: 12 }, { type: 'collect', candy: 'orange', count: 12 }], stars: [800, 1200, 1800] },
  { moves: 18, objectives: [{ type: 'collect', candy: 'emerald', count: 20 }], stars: [900, 1400, 2000] },
  { moves: 22, objectives: [{ type: 'collect', candy: 'sapphire', count: 16 }], stars: [700, 1100, 1700] },
  { moves: 18, objectives: [{ type: 'score', count: 800 }], stars: [800, 1200, 1800] },
  { moves: 16, objectives: [{ type: 'score', count: 1000 }, { type: 'collect', candy: 'sapphire', count: 10 }], stars: [1000, 1500, 2200] },
  { moves: 20, objectives: [{ type: 'collect', candy: 'amethyst', count: 18 }], stars: [800, 1300, 1900] },
  { moves: 18, objectives: [{ type: 'collect', candy: 'amethyst', count: 15 }, { type: 'score', count: 900 }], stars: [900, 1400, 2000] },
  { moves: 15, objectives: [
    { type: 'collect', candy: 'ruby', count: 8 },
    { type: 'collect', candy: 'emerald', count: 8 },
    { type: 'collect', candy: 'sapphire', count: 8 },
    { type: 'score', count: 1500 },
  ], stars: [1500, 2200, 3000] },
];

/* ─── Persistence ─── */

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state.unlockedLevel = data.unlockedLevel ?? 0;
    state.levelStars = data.levelStars ?? [];
  } catch {
    /* ignore */
  }
}

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    unlockedLevel: state.unlockedLevel,
    levelStars: state.levelStars,
  }));
}

/* ─── Grid helpers ─── */

function randomCandy() {
  return CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)].id;
}

function candyAt(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return null;
  return state.grid[r][c];
}

function createGrid() {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < COLS; c++) {
      let type;
      do {
        type = randomCandy();
      } while (wouldMatch(grid, r, c, type));
      grid[r][c] = { type, special: null, id: `${r}-${c}-${Date.now()}-${Math.random()}` };
    }
  }
  return grid;
}

function wouldMatch(grid, r, c, type) {
  if (c >= 2 && grid[r][c - 1]?.type === type && grid[r][c - 2]?.type === type) return true;
  if (r >= 2 && grid[r - 1]?.[c]?.type === type && grid[r - 2]?.[c]?.type === type) return true;
  return false;
}

function findMatches() {
  const matched = new Set();

  for (let r = 0; r < ROWS; r++) {
    let run = 1;
    for (let c = 1; c <= COLS; c++) {
      const cur = c < COLS ? state.grid[r][c] : null;
      const prev = state.grid[r][c - 1];
      if (cur && prev && cur.type === prev.type && !cur.special && !prev.special) {
        run++;
      } else {
        if (run >= 3) {
          for (let i = 0; i < run; i++) matched.add(`${r},${c - 1 - i}`);
        }
        run = 1;
      }
    }
  }

  for (let c = 0; c < COLS; c++) {
    let run = 1;
    for (let r = 1; r <= ROWS; r++) {
      const cur = r < ROWS ? state.grid[r][c] : null;
      const prev = state.grid[r - 1][c];
      if (cur && prev && cur.type === prev.type && !cur.special && !prev.special) {
        run++;
      } else {
        if (run >= 3) {
          for (let i = 0; i < run; i++) matched.add(`${r - 1 - i},${c}`);
        }
        run = 1;
      }
    }
  }

  return matched;
}

function hasAnyMatch() {
  return findMatches().size > 0;
}

function findMatchAt(r, c, type) {
  if (!type) return false;
  const h =
    (c >= 2 && state.grid[r][c - 1].type === type && state.grid[r][c - 2].type === type) ||
    (c >= 1 && c < COLS - 1 && state.grid[r][c - 1].type === type && state.grid[r][c + 1].type === type) ||
    (c < COLS - 2 && state.grid[r][c + 1].type === type && state.grid[r][c + 2].type === type);
  const v =
    (r >= 2 && state.grid[r - 1][c].type === type && state.grid[r - 2][c].type === type) ||
    (r >= 1 && r < ROWS - 1 && state.grid[r - 1][c].type === type && state.grid[r + 1][c].type === type) ||
    (r < ROWS - 2 && state.grid[r + 1][c].type === type && state.grid[r + 2][c].type === type);
  return h || v;
}

function swapWouldMatch(r1, c1, r2, c2) {
  const a = state.grid[r1][c1];
  const b = state.grid[r2][c2];
  state.grid[r1][c1] = b;
  state.grid[r2][c2] = a;
  const ok = findMatchAt(r1, c1, b.type) || findMatchAt(r2, c2, a.type);
  state.grid[r1][c1] = a;
  state.grid[r2][c2] = b;
  return ok;
}

function isAdjacent(r1, c1, r2, c2) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

/* ─── Rendering ─── */

function getCandyInfo(type) {
  return CANDY_TYPES.find((t) => t.id === type) || CANDY_TYPES[0];
}

function renderBoard(animate = false) {
  els.board.innerHTML = '';
  els.board.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = state.grid[r][c];
      if (!cell) {
        const empty = document.createElement('div');
        empty.className = 'cell empty';
        empty.dataset.row = r;
        empty.dataset.col = c;
        els.board.appendChild(empty);
        continue;
      }

      const info = getCandyInfo(cell.type);
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'cell candy';
      el.dataset.row = r;
      el.dataset.col = c;
      el.dataset.type = cell.type;
      el.style.setProperty('--candy-color', info.color);
      el.setAttribute('aria-label', info.name);

      if (cell.special === 'striped-h') el.classList.add('special-striped-h');
      if (cell.special === 'striped-v') el.classList.add('special-striped-v');
      if (cell.special === 'wrapped') el.classList.add('special-wrapped');
      if (cell.special === 'color-bomb') el.classList.add('special-bomb');

      el.innerHTML = `<span class="candy-inner">${cell.special === 'color-bomb' ? '💥' : info.emoji}</span>`;

      if (state.selected?.r === r && state.selected?.c === c) {
        el.classList.add('selected');
      }

      if (animate) el.classList.add('fall-in');

      el.addEventListener('click', () => onCellClick(r, c));
      els.board.appendChild(el);
    }
  }
}

function renderObjectives() {
  const level = LEVELS[state.levelIndex];
  els.objectives.innerHTML = '';

  level.objectives.forEach((obj) => {
    const progress = state.objectives.find((o) => o.key === objKey(obj));
    const el = document.createElement('div');
    el.className = 'objective' + (progress?.done ? ' done' : '');

    if (obj.type === 'score') {
      el.innerHTML = `<span class="obj-icon">⭐</span><span>Skor ${Math.min(state.score, obj.count)}/${obj.count}</span>`;
    } else {
      const info = getCandyInfo(obj.candy);
      const cur = progress?.current ?? 0;
      el.innerHTML = `<span class="obj-icon">${info.emoji}</span><span>${info.name} ${cur}/${obj.count}</span>`;
    }
    els.objectives.appendChild(el);
  });
}

function objKey(obj) {
  return obj.type === 'score' ? 'score' : `collect-${obj.candy}`;
}

function updateHUD() {
  els.hudLevel.textContent = state.levelIndex + 1;
  els.hudMoves.textContent = state.moves;
  els.hudScore.textContent = state.score;
  els.hudMoves.classList.toggle('low', state.moves <= 5);
}

/* ─── Game logic ─── */

function initObjectives() {
  const level = LEVELS[state.levelIndex];
  state.objectives = level.objectives.map((obj) => ({
    key: objKey(obj),
    target: obj,
    current: 0,
    done: false,
  }));
}

function updateObjectives(matchedCells) {
  matchedCells.forEach((key) => {
    const [r, c] = key.split(',').map(Number);
    const type = state.grid[r]?.[c]?.type;
    if (!type) return;

    state.objectives.forEach((obj) => {
      if (obj.done) return;
      if (obj.target.type === 'collect' && obj.target.candy === type) {
        obj.current++;
        if (obj.current >= obj.target.count) obj.done = true;
      }
    });
  });

  state.objectives.forEach((obj) => {
    if (obj.target.type === 'score' && state.score >= obj.target.count) {
      obj.done = true;
    }
  });
}

function allObjectivesDone() {
  return state.objectives.every((o) => o.done);
}

function showCombo(n) {
  if (n < 2) {
    els.comboDisplay.hidden = true;
    return;
  }
  els.comboDisplay.hidden = false;
  els.comboDisplay.textContent = `COMBO x${n}!`;
  els.comboDisplay.classList.remove('pop');
  void els.comboDisplay.offsetWidth;
  els.comboDisplay.classList.add('pop');
}

async function processMatches(isPlayerMove) {
  let totalCombo = 0;

  while (true) {
    const matched = findMatches();
    if (matched.size === 0) break;

    totalCombo++;
    state.combo = totalCombo;
    showCombo(totalCombo);

    const points = matched.size * 10 * totalCombo;
    state.score += points;

    const cells = [...matched];
    updateObjectives(cells);

    cells.forEach((key) => {
      const [r, c] = key.split(',').map(Number);
      const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      cell?.classList.add('matched');
    });

    await delay(280);

    cells.forEach((key) => {
      const [r, c] = key.split(',').map(Number);
      state.grid[r][c] = null;
    });

    applyGravity();
    fillEmpty();
    renderBoard(true);
    updateHUD();
    renderObjectives();

    await delay(320);

    if (allObjectivesDone()) {
      await delay(200);
      onLevelWin();
      return;
    }
  }

  state.combo = 0;
  els.comboDisplay.hidden = true;

  if (isPlayerMove) {
    state.moves--;
    updateHUD();
    if (state.moves <= 0 && !allObjectivesDone()) {
      await delay(300);
      onLevelFail();
      return;
    }
  }

  if (!hasValidMoves()) {
    shuffleBoard();
    renderBoard();
  }
}

function applyGravity() {
  for (let c = 0; c < COLS; c++) {
    let write = ROWS - 1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (state.grid[r][c]) {
        if (write !== r) {
          state.grid[write][c] = state.grid[r][c];
          state.grid[r][c] = null;
        }
        write--;
      }
    }
  }
}

function fillEmpty() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (!state.grid[r][c]) {
        state.grid[r][c] = {
          type: randomCandy(),
          special: null,
          id: `${r}-${c}-${Date.now()}-${Math.random()}`,
        };
      }
    }
  }
}

function hasValidMoves() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c < COLS - 1 && swapWouldMatch(r, c, r, c + 1)) return true;
      if (r < ROWS - 1 && swapWouldMatch(r, c, r + 1, c)) return true;
    }
  }
  return false;
}

function shuffleBoard() {
  const types = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (state.grid[r][c]) types.push(state.grid[r][c].type);
    }
  }
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  let idx = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (state.grid[r][c]) {
        state.grid[r][c].type = types[idx++];
        state.grid[r][c].special = null;
      }
    }
  }
  if (!hasValidMoves() && !hasAnyMatch()) shuffleBoard();
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function onCellClick(r, c) {
  if (state.isAnimating || state.moves <= 0) return;

  if (!state.selected) {
    state.selected = { r, c };
    renderBoard();
    return;
  }

  const { r: r1, c: c1 } = state.selected;

  if (r1 === r && c1 === c) {
    state.selected = null;
    renderBoard();
    return;
  }

  if (!isAdjacent(r1, c1, r, c)) {
    state.selected = { r, c };
    renderBoard();
    return;
  }

  if (!swapWouldMatch(r1, c1, r, c)) {
    const el1 = document.querySelector(`.cell[data-row="${r1}"][data-col="${c1}"]`);
    const el2 = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    el1?.classList.add('invalid');
    el2?.classList.add('invalid');
    await delay(350);
    el1?.classList.remove('invalid');
    el2?.classList.remove('invalid');
    state.selected = null;
    renderBoard();
    return;
  }

  state.isAnimating = true;
  state.selected = null;

  const temp = state.grid[r1][c1];
  state.grid[r1][c1] = state.grid[r][c];
  state.grid[r][c] = temp;
  renderBoard();

  await delay(180);
  await processMatches(true);
  state.isAnimating = false;
}

/* ─── Level flow ─── */

function startLevel(index) {
  state.levelIndex = index;
  const level = LEVELS[index];
  state.score = 0;
  state.moves = level.moves;
  state.selected = null;
  state.isAnimating = false;
  state.grid = createGrid();

  while (hasAnyMatch()) {
    state.grid = createGrid();
  }

  initObjectives();
  els.hudLevel.textContent = index + 1;
  updateHUD();
  renderObjectives();
  renderBoard();
  showScreen('game');
}

function calcStars() {
  const level = LEVELS[state.levelIndex];
  const [s1, s2, s3] = level.stars;
  if (state.score >= s3) return 3;
  if (state.score >= s2) return 2;
  if (state.score >= s1) return 1;
  return 1;
}

function onLevelWin() {
  const stars = calcStars();
  const idx = state.levelIndex;

  if (!state.levelStars[idx] || state.levelStars[idx] < stars) {
    state.levelStars[idx] = stars;
  }
  if (idx >= state.unlockedLevel && idx < LEVELS.length - 1) {
    state.unlockedLevel = idx + 1;
  }
  if (idx === LEVELS.length - 1) {
    state.unlockedLevel = LEVELS.length - 1;
  }
  saveGame();
  updateMenuProgress();

  els.winScore.textContent = state.score;
  els.winStars.innerHTML = [1, 2, 3]
    .map((n) => `<span class="star${n > stars ? ' dim' : ''}">★</span>`)
    .join('');
  els.winTitle.textContent = 'Level Selesai!';
  els.winText.textContent = STORY.chapters[idx]?.text?.slice(0, 80) + '...' || 'Cahaya terkumpul!';
  els.winIcon.textContent = stars >= 3 ? '🌟' : '🎉';
  els.overlayLevel.hidden = false;
}

function onLevelFail() {
  els.overlayFail.hidden = false;
}

function showStory(story, onContinue) {
  els.storyChapter.textContent = story.chapter || 'Cerita';
  els.storyAvatar.textContent = story.avatar || '📖';
  els.storyTitle.textContent = story.title || '';
  els.storyBody.textContent = story.text || '';
  state.storyCallback = onContinue;
  showScreen('story');
}

/* ─── Screens & navigation ─── */

function showScreen(name) {
  Object.values(els.screens).forEach((s) => s.classList.remove('active'));
  els.screens[name]?.classList.add('active');
}

function buildLevelMap() {
  els.levelMap.innerHTML = '';
  LEVELS.forEach((lvl, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    const locked = i > state.unlockedLevel;
    const stars = state.levelStars[i] || 0;
    btn.className = 'level-node' + (locked ? ' locked' : '') + (i === state.levelIndex ? ' current' : '');
    btn.innerHTML = `
      <span class="node-num">${i + 1}</span>
      <span class="node-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>
    `;
    if (!locked) {
      btn.addEventListener('click', () => {
        showStory(STORY.chapters[i] || STORY.intro, () => startLevel(i));
      });
    }
    els.levelMap.appendChild(btn);
  });

  const total = state.levelStars.reduce((a, b) => a + (b || 0), 0);
  els.mapTotalStars.textContent = `${total} ★`;
}

function updateMenuProgress() {
  els.menuLevel.textContent = Math.min(state.unlockedLevel + 1, LEVELS.length);
  const total = state.levelStars.reduce((a, b) => a + (b || 0), 0);
  const max = LEVELS.length * 3;
  els.menuStars.textContent = `${'★'.repeat(Math.min(total, 5))}${'☆'.repeat(Math.max(0, 5 - total))} (${total}/${max})`;
}

function showEnding() {
  const total = state.levelStars.reduce((a, b) => a + (b || 0), 0);
  const max = LEVELS.length * 3;
  const good = total >= max * 0.7;
  const end = good ? STORY.endingGood : STORY.endingOk;
  els.endingIcon.textContent = end.icon;
  els.endingTitle.textContent = end.title;
  els.endingText.textContent = end.text;
  els.overlayEnding.hidden = false;
}

function showStoryRecap() {
  let text = STORY.intro.text + '\n\n';
  STORY.chapters.forEach((ch, i) => {
    if (i <= state.unlockedLevel) {
      text += `${ch.chapter}: ${ch.title}\n${ch.text}\n\n`;
    }
  });
  showStory({
    chapter: 'Arsip Cerita',
    avatar: '📜',
    title: 'Kisah Pulau Senja',
    text,
  }, () => showScreen('menu'));
}

/* ─── Init & events ─── */

function init() {
  loadSave();
  updateMenuProgress();
  buildLevelMap();

  document.getElementById('btn-intro-start').addEventListener('click', () => {
    els.overlayIntro.hidden = true;
    showStory(STORY.intro, () => {
      showScreen('map');
      buildLevelMap();
      showStory(STORY.chapters[0], () => startLevel(0));
    });
  });

  document.getElementById('btn-play').addEventListener('click', () => {
    showScreen('map');
    buildLevelMap();
  });

  document.getElementById('btn-story-recap').addEventListener('click', showStoryRecap);

  document.getElementById('btn-map-back').addEventListener('click', () => showScreen('menu'));

  document.getElementById('btn-story-continue').addEventListener('click', () => {
    const cb = state.storyCallback;
    state.storyCallback = null;
    if (cb) cb();
  });

  document.getElementById('btn-game-back').addEventListener('click', () => {
    showScreen('map');
    buildLevelMap();
  });

  document.getElementById('btn-next-level').addEventListener('click', () => {
    els.overlayLevel.hidden = true;
    const next = state.levelIndex + 1;
    if (next >= LEVELS.length) {
      showEnding();
      return;
    }
    showStory(STORY.chapters[next], () => startLevel(next));
  });

  document.getElementById('btn-retry-level').addEventListener('click', () => {
    els.overlayLevel.hidden = true;
    startLevel(state.levelIndex);
  });

  document.getElementById('btn-retry-fail').addEventListener('click', () => {
    els.overlayFail.hidden = true;
    startLevel(state.levelIndex);
  });

  document.getElementById('btn-quit-fail').addEventListener('click', () => {
    els.overlayFail.hidden = true;
    showScreen('map');
    buildLevelMap();
  });

  document.getElementById('btn-ending-menu').addEventListener('click', () => {
    els.overlayEnding.hidden = true;
    showScreen('menu');
    updateMenuProgress();
  });
}

init();
