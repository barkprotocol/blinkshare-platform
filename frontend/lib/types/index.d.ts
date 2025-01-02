/* eslint-disable no-unused-vars */
import { ServerFormData } from "@/lib/zod-validation";

// ========================================
// Search Parameters Interface
declare type SearchParamProps = {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
};

// ========================================
// Discord Role and Server Types

// Refined role type with optional `position` and enhanced clarity
declare interface DiscordRole {
  id: string;
  name: string;
  price: string;
  enabled: boolean;
  position?: number; // Optional, could be omitted
}

// Updated server interface to handle optional fields and clarify purpose
declare type DiscordServer = {
  id: string;
  name: string;
  icon: string;
  customIcon?: string; // Optional custom icon for Blink
  description: string;
  detailedDescription: string; // Long server description
  roles: DiscordRole[];
  ownerWallet: string; // Wallet address of the server owner
};

// Define more specific interface for blinkshare server settings
declare type blinkshareServerSettings = {
  guildId: string;
  customTitle?: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  selectedRoles: string[]; // Role IDs selected for Blink
  ownerWallet: string;
};

// OAuth Response with clearer definitions
declare type DiscordOAuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

// Improved Server List Response interface
declare type ServerListResponse = {
  servers: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
};

// Blink Data with better clarity and added properties
declare type BlinkData = {
  guildId: string;
  title: string;
  icon: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
};

// Transaction details for better clarity in roles and transactions
declare type TransactionDetails = {
  roleId: string;
  amount: number;
  buyerWallet: string;
  sellerWallet: string;
};

// General API response format with better error handling
declare type blinkshareApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string; // Optional detailed error info
  };
};

// API request and response types

declare type CreateBlinkRequest = blinkshareServerSettings;

declare type CreateBlinkResponse = blinkshareApiResponse<{ blinkUrl: string }>;

// Handle Discord OAuth callback and fetch related user info
declare type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[];
  token: string;
}>;

// Fetch guild roles with better clarity on the return structure
declare type GetGuildRoles = (
  guildId: string,
  token: string
) => Promise<{ blinkshareRolePosition: number; roles: DiscordRole[] }>;

// Create or edit guild settings with better description
declare type CreateOrEditGuild = (
  guildData: blinkshareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// Patch guild data with better parameters
declare type PatchGuild = (
  guildId: string,
  guildData: blinkshareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// Role data structured for clarity in role-based actions
type RoleData = { blinkshareRolePosition: number; roles: DiscordRole[] };

// User types extending SupabaseUser for better database interaction
declare type ServerOwner = SupabaseUser & {
  ownedServers: string[]; // Array of guild IDs
};

declare type DiscordMember = SupabaseUser & {
  discordId: string;
  joinedServers: string[]; // Array of guild IDs
};

// ========================================
// UI Form Data and Props Definitions

// Server form data with clearer field names
declare type ServerFormData = {
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

// Simplified function signature for generating Discord login URL
declare type GetDiscordLoginUrl = (owner: boolean) => Promise<string>;

// Refined Discord callback handling function signature
declare type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[];
  token: string;
}>;

// Improved function signature for fetching guild roles with clearer parameters
declare type GetGuildRoles = (
  guildId: string,
  token: string
) => Promise<{ blinkshareRolePosition: number; roles: DiscordRole[] }>;

// Updated types for creating or editing guild with clear parameters
declare type CreateOrEditGuild = (
  guildData: blinkshareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

// ========================================
// Improved ServerFormProps with refined state management

declare interface ServerFormProps {
  formData: ServerFormData;
  setFormData: React.Dispatch<React.SetStateAction<ServerFormData>>;
  roleData: RoleData;
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>;
  formErrors: Partial<Record<keyof ServerFormData, string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  channels: { name: string; id: string }[];
}
