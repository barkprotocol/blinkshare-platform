"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletActions } from "@/hooks/use-wallet-actions";
import { z } from "zod";
import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { DiscordRole } from "@/lib/types/index";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { defaultSchema, ServerFormData, serverFormSchema } from "@/lib/zod-validation";
import { MotionCard, MotionCardContent } from "@/components/motion";
import ServerForm from "@/components/form";
import OverlaySpinner from "@/components/ui/overlay-spinner";

// Update the RoleData interface
export interface RoleData {
  blinkShareRolePosition: number;
  roles: DiscordRole[];
}

export default function CreateServerPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const { signMessage, promptConnectWallet } = useWalletActions();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [formData, setFormData] = useState<ServerFormData>(() => ({ ...defaultSchema, id: serverId }));
  const [roleData, setRoleData] = useState<RoleData>({ blinkShareRolePosition: -1, roles: [] });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ServerFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [channels, setChannels] = useState<Array<{ name: string; id: string }>>([]);
  const [guildName, setGuildName] = useState<string | null>(null);
  const [guildImage, setGuildImage] = useState<string | null>(null);

  const router = useRouter();
  const wallet = useWallet();
  const token = useUserStore((state) => state.token) || (typeof window !== 'undefined' ? localStorage.getItem("discordToken") : null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const selectedGuild = localStorage.getItem("selectedGuild");
      if (selectedGuild) {
        const { guildName, guildImage } = JSON.parse(selectedGuild);
        setGuildName(guildName);
        setGuildImage(guildImage);
        setFormData(prev => ({
          ...prev,
          name: guildName || prev.name,
          iconUrl: guildImage || prev.iconUrl,
        }));
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!serverId || !token) return;

      try {
        setIsLoading(true);

        const [rolesData, channelsResponse] = await Promise.all([
          fetchRoles(serverId),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverId}/channels`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Ensure BlinkshareRolePosition is always treated as a number
        const blinkShareRolePosition = typeof rolesData.blinkShareRolePosition === 'number' ? rolesData.blinkShareRolePosition : -1;

        setRoleData({
          ...rolesData,
          roles: rolesData.roles.map((role: DiscordRole) => ({
            ...role,
            price: '',
            enabled: false,
          })),
          blinkShareRolePosition,
        });

        if (channelsResponse.ok) {
          const channelsData = await channelsResponse.json();
          setChannels(channelsData);
        } else {
          throw new Error("Failed to fetch channels");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch server data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [serverId, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOverlayVisible(true);
    setErrorOccurred(false);

    try {
      await promptConnectWallet();

      const validatedFormData = serverFormSchema.parse(formData);
      const message = `Confirm creating Blink for ${guildName}`;
      const signature = await signMessage(message);

      if (!signature) {
        throw new Error("Failed to sign message");
      }

      const payload = {
        data: {
          ...validatedFormData,
          roles: roleData.roles
            .filter(role => role.enabled)
            .map(role => ({
              id: role.id,
              name: role.name,
              amount: role.price.toString(),
            })),
        },
        address: wallet.publicKey?.toString(),
        message,
        signature,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error creating server");
      }

      toast.success("Server created successfully!");
      router.push(`/servers/${serverId}/success`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof ServerFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length) {
            const field = err.path[0];
            if (typeof field === 'string' && field in formData) {
              errors[field as keyof ServerFormData] = err.message;
            }
          }
        });
        setFormErrors(errors);
        toast.error(`Please fix the form errors: ${Object.values(errors).join("\n")}`);
      } else if (error instanceof Error) {
        console.error("Unexpected error:", error);
        toast.error(error.message || "An unexpected error occurred.");
      }
      setErrorOccurred(true);
    } finally {
      setIsLoading(false);
      setOverlayVisible(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-950 min-h-screen">
      {overlayVisible && (
        <OverlaySpinner
          text="Submitting your Blink configuration"
          error={errorOccurred}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2 mb-6"
      >
        <h1 className="text-3xl font-bold text-primary">
          👀 Create a Blink for {guildName}
        </h1>
      </motion.div>
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
        <MotionCard
          className="flex-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle className="ml-5">Blink Details</CardTitle>
          </CardHeader>
          <MotionCardContent>
            <ServerForm
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              channels={channels}
            />
          </MotionCardContent>
        </MotionCard>
      </div>
    </div>
  );
}
