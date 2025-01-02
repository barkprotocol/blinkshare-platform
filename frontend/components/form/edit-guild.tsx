"use client";

import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ServerFormSkeleton } from "@/components/skeletons/server-form";
import { RotateCcw, SaveIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ServerFormProps } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MotionCard,
  MotionCardContent,
  MotionInput,
  MotionTextarea,
  MotionNumberInput,
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
import { HelpTooltip } from "../ui/tooltip";
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
            {HelpTooltip("Notifications for new role purchases will be sent to this channel on your Discord server")}
          </div>
          <select
            id="notificationChannelId"
            value={formData.notificationChannelId ?? ""}
            onChange={(e) => {
              const value = e.target.value === "null" ? null : e.target.value;
              handleInputChange("notificationChannelId", value, setFormData);
            }}
            className="mt-1 w-full rounded border-gray-300 dark:border-gray-800 bg-transparent"
          >
            <option value="null">None</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>
      </MotionCardContent>

      {/* Wallet Section */}
      <MotionCardContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col">
          <div className="flex items-center">
            <Label htmlFor="payoutWallet" className="mr-2">Payout Wallet</Label>
            {HelpTooltip("Role purchase payments from your blink will be sent to this address. To change it, connect to a different address and save at the bottom of the page.")}
          </div>
          <MotionInput
            id="payoutWallet"
            value={formData.address}
            readOnly
            className="mt-2 w-full"
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        </div>
      </MotionCardContent>

      {/* Payment Method & Role Time Limit */}
      <MotionCardContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-row w-full space-x-4"
      >
        <div className="flex flex-col w-1/4">
          <div className="flex items-center">
            <Label htmlFor="useUsdc" className="mr-1">Pay in $USDC</Label>
            {HelpTooltip("Use $USDC, SOL, or BARK token for payments")}
          </div>
          <Switch
            id="useUsdc"
            checked={formData.useUsdc}
            onCheckedChange={(value) => handleInputChange("useUsdc", value, setFormData)}
            className="mt-2"
          />
        </div>
        <div className="flex flex-col w-1/4">
          <div className="flex items-center">
            <Label htmlFor="limitedTimeRoles" className="mr-2">Limited Time</Label>
            {HelpTooltip("If toggled on, roles will be available to members for a limited time only and will be automatically removed afterwards.")}
          </div>
          <Switch
            id="limitedTimeRoles"
            checked={formData.limitedTimeRoles}
            onCheckedChange={(value) => handleInputChange("limitedTimeRoles", value, setFormData)}
            className="mt-2"
          />
        </div>

        {/* Limited Time Role Inputs */}
        {formData.limitedTimeRoles && (
          <div className="flex space-x-4">
            <div className="flex flex-col w-1/4">
              <Label htmlFor="limitedTimeQuantity">Amount</Label>
              <select
                id="limitedTimeQuantity"
                value={formData.limitedTimeQuantity}
                onChange={(e) => handleInputChange("limitedTimeQuantity", e.target.value, setFormData)}
                className="border rounded p-2 w-full"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-1/4">
              <Label htmlFor="roleTimeLimit">Time Limit</Label>
              <input
                id="roleTimeLimit"
                type="number"
                value={formData.roleTimeLimit}
                onChange={(e) => handleInputChange("roleTimeLimit", e.target.value, setFormData)}
                className="border rounded p-2 w-full"
              />
            </div>
          </div>
        )}
      </MotionCardContent>

      {/* Save Changes Button */}
      <MotionButton
        type="submit"
        className="self-end mt-6"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Save Changes
        <SaveIcon className="ml-2 h-4 w-4" />
      </MotionButton>
    </form>
  );
}

export default ServerFormEdit;
