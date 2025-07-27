'use server';
/**
 * @fileOverview An AI flow for analyzing the copyright status of an image.
 * 
 * - analyzeImageCopyright - A function that performs the copyright analysis.
 * - AnalyzeImageCopyrightInput - The input type for the analysis function.
 * - AnalyzeImageCopyrightOutput - The return type for the analysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeImageCopyrightInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The image to be analyzed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeImageCopyrightInput = z.infer<typeof AnalyzeImageCopyrightInputSchema>;

const AnalyzeImageCopyrightOutputSchema = z.object({
  riskLevel: z
    .enum(['safe', 'attribution', 'copyrighted'])
    .describe('A simple risk level classification for quick reference.'),
  copyrightStatus: z
    .string()
    .describe("A descriptive status of the image's copyright (e.g., 'Public Domain (CC0)', 'Royalty-Free with Attribution', 'Protected by Copyright')."),
  license: z
    .string()
    .describe('The specific license associated with the image (e.g., CC0 1.0, MIT, Getty Images Royalty-Free).'),
  owner: z
    .string()
    .optional()
    .describe('The identified copyright owner or creator of the image.'),
  copyrightedElements: z
    .array(z.string())
    .optional()
    .describe('A list of specific elements within the image that are identified as being copyrighted (e.g., "Mercedes-Benz logo", "G-Wagon vehicle design").'),
  detectedOn: z
    .array(
      z.object({
        domain: z.string().describe('The domain where the image was found (e.g., "pexels.com", "gettyimages.com").'),
        url: z.string().url().describe('The direct URL to the image source page.'),
      })
    )
    .optional()
    .describe('A list of websites where this image has been detected.'),
});
export type AnalyzeImageCopyrightOutput = z.infer<typeof AnalyzeImageCopyrightOutputSchema>;


export async function analyzeImageCopyright(input: AnalyzeImageCopyrightInput): Promise<AnalyzeImageCopyrightOutput> {
  return analyzeImageCopyrightFlow(input);
}


const prompt = ai.definePrompt(
  {
    name: 'analyzeImageCopyrightPrompt',
    input: { schema: AnalyzeImageCopyrightInputSchema },
    output: { schema: AnalyzeImageCopyrightOutputSchema },
    prompt: `You are a world-class expert AI for intellectual property and copyright information. Your task is to conduct a highly accurate and robust analysis of the provided image to determine its copyright status and usage rights.

Analyze the image for any and all potential copyrightable material. This includes, but is not limited to:
- Logos and branding (e.g., the Mercedes-Benz three-pointed star).
- Product designs and trade dress (e.g., the specific vehicle design of the Mercedes-Benz G-Wagon).
- Characters, cartoon illustrations, anime, or mascots.
- Elements from movie posters, advertisements, or other promotional materials.
- Artworks, photographs, or illustrations depicted within the image.
- Any other recognizable intellectual property.

Based on your visual analysis and web search, provide the following information in the specified output format:
1.  **riskLevel**: A simple assessment. 'safe' if it's public domain or CC0. 'attribution' if it's free to use but requires credit. 'copyrighted' if it is protected and cannot be used without a license.
2.  **copyrightStatus**: A clear, concise summary of the findings (e.g., "Protected by Copyright", "Public Domain", "Creative Commons with Attribution").
3.  **license**: The specific license name (e.g., "CC0 1.0", "Getty Images Royalty-Free", "All Rights Reserved").
4.  **owner**: The name of the company or individual who owns the copyright. If unknown or not applicable (like public domain), state that.
5.  **copyrightedElements**: A list of the specific elements you identified as copyrighted. For the provided image, this must include "Mercedes-Benz G-Wagon vehicle design" and "Mercedes-Benz logo".
6.  **detectedOn**: A list of URLs where you found this image or similar versions, which helps verify its origin and licensing. Provide the domain and the full URL.

Image to analyze: {{media url=imageDataUri}}`,
  }
);


const analyzeImageCopyrightFlow = ai.defineFlow(
  {
    name: 'analyzeImageCopyrightFlow',
    inputSchema: AnalyzeImageCopyrightInputSchema,
    outputSchema: AnalyzeImageCopyrightOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
