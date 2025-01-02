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
import { DiscordRole, RoleData } from "@/lib/types/index";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { defaultSchema, ServerFormData, serverFormSchema } from "@/lib/zod-validation";
import { MotionCard, MotionCardContent } from "@/components/motion";
import ServerForm from "@/components/form";
import OverlaySpinner from "@/components/ui/overlay-spinner";

export default function CreateServerPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const { signMessage, promptConnectWallet } = useWalletActions();
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [formData, setFormData] = useState<ServerFormData>({ ...defaultSchema, id: serverId });
  const [roleData, setRoleData] = useState<RoleData>({ blinkshareRolePosition: -1, roles: [] });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ServerFormData, string>> >({});
  const [isLoading, setIsLoading] = useState(true);
  const [channels, setChannels] = useState<{ name: string; id: string }[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(false);

  const router = useRouter();
  const wallet = useWallet();
  const token = useUserStore((state) => state.token) || localStorage.getItem("discordToken");
  const { guildName, guildImage } = JSON.parse(localStorage.getItem("selectedGuild") || "{}");

  useEffect(() => {
    if (guildName || guildImage) {
      setFormData(prev => ({
        ...prev,
        name: guildName || prev.name,
        iconUrl: guildImage || prev.iconUrl,
      }));
    }
  }, [guildName, guildImage]);

  useEffect(() => {
    const fetchData = async () => {
      if (serverId && token) {
        try {
          setIsLoading(true);

          // Fetch roles data
          const rolesData = await fetchRoles(serverId);
          setRoleData({
            ...rolesData,
            roles: rolesData.roles.map((role: DiscordRole) => ({
              ...role,
              price: '',
              enabled: false,
            })),
            blinkshareRolePosition: rolesData.blinkshareRolePosition || -1, // Ensure this is included
          });

          // Fetch channels
          setChannelsLoading(true);
          const channelsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverId}/channels`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (channelsResponse.ok) {
            const channels = await channelsResponse.json();
            setChannels(channels);
          } else {
            console.error("Failed to fetch channels");
            toast.error("Failed to fetch channels. Please try again later.");
          }
        } catch (error) {
          console.error("Error fetching roles or channels:", error);
          toast.error("Failed to fetch server roles or channels.");
        } finally {
          setIsLoading(false);
          setChannelsLoading(false); // Set loading state to false after fetching channels
        }
      }
    };

    fetchData();
  }, [serverId, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOverlayVisible(true);
    setErrorOccurred(false);
    setIsLoading(true);

    try {
      await promptConnectWallet();

      const validatedFormData = serverFormSchema.parse(formData);
      const message = `Confirm creating Blink for ${guildName}`;
      const signature = await signMessage(message);

      if (signature) {
        const payload = {
          data: {
            ...validatedFormData,
            roles: roleData?.roles.filter(role => role.enabled).map(role => ({
              id: role.id,
              name: role.name,
              amount: role.price.toString(),
            })),
          },
          address: wallet.publicKey,
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

        if (response.ok) {
          toast.success("Server created successfully!");
          router.push(`/servers/${serverId}/success`);
        } else {
          toast.error("Error creating server, please try again.");
          setErrorOccurred(true);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof ServerFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length) {
            const field = err.path[0];
            if (field in formData) {
              errors[field as keyof ServerFormData] = err.message;
            }
          }
        });
        setFormErrors(errors);
        toast.error(`Please fix the form errors: ${Object.values(errors).join("\n")}`);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
      setOverlayVisible(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {overlayVisible && <OverlaySpinner text="Submitting your Blink configuration" error={errorOccurred} />}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center space-x-2 mb-6"
      >
        <h1 className="text-3xl font-bold text-primary">👀 Create a Blink for {guildName}</h1>
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
              roleData={roleData}
              setRoleData={setRoleData}
              formErrors={formErrors}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              channels={channels}
              channelsLoading={channelsLoading}
            />
          </MotionCardContent>
        </MotionCard>
      </div>
    </div>
  );
}