/**
 * Single source of constants and theme colors.
 * Change theme by editing the THEME object.
 */
export const CONFIG = {
  // --- Theme (change colors here) ---
  THEME: {
    background: '#16213e',
    ground: '#0f3460',
    pipe: '#e94560',
    pipeGap: '#16213e',
    coin: '#ffc107',
    player: '#00d9ff',
    text: '#eaeaea',
    textShadow: '#1a1a2e',
  },

  // --- Canvas ---
  // Logical game resolution; rendering scales via CSS for phones.
  CANVAS_WIDTH: 400,
  CANVAS_HEIGHT: 700,

  // --- Physics ---
  GRAVITY: 1200,
  JUMP_IMPULSE: -420,
  TERMINAL_VELOCITY: 520,

  // --- Player ---
  PLAYER_RADIUS: 18,
  PLAYER_IMAGE_PATH: 'assets/player.png',
  PLAYER_ANIMATION_FRAMES: [], // Optional: ['assets/player1.png', 'assets/player2.png', ...]
  PLAYER_ANIMATION_FRAME_DURATION_MS: 120,

  // --- Pipes ---
  PIPE_WIDTH: 70,
  PIPE_GAP: 160,
  PIPE_SPEED: 180,
  PIPE_SPAWN_INTERVAL_MS: 2200,
  PIPE_MIN_OFFSET: 60,
  PIPE_MAX_OFFSET: 500,
  // Pipe art (separate top and bottom pieces, no stretching needed)
  PIPE_IMAGE_PATH: 'assets/Pipe.png', // legacy single image (not used if the two below exist)
  PIPE_TOP_IMAGE_PATH: 'assets/Pipe_top_transparent.png',
  PIPE_BOTTOM_IMAGE_PATH: 'assets/Pipe_bottom_transparent.png',

  // --- Coins ---
  COIN_RADIUS: 16,
  COIN_IMAGE_PATH: 'assets/coin.png',
  COIN_ROTATION_SPEED: 4,

  // --- Background ---
  BG_TOP_IMAGE_PATH: 'assets/bg_top.png', // static top
  BG_BOTTOM_IMAGE_PATH: 'assets/bg_bottom.png', // scrolling bottom
  // 0..1 inside bottom image where solid ground starts (tweak if player looks too low/high)
  BG_GROUND_RELATIVE_Y_IN_BOTTOM: 0,

  // --- Game ---
  GAME_STATES: Object.freeze({ START: 'start', PLAYING: 'playing', GAMEOVER: 'gameover' }),
  LOCAL_STORAGE_HIGH_SCORE_KEY: 'flappy_high_score',
};
