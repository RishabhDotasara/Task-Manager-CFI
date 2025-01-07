import React from "react";
import { useToast } from "./use-toast";
import { useQuery } from "@tanstack/react-query";

export default function useAllUsersQuery() {
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user/getAll");
      if (response.ok) {
        const data = await response.json();
        return data.users;
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const allUsersQuery = useQuery({
    queryKey: ["users", "all"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000,

  });

  return {
    allUsersQuery,
    isLoading:allUsersQuery.isLoading,
    isError:allUsersQuery.isError
  };
}
