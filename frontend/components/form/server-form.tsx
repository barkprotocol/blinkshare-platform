import React, { useState } from "react";
import { addRoleToServer } from "@/lib/actions/role-actions";
import { DiscordRole, ServerFormData, RoleData, ServerFormProps } from "@/lib/types";

const ServerForm = ({ formData, setFormData, roleData, setRoleData }: ServerFormProps) => {
  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePrice, setNewRolePrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddRole = () => {
    // Validate input
    if (!newRoleName || !newRolePrice) {
      setErrorMessage("Both role name and price are required.");
      return;
    }

    // Check if price is a valid number
    if (isNaN(Number(newRolePrice)) || Number(newRolePrice) <= 0) {
      setErrorMessage("Role price must be a valid positive number.");
      return;
    }

    // Create new role object
    const newRole: DiscordRole = {
      id: `${Date.now()}`, // Generate a unique ID for this example
      name: newRoleName,
      price: newRolePrice,
      enabled: true, // Default to enabled
    };

    // Add new role to server form
    addRoleToServer(newRole, formData, setFormData, setRoleData);

    // Clear inputs and error message
    setNewRoleName("");
    setNewRolePrice("");
    setErrorMessage(""); // Clear error message
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div>
        <input
          type="text"
          placeholder="Role Name"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Role Price"
          value={newRolePrice}
          onChange={(e) => setNewRolePrice(e.target.value)}
          required
        />
      </div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      <button type="button" onClick={handleAddRole}>
        Add Role
      </button>
    </form>
  );
};

export default ServerForm;
