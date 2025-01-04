import React from "react";
import { DiscordRole } from "@/lib/types";

const RoleList = ({ roles }: { roles: DiscordRole[] }) => {
  return (
    <ul>
      {roles.map((role) => (
        <li key={role.id}>
          {role.name} - {role.price}
        </li>
      ))}
    </ul>
  );
};

export default RoleList;
