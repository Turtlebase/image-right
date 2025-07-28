'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-ai-usage-advice.ts';
import '@/ai/flows/analyze-image-copyright.ts';
