/**
 * Game core: loop, states, input, collision, scoring.
 * Uses requestAnimationFrame and deltaTime for 60 FPS.
 */

import { CONFIG } from './config.js';
import { circleRectCollision, circleCircleCollision } from './collision.js';
import { drawScore, drawStartScreen, drawGameOverScreen } from './ui.js';
import Player from './player.js';
import Pipes from './pipes.js';
import Coins from './coins.js';
import Background from './background.js';
import leaderboardService from './LeaderboardService.js';

const STATES = CONFIG.GAME_STATES;
const CANVAS_WIDTH = CONFIG.CANVAS_WIDTH;
const CANVAS_HEIGHT = CONFIG.CANVAS_HEIGHT;
const GRAVITY = CONFIG.GRAVITY;
const JUMP_IMPULSE = CONFIG.JUMP_IMPULSE;
const TERMINAL_VELOCITY = CONFIG.TERMINAL_VELOCITY;
const PIPE_WIDTH = CONFIG.PIPE_WIDTH;
const HIGH_SCORE_KEY = CONFIG.LOCAL_STORAGE_HIGH_SCORE_KEY;

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.player = new Player();
    this.pipes = new Pipes();
    this.coins = new Coins();
    this.background = new Background();

    this.state = STATES.START;
    this.score = 0;
    this.highScore = this._loadHighScore();
    this._lastTime = 0;
    this._rafId = null;

    this._boundLoop = this._loop.bind(this);
    this._boundClick = this._onClick.bind(this);
    this._boundKeyDown = this._onKeyDown.bind(this);
  }

  _loadHighScore() {
    try {
      const v = localStorage.getItem(HIGH_SCORE_KEY);
      return v ? Math.max(0, parseInt(v, 10)) : 0;
    } catch {
      return 0;
    }
  }

  _saveHighScore() {
    try {
      localStorage.setItem(HIGH_SCORE_KEY, String(this.highScore));
    } catch (_) {}
  }

  async init() {
    // Load player and background assets before starting.
    await Promise.all([this.player.load(), this.background.load()]);
    this._attachInput();
    this._startPlayerPosition();
  }

  _startPlayerPosition() {
    const x = CANVAS_WIDTH * 0.3;
    const y = CANVAS_HEIGHT / 2;
    this.player.reset(x, y);
  }

  _attachInput() {
    this.canvas.addEventListener('click', this._boundClick);
    window.addEventListener('keydown', this._boundKeyDown);
  }

  _detachInput() {
    this.canvas.removeEventListener('click', this._boundClick);
    window.removeEventListener('keydown', this._boundKeyDown);
  }

  _onClick() {
    if (this.state === STATES.START) {
      this.state = STATES.PLAYING;
      return;
    }
    if (this.state === STATES.PLAYING) {
      this.player.jump(JUMP_IMPULSE);
      return;
    }
    if (this.state === STATES.GAMEOVER) {
      this._restart();
    }
  }

  _onKeyDown(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      this._onClick();
    }
  }

  _restart() {
    this.state = STATES.PLAYING;
    this.score = 0;
    this.pipes.reset();
    this.coins.reset();
    this._startPlayerPosition();
  }

  start() {
    this._lastTime = performance.now();
    this._loop(this._lastTime);
  }

  _loop(now) {
    this._rafId = requestAnimationFrame(this._boundLoop);
    const dt = Math.min((now - this._lastTime) / 1000, 0.1);
    this._lastTime = now;

    this._update(dt);
    this._draw(dt);
  }

  _update(dt) {
    // Update scrolling background even on start screen so it feels alive,
    // but only scroll when playing.
    const bgSpeed = this.state === STATES.PLAYING ? this.pipes.pipeSpeed : 0;
    this.background.update(dt, bgSpeed);

    if (this.state === STATES.START) return;

    if (this.state === STATES.PLAYING) {
      this.player.applyGravity(dt, GRAVITY, TERMINAL_VELOCITY);

      const newPipe = this.pipes.update(dt, CANVAS_WIDTH);
      if (newPipe) {
        const coinX = newPipe.x + PIPE_WIDTH / 2;
        this.coins.add(coinX, newPipe.gapCenterY);
      }
      this.coins.update(dt, this.pipes.pipeSpeed);

      // Score: pipe passed
      for (const p of this.pipes.listForCollision) {
        if (!p.passed && p.x + PIPE_WIDTH < this.player.x) {
          p.passed = true;
          this.score += 1;
        }
      }

      // Coins: circle vs circle, add score and mark collected
      const pr = this.player.getHitRadius();
      for (const c of this.coins.getActiveCoins()) {
        if (circleCircleCollision(this.player.x, this.player.y, pr, c.x, c.y, c.radius)) {
          c.collected = true;
          this.score += 1;
        }
      }

      // Collision: player vs pipes (circle vs rect)
      for (const p of this.pipes.listForCollision) {
        if (p.top.height > 0 && circleRectCollision(this.player.x, this.player.y, pr, p.top)) {
          this._gameOver();
          return;
        }
        if (p.bottom.height > 0 && circleRectCollision(this.player.x, this.player.y, pr, p.bottom)) {
          this._gameOver();
          return;
        }
      }

      // Boundaries: top of screen and bottom background (ground)
      const groundY = this.background.getGroundY();
      if (this.player.y - pr < 0 || this.player.y + pr > groundY) {
        this._gameOver();
      }
    }
  }

  _gameOver() {
    this.state = STATES.GAMEOVER;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this._saveHighScore();
    }
    leaderboardService.submitScore(this.score);
  }

  _draw(dt) {
    const ctx = this.ctx;
    // Background handles clearing and drawing both layers.
    this.background.draw(ctx);

    if (this.state === STATES.START) {
      this.player.draw(ctx, dt);
      drawScore(ctx, 0, this.highScore);
      drawStartScreen(ctx);
      return;
    }

    this.pipes.draw(ctx);
    // Ground overlay should sit above pipe bottoms.
    this.background.drawGroundOverlay(ctx);
    this.coins.draw(ctx);
    this.player.draw(ctx, dt);
    drawScore(ctx, this.score, this.highScore);

    if (this.state === STATES.GAMEOVER) {
      drawGameOverScreen(ctx, this.score, this.highScore);
    }
  }

  stop() {
    if (this._rafId != null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    this._detachInput();
  }
}
