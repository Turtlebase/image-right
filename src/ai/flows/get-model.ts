
'use server';

import { ai } from '@/ai/genkit';
import { useSubscription } from '@/hooks/useSubscription';

const FREE_MODEL = 'googleai/gemini-2.0-flash';
const PREMIUM_MODEL = 'googleai/gemini-2.5-flash-lite';

export const getModel = ai.defineFlow(
  {
    name: 'getModel',
  },
  async () => {
    // We must rehydrate the store here since this is a server-side flow.
    await useSubscription.persist.rehydrate();
    const { isPremium } = useSubscription.getState();

    return isPremium ? PREMIUM_MODEL : FREE_MODEL;
  }
);
