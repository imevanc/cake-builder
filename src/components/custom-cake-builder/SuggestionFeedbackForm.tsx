"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@/components/ui";
import type { SuggestCakeDesignInput } from "@/ai";

const feedbackFormSchema = z.object({
  feedback: z
    .string()
    .min(5, { message: "Feedback must be at least 5 characters." })
    .max(500),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export const SuggestionFeedbackForm = ({
  initialSuggestion,
  preferences,
  onSubmit,
  isLoading,
}: {
  initialSuggestion: string;
  preferences: SuggestCakeDesignInput;
  onSubmit: (feedback: string) => Promise<void>;
  isLoading: boolean;
}) => {
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      feedback: "",
    },
  });

  const handleSubmit = (data: FeedbackFormValues) => onSubmit(data.feedback);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold font-headline text-center mb-6">
        AI's Creative Spark
      </h2>

      <Card className="bg-secondary/30">
        <CardHeader>
          <CardTitle>AI's Suggestion For You</CardTitle>
          <CardDescription>
            Based on your preferences for a{" "}
            <span className="font-semibold">{preferences.occasion}</span> cake
            with a <span className="font-semibold">{preferences.flavor}</span>{" "}
            profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{initialSuggestion}</p>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="feedback"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Feedback</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., I love the idea, but can we make it more colorful? Or, I'd prefer a different type of fruit."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Refine Design with AI
          </Button>
        </form>
      </Form>
    </div>
  );
};
