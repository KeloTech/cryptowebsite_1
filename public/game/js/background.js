/**
 * Background rendering:
 * - Top image: static (does not move)
 * - Bottom image: scrolls horizontally in a loop to fake player movement
 * Both images together cover the whole canvas area.
 */

import { CONFIG } from './config.js';

const CANVAS_WIDTH = CONFIG.CANVAS_WIDTH;
const CANVAS_HEIGHT = CONFIG.CANVAS_HEIGHT;

export default class Background {
  constructor() {
    this.topImage = null;
    this.bottomImage = null;
    this.topHeight = 0; // source heights
    this.bottomHeight = 0;

    // Computed destination heights so that top+bottom exactly fill canvas.
    this.destTopHeight = 0;
    this.destBottomHeight = 0;

    this.bottomOffsetX = 0;
    this._loaded = false;
  }

  async load() {
    const loadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    const [top, bottom] = await Promise.all([
      loadImage(CONFIG.BG_TOP_IMAGE_PATH),
      loadImage(CONFIG.BG_BOTTOM_IMAGE_PATH),
    ]);

    this.topImage = top;
    this.bottomImage = bottom;

    if (this.topImage) this.topHeight = this.topImage.height;
    if (this.bottomImage) this.bottomHeight = this.bottomImage.height;

    // Let the original art decide the split, so nothing is over‑stretched.
    const totalSourceHeight = this.topHeight + this.bottomHeight;
    if (totalSourceHeight > 0) {
      const topRatio = this.topHeight / totalSourceHeight;
      this.destTopHeight = CANVAS_HEIGHT * topRatio;
      this.destBottomHeight = CANVAS_HEIGHT - this.destTopHeight;
    } else {
      this.destTopHeight = CANVAS_HEIGHT * 0.7;
      this.destBottomHeight = CANVAS_HEIGHT - this.destTopHeight;
    }

    // Approximate ground line inside the bottom image for collision.
    const rel = CONFIG.BG_GROUND_RELATIVE_Y_IN_BOTTOM;
    this.groundY =
      this.destTopHeight +
      this.destBottomHeight * Math.min(1, Math.max(0, rel));

    this._loaded = !!(this.topImage || this.bottomImage);
  }

  /**
   * Update horizontal offset of bottom layer.
   * scrollSpeed should be positive; we move the texture to the left.
   */
  update(dt, scrollSpeed) {
    if (!this.bottomImage || !this._loaded || !scrollSpeed) return;
    this.bottomOffsetX -= scrollSpeed * dt;
    const w = CANVAS_WIDTH; // we draw bottom stretched to canvas width
    if (w > 0) {
      // Keep offset in [-w, 0)
      this.bottomOffsetX %= w;
      if (this.bottomOffsetX < -w) this.bottomOffsetX += w;
      if (this.bottomOffsetX > 0) this.bottomOffsetX -= w;
    }
  }

  draw(ctx) {
    // Always clear with flat color first as a fallback / base.
    ctx.fillStyle = CONFIG.THEME.background;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (!this._loaded) {
      return;
    }

    // Draw static top.
    let currentY = 0;
    if (this.topImage) {
      ctx.drawImage(
        this.topImage,
        0,
        0,
        this.topImage.width,
        this.topImage.height,
        0,
        0,
        CANVAS_WIDTH,
        this.destTopHeight
      );
      currentY = this.destTopHeight;
    }

    // Draw scrolling bottom starting where the top ends.
    if (this.bottomImage) {
      const img = this.bottomImage;
      const w = CANVAS_WIDTH;
      if (w <= 0) {
        // Fallback: simple flat strip if something is wrong with the image.
        ctx.fillStyle = CONFIG.THEME.ground;
        ctx.fillRect(0, currentY, CANVAS_WIDTH, CANVAS_HEIGHT - currentY);
        return;
      }

      // Start drawing from offset so it loops seamlessly.
      let x = this.bottomOffsetX;
      if (x > 0) x -= w;
      while (x < CANVAS_WIDTH) {
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          x,
          currentY,
          w,
          this.destBottomHeight
        );
        x += w;
      }

      // Ensure any tiny gap due to rounding is filled.
      const coveredHeight = currentY + this.destBottomHeight;
      if (coveredHeight < CANVAS_HEIGHT) {
        ctx.fillStyle = CONFIG.THEME.ground;
        ctx.fillRect(0, coveredHeight, CANVAS_WIDTH, CANVAS_HEIGHT - coveredHeight);
      }
    }
  }

  /**
   * Y coordinate where the solid ground starts.
   * Used so the player dies when touching the bottom background.
   */
  getGroundY() {
    return this.groundY ?? CANVAS_HEIGHT;
  }

  /**
   * Draw only the bottom background band (from ground downwards) on top
   * of everything else. This lets the ground visually cover pipe bottoms.
   */
  drawGroundOverlay(ctx) {
    if (!this._loaded || !this.bottomImage) return;
    const groundY = this.getGroundY();
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, groundY, CANVAS_WIDTH, CANVAS_HEIGHT - groundY);
    ctx.clip();

    // Re-draw the bottom layer exactly as in draw(), but clipped so only
    // the region above is visible and thus covers pipe bottoms.
    const currentY = this.destTopHeight;
    const img = this.bottomImage;
    const w = CANVAS_WIDTH;

    let x = this.bottomOffsetX;
    if (x > 0) x -= w;
    while (x < CANVAS_WIDTH) {
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x,
        currentY,
        w,
        this.destBottomHeight
      );
      x += w;
    }

    const coveredHeight = currentY + this.destBottomHeight;
    if (coveredHeight < CANVAS_HEIGHT) {
      ctx.fillStyle = CONFIG.THEME.ground;
      ctx.fillRect(0, coveredHeight, CANVAS_WIDTH, CANVAS_HEIGHT - coveredHeight);
    }

    ctx.restore();
  }
}

