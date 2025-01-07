import { z } from "zod";

// Default values for the server form
export const defaultSchema = {
  id: "",
  name: "",
  iconUrl: "",
  description: "",
  address: "",
  website: null,
  roles: [],
  useUsdc: true,
  limitedTimeRoles: false,
  limitedTimeQuantity: "1",
  limitedTimeUnit: "Months",
  notificationChannelId: "",
};

// Zod schema for validating the server form data
export const serverFormSchema = z
  .object({
    id: z.string().min(1, "ID is required"),
    name: z.string().min(1, "Blink title is required"),
    iconUrl: z
      .string()
      .min(3, "Image URL is required")
      .refine(
        (url) => {
          try {
            new URL(url); // Check if URL is valid
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Invalid URL. Please enter a valid URL.",
        }
      ),
    description: z.string().min(1, "Description is required"),
    address: z.string(),
    website: z
      .string()
      .nullable() // Allow null for website
      .optional() // Make optional for validation
      .refine(
        (url) => {
          if (!url) return true; // If website is not provided, it's valid
          return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i.test(
            url
          ); // Validate the URL format
        },
        {
          message: "Invalid URL. Please enter a valid URL.",
        }
      ),
    roles: z
      .array(
        z.object({
          id: z.string().min(1, "Role ID is required"),
          name: z.string().min(1, "Role name is required"),
          amount: z
            .string()
            .refine((val) => /^\d*\.?\d+$/.test(val) && parseFloat(val) > 0, {
              message:
                "Amount must be a valid number or decimal greater than 0",
            })
            .transform((val) => parseFloat(val)), // Transform amount to a number
        })
      )
      .min(1, "At least one role is required"),
    useUsdc: z.boolean().default(false), // Default to false if not specified
    limitedTimeRoles: z.boolean().default(false), // Default to false if not specified
    limitedTimeQuantity: z
      .string()
      .default("1")
      .refine(
        (val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0,
        { message: "Quantity must be a positive number" }
      )
      .transform((val) => parseInt(val, 10).toString()), // Transform quantity to string
    limitedTimeUnit: z
      .string()
      .refine((val) => ["Hours", "Days", "Weeks", "Months"].includes(val), {
        message: "Invalid time unit. Must be Hours, Days, Weeks, or Months",
      })
      .default("Months"), // Default unit to "Months"
    notificationChannelId: z.string().optional(), // Optional notification channel
  })
  .default(defaultSchema); // Use default values when not specified

// Type inference based on the schema
export type ServerFormData = z.infer<typeof serverFormSchema>;

// Helper function to format validation errors
export function formatErrors(error: z.ZodError): Record<string, string[]> {
  return error.errors.reduce((acc, curr) => {
    const path = curr.path.join(".");
    acc[path] = acc[path] || [];
    acc[path].push(curr.message);
    return acc;
  }, {} as Record<string, string[]>);
}

// Example usage of validation and type checking
const formData: ServerFormData = {
  id: "server123",
  name: "My Discord Server",
  iconUrl: "https://example.com/icon.png",
  description: "A description of the server",
  address: "1234 Server St.",
  website: "https://mywebsite.com",
  roles: [
    {
      id: "admin",
      name: "Administrator",
      amount: "100",
    },
  ],
  useUsdc: true,
  limitedTimeRoles: true,
  limitedTimeQuantity: "12",
  limitedTimeUnit: "Months",
  notificationChannelId: "notification-channel-id",
};

// Validate the form data
const validationResult = serverFormSchema.safeParse(formData);

if (validationResult.success) {
  // Proceed with the form submission or further logic
  console.log("Form data is valid", validationResult.data);
} else {
  // Handle validation errors
  console.error("Validation failed", formatErrors(validationResult.error));
}
