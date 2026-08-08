"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NRTable } from "@/components/ui/core/NRTable";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { getUserColumns } from "./UserColumns";
import UserTableSkeleton from "./UserTableSkeleton";
import TablePagination from "@/components/ui/core/NRTable/TablePagination";

export default function UserTable() {
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const {
    filteredUsers,
    isLoading,
    isUpdating,
    isDeleting,
    search,
    setSearch,
    refetch,
    handleRoleUpdate,
    handleDeleteUser,
  } = useAdminUsers();

  const columns = useMemo(
    () =>
      getUserColumns({
        onRoleUpdate: handleRoleUpdate,
        onDelete: handleDeleteUser,
        isUpdating,
        isDeleting,
      }),
    [handleRoleUpdate, handleDeleteUser, isUpdating, isDeleting]
  );

  const totalPage = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">User Management</h1>
          <p className="text-neutral-500 font-medium">{filteredUsers.length} users registered</p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          className="rounded-xl gap-2 h-11 px-6 border-neutral-100 bg-white"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 h-11 rounded-xl border-neutral-200"
          />
        </div>
      </motion.div>

      {/* Table / Skeleton / Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <UserTableSkeleton />
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center justify-center py-24 space-y-4 text-neutral-400">
            <Users className="w-16 h-16 opacity-30" />
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden px-6">
            <NRTable columns={columns} data={paginatedUsers} emptyMessage="No users found" />
            {totalPage > 1 && (
              <TablePagination totalPage={totalPage} currentPage={page} onPageChange={setPage} />
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
