import { useState } from "react";
import { RoleData, FormData } from "@/lib/types";
import { handleInputChange, handleDiscordRoleToggle, handleDiscordRolePriceChange } from "@/utils/form-handlers";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface GuildCreateFormProps {
  onSubmit: (formData: FormData) => void;
}

const GuildCreateForm = ({ onSubmit }: GuildCreateFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    roles: [],
  });

  const [roleData, setRoleData] = useState<RoleData>({
    roles: [],
    blinkShareRolePosition: 0,
  });

  const [roleErrors, setRoleErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleToggle = (roleId: string) => {
    handleDiscordRoleToggle(roleId, roleData, setRoleData, setFormData, setRoleErrors);
  };

  const handleRolePriceChange = (roleId: string, price: string) => {
    handleDiscordRolePriceChange(roleId, price, roleData, setRoleData, setFormData);
  };

  const handleInputChangeWrapper = (field: keyof FormData, value: any) => {
    handleInputChange(field, value, setFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      onSubmit(formData);
      toast.success("Guild created successfully");
    } catch (error) {
      toast.error("Failed to create guild");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-lg font-medium">
          Guild Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChangeWrapper("name", e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-lg font-medium">
          Guild Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChangeWrapper("description", e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <h3 className="text-xl font-medium">Roles</h3>
        {roleData.roles.map((role) => (
          <div key={role.id} className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={role.enabled}
              onChange={() => handleRoleToggle(role.id)}
            />
            <span>{role.name}</span>
            <input
              type="number"
              value={role.price}
              onChange={(e) => handleRolePriceChange(role.id, e.target.value)}
              className="p-2 border rounded"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-gray-950 text-white rounded"
        disabled={isLoading}
      >
        {isLoading ? <LoadingSpinner /> : "Create Guild"}
      </button>
    </form>
  );
};

export default GuildCreateForm;
