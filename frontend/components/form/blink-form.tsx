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
  removeField: (index: number) => void;
  updateField: (index: number, key: 'label' | 'value', newValue: string) => void; // Add specific field update
  resetForm: () => void;
  resetFields: () => void; // Reset only the fields array
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
  
  // Set individual form data
  setFormData: (key, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    }));
  },

  // Add a new field
  addField: () => {
    set((state) => ({
      formData: {
        ...state.formData,
        fields: [...state.formData.fields, { label: '', value: '' }],
      },
    }));
  },

  // Remove a specific field
  removeField: (index) => {
    set((state) => ({
      formData: {
        ...state.formData,
        fields: state.formData.fields.filter((_, i) => i !== index),
      },
    }));
  },

  // Update a specific field's label or value
  updateField: (index, key, newValue) => {
    set((state) => ({
      formData: {
        ...state.formData,
        fields: state.formData.fields.map((field, i) =>
          i === index ? { ...field, [key]: newValue } : field
        ),
      },
    }));
  },

  // Reset the entire form
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

  // Reset only the fields array
  resetFields: () => {
    set((state) => ({
      formData: {
        ...state.formData,
        fields: [{ label: '', value: '' }],
      },
    }));
  },
}));
