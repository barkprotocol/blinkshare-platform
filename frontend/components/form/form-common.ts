import { RoleData, ServerFormProps } from "@/lib/types";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

// Handle input change for server form
export const handleInputChange = (
  field: keyof ServerFormProps["formData"],
  value: any,
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>
) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};

// Handle toggling of Discord role enabled state
export const handleDiscordRoleToggle = (
  roleId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>,
  setRoleErrors: Dispatch<SetStateAction<{ [key: string]: boolean }>>
) => {
  const role = roleData.roles.find((role) => role.id === roleId);

  if (!role) {
    toast.error("Role not found.");
    return;
  }

  // Ensure the role position is valid
  if (roleData.blinkShareRolePosition <= (role.position || 0)) {
    setRoleErrors((prev) => ({ ...prev, [roleId]: true }));
    toast.error("Cannot toggle this role as its position is too high.");
    return;
  }

  setRoleErrors((prev) => ({ ...prev, [roleId]: false }));

  const updatedRoles = roleData.roles.map((r) =>
    r.id === roleId ? { ...r, enabled: !r.enabled } : r
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((r) => r.enabled)
    .map((r) => ({
      id: r.id,
      name: r.name,
      amount: r.price || "0", // Ensuring default price if undefined
    }));

  setFormData((prev) => ({ ...prev, roles: enabledRoles }));
  toast.success(`${role.name} role toggled successfully.`);
};

// Handle changing the price of a Discord role
export const handleDiscordRolePriceChange = (
  roleId: string,
  price: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>
) => {
  const updatedRoles = roleData.roles.map((role) =>
    role.id === roleId ? { ...role, price } : role
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((role) => role.enabled)
    .map((role) => ({
      id: role.id,
      name: role.name,
      amount: price || "0", // Ensuring default price if undefined
    }));

  setFormData((prev) => ({ ...prev, roles: enabledRoles }));
  toast.success(`${roleId} price updated to ${price}.`);
};

// Refresh roles from the server
export const refreshRoles = async (
  formDataId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setIsRefreshingRoles: Dispatch<SetStateAction<boolean>>,
  setRoleErrors: Dispatch<SetStateAction<{ [key: string]: boolean }>>
) => {
  setIsRefreshingRoles(true);
  try {
    const allRoles = await fetchRoles(formDataId);

    if (!allRoles.roles || allRoles.roles.length === 0) {
      toast.error("No roles found.");
      return;
    }

    // Merge the roles while ensuring blinkShareRolePosition is included in the updated data
    const mergedRoles = allRoles.roles.map((role) => {
      const selectedRole = roleData.roles.find((r) => r.id === role.id);
      return selectedRole
        ? { ...role, price: selectedRole.price, enabled: selectedRole.enabled }
        : role;
    });

    // Ensure blinkShareRolePosition is included, and provide a fallback if it's missing
    setRoleData({
      ...roleData,
      roles: mergedRoles,
      blinkShareRolePosition: roleData.blinkShareRolePosition ?? 0, // Fallback value if undefined
    });

    setRoleErrors({});
    toast.success("Roles refreshed successfully.");
  } catch (error) {
    console.error("Error refreshing roles", error);
    toast.error("Failed to refresh roles. Please try again.");
  } finally {
    setIsRefreshingRoles(false);
  }
};
