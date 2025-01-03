import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface ErrorIllustrationProps {
    className?: string;
  }
  
  export function ErrorIllustration({ className }: ErrorIllustrationProps) {
    return (
        <ExclamationTriangleIcon className="font-4xl text-red-400"/>
    );
  }