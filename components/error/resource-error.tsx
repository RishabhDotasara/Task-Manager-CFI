import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { ErrorIllustration } from "./Illustration";


interface ResourceErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ResourceError({
  title = "Failed to load resource",
  message = "There was a problem loading the requested resource. Please try again.",
  onRetry
}: ResourceErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      {/* <ErrorIllustration /> */}
      
      <Alert variant="destructive" className="max-w-md mb-6 dark:text-red-300">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>

      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="min-w-[120px]"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}