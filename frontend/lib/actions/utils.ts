import { RoleData, ServerFormProps } from "@/lib/types";
import { toast } from "sonner";

// Utility function to format a role price to a string with 2 decimal places
export const formatRolePrice = (price: string): string => {
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    throw new Error("Invalid price format");
  }
  return `$${parsedPrice.toFixed(2)}`;
};

// Utility function to check if a role is enabled by roleId in the role data
export const isRoleEnabled = (roleId: string, roleData: RoleData): boolean => {
  const role = roleData.roles.find((role: { id: string; }) => role.id === roleId);
  return role ? role.enabled : false;
};

// Utility function to get the index of a role by its ID
export const getRoleIndex = (roleId: string, roleData: RoleData): number => {
  return roleData.roles.findIndex((role: { id: string; }) => role.id === roleId);
};

// Utility function to merge server form data with role information, ensuring that role data is updated
export const mergeFormDataWithRoles = (
  formData: ServerFormProps["formData"],
  roleData: RoleData
): ServerFormProps["formData"] => {
  const mergedRoles = formData.roles.map((role) => {
    const roleInData = roleData.roles.find((r: { id: string; }) => r.id === role.id);
    if (roleInData) {
      return { ...role, price: roleInData.price, enabled: roleInData.enabled };
    }
    return role; // Fallback to original role if no matching role is found
  });

  return { ...formData, roles: mergedRoles };
};

// Utility function to show a toast notification (success or error)
export const showToastNotification = (message: string, type: "success" | "error" = "success"): void => {
  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

// Utility function to reset form errors by clearing the errors state
export const resetFormErrors = (setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>): void => {
  setErrors({});
};

// Utility function to validate price format using a regular expression (allows up to 2 decimal places)
export const validatePriceFormat = (price: string): boolean => {
  const pricePattern = /^\d+(\.\d{1,2})?$/; // Pattern matches integers and decimal numbers with up to 2 decimal places
  return pricePattern.test(price);
};
