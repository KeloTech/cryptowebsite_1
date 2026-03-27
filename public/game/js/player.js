/**
 * Player module: rendering and state.
 * Renders from image file(s); fallback to circle. Supports optional frame array and scaling.
 */

import { CONFIG } from './config.js';

const THEME = CONFIG.THEME;
const RADIUS = CONFIG.PLAYER_RADIUS;
const IMAGE_PATH = CONFIG.PLAYER_IMAGE_PATH;
const FRAMES = CONFIG.PLAYER_ANIMATION_FRAMES;
const FRAME_DURATION = CONFIG.PLAYER_ANIMATION_FRAME_DURATION_MS;

export default class Player {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.vy = 0;
    this.radius = RADIUS;
    this.scale = 1;
    this.rotation = 0; // radians
    // Collision hitbox factor so the sprite feels fair (slightly smaller than visuals).
    this._hitRadiusFactor = 0.7;
    this._image = null;
    this._frames = [];
    this._frameIndex = 0;
    this._frameTime = 0;
    this._useFallback = false;
    this._loadPromise = null;
  }

  /**
   * Load player image(s). Call once before first use.
   * Uses CONFIG.PLAYER_IMAGE_PATH or CONFIG.PLAYER_ANIMATION_FRAMES.
   */
  load() {
    if (this._loadPromise) return this._loadPromise;
    const sources = FRAMES.length > 0 ? FRAMES : [IMAGE_PATH];
    this._loadPromise = this._loadImages(sources);
    return this._loadPromise;
  }

  async _loadImages(sources) {
    const loadOne = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const results = await Promise.all(sources.map(loadOne));
    const loaded = results.filter(Boolean);
    if (loaded.length > 0) {
      this._image = loaded[0];
      this._frames = loaded;
      this._useFallback = false;
    } else {
      this._useFallback = true;
    }
  }

  /** Replace current image set (e.g. new single path or array of frames). */
  setImageSource(pathOrPaths) {
    const arr = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    this._loadPromise = null;
    this._loadPromise = this._loadImages(arr);
    return this._loadPromise;
  }

  setScale(scale) {
    this.scale = scale;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.rotation = 0;
    this._frameIndex = 0;
    this._frameTime = 0;
  }

  applyGravity(dt, gravity, terminalVelocity) {
    this.vy += gravity * dt;
    if (this.vy > terminalVelocity) this.vy = terminalVelocity;
    this.y += this.vy * dt;

    // Smooth rotation based on vertical velocity:
    // strong jump -> tilt up, fast fall -> tilt down.
    const MAX_UP = -0.7; // radians (slightly nose-up)
    const MAX_DOWN = Math.PI / 2; // straight down
    const minVy = -450; // approximate strong jump speed
    const maxVy = terminalVelocity;
    let t = (this.vy - minVy) / (maxVy - minVy);
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    const targetRotation = MAX_UP + t * (MAX_DOWN - MAX_UP);
    const ROTATION_LERP_SPEED = 8; // higher = snappier
    this.rotation += (targetRotation - this.rotation) * ROTATION_LERP_SPEED * dt;
  }

  jump(impulse) {
    this.vy = impulse;
    // Give an immediate upward tilt feedback.
    this.rotation = -0.9;
  }

  getBounds() {
    const r = this.radius * this.scale;
    return { x: this.x - r, y: this.y - r, width: r * 2, height: r * 2 };
  }

  /**
   * Radius used for circular collision tests.
   * Slightly smaller than the drawn sprite so it matches the new player.png better.
   */
  getHitRadius() {
    return this.radius * this.scale * this._hitRadiusFactor;
  }

  draw(ctx, dt) {
    const r = this.radius * this.scale;

    if (this._useFallback || !this._image) {
      ctx.fillStyle = THEME.player;
      ctx.beginPath();
      ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // Animation: advance frame by time
    if (this._frames.length > 1) {
      this._frameTime += dt * 1000;
      if (this._frameTime >= FRAME_DURATION) {
        this._frameTime -= FRAME_DURATION;
        this._frameIndex = (this._frameIndex + 1) % this._frames.length;
      }
    }
    const img = this._frames[this._frameIndex] || this._image;
    const size = r * 2;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(img, -r, -r, size, size);
    ctx.restore();
  }
}
