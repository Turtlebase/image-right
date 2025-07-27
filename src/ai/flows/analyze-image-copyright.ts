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
      "The image to be analyzed, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type AnalyzeImageCopyrightInput = z.infer<typeof AnalyzeImageCopyrightInputSchema>;

const AnalyzeImageCopyrightOutputSchema = z.object({
  riskLevel: z
    .enum(['safe', 'attribution', 'copyrighted'])
    .describe('A simple risk level classification for quick reference.'),
  copyrightStatus: z
    .string()
    .describe("A descriptive status of the image's copyright (e.g., 'Public Domain (CC0)', 'Royalty-Free with Attribution', 'Protected by Copyright', 'Original Creation', 'Contains Copyrighted Elements')."),
  license: z
    .string()
    .describe('The specific license associated with the image (e.g., CC0 1.0, MIT, Getty Images Royalty-Free, "All Rights Reserved by Creator", "Varies by Element").'),
  owner: z
    .string()
    .optional()
    .describe('The identified copyright owner or creator of the image (e.g., "User / Creator", "HBO/Warner Bros.").'),
  copyrightedElements: z
    .array(z.string())
    .optional()
    .describe('A list of specific elements within the image that are identified as being copyrighted (e.g., "Daenerys Targaryen character", "Game of Thrones dragon design"). This should not include the subject of a photograph if it is a natural element like an animal or landscape.'),
  moderationInfo: z
    .string()
    .optional()
    .describe('Provides context about the copyright status, especially for nuanced cases like photos of natural subjects or AI-generated images containing third-party IP.'),
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
1.  **IP Identification FIRST:** Before anything else, analyze the image content for any and all potential copyrightable material. This is the most important step. Look for:
    *   **Characters:** Human or non-human characters from movies, TV shows (e.g., Daenerys Targaryen from Game of Thrones), video games, comic books, anime, or any fictional universe.
    *   **Creatures/Designs:** Recognizable creatures or designs strongly associated with a specific IP (e.g., a dragon from Game of Thrones).
    *   **Logos & Branding:** Corporate logos, symbols, or other branding elements.
    *   **Product Designs:** The specific design and trade dress of products (e.g., a specific model of car).
    *   **Artworks/Illustrations:** Famous paintings, illustrations, or other artworks depicted within the image.
2.  **Reverse Image Search:** Now, perform a comprehensive reverse image search to find the origin and distribution of this image online.
3.  **Synthesize Findings:** Combine the IP identification and reverse image search results to make a final determination.

**Output Logic:**

*   **If Recognizable IP is Found (like Daenerys Targaryen):**
    *   This is your highest priority. The image is a derivative work and is subject to the original IP holder's copyright.
    *   Set riskLevel to 'copyrighted'.
    *   Set copyrightStatus to "Contains Copyrighted Elements".
    *   Set owner to the owner of the original IP (e.g., "HBO/Warner Bros. for Game of Thrones").
    *   Set license to "Varies by Element" or the specific license if known.
    *   Set copyrightedElements to a list of the specific elements found (e.g., ["Daenerys Targaryen character", "Game of Thrones dragon design"]).
    *   Set moderationInfo to explain the nuance. Example: "This AI-generated image is a derivative work based on protected intellectual property (Game of Thrones). While you created this specific image, the underlying characters and designs are copyrighted by their respective owners, severely restricting commercial use."

*   **If NO Recognizable IP is Found, AND the image IS found online:**
    *   Determine the license from the source websites.
    *   Set detectedOn to a list of verified, live websites where you found this image. **Verify each link.** Omit if no matches are found.
    *   Set riskLevel, copyrightStatus, owner, and license based on the source (e.g., for Pexels, set riskLevel to 'safe', set copyrightStatus to 'Public Domain (CC0)').

*   **If NO Recognizable IP is Found, AND the image is NOT found online (Original Creation):**
    *   This is likely an original photograph or a unique AI creation.
    *   Set riskLevel to 'safe'.
    *   Set copyrightStatus to "Original Creation".
    *   Set owner to "User / Creator".
    *   Set license to "All Rights Reserved by Creator".
    *   Set moderationInfo. If it appears to be a photo of a natural subject (e.g., a lion), explain the nuance: "While a lion is a part of nature and cannot be copyrighted, this specific photograph is a creative work and is likely protected by the photographer's copyright." If it is generic AI art, the moderation info about checking the tool's ToS is appropriate.

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
