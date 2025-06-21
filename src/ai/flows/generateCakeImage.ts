"use server";
/**
 * @fileOverview Generates an image of a cake based on a description.
 *
 * - generateCakeImage - A function that generates a cake image.
 * - GenerateCakeImageInput - The input type for the generateCakeImage function.
 * - GenerateCakeImageOutput - The return type for the generateCakeImage function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const GenerateCakeImageInputSchema = z.object({
  cakeDescription: z
    .string()
    .describe("A detailed description of the cake to be generated."),
});
export type GenerateCakeImageInput = z.infer<
  typeof GenerateCakeImageInputSchema
>;

const GenerateCakeImageOutputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "The generated cake image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'.",
    ),
});
export type GenerateCakeImageOutput = z.infer<
  typeof GenerateCakeImageOutputSchema
>;

export async function generateCakeImage(
  input: GenerateCakeImageInput,
): Promise<GenerateCakeImageOutput> {
  return generateCakeImageFlow(input);
}

const generateCakeImageFlow = ai.defineFlow(
  {
    name: "generateCakeImageFlow",
    inputSchema: GenerateCakeImageInputSchema,
    outputSchema: GenerateCakeImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: "googleai/gemini-2.0-flash-preview-image-generation",
      prompt: `Generate an image of a cake with the following description: ${input.cakeDescription}. Ensure the cake is the main subject and clearly visible.`,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    if (!media || !media.url) {
      throw new Error("Image generation failed or returned no media URL.");
    }

    return { imageDataUri: media.url };
  },
);
