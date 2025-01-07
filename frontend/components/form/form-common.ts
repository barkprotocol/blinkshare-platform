import { RoleData, ServerFormProps } from "@/lib/types";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

// Handle input changes for form data
export const handleInputChange = <T extends keyof ServerFormProps["formData"]>(
  field: T,
  value: ServerFormProps["formData"][T],
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>
): void => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};

// Handle toggling of Discord roles
export const handleDiscordRoleToggle = (
  roleId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>,
  setRoleErrors: Dispatch<SetStateAction<Record<string, boolean>>>
): void => {
  const role = roleData.roles.find((role) => role.id === roleId);

  if (!role) return;

  if (roleData.blinkShareRolePosition <= (role.position || 0)) {
    setRoleErrors((prev) => ({ ...prev, [roleId]: true }));
    return;
  }

  setRoleErrors((prev) => ({ ...prev, [roleId]: false }));

  const updatedRoles = roleData.roles.map((r) =>
    r.id === roleId ? { ...r, enabled: !r.enabled } : r
  );

  setRoleData((prev) => ({ ...prev, roles: updatedRoles }));

  const enabledRoles = updatedRoles
    .filter((r) => r.enabled)
    .map((r) => ({
      id: r.id,
      name: r.name,
      amount: r.price,
    }));

  setFormData((prev) => ({ ...prev, roles: enabledRoles }));
};

// Handle price changes for Discord roles
export const handleDiscordRolePriceChange = (
  roleId: string,
  price: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setFormData: Dispatch<SetStateAction<ServerFormProps["formData"]>>
): void => {
  const updatedRoles = roleData.roles.map((role) =>
    role.id === roleId ? { ...role, price } : role
  );

  setRoleData((prev) => ({ ...prev, roles: updatedRoles }));

  const enabledRoles = updatedRoles
    .filter((role) => role.enabled)
    .map((role) => ({
      id: role.id,
      name: role.name,
      amount: role.price,
    }));

  setFormData((prev) => ({ ...prev, roles: enabledRoles }));
};

// Fetch and refresh Discord roles
export const refreshRoles = async (
  formDataId: string,
  roleData: RoleData,
  setRoleData: Dispatch<SetStateAction<RoleData>>,
  setIsRefreshingRoles: Dispatch<SetStateAction<boolean>>,
  setRoleErrors: Dispatch<SetStateAction<Record<string, boolean>>>,
  setErrorMessage: Dispatch<SetStateAction<string>>
): Promise<void> => {
  setIsRefreshingRoles(true);
  setErrorMessage("");

  try {
    const allRoles = await fetchRoles(formDataId);

    const mergedRoles: Role[] = allRoles.roles.map((role) => {
      const selectedRole = roleData.roles.find((r) => r.id === role.id);
      return selectedRole
        ? { ...role, price: selectedRole.price, enabled: selectedRole.enabled }
        : { ...role, price: '', enabled: false };
    });

    setRoleData((prev) => ({
      ...prev,
      roles: mergedRoles,
      blinkShareRolePosition: allRoles.blinkShareRolePosition,
    }));

    setRoleErrors({});
    toast.success("Roles refreshed successfully");
  } catch (error) {
    console.error("Error refreshing roles", error);
    setErrorMessage("Failed to refresh roles. Please try again.");
    toast.error("Failed to refresh roles. Please try again.");
  } finally {
    setIsRefreshingRoles(false);
  }
};

