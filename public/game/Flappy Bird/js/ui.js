/**
 * UI: score display, start screen, game over screen.
 * Draws only; no game state.
 */

import { CONFIG } from './config.js';

const THEME = CONFIG.THEME;
const CANVAS_WIDTH = CONFIG.CANVAS_WIDTH;

export function drawScore(ctx, score, highScore) {
  const y = 48;
  ctx.fillStyle = THEME.text;
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(String(score), CANVAS_WIDTH / 2, y);
  if (highScore > 0) {
    ctx.font = '14px sans-serif';
    ctx.fillStyle = THEME.textShadow;
    ctx.fillText(`Best: ${highScore}`, CANVAS_WIDTH / 2, y + 22);
  }
}

export function drawStartScreen(ctx) {
  ctx.fillStyle = THEME.text;
  ctx.font = '32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Flappy Bird', CANVAS_WIDTH / 2, 220);
  ctx.font = '18px sans-serif';
  ctx.fillStyle = THEME.textShadow;
  ctx.fillText('Click or Press Space to Start', CANVAS_WIDTH / 2, 280);
}

export function drawGameOverScreen(ctx, score, highScore) {
  ctx.fillStyle = THEME.text;
  ctx.font = '36px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', CANVAS_WIDTH / 2, 200);
  ctx.font = '22px sans-serif';
  ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, 260);
  ctx.fillText(`Best: ${highScore}`, CANVAS_WIDTH / 2, 300);
  ctx.font = '16px sans-serif';
  ctx.fillStyle = THEME.textShadow;
  ctx.fillText('Click to Restart', CANVAS_WIDTH / 2, 360);
}
