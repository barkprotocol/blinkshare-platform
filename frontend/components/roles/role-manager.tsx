import React, { useState } from "react";
import { DiscordRole } from "@/lib/types";

interface RoleManagerProps {
  roles: DiscordRole[];
  onRoleUpdate: (updatedRoles: DiscordRole[]) => void;
}

const RoleManager: React.FC<RoleManagerProps> = ({ roles, onRoleUpdate }) => {
  const [localRoles, setLocalRoles] = useState<DiscordRole[]>(roles);

  const handleToggleRole = (roleId: string) => {
    const updatedRoles = localRoles.map((role) =>
      role.id === roleId
        ? { ...role, enabled: !role.enabled }
        : role
    );
    setLocalRoles(updatedRoles);
    onRoleUpdate(updatedRoles);
  };

  return (
    <div className="space-y-4">
      {localRoles.map((role) => (
        <div key={role.id} className="flex items-center space-x-4">
          <span>{role.name}</span>
          <button
            onClick={() => handleToggleRole(role.id)}
            className={`p-2 rounded ${
              role.enabled ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {role.enabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RoleManager;
