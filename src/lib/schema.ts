import * as z from "zod";

export const SignupFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
});
export type SignupFormValues = z.infer<typeof SignupFormSchema>;

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Basic check, real app would have stricter password rules
});
export type LoginFormValues = z.infer<typeof LoginFormSchema>;

export const ShippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  addressLine1: z.string().min(5, "Address line 1 is required."),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required."),
  postalCode: z.string().min(3, "Postal code is required."),
  country: z.string().min(2, "Country is required."),
  phoneNumber: z.string().optional(),
});
export type ShippingAddressValues = z.infer<typeof ShippingAddressSchema>;

export const CheckoutFormSchema = z
  .object({
    guestEmail: z
      .string()
      .email("Please enter a valid email for guest checkout.")
      .optional(),
    shippingOption: z.enum(["delivery", "collection"], {
      required_error: "Please select a shipping option.",
    }),
    shippingAddress: ShippingAddressSchema.optional(),
    paymentMethod: z.enum(["stripe", "paypal", "card"], {
      required_error: "Please select a payment method.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.shippingOption === "delivery" && !data.shippingAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Shipping address is required for delivery.",
        path: ["shippingAddress"],
      });
    }
  });
export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>;
