'use server';
/**
 * @fileOverview Generates AI-based usage advice for a scanned image.
 *
 * - generateAiUsageAdvice - A function that generates usage advice.
 * - GenerateAiUsageAdviceInput - The input type for the generateAiUsageAdvice function.
 * - GenerateAiUsageAdviceOutput - The return type for the generateAiUsageAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiUsageAdviceInputSchema = z.object({
  copyrightStatus: z
    .string()
    .describe("The copyright status of the image (e.g., 'Safe to use', 'Attribution needed', 'Copyrighted - not safe')."),
  license: z.string().describe('The license information of the image (e.g., CC0, Public Domain, Editorial Use).'),
  detectedPlatforms: z.array(z.string()).describe('The platforms where the image was detected.'),
  copyrightedElements: z.array(z.string()).describe('A list of elements within the image that are identified as copyrighted.'),
});
export type GenerateAiUsageAdviceInput = z.infer<typeof GenerateAiUsageAdviceInputSchema>;

const GenerateAiUsageAdviceOutputSchema = z.object({
  usageAdvice: z.string().describe('AI-generated advice on how to use the image safely.'),
});
export type GenerateAiUsageAdviceOutput = z.infer<typeof GenerateAiUsageAdviceOutputSchema>;

export async function generateAiUsageAdvice(input: GenerateAiUsageAdviceInput): Promise<GenerateAiUsageAdviceOutput> {
  return generateAiUsageAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiUsageAdvicePrompt',
  input: {schema: GenerateAiUsageAdviceInputSchema},
  output: {schema: GenerateAiUsageAdviceOutputSchema},
  prompt: `You are an AI assistant that provides advice on how to use images safely, considering their copyright status and license information.

  Given the following information, provide AI-based usage advice for the scanned image:

  Copyright Status: {{{copyrightStatus}}}
  License: {{{license}}}
  Detected Platforms: {{#each detectedPlatforms}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Copyrighted Elements: {{#if copyrightedElements}}{{#each copyrightedElements}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None detected.{{/if}}

  Provide clear and concise advice on how the user can use the image safely, taking into account the copyright implications. Be direct and focus on actionable advice for a creator or marketer. Limit to 2-3 sentences.
  `,
});

const generateAiUsageAdviceFlow = ai.defineFlow(
  {
    name: 'generateAiUsageAdviceFlow',
    inputSchema: GenerateAiUsageAdviceInputSchema,
    outputSchema: GenerateAiUsageAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
