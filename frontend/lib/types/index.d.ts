/* eslint-disable no-unused-vars */
import { SupabaseUser } from "@/lib/types";
import { ServerFormData } from "@/lib/zod-validation";

// ========================================
// Search Parameters Interface

declare type SearchParamProps = {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
};

// ========================================
// Discord Role and Server Types

export interface Role {
  id: string;
  name: string;
  price: string;
  position?: number;
  enabled: boolean;
}

export interface RoleData {
  roles: Role[]; // Array of roles
  blinkShareRolePosition: number; // Role position field
}

declare interface DiscordRole {
  id: string;
  name: string;
  price: string;
  enabled: boolean;
  position?: number;
}

declare type DiscordServer = {
  id: string;
  name: string;
  icon: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
  ownerWallet: string;
};

declare type BlinkshareServerSettings = {
  guildId: string;
  customTitle?: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  selectedRoles: string[];
  ownerWallet: string;
};

// OAuth Response with definitions
declare type DiscordOAuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

// Server List Response interface
declare type ServerListResponse = {
  servers: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
};

// Blink Data with clarity and added properties
declare type BlinkData = {
  guildId: string;
  title: string;
  icon: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
};

// Transaction details for clarity in roles and transactions
declare type TransactionDetails = {
  roleId: string;
  amount: number;
  buyerWallet: string;
  sellerWallet: string;
};

// General API response format with error handling
declare type BlinkshareApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string; // Optional detailed error info
  };
};

// API request and response types

declare type CreateBlinkRequest = BlinkshareServerSettings;

declare type CreateBlinkResponse = BlinkshareApiResponse<{ blinkUrl: string }>;

// Handle Discord OAuth callback and fetch related user info
declare type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[];
  token: string;
}>;

// Fetch guild roles with clarity on the return structure
declare type GetGuildRoles = (
  guildId: string,
  token: string
) => Promise<{ blinkshareRolePosition: number; roles: DiscordRole[] }>;

// Create or edit guild settings with description
declare type CreateOrEditGuild = (
  guildData: BlinkshareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// Patch guild data with parameters
declare type PatchGuild = (
  guildId: string,
  guildData: BlinkshareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// Role data structured for role-based actions
declare type RoleData = {
  [x: string]: number; // This can be adjusted based on your use case
  blinkshareRolePosition: number;
  roles: DiscordRole[];
};

// User types extending SupabaseUser for database interaction
declare type ServerOwner = SupabaseUser & {
  ownedServers: string[]; // Array of guild IDs
};

declare type DiscordMember = SupabaseUser & {
  discordId: string;
  joinedServers: string[]; // Array of guild IDs
};

// ========================================
// UI Form Data and Props Definitions

// Server form data with field names
declare type ServerFormData = {
  [x: string]: any;
  title: string;
  description: string;
  details: string;
  roles: string[];
};

// Blink action interface with description and fields
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

// Function signature for generating Discord login URL
declare type GetDiscordLoginUrl = (owner: boolean) => Promise<string>;

// Discord callback handling function signature
declare type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[];
  token: string;
}>;

// Function signature for fetching guild roles with parameters
declare type GetGuildRoles = (
  guildId: string,
  token: string
) => Promise<{ blinkshareRolePosition: number; roles: DiscordRole[] }>;

// Types for creating or editing guild with parameters
declare type CreateOrEditGuild = (
  guildData: BlinkshareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// ========================================
// ServerFormProps with refined state management

// Define FormErrors type (if not already defined)
declare type FormErrors = {
  [key: string]: string[]; // Object with field names as keys and an array of error messages
};

declare interface ServerFormProps {
  formData: ServerFormData;
  setFormData: React.Dispatch<React.SetStateAction<ServerFormData>>;
  roleData: RoleData;
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>;
  formErrors: FormErrors; // Ensure formErrors is typed correctly
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  channels: { name: string; id: string }[];
}