import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TeamTableSearchProps {
  onSearch: (value: string) => void;
}

export function TeamTableSearch({ onSearch }: TeamTableSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search teams..."
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}