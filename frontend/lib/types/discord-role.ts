// Type definition for a single Discord role
export interface DiscordRole {
  id: string;          // The unique identifier for the role
  name: string;        // The name of the role
  color: number;       // Color associated with the role (usually in RGB format)
  hoist: boolean;      // Whether the role should be displayed separately in the sidebar
  position: number;    // The position of the role (higher number = higher position)
  permissions: string[]; // List of permissions granted to the role
  managed: boolean;    // Whether the role is managed by an external service (like a bot)
  mentionable: boolean; // Whether the role can be mentioned
}

// Optional: You may also want to include the roles of a server (guild)
export interface GuildRolesResponse {
  roles: DiscordRole[];    // List of roles for the given guild
  blinkShareRolePosition: number; // Position of a specific role (e.g., "blink share" role)
}
