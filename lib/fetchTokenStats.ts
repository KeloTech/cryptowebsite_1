/**
 * Future integration: fetch live token stats from your API or indexer.
 * Example shape — replace URLs and parsing with your provider (Helius, Birdeye, etc.)
 */

export type TokenStats = {
  priceUsd: number | null;
  marketCapUsd: number | null;
  holders: number | null;
  liquidityUsd: number | null;
  volume24hUsd: number | null;
  updatedAt: string | null;
};

export async function fetchTokenStats(
  mintAddress: string,
): Promise<TokenStats | null> {
  void mintAddress;
  // const res = await fetch(`/api/token-stats?mint=${mintAddress}`, { next: { revalidate: 30 } });
  // if (!res.ok) return null;
  // return res.json();
  return null;
}
