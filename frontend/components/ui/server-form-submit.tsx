import { useState } from "react";
import { ServerFormData, RoleData, DiscordServer } from "@/lib/types";

const ServerFormSubmit = ({ formData, roleData }: { formData: ServerFormData, roleData: RoleData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);  // Set loading to true while submitting
    setError(null);  // Clear previous errors

    try {
      // Mock API request
      const response = await createOrEditGuild({
        guildId: formData.id, // Assuming you have this in your formData
        customTitle: formData.title,
        customIcon: formData.icon,
        description: formData.description,
        detailedDescription: formData.details,
        selectedRoles: formData.roles, // Include the roles in submission
        ownerWallet: formData.ownerWallet,
      });

      console.log("Guild created/edited successfully:", response);
      // Optionally, you can reset the form data or display a success message here

    } catch (error) {
      setError("Failed to submit the form. Please try again later.");
      console.error("Error during submission:", error);
    } finally {
      setIsLoading(false); // Reset loading state after the operation
    }
  };

  // Mock API function to simulate guild creation or update
  const createOrEditGuild = async (guildData: any): Promise<DiscordServer> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulating a success response, now including description and detailedDescription
        resolve({
          id: "1234",
          name: guildData.customTitle || "Default Guild",
          icon: guildData.customIcon || "default-icon.png",
          description: guildData.description || "", // Ensure description is passed
          detailedDescription: guildData.detailedDescription || "", // Ensure detailedDescription is passed
          roles: guildData.selectedRoles.map((roleId: string) => ({
            id: roleId,
            name: `Role ${roleId}`,
            price: "10",
            enabled: true,
          })),
          ownerWallet: guildData.ownerWallet,
        });
      }, 1000); // Simulate API delay
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      
      {/* Your form fields go here */}
      <input
        type="text"
        value={formData.title}
        onChange={(e) => {/* Handle title input change */}}
        placeholder="Title"
      />
      
      {/* Other form fields */}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ServerFormSubmit;
