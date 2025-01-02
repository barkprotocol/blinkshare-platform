"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/contexts/zustand/user-store";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner, { SpinnerSvg } from "@/components/ui/loading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { CoinPattern } from "@/components/ui/coin-pattern";
import { ThemeContext } from "@/lib/contexts/theme-provider";
import { handleConnectDiscord } from "@/components/ui/get-started-button";

interface Guild {
  id: string;
  name: string;
  image: string | null;
  hasBot: boolean;
  created: boolean;
  roles?: { id: string; name: string }[];
}

export default function Servers() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isFetchingGuilds, setIsFetchingGuilds] = useState(false);
  const [error, setError] = useState<string | null>(null); // Track errors
  const router = useRouter();
  const discordConnected = useUserStore((state) => state.discordConnected);
  const { isDark } = useContext(ThemeContext);
  const [loading, setLoading] = useState<{ [guildId: string]: boolean }>({});

  const handleConfigureClick = (guildId: string, guildName: string, guildImage: string | null) => {
    setLoading((prev) => ({ ...prev, [guildId]: true }));
    handleServerSelect(guildId, guildName, guildImage);
  };

  useEffect(() => {
    if (discordConnected) {
      fetchGuilds();
    } else {
      const storedGuilds = localStorage.getItem("guilds");
      if (storedGuilds) {
        setGuilds(JSON.parse(storedGuilds).sort((a: any, b: any) => a.name.localeCompare(b.name)));
        setIsFetchingGuilds(false);
      } else {
        handleConnectDiscord();
      }
    }
  }, [discordConnected, router]);

  const fetchGuilds = async () => {
    try {
      setIsFetchingGuilds(true);
      const userData = useUserStore.getState().userData;

      if (userData?.guilds) {
        setGuilds(userData.guilds.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      } else {
        setError("No guilds found. Please check your Discord connection.");
      }
    } catch (err) {
      setError("Failed to fetch guilds. Please try again.");
    } finally {
      setIsFetchingGuilds(false);
    }
  };

  const handleServerSelect = async (
    guildId: string,
    guildName: string,
    guildImage: string | null
  ) => {
    const token =
      useUserStore.getState().token || localStorage.getItem("discordToken");
    localStorage.setItem('selectedGuild', JSON.stringify({ guildId, guildName, guildImage }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${guildId}`,
        { headers: { Authorization: `Bearer ${token}` }, }
      );
      const data = await response.json();

      if (response.status === 401) {
        return handleConnectDiscord();
      }

      if (data?.guild?.id) {
        router.push(`/servers/${guildId}/configure`);
      } else {
        router.push(`/servers/${guildId}/create`);
      }
    } catch (error) {
      setError("An error occurred while processing your request.");
    }
  };

  const handleInstallBot = (serverId: string) => {
    const width = 700;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const appUrl = process.env.NEXT_PUBLIC_APP_BASE_URL!;

    const popup = window.open(
      `${appUrl}/install-bot?redirect=true&guild_id=${serverId}`,
      "discordAuthPopup",
      `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars`
    );

    const popupInterval = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(popupInterval);
      } else {
        try {
          if (popup.location.href.includes(appUrl)) {
            window.location.href = popup.location.href;
            popup.close();
            clearInterval(popupInterval);
          }
        } catch (error) {
          // Cross-origin error expected until redirect occurs; safely ignored
        }
      }
    }, 100);
  };

  const renderGuildCard = (guild: Guild, index: number) => (
    <motion.div
      key={guild.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex justify-center"
    >
      <SpotlightCard
        hsl
        hslMin={200}
        hslMax={280}
        from="rgba(255,255,255,0.20)"
        mode="after"
        size={400}
        className={`group w-72 rounded-2xl border-2 ${isDark ? "border-gray-700 bg-zinc-100" : "border-gray-200 bg-white"}`}
      >
        <div className={`absolute inset-px rounded-[calc(var(--radius)-1px)] ${isDark ? "bg-black/10" : "bg-white"}`} />

        <div className="h-32 relative rounded">
          {guild.image ? (
            <Image
              src={guild.image}
              alt=""
              layout="fill"
              objectFit="cover"
              className="opacity-80 blur-sm rounded"
            />
          ) : (
            <>
              <div className="w-full h-full bg-gray-100 rounded" />
              <span className="absolute inset-x-0 z-1 bottom-0 h-2  bg-gray-200" />
            </>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="absolute inset-x-0 z-1 bottom-0 h-2  bg-gray-100" />
            {guild.image ? (
              <Image
                src={guild.image}
                alt={guild.name}
                width={64}
                height={64}
                className="rounded-mdborder-2 border-gray-200 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-md bg-gray-900 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-md">
                {guild.name.charAt(0)}
              </div>
            )}
          </div>
        </div>
        <CardContent className="p-4 relative">
          <GridPattern
            offsetX={0}
            offsetY={0}
            size={64}
            className={`absolute -inset-x-0.5 -top-1/4 h-[150%] w-full skew-y-12 ${isDark ? "stroke-gray-600" : "stroke-gray-200"} stroke-[2] [mask-image:radial-gradient(black,transparent_70%)]`}
          >
            {[1, 2, 3].map((_, i) => (
              <GridPattern.Block
                key={i}
                row={1 + i}
                column={i * 2}
                className="fill-black/5 transition duration-500 hover:fill-black/10"
              />
            ))}
          </GridPattern>

          <div className="relative font-display text-4xl font-bold">
            <div className="mb-8">
              <h2 className={`text-xl font-semibold ${isDark ? "text-white" : ""}`}>
                {guild.name}
              </h2>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {guild.hasBot ? "Bot Added" : ""}
              </p>
            </div>
          </div>
          <div className="relative bottom-0 right-0 z-0 flex justify-center">
            <Button
              variant="secondary"
              className={`py-2 px-4 text-sm font-semibold transition-all duration-300 ${guild.hasBot
                ? `bg-cyan-400 hover:bg-cyan-600 text-black`
                : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              onClick={() =>
                guild.hasBot
                  ? handleConfigureClick(guild.id, guild.name, guild.image)
                  : handleInstallBot(guild.id)
              }
              disabled={loading[guild.id]}
            >
              {loading[guild.id] ? (<SpinnerSvg />) : !guild.hasBot ? "Add Bot" : guild.created ? "Configure" : "Create"}
            </Button>
          </div>
        </CardContent>
      </SpotlightCard>
    </motion.div>
  );

  return (
    <section className="pb-16">
      {isFetchingGuilds ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {guilds.length > 0 ? (
            guilds.map((guild, index) => renderGuildCard(guild, index))
          ) : (
            <p>No guilds found.</p>
          )}
        </div>
      )}
    </section>
  );
}