"use client";

import { useEffect, useState, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/contexts/zustand/user-store";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Subscription {
  id: string;
  createTime: string;
  discordUserId: string;
  expiresAt: string;
  role: {
    name: string;
    amount: string;
  };
}

export default function MySubscriptions({ serverName }: { serverName: string }) {
  const { serverId } = useParams<{ serverId: string }>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recordsPerPage = 20;
  const token = useUserStore((state) => state.token) || (typeof window !== 'undefined' ? localStorage.getItem("discordToken") : null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!serverId || !token) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverId}/subscriptions`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          throw new Error(response.status === 404 ? "Subscriptions not found for this server." : "An unexpected error occurred. Please try again.");
        }

        const data = await response.json();
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching subscriptions", error);
        const errorMessage = error instanceof Error ? error.message : "Error fetching subscriptions. Please check your connection.";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [serverId, token]);

  const totalPages = Math.ceil(subscriptions.length / recordsPerPage);

  const currentSubscriptions = useMemo(
    () => subscriptions.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage),
    [subscriptions, currentPage]
  );

  const totalSOLAmount = useMemo(
    () => subscriptions.reduce((total, subscription) => total + parseFloat(subscription.role.amount || "0"), 0),
    [subscriptions]
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Subscriptions for {serverName}</h2>
      <Separator />
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : error ? (
        <p className="text-red-500" role="alert">{error}</p>
      ) : subscriptions.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Discord User ID</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead>Role Name</TableHead>
                  <TableHead>SOL Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell>{formatDate(subscription.createTime)}</TableCell>
                    <TableCell>{subscription.discordUserId}</TableCell>
                    <TableCell>{subscription.expiresAt ? formatDate(subscription.expiresAt) : "Never"}</TableCell>
                    <TableCell>{subscription.role.name}</TableCell>
                    <TableCell>{subscription.role.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Go to next page"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Total Records: {subscriptions.length}</p>
              <p>Total SOL Amount: {totalSOLAmount.toFixed(4)}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">No subscriptions found for this server.</p>
      )}
    </div>
  );
}

