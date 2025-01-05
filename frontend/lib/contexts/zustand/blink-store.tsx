import { FontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';
import { create } from 'zustand';

// Define the store
interface UserStore {
  token: string | null;
  isUserLoggedIn: () => boolean;
  setToken: (token: string) => void;
  clearUserData: () => void;
  checkTokenExpiry: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  token: null,
  isUserLoggedIn: () => !!set.getState().token,
  setToken: (token) => set({ token }),
  clearUserData: () => set({ token: null }),
  checkTokenExpiry: () => {
    const token = set.getState().token;
    if (token) {
      // Logic to check token expiry (e.g., decode token and check expiry)
      console.log("Checking token expiry...");
    }
  },
}));

export interface BlinkFormData {
  image: any;
  backgroundImage: any;
  font: FontFamily | undefined;
  title: string;
  description: string;
  fields: string[];
  iconUrl: string;
  stylePreset: string;
  serverId: string;
  code: string;
}

interface BlinkStore {
  formData: BlinkFormData;
  setFormData: (key: keyof BlinkFormData, value: string | string[]) => void;
  addField: () => void;
  removeField: (index: number) => void;
  updateField: (index: number, value: string) => void;
  resetFormData: () => void;
}

export const useBlinkStore = create<BlinkStore>((set) => ({
  formData: {
    title: '',
    description: '',
    fields: ['Field 1'], // Starting with a single field
    iconUrl: '',
    stylePreset: 'default',
    serverId: '',
    code: '',
    image: undefined,
    font: undefined,
    backgroundImage: undefined
  },
  
  // Set form data for specific keys
  setFormData: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),
  
  // Add a new field to the form
  addField: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        fields: [...state.formData.fields, `Field ${state.formData.fields.length + 1}`],
      },
    })),

  // Remove a field by its index
  removeField: (index) =>
    set((state) => {
      const fields = [...state.formData.fields];
      fields.splice(index, 1);
      return {
        formData: {
          ...state.formData,
          fields,
        },
      };
    }),

  // Update the value of a specific field
  updateField: (index, value) =>
    set((state) => {
      const updatedFields = [...state.formData.fields];
      updatedFields[index] = value;
      return {
        formData: {
          ...state.formData,
          fields: updatedFields,
        },
      };
    }),

  // Reset the form data to the initial state
  resetFormData: () =>
    set({
      formData: {
        title: '',
        description: '',
        fields: ['Field 1'],
        iconUrl: '',
        stylePreset: 'default',
        serverId: '',
        code: '',
        image: undefined,
        font: undefined,
        backgroundImage: undefined
      },
    }),
}));
