import { create } from 'zustand';

interface BlinkFormData {
  title: string;
  description: string;
  iconUrl: string;
  stylePreset: 'default' | 'dark';
  serverId: string;
  code: string;
  fields: string[];
}

interface BlinkStore {
  formData: BlinkFormData;
  setFormData: <K extends keyof BlinkFormData>(key: K, value: BlinkFormData[K]) => void;
  addField: (value?: string) => void;
  removeField: (index: number) => void;
}

export const useBlinkStore = create<BlinkStore>((set) => ({
  formData: {
    title: '',
    description: '',
    iconUrl: '',
    stylePreset: 'default',
    serverId: '',
    code: '',
    fields: [],
  },
  setFormData: (key, value) => set((state) => ({
    formData: {
      ...state.formData,
      [key]: value,
    },
  })),
  addField: (value = '') => set((state) => ({
    formData: {
      ...state.formData,
      fields: [...state.formData.fields, value],
    },
  })),
  removeField: (index: number) => set((state) => ({
    formData: {
      ...state.formData,
      fields: state.formData.fields.filter((_, i) => i !== index),
    },
  })),
}));
