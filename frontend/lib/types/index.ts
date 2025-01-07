import { Dispatch, SetStateAction } from "react";

// Utility Types
type InputValue = string | number | readonly string[] | null | undefined;

// FormData Interface
export interface IFormData {
  [key: string]: InputValue;
}

export interface IGuild {
  id: string;
  name: string;
  iconUrl?: string; // Optional field
}

// SearchParamProps: Defines the shape of search and route parameters
export type SearchParamProps = {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
};

// Discord Types
export interface DiscordRole {
  id: string;
  name: string;
  price?: string;
  enabled?: boolean;
  position?: number;
  permissions?: string;
}

export interface DiscordServer {
  id: string;
  name: string;
  icon: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
  ownerWallet: string;
}

export type DiscordOAuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type ServerListResponse = {
  servers: Pick<DiscordServer, "id" | "name" | "icon">[];
};

// BlinkShare Types
export interface BlinkShareServerSettings {
  guildId: string;
  customTitle?: string;
  customIcon?: string;
  description: string;
  detailedDescription: string;
  selectedRoles: string[];
  ownerWallet: string;
}

export type BlinkData = {
  guildId: string;
  title: string;
  icon: string;
  description: string;
  detailedDescription: string;
  roles: DiscordRole[];
};

export interface BlinkAction {
  title: string;
  description: string;
  fields: string[];
}

export interface BlinkProps {
  action: BlinkAction;
  websiteText: string;
}

// Transaction Types
export interface TransactionDetails {
  roleId: string;
  amount: number;
  buyerWallet: string;
  sellerWallet: string;
}

export type BlinkShareApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type CreateBlinkRequest = BlinkShareServerSettings;
export type CreateBlinkResponse = BlinkShareApiResponse<{ blinkUrl: string }>;

export type GetBlinkDataRequest = { guildId: string; code: string };
export type GetBlinkDataResponse = BlinkShareApiResponse<BlinkData>;

export type ProcessTransactionRequest = TransactionDetails;
export type ProcessTransactionResponse = BlinkShareApiResponse<{
  success: boolean;
  roleAssigned: boolean;
}>;

// User Types
export type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];

export type ServerOwner = SupabaseUser & {
  ownedServers: string[];
};

export type DiscordMember = SupabaseUser & {
  discordId: string;
  joinedServers: string[];
};

export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// UI Types
export type RoleData = {
  blinkShareRolePosition: number;
  roles: DiscordRole[];
};

export interface ServerFormData extends FormData {
  id: string;
  address: InputValue;
  name: InputValue;
  website: string;
  notificationChannelId: string;
  useUsdc?: InputValue;
  limitedTimeRoles?: InputValue;
  limitedTimeQuantity: InputValue;
  limitedTimeUnit: string;
  iconUrl: InputValue;
  title: string;
  description: string;
  details: string;
  roles: string[];
}

export interface ServerFormProps {
  formData: ServerFormData;
  setFormData: Dispatch<SetStateAction<ServerFormData>>;
  roleData: RoleData;
  setRoleData: Dispatch<SetStateAction<RoleData>>;
  formErrors: Partial<Record<keyof ServerFormData, string>>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
  channels: { name: string; id: string }[];
}

// API Function Types
export type GetDiscordLoginUrl = (owner: boolean) => Promise<string>;

export type HandleDiscordCallback = (code: string) => Promise<{
  userId: string;
  username: string;
  guilds: DiscordServer[];
  token: string;
}>;

export type GetGuildRoles = (
  guildId: string,
  token: string
) => Promise<RoleData>;

export type CreateOrEditGuild = (
  guildData: BlinkShareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;

export type PatchGuild = (
  guildId: string,
  guildData: BlinkShareServerSettings,
  address: string,
  message: string,
  signature: string,
  token: string
) => Promise<DiscordServer>;
