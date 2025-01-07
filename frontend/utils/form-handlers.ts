import { RoleData, FormData } from "@/lib/types";
import { toast } from "sonner";

// Handle changes in the guild creation form fields
export const handleInputChange = (
  field: keyof FormData,
  value: any,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  setFormData((prev: any) => ({ ...prev, [field]: value }));
};

// Toggle role's enabled state and update the role data
export const handleDiscordRoleToggle = (
  roleId: string,
  roleData: RoleData,
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>,
  setRoleErrors: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
  const role = roleData.roles.find((role) => role.id === roleId);

  if (!role) return;

  if (roleData.blinkShareRolePosition <= (role.position || 0)) {
    console.log(role.position, roleData.blinkShareRolePosition);
    setRoleErrors((prev) => ({ ...prev, [roleId]: true }));
    return;
  }

  // Toggle the role's enabled state
  setRoleErrors((prev) => ({ ...prev, [roleId]: false }));

  const updatedRoles = roleData.roles.map((r) =>
    r.id === roleId ? { ...r, enabled: !r.enabled } : r
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  // Filter the enabled roles and update the form data
  const enabledRoles = updatedRoles
    .filter((r) => r.enabled)
    .map((r) => ({
      id: r.id,
      name: r.name,
      amount: r.price,
    }));

  setFormData((prev: any) => ({ ...prev, roles: enabledRoles }));
};

// Change the price of a role and update the role data and form data
export const handleDiscordRolePriceChange = (
  roleId: string,
  price: string,
  roleData: RoleData,
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>,
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
) => {
  const updatedRoles = roleData.roles.map((role) =>
    role.id === roleId ? { ...role, price } : role
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  // Update the form data with the new role prices
  const enabledRoles = updatedRoles
    .filter((role) => role.enabled)
    .map((role) => ({
      id: role.id,
      name: role.name,
      amount: price,
    }));

  setFormData((prev: any) => ({ ...prev, roles: enabledRoles }));
};

// Refresh the roles from the backend and merge them with the current state
export const refreshRoles = async (
  formDataId: string,
  roleData: RoleData,
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>,
  setIsRefreshingRoles: React.Dispatch<React.SetStateAction<boolean>>,
  setRoleErrors: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
) => {
  setIsRefreshingRoles(true);
  try {
    // Fetch the updated roles from the backend (replace with your actual fetching logic)
    const allRoles = await fetchRoles(formDataId); // Ensure fetchRoles is properly imported or defined
    const mergedRoles = allRoles.roles.map((role: { id: string; }) => {
      const selectedRole = roleData.roles.find((r) => r.id === role.id);
      return selectedRole
        ? { ...role, price: selectedRole.price, enabled: selectedRole.enabled }
        : role;
    });
    setRoleData({ ...allRoles, roles: mergedRoles });
    setRoleErrors({});
    toast.success("Roles refreshed successfully");
  } catch (error) {
    console.error("Error refreshing roles", error);
    toast.error("Failed to refresh roles");
  } finally {
    setIsRefreshingRoles(false);
  }
};

// A helper function to fetch roles (example, replace with actual API call)
export const fetchRoles = async (formDataId: string) => {
  try {
    const response = await fetch(`/api/roles/${formDataId}`);
    const data = await response.json();
    return data; // Assuming it returns a structure like { roles: [...] }
  } catch (error) {
    console.error("Failed to fetch roles", error);
    throw new Error("Failed to fetch roles");
  }
};
