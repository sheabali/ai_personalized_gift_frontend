"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getProductColumns = (onDelete: (id: string) => void): ColumnDef<any>[] => [
  {
    accessorKey: "thumbnail",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50">
        <Image
          src={row.original.thumbnail}
          alt={row.original.name}
          fill
          className="object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-neutral-900">{row.original.name}</span>
        <span className="text-xs text-neutral-400 font-normal">
          {row.original.isAiEnabled ? "AI Enabled" : "Standard"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full px-2 text-[10px] uppercase font-bold text-neutral-500">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <span className="font-bold text-neutral-900">
        ৳{row.original.discountPrice || row.original.price}
      </span>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => (
      <span className={`text-sm font-medium ${row.original.stock < 5 ? "text-red-500" : "text-neutral-600"}`}>
        {row.original.stock} in stock
      </span>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={row.original.isActive ? "bg-green-500/10 text-green-600 border-none rounded-full" : "bg-neutral-100 text-neutral-400 border-none rounded-full"}>
        {row.original.isActive ? "Active" : "Draft"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-100 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px]">
            <DropdownMenuLabel className="text-xs text-neutral-400 font-medium">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/products/${row.original.id}`} className="flex items-center gap-2 cursor-pointer py-2">
                <Eye className="w-4 h-4" /> View Live
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/edit/${row.original.id}`} className="flex items-center gap-2 cursor-pointer py-2">
                <Edit className="w-4 h-4" /> Edit Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(row.original.id)}
              className="flex items-center gap-2 text-red-500 focus:text-red-500 cursor-pointer py-2"
            >
              <Trash2 className="w-4 h-4" /> Delete Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
