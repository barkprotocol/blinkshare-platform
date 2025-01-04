import { create } from 'zustand';

// Type definition for form data
interface BlinkFormData {
  title: string;
  description: string;
  iconUrl: string;
  stylePreset: 'default' | 'dark';
  serverId: string;
  code: string;
  fields: string[];
}

// Zustand store with more specific type for the state and set function
export const useBlinkStore = create<{
  formData: BlinkFormData;
  setFormData: (key: keyof BlinkFormData, value: string | string[]) => void;
  addField: () => void;
}>((set) => ({
  formData: {
    title: '',
    description: '',
    iconUrl: '',
    stylePreset: 'default',
    serverId: '',
    code: '',
    fields: [],
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
        fields: [...state.formData.fields, ''],
      },
    }));
  },
}));

// Form Component
const BlinkForm = () => {
  const { formData, setFormData, addField } = useBlinkStore();

  // Handle changes to form fields (text or array of strings)
  const handleInputChange = (key: keyof BlinkFormData, value: string | string[]) => {
    setFormData(key, value);
  };

  // Handle changes to dynamic fields
  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...formData.fields];
    updatedFields[index] = value;
    setFormData('fields', updatedFields);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to the server)
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="iconUrl">Icon URL:</label>
        <input
          id="iconUrl"
          type="text"
          value={formData.iconUrl}
          onChange={(e) => handleInputChange('iconUrl', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="stylePreset">Style Preset:</label>
        <select
          id="stylePreset"
          value={formData.stylePreset}
          onChange={(e) => handleInputChange('stylePreset', e.target.value as 'default' | 'dark')}
        >
          <option value="default">Default</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div>
        <label htmlFor="serverId">Server ID:</label>
        <input
          id="serverId"
          type="text"
          value={formData.serverId}
          onChange={(e) => handleInputChange('serverId', e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="code">Code:</label>
        <input
          id="code"
          type="text"
          value={formData.code}
          onChange={(e) => handleInputChange('code', e.target.value)}
        />
      </div>
      <div>
        <label>Fields:</label>
        {formData.fields.map((field, index) => (
          <div key={index}>
            <input
              type="text"
              value={field}
              onChange={(e) => handleFieldChange(index, e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addField}
          disabled={formData.fields.length >= 10}
        >
          Add Field
        </button>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default BlinkForm;
