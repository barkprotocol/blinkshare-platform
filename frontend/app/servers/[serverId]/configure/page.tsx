import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CopyIcon, SquareArrowOutUpRight } from "lucide-react";
import { useWalletActions } from "@/hooks/use-wallet-actions";
import { DiscordRole, RoleData } from "@/lib/types";
import {
  MotionCard,
  MotionCardContent,
  MotionInput,
  MotionButton,
} from "@/components/motion";
import { motion } from "framer-motion";
import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { Skeleton } from "@/components/ui/skeleton";
import { BlinkDisplay } from "@/components/blink/blink-display";
import { toast } from "sonner";
import { defaultSchema, ServerFormData, serverFormSchema } from "@/lib/zod-validation";
import OverlaySpinner from "@/components/ui/overlay-spinner";
import EditGuild, { ServerFormEdit } from "@/components/form/edit-guild";
import { useWallet } from "@solana/wallet-adapter-react";
import { z } from "zod";
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchRoles } from "@/lib/actions/discord-actions";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import MySubscriptions from "../subscriptions";
import Image from "next/image";

// ServerFormProps interface
export interface ServerFormProps {
  formData: ServerFormData;
  setFormData: React.Dispatch<React.SetStateAction<ServerFormData>>;
  formErrors: Partial<Record<keyof ServerFormData, string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  roleData: RoleData;
  setRoleData: React.Dispatch<React.SetStateAction<RoleData>>;
  isLoading: boolean;
}

export default function ConfigureServerPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const serverIdStr = Array.isArray(serverId) ? serverId[0] : serverId;
  const { signMessage, promptConnectWallet } = useWalletActions();
  const [guildName, setGuildName] = useState<string>("");
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [errorOccurred, setErrorOccurred] = useState<boolean>(false);
  const [roleData, setRoleData] = useState<RoleData>({ blinkShareRolePosition: -1, roles: [] });
  const [customUrl, setCustomUrl] = useState<string>("");
  const wallet = useWallet();

  const [formData, setFormData] = useState<ServerFormData>(() => ({ ...defaultSchema, id: serverIdStr }));
  const [channels, setChannels] = useState<{ name: string; id: string }[]>([]);

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ServerFormData, string>>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [guildFound, setGuildFound] = useState<boolean>(false);
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("discordToken");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchGuildData = async () => {
      if (!token || !serverIdStr) return;

      try {
        setIsLoading(true);
        const [guildResponse, channelsResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}/channels`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (guildResponse.ok) {
          const { guild } = await guildResponse.json();
          if (guild) {
            setFormData({ ...guild });
            setGuildName(guild.name);

            const allRoles = await fetchRoles(serverIdStr);
            const mergedRoles = allRoles.roles.map((role: DiscordRole) => {
              const selectedRole = guild.roles.find((r: DiscordRole) => r.id === role.id);
              return selectedRole ? { ...role, price: selectedRole.amount, enabled: true } : role;
            });

            setRoleData({ ...allRoles, roles: mergedRoles, blinkShareRolePosition: -1 });
            setGuildFound(true);
            setCustomUrl(`${window.location.origin}/${guild.id}`);
          } else {
            setGuildFound(false);
          }
        } else {
          setGuildFound(false);
        }

        if (channelsResponse.ok) {
          const channels = await channelsResponse.json();
          setChannels(channels);
        } else {
          console.error("Failed to fetch channels");
        }
      } catch (error) {
        console.error("Error fetching guild data", error);
        setGuildFound(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuildData();
  }, [serverIdStr, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOverlayVisible(true);
    setErrorOccurred(false);

    try {
      await promptConnectWallet();

      const validatedFormData = serverFormSchema.parse(formData);
      const message = `Confirm updating Blink for ${guildName}`;
      const signature = await signMessage(message);

      if (!signature) throw new Error("Failed to sign message");

      const payload = {
        data: {
          ...validatedFormData,
          roles: roleData.roles
            .filter((role) => role.enabled)
            .map((role) => ({
              id: role.id,
              name: role.name,
              amount: role.price.toString(),
            })),
        },
        address: wallet.publicKey?.toString(),
        message,
        signature,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverIdStr}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Blink data updated successfully");
        const guild = await response.json();
        setFormData(guild);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error updating server");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof ServerFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length) {
            const field = err.path[0];
            if (typeof field === "string" && field in formData) {
              errors[field as keyof ServerFormData] = err.message;
            }
          }
        });
        setFormErrors(errors);
        toast.error(`Please fix the form errors: ${Object.values(errors).join("\n")}`);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      setErrorOccurred(true);
    } finally {
      setIsLoading(false);
      setOverlayVisible(false);
    }
  };

  const copyCustomUrl = () => {
    navigator.clipboard.writeText(customUrl);
    toast("URL Copied!");
  };

  const openCustomUrl = () => {
    window.open(customUrl, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return <OverlaySpinner />;
  }

  if (!guildFound) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold">
              No <span className="highlight-cyan">BlinkShare</span> Servers Set Up
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="mb-6 flex justify-center">
              {/* Replacing <img> with <Image> */}
              <Image
                src="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
                alt="No BlinkShare Guild Selected"
                width={200}
                height={200}
                className="rounded-full"
              />
            </div>
            <p className="text-gray-600 text-center max-w-md">
              You haven't created Discord paid roles for your server{" "}
              <span className="font-medium">{guildName}</span>. Follow the instructions on how to create a
              custom subscription page for your server.
            </p>
            <div className="mt-6 space-x-3">
              <Button onClick={copyCustomUrl}>Copy URL</Button>
              <Button onClick={openCustomUrl} className="bg-sand">
                View in Browser
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    );
  }

  return (
    <>
      <ServerFormEdit
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        handleSubmit={handleSubmit}
        roleData={roleData}
        setRoleData={setRoleData}
        isLoading={isLoading}
      />
    </>
  );
}
