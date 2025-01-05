import { RoleData, Role, ServerFormProps } from "@/lib/types";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

// Handling input changes for form data
export const handleInputChange = <
  T extends keyof ServerFormProps["formData"]
>(
  field: T,
  value: ServerFormProps["formData"][T],
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>
) => {
  setFormData((prev: any) => ({ ...prev, [field]: value }));
};

// Handle toggling of Discord roles
export const handleDiscordRoleToggle = (
  roleId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>,
  setRoleErrors: Dispatch<SetStateAction<{ [key: string]: boolean }>>,
  setErrorMessage: Dispatch<SetStateAction<string>>
) => {
  const role = roleData.roles.find((role: { id: string; }) => role.id === roleId);

  if (!role) {
    setErrorMessage("Role not found.");
    toast.error("Role not found.");
    return;
  }

  // Ensure the role can only be toggled if it has a lower position than the "blinkShare" role
  if (roleData.blinkShareRolePosition <= (role.position || 0)) {
    setRoleErrors((prev) => ({ ...prev, [roleId]: true }));
    setErrorMessage("You cannot toggle this role due to its position.");
    toast.error("You cannot toggle this role due to its position.");
    return;
  }

  setRoleErrors((prev) => ({ ...prev, [roleId]: false }));
  setErrorMessage(""); // Reset error message on success

  const updatedRoles = roleData.roles.map((r: { id: string; enabled: any; }) =>
    r.id === roleId ? { ...r, enabled: !r.enabled } : r
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((r: { enabled: any; }) => r.enabled)
    .map((r: { id: any; name: any; price: any; }) => ({
      id: r.id,
      name: r.name,
      amount: r.price,
    }));

  setFormData((prev: any) => ({ ...prev, roles: enabledRoles }));
};

// Handle price changes for Discord roles
export const handleDiscordRolePriceChange = (
  roleId: string,
  price: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>,
  setRoleErrors: Dispatch<SetStateAction<{ [key: string]: boolean }>>,
  setErrorMessage: Dispatch<SetStateAction<string>> // Added error message handling
) => {
  const updatedRoles = roleData.roles.map((role: { id: string; }) =>
    role.id === roleId ? { ...role, price } : role
  );

  setRoleData({ ...roleData, roles: updatedRoles });

  const enabledRoles = updatedRoles
    .filter((role: { enabled: any; }) => role.enabled)
    .map((role: { id: any; name: any; }) => ({
      id: role.id,
      name: role.name,
      amount: price,
    }));

  setFormData((prev) => ({ ...prev, roles: enabledRoles }));
  setErrorMessage(""); // Reset error message on success
};

// Fetch and refresh Discord roles
export const refreshRoles = async (
  formDataId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setIsRefreshingRoles: Dispatch<SetStateAction<boolean>>,
  setRoleErrors: Dispatch<SetStateAction<{ [key: string]: boolean }>>,
  setErrorMessage: Dispatch<SetStateAction<string>> // New error message state for better feedback
) => {
  setIsRefreshingRoles(true);
  setErrorMessage(""); // Clear any previous error message

  try {
    const allRoles = await fetchRoles(formDataId);

    // Merge roles to keep custom values like price and enabled state
    const mergedRoles: Role[] = allRoles.roles.map((role) => {
      const selectedRole = roleData.roles.find((r) => r.id === role.id);
      return selectedRole
        ? { ...role, price: selectedRole.price, enabled: selectedRole.enabled }
        : role;
    });

    setRoleData({
      ...roleData,
      roles: mergedRoles,
      blinkShareRolePosition: roleData.blinkShareRolePosition,
    });

    setRoleErrors({});
    toast.success("Roles refreshed successfully!");
  } catch (error) {
    console.error("Error refreshing roles", error);
    setErrorMessage("Failed to refresh roles. Please try again.");
    toast.error("Failed to refresh roles. Please try again.");
  } finally {
    setIsRefreshingRoles(false);
  }
};
