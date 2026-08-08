import { useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/redux/api/adminApi";
import { toast } from "sonner";

/**
 * Custom hook encapsulating all data-fetching and action logic for the Admin Users Table.
 * Keeps the UserTable component as a pure-UI renderer.
 */
export function useAdminUsers() {
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Normalize the data structure from the API response
  const users: any[] = data?.data?.users || data?.data || [];

  /**
   * Client-side filter — allows instant search without an extra API call.
   * Matches on user name and email fields, case-insensitively.
   */
  const filteredUsers = users.filter((user) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term)
    );
  });

  /** Update a user's role via the API. */
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  /** Delete a user via the API. */
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return {
    users,
    filteredUsers,
    isLoading,
    isUpdating,
    isDeleting,
    search,
    setSearch,
    refetch,
    handleRoleUpdate,
    handleDeleteUser,
  };
}
