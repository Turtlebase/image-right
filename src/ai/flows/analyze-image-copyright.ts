
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
    .describe('The identified copyright owner or creator of the image (e.g., "User / Creator", "HBO/Warner Bros.", "Koenigsegg Automotive AB").'),
  copyrightedElements: z
    .array(z.string())
    .optional()
    .describe('A list of specific elements within the image that are identified as being copyrighted (e.g., "Daenerys Targaryen character", "Game of Thrones dragon design", "Koenigsegg Gemera car design"). This should not include the subject of a photograph if it is a natural element like an animal or landscape.'),
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
    *   **Characters:** Human or non-human characters from movies, TV shows, video games, anime, cartoons, etc.
    *   **Logos & Branding:** Corporate logos, symbols, or other branding elements.
    *   **Artworks/Illustrations:** Famous paintings, illustrations, or other artworks depicted within the image.
    *   **Product Designs:** The specific, distinctive design and "trade dress" of manufactured products. **This is crucial.** A photo of a generic, unbranded object is different from a photo of a highly designed, branded product. For example, a picture of a **Koenigsegg Gemera** car is not just a picture of "a car"; it's a picture of a specific, copyrighted design.

2.  **Reverse Image Search:** Now, perform a comprehensive reverse image search to find the origin and distribution of this image online.

3.  **Synthesize Findings & Determine Output:** Combine the IP identification and reverse image search results to make a final determination.

**Output Logic:**

*   **If Recognizable IP is Found (e.g., a Character like Daenerys Targaryen OR a Product Design like a Koenigsegg Gemera):**
    *   This is your highest priority. The image contains protected intellectual property.
    *   Set riskLevel to 'copyrighted'.
    *   Set copyrightStatus to "Contains Copyrighted Elements".
    *   Set owner to the owner of the IP (e.g., "HBO/Warner Bros." or "Koenigsegg Automotive AB").
    *   Set license to "Varies by Element".
    *   List the specific elements in copyrightedElements (e.g., ["Koenigsegg Gemera car design"]).
    *   Set moderationInfo to explain the nuance. Example for a car: "While you may have taken or generated this photo, the design of the vehicle itself is protected intellectual property. Commercial use of this image may require a license from the vehicle manufacturer."

*   **If NO Recognizable IP is Found, AND the image IS found online:**
    *   Determine the license from the source websites.
    *   Set detectedOn to a list of verified, live websites where you found this image. **Verify each link.** Omit if no matches are found.
    *   Set riskLevel, copyrightStatus, owner, and license based on the source (e.g., for Pexels, set riskLevel to 'safe', set copyrightStatus to 'Public Domain (CC0)').

*   **If NO Recognizable IP is Found, AND the image is NOT found online (Original Creation):**
    *   This is likely an original photograph of a non-IP subject (like a mountain or a generic object) or a unique AI creation without IP.
    *   Set riskLevel to 'safe'.
    *   Set copyrightStatus to "Original Creation".
    *   Set owner to "User / Creator".
    *   Set license to "All Rights Reserved by Creator".
    *   Set moderationInfo. If it's a photo of a natural subject (e.g., a lion), explain: "While a lion is a part of nature and cannot be copyrighted, this specific photograph is a creative work and is likely protected by the photographer's copyright."

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
