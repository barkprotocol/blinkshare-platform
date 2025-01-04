import create from 'zustand';

interface UserState {
  token: string | null;
  userData: any;
  discordConnected: boolean;
  discordDisconnected: boolean;
  setToken: (token: string) => void;
  setUserData: (userData: any) => void;
  setDiscordConnected: (connected: boolean) => void;
  setDiscordDisconnected: (disconnected: boolean) => void;
}

export const useUserStore = create<UserState>((set: (arg0: { token?: any; userData?: any; discordConnected?: any; discordDisconnected?: any; }) => any) => ({
  token: null,
  userData: null,
  discordConnected: false,
  discordDisconnected: false,
  setToken: (token: any) => set({ token }),
  setUserData: (userData: any) => set({ userData }),
  setDiscordConnected: (connected: any) => set({ discordConnected: connected }),
  setDiscordDisconnected: (disconnected: any) => set({ discordDisconnected: disconnected }),
}));
