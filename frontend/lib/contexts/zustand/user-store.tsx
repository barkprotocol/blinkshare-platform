import { set } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the shape of user data
interface UserData {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
}

// Define the Zustand store interface
interface UserState {
  token: string | null;
  userData: UserData | null;
  discordConnected: boolean;
  discordDisconnected: boolean;
  setToken: (token: string) => void;
  setUserData: (data: UserData) => void;
  setDiscordConnected: (connected: boolean) => void;
  setDiscordDisconnected: (disconnected: boolean) => void;
  reset: () => void;
  isLoggedIn: boolean;
}

// Zustand store creation
export const useUserStore = create(
  persist<UserState>(
    (set: (arg0: { token?: any; userData?: any; discordConnected?: any; discordDisconnected?: any; }) => any, get: any) => ({
      token: null,
      userData: null,
      discordConnected: false,
      discordDisconnected: false,
      setToken: (token: any) => set({ token }),
      setUserData: (data: any) => set({ userData: data }),
      setDiscordConnected: (connected: any) => set({ discordConnected: connected }),
      setDiscordDisconnected: (disconnected: any) => set({ discordDisconnected: disconnected }),
      reset: () =>
        set({
          token: null,
          userData: null,
          discordConnected: false,
          discordDisconnected: false,
        }),
      isLoggedIn: false, // Default to false initially
    }),
    {
      name: "user-storage",
      // Add a `onRehydrateStorage` to set `isLoggedIn` after hydration
      onRehydrateStorage: () => (state: UserState | undefined) => {
        if (state && state.token) {
          // Safely check if the state and token exist
          set({ isLoggedIn: true });
        }
      },
    }
  )
);
