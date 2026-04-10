(function () {
  "use strict";

  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  var scoreEl = document.getElementById("score");
  var hudEl   = document.getElementById("hud");
  var overlay = document.getElementById("overlay");
  var finalScoreEl = document.getElementById("final-score");
  var epitaphEl    = document.getElementById("epitaph");
  var restartBtn   = document.getElementById("restart");
  var lbEntryEl    = document.getElementById("lb-entry");
  var lbEntryScoreEl = document.getElementById("lb-entry-score");
  var lbNameInput  = document.getElementById("lb-name-input");
  var lbSubmitBtn  = document.getElementById("lb-submit-btn");
  var lbSkipBtn    = document.getElementById("lb-skip-btn");
  var lbEntryMsg   = document.getElementById("lb-entry-msg");
  var lbList       = document.getElementById("lb-list");
  var lbListFull   = document.getElementById("lb-list-full");
  var lbPanelMsg   = document.getElementById("lb-panel-msg");
  var lbOpenFullBtn = document.getElementById("lb-open-full");
  var lbModalEl    = document.getElementById("lb-modal");
  var lbModalBackdrop = document.getElementById("lb-modal-backdrop");
  var lbModalCloseBtn = document.getElementById("lb-modal-close");

  var W = canvas.width;
  var H = canvas.height;

  var GRAVITY = 1180;
  var MAX_FALL = 520;
  var PLAYER_W = 22;
  var PLAYER_H = 34;
  var PLAYER_X = 118;

  // Canabalt-inspired grayscale palette
  var COL_SKY_TOP = "#3e3e46";
  var COL_SKY_BOT = "#7a7e8c";
  var COL_FAR = "#2e3036";
  var COL_MID = "#3a3c44";
  var COL_BUILD = "#5a5c64";
  var COL_BUILD_DARK = "#46484e";
  var COL_WINDOW_LIT = "#8a96a8";
  var COL_WINDOW_DIM = "#1c1e24";
  var COL_ROOF = "#6e7078";
  var COL_ROOF_LIGHT = "#888c96";
  var COL_PLAYER = "#e8eaf0";
  var COL_TRIP = "#7a6a4a";
  var COL_BOX_BODY  = "#b4b8c0";   // obstacle box — light grey
  var COL_BOX_TOP   = "#d4d8e0";   // obstacle box — top highlight
  var COL_BOX_SHADE = "#787c84";   // obstacle box — shadow sides

  // Window grid dimensions (shared between makeWindows + drawBuilding)
  var WIN_W = 14;
  var WIN_H = 18;
  var WIN_GAP_X = 10;
  var WIN_GAP_Y = 8;
  var WIN_PAD_X = 18;

  // ── Sprite / animation config ──────────────────────────────────────────────
  // Adjust SPRITE_OFFSET_* if your PNGs have transparent padding around the character.
  var SPRITE_OFFSET_X = 0;
  var SPRITE_OFFSET_Y = 0;
  // How fast the run-cycle advances (higher = faster frame flipping).
  // At default run speed the cycle plays at ≈10 fps; it speeds up with the player.
  var RUN_ANIM_SPEED  = 8;
  var RUN_FRAME_COUNT = 4;

  var scrollX = 0;
  var runSpeed = 100;
  var speedMult = 1;
  var stumbleT = 0;
  var buildings = [];
  var particles = [];
  var walkers = [];
  var doves = [];
  var clouds = [];
  var jet = { x: -999, y: 40, vx: 0, cooldown: 3 };
  var shake = { x: 0, y: 0 };
  var score = 0;
  var gameOver = false;
  var lastTs = 0;
  var deathReason = "fall";

  // ── Menu / state machine ───────────────────────────────────────────────────
  // "menu"    → start screen (game not yet started)
  // "playing" → active gameplay
  // "gameover"→ player has died, restart screen shown
  var gameState = "menu";
  var lastScore = 0;    // distance from the most recently completed run
  var lbSubmitting = false;
  /** True after this run's score was saved to the leaderboard (until next death). */
  var runScoreSubmitted = false;

  // Menu button geometry — computed each frame in drawMenu(), read in hit-test
  var menuBtnW = 200, menuBtnH = 50;
  var menuBtnX = (W - menuBtnW) * 0.5;
  var menuBtnY = (H - menuBtnH) * 0.5;
  /** Game over: second button (submit score). Same height as menuBtnH when drawn. */
  var goSubmitBtnX = 0;
  var goSubmitBtnY = 0;
  var goBtnW = 188;
  var goBtnGap = 14;
  var menuHover = false;
  var menuHoverSubmit = false;
  var menuHoverMute = false;

  // ── Audio (assets/*.MP3) ─────────────────────────────────────────────────
  var LS_AUDIO_MUTE = "bluesloth_game_muted";
  var audioMuted =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(LS_AUDIO_MUTE) === "1";

  function audioUrl(name) {
    return "assets/" + encodeURIComponent(name);
  }

  var musicAudio = new Audio(audioUrl("bluesloth game music.MP3"));
  musicAudio.loop = true;
  musicAudio.preload = "auto";
  musicAudio.volume = 0.42;

  var jumpAudio = new Audio(audioUrl("bluesloth game jump audio.MP3"));
  jumpAudio.preload = "auto";
  jumpAudio.volume = 0.88;

  var deathAudio = new Audio(audioUrl("bluesloth game death audio.MP3"));
  deathAudio.preload = "auto";
  deathAudio.volume = 0.9;

  var obstacleAudio = new Audio(audioUrl("bluesloth game obstacle audio.MP3"));
  obstacleAudio.preload = "auto";
  obstacleAudio.volume = 0.86;

  var muteBtnW = 100;
  var muteBtnH = 36;
  var muteBtnX = W - muteBtnW - 14;
  var muteBtnY = 12;

  function syncAudioMute() {
    musicAudio.muted = audioMuted;
    jumpAudio.muted = audioMuted;
    deathAudio.muted = audioMuted;
    obstacleAudio.muted = audioMuted;
  }

  function toggleAudioMute() {
    audioMuted = !audioMuted;
    try {
      localStorage.setItem(LS_AUDIO_MUTE, audioMuted ? "1" : "0");
    } catch (e) {
      /* ignore */
    }
    syncAudioMute();
  }

  syncAudioMute();

  function playJumpSound() {
    if (audioMuted) return;
    try {
      var s = new Audio(jumpAudio.currentSrc || jumpAudio.src);
      s.volume = jumpAudio.volume;
      s.play().catch(function () {});
    } catch (e) {
      /* ignore */
    }
  }

  function playDeathSound() {
    if (audioMuted) return;
    try {
      deathAudio.currentTime = 0;
      deathAudio.play().catch(function () {});
    } catch (e) {
      /* ignore */
    }
  }

  function playObstacleHitSound() {
    if (audioMuted) return;
    try {
      var s = new Audio(obstacleAudio.currentSrc || obstacleAudio.src);
      s.volume = obstacleAudio.volume;
      s.play().catch(function () {});
    } catch (e) {
      /* ignore */
    }
  }

  function startMusic() {
    if (audioMuted) return;
    try {
      musicAudio.currentTime = 0;
      musicAudio.play().catch(function () {});
    } catch (e) {
      /* ignore */
    }
  }

  function stopMusic() {
    try {
      musicAudio.pause();
      musicAudio.currentTime = 0;
    } catch (e) {
      /* ignore */
    }
  }

  function pointInMute(mx, my) {
    return (
      mx >= muteBtnX &&
      mx <= muteBtnX + muteBtnW &&
      my >= muteBtnY &&
      my <= muteBtnY + muteBtnH
    );
  }

  /**
   * Top-right mute toggle; drawn on menu + gameover (not during gameplay).
   */
  function drawMuteButton() {
    muteBtnX = W - muteBtnW - 14;
    muteBtnY = 12;
    ctx.fillStyle = menuHoverMute
      ? "rgba(120,170,220,0.92)"
      : "rgba(0,0,0,0.55)";
    ctx.fillRect(muteBtnX, muteBtnY, muteBtnW, muteBtnH);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(muteBtnX + 0.5, muteBtnY + 0.5, muteBtnW - 1, muteBtnH - 1);
    ctx.fillStyle = "#f0f0f8";
    ctx.font = "bold 9px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      audioMuted ? "UNMUTE" : "MUTE",
      muteBtnX + muteBtnW * 0.5,
      muteBtnY + muteBtnH * 0.5
    );
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  // Jump tuning — variable height system
  var JUMP_INIT_VY    = -300;   // velocity on tap (short jump)
  var JUMP_BOOST_ACC  = 1300;   // extra upward acceleration while held
  var JUMP_HOLD_MAX   = 0.26;   // max seconds of boost

  var player = {
    x: PLAYER_X,
    y: H - 120,
    vy: 0,
    onGround: true,
    jumpT: -1,        // >= 0 while boost phase active
    coyote: 0,
    animRun: 0,
    footTimer: 0,
  };

  var keys = { space: false, x: false, mouse: false };

  function lbEntryOpen() {
    return lbEntryEl && !lbEntryEl.classList.contains("hidden");
  }

  function supabaseHeaders(includeJson) {
    var k = window.SUPABASE_ANON_KEY || "";
    var h = { apikey: k, Authorization: "Bearer " + k };
    if (includeJson) h["Content-Type"] = "application/json";
    return h;
  }

  function supabaseRest(path, init) {
    var base = (window.SUPABASE_URL || "").replace(/\/$/, "");
    if (!base || !window.SUPABASE_ANON_KEY) {
      return Promise.reject(new Error("Missing Supabase config"));
    }
    init = init || {};
    var json = !!(init.body && typeof init.body === "string");
    var h = Object.assign({}, supabaseHeaders(json), init.headers || {});
    return fetch(base + path, Object.assign({}, init, { headers: h }));
  }

  function renderListIntoOl(ol, rows) {
    ol.innerHTML = "";
    if (!rows || rows.length === 0) {
      var empty = document.createElement("li");
      empty.style.listStyle = "none";
      empty.style.marginLeft = "-1em";
      empty.textContent = "No scores yet. Be the first.";
      ol.appendChild(empty);
      return;
    }
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var li = document.createElement("li");
      var nameSpan = document.createElement("span");
      nameSpan.className = "lb-name";
      nameSpan.textContent = row.name;
      var scoreSpan = document.createElement("span");
      scoreSpan.className = "lb-score";
      scoreSpan.textContent = " — " + row.score + " ";
      li.appendChild(nameSpan);
      li.appendChild(scoreSpan);
      li.appendChild(document.createTextNode("m"));
      ol.appendChild(li);
    }
  }

  function renderLeaderboard(rows) {
    var list = rows || [];
    renderListIntoOl(lbList, list.slice(0, 10));
    renderListIntoOl(lbListFull, list);
  }

  function lbModalOpen() {
    return lbModalEl && !lbModalEl.classList.contains("hidden");
  }

  function openLbModal() {
    lbModalEl.classList.remove("hidden");
    lbModalEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLbModal() {
    lbModalEl.classList.add("hidden");
    lbModalEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function fetchLeaderboard() {
    if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
      lbPanelMsg.textContent = "Add URL and key in supabase-config.js";
      lbPanelMsg.classList.remove("hidden");
      return;
    }
    lbPanelMsg.classList.add("hidden");
    supabaseRest("/rest/v1/leaderboard?select=name,score&order=score.desc&limit=100")
      .then(function (r) {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(function (rows) {
        renderLeaderboard(rows);
      })
      .catch(function () {
        lbPanelMsg.textContent = "Could not load leaderboard (table or network).";
        lbPanelMsg.classList.remove("hidden");
      });
  }

  function showLbEntry() {
    if (runScoreSubmitted) return;
    lbEntryEl.classList.remove("hidden");
    lbEntryEl.setAttribute("aria-hidden", "false");
    lbEntryScoreEl.textContent = String(lastScore);
    lbNameInput.value = "";
    lbEntryMsg.textContent = "";
    lbSubmitting = false;
    lbSubmitBtn.disabled = false;
    setTimeout(function () {
      lbNameInput.focus();
    }, 50);
  }

  function hideLbEntry() {
    lbEntryEl.classList.add("hidden");
    lbEntryEl.setAttribute("aria-hidden", "true");
    lbEntryMsg.textContent = "";
  }

  var LB_NAME_MAX = 14;

  function normalizeLbName(s) {
    return String(s || "")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .trim();
  }

  function submitLbScore() {
    if (lbSubmitting || runScoreSubmitted) return;
    var name = normalizeLbName(lbNameInput.value);
    if (!name) {
      lbEntryMsg.textContent = "Enter a name (1–" + LB_NAME_MAX + " characters).";
      return;
    }
    if (name.length > LB_NAME_MAX) {
      lbEntryMsg.textContent = "Name must be at most " + LB_NAME_MAX + " characters.";
      return;
    }
    lbSubmitting = true;
    lbSubmitBtn.disabled = true;
    lbEntryMsg.textContent = "";
    supabaseRest("/rest/v1/leaderboard", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify([{ name: name, score: lastScore }]),
    })
      .then(function (r) {
        if (!r.ok) throw new Error();
        runScoreSubmitted = true;
        hideLbEntry();
        fetchLeaderboard();
      })
      .catch(function () {
        lbEntryMsg.textContent = "Submit failed. Run the SQL setup in Supabase, then retry.";
        lbSubmitting = false;
        lbSubmitBtn.disabled = false;
      });
  }

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }
  function randi(a, b) {
    return (a + Math.random() * (b - a + 1)) | 0;
  }

  function segHash(i, s) {
    var n = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  function addShake(mx, my) {
    shake.x = (Math.random() * 2 - 1) * mx;
    shake.y = (Math.random() * 2 - 1) * my;
  }

  function decayShake(dt) {
    shake.x *= Math.pow(0.001, dt);
    shake.y *= Math.pow(0.001, dt);
    if (Math.abs(shake.x) < 0.05) shake.x = 0;
    if (Math.abs(shake.y) < 0.05) shake.y = 0;
  }

  function pushSmoke(x, y, n, spread) {
    for (var i = 0; i < n; i++) {
      particles.push({
        t: "smoke",
        x: x + rand(-spread, spread),
        y: y + rand(-4, 4),
        vx: rand(-40, -120),
        vy: rand(-90, -20),
        life: rand(0.35, 0.75),
        r: rand(4, 10),
        a: rand(0.25, 0.5),
      });
    }
  }

  function pushShards(x, y, n) {
    for (var i = 0; i < n; i++) {
      particles.push({
        t: "shard",
        x: x,
        y: y,
        vx: rand(-220, 220),
        vy: rand(-280, -80),
        rot: rand(0, 6.28),
        vr: rand(-12, 12),
        life: rand(0.4, 0.9),
        w: randi(2, 5),
        h: randi(2, 5),
      });
    }
  }

  function pushDust(x, y) {
    for (var i = 0; i < 3; i++) {
      particles.push({
        t: "dust",
        x: x + rand(-6, 6),
        y: y,
        vx: rand(-80, -20),
        vy: rand(-40, 10),
        life: rand(0.15, 0.35),
        r: rand(2, 4),
      });
    }
  }

  function makeWindows(bw) {
    var list = [];
    // Grid layout: columns × rows, each window stores (rx, ry) relative to roofY
    var col = WIN_PAD_X;
    while (col + WIN_W < bw - WIN_PAD_X) {
      var row = 14; // first row starts just below roofY
      while (row < 200) {
        if (Math.random() > 0.08) {
          list.push({
            rx: col,
            ry: row,
            lit: Math.random() > 0.44,
            split: Math.random() > 0.4, // whether to show pane dividers
          });
        }
        row += WIN_H + WIN_GAP_Y;
      }
      col += WIN_W + WIN_GAP_X;
    }
    return list;
  }

  function makeRoofDecor(bw) {
    var d = { antennas: [], slope: null, boxes: [], vents: [] };
    if (Math.random() > 0.45) {
      var n = randi(1, 4);
      for (var i = 0; i < n; i++) {
        d.antennas.push({ rx: rand(8, Math.max(8, bw - 24)), h: randi(24, 80) });
      }
    }
    if (Math.random() > 0.5) {
      var indent = randi(2, Math.min(8, (bw / 32) | 0));
      d.slope = { indent: indent * 16, steps: randi(1, 4) };
    } else if (Math.random() > 0.35) {
      var ib = randi(2, 6) * 8;
      d.boxes.push({ rx: ib, rw: bw - ib * 2, rh: randi(8, 28) });
    }
    // AC / vent boxes
    if (Math.random() > 0.4) {
      var vn = randi(1, 3);
      for (var vi = 0; vi < vn; vi++) {
        d.vents.push({ rx: rand(20, bw - 32), rw: randi(16, 32), rh: randi(8, 16) });
      }
    }
    return d;
  }

  function makeObstacles(bw, roofY) {
    var obs = [];
    if (Math.random() > 0.4) {
      var count = randi(0, 3);
      for (var i = 0; i < count; i++) {
        if (Math.random() < 0.72) {
          obs.push({
            rx: rand(bw * 0.15, bw * 0.75),
            w: randi(10, 16),
            h: randi(3, 6),
            trip: true,
            imgIdx: randi(0, 2),  // picks one of the three obstacle sprites
          });
        } else {
          obs.push({
            rx: rand(bw * 0.2, bw * 0.65),
            w: randi(8, 12),
            h: randi(22, 38),
            trip: false,
            imgIdx: randi(0, 2),
          });
        }
      }
    }
    return obs;
  }

  function makeDovesForBuilding(b) {
    if (Math.random() > 0.55) return;
    var n = randi(1, Math.min(8, (b.w / 100) | 0));
    for (var i = 0; i < n; i++) {
      doves.push({
        xWorld: b.xWorld + rand(0, b.w - 8),
        roofY: b.roofY,
        y: b.roofY - 4,
        vy: 0,
        vx: 0,
        phase: rand(0, 6.28),
        scared: false,
      });
    }
  }

  function appendBuilding() {
    var last = buildings[buildings.length - 1];
    var gapMin = 48 + runSpeed * 0.08;
    var gapMax = Math.min(220, 90 + runSpeed * 0.28);
    var gap = rand(gapMin, gapMax);
    if (!last) {
      buildings.push({
        xWorld: -40,
        w: 680,
        roofY: H - 78,
        windows: makeWindows(680),
        decor: makeRoofDecor(680),
        obstacles: [],
        collapsing: false,
        collapseV: 0,
        collapseDelay: 0,
        collapseStarted: false,
        playerWasOn: false,
      });
      return;
    }
    // Wider platforms — longer buildings
    var bw = randi(380, 680);
    var roofY = last.roofY + randi(-36, 36);
    roofY = Math.max(H - 155, Math.min(H - 60, roofY));
    var nx = last.xWorld + last.w + gap;
    var willCollapse = Math.random() < 0.06;
    var b = {
      xWorld: nx,
      w: bw,
      roofY: roofY,
      windows: makeWindows(bw),
      decor: makeRoofDecor(bw),
      obstacles: makeObstacles(bw, roofY),
      collapsing: willCollapse,
      collapseV: willCollapse ? rand(22, 48) : 0,
      // Building only starts collapsing after player steps on it + a short grace period
      collapseDelay: rand(0.9, 1.8),
      collapseStarted: false,
      playerWasOn: false,
    };
    buildings.push(b);
    makeDovesForBuilding(b);
  }

  function ensureBuildings() {
    while (
      buildings.length === 0 ||
      buildings[buildings.length - 1].xWorld +
        buildings[buildings.length - 1].w -
        scrollX <
        W + 900
    ) {
      appendBuilding();
    }
    while (buildings.length > 1 && buildings[0].xWorld + buildings[0].w - scrollX < -500) {
      buildings.shift();
    }
  }

  function initClouds() {
    clouds.length = 0;
    for (var i = 0; i < 14; i++) {
      clouds.push({
        x: rand(-100, W + 100),
        y: rand(14, H * 0.40),
        w: rand(70, 200),
        h: rand(20, 40),
        s: rand(6, 18),
      });
    }
  }

  function initWalkers() {
    walkers.length = 0;
    for (var k = 0; k < 2; k++) {
      walkers.push({
        screenX: rand(-100, W + 200),
        y: rand(22, 52),
        facing: Math.random() > 0.5 ? 1 : -1,
        state: "idle",
        timer: rand(0.5, 2.5),
        walkT: 0,
      });
    }
  }

  function accelerateRunSpeed(dt) {
    var v = runSpeed;
    if (stumbleT > 0) return;
    if (v < 100) v += 50 * dt;
    else if (v < 250) v += 30 * dt;
    else if (v < 400) v += 20 * dt;
    else if (v < 600) v += 10 * dt;
    else v += 4 * dt;
    runSpeed = Math.min(v, 820);
  }

  function jumpPressed() {
    return keys.space || keys.x || keys.mouse;
  }

  function stumble() {
    stumbleT = 0.42;
    speedMult = 0.62;
    addShake(5, 3);
    pushShards(player.x + PLAYER_W * 0.5, player.y + PLAYER_H * 0.5, 10);
  }

  // Harder version for box obstacles — more shards, longer slowdown
  function stumbleHard() {
    stumbleT = 0.72;
    speedMult = 0.38;
    addShake(9, 6);
    pushShards(player.x + PLAYER_W * 0.5, player.y + PLAYER_H * 0.5, 18);
    pushDust(player.x + PLAYER_W * 0.5, player.y + PLAYER_H);
  }

  function setDeath(reason) {
    if (gameOver) return;
    deathReason = reason;
    gameOver    = true;
    gameState   = "gameover";
    lastScore   = Math.floor(scrollX / 10);
    runScoreSubmitted = false;
    stopMusic();
    playDeathSound();
    hudEl.style.display = "none"; // canvas menu takes over, hide the HUD
  }

  function resetGame() {
    scrollX = 0;
    runSpeed = 100;
    speedMult = 1;
    stumbleT = 0;
    buildings.length = 0;
    particles.length = 0;
    doves.length = 0;
    jet = { x: -999, y: 40, vx: 0, cooldown: rand(2, 5) };
    score = 0;
    gameOver = false;
    deathReason = "fall";
    player.x = PLAYER_X;
    player.vy = 0;
    player.jumpT = -1;
    player.onGround = true;
    player.coyote = 0;
    player.footTimer = 0;
    initClouds();
    initWalkers();
    appendBuilding();
    ensureBuildings();
    var first = buildings[0];
    player.y = first.roofY - PLAYER_H;
    scoreEl.textContent = "0m";
    lastTs = 0;
  }

  /**
   * Transition from any menu state into active gameplay.
   * Fully resets game world, then switches state to "playing".
   */
  function startGame() {
    hideLbEntry();
    menuHover = false;
    menuHoverSubmit = false;
    menuHoverMute = false;
    resetGame();          // resets all gameplay variables, builds first platforms
    gameState = "playing";
    hudEl.style.display = ""; // show the in-game score HUD
    canvas.focus();
    startMusic();
  }

  function resolvePlayerOnRoofs(dt) {
    var px = player.x;
    var py = player.y;
    var pw = PLAYER_W;
    var ph = PLAYER_H;
    var feet = py + ph;
    var bestRoof = null;
    var bestY = 1e9;

    for (var i = 0; i < buildings.length; i++) {
      var b = buildings[i];
      var sl = b.xWorld - scrollX;
      var sr = sl + b.w;
      var margin = 3;
      if (px + pw > sl + margin && px < sr - margin) {
        var surf = b.roofY;
        if (feet >= surf - 2 && feet <= surf + 28 && player.vy >= -40) {
          if (surf < bestY) {
            bestY = surf;
            bestRoof = b;
          }
        }
      }
    }

    if (bestRoof) {
      player.y = bestRoof.roofY - ph;
      player.vy = 0;
      player.onGround = true;
      player.coyote = 0.08;
      return true;
    }
    return false;
  }

  function updatePlayer(dt) {
    var wasOn = player.onGround;

    // --- Variable jump system ---
    // On press: launch with minimum jump velocity, begin boost timer
    if (jumpPressed() && (player.onGround || player.coyote > 0) && player.jumpT < 0) {
      player.vy = JUMP_INIT_VY;
      player.jumpT = 0;
      player.onGround = false;
      player.coyote = 0;
      playJumpSound();
    }

    // While held: continuously boost upward (fights gravity → higher arc)
    if (player.jumpT >= 0) {
      if (jumpPressed() && player.jumpT < JUMP_HOLD_MAX) {
        player.jumpT += dt;
        player.vy -= JUMP_BOOST_ACC * dt;
        if (player.vy < -MAX_FALL) player.vy = -MAX_FALL;
      } else {
        player.jumpT = -1;
      }
    }

    player.vy += GRAVITY * dt;
    if (player.vy > 900) player.vy = 900;
    player.y += player.vy * dt;

    if (!resolvePlayerOnRoofs(dt)) {
      player.onGround = false;
      if (wasOn) player.coyote = 0.06;
    }

    if (!player.onGround) player.coyote -= dt;

    player.animRun += dt * runSpeed * 0.045;

    if (player.y + PLAYER_H > H + 28) setDeath("fall");

    if (player.y < -120) {
      player.y = -120;
      player.vy = 0;
    }
  }

  function collideObstacles() {
    var px = player.x;
    var py = player.y;
    for (var bi = 0; bi < buildings.length; bi++) {
      var b = buildings[bi];
      var sl = b.xWorld - scrollX;
      for (var oi = b.obstacles.length - 1; oi >= 0; oi--) {
        var o = b.obstacles[oi];
        var ox = sl + o.rx;
        var oy = b.roofY - o.h;
        if (rectsOverlap(px, py, PLAYER_W, PLAYER_H, ox, oy, o.w, o.h)) {
          playObstacleHitSound();
          if (o.trip) {
            stumble();
            pushDust(ox + o.w * 0.5, b.roofY);
          } else {
            stumbleHard();
            pushDust(ox + o.w * 0.5, b.roofY);
          }
          b.obstacles.splice(oi, 1);
          return;
        }
      }
    }
  }

  function updateBuildings(dt) {
    var sp = runSpeed * speedMult;
    for (var i = 0; i < buildings.length; i++) {
      var b = buildings[i];
      if (b.collapsing) {
        var sl = b.xWorld - scrollX;
        // Check if player is standing on this building
        var playerOnThis = (
          player.x + PLAYER_W > sl + 3 &&
          player.x < sl + b.w - 3 &&
          player.onGround
        );

        if (!b.playerWasOn && playerOnThis) {
          // First time player lands — start the grace timer
          b.playerWasOn = true;
          b.collapseTimer = b.collapseDelay;
        }

        if (b.playerWasOn) {
          if (!b.collapseStarted) {
            b.collapseTimer -= dt;
            if (b.collapseTimer <= 0) {
              b.collapseStarted = true;
            }
          } else {
            // Now actually collapse
            b.roofY += b.collapseV * dt;
            if (Math.random() < 0.35 * dt * 60) {
              pushSmoke(sl + rand(0, b.w), b.roofY, 1, 30);
            }
          }
        }
      }
    }
    scrollX += sp * dt;
    score = scrollX / 10;
    scoreEl.textContent = Math.floor(score) + "m";

    if (stumbleT > 0) {
      stumbleT -= dt;
      if (stumbleT <= 0) speedMult = 1;
    } else {
      accelerateRunSpeed(dt);
    }
  }

  function updateParticles(dt) {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.t === "smoke") {
        p.vx *= 0.985;
        p.vy += 20 * dt;
        p.r += 12 * dt;
        p.a *= 0.97;
      } else if (p.t === "shard") {
        p.vy += GRAVITY * 0.85 * dt;
        p.rot += p.vr * dt;
        p.vr *= 0.99;
      } else if (p.t === "dust") {
        p.vy += 400 * dt;
        p.vx -= 20 * dt;
      }
    }
  }

  function updateWalkers(dt) {
    var par = runSpeed * 0.11;
    for (var i = 0; i < walkers.length; i++) {
      var w = walkers[i];
      w.screenX -= par * dt;
      w.timer -= dt;
      if (w.state === "idle") {
        if (w.timer <= 0) {
          if (Math.random() > 0.45) {
            w.state = "walk";
            w.walkT = rand(1.2, 4);
            w.facing = Math.random() > 0.5 ? 1 : -1;
          } else {
            w.state = "fire";
            w.timer = 0.55;
            pushSmoke(w.screenX + (w.facing > 0 ? 28 : 8), w.y + 38, 8, 8);
          }
        }
      } else if (w.state === "walk") {
        w.screenX += w.facing * 32 * dt;
        w.walkT -= dt;
        if (w.walkT <= 0) {
          w.state = "fire";
          w.timer = 0.5;
          pushSmoke(w.screenX + (w.facing > 0 ? 28 : 8), w.y + 38, 7, 6);
        }
      } else if (w.state === "fire") {
        w.timer -= dt;
        if (w.timer <= 0) {
          w.state = "idle";
          w.timer = rand(0.8, 2.8);
        }
      }
      if (w.screenX < -120) {
        w.screenX = W + rand(40, 320);
        w.y = rand(22, 52);
        w.timer = rand(0, 1.2);
      }
    }
  }

  function updateJet(dt) {
    jet.cooldown -= dt;
    if (jet.cooldown <= 0 && jet.x < -200) {
      jet.x = W + rand(40, 120);
      jet.y = rand(8, 70);
      jet.vx = -rand(1100, 1500);
      jet.cooldown = rand(9, 26);
      addShake(0, 4);
    }
    if (jet.x > -300) {
      jet.x += jet.vx * dt;
    }
  }

  function updateDoves(dt) {
    var px = player.x;
    for (var i = 0; i < doves.length; i++) {
      var d = doves[i];
      var sx = d.xWorld - scrollX;
      d.phase += dt * 14;
      if (!d.scared && Math.abs(sx - px) < 100) {
        d.scared = true;
        d.vy = -rand(80, 160);
        d.vx = rand(-40, 40);
      }
      if (d.scared) {
        d.xWorld += d.vx * dt;
        d.y += d.vy * dt;
        d.vy += 420 * dt;
      }
      if (d.y > H + 40) {
        doves.splice(i, 1);
        i--;
      }
    }
  }

  function updateClouds(dt) {
    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      c.x -= c.s * dt * 0.15;
      if (c.x + c.w < -60) {
        c.x = W + rand(20, 160);
        c.y = rand(14, H * 0.40);
        c.w = rand(70, 200);
        c.h = rand(20, 40);
      }
    }
  }

  // ─── Drawing ──────────────────────────────────────────────────────────────

  // ── Background helpers ────────────────────────────────────────────────────

  /**
   * Draw a tiling parallax layer that loops seamlessly.
   * The image is scaled to canvas height (aspect ratio preserved) and
   * two copies are placed side-by-side so there is never a visible gap.
   * @param {HTMLImageElement} img
   * @param {number} parallaxRate  multiplied by scrollX to get the offset
   */
  function drawLoopingBg(img, parallaxRate) {
    var iw = img.naturalWidth;
    var ih = img.naturalHeight;
    var tileH = H;
    var tileW = ih > 0 ? (iw / ih) * tileH : W;
    var offset = (scrollX * parallaxRate) % tileW;
    ctx.drawImage(img, -offset,          0, tileW, tileH);
    ctx.drawImage(img, -offset + tileW,  0, tileW, tileH);
  }

  // ── Sky (layer 1) — static, never scrolls ─────────────────────────────────

  function drawSky() {
    var img = ASSETS.background.sky;
    if (ASSETS.ready(img)) {
      ctx.drawImage(img, 0, 0, W, H);
    } else {
      // Procedural fallback — gradient sky
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, COL_SKY_TOP);
      g.addColorStop(0.6, COL_SKY_BOT);
      g.addColorStop(1, "#6e727e");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      // Draw each cloud as a cluster of overlapping ellipses for a fluffy look
      var puffs = [
        { ox: 0,           oy: c.h * 0.15, rx: c.w * 0.38, ry: c.h * 0.52 },
        { ox: c.w * 0.28,  oy: -c.h * 0.1, rx: c.w * 0.30, ry: c.h * 0.62 },
        { ox: c.w * 0.55,  oy: c.h * 0.1,  rx: c.w * 0.32, ry: c.h * 0.50 },
        { ox: c.w * 0.78,  oy: c.h * 0.25, rx: c.w * 0.22, ry: c.h * 0.40 },
      ];
      // Bottom shadow layer
      ctx.fillStyle = "rgba(80,84,96,0.13)";
      for (var pi = 0; pi < puffs.length; pi++) {
        var p = puffs[pi];
        ctx.beginPath();
        ctx.ellipse(c.x + p.ox, c.y + p.oy + c.h * 0.35, p.rx, p.ry * 0.35, 0, 0, 6.28);
        ctx.fill();
      }
      // Main cloud body
      ctx.fillStyle = "rgba(185,188,200,0.18)";
      for (var pi2 = 0; pi2 < puffs.length; pi2++) {
        var p2 = puffs[pi2];
        ctx.beginPath();
        ctx.ellipse(c.x + p2.ox, c.y + p2.oy, p2.rx, p2.ry, 0, 0, 6.28);
        ctx.fill();
      }
      // Bright top highlight
      ctx.fillStyle = "rgba(220,222,230,0.12)";
      for (var pi3 = 0; pi3 < puffs.length; pi3++) {
        var p3 = puffs[pi3];
        ctx.beginPath();
        ctx.ellipse(c.x + p3.ox, c.y + p3.oy - p3.ry * 0.25, p3.rx * 0.7, p3.ry * 0.4, 0, 0, 6.28);
        ctx.fill();
      }
    }
  }

  // ── Far layer (layer 3) — slow parallax ──────────────────────────────────

  /** Image-based far layer; falls back to procedural when asset not ready. */
  function drawFarLayer() {
    var img = ASSETS.background.far;
    if (ASSETS.ready(img)) {
      drawLoopingBg(img, 0.12);
    } else {
      drawFarBuildingsFallback();
    }
  }

  function drawFarBuildingsFallback() {
    var off = scrollX * 0.12;
    var seg = 108;
    var i0 = Math.floor(off / seg) - 3;
    var x = -(off % seg) - seg * 3;
    var n = 0;
    while (x < W + seg * 3 && n < 30) {
      var idx = i0 + n;
      var bw = seg - 4 - segHash(idx, 4) * 14;
      var bh = 40 + segHash(idx, 2) * 80;
      ctx.fillStyle = COL_FAR;
      ctx.fillRect(x, H - 128 - bh, bw, bh + 140);
      // Silhouette window slits on far buildings
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      var wy = H - 128 - bh + 10;
      while (wy < H - 128) {
        ctx.fillRect(x + 6, wy, bw - 12, 2);
        wy += 10;
      }
      x += seg;
      n++;
    }
  }

  // ── Mid layer (layer 4) — medium parallax ────────────────────────────────

  /** Image-based mid layer; falls back to procedural when asset not ready. */
  function drawMidLayer() {
    var img = ASSETS.background.mid;
    if (ASSETS.ready(img)) {
      drawLoopingBg(img, 0.32);
    } else {
      drawMidBuildingsFallback();
    }
  }

  function drawMidBuildingsFallback() {
    var off = scrollX * 0.32;
    var seg = 122;
    var i0 = Math.floor(off / seg) - 3;
    var x = -(off % seg) - seg * 3;
    var n = 0;
    while (x < W + seg * 3 && n < 26) {
      var idx = i0 + n;
      var bw = seg - 6 - segHash(idx, 7) * 14;
      var bh = 56 + segHash(idx, 6) * 88;
      ctx.fillStyle = COL_MID;
      ctx.fillRect(x, H - 100 - bh, bw, bh + 108);
      // Add some mid-layer window detail
      if (segHash(idx, 3) > 0.4) {
        ctx.fillStyle = "rgba(100,106,118,0.25)";
        var wy2 = H - 100 - bh + 8;
        var wstep = 12 + (segHash(idx, 5) * 8) | 0;
        while (wy2 < H - 100) {
          ctx.fillRect(x + 8, wy2, bw - 16, 4);
          wy2 += wstep;
        }
      }
      x += seg;
      n++;
    }
  }

  function drawHaze() {
    // Atmospheric haze band where sky meets the city silhouette
    var hazeTop = H * 0.42;
    var hazeBot = H * 0.72;
    var g = ctx.createLinearGradient(0, hazeTop, 0, hazeBot);
    g.addColorStop(0,   "rgba(100,104,116,0)");
    g.addColorStop(0.5, "rgba(88,92,104,0.18)");
    g.addColorStop(1,   "rgba(70,74,84,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, hazeTop, W, hazeBot - hazeTop);
  }

  function drawBuilding(b) {
    var sl = b.xWorld - scrollX;
    if (sl > W + 50 || sl + b.w < -50) return;

    var bodyH = H - b.roofY + 8;
    var collapsing = b.collapsing && b.collapseStarted;
    var bseed = (b.xWorld * 0.0031) | 0;

    // ── Dirt / earth body ────────────────────────────────────────────────────
    ctx.fillStyle = collapsing ? "#6a3c0e" : "#8a5c22";
    ctx.fillRect(sl, b.roofY, b.w, bodyH);

    // Slightly darker inner face
    ctx.fillStyle = collapsing ? "#4e2c0a" : "#6e4416";
    ctx.fillRect(sl + 2, b.roofY + 4, b.w - 4, bodyH - 4);

    // Horizontal soil stripe texture (subtle colour variation every ~18px)
    var soilY = b.roofY + 10;
    var soilIdx = 0;
    var soilCols = ["rgba(100,58,14,0.38)", "rgba(80,44,10,0.30)", "rgba(120,72,20,0.32)"];
    while (soilY < b.roofY + bodyH - 4) {
      ctx.fillStyle = soilCols[soilIdx % 3];
      ctx.fillRect(sl + 2, soilY, b.w - 4, 5);
      soilY += 18 + (soilIdx % 2) * 4;
      soilIdx++;
    }

    // ── Grass top strip ──────────────────────────────────────────────────────
    var gBase  = collapsing ? "#7a6020" : "#4e8c28";
    var gDark  = collapsing ? "#5a4010" : "#387018";
    var gLight = collapsing ? "#9a7c28" : "#68b83a";

    // Root/underside shadow
    ctx.fillStyle = gDark;
    ctx.fillRect(sl - 2, b.roofY - 4, b.w + 4, 6);
    // Main grass slab
    ctx.fillStyle = gBase;
    ctx.fillRect(sl - 2, b.roofY - 12, b.w + 4, 10);
    // Bright highlight at very top
    ctx.fillStyle = gLight;
    ctx.fillRect(sl - 2, b.roofY - 12, b.w + 4, 3);

    // Individual grass blades
    if (!collapsing) {
      ctx.fillStyle = "#78cc42";
      var bladeX = sl + 2;
      while (bladeX < sl + b.w - 2) {
        var bh3 = 3 + ((segHash(bseed + (bladeX | 0), 2) * 4) | 0);
        ctx.fillRect(bladeX, b.roofY - 12 - bh3, 2, bh3);
        bladeX += 3 + ((segHash(bseed + (bladeX | 0), 5) * 4) | 0);
      }
      // Small wildflowers
      var fX = sl + 12;
      while (fX < sl + b.w - 12) {
        var fr = segHash(bseed + (fX | 0), 9);
        if (fr > 0.80) {
          ctx.fillStyle = fr > 0.91 ? "#f0e050" : (fr > 0.85 ? "#f08040" : "#e888c0");
          ctx.fillRect(fX, b.roofY - 15, 3, 3);
        }
        fX += 16;
      }
    }

    // ── Collapse effects ──────────────────────────────────────────────────────
    if (collapsing) {
      ctx.strokeStyle = "rgba(55,32,8,0.5)";
      ctx.lineWidth = 1;
      var cseed = (b.xWorld * 0.001) | 0;
      for (var k = 0; k < 5; k++) {
        var cfx  = segHash(cseed + k, 9)      * b.w;
        var ctx2x = segHash(cseed + k + 11, 9) * b.w;
        ctx.beginPath();
        ctx.moveTo(sl + cfx,  b.roofY);
        ctx.lineTo(sl + ctx2x, b.roofY + bodyH);
        ctx.stroke();
      }
    }

    // Collapse warning pulse
    if (b.collapsing && b.playerWasOn && !b.collapseStarted) {
      var fAlpha = 0.12 + 0.10 * Math.sin(Date.now() * 0.01);
      ctx.fillStyle = "rgba(220,100,30," + fAlpha + ")";
      ctx.fillRect(sl, b.roofY - 12, b.w, 14);
    }

    // ── Obstacles — fully procedural, jungle theme ────────────────────────────
    // Visual size is larger than the gameplay hitbox so obstacles are clearly
    // visible. Collision box (o.w × o.h at roofY) is never modified.
    for (var oi = 0; oi < b.obstacles.length; oi++) {
      var o   = b.obstacles[oi];
      var ocx = sl + o.rx + o.w * 0.5;  // hitbox centre-x

      if (o.trip) {
        // ── Gnarled root / log across the path ──────────────────────────────
        var rW = Math.max(o.w * 2.6, 34);
        var rH = 18;
        var rX = ocx - rW * 0.5;
        var rY = b.roofY - rH;

        // Root shadow on grass
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(rX + 3, rY + rH - 4, rW, 5);
        // Main root body
        ctx.fillStyle = "#5c3810";
        ctx.fillRect(rX, rY + 5, rW, rH - 5);
        // Rounded top bump
        ctx.fillStyle = "#7a5020";
        ctx.fillRect(rX + 2, rY, rW - 4, rH - 2);
        // Top highlight
        ctx.fillStyle = "#9a6e30";
        ctx.fillRect(rX + 2, rY, rW - 4, 3);
        // Bark texture cracks
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(rX + (rW * 0.30) | 0, rY + 3, 2, rH - 7);
        ctx.fillRect(rX + (rW * 0.60) | 0, rY + 5, 1, rH - 9);
        ctx.fillRect(rX + (rW * 0.80) | 0, rY + 2, 2, rH - 6);
        // Moss tint on top
        ctx.fillStyle = "rgba(60,110,20,0.28)";
        ctx.fillRect(rX + 2, rY, rW - 4, 4);

      } else {
        // ── Bamboo stalk ─────────────────────────────────────────────────────
        var bW = Math.max(o.w, 14);
        var bH = Math.max(o.h + 14, 48);
        var bX = ocx - bW * 0.5;
        var bY = b.roofY - bH;

        // Cast shadow
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(bX + bW, bY + 6, 5, bH - 6);
        // Main stalk body
        ctx.fillStyle = "#5a8814";
        ctx.fillRect(bX, bY, bW, bH);
        // Left highlight strip (curved light effect)
        ctx.fillStyle = "#78b020";
        ctx.fillRect(bX, bY, 4, bH);
        ctx.fillStyle = "#90cc2a";
        ctx.fillRect(bX + 1, bY, 2, bH);
        // Right dark edge
        ctx.fillStyle = "#3a5a0a";
        ctx.fillRect(bX + bW - 3, bY, 3, bH);

        // Segment nodes — horizontal rings every ~10px
        var nodeStep = 10;
        for (var ni = nodeStep; ni < bH - 4; ni += nodeStep) {
          // Dark groove
          ctx.fillStyle = "#2e480a";
          ctx.fillRect(bX - 1, bY + ni, bW + 2, 3);
          // Bright node band just above groove
          ctx.fillStyle = "#a0dc38";
          ctx.fillRect(bX, bY + ni - 1, bW, 2);
        }

        // Small leaf sprouting to the right near middle
        var leafY = bY + (bH * 0.35) | 0;
        ctx.fillStyle = "#4a9010";
        ctx.beginPath();
        ctx.moveTo(bX + bW, leafY);
        ctx.lineTo(bX + bW + 16, leafY - 6);
        ctx.lineTo(bX + bW + 14, leafY + 5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#68b820";
        ctx.fillRect(bX + bW, leafY - 1, 10, 2);
      }
    }
  }

  function drawWalker(w) {
    var sx = w.screenX;
    var sy = w.y;
    ctx.fillStyle = "rgba(36,38,46,0.85)";
    ctx.fillRect(sx, sy, 40, 44);
    ctx.fillStyle = "rgba(60,64,76,0.9)";
    ctx.fillRect(sx + 10, sy + 8, 20, 20);
    ctx.fillRect(sx + 8, sy + 28, 8, 14);
    ctx.fillRect(sx + 24, sy + 28, 8, 14);
  }

  function drawJet() {
    if (jet.x < -160 || jet.x > W + 160) return;
    ctx.fillStyle = "rgba(40,44,56,0.9)";
    ctx.fillRect(jet.x, jet.y, 56, 12);
    ctx.beginPath();
    ctx.moveTo(jet.x + 56, jet.y + 6);
    ctx.lineTo(jet.x + 88, jet.y + 3);
    ctx.lineTo(jet.x + 88, jet.y + 9);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(200,210,230,0.12)";
    ctx.fillRect(jet.x - 40, jet.y + 4, 40, 4);
  }

  function drawDove(d) {
    var sx = d.xWorld - scrollX;
    ctx.save();
    ctx.translate(sx, d.y);
    ctx.fillStyle = "#c8c4d8";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-6, 3);
    ctx.lineTo(0, 5);
    ctx.lineTo(8, 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ── Player (layer 6) ──────────────────────────────────────────────────────

  /**
   * Choose the correct sprite and draw it, or fall back to procedural art.
   *
   * State priority:
   *   grounded            → run cycle (run_1..run_4)
   *   airborne, vy < 0    → jump sprite  (ascending)
   *   airborne, vy >= 0   → fall sprite  (descending)
   */
  function drawPlayer() {
    var img;
    if (player.onGround) {
      // Advance through run frames proportional to run speed
      var frameIdx = Math.floor(player.animRun * RUN_ANIM_SPEED) % RUN_FRAME_COUNT;
      img = ASSETS.player.run[frameIdx];
    } else if (player.vy < 0) {
      img = ASSETS.player.jump;
    } else {
      img = ASSETS.player.fall;
    }

    if (ASSETS.ready(img)) {
      // Draw sprite aligned to the top-left of the collision box.
      // Adjust SPRITE_OFFSET_* if the PNG has transparent padding.
      ctx.drawImage(
        img,
        player.x + SPRITE_OFFSET_X,
        player.y + SPRITE_OFFSET_Y,
        PLAYER_W,
        PLAYER_H
      );
    } else {
      drawPlayerFallback();
    }
  }

  /** Procedural player drawing — used when sprite assets are not yet loaded. */
  function drawPlayerFallback() {
    var bob = player.onGround ? Math.sin(player.animRun) * 1.2 : 0;
    var py = player.y + bob;
    ctx.fillStyle = COL_PLAYER;
    ctx.fillRect(player.x, py, PLAYER_W, PLAYER_H);
    ctx.fillStyle = "#1e2028";
    ctx.fillRect(player.x + 14, py + 8, 5, 5);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(player.x, py + PLAYER_H - 2, PLAYER_W, 2);
    ctx.fillStyle = "#1e2028";
    if (!player.onGround) {
      ctx.fillRect(player.x + 4, py + 22, 6, 10);
      ctx.fillRect(player.x + 12, py + 24, 6, 8);
    } else {
      var legPhase = Math.sin(player.animRun);
      var l1 = (legPhase * 5) | 0;
      var l2 = (-legPhase * 5) | 0;
      ctx.fillRect(player.x + 4, py + 24 + l1, 6, 10);
      ctx.fillRect(player.x + 12, py + 24 + l2, 6, 10);
    }
  }

  function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (p.t === "smoke") {
        ctx.fillStyle = "rgba(180,180,190," + p.a + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fill();
      } else if (p.t === "shard") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = "rgba(190,200,220,0.85)";
        ctx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h);
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(160,155,148,0.6)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fill();
      }
    }
  }

  function drawWorld() {
    drawSky();           // 1. sky       — static background (clouds already in image)
    drawFarLayer();      // 2. far       — slow parallax layer
    drawMidLayer();      // 3. mid       — medium parallax layer
    for (var i = 0; i < buildings.length; i++) drawBuilding(buildings[i]); // 4. platforms + obstacles
    for (var k = 0; k < doves.length; k++) drawDove(doves[k]);             // 5. doves
    drawParticles();     // 6. particles
    drawPlayer();        // 7. player
  }

  function draw() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, shake.x, shake.y);
    drawWorld();
    ctx.restore();
  }

  /**
   * Renders the start menu (gameState="menu") or gameover screen (gameState="gameover").
   * Uses menu.png as a full-canvas background, then draws score + button on top.
   */
  function drawMenu() {
    // ── Background ──────────────────────────────────────────────────────────
    var bg = ASSETS.background.menu;
    if (ASSETS.ready(bg)) {
      // "cover" scaling — fills canvas, preserves aspect ratio, may crop edges
      var iw = bg.naturalWidth, ih = bg.naturalHeight;
      var scale = Math.max(W / iw, H / ih);
      var dw = iw * scale, dh = ih * scale;
      ctx.drawImage(bg, (W - dw) * 0.5, (H - dh) * 0.5, dw, dh);
    } else {
      // Fallback while image is loading
      ctx.fillStyle = "#1a1c28";
      ctx.fillRect(0, 0, W, H);
    }

    // ── Recompute button rects each frame (click / hover tests stay in sync) ─
    menuBtnH = 50;
    if (gameState === "menu") {
      menuBtnW = 200;
      menuBtnX = (W - menuBtnW) * 0.5;
      menuBtnY = (H - menuBtnH) * 0.5;
    } else {
      // gameover — panel + RESTART (and SUBMIT until this run is saved)
      goBtnW = 188;
      goBtnGap = 14;
      var panelW = 260;
      var panelH = 115;
      var gap = 10;
      var totalH = panelH + gap + menuBtnH;
      var topY = (H - totalH) * 0.5;
      var panelX = (W - panelW) * 0.5;
      var panelY = topY;
      var btnRowY = topY + panelH + gap;
      menuBtnW = goBtnW;
      menuBtnY = btnRowY;
      if (runScoreSubmitted) {
        menuBtnX = (W - goBtnW) * 0.5;
      } else {
        var totalBtnW = 2 * goBtnW + goBtnGap;
        var btnStartX = (W - totalBtnW) * 0.5;
        menuBtnX = btnStartX;
        goSubmitBtnX = btnStartX + goBtnW + goBtnGap;
        goSubmitBtnY = btnRowY;
      }

      // Dark semi-transparent card
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(panelX, panelY, panelW, panelH);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      ctx.strokeRect(panelX + 0.5, panelY + 0.5, panelW - 1, panelH - 1);

      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      ctx.fillStyle = "#f0f0f8";
      ctx.font = "bold 13px 'Press Start 2P', monospace";
      ctx.fillText("GAME OVER", W * 0.5, panelY + 36);

      ctx.fillStyle = "#f0d040";
      ctx.font = "bold 11px 'Press Start 2P', monospace";
      ctx.fillText(lastScore + " m", W * 0.5, panelY + 62);

      // RESTART
      ctx.fillStyle = menuHover ? "#7ab0e0" : "#5a90c8";
      ctx.fillRect(menuBtnX, menuBtnY, goBtnW, menuBtnH);
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(menuBtnX, menuBtnY, goBtnW, 3);
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(menuBtnX, menuBtnY + menuBtnH - 4, goBtnW, 4);
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'Press Start 2P', monospace";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.fillText("RESTART", menuBtnX + goBtnW * 0.5, menuBtnY + menuBtnH * 0.5);

      // SUBMIT (only until this run is saved)
      if (!runScoreSubmitted) {
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = menuHoverSubmit ? "#8ec0e8" : "#6a9fd4";
        ctx.fillRect(goSubmitBtnX, goSubmitBtnY, goBtnW, menuBtnH);
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fillRect(goSubmitBtnX, goSubmitBtnY, goBtnW, 3);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(goSubmitBtnX, goSubmitBtnY + menuBtnH - 4, goBtnW, 4);
        ctx.fillStyle = "#0d1117";
        ctx.font = "bold 11px 'Press Start 2P', monospace";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText("SUBMIT", goSubmitBtnX + goBtnW * 0.5, goSubmitBtnY + menuBtnH * 0.5);
      }

      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      drawMuteButton();
      return;
    }

    // ── Menu: single PLAY button (centered) ─────────────────────────────────
    menuBtnW = 200;
    menuBtnX = (W - menuBtnW) * 0.5;
    menuBtnY = (H - menuBtnH) * 0.5;

    ctx.fillStyle = menuHover ? "#7ab0e0" : "#5a90c8";
    ctx.fillRect(menuBtnX, menuBtnY, menuBtnW, menuBtnH);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(menuBtnX, menuBtnY, menuBtnW, 3);
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(menuBtnX, menuBtnY + menuBtnH - 4, menuBtnW, 4);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PLAY", W * 0.5, menuBtnY + menuBtnH * 0.5);

    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    drawMuteButton();
  }

  function update(dt) {
    ensureBuildings();
    updateBuildings(dt);
    updatePlayer(dt);
    collideObstacles();
    updateParticles(dt);
    updateWalkers(dt);
    updateJet(dt);
    updateDoves(dt);
    updateClouds(dt);
    decayShake(dt);

    if (player.onGround) {
      player.footTimer += dt * runSpeed * 0.018;
      if (player.footTimer >= 1) {
        player.footTimer = 0;
        pushDust(player.x + 4, player.y + PLAYER_H);
      }
    } else player.footTimer = 0;
  }

  function frame(ts) {
    if (!lastTs) lastTs = ts;
    var dt = Math.min((ts - lastTs) / 1000, 0.055);
    lastTs = ts;

    if (gameState === "playing") {
      update(dt);
      draw();
    } else {
      // "menu" or "gameover" — show canvas menu, pause all gameplay
      drawMenu();
    }
    requestAnimationFrame(frame);
  }

  function onKeyDown(e) {
    if (e.code === "Escape" && lbModalOpen()) {
      e.preventDefault();
      closeLbModal();
      return;
    }
    if (e.code === "Space") {
      e.preventDefault();
      if (gameState !== "playing") {
        if (lbModalOpen()) return;
        if (lbEntryOpen()) return;
        startGame();
        return;
      }
      keys.space = true;
    }
    if (e.code === "KeyX") {
      if (gameState !== "playing") {
        if (lbModalOpen()) return;
        if (lbEntryOpen()) return;
        startGame();
        return;
      }
      keys.x = true;
    }
  }

  function onKeyUp(e) {
    if (e.code === "Space") keys.space = false;
    if (e.code === "KeyX") keys.x = false;
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  canvas.addEventListener("pointerdown", function (e) {
    if (gameState !== "playing") {
      if (lbEntryOpen()) return;
      var rect = canvas.getBoundingClientRect();
      var mx = (e.clientX - rect.left) * (W / rect.width);
      var my = (e.clientY - rect.top) * (H / rect.height);
      if (pointInMute(mx, my)) {
        toggleAudioMute();
        return;
      }
      if (gameState === "gameover") {
        if (mx >= menuBtnX && mx <= menuBtnX + goBtnW &&
            my >= menuBtnY && my <= menuBtnY + menuBtnH) {
          startGame();
          return;
        }
        if (!runScoreSubmitted &&
            mx >= goSubmitBtnX && mx <= goSubmitBtnX + goBtnW &&
            my >= goSubmitBtnY && my <= goSubmitBtnY + menuBtnH) {
          showLbEntry();
          return;
        }
        return;
      }
      if (mx >= menuBtnX && mx <= menuBtnX + menuBtnW &&
          my >= menuBtnY && my <= menuBtnY + menuBtnH) {
        startGame();
      }
      return;
    }
    keys.mouse = true;
    canvas.focus();
  });
  canvas.addEventListener("pointermove", function (e) {
    if (gameState === "playing") return;
    var rect = canvas.getBoundingClientRect();
    var mx = (e.clientX - rect.left) * (W / rect.width);
    var my = (e.clientY - rect.top) * (H / rect.height);
    menuHoverMute = pointInMute(mx, my);
    if (gameState === "gameover") {
      menuHover =
        mx >= menuBtnX && mx <= menuBtnX + goBtnW &&
        my >= menuBtnY && my <= menuBtnY + menuBtnH;
      menuHoverSubmit =
        !runScoreSubmitted &&
        mx >= goSubmitBtnX && mx <= goSubmitBtnX + goBtnW &&
        my >= goSubmitBtnY && my <= goSubmitBtnY + menuBtnH;
    } else {
      menuHover =
        mx >= menuBtnX && mx <= menuBtnX + menuBtnW &&
        my >= menuBtnY && my <= menuBtnY + menuBtnH;
      menuHoverSubmit = false;
    }
  });
  canvas.addEventListener("pointerup", function () {
    keys.mouse = false;
  });
  canvas.addEventListener("pointerleave", function () {
    keys.mouse = false;
    menuHover = false;
    menuHoverSubmit = false;
    menuHoverMute = false;
  });

  restartBtn.addEventListener("click", function () {
    startGame();
  });

  lbSubmitBtn.addEventListener("click", function () {
    submitLbScore();
  });
  lbSkipBtn.addEventListener("click", function () {
    hideLbEntry();
  });
  lbNameInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {
      e.preventDefault();
      submitLbScore();
    }
  });

  lbOpenFullBtn.addEventListener("click", function () {
    openLbModal();
  });
  lbModalCloseBtn.addEventListener("click", function () {
    closeLbModal();
  });
  lbModalBackdrop.addEventListener("click", function () {
    closeLbModal();
  });

  // Start in menu state — resetGame() will be called when the player clicks Play.
  // Hide the HUD until gameplay begins.
  hudEl.style.display = "none";
  fetchLeaderboard();
  requestAnimationFrame(frame);
})();
