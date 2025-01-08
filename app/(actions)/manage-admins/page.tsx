"use client";
import { useState } from "react";
import { User } from "@prisma/client";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { AddAdminForm } from "@/components/admins/AddAdminForm";
import { AdminTableSkeleton } from "@/components/admins/AdminTableSkeleton";
import { AdminTable } from "@/components/admins/AdminTable";
import { hasPermission, permissions } from "@/permissionManager/permissions";
import { ResourceError } from "@/components/error/resource-error";
import { useRecoilValue } from "recoil";
import { permissionAtom } from "@/states/permissionAtom";

export const dynamic = "force-dynamic";

export default function AdminsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userPermissions = useRecoilValue(permissionAtom);


  // Fetch admins
  const { data: admins, isLoading: isLoadingAdmins, isError } = useQuery({
    queryKey: ["users", "admins"],
    queryFn: async () => {
      const response = await fetch("/api/user/getAdmins");
      if (!response.ok) throw new Error("Failed to fetch admins");
      const data = await response.json();
      console.log(data);
      return data.admins;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Add admin mutation
  const addAdminMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/user/addAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUserId }),
      });
      if (!response.ok) throw new Error("Failed to add admin");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Admin added successfully",
        description: "User has been granted admin privileges",
      });
      setSelectedUserId("");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast({
        title: "Failed to add admin",
        description: "There was an error granting admin privileges",
        variant: "destructive",
      });
    },
  });

  // Remove admin mutation
  const removeAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch("/api/user/removeAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) throw new Error("Failed to remove admin");
      return response.json();
    },
    onMutate: ()=>{
      toast({
        title: "Removing Admin",
        description: "Revoking admin privileges...",
        variant: "info",
      })
    },
    onSuccess: () => {
      toast({
        title: "Admin removed successfully",
        description: "User's admin privileges have been revoked",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast({
        title: "Failed to remove admin",
        description: "There was an error revoking admin privileges",
        variant: "destructive",
      });
    },
  });



  return (
    <>
      {hasPermission(userPermissions, permissions.admin.admin) ? (
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">Manage Administrators</h1>

          <div className="bg-background rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Add New Administrator
            </h2>
            <AddAdminForm
              selectedUserId={selectedUserId}
              onUserSelect={setSelectedUserId}
              onAddAdmin={() => addAdminMutation.mutate()}
              isLoading={addAdminMutation.isPending}
            />
          </div>

          <div className="bg-background rounded-lg shadow">
            <h2 className="text-lg font-semibold p-6 border-b">
              Current Administrators
            </h2>
            {isLoadingAdmins ? (
              <AdminTableSkeleton />
            ) : (
              <AdminTable
                admins={admins ?? []}
                onRemoveAdmin={(userId) => removeAdminMutation.mutate(userId)}
              />
            )}
          </div>
        </div>
      ) : (
        <ResourceError
          onRetry={() => {
            toast({
              title: "Violation of Code Detected!",
              description: "This is a punishable Offence!",
            });
          }}
        />
      )}
      {isError && (
        <ResourceError
          onRetry={() => queryClient.invalidateQueries({ queryKey: ["users","all"] })}
        />
      )}
    </>
  );
}
