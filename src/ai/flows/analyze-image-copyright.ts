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
    .describe('A list of specific elements within the image that are identified as being copyrighted (e.g., "Mercedes-Benz logo", "G-Wagon vehicle design"). This should not include the subject of a photograph if it is a natural element like an animal or landscape.'),
  moderationInfo: z
    .string()
    .optional()
    .describe('Provides context about the copyright status, especially for nuanced cases like photos of natural subjects. For example: "While a lion is a part of nature and cannot be copyrighted, this specific photograph is a creative work and is protected by the photographer\'s copyright."'),
  detectedOn: z
    .array(
      z.object({
        domain: z.string().describe('The domain where the image was found (e.g., "pexels.com", "gettyimages.com").'),
        url: z.string().describe('The direct, verifiable URL to the image source page. This link must not be a 404 or a dead link, and must contain the exact or a highly similar image.'),
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
    prompt: `You are a world-class expert AI for intellectual property and copyright information. Your task is to conduct a highly accurate and robust analysis of the provided image to determine its copyright status and usage rights. It is critical that your analysis is precise and your findings are verifiable.

**Analysis Steps:**
1.  **Reverse Image Search:** Perform a comprehensive reverse image search to find the origin and distribution of this image online.
2.  **IP Identification:** Analyze the image for any and all potential copyrightable material. This includes, but is not limited to:
    *   Logos and branding (e.g., the Mercedes-Benz three-pointed star).
    *   Product designs and trade dress (e.g., the specific vehicle design of the Mercedes-Benz G-Wagon).
    *   Characters, cartoon illustrations, anime, or mascots.
    *   Elements from movie posters, advertisements, or other promotional materials.
    *   Artworks, photographs, or illustrations depicted within the image.
    *   Any other recognizable intellectual property.
3.  **Contextual Analysis:** Differentiate between the subject of the image and the image itself.
    *   For photographs of natural subjects (like animals, landscapes), or generic objects, the subject itself is not copyrighted. The copyright applies to the *photograph* as a creative work. In these cases, set the 'moderationInfo' field to explain this nuance. For example: "While a lion is a part of nature and cannot be copyrighted, this specific photograph is a creative work and is likely protected by the photographer's copyright."
    *   The 'copyrightedElements' field should only be populated if there are specific, distinct IP elements *within* the image (e.g., a logo on a shirt).

**Output Requirements:**
Based on your analysis, provide the following information in the specified output format:

1.  **riskLevel**: A simple assessment. 'safe' if it's public domain or CC0. 'attribution' if it's free to use but requires credit. 'copyrighted' if it is protected and cannot be used without a license.
2.  **copyrightStatus**: A clear, concise summary of the findings (e.g., "Protected by Copyright", "Public Domain", "Creative Commons with Attribution").
3.  **license**: The specific license name (e.g., "CC0 1.0", "Getty Images Royalty-Free", "All Rights Reserved").
4.  **owner**: The name of the company or individual who owns the copyright. If unknown or not applicable (like public domain), state that.
5.  **copyrightedElements**: A list of the specific elements you identified as copyrighted. If none, this can be omitted.
6.  **moderationInfo**: If the image is of a natural subject, provide the contextual explanation here. Otherwise, omit.
7.  **detectedOn**: A list of websites where you found this image or highly similar versions. It is **critical** that these URLs are accurate, live, and point directly to a page containing the image. Do not provide links to search engine results, dead links (404s), or homepages. **Verify each link.**

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
