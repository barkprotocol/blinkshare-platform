import { useBlinkStore } from '@/lib/contexts/zustand/blink-store';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const BlinkMock = () => {
  const { formData, addField } = useBlinkStore();

  return (
    <Card className="w-full h-auto text-white">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={formData.iconUrl || "https://ucarecdn.com/69cf7fa0-0d1f-4e07-ad1e-946244f11adc/eyebg.png"}
            alt="Website icon"
            width={100}
            height={100}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <h1 className="text-primary text-lg font-semibold block mb-1">{formData.title || "Your Blink Title"}</h1>
        <p className="text-sm text-gray-400 mb-4">{formData.description || 'Your Blink Description'}</p>
        
        {formData.fields.map((field, index) => (
          <div key={index} className="mb-2">
            <label className="block text-sm text-gray-300">{field.label}</label>
            
            {/* Render different input types based on field value */}
            {field.valueOf === "textarea" ? (
              <Textarea
                placeholder={`Enter your ${field.label}`}
                className="text-white"
              />
            ) : (
              <Input
                placeholder={`Enter your ${field.label}`}
                className="text-white"
                type={field.valueOf} // Dynamically set input type (text, email, etc.)
              />
            )}
          </div>
        ))}
        
        {/* Button to add new fields, calling addField from the store */}
        <Button 
          onClick={addField} 
          className="mt-4"
        >
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlinkMock;
