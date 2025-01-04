"use client";

import React, { useState } from "react";
import { ServerForm } from "@/components/form/server-form";
import RoleList from "@/components/ui/role-list";
import { ServerFormData, RoleData } from "@/lib/types";

// Assuming createOrEditGuild is imported and properly typed
import { createOrEditGuild } from "@/lib/api"; 

const ServerFormPage = () => {
  const [formData, setFormData] = useState<ServerFormData>({
    title: "",
    description: "",
    details: "",
    roles: [], // Array to hold selected roles
    id: "", // Assuming guild id might be present for editing
    icon: "",
    ownerWallet: "", // Wallet for owner
  });

  const [roleData, setRoleData] = useState<RoleData>({
    blinkshareRolePosition: 0,
    roles: [], // List of roles
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Validate form data here if necessary
    if (!formData.title || !formData.description) {
      alert("Title and Description are required!");
      return;
    }

    // Example API call to create or edit guild with the form data
    const response = await createOrEditGuild({
      guildId: formData.id, 
      customTitle: formData.title,
      customIcon: formData.icon,
      description: formData.description,
      detailedDescription: formData.details,
      selectedRoles: formData.roles, // Roles from the form
      ownerWallet: formData.ownerWallet,
    });

    console.log(response); // Handle the API response here
  };

  return (
    <div>
      <h1>Server Form</h1>
      
      {/* Server Form component for editing server data */}
      <ServerForm
        formData={formData}
        setFormData={setFormData}
        roleData={roleData}
        setRoleData={setRoleData}
      />
      
      {/* Role List component to display and manage roles */}
      <RoleList roles={roleData.roles} />

      {/* Submit button for the form */}
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit Server</button>
      </form>
    </div>
  );
};

export default ServerFormPage;
