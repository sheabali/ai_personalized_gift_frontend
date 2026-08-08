"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const ROLE_COLORS: Record<string, string> = {
  USER: "bg-blue-50 text-blue-700 border-blue-200",
  ADMIN: "bg-purple-50 text-purple-700 border-purple-200",
  VENDOR: "bg-orange-50 text-orange-700 border-orange-200",
};

interface UserActionsProps {
  onRoleUpdate: (userId: string, newRole: string) => void;
  onDelete: (userId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const getUserColumns = ({
  onRoleUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: UserActionsProps): ColumnDef<any>[] => [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 rounded-2xl shadow-sm border border-neutral-50">
          <AvatarImage src={row.original.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold rounded-2xl">
            {row.original.name?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-neutral-900 text-sm">{row.original.name}</p>
          <p className="text-xs text-neutral-400">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-neutral-500 text-sm">{row.original.phone || "—"}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-neutral-500 text-xs">
        {new Date(row.original.createdAt).toLocaleDateString("en-BD", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge
        className={`${
          ROLE_COLORS[row.original.role] || "bg-neutral-100 text-neutral-700"
        } rounded-full text-xs font-semibold border`}
      >
        {row.original.role}
      </Badge>
    ),
  },
  {
    id: "changeRole",
    header: "Change Role",
    cell: ({ row }) => (
      <Select
        defaultValue={row.original.role}
        onValueChange={(val) => onRoleUpdate(row.original.id, val)}
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
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
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
              This will permanently delete{" "}
              <strong>{row.original.name}</strong> and all their data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-xl">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => onDelete(row.original.id)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
];
