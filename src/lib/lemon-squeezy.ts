import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

export const setupLemonSqueezy = () => {
  lemonSqueezySetup({
    apiKey: process.env.LEMON_SQUEEZY_API_KEY!,
    onError: (error) => console.error("Lemon Squeezy Error:", error),
  });
};
