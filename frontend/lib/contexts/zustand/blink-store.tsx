import { create } from 'zustand';

// Type definition for form data
interface BlinkFormData {
  title: string;
  description: string;
  iconUrl: string;
  stylePreset: 'default' | 'dark';
  serverId: string;
  code: string;
  fields: { label: string; value: string }[];
}

// Zustand store
export const useBlinkStore = create<{
  formData: BlinkFormData;
  setFormData: <K extends keyof BlinkFormData>(
    key: K,
    value: BlinkFormData[K]
  ) => void;
  addField: () => void;
  removeField: (index: number) => void; // Optional: To remove fields
  resetForm: () => void; // Optional: To reset the form to default values
}>((set) => ({
  formData: {
    title: '',
    description: '',
    iconUrl: '',
    stylePreset: 'default',
    serverId: '',
    code: '',
    fields: [{ label: '', value: '' }], // Start with one field
  },
  setFormData: (key, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    }));
  },
  addField: () => {
    set((state) => ({
      formData: {
        ...state.formData,
        fields: [...state.formData.fields, { label: '', value: '' }],
      },
    }));
  },
  removeField: (index) => {
    set((state) => ({
      formData: {
        ...state.formData,
        fields: state.formData.fields.filter((_, i) => i !== index),
      },
    }));
  },
  resetForm: () => {
    set({
      formData: {
        title: '',
        description: '',
        iconUrl: '',
        stylePreset: 'default',
        serverId: '',
        code: '',
        fields: [{ label: '', value: '' }],
      },
    });
  },
}));
