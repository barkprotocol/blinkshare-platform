import { Role, RoleData, ServerFormProps } from "@/lib/types";
import { toast } from "sonner";

// Utility function to format a role price
export const formatRolePrice = (price: string): string => {
  return `$${parseFloat(price).toFixed(2)}`;
};

// Utility function to check if a role is enabled
export const isRoleEnabled = (roleId: string, roleData: RoleData): boolean => {
  const role = roleData.roles.find((role) => role.id === roleId);
  return role ? role.enabled : false;
};

// Utility function to get the index of a role by its ID
export const getRoleIndex = (roleId: string, roleData: RoleData): number => {
  return roleData.roles.findIndex((role) => role.id === roleId);
};

// Utility function to merge server form data with role information
export const mergeFormDataWithRoles = (
  formData: ServerFormProps["formData"],
  roleData: RoleData
): ServerFormProps["formData"] => {
  const mergedRoles = formData.roles.map((role) => {
    const roleInData = roleData.roles.find((r) => r.id === role.id);
    return roleInData
      ? { ...role, price: roleInData.price, enabled: roleInData.enabled }
      : role;
  });

  return { ...formData, roles: mergedRoles };
};

// Utility function to show a toast notification
export const showToastNotification = (message: string, type: "success" | "error" = "success") => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

// Utility function to reset form errors
export const resetFormErrors = (setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>) => {
  setErrors({});
};

// Utility function to validate price format
export const validatePriceFormat = (price: string): boolean => {
  const pricePattern = /^\d+(\.\d{1,2})?$/;
  return pricePattern.test(price);
};
