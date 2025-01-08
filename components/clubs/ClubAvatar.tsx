import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ClubAvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function ClubAvatar({ name, imageUrl, size = "md" }: ClubAvatarProps) {
  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage
        src={imageUrl || "https://cfi.iitm.ac.in/assets/WebopsandBlockchainLogo-207245f0.png"}
        alt={name}
      />
      <AvatarFallback>
        {name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}