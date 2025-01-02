import { create } from "zustand";

interface UserState {
  token: string | null;
  userData: any;
  discordConnected: boolean;
  discordDisconnected: boolean;
  discordClientId: number;
  selectedGuildName: string | null;
  selectedGuildImage: string | null;
  selectedGuildId: string | null;
  setToken: (token: string) => void;
  setUserData: (userData: any) => void;
  setDiscordConnected: (connected: boolean) => void;
  setDiscordDisconnected: (disconnected: boolean) => void;
  setSelectedGuildName: (name: string | null) => void;
  setSelectedGuildImage: (image: string | null) => void;
  setSelectedGuildId: (id: string | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  token: null,
  userData: null,
  discordConnected: false,
  discordDisconnected: false,
  discordClientId: 1324299574336290866,
  selectedGuildName: null,
  selectedGuildImage: null,
  selectedGuildId: null,
  setToken: (token) => set({ token, discordConnected: !!token }),
  setUserData: (userData) => set({ userData }),
  setDiscordConnected: (connected) => set({ discordConnected: connected }),
  setDiscordDisconnected: (disconnected) =>
    set({ discordDisconnected: disconnected }),
  setSelectedGuildName: (name) => set({ selectedGuildName: name }),
  setSelectedGuildImage: (image) => set({ selectedGuildImage: image }),
  setSelectedGuildId: (id) => set({ selectedGuildId: id }),
}));
