"use client";

import { useState, useMemo } from "react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/redux/api/adminApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, RefreshCw, Package } from "lucide-react";
import { motion } from "framer-motion";
import { ColumnDef } from "@tanstack/react-table";
import { NRTable } from "@/components/ui/core/NRTable";
import TablePagination from "@/components/ui/core/NRTable/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";

// ─── Constants ─────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const ITEMS_PER_PAGE = 10;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function OrderTableSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden p-6 space-y-4">
      <div className="grid grid-cols-7 gap-4 pb-3 border-b border-neutral-100">
        {["Order ID", "Customer", "Amount", "Items", "Date", "Status", "Update"].map((h) => (
          <Skeleton key={h} className="h-4 w-16" />
        ))}
      </div>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="grid grid-cols-7 gap-4 py-4 items-center border-b border-neutral-50 last:border-none">
          <Skeleton className="h-4 w-20 rounded" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useGetAllOrdersQuery(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = data?.data?.orders || data?.data || [];

  // Client-side search filter
  const filteredOrders = orders.filter((order: any) => {
    if (!search) return true;
    const customerName = order.user?.name || order.shippingAddress?.fullName || "";
    const customerEmail = order.user?.email || order.shippingAddress?.email || "";
    return (
      order.id?.toLowerCase().includes(search.toLowerCase()) ||
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      customerEmail.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Client-side pagination
  const totalPage = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-neutral-500">
          #{row.original.id?.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const order = row.original;
        const name = order.user?.name || order.shippingAddress?.fullName || "Guest Customer";
        const email = order.user?.email || order.shippingAddress?.email || "—";
        return (
          <div>
            <p className="font-semibold text-neutral-900 text-sm">{name}</p>
            <p className="text-xs text-neutral-400">{email}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "totalPrice",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.original.totalPrice || row.original.totalAmount || 0;
        return <span className="font-bold text-neutral-900">৳{amount.toLocaleString()}</span>;
      },
    },
    {
      id: "itemsCount",
      header: "Items",
      cell: ({ row }) => {
        const count = row.original.items?.length || row.original.orderItems?.length || 0;
        return <span className="text-neutral-600 text-sm">{count} item(s)</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
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
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => (
        <Badge className={`${STATUS_COLORS[row.original.orderStatus] || "bg-neutral-100 text-neutral-700"} rounded-full text-xs font-semibold border`}>
          {row.original.orderStatus}
        </Badge>
      ),
    },
    {
      id: "updateStatus",
      header: "Update",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.orderStatus}
          onValueChange={(val) => handleStatusUpdate(row.original.id, val)}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-9 text-xs rounded-xl border-neutral-200 w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ], [isUpdating]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Order Management</h1>
          <p className="text-neutral-500 font-medium">{filteredOrders.length} orders found</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="rounded-xl gap-2 h-11 px-6 border-neutral-100 bg-white">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Filters — always visible */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 h-11 rounded-xl border-neutral-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl border-neutral-200">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Table / Skeleton / Empty State */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {isLoading ? (
          <OrderTableSkeleton />
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center justify-center py-24 space-y-4 text-neutral-400">
            <Package className="w-16 h-16 opacity-30" />
            <p className="font-medium">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden px-6">
            <NRTable columns={columns} data={paginatedOrders} emptyMessage="No orders found" />
            <TablePagination
              totalPage={totalPage}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}
