/**
 * Placeholder leaderboard service.
 * Replace implementation to plug in a real backend without touching game core.
 */

class LeaderboardService {
  constructor() {
    this._initialized = false;
  }

  /**
   * Submit score to leaderboard.
   * Mock: logs and resolves. Replace with real API call.
   * @param {number} score
   * @returns {Promise<void>}
   */
  async submitScore(score) {
    if (!this._initialized) {
      this._initialized = true;
    }
    // Mock implementation - replace with fetch to your backend
    return new Promise((resolve) => {
      if (typeof console !== 'undefined' && console.debug) {
        console.debug('[LeaderboardService] submitScore:', score);
      }
      setTimeout(resolve, 0);
    });
  }

  /**
   * Optional: fetch top scores for display.
   * @returns {Promise<Array<{ name: string, score: number }>>}
   */
  async getTopScores() {
    return Promise.resolve([]);
  }
}

export default new LeaderboardService();
