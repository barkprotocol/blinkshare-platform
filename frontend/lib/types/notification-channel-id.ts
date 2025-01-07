import { z } from "zod";
import { DiscordServer } from "./discord-server";

// Default form data schema
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

// Zod schema for server form validation
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
    address: z.string().min(1, "Address is required"),
    website: z
      .string()
      .nullable()
      .refine(
        (url) => {
          if (!url) return true; // Allow null or empty string
          return /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i.test(url); // URL regex validation
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
              message: "Amount must be a valid number or decimal greater than 0",
            })
            .transform((val) => parseFloat(val).toString()), // Transform amount to string
        })
      )
      .min(1, "At least one role is required"),
    useUsdc: z.boolean().default(false),
    limitedTimeRoles: z.boolean().default(false),
    limitedTimeQuantity: z
      .string()
      .default("1")
      .transform((val) => parseInt(val, 10).toString()),
    limitedTimeUnit: z
      .string()
      .refine((val) => ["Hours", "Days", "Weeks", "Months"].includes(val))
      .default("Months"),
    notificationChannelId: z
      .string()
      .nullable()
      .min(1, "Notification channel is required"),
  })
  .default(defaultSchema);

// Renamed type to avoid conflict with imports
export type FormDataSchema = z.infer<typeof serverFormSchema>;

// Database schema types
declare global {
  // Assuming you have a Supabase or similar database schema
  type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            username: string;
            email: string;
            // other fields...
          };
        };
        // other tables...
      };
    };
  };
}

// Export the types needed
export type ServerFormData = FormDataSchema; // Use the renamed type
export type ServerOwner = SupabaseUser & {
  ownedServers: string[];
};

export type DiscordMember = SupabaseUser & {
  discordId: string;
  joinedServers: string[];
};

export type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// UI Types
export interface ServerFormProps {
  formData: FormDataSchema;
  setFormData: React.Dispatch<React.SetStateAction<FormDataSchema>>;
  formErrors: Partial<Record<keyof FormDataSchema, string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  channels: { name: string; id: string }[];
}

// Additional types as required
export interface BlinkAction {
  title: string;
  description: string;
  fields: string[];
}

export interface BlinkProps {
  action: BlinkAction;
  websiteText: string;
}

// API Function Types
export type GetDiscordLoginUrl = (owner: boolean) => Promise<string>;

export type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[];
  token: string;
}>;

// Add other necessary types here...
