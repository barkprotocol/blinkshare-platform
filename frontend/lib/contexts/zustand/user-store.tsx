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
    (set, get) => ({
      token: null,
      userData: null,
      discordConnected: false,
      discordDisconnected: false,
      setToken: (token) => set({ token }),
      setUserData: (data) => set({ userData: data }),
      setDiscordConnected: (connected) => set({ discordConnected: connected }),
      setDiscordDisconnected: (disconnected) =>
        set({ discordDisconnected: disconnected }),
      reset: () =>
        set({
          token: null,
          userData: null,
          discordConnected: false,
          discordDisconnected: false,
        }),
      isLoggedIn: !!get().token,
    }),
    {
      name: "user-storage",
    }
  )
);
