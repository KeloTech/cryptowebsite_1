/**
 * assets.js — Centralised image asset configuration and preloader.
 *
 * Expected folder structure:
 *   assets/
 *     sky.png                   static sky background (full canvas, no scroll)
 *     far.png                   slow parallax city layer
 *     mid.png                   medium parallax city layer
 *     player/
 *       run_1.png               run cycle frame 1
 *       run_2.png               run cycle frame 2
 *       run_3.png               run cycle frame 3
 *       run_4.png               run cycle frame 4
 *       jump.png                ascending / jump state
 *       fall.png                descending / fall state
 *     obstacles/
 *       obstacle_1.png
 *       obstacle_2.png
 *       obstacle_3.png
 *
 * Usage in game code:
 *   ASSETS.background.sky       Image element — static sky
 *   ASSETS.background.far       Image element — slow parallax layer
 *   ASSETS.background.mid       Image element — medium parallax layer
 *   ASSETS.player.run[0..3]     Array of 4 Image elements (run frames)
 *   ASSETS.player.jump          Image element
 *   ASSETS.player.fall          Image element
 *   ASSETS.obstacles[0..2]      Array of 3 Image elements
 *   ASSETS.ready(img)           Returns true when image is loaded and renderable
 */
(function () {
  "use strict";

  function img(src) {
    var el = new Image();
    el.src = src;
    return el;
  }

  window.ASSETS = {

    background: {
      sky:  img("assets/SKY.png"),
      far:  img("assets/FAR.png"),
      mid:  img("assets/MID.png"),
      menu: img("assets/MENU.png"),
    },

    player: {
      run: [
        img("assets/player/RUN_1.png"),
        img("assets/player/RUN_2.png"),
        img("assets/player/RUN_3.png"),
        img("assets/player/RUN_4.png"),
      ],
      jump: img("assets/player/JUMP.png"),
      fall: img("assets/player/FALL.png"),
    },

    /** Not used — obstacles are drawn procedurally in script.js */
    obstacles: [],

    /**
     * Returns true when an Image element is fully decoded and safe to draw.
     * Used as a guard before every ctx.drawImage call.
     */
    ready: function (imgEl) {
      return !!(imgEl && imgEl.complete && imgEl.naturalWidth > 0);
    },

  };
})();
