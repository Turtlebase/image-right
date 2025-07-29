
'use server';
/**
 * @fileOverview Generates a social media post based on an image.
 * 
 * - generateSocialMediaPost - A function that creates a caption and hashtags.
 * - GenerateSocialMediaPostInput - The input type for the function.
 * - GenerateSocialMediaPostOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getModel } from './get-model';

const GenerateSocialMediaPostInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to generate a post for, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.object({
  caption: z.string().describe("A creative and engaging caption for a social media post, optimized for platforms like Instagram or X. It should be between 2-4 sentences."),
  hashtags: z.array(z.string()).describe("An array of 5-10 relevant and effective hashtags, including a mix of popular and niche tags. Each hashtag should start with '#'."),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;


export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async (input) => {
    
    // Social media post generation is a premium feature, so we always use the premium model.
    const model = await getModel(true);

    const prompt = ai.definePrompt(
      {
        name: 'generateSocialMediaPostPrompt',
        model,
        input: { schema: GenerateSocialMediaPostInputSchema },
        output: { schema: GenerateSocialMediaPostOutputSchema },
        prompt: `You are a world-class social media marketing expert. Your task is to analyze the provided image and generate a compelling social media post for it.

**Analysis Steps:**

1.  **Analyze Image Content:** Identify the key subjects, mood, colors, and overall theme of the image.
2.  **Craft a Caption:** Write an engaging caption that tells a story, asks a question, or provides a compelling hook related to the image. The tone should be authentic and interesting.
3.  **Generate Hashtags:** Create a list of 5-10 highly relevant hashtags. Include a mix of broad, popular tags and more specific, niche tags to maximize reach and engagement.

**Image to Analyze:** {{media url=imageDataUri}}`,
      }
    );

    const { output } = await prompt(input);
    return output!;
  }
);
