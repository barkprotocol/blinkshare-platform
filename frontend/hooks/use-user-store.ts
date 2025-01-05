import { create } from "zustand";

// Define the store's state and methods
interface UserState {
  token: string | null;
  userData: any;
  discordConnected: boolean;
  discordDisconnected: boolean;
  setToken: (token: string) => void;
  setUserData: (data: any) => void;
  setDiscordConnected: (connected: boolean) => void;
  setDiscordDisconnected: (disconnected: boolean) => void;
}

// Create the store with Zustand
export const useUserStore = create<UserState>((set) => ({
  token: null,
  userData: null,
  discordConnected: false,
  discordDisconnected: false,
  setToken: (token) => set({ token }),
  setUserData: (data) => set({ userData: data }),
  setDiscordConnected: (connected) => set({ discordConnected: connected }),
  setDiscordDisconnected: (disconnected) => set({ discordDisconnected: disconnected }),
}));
