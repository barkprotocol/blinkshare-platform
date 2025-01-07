"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchGuildData } from "@/utils/fetch-guild-data";
import GuildForm from "@/components/form/guild-create-form";
import RoleManager from "@/components/roles/role-manager";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { handleInputChange, handleDiscordRoleToggle, handleDiscordRolePriceChange, refreshRoles } from "@/utils/form-handlers";
import { RoleData } from "@/lib/types";

const ServerConfigPage = () => {
  const router = useRouter();
  const { serverId } = router.query;

  const [guild, setGuild] = useState(null);
  const [roles, setRoles] = useState<RoleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingRoles, setIsRefreshingRoles] = useState(false);
  const [roleErrors, setRoleErrors] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    roles: [] as Array<{ id: string; name: string; amount: string }>,
  });

  useEffect(() => {
    if (serverId) {
      fetchData(serverId as string);
    }
  }, [serverId]);

  const fetchData = async (serverId: string) => {
    setIsLoading(true);
    try {
      // Use environment variable for Discord auth token
      const authToken = process.env.NEXT_PUBLIC_DISCORD_AUTH_TOKEN;
      if (!authToken) {
        toast.error("Discord Auth Token is missing in environment variables");
        return;
      }

      const { guild, channels } = await fetchGuildData(serverId, authToken); // Pass the auth token
      setGuild(guild);
      setRoles(guild.roles); // Assume `guild.roles` contains roles data
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to load guild data");
    }
  };

  const handleGuildUpdate = (updatedGuild: any) => {
    setGuild(updatedGuild);
  };

  const handleRoleUpdate = (updatedRoles: RoleData) => {
    setRoles(updatedRoles);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Configure Server: {guild?.name}</h1>

      <GuildForm
        guild={guild}
        formData={formData}
        onSubmit={handleGuildUpdate}
        onInputChange={(field: string | number | symbol, value: any) => handleInputChange(field, value, setFormData)}
      />

      <h2 className="text-2xl mt-8">Manage Roles</h2>
      <RoleManager
        roles={roles}
        onRoleToggle={(roleId: string, roleData: RoleData) =>
          handleDiscordRoleToggle(roleId, roleData, setRoles, setFormData, setRoleErrors)
        }
        onRolePriceChange={(roleId: string, price: string) =>
          handleDiscordRolePriceChange(roleId, price, roles, setRoles, setFormData)
        }
        roleErrors={roleErrors}
        isRefreshingRoles={isRefreshingRoles}
        refreshRoles={() =>
          refreshRoles(
            serverId as string,
            roles!,
            setRoles,
            setIsRefreshingRoles,
            setRoleErrors
          )
        }
      />
    </div>
  );
};

export default ServerConfigPage;
