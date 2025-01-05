"use client";

import { useState, useRef } from "react";
import { useBlinkStore } from "@/lib/contexts/zustand/blink-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import html2canvas from "html2canvas";

const CreateABlinkPage = () => {
  const { formData, setFormData } = useBlinkStore();
  const previewRef = useRef<HTMLDivElement>(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const handleFieldChange = (key: string, value: any) => {
    setFormData(key, value);
  };

  const handleBackgroundImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackgroundImage(URL.createObjectURL(file));
    }
  };

  const downloadPreviewAsImage = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current);
      const link = document.createElement("a");
      link.download = "blink-preview.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-40 bg-gray-100 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl text-black font-semibold mb-8">Create Your Blink</h1>

      {/* Input Section */}
      <Card className="w-full sm:w-3/4 lg:w-1/2 bg-white shadow-md">
        <CardContent className="p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="text-black bg-gray-100 placeholder-gray-400"
              placeholder="Enter Title"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="text-black bg-gray-100 placeholder-gray-400"
              placeholder="Enter Description"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFieldChange("image", URL.createObjectURL(file));
                }
              }}
              className="text-black bg-gray-100"
            />
          </div>

          {/* Background Image Upload */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Background Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageChange}
              className="text-black bg-gray-100"
            />
          </div>

          {/* Background Color */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Background Color</label>
            <Input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-16 h-10"
            />
          </div>

          {/* Font */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">Font</label>
            <select
              value={formData.font}
              onChange={(e) => handleFieldChange("font", e.target.value)}
              className="w-full text-black bg-gray-100 p-2 rounded-md"
            >
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <div className="w-full sm:w-3/4 lg:w-1/2">
        <h2 className="text-2xl text-black font-semibold mb-4 text-center">Preview</h2>

        <div
          ref={previewRef}
          className="relative w-full bg-white shadow-md overflow-hidden"
          style={{
            backgroundColor: backgroundColor,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            fontFamily: formData.font as unknown as string,
          }}
        >
          {formData.image && (
            <img
              src={formData.image}
              alt="Blink Preview"
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">{formData.title}</h3>
            <p className="text-gray-600">{formData.description}</p>
          </div>
        </div>

        <Button
          onClick={downloadPreviewAsImage}
          className="mt-6 w-full bg-gray-950 text-white"
        >
          Download
        </Button>
      </div>
    </div>
  );
};

export default CreateABlinkPage;
