import { BlinkFormData } from "@/lib/contexts/zustand/blink-store"; 
import { v4 as uuidv4 } from "uuid";

/**
 * Generate a new Blink form data structure with default or custom values.
 * @param customData Optional object to override the defaults.
 * @returns BlinkFormData A fully formed Blink form data object.
 */
export const generateBlinkFormData = (customData?: Partial<BlinkFormData>): BlinkFormData => {
  const defaultData: BlinkFormData = {
    iconUrl: "https://ucarecdn.com/7c3db9ed-f8c0-4848-a606-e982877b09fa/default-icon.png",
    title: "Default Blink Title",
    description: "This is the default description for the blink template. Feel free to customize it.",
    fields: [
      { label: "Name", value: "text" },
      { label: "Email", value: "email" },
      { label: "Message", value: "textarea" },
    ],
  };

  // Merge customData with the default data, ensuring fields are correctly merged
  return {
    ...defaultData,
    ...customData,
    fields: [
      ...defaultData.fields, 
      ...(customData?.fields || []),
    ], // Ensure custom fields are merged properly
  };
};

/**
 * Example of generating a unique blink template
 * @param userData User-specific data to customize the template
 * @returns Generated Blink form data with unique template
 */
export const generateUniqueBlinkTemplate = (userData: { username: string; userEmail: string }): BlinkFormData => {
  const customData: Partial<BlinkFormData> = {
    title: `${userData.username}'s Blink Template`,
    description: `Welcome, ${userData.username}. This is your custom Blink template.`,
    fields: [
      { label: "Username", value: "text" },
      { label: "Email", value: "email" },
      { label: "Custom Message", value: "textarea" },
    ],
  };

  return generateBlinkFormData(customData);
};

/**
 * Example of generating a unique ID for a Blink instance
 * @returns A unique ID string for the Blink instance.
 */
export const generateBlinkId = (): string => {
  return uuidv4();
};
