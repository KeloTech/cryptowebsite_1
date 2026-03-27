/**
 * Pipes: spawn, move, and collision bounds.
 * Spawn at fixed intervals with random gap position.
 */

import { CONFIG } from './config.js';

const WIDTH = CONFIG.PIPE_WIDTH;
const GAP = CONFIG.PIPE_GAP;
const SPEED = CONFIG.PIPE_SPEED;
const MIN_OFFSET = CONFIG.PIPE_MIN_OFFSET;
const MAX_OFFSET = CONFIG.PIPE_MAX_OFFSET;
const CANVAS_HEIGHT = CONFIG.CANVAS_HEIGHT;
const THEME = CONFIG.THEME;
const PIPE_IMAGE_PATH = CONFIG.PIPE_IMAGE_PATH;
const PIPE_TOP_IMAGE_PATH = CONFIG.PIPE_TOP_IMAGE_PATH;
const PIPE_BOTTOM_IMAGE_PATH = CONFIG.PIPE_BOTTOM_IMAGE_PATH;

export default class Pipes {
  constructor() {
    this.list = [];
    this._spawnTimer = 0;
    this._spawnInterval = CONFIG.PIPE_SPAWN_INTERVAL_MS / 1000;
    this._image = null; // legacy single sprite
    this._topImage = null;
    this._bottomImage = null;
    this._imageLoaded = false;
    this._loadImages();
  }

  _loadImages() {
    const load = (src) =>
      new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    Promise.all([
      load(PIPE_TOP_IMAGE_PATH),
      load(PIPE_BOTTOM_IMAGE_PATH),
      load(PIPE_IMAGE_PATH),
    ]).then(([topImg, bottomImg, legacy]) => {
      this._topImage = topImg;
      this._bottomImage = bottomImg;
      this._image = legacy;
      this._imageLoaded = true;
    });
  }

  reset() {
    this.list.length = 0;
    this._spawnTimer = 0;
  }

  /**
   * Spawn a new pipe pair. Gap center Y is random within bounds.
   */
  spawn(canvasWidth) {
    const gapCenterY = MIN_OFFSET + Math.random() * (MAX_OFFSET - MIN_OFFSET);
    const topHeight = gapCenterY - GAP / 2;
    const bottomY = gapCenterY + GAP / 2;
    const bottomHeight = CANVAS_HEIGHT - bottomY;

    this.list.push({
      x: canvasWidth,
      top: { x: canvasWidth, y: 0, width: WIDTH, height: Math.max(0, topHeight) },
      bottom: { x: canvasWidth, y: bottomY, width: WIDTH, height: Math.max(0, bottomHeight) },
      gapCenterY,
      passed: false,
    });
  }

  update(dt, canvasWidth) {
    let newlySpawned = null;
    this._spawnTimer += dt;
    if (this._spawnTimer >= this._spawnInterval) {
      this._spawnTimer -= this._spawnInterval;
      this.spawn(canvasWidth);
      newlySpawned = this.list[this.list.length - 1];
    }

    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i];
      p.x -= SPEED * dt;
      p.top.x = p.bottom.x = p.x;
      if (p.x + WIDTH < 0) this.list.splice(i, 1);
    }
    return newlySpawned;
  }

  draw(ctx) {
    // Prefer separate top/bottom sprites if available.
    // Very simple rule: draw the image directly into the same rectangles
    // where the old red pipe rectangles were (p.top and p.bottom).
    if (this._imageLoaded && (this._topImage || this._bottomImage || this._image)) {
      const bottomImg = this._bottomImage || this._image || this._topImage;

      for (const p of this.list) {
        // --- Top pipe: use the same sprite as the bottom, but flipped vertically,
        // and placed exactly where the old red top rect was. This guarantees the
        // cap is intact and not cut.
        if (p.top.height > 0 && bottomImg) {
          const cx = p.top.x + p.top.width / 2;
          const cy = p.top.y + p.top.height / 2;
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(1, -1);
          ctx.drawImage(
            bottomImg,
            0,
            0,
            bottomImg.width,
            bottomImg.height,
            -p.top.width / 2,
            -p.top.height / 2,
            p.top.width,
            p.top.height
          );
          ctx.restore();
        }

        // --- Bottom pipe sprite exactly where the old bottom rect was ---
        if (p.bottom.height > 0 && bottomImg) {
          ctx.drawImage(
            bottomImg,
            0,
            0,
            bottomImg.width,
            bottomImg.height,
            p.bottom.x,
            p.bottom.y,
            p.bottom.width,
            p.bottom.height
          );
        }
      }
    } else {
      // Fallback: flat colored pipes.
      ctx.fillStyle = THEME.pipe;
      for (const p of this.list) {
        if (p.top.height > 0) ctx.fillRect(p.top.x, p.top.y, p.top.width, p.top.height);
        if (p.bottom.height > 0) ctx.fillRect(p.bottom.x, p.bottom.y, p.bottom.width, p.bottom.height);
      }
    }
  }

  /**
   * Get pipe pairs that have not yet been marked passed and whose center is behind player X.
   * Used for scoring and coin placement.
   */
  getActivePipes(playerX) {
    return this.list.filter((p) => !p.passed && p.x + WIDTH < playerX);
  }

  getGapCenterForSpawn(pipe) {
    return pipe ? pipe.gapCenterY : null;
  }

  get listForCollision() {
    return this.list;
  }

  get pipeWidth() {
    return WIDTH;
  }

  get pipeSpeed() {
    return SPEED;
  }
}
