"use client";

import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search, RefreshCw, Package } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

const ORDER_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useGetAllOrdersQuery(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const orders = data?.data?.orders || data?.data || [];

  const filteredOrders = orders.filter((order: any) => {
    if (!search) return true;
    return (
      order.id?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Order Management</h1>
          <p className="text-neutral-500 font-medium">
            {filteredOrders.length} orders found
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

      {/* Filters */}
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
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-neutral-200"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4 text-neutral-400">
            <Package className="w-16 h-16 opacity-30" />
            <p className="font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="font-bold text-neutral-700 pl-6">Order ID</TableHead>
                  <TableHead className="font-bold text-neutral-700">Customer</TableHead>
                  <TableHead className="font-bold text-neutral-700">Amount</TableHead>
                  <TableHead className="font-bold text-neutral-700">Items</TableHead>
                  <TableHead className="font-bold text-neutral-700">Date</TableHead>
                  <TableHead className="font-bold text-neutral-700">Status</TableHead>
                  <TableHead className="font-bold text-neutral-700 pr-6">Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: any) => (
                  <TableRow key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    <TableCell className="pl-6 font-mono text-xs text-neutral-500">
                      #{order.id?.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm">{order.user?.name || "—"}</p>
                        <p className="text-xs text-neutral-400">{order.user?.email || "—"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-neutral-900">
                      ৳{order.totalAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-neutral-600 text-sm">
                      {order.orderItems?.length || 0} item(s)
                    </TableCell>
                    <TableCell className="text-neutral-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-BD", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${STATUS_COLORS[order.orderStatus] || "bg-neutral-100 text-neutral-700"} rounded-full text-xs font-semibold border`}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Select
                        defaultValue={order.orderStatus}
                        onValueChange={(val) => handleStatusUpdate(order.id, val)}
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
