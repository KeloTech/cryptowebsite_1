/**
 * Collision detection utilities.
 * AABB for pipes, circle-rect for player vs pipe, circle-circle for player vs coin.
 */

/**
 * AABB: axis-aligned bounding box overlap.
 * @param {Object} a - { x, y, width, height }
 * @param {Object} b - { x, y, width, height }
 */
function aabbOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
         a.y < b.y + b.height && a.y + a.height > b.y;
}

/**
 * Circle vs axis-aligned rectangle.
 * Uses closest-point test for accurate collision.
 * @param {number} cx - circle center x
 * @param {number} cy - circle center y
 * @param {number} r - circle radius
 * @param {Object} rect - { x, y, width, height }
 */
function circleRectCollision(cx, cy, r, rect) {
  const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= r * r;
}

/**
 * Circle vs circle.
 */
function circleCircleCollision(x1, y1, r1, x2, y2, r2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distSq = dx * dx + dy * dy;
  const sumR = r1 + r2;
  return distSq <= sumR * sumR;
}

export { aabbOverlap, circleRectCollision, circleCircleCollision };
