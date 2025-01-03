import { Button } from "@/components/ui/button";
import { SearchableMultiSelect } from "@/components/ui/searchable-multi-select";
import { Loader2, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AddAdminFormProps {
  userOptions: { value: string; label: string; }[];
  selectedUserId: string;
  onUserSelect: (value: string) => void;
  onAddAdmin: () => void;
  isLoading: boolean;
  isLoadingUsers: boolean;
}

export function AddAdminForm({
  userOptions,
  selectedUserId,
  onUserSelect,
  onAddAdmin,
  isLoading,
  isLoadingUsers,
}: AddAdminFormProps) {
  if (isLoadingUsers) {
    return (
      <div className="flex gap-4">
        <div className="flex-1">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>
    );
  }

  return (
    <div className="flex gap-4 bg-background text-foreground">
      <div className="flex-1">
        <SearchableMultiSelect
          options={userOptions}
          value={selectedUserId ? [selectedUserId] : []}
          onValueChange={(value) => onUserSelect(value[0])}
          placeholder="Select user to make admin"
        />
      </div>
      <Button
        onClick={onAddAdmin}
        disabled={!selectedUserId || isLoading}
      >
        <Shield className="h-4 w-4 mr-2" />
        Add Admin {isLoading && <Loader2 className="animate-spin"/>}
      </Button>
    </div>
  );
}