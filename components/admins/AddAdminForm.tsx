import { Button } from "@/components/ui/button";
import { SearchableMultiSelect } from "@/components/ui/searchable-multi-select";
import { Loader2, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import useAllUsersQuery from "@/hooks/use-allusers";

interface AddAdminFormProps {
  selectedUserId: string;
  onUserSelect: (value: string) => void;
  onAddAdmin: () => void;
  isLoading: boolean;
}

export function AddAdminForm({
  selectedUserId,
  onUserSelect,
  onAddAdmin,
  isLoading,
}: AddAdminFormProps) {

  const {allUsersQuery, searchUserMutation} = useAllUsersQuery()
  const [searchUsers, setSearchUsers] = useState<User[] | undefined>(undefined);


  useEffect(()=>{
    if (allUsersQuery.data)
    {
      setSearchUsers(allUsersQuery.data)
    }
  },[allUsersQuery.data])

  const userOptions =
  searchUsers?.map((user: User) => ({
    value: user.userId,
    label: `${user.username} | ${user.employeeId}`,
  })) ?? [];

  const onSearch = async (employeeId:string)=>{
    await searchUserMutation.mutate(employeeId, {
      onSuccess: (data)=>{
        setSearchUsers(data)
      }
    })
  }



  if (allUsersQuery.isLoading) {
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
        onSearch={onSearch}
          shouldFilter={false}
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