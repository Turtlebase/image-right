
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FREE_MODEL = 'googleai/gemini-2.0-flash';
const PREMIUM_MODEL = 'googleai/gemini-2.5-flash-lite';

export const getModel = ai.defineFlow(
  {
    name: 'getModel',
    inputSchema: z.boolean().optional().default(false),
    outputSchema: z.string(),
  },
  async (isPremium) => {
    return isPremium ? PREMIUM_MODEL : FREE_MODEL;
  }
);
