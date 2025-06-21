"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import type { CustomCakeInput, CustomCakeProduct } from "@/types";
import type {
  RefineCakeDesignInput,
  RefineCakeDesignOutput,
  SuggestCakeDesignInput,
  SuggestCakeDesignOutput,
} from "@/ai";
import {
  generateCakeImageAction,
  refineCakeDesignAction,
  suggestCakeDesignAction,
} from "./actions";
import { Button, Progress } from "@/components/ui";
import { PreferencesForm } from "./PreferencesForm";
import { SuggestionFeedbackForm } from "./SuggestionFeedbackForm";
import { RefinementFinalizeForm } from "./RefinementFinalizeForm";
import { ReviewAndAddCustomCake } from "./ReviewAndAddCustomCake";
import { toast } from "@/hooks";

const mockUuidv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const finalUuidv4 = typeof uuidv4 === "function" ? uuidv4 : mockUuidv4;

const TOTAL_STEPS = 4;

export const CustomCakeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // For text generation and form submission
  const [isImageLoading, setIsImageLoading] = useState(false);

  const [preferences, setPreferences] = useState<SuggestCakeDesignInput | null>(
    null,
  );
  const [initialSuggestion, setInitialSuggestion] =
    useState<SuggestCakeDesignOutput | null>(null);
  const [_, setFeedback] = useState<string>("");
  const [refinedSuggestion, setRefinedSuggestion] =
    useState<RefineCakeDesignOutput | null>(null);
  const [finalSelections, setFinalSelections] = useState<
    Partial<CustomCakeInput>
  >({});
  const [customCakeProduct, setCustomCakeProduct] =
    useState<CustomCakeProduct | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );

  const handlePreferencesSubmit = async (data: SuggestCakeDesignInput) => {
    setIsLoading(true);
    setGeneratedImageUrl(null); // Clear previous image
    try {
      const result = await suggestCakeDesignAction(data);
      setPreferences(data);
      setInitialSuggestion(result);

      if (result.designSuggestion) {
        setIsImageLoading(true);
        try {
          const imageResult = await generateCakeImageAction({
            cakeDescription: result.designSuggestion,
          });
          setGeneratedImageUrl(imageResult.imageDataUri);
        } catch (imgError) {
          console.error("Error generating cake image:", imgError);
          toast({
            title: "AI Image Error",
            description: "Could not generate cake image. Using placeholder.",
            variant: "destructive",
          });
          setGeneratedImageUrl(null);
        } finally {
          setIsImageLoading(false);
        }
      }
      setCurrentStep(2);
    } catch (error) {
      console.error("Error suggesting cake design:", error);
      toast({
        title: "AI Error",
        description: "Could not get cake suggestion. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleFeedbackSubmit = async (userFeedback: string) => {
    if (!initialSuggestion || !preferences) return;
    setIsLoading(true);

    try {
      const refineInput: RefineCakeDesignInput = {
        initialDesign: initialSuggestion.designSuggestion,
        feedback: userFeedback,
      };
      const result = await refineCakeDesignAction(refineInput);
      setFeedback(userFeedback);
      setRefinedSuggestion(result);

      if (result.refinedDesign) {
        setIsImageLoading(true);
        try {
          const imageResult = await generateCakeImageAction({
            cakeDescription: result.refinedDesign,
          });
          setGeneratedImageUrl(imageResult.imageDataUri);
        } catch (imgError) {
          console.error("Error refining cake image:", imgError);
          toast({
            title: "AI Image Error",
            description: "Could not refine cake image. Using placeholder.",
            variant: "destructive",
          });
        } finally {
          setIsImageLoading(false);
        }
      }
      setCurrentStep(3);
    } catch (error) {
      console.error("Error refining cake design:", error);
      toast({
        title: "AI Error",
        description: "Could not refine cake suggestion. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleFinalizeSubmit = (selections: Partial<CustomCakeInput>) => {
    const completeSelections = { ...finalSelections, ...selections };
    setFinalSelections(completeSelections);

    const price =
      40 +
      Object.keys(selections.specificToppings || {}).length * 3 +
      (selections.size === "Medium (10-12 servings)"
        ? 8
        : selections.size === "Large (15-20 servings)"
          ? 15
          : 0);

    const product: CustomCakeProduct = {
      id: `custom-${finalUuidv4()}`,
      name: selections.name || `Custom ${selections.baseFlavor || "Cake"}`,
      description:
        refinedSuggestion?.refinedDesign ||
        initialSuggestion?.designSuggestion ||
        "A custom designed cake.",
      price: parseFloat(price.toFixed(2)),
      imageUrl:
        generatedImageUrl ||
        selections.imageUrl ||
        "https://placehold.co/600x400.png?text=Your+Custom+Cake",
      dataAiHint: "custom cake",
      category: "Custom",
      type: "custom",
      baseFlavor: selections.baseFlavor || "Vanilla",
      frosting: selections.frosting || "Buttercream",
      size: selections.size || "Medium (10-12 servings)",
      specificToppings: selections.specificToppings || [],
      customMessage: selections.customMessage || "",
      aiInitialSuggestion: initialSuggestion?.designSuggestion,
      aiRefinedSuggestion: refinedSuggestion?.refinedDesign,
    };
    setCustomCakeProduct(product);
    setCurrentStep(4);
  };

  const progressPercentage = (currentStep / TOTAL_STEPS) * 100;

  const prevStep = () => {
    if (currentStep === 4) setCustomCakeProduct(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-2xl mx-auto bg-card p-6 sm:p-8 rounded-lg shadow-xl">
      <Progress value={progressPercentage} className="mb-8" />

      {currentStep === 1 && (
        <PreferencesForm
          onSubmit={handlePreferencesSubmit}
          isLoading={isLoading}
          initialData={preferences || undefined}
        />
      )}
      {currentStep === 2 && initialSuggestion && preferences && (
        <SuggestionFeedbackForm
          initialSuggestion={initialSuggestion.designSuggestion}
          preferences={preferences}
          onSubmit={handleFeedbackSubmit}
          isLoading={isLoading}
        />
      )}
      {currentStep === 3 && (refinedSuggestion || initialSuggestion) && (
        <RefinementFinalizeForm
          aiSuggestionText={
            refinedSuggestion?.refinedDesign ||
            initialSuggestion?.designSuggestion ||
            "AI's amazing cake idea!"
          }
          generatedImageUrl={generatedImageUrl}
          isImageLoading={isImageLoading}
          onSubmit={handleFinalizeSubmit}
          isLoading={isLoading} // This is for form submission, not overall step loading
          initialData={finalSelections}
        />
      )}
      {currentStep === 4 && customCakeProduct && (
        <ReviewAndAddCustomCake cakeProduct={customCakeProduct} />
      )}

      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isLoading || isImageLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {currentStep < TOTAL_STEPS && currentStep !== 4 && (
          <span className="text-sm text-muted-foreground self-center">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        )}
        {currentStep === TOTAL_STEPS && !customCakeProduct && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(3)}
            disabled={isLoading || isImageLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Finalize
          </Button>
        )}
      </div>
    </div>
  );
};
