import { create } from 'zustand';

interface BlinkFormData {
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
      },
    }),
}));
