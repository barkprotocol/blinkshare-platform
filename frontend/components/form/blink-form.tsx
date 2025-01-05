import { useBlinkStore } from "@/hooks/use-store";

const BlinkForm = () => {
  const {
    formData,
    setFormData,
    addField,
    removeField,
    updateField,
    resetForm,
    resetFields,
  } = useBlinkStore();

  const handleFieldUpdate = (index: number, key: 'label' | 'value', newValue: string) => {
    updateField(index, key, newValue);
  };

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData(key, value);
  };

  return (
    <form>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="iconUrl">Icon URL</label>
        <input
          id="iconUrl"
          type="text"
          value={formData.iconUrl}
          onChange={(e) => handleInputChange('iconUrl', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="stylePreset">Style Preset</label>
        <select
          id="stylePreset"
          value={formData.stylePreset}
          onChange={(e) => handleInputChange('stylePreset', e.target.value)}
        >
          <option value="default">Default</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div>
        <label htmlFor="serverId">Server ID</label>
        <input
          id="serverId"
          type="text"
          value={formData.serverId}
          onChange={(e) => handleInputChange('serverId', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="code">Code</label>
        <input
          id="code"
          type="text"
          value={formData.code}
          onChange={(e) => handleInputChange('code', e.target.value)}
        />
      </div>

      <div>
        <h3>Fields</h3>
        {formData.fields.map((field, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Label"
              value={field.label}
              onChange={(e) => handleFieldUpdate(index, 'label', e.target.value)}
            />
            <input
              type="text"
              placeholder="Value"
              value={field.value}
              onChange={(e) => handleFieldUpdate(index, 'value', e.target.value)}
            />
            <button type="button" onClick={() => removeField(index)}>
              Remove Field
            </button>
          </div>
        ))}
        <button type="button" onClick={addField}>
          Add Field
        </button>
      </div>

      <div>
        <button type="button" onClick={resetForm}>Reset Form</button>
        <button type="button" onClick={resetFields}>Reset Fields</button>
      </div>

      <div>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
    </form>
  );
};

export default BlinkForm;
