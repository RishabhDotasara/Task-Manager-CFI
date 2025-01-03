"use client"
import { Skeleton } from "@/components/ui/skeleton";
import { hasPermission, permissions } from "@/permissionManager/permissions";
import { permissionAtom } from "@/states/permissionAtom";
import { teamAtom } from "@/states/teamAtom";
import { Loader2, Trash } from "lucide-react";
import { useRecoilValue } from "recoil";

interface TaskHeaderProps {
  title: string;
  isLoading: boolean;
  isDeleting: boolean;
  onDelete: () => void;

}

export function TaskHeader({ title, isLoading, isDeleting, onDelete }: TaskHeaderProps) {
  const userPermissions = useRecoilValue(permissionAtom)
  const currentTeamId = useRecoilValue(teamAtom)
  return (
    <div className="flex justify-between">
      {isLoading ? (
        <Skeleton className="h-8 w-3/4" />
      ) : (
        <>
          <h2 className="text-2xl font-bold">{title}</h2>
          {hasPermission(userPermissions, permissions.task.delete(currentTeamId)) && (
            <span 
              className="p-2 rounded bg-red-200 cursor-pointer" 
              onClick={onDelete}
            >
              {!isDeleting ? (
                <Trash className="text-red-500"/>
              ) : (
                <Loader2 className="animate-spin"/>
              )}
            </span>
          )}
        </>
      )}
    </div>
  );
}