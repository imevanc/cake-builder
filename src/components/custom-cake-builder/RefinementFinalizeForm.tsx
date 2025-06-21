"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { CustomCakeInput } from "@/types";
import { cakeFlavors, cakeFrostings, cakeSizes, cakeToppings } from "@/lib";

const finalizeFormSchema = z.object({
  name: z
    .string()
    .min(3, "Cake name must be at least 3 characters.")
    .max(50)
    .optional()
    .default("My Custom Cake"),
  baseFlavor: z.string().min(1, "Please select a base flavor."),
  frosting: z.string().min(1, "Please select a frosting."),
  size: z.string().min(1, "Please select a cake size."),
  specificToppings: z.array(z.string()).optional().default([]),
  customMessage: z.string().max(100).optional(),
});

type FinalizeFormValues = z.infer<typeof finalizeFormSchema>;

interface RefinementFinalizeFormProps {
  aiSuggestionText: string;
  generatedImageUrl: string | null | undefined;
  isImageLoading: boolean;
  onSubmit: (data: CustomCakeInput) => void;
  isLoading: boolean;
  initialData?: Partial<CustomCakeInput>;
}

export const RefinementFinalizeForm = ({
  aiSuggestionText,
  generatedImageUrl,
  isImageLoading,
  onSubmit,
  isLoading,
  initialData,
}: RefinementFinalizeFormProps) => {
  const form = useForm<FinalizeFormValues>({
    resolver: zodResolver(finalizeFormSchema),
    defaultValues: {
      name: initialData?.name || "My Custom Cake",
      baseFlavor: initialData?.baseFlavor || "",
      frosting: initialData?.frosting || "",
      size: initialData?.size || "",
      specificToppings: initialData?.specificToppings || [],
      customMessage: initialData?.customMessage || "",
    },
  });

  const handleSubmit = (data: FinalizeFormValues) => {
    onSubmit(data as CustomCakeInput);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold font-headline text-center mb-6">
        Fine-Tune Your Masterpiece
      </h2>

      <Card className="bg-card border-primary">
        <CardHeader>
          <CardTitle className="text-center text-lg">
            AI-Generated Cake Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[250px] p-4">
          {isImageLoading && (
            <div className="flex flex-col items-center text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-3" />
              <p className="text-muted-foreground">
                Generating your cake image...
              </p>
              <p className="text-xs text-muted-foreground">
                (This may take a moment)
              </p>
            </div>
          )}
          {!isImageLoading && generatedImageUrl && (
            <Image
              src={generatedImageUrl}
              alt="AI Generated Cake Preview"
              width={400}
              height={300}
              className="rounded-md object-contain max-h-[250px] border shadow-md"
            />
          )}
          {!isImageLoading && !generatedImageUrl && (
            <div className="flex flex-col items-center text-center">
              <Image
                src="https://placehold.co/400x300.png?text=Cake+Preview+Here"
                alt="Cake preview placeholder"
                width={400}
                height={300}
                className="rounded-md object-contain max-h-[250px] opacity-70"
                data-ai-hint="placeholder cake"
              />
              <p className="text-muted-foreground mt-2 text-sm">
                Image preview will appear here.
              </p>
              <p className="text-xs text-muted-foreground">
                (If generation failed, a placeholder is shown)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-secondary/30">
        <CardHeader>
          <CardTitle>AI's Refined Vision (Text)</CardTitle>
          <CardDescription>
            Here's the updated design based on your feedback:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{aiSuggestionText}</p>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cake Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Celebration Special" {...field} />
                </FormControl>
                <FormDescription>
                  Give your custom cake a unique name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="baseFlavor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Flavor</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a base flavor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cakeFlavors.map((flavor) => (
                        <SelectItem key={flavor} value={flavor}>
                          {flavor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="frosting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frosting</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a frosting" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cakeFrostings.map((frosting) => (
                        <SelectItem key={frosting} value={frosting}>
                          {frosting}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cake Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cake size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cakeSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specificToppings"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    Additional Toppings
                  </FormLabel>
                  <FormDescription>
                    Select any extra toppings you'd like.
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {cakeToppings.map((topping) => (
                    <FormField
                      key={topping}
                      control={form.control}
                      name="specificToppings"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={topping}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(topping)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...(field.value || []),
                                        topping,
                                      ])
                                    : field.onChange(
                                        (field.value || []).filter(
                                          (value) => value !== topping,
                                        ),
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {topping}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Message on Cake (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Happy Birthday!" {...field} />
                </FormControl>
                <FormDescription>Max 100 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading || isImageLoading}
            className="w-full"
          >
            {isLoading || isImageLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Review Your Custom Cake
          </Button>
        </form>
      </Form>
    </div>
  );
};
