/**
 * Coins: spawn in pipe gaps, rotate, collect on collision.
 * Renders from image with fallback to flat circle.
 */

import { CONFIG } from './config.js';

const RADIUS = CONFIG.COIN_RADIUS;
const IMAGE_PATH = CONFIG.COIN_IMAGE_PATH;
const ROTATION_SPEED = CONFIG.COIN_ROTATION_SPEED;
const THEME = CONFIG.THEME;

export default class Coins {
  constructor() {
    this.list = [];
    this._image = null;
    this._loaded = false;
    this._loadImage();
  }

  _loadImage() {
    const img = new Image();
    img.onload = () => {
      this._image = img;
      this._loaded = true;
    };
    img.onerror = () => {
      this._loaded = true;
    };
    img.src = IMAGE_PATH;
  }

  reset() {
    this.list.length = 0;
  }

  /**
   * Add a coin at (x, gapCenterY).
   */
  add(x, gapCenterY) {
    this.list.push({
      x,
      y: gapCenterY,
      radius: RADIUS,
      angle: 0,
      collected: false,
    });
  }

  update(dt, pipeSpeed) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const c = this.list[i];
      if (c.collected) {
        this.list.splice(i, 1);
        continue;
      }
      c.x -= pipeSpeed * dt;
      c.angle += ROTATION_SPEED * dt;
      if (c.x + c.radius < 0) this.list.splice(i, 1);
    }
  }

  draw(ctx) {
    for (const c of this.list) {
      if (c.collected) continue;
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(c.angle);
      if (this._image && this._loaded) {
        ctx.drawImage(this._image, -c.radius, -c.radius, c.radius * 2, c.radius * 2);
      } else {
        ctx.fillStyle = THEME.coin;
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  getActiveCoins() {
    return this.list.filter((c) => !c.collected);
  }
}
