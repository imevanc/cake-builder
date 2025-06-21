"use server";

/**
 * @fileOverview A cake design suggestion AI agent.
 *
 * - suggestCakeDesign - A function that suggests cake designs based on user preferences.
 * - SuggestCakeDesignInput - The input type for the suggestCakeDesign function.
 * - SuggestCakeDesignOutput - The return type for the suggestCakeDesign function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const SuggestCakeDesignInputSchema = z.object({
  flavor: z.string().describe("The desired flavor of the cake."),
  occasion: z
    .string()
    .describe("The occasion for which the cake is being made."),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe("Any dietary restrictions."),
  colorPreferences: z
    .string()
    .optional()
    .describe("Color preferences for the cake design."),
});

export type SuggestCakeDesignInput = z.infer<
  typeof SuggestCakeDesignInputSchema
>;

const SuggestCakeDesignOutputSchema = z.object({
  designSuggestion: z
    .string()
    .describe(
      "A detailed suggestion for the cake design, including flavor combinations, decorations, and overall aesthetic.",
    ),
});

export type SuggestCakeDesignOutput = z.infer<
  typeof SuggestCakeDesignOutputSchema
>;

export async function suggestCakeDesign(
  input: SuggestCakeDesignInput,
): Promise<SuggestCakeDesignOutput> {
  return suggestCakeDesignFlow(input);
}

const prompt = ai.definePrompt({
  name: "suggestCakeDesignPrompt",
  input: { schema: SuggestCakeDesignInputSchema },
  output: { schema: SuggestCakeDesignOutputSchema },
  prompt: `You are a professional cake designer. A user is looking for inspiration for a cake design.

  Based on their preferences for flavor, occasion, and any dietary restrictions, suggest a unique and delicious cake design.

  Flavor: {{{flavor}}}
  Occasion: {{{occasion}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}
  Color Preferences: {{{colorPreferences}}}

  Consider flavor combinations, decorations, and the overall aesthetic of the cake.
  Provide a detailed description of the suggested design.
  `,
});

const suggestCakeDesignFlow = ai.defineFlow(
  {
    name: "suggestCakeDesignFlow",
    inputSchema: SuggestCakeDesignInputSchema,
    outputSchema: SuggestCakeDesignOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
