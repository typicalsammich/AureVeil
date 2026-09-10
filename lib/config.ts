export const siteConfig = {
  name: 'AureVeil',
  tagline: 'Two sides. One world of art.',
  description: 'Discover original work, follow artists, save inspiration, commission creators, and collect art.',
  platformFeeBps: 1000,
  wallet: { minDepositCents: 500, maxDepositCents: 100000 },
  promotionPricesCents: { day1: 500, day3: 1200, day7: 2400 }
} as const;
