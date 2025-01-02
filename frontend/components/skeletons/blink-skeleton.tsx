import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BlinkCardSkeleton() {
  return (
    <Card className="w-full max-w-lg h-[620px]">
      <CardContent className="p-6 space-y-4">
        {/* Image Skeleton */}
        <Skeleton className="h-[400px] w-full mb-4" />
        
        {/* Title Skeleton */}
        <Skeleton className="h-4 w-3/4" />
        
        {/* Subtitle Skeleton */}
        <Skeleton className="h-4 w-1/2 mb-4" />
        
        {/* Button Skeletons */}
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 mt-4 w-full" />
      </CardContent>
    </Card>
  );
}
