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
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import {
  handleInputChange,
  handleDiscordRoleToggle,
  handleDiscordRolePriceChange,
} from "@/components/form/form-common";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import SpinnerSvg  from "@/components/ui/spinner-svg";
import { refreshRoles } from "@/components/form/form-common";

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

          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-6">
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
              <div className="flex-1">
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
                  className={`mt-1 w-full rounded border-gray-300 dark:border-gray-800 bg-transparent`}
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

          <MotionCardContent
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-row w-full space-x-4"
          >
            <div className="flex flex-col w-1/4">
              <div className="flex items-center">
                <Label htmlFor="useUsdc" className="mr-1">Pay in $USDC</Label>
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
            <div className="flex flex-col w-1/4">
              <div className="flex items-center">
                <Label htmlFor="limitedTimeRoles" className="mr-2">Limited Time</Label>
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

            {formData.limitedTimeRoles && (
              <>
                <div className="flex flex-col w-1/4">
                  <Label htmlFor="limitedTimeQuantity" className="mb-2">Amount</Label>
                  <select
                    id="limitedTimeQuantity"
                    value={formData.limitedTimeQuantity}
                    onChange={(e) =>
                      handleInputChange("limitedTimeQuantity", e.target.value, setFormData)
                    }
                    className="border rounded p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  >
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={`${num}`}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col w-1/4">
                  <Label htmlFor="limitedTimeUnit" className="mb-2">Unit</Label>
                  <select
                    id="limitedTimeUnit"
                    value={formData.limitedTimeUnit}
                    onChange={(e) =>
                      handleInputChange("limitedTimeUnit", e.target.value, setFormData)
                    }
                    className="border rounded p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  >
                    <option value="hour">Hours</option>
                    <option value="day">Days</option>
                    <option value="week">Weeks</option>
                    <option value="month">Months</option>
                  </select>
                </div>
              </>
            )}
          </MotionCardContent>

          <Separator />
          <MotionButton
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex items-center justify-center w-full py-3 bg-black text-white"
            type="submit"
          >
            <SaveIcon size={24} className="mr-2" />
            Save
          </MotionButton>
        </div>

        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <div className="flex justify-between items-center mt-6">
              <span className="font-semibold">Server Roles</span>
              <MotionButton
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsRefreshingRoles(true);
                  refreshRoles(wallet, setRoleData, setIsRefreshingRoles);
                }}
                disabled={isRefreshingRoles}
                className="text-sm"
              >
                <RotateCcw
                  size={18}
                  className={`mr-2 ${isRefreshingRoles && "animate-spin"}`}
                />
                {isRefreshingRoles ? "Refreshing" : "Refresh"}
              </MotionButton>
            </div>

            <ScrollArea className="mt-4 max-h-72">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {roleData?.map((role) => (
                  <MotionCard
                    key={role.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    <MotionCardContent>
                      <Label>{role.name}</Label>
                      <MotionNumberInput
                        value={role.price}
                        onChange={(value) => handleDiscordRolePriceChange(value, role, setRoleData)}
                        placeholder="Set price"
                        className="w-full mt-2"
                      />
                      <div className="mt-2">
                        <Switch
                          id={`role-toggle-${role.id}`}
                          checked={role.enabled}
                          onCheckedChange={(value) =>
                            handleDiscordRoleToggle(value, role.id, setRoleData)
                          }
                        />
                      </div>
                    </MotionCardContent>
                  </MotionCard>
                ))}
              </motion.div>
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </form>
  );
}

export default ServerForm;
