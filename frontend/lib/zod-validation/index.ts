import { z } from "zod";

// Default values for the form schema
export const defaultSchema = {
  id: "",
  name: "",
  iconUrl: "",
  description: "",
  address: "",
  website: "",
  roles: [],
  useUsdc: false,
  limitedTimeRoles: false,
  limitedTimeQuantity: "1",
  limitedTimeUnit: "Months",
  notificationChannelId: "",
};

// Server form validation schema with enhanced error handling and validations
export const serverFormSchema = z
  .object({
    id: z.string().min(1, "A unique identifier for the server is required"),
    name: z.string().min(1, "Server title is required and cannot be empty"),
    iconUrl: z
      .string()
      .min(3, "Image URL is required and must be at least 3 characters long")
      .refine(
        (url) => {
          try {
            new URL(url); // Ensure it's a valid URL
            return true;
          } catch {
            return false;
          }
        },
        {
          message: "Invalid URL. Please enter a valid image URL.",
        }
      ),
    description: z.string().min(1, "Description is required and cannot be empty"),
    address: z.string().min(1, "A valid address is required"),
    website: z
      .string()
      .nullable()
      .refine(
        (url) => {
          if (!url) return true; // Null values are allowed
          return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i.test(url); // Validate URL pattern
        },
        {
          message: "Please enter a valid website URL (e.g., https://example.com).",
        }
      ),
    roles: z
      .array(
        z.object({
          id: z.string().min(1, "Role ID is required and cannot be empty"),
          name: z.string().min(1, "Role name is required and cannot be empty"),
          amount: z
            .string()
            .refine((val) => /^\d*\.?\d+$/.test(val) && parseFloat(val) > 0, {
              message: "Amount must be a valid number or decimal greater than 0.",
            })
            .transform((val) => parseFloat(val).toString()),
        })
      )
      .min(1, "At least one role must be provided."),
    useUsdc: z.boolean().default(false),
    limitedTimeRoles: z.boolean().default(false),
    limitedTimeQuantity: z
      .string()
      .default("1")
      .transform((val) => {
        const num = parseInt(val);
        return num > 0 ? num.toString() : "1";
      })
      .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
        message: "Limited time quantity must be a positive number.",
      }),
    limitedTimeUnit: z
      .string()
      .refine((val) => ["Hours", "Days", "Weeks", "Months"].includes(val), {
        message: "Limited time unit must be one of: Hours, Days, Weeks, Months",
      })
      .default("Months"),
    notificationChannelId: z
      .string()
      .min(1, "Notification channel ID is required to notify users.")
      .default("defaultChannelId"), // Provide a default value if needed
  })
  .default(defaultSchema);

// Type inference based on the schema
export type ServerFormData = z.infer<typeof serverFormSchema>;
