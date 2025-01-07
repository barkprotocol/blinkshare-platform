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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Perform form submission logic
      console.log("Submitting form data:", formData);
      // Add any further logic here, e.g., API calls.
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <input
          id="description"
          type="text"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Icon URL Field */}
      <div>
        <label htmlFor="iconUrl" className="block text-sm font-medium">Icon URL</label>
        <input
          id="iconUrl"
          type="text"
          value={formData.iconUrl}
          onChange={(e) => handleInputChange('iconUrl', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Style Preset Field */}
      <div>
        <label htmlFor="stylePreset" className="block text-sm font-medium">Style Preset</label>
        <select
          id="stylePreset"
          value={formData.stylePreset}
          onChange={(e) => handleInputChange('stylePreset', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        >
          <option value="default">Default</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Server ID Field */}
      <div>
        <label htmlFor="serverId" className="block text-sm font-medium">Server ID</label>
        <input
          id="serverId"
          type="text"
          value={formData.serverId}
          onChange={(e) => handleInputChange('serverId', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Code Field */}
      <div>
        <label htmlFor="code" className="block text-sm font-medium">Code</label>
        <input
          id="code"
          type="text"
          value={formData.code}
          onChange={(e) => handleInputChange('code', e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>

      {/* Dynamic Fields Section */}
      <div>
        <h3 className="text-lg font-medium">Fields</h3>
        {formData.fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Label"
                value={field.label}
                onChange={(e) => handleFieldUpdate(index, 'label', e.target.value)}
                className="block w-1/2 border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Value"
                value={field.value}
                onChange={(e) => handleFieldUpdate(index, 'value', e.target.value)}
                className="block w-1/2 border border-gray-300 rounded-md p-2"
              />
            </div>
            <button
              type="button"
              onClick={() => removeField(index)}
              className="text-red-600 mt-2"
            >
              Remove Field
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addField}
          className="mt-2 bg-gray-950 text-white py-2 px-4 rounded-md"
        >
          Add Field
        </button>
      </div>

      {/* Form Reset and Submit Section */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={resetForm}
          className="bg-gray-500 text-white py-2 px-4 rounded-md"
        >
          Reset Form
        </button>
        <button
          type="button"
          onClick={resetFields}
          className="bg-gray-500 text-white py-2 px-4 rounded-md"
        >
          Reset Fields
        </button>
      </div>

      {/* Displaying Form Data */}
      <div className="mt-4">
        <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(formData, null, 2)}</pre>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-gray-950 text-white py-3 rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default BlinkForm;
