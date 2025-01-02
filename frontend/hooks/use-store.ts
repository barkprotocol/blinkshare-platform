import { useEffect } from 'react';
import { useUserStore } from '@/lib/contexts/zustand/user-store';
import { useBlinkStore } from '@/lib/contexts/zustand/blink-store';

// Custom hook to interact with the user and blink stores
export const useStore = () => {
  const userStore = useUserStore();
  const blinkStore = useBlinkStore();

  useEffect(() => {
    // Example: Check if the user is logged in and update the user state
    const token = localStorage.getItem('discordToken');
    if (token && !userStore.token) {
      userStore.setToken(token);
    }
  }, [userStore]);

  const updateBlinkFormData = (key: keyof BlinkFormData, value: string | string[]) => {
    blinkStore.setFormData(key, value);
  };

  const addNewField = () => {
    blinkStore.addField();
  };

  return {
    userStore,
    blinkStore,
    updateBlinkFormData,
    addNewField
  };
};
