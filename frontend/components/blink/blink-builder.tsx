import { useBlinkStore } from '@/lib/contexts/zustand/blink-store';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const BlinkMock = () => {
  const { formData, addField } = useBlinkStore();
  
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
        {fields.map((field, index) => (
          <div key={index} className="mb-4">
            <label className="block text-sm text-gray-300">{field.label}</label>

            {/* Dynamically render input fields based on the field type */}
            {field.valueOf === "textarea" ? (
              <Textarea
                placeholder={`Enter your ${field.label}`}
                className="text-white"
              />
            ) : (
              <Input
                placeholder={`Enter your ${field.label}`}
                className="text-white"
                type={field.valueOf} // Dynamically set the input type
              />
            )}
          </div>
        ))}
        
        {/* Add Field Button */}
        <Button onClick={addField} className="mt-4">
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlinkMock;
