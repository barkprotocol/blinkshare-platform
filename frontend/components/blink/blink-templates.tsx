"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const BlinkTemplates = () => {
  // Mock data for the cards
  const templates = [
    {
      title: "Template 1",
      description: "This is a description for the first template. It's a great starting point for your project.",
      iconUrl: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp",
    },
    {
      title: "Template 2",
      description: "This template is designed for fast and efficient workflows. Use it to boost your productivity.",
      iconUrl: "https://ucarecdn.com/5b7766db-9bc5-4ea0-8425-c12f812cd230/template2.webp",
    },
    {
      title: "Template 3",
      description: "A flexible template with plenty of room for customization. Perfect for creative projects.",
      iconUrl: "https://ucarecdn.com/1fa58525-d95a-4234-99cd-4926ed8322cc/template3.webp",
    },
    {
      title: "Template 4",
      description: "A modern and sleek template ideal for showcasing professional work.",
      iconUrl: "https://ucarecdn.com/35f7b42f-e658-4b3f-98c4-69f67f1e8bcf/template4.webp",
    },
    {
      title: "Template 5",
      description: "Template 5 offers a minimalist design, perfect for simple, no-fuss content creation.",
      iconUrl: "https://ucarecdn.com/9ccf1c5a-1cb7-4f95-b951-2088d8b215e4/template5.webp",
    },
    {
      title: "Template 6",
      description: "A bold and vibrant template for those who want to make a statement with their content.",
      iconUrl: "https://ucarecdn.com/8a60fe35-e8c0-4c5e-9270-50b3bfb4d179/template6.webp",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template, index) => (
        <Card key={index} className="w-full h-auto text-white">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <img
                src={template.iconUrl}
                alt={`${template.title} icon`}
                width={100}
                height={100}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <h2 className="text-primary text-xl font-semibold mb-2">{template.title}</h2>
            <p className="text-sm text-gray-400 mb-4">{template.description}</p>
            <button className="px-4 py-2 bg-primary text-white rounded-lg mt-4 w-full">
              Use Template
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BlinkTemplates;
