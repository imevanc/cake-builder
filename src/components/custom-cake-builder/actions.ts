"use server";

import {
  suggestCakeDesign as suggestCakeDesignFlow,
  type SuggestCakeDesignInput,
  type SuggestCakeDesignOutput,
} from "@/ai/flows/sugggestCakeDesign";
import {
  refineCakeDesign as refineCakeDesignFlow,
  type RefineCakeDesignInput,
  type RefineCakeDesignOutput,
} from "@/ai/flows/refineCakeDesign";
import {
  generateCakeImage as generateCakeImageFlow,
  type GenerateCakeImageInput,
  type GenerateCakeImageOutput,
} from "@/ai/flows/generateCakeImage";

export async function suggestCakeDesignAction(
  data: SuggestCakeDesignInput,
): Promise<SuggestCakeDesignOutput> {
  return await suggestCakeDesignFlow(data);
}

export async function refineCakeDesignAction(
  data: RefineCakeDesignInput,
): Promise<RefineCakeDesignOutput> {
  return await refineCakeDesignFlow(data);
}

export async function generateCakeImageAction(
  data: GenerateCakeImageInput,
): Promise<GenerateCakeImageOutput> {
  return await generateCakeImageFlow(data);
}
