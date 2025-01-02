import { Skeleton } from "@/components/ui/skeleton";

export function ServerFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Blink Title Section */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Blink Description Section */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-20 w-full" />
      </div>

      {/* Blink Image Section */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>

      {/* Website & Channel Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Wallet Section */}
      <Skeleton className="h-10 w-full" />
      
      {/* Dynamic Role and Time Section (if applicable) */}
      <div className="space-y-4 mt-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  );
}
