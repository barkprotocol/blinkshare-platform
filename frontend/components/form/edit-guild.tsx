"use client";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ServerFormSkeleton } from "@/components/skeletons/server-form";
import { RotateCcw, SaveIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ServerFormProps } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MotionCardContent,
  MotionInput,
  MotionTextarea,
  MotionButton,
} from "@/components/motion";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  handleInputChange,
  handleDiscordRoleToggle,
  handleDiscordRolePriceChange,
  refreshRoles,
} from "./form-common";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { SpinnerSvg } from "../loading";

// Dynamically load WalletMultiButton for client-side rendering
const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

function ErrorText({ message }: { message: string }) {
  return <p className="text-red-500 text-sm">{message}</p>;
}

function ServerFormEdit({
  formData,
  setFormData,
  roleData,
  setRoleData,
  formErrors,
  onSubmit,
  isLoading,
  channels,
}: ServerFormProps) {
  const wallet = useWallet();
  const [roleErrors, setRoleErrors] = useState<{ [key: string]: boolean }>({});
  const [isRefreshingRoles, setIsRefreshingRoles] = useState(false);

  if (isLoading) {
    return <ServerFormSkeleton />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 flex flex-col">
      {/* Blink Data Section */}
      <MotionCardContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold mb-4">Edit Blink Data ✍️</h2>
        <Separator className="my-4" />

        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <Label htmlFor="name">Blink Title</Label>
            <MotionInput
              id="name"
              placeholder="Enter a title for your blink"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value, setFormData)}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {formErrors.name && <ErrorText message={formErrors.name} />}
          </div>

          {/* Image URL Input */}
          <div>
            <Label htmlFor="iconUrl">Blink Image URL</Label>
            <MotionInput
              id="iconUrl"
              placeholder="Enter an image URL for your blink"
              value={formData.iconUrl}
              onChange={(e) => handleInputChange("iconUrl", e.target.value, setFormData)}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {formErrors.iconUrl && <ErrorText message={formErrors.iconUrl} />}
          </div>

          {/* Description Textarea */}
          <div>
            <Label htmlFor="description">Blink Description</Label>
            <MotionTextarea
              id="description"
              placeholder="Enter blink description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value, setFormData)}
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {formErrors.description && <ErrorText message={formErrors.description} />}
          </div>
        </div>
      </MotionCardContent>

      {/* Website & Notification Channel Section */}
      <MotionCardContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <Label htmlFor="website">Website Link (optional)</Label>
          <MotionInput
            id="website"
            placeholder="Enter the website URL"
            value={formData.website || ""}
            onChange={(e) => handleInputChange("website", e.target.value, setFormData)}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          {formErrors.website && <ErrorText message={formErrors.website} />}
        </div>
        <div>
          <div className="flex items-center">
            <Label htmlFor="notificationChannelId" className="mr-2">Notifications Channel (optional)</Label>
            <Tooltip>
              <TooltipTrigger>
                <span className="cursor-pointer">?</span>
              </TooltipTrigger>
              <TooltipContent>
                Notifications for new role purchases will be sent to this channel on your Discord server.
              </TooltipContent>
            </Tooltip>
          </div>
          <select
            id="notificationChannelId"
            value={formData.notificationChannelId ?? ""}
            onChange={(e) => {
              const value = e.target.value === "null" ? null : e.target.value;
              handleInputChange("notificationChannelId", value, setFormData);
            }}
            className="block w-full p-2 bg-white border rounded"
          >
            <option value={null}>Select a channel...</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>
      </MotionCardContent>

      {/* Actions Section */}
      <div className="flex justify-between">
        <MotionButton
          type="submit"
          disabled={isLoading}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded"
        >
          {isLoading ? (
            <SpinnerSvg />
          ) : (
            <SaveIcon className="mr-2" />
          )}
          Save Changes
        </MotionButton>
      </div>
    </form>
  );
}

export { ServerFormEdit };
