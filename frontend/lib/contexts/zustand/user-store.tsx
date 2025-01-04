import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define types for user and guild data
interface UserData {
  [x: string]: any;
  id: string;
  username: string;
  email: string;
  // Add any other relevant user data fields here
}

interface GuildData {
  name: string | null;
  image: string | null;
  id: string | null;
}

interface UserState {
  token: string | null;
  userData: UserData | null;
  discordConnected: boolean;
  selectedGuild: GuildData;
  tokenTimestamp: number | null; // Track timestamp for token expiry
  inactivityLimit: number; // The limit in milliseconds for token expiry

  // Methods for setting and clearing state
  setToken: (token: string | null) => void;
  setUserData: (userData: UserData | null) => void;
  setDiscordConnected: (connected: boolean) => void;
  setSelectedGuild: (guild: GuildData) => void;
  clearUserData: () => void;
  checkTokenExpiry: () => void; // Method to check if the token has expired
  isUserLoggedIn: () => boolean; // Helper method to check login status
}

// Custom localStorage wrapper
const customStorage = {
  getItem: (key: string) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      token: null,
      userData: null,
      discordConnected: false,
      selectedGuild: { name: null, image: null, id: null },
      tokenTimestamp: null,
      inactivityLimit: 3600000, // 1 hour inactivity limit in milliseconds

      // Set the token and automatically manage the discord connection state
      setToken: (token) => {
        const now = Date.now();
        set({
          token,
          discordConnected: !!token,
          tokenTimestamp: token ? now : null,
        });
      },

      // Set the user data
      setUserData: (userData) => set({ userData }),

      // Set Discord connection state
      setDiscordConnected: (connected) => set({ discordConnected: connected }),

      // Set the selected guild information
      setSelectedGuild: (guild) => set({ selectedGuild: guild }),

      // Clear the user data from state
      clearUserData: () => set({
        token: null,
        userData: null,
        discordConnected: false,
        selectedGuild: { name: null, image: null, id: null },
        tokenTimestamp: null,
      }),

      // Method to check if the token has expired
      checkTokenExpiry: () => {
        const { tokenTimestamp, inactivityLimit } = get();
        if (tokenTimestamp && Date.now() - tokenTimestamp > inactivityLimit) {
          set({
            token: null,
            discordConnected: false,
            tokenTimestamp: null,
          });
        }
      },

      // Helper method to check if the user is logged in
      isUserLoggedIn: () => {
        const { token, tokenTimestamp, inactivityLimit } = get();
        return !!token && (!tokenTimestamp || Date.now() - tokenTimestamp <= inactivityLimit);
      },
    }),
    {
      name: "user-storage", // The name of the storage key
      partialize: (state) => ({
        token: state.token,
        userData: state.userData,
        selectedGuild: state.selectedGuild,
        tokenTimestamp: state.tokenTimestamp,
        discordConnected: state.discordConnected,
      }),
      storage: customStorage, // Using customStorage instead of localStorage directly
    }
  )
);
