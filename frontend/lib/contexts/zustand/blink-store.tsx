import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

// Define the BlinkFormData interface
interface BlinkFormData {
  font: string | number | readonly string[] | undefined;
  image: string | null;
  title: string;
  description: string;
  fields: { label: string; type: string }[];
  iconUrl: string;
  stylePreset: string;
  serverId: string;
  code: string;
}

interface BlinkStore {
  formData: BlinkFormData;
  setFormData: (key: keyof BlinkFormData, value: BlinkFormData[keyof BlinkFormData]) => void;
  addField: () => void;
  updateField: (index: number, value: string) => void;
  removeField: (index: number) => void;
}

export const useBlinkStore = create<BlinkStore>((set) => ({
  formData: {
    title: '',
    description: '',
    fields: [],
    iconUrl: '',
    stylePreset: '',
    serverId: '',
    code: '',
    font: undefined,
    image: null,
  },
  setFormData: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    })),
  addField: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        fields: [...state.formData.fields, { label: '', type: 'text' }],
      },
    })),
  updateField: (index, value) =>
    set((state) => {
      const newFields = [...state.formData.fields];
      newFields[index] = { ...newFields[index], label: value };
      return {
        formData: {
          ...state.formData,
          fields: newFields,
        },
      };
    }),
  removeField: (index) =>
    set((state) => {
      const newFields = state.formData.fields.filter((_, i) => i !== index);
      return {
        formData: {
          ...state.formData,
          fields: newFields,
        },
      };
    }),
}));

// User Authentication Store
interface UserStore {
  token: string | null;
  isUserLoggedIn: () => boolean;
  setToken: (token: string) => void;
  clearUserData: () => void;
  checkTokenExpiry: () => void;
}

interface DecodedToken {
  exp: number; // Expiry timestamp in seconds
  [key: string]: any; // Other properties in the token
}

export const useUserStore = create<UserStore>((set, get) => ({
  token: null,
  isUserLoggedIn: () => !!get().token,
  setToken: (token) => set({ token }),
  clearUserData: () => set({ token: null }),
  checkTokenExpiry: () => {
    const token = get().token;
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token); // Decode the token
        const expiry = decoded.exp * 1000; // Convert expiry time to milliseconds
        const now = Date.now();
        
        if (now > expiry) {
          console.log("Token has expired.");
          set({ token: null }); // Clear expired token
        } else {
          console.log("Token is still valid.");
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  },
}));
