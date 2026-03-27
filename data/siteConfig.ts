/**
 * Single source of truth for copy, links, and placeholders.
 * Update values here — layout components read from this file.
 */

export const siteConfig = {
  meta: {
    title: "VIBE | Meme coin on Solana",
    description:
      "A playful, community-first meme token built for the timeline. No roadmap to the moon — just vibes, memes, and honest chaos.",
    /** Replace with your hosted OG image URL for social previews */
    ogImage: "/og-placeholder.svg",
    twitterHandle: "@yourcoin",
    siteUrl: "https://example.com",
  },

  brand: {
    /** Display name */
    name: "VibeCoin",
    /** Short ticker with symbol */
    ticker: "$VIBE",
    /** Hero headline — meme-first, confident */
    headline: "The chart is optional. The joke is mandatory.",
    /** Hero subcopy */
    description:
      "We are a meme coin that knows it is a meme coin. Hold for culture, post for sport, and remember: this is entertainment — not a spreadsheet fantasy.",
    /** Small hero badges (order matters) */
    badges: [
      { label: "On Solana", icon: "zap" as const },
      { label: "Community Driven", icon: "users" as const },
      { label: "Meme Powered", icon: "sparkles" as const },
      { label: "100% Vibes", icon: "flame" as const },
    ],
  },

  contract: {
    /** Replace with your mint/contract — used for copy + display */
    address: "So11111111111111111111111111111111111111112",
    networkLabel: "Solana",
  },

  links: {
    /** Primary buy / swap deep link */
    buy: "https://jup.ag/",
    dexScreener: "https://dexscreener.com/",
    telegram: "https://t.me/",
    twitter: "https://x.com/",
    pumpFun: "https://pump.fun/",
    discord: null as string | null,
  },

  game: {
    embedUrl: "/game/index.html",
    sectionTitle: "Play the Meme Game",
    body:
      "Not everything has to be candlesticks. Jump into the mini game and add a little chaos to your session.",
    helperLine: "Best played as a quick break between market moves.",
    pills: ["Arcade Energy", "Community Fun", "Reflex Tested", "Meme Powered"],
    ctaLabel: "Open Full Game",
  },

  /** Horizontal ticker phrases — duplicate for seamless loop handled in component */
  tickerPhrases: [
    "community owned",
    "zero fear",
    "pure vibes",
    "meme energy",
    "built for the timeline",
    "buy the joke",
    "post first",
    "touch grass later",
    "highly serious unseriousness",
    "chart optional",
  ],

  about: {
    title: "Lore (lightly)",
    paragraphs: [
      "Somewhere between a shitpost and a sprint, VibeCoin appeared. No cinematic trailer. No fake utility deck. Just a mascot with attitude and a community that treats the timeline like a sport.",
      "If you are here for guaranteed numbers, you are in the wrong genre. If you are here for memes, chaos, and a coin that does not pretend to be a hedge fund — welcome home.",
    ],
    stats: [
      { label: "Years of Delusion", value: "∞" },
      { label: "Sleep Resistance", value: "Legendary" },
      { label: "Vibe Score", value: "Over 9000*" },
    ],
  },

  tokenomics: {
    title: "Tokenomics",
    subtitle: "Simple facts. Update when real numbers are live.",
    items: [
      {
        key: "supply",
        label: "Total Supply",
        value: "1,000,000,000",
        hint: "REPLACE: set final supply",
        icon: "coins" as const,
      },
      {
        key: "liquidity",
        label: "Liquidity",
        value: "TBD",
        hint: "REPLACE: locked / LP details",
        icon: "droplets" as const,
      },
      {
        key: "tax",
        label: "Tax",
        value: "0%",
        hint: "REPLACE if applicable",
        icon: "percent" as const,
      },
      {
        key: "chain",
        label: "Chain",
        value: "Solana",
        hint: "Network",
        icon: "link" as const,
      },
      {
        key: "contract",
        label: "Contract",
        value: "Verified on explorer",
        hint: "REPLACE: verification / renounce notes",
        icon: "shield-check" as const,
      },
      {
        key: "community",
        label: "Ownership vibe",
        value: "Community-first",
        hint: "REPLACE: team / multisig notes",
        icon: "heart" as const,
      },
    ],
  },

  howToBuy: {
    title: "How to Buy",
    subtitle: "Beginner-friendly. No gatekeeping.",
    steps: [
      {
        title: "Create a wallet",
        body: "Grab a Solana wallet (Phantom, Backpack, etc.) and keep your seed phrase offline.",
      },
      {
        title: "Get SOL",
        body: "Buy SOL on an exchange you trust and send it to your wallet address.",
      },
      {
        title: "Paste the contract",
        body: "Copy the contract from this page and verify it matches official announcements.",
      },
      {
        title: "Swap and join",
        body: "Swap SOL for $VIBE on your preferred route, then say hi in the community.",
      },
    ],
  },

  gallery: {
    title: "Meme Wall",
    subtitle: "Visual identity beats a whitepaper. Swap these for real art when ready.",
    items: [
      {
        id: "1",
        src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
        alt: "Abstract neon gradient placeholder",
      },
      {
        id: "2",
        src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80",
        alt: "Abstract shapes placeholder",
      },
      {
        id: "3",
        src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
        alt: "Color burst placeholder",
      },
      {
        id: "4",
        src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80",
        alt: "Gradient placeholder",
      },
      {
        id: "5",
        src: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80",
        alt: "Neon placeholder",
      },
      {
        id: "6",
        src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80",
        alt: "Pattern placeholder",
      },
    ],
  },

  community: {
    title: "Community",
    subtitle: "Pick your lane. All roads lead to more memes.",
    cards: [
      {
        key: "telegram",
        name: "Telegram",
        reason: "Holders, chat, and live chaos.",
        hrefKey: "telegram" as const,
        icon: "send" as const,
      },
      {
        key: "twitter",
        name: "X",
        reason: "Updates, memes, and timeline raids.",
        hrefKey: "twitter" as const,
        icon: "twitter" as const,
      },
      {
        key: "dex",
        name: "DexScreener",
        reason: "Chart, liquidity, and visibility.",
        hrefKey: "dexScreener" as const,
        icon: "line-chart" as const,
      },
      {
        key: "buy",
        name: "Buy Now",
        reason: "Fast route to swap.",
        hrefKey: "buy" as const,
        icon: "shopping-bag" as const,
      },
    ],
  },

  /** Optional live stats — wire to API later; hidden unless enabled */
  liveStats: {
    enabled: false,
    title: "Live Stats",
    subtitle: "Placeholder — connect API when ready.",
    placeholders: [
      { label: "Price", value: "—" },
      { label: "Market Cap", value: "—" },
      { label: "Holders", value: "—" },
      { label: "24h Volume", value: "—" },
    ],
  },

  footer: {
    disclaimer:
      "VibeCoin is a meme coin for entertainment and community culture. Not financial advice. No promises. No guaranteed returns. DYOR. If you cannot afford to lose it, do not buy it.",
    copyright: "© {year} VibeCoin community",
  },
} as const;

export type SiteConfig = typeof siteConfig;
