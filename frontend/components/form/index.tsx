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
} from "./form-common";
import { HelpTooltip } from "../ui/tooltip";
import { SpinnerSvg } from "../loading";
import { refreshRoles } from "./form-common";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

function ServerForm({
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
    <form onSubmit={onSubmit} className="space-y-6 flex-col">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {/* Blink Title */}
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label htmlFor="name">Blink Title</Label>
            <MotionInput
              id="name"
              placeholder="Enter a title for your blink"
              value={formData.name}
              onChange={(e) =>
                handleInputChange("name", e.target.value, setFormData)
              }
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {formErrors.name && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm mt-1"
              >
                {formErrors.name}
              </motion.p>
            )}
          </MotionCardContent>

          {/* Blink Image URL */}
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Label htmlFor="iconUrl">Blink Image URL</Label>
            <MotionInput
              id="iconUrl"
              placeholder="Enter an image URL for your blink"
              value={formData.iconUrl}
              onChange={(e) =>
                handleInputChange("iconUrl", e.target.value, setFormData)
              }
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {formErrors.iconUrl && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm mt-1"
              >
                {formErrors.iconUrl}
              </motion.p>
            )}
          </MotionCardContent>

          {/* Blink Description */}
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Label htmlFor="description">Blink Description</Label>
            <MotionTextarea
              id="description"
              placeholder="Enter blink description"
              value={formData.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value, setFormData)
              }
              whileFocus={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            {formErrors.description && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-destructive text-sm mt-1"
              >
                {formErrors.description}
              </motion.p>
            )}
          </MotionCardContent>

          {/* Optional Website and Notification Channel */}
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Website */}
              <div className="flex-1">
                <Label htmlFor="website">Website Link (optional)</Label>
                <MotionInput
                  id="website"
                  placeholder="Enter the website URL"
                  value={formData.website || ""}
                  onChange={(e) =>
                    handleInputChange("website", e.target.value, setFormData)
                  }
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                {formErrors.website && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-destructive text-sm mt-1"
                  >
                    {formErrors.website}
                  </motion.p>
                )}
              </div>

              {/* Notification Channel */}
              <div className="flex-1">
                <div className="flex items-center">
                  <Label htmlFor="notificationChannelId" className="mr-2">
                    Notifications Channel (optional)
                  </Label>
                  {HelpTooltip("Notifications for new role purchases will be sent to this channel on your Discord server")}
                </div>
                <select
                  id="notificationChannelId"
                  value={formData.notificationChannelId ?? ""}
                  onChange={(e) => {
                    const value = e.target.value === "null" ? null : e.target.value;
                    handleInputChange("notificationChannelId", value, setFormData);
                  }}
                  className="mt-1 w-full rounded border-gray-200 dark:border-gray-800 bg-transparent"
                >
                  <option value="null">None</option>
                  {channels.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      {channel.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </MotionCardContent>

          {/* Payment & Role Settings */}
          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-row w-full space-x-4"
          >
            {/* Pay in $USDC Toggle */}
            <div className="flex flex-col w-1/4">
              <div className="flex items-center">
                <Label htmlFor="useUsdc" className="mr-1">
                  Pay in $USDC
                </Label>
                {HelpTooltip("Use $USDC token for payments instead of SOL")}
              </div>

              <Switch
                id="useUsdc"
                checked={formData.useUsdc}
                onCheckedChange={(value) =>
                  handleInputChange("useUsdc", value, setFormData)
                }
                className="mt-2"
              />
            </div>

            {/* Limited Time Roles Toggle */}
            <div className="flex flex-col w-1/4">
              <div className="flex items-center">
                <Label htmlFor="limitedTimeRoles" className="mr-2">
                  Limited Time
                </Label>
                {HelpTooltip("If toggled on, roles will be available to members for a limited time only and will be automatically removed afterwards.")}
              </div>
              <Switch
                id="limitedTimeRoles"
                checked={formData.limitedTimeRoles}
                onCheckedChange={(value) =>
                  handleInputChange("limitedTimeRoles", value, setFormData)
                }
                className="mt-2"
              />
            </div>

            {/* Limited Time Role Settings */}
            {formData.limitedTimeRoles && (
              <>
                <div className="flex flex-col w-1/4">
                  <Label htmlFor="limitedTimeQuantity" className="mb-2">
                    Amount
                  </Label>
                  <select
                    id="limitedTimeQuantity"
                    value={formData.limitedTimeQuantity}
                    onChange={(e) =>
                      handleInputChange("limitedTimeQuantity", e.target.value, setFormData)
                    }
                    className="border rounded p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={`${num}`}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col w-1/4">
                  <Label htmlFor="limitedTimeUnit" className="mb-2">
                    Unit
                  </Label>
                  <select
                    id="limitedTimeUnit"
                    value={formData.limitedTimeUnit}
                    onChange={(e) =>
                      handleInputChange("limitedTimeUnit", e.target.value, setFormData)
                    }
                    className="border rounded p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>
              </>
            )}
          </MotionCardContent>
        </div>
      </div>
      <div className="space-y-6 mt-6">
        {/* Save Changes Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          type="submit"
          disabled={isLoading}
          className="bg-green-600 text-white px-6 py-3 rounded-md font-medium w-full flex items-center justify-center disabled:bg-gray-400"
        >
          {isLoading ? (
            <SpinnerSvg />
          ) : (
            <>
              <SaveIcon size={16} />
              <span className="ml-2">Save Changes</span>
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
}

export default ServerForm;
