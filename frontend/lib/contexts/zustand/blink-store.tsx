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
  updateFieldLabel: (index: number, label: string) => void;
  validateForm: () => boolean;
}

export const useBlinkStore = create<BlinkStore>((set) => ({
  formData: {
    title: '',
    description: '',
    fields: ['Field 1'],
    iconUrl: '',
    stylePreset: 'default',
    serverId: '',
    code: '',
  },
  setFormData: (key, value) =>
    set((state) => {
      // Simple validation for title and description
      if ((key === 'title' || key === 'description') && !value) {
        console.error(`${key} cannot be empty`);
        return state;
      }
      return {
        formData: { ...state.formData, [key]: value },
      };
    }),
  addField: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        fields: [...state.formData.fields, `Field ${state.formData.fields.length + 1}`],
      },
    })),
  removeField: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        fields: state.formData.fields.filter((_, i) => i !== index),
      },
    })),
  updateFieldLabel: (index, label) =>
    set((state) => {
      const newFields = [...state.formData.fields];
      newFields[index] = label;
      return {
        formData: {
          ...state.formData,
          fields: newFields,
        },
      };
    }),
  validateForm: () => {
    const { title, description } = set.getState().formData;
    if (!title || !description) {
      console.error('Title and description are required.');
      return false;
    }
    return true;
  },
}));
