"use client";

import { useMemo } from "react";
import { Ticket, AlertCircle } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { NRTable } from "@/components/ui/core/NRTable";
import TablePagination from "@/components/ui/core/NRTable/TablePagination";
import { getCouponColumns } from "./CouponColumns";
import { Skeleton } from "@/components/ui/skeleton";

interface CouponTableProps {
  coupons: any[];
  paginatedCoupons: any[];
  isLoading: boolean;
  isError: boolean;
  page: number;
  setPage: (page: number) => void;
  totalPage: number;
  handleToggleActive: (id: string, currentStatus: boolean) => void;
  handleDelete: (id: string, code: string) => void;
}

function CouponTableSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden p-6 space-y-4">
      <div className="grid grid-cols-7 gap-4 pb-3 border-b border-neutral-100">
        {["Code", "Discount", "Min Spend", "Usage", "Expiry", "Status", "Actions"].map((h) => (
          <Skeleton key={h} className="h-4 w-16" />
        ))}
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-7 gap-4 py-4 items-center border-b border-neutral-50 last:border-none">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export default function CouponTable({
  coupons,
  paginatedCoupons,
  isLoading,
  isError,
  page,
  setPage,
  totalPage,
  handleToggleActive,
  handleDelete,
}: CouponTableProps) {
  const columns: ColumnDef<any>[] = useMemo(
    () => getCouponColumns({ handleToggleActive, handleDelete }),
    [handleToggleActive, handleDelete]
  );

  if (isLoading) {
    return <CouponTableSkeleton />;
  }

  if (isError) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-neutral-100 flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
        <AlertCircle className="w-10 h-10" />
        <p className="font-bold">Failed to load coupons</p>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-neutral-100 flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="p-6 bg-rose-50 text-rose-500 rounded-full mb-4">
          <Ticket className="w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900">No Coupons Yet</h3>
        <p className="text-neutral-500 max-w-sm mt-2 font-medium">
          Create your first promotional discount coupon code to incentivize purchases.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden px-6">
      <NRTable columns={columns} data={paginatedCoupons} emptyMessage="No coupons found." />
      {totalPage > 1 && (
        <TablePagination
          totalPage={totalPage}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
