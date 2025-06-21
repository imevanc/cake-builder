"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";
import type { SuggestCakeDesignInput } from "@/ai";

const preferencesFormSchema = z.object({
  occasion: z
    .string()
    .min(3, { message: "Occasion must be at least 3 characters." })
    .max(100),
  flavor: z
    .string()
    .min(3, {
      message: "Desired flavor profile must be at least 3 characters.",
    })
    .max(100),
  dietaryRestrictions: z.string().max(200).optional(),
  colorPreferences: z.string().max(100).optional(),
});

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

interface PreferencesFormProps {
  onSubmit: (data: SuggestCakeDesignInput) => Promise<void>;
  isLoading: boolean;
  initialData?: SuggestCakeDesignInput;
}

export const PreferencesForm = ({
  onSubmit,
  isLoading,
  initialData,
}: PreferencesFormProps) => {
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: initialData || {
      occasion: "",
      flavor: "",
      dietaryRestrictions: "",
      colorPreferences: "",
    },
  });

  const handleSubmit = (data: PreferencesFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <h2 className="text-2xl font-semibold font-headline text-center mb-6">
          Tell Us About Your Cake Vision
        </h2>

        <FormField
          control={form.control}
          name="occasion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Occasion</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Birthday, Anniversary, Graduation"
                  {...field}
                />
              </FormControl>
              <FormDescription>What event is this cake for?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="flavor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired Flavor Profile</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Rich chocolate, Light and fruity, Spiced"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What kind of taste are you dreaming of?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="colorPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color Preferences (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Pastel blues and pinks, Bold and vibrant, Earthy tones"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any specific colors or themes in mind?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dietaryRestrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dietary Restrictions (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., Gluten-free, Nut-free, Vegan"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any allergies or dietary needs we should consider?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Get AI Suggestions
        </Button>
      </form>
    </Form>
  );
};
