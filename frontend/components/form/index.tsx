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
} from "./form-common";
import { HelpTooltip } from "@/components/ui/help-tooltip";
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
                    value={formData.limitedTimeUnit as string}
                    onChange={(e) =>
                      handleInputChange("limitedTimeUnit", e.target.value, setFormData)
                    }
                    className="border rounded p-2 w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
                  >
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
              </>
            )}
          </MotionCardContent>

        </div>
        <div className="flex-1">
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MotionCardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                👤 Configure Paid Roles
              </h2>
              <Separator className="my-4" />
              <ScrollArea className="max-h-[300px] overflow-y-scroll">
                {roleData.roles.length > 0 ? (
                  roleData.roles.map((role: { id: Key | null | undefined; enabled: boolean | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; price: any; }) => (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col py-4 border-b last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Switch
                            checked={role.enabled}
                            onCheckedChange={() =>
                              handleDiscordRoleToggle(
                                role.id,
                                roleData,
                                setRoleData,
                                setFormData,
                                setRoleErrors
                              )
                            }
                            className="mr-4"
                          />
                          <h3 className="text-lg font-medium">
                            {role.name}
                          </h3>
                        </div>
                        <div className="flex items-center">
                          <MotionNumberInput
                            type="text"
                            placeholder="0"
                            value={role.price || ""}
                            onChange={(e: { target: { value: string; }; }) =>
                              handleDiscordRolePriceChange(
                                role.id,
                                e.target.value,
                                roleData,
                                setRoleData,
                                setFormData
                              )
                            }
                            className="w-32 mr-2 rounded-md"
                            disabled={!role.enabled}
                            whileFocus={{ scale: 1.02 }}
                            step="0.00000001"
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                          <span className="text-gray-600">{formData.useUsdc ? 'USDC' : formData.limitedTimeRoles ? 'SOL' : 'BARK'}</span>
                        </div>
                      </div>
                      {roleErrors[role.id] && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-destructive text-sm mt-1"
                        >
                          The bot is unable to assign this role due to having a lower position on the role list. Drag the blinkShare role above the roles which you want to enable. For a tutorial{" "}
                          <a
                            className="underline"
                            href="https://youtube/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            visit this link
                          </a>
                        </motion.p>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    No roles available for this server.
                  </p>
                )}
              </ScrollArea>
              <div className="flex justify-center mt-4">
                <MotionButton
                  onClick={() =>
                    refreshRoles(
                      formData.id,
                      roleData,
                      setRoleData,
                      setIsRefreshingRoles,
                      setRoleErrors
                    )
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isRefreshingRoles}
                >
                  {isRefreshingRoles ? <SpinnerSvg /> : <><RotateCcw className="mr-2 h-4 w-4" />Refresh Roles</>}
                </MotionButton>
              </div>
            </MotionCardContent>
          </MotionCard>
        </div>
      </div>
      <p className="text-sm text-muted-foreground text-center mt-4">
        The wallet you connect will be used to receive payments
      </p>
      {wallet.connected ? (
        <div className="flex justify-center">
          <MotionButton
            type="submit"
            className="w-[40%]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Save
          </MotionButton>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-full">
          <WalletMultiButtonDynamic className="mymultibutton text-sm break-keep flex items-center justify-center text-white py-[18px] px-[36px] rounded-[120px]" />
        </div>
      )}
    </form>
  );
}

export default ServerForm;