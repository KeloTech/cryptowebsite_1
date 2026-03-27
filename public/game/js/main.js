/**
 * Entry point: init game and start loop.
 * Run by opening index.html (no build step).
 */

import Game from './game.js';

const canvas = document.getElementById('gameCanvas');
if (!canvas || !canvas.getContext) {
  console.error('Canvas not found or not supported');
} else {
  const game = new Game(canvas);
  game.init().then(() => {
    game.start();
  });
}
