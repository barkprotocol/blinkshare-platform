import { useBlinkStore } from '@/lib/contexts/zustand/blink-store';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ReactElement, Key, JSXElementConstructor, ReactNode, ReactPortal } from 'react';

const BlinkForm = () => {
  const { formData, addField, updateField, removeField } = useBlinkStore();
  const { iconUrl, title, description, fields } = formData;

  return (
    <Card className="w-full h-auto text-white">
      <CardContent className="p-6">
        {/* Image Section */}
        <div className="flex items-center mb-4">
          <img
            src={iconUrl || "https://ucarecdn.com/69cf7fa0-0d1f-4e07-ad1e-946244f11adc/eyebg.png"}
            alt="Website icon"
            width={100}
            height={100}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Blink Title */}
        <h1 className="text-primary text-lg font-semibold block mb-1">{title || "Your Blink Title"}</h1>
        
        {/* Blink Description */}
        <p className="text-sm text-gray-400 mb-4">{description || 'Your Blink Description'}</p>
        
        {/* Dynamic Field Rendering */}
        {fields.map((field, index) => {
          // Ensure the key is valid (never null or undefined)
          const fieldKey = index.toString(); 

          return (
            <div key={fieldKey} className="mb-4">
              <label className="block text-sm text-gray-300">{field.label}</label>

              {/* Render Input or Textarea based on field type */}
              {field.type === 'textarea' ? (
                <Textarea
                  placeholder={`Enter your ${field.label}`}
                  className="text-white"
                  value={field.label || ''} // Ensure value is treated as string
                  onChange={(e) => updateField(index, e.target.value)} // Handle value update
                />
              ) : (
                <Input
                  placeholder={`Enter your ${field.label}`}
                  className="text-white"
                  value={field.label || ''} // Ensure value is treated as string
                  onChange={(e) => updateField(index, e.target.value)}
                />
              )}

              {/* Remove Field Button */}
              <Button onClick={() => removeField(index)} className="mt-2">
                Remove Field
              </Button>
            </div>
          );
        })}
        
        {/* Add Field Button */}
        <Button onClick={addField} className="mt-4">
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlinkForm;
