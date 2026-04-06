/**
 * Single source of truth for copy, links, and placeholders.
 * Update values here — layout components read from this file.
 */

export const siteConfig = {
  /** Design / lore demo — no live token, links and contract are placeholders */
  demo: {
    active: true,
    ribbon: "Demo",
    heroLine:
      "This site is a layout & lore demo only. No real token, mint, or official links — nothing here is for trading.",
    contractTitle: "Placeholder contract",
    contractNote:
      "Example Solana-style address for UI only. Do not send funds or treat this as a real project.",
  },

  meta: {
    title: "BlueSloth (demo) | Meme landing",
    description:
      "Fictional BlueSloth jungle lore and UI demo — not a live coin. No real contract or endorsed links.",
    /** Replace with your hosted OG image URL for social previews */
    ogImage: "/og-placeholder.svg",
    twitterHandle: "@demo",
    siteUrl: "https://example.com",
  },

  brand: {
    /** Display name */
    name: "BlueSloth",
    /** Short ticker with symbol */
    ticker: "$SLOTH",
    /** Hero headline — from lore */
    headline: "You don’t have to be fast to win — you just have to never stop.",
    /** Hero subcopy */
    description:
      "In the heart of a forgotten digital jungle, BlueSloth found a pulse of pure meme power. It didn’t make him faster — it made him unstoppable. Now he runs: not in a hurry, not in panic, but with purpose.",
    /** Small hero badges (order matters) */
    badges: [
      { label: "Solana jungle", icon: "zap" as const },
      { label: "Meme powered", icon: "sparkles" as const },
      { label: "Never stops", icon: "flame" as const },
      { label: "Built different", icon: "users" as const },
    ],
  },

  contract: {
    /** Demo placeholder — not a real mint */
    address: "So11111111111111111111111111111111111111112",
    networkLabel: "Solana (demo)",
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
    sectionTitle: "Run the jungle",
    body:
      "Dash through vines and ruins — dodge chaos, collect energy, and keep moving. The arcade is pure BlueSloth energy.",
    helperLine: "Jump in when you need a break from the chart.",
    pills: ["Endless run", "Meme energy", "Jungle vibes", "Never stop"],
    ctaLabel: "Open full game",
  },

  /** Horizontal ticker phrases — duplicate for seamless loop handled in component */
  tickerPhrases: [
    "welcome to the jungle",
    "never stop",
    "meme power",
    "slowest legend",
    "digital jungle",
    "built for the timeline",
    "pure chaos energy",
    "run with purpose",
    "community pack",
    "bluesloth energy",
  ],

  about: {
    title: "BlueSloth Lore",
    paragraphs: [
      "In the heart of a forgotten digital jungle lives BlueSloth — the slowest creature to ever become the fastest legend.",
      "Once just a chill, sleepy sloth vibing in the trees, BlueSloth discovered a strange energy flowing through the jungle — a pulse of pure meme power. Instead of making him faster… it made him unstoppable.",
      "Now, he runs. Not in a hurry. Not in panic. But with purpose.",
      "Through vines, ruins, and wild terrain, BlueSloth dashes endlessly, collecting energy, dodging chaos, and proving one thing: you don’t have to be fast to win — you just have to never stop.",
      "Welcome to the jungle. Welcome to BlueSloth. 🦥💙",
    ],
    stats: [
      { label: "Panic level", value: "0%" },
      { label: "Stop rate", value: "Never" },
      { label: "Meme power", value: "∞" },
    ],
  },

  tokenomics: {
    title: "Tokenomics",
    subtitle: "Demo numbers for layout — replace if you ship a real token.",
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
        label: "Jungle vibe",
        value: "Community-first",
        hint: "REPLACE: team / multisig notes",
        icon: "heart" as const,
      },
    ],
  },

  howToBuy: {
    title: "How to Buy",
    subtitle: "Illustrative steps only — this demo is not a token sale.",
    steps: [
      {
        title: "Create a wallet",
        body: "For a real launch you’d use a Solana wallet (Phantom, Backpack, etc.) and keep your seed phrase offline.",
      },
      {
        title: "Get SOL",
        body: "On a real project you’d fund the wallet with SOL from an exchange you trust.",
      },
      {
        title: "Verify the contract",
        body: "Always match the mint from official channels — here the address is just a placeholder.",
      },
      {
        title: "Swap and join",
        body: "On a live coin you’d swap on your preferred route and join real community links.",
      },
    ],
  },

  community: {
    title: "Community",
    subtitle: "Card layout demo — outbound links are generic placeholders, not this project’s official pages.",
    cards: [
      {
        key: "telegram",
        name: "Telegram",
        reason: "Holders, chat, and jungle chaos.",
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
      "This website is a fictional demo for design and lore. There is no BlueSloth token offering, no verified contract for this page, and no guarantee that links point to a real project. Not financial advice. Do not send funds based on this site.",
    copyright: "© {year} Demo / BlueSloth concept",
  },
} as const;

export type SiteConfig = typeof siteConfig;
