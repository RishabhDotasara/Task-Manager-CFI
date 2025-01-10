import {
    Card,
    CardHeader,
    CardContent,
  } from "@/components/ui/card";
  import { Skeleton } from "@/components/ui/skeleton";
  
  export function EventCardSkeleton() {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-[26px] w-[100px] rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <Skeleton className="mr-2.5 h-4 w-4" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <div className="flex items-center">
              <Skeleton className="mr-2.5 h-4 w-4" />
              <Skeleton className="h-4 w-[180px]" />
            </div>
            <div className="flex items-center">
              <Skeleton className="mr-2.5 h-4 w-4" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }