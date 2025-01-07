import create from 'zustand';

// Persistence middleware
const persist = (config: any) => (set: any, get: any, api: any) => {
  const storedState = localStorage.getItem('zustand-state');
  if (storedState) {
    set(JSON.parse(storedState));
  }

  return config(
    (args: any) => {
      set(args);
      localStorage.setItem('zustand-state', JSON.stringify(get()));
    },
    get,
    api
  );
};

// Define store with persistence
export const useStore = create(
  persist((set: (arg0: { (state: any): { count: any; }; (state: any): { count: number; }; }) => any) => ({
    count: 0,
    increase: () => set((state: any) => ({ count: state.count + 1 })),
    decrease: () => set((state: any) => ({ count: state.count - 1 }))
  }))
);
