// 'use server';

/**
 * @fileOverview Refines a cake design based on user feedback.
 *
 * - refineCakeDesign - A function that refines the cake design based on user feedback.
 * - RefineCakeDesignInput - The input type for the refineCakeDesign function.
 * - RefineCakeDesignOutput - The return type for the refineCakeDesign function.
 */

"use server";

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const RefineCakeDesignInputSchema = z.object({
  initialDesign: z
    .string()
    .describe("The initial AI-generated cake design description."),
  feedback: z
    .string()
    .describe(
      "User feedback to refine the cake design (e.g., more chocolate, less frosting).",
    ),
});
export type RefineCakeDesignInput = z.infer<typeof RefineCakeDesignInputSchema>;

const RefineCakeDesignOutputSchema = z.object({
  refinedDesign: z
    .string()
    .describe("The refined cake design description based on user feedback."),
});
export type RefineCakeDesignOutput = z.infer<
  typeof RefineCakeDesignOutputSchema
>;

export async function refineCakeDesign(
  input: RefineCakeDesignInput,
): Promise<RefineCakeDesignOutput> {
  return refineCakeDesignFlow(input);
}

const prompt = ai.definePrompt({
  name: "refineCakeDesignPrompt",
  input: { schema: RefineCakeDesignInputSchema },
  output: { schema: RefineCakeDesignOutputSchema },
  prompt: `You are a cake design expert. You will refine the initial cake design based on user feedback to better match their vision.

Initial Cake Design: {{{initialDesign}}}

User Feedback: {{{feedback}}}

Refined Cake Design:`,
});

const refineCakeDesignFlow = ai.defineFlow(
  {
    name: "refineCakeDesignFlow",
    inputSchema: RefineCakeDesignInputSchema,
    outputSchema: RefineCakeDesignOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
