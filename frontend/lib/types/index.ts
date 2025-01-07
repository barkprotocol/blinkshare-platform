import { Dispatch, SetStateAction } from "react";

// SearchParamProps: Defines the shape of search and route parameters
declare type SearchParamProps = {
    params: { [key: string]: string }; // Route parameters
    searchParams: { [key: string]: string | string[] | undefined }; // Query parameters
  };
  
  // Discord-related Types
  
  export type DiscordRole = {
    id: string;
    name: string;
    price?: string; // Optional field for price
    enabled?: boolean; // Optional field for enabled status
    position?: number; // Optional field for role position
    permissions?: string; // Optional field for permissions
  };
  
  // DiscordServer: Represents a Discord server with roles and owner details
  declare type DiscordServer = {
    id: string;
    name: string;
    icon: string;
    customIcon?: string; // Optional custom icon URL
    description: string;
    detailedDescription: string;
    roles: DiscordRole[]; // List of roles
    ownerWallet: string; // Wallet address of the server owner
  };
  
  // BlinkShareServerSettings: Settings for BlinkShare integration
  declare type BlinkShareServerSettings = {
    guildId: string; // Discord guild ID
    customTitle?: string; // Optional custom title
    customIcon?: string; // Optional custom icon URL
    description: string;
    detailedDescription: string;
    selectedRoles: string[]; // Selected role IDs
    ownerWallet: string; // Server owner's wallet address
  };
  
  // DiscordOAuthResponse: Response from Discord OAuth authentication
  declare type DiscordOAuthResponse = {
    accessToken: string; // Access token
    refreshToken: string; // Refresh token
    expiresIn: number; // Expiry time in seconds
  };
  
  // ServerListResponse: List of Discord servers
  declare type ServerListResponse = {
    servers: { id: string; name: string; icon: string }[];
  };
  
  // BlinkData: Data related to a BlinkShare server
  declare type BlinkData = {
    guildId: string;
    title: string;
    icon: string;
    description: string;
    detailedDescription: string;
    roles: DiscordRole[];
  };
  
  // TransactionDetails: Data for a role transaction
  declare type TransactionDetails = {
    roleId: string; // Role ID
    amount: number; // Transaction amount
    buyerWallet: string; // Buyer's wallet
    sellerWallet: string; // Seller's wallet
  };
  
  // BlinkShareApiResponse: API response wrapper for BlinkShare
  declare type BlinkShareApiResponse<T> = {
    success: boolean; // Request success status
    data?: T; // Optional data on success
    error?: string; // Optional error message
  };
  
  // API request and response types
  declare type CreateBlinkRequest = BlinkShareServerSettings;
  
  declare type CreateBlinkResponse = BlinkShareApiResponse<{ blinkUrl: string }>;
  
  declare type GetBlinkDataRequest = { guildId: string; code: string };
  
  declare type GetBlinkDataResponse = BlinkShareApiResponse<BlinkData>;
  
  declare type ProcessTransactionRequest = TransactionDetails;
  
  declare type ProcessTransactionResponse = BlinkShareApiResponse<{
    success: boolean;
    roleAssigned: boolean;
  }>;
  
  // User Types
  
  declare type ServerOwner = SupabaseUser & {
    ownedServers: string[];
  };
  
  declare type DiscordMember = SupabaseUser & {
    discordId: string;
    joinedServers: string[];
  };
  
  // Supabase User Types
  
  declare type SupabaseUser = Database["public"]["Tables"]["users"]["Row"];
  
  declare type SupabaseResponse<T> = {
    data: T | null;
    error: Error | null;
  };
  
  // UI Types
  
  declare type ServerFormData = {
    name: string | number | readonly string[] | undefined;
    website: string;
    notificationChannelId: string;
    useUsdc: boolean | undefined;
    limitedTimeRoles: boolean | undefined;
    limitedTimeQuantity: string | number | readonly string[] | undefined;
    limitedTimeUnit: string;
    id(id: any, roleData: RoleData, setRoleData: Dispatch<SetStateAction<RoleData>>, setIsRefreshingRoles: Dispatch<SetStateAction<boolean>>, setRoleErrors: Dispatch<SetStateAction<{ [key: string]: boolean; }>>): void;
    iconUrl: string | number | readonly string[] | undefined;
    title: string;
    description: string;
    details: string;
    roles: string[];
  };
  
  // BlinkAction: Represents a BlinkShare action
  export interface BlinkAction {
    title: string;
    description: string;
    fields: string[];
  }
  
  // BlinkProps: Properties for BlinkShare component
  export interface BlinkProps {
    action: BlinkAction;
    websiteText: string;
  }
  
  // API Function Types
  
  declare type GetDiscordLoginUrl = (owner: boolean) => Promise<string>;
  
  declare type HandleDiscordCallback = (code: string) => Promise<{
    userId: string;
    username: string;
    guilds: DiscordServer[];
    token: string;
  }>;
  
  declare type GetGuildRoles = (
    guildId: string,
    token: string
  ) => Promise<{ blinkShareRolePosition: number; roles: DiscordRole[] }>;
  
  declare type CreateOrEditGuild = (
    guildData: BlinkShareServerSettings,
    address: string,
    message: string,
    signature: string,
    token: string
  ) => Promise<DiscordServer>;
  
  declare type PatchGuild = (
    guildId: string,
    guildData: BlinkShareServerSettings,
    address: string,
    message: string,
    signature: string,
    token: string
  ) => Promise<DiscordServer>;
  
  // RoleData: Represents guild role data
  export type RoleData = {
    blinkShareRolePosition: number;
    roles: DiscordRole[];
  };
  
  // ServerFormProps: Props for the server form component
  export declare interface ServerFormProps {
    formData: ServerFormData;
    setFormData: React.Dispatch<React.SetStateAction<ServerFormData>>;
    roleData: RoleData;
    setRoleData: React.Dispatch<React.SetStateAction<RoleData>>;
    formErrors: Partial<Record<keyof ServerFormData, string>>;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    isLoading: boolean;
    channels: { name: string; id: string }[];
  }
  