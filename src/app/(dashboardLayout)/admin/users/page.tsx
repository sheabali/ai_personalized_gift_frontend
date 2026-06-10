"use client";

import { useState } from "react";
import { useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } from "@/redux/api/adminApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, RefreshCw, Users, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const ROLE_COLORS: Record<string, string> = {
  USER: "bg-blue-50 text-blue-700 border-blue-200",
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  VENDOR: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useGetAllUsersQuery({});
  const [updateUserRole, { isLoading: isUpdating }] = useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.data?.users || data?.data || [];

  const filteredUsers = users.filter((user: any) => {
    if (!search) return true;
    return (
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">User Management</h1>
          <p className="text-neutral-500 font-medium">
            {filteredUsers.length} users registered
          </p>
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

      {/* Search */}
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
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-neutral-200"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-neutral-400">
            <Users className="w-16 h-16 opacity-30" />
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="font-bold text-neutral-700 pl-6">User</TableHead>
                  <TableHead className="font-bold text-neutral-700">Phone</TableHead>
                  <TableHead className="font-bold text-neutral-700">Joined</TableHead>
                  <TableHead className="font-bold text-neutral-700">Role</TableHead>
                  <TableHead className="font-bold text-neutral-700">Change Role</TableHead>
                  <TableHead className="font-bold text-neutral-700 pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: any) => (
                  <TableRow key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-2xl shadow-sm border border-neutral-50">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-2xl">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-neutral-900 text-sm">{user.name}</p>
                          <p className="text-xs text-neutral-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-neutral-500 text-sm">{user.phone || "—"}</TableCell>
                    <TableCell className="text-neutral-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-BD", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${ROLE_COLORS[user.role] || "bg-neutral-100 text-neutral-700"} rounded-full text-xs font-semibold border`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(val) => handleRoleUpdate(user.id, val)}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="h-9 text-xs rounded-xl border-neutral-200 w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER" className="text-xs">USER</SelectItem>
                          <SelectItem value="ADMIN" className="text-xs">ADMIN</SelectItem>
                          <SelectItem value="VENDOR" className="text-xs">VENDOR</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-3xl bg-white border border-neutral-100 shadow-xl max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-neutral-900">Delete User?</DialogTitle>
                            <DialogDescription className="text-neutral-500 text-sm mt-2">
                              This will permanently delete <strong>{user.name}</strong> and all their data. This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="mt-6 flex gap-2 justify-end">
                            <DialogClose asChild>
                              <Button variant="outline" className="rounded-xl">Cancel</Button>
                            </DialogClose>
                            <Button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
