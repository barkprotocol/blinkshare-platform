"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

export default function ServersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { serverId } = useParams();

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      {serverId && (
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => router.push("/servers")}
              className="flex items-center text-gray-700 dark:text-gray-300"
            >
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Back to Servers
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-lg bg-gray-100 p-4 shadow-lg dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}
