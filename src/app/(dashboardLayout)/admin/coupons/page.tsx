"use client";

import { Ticket, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminCoupons } from "@/hooks/useAdminCoupons";
import CouponStats from "@/components/module/Admin/Coupons/CouponStats";
import CouponTable from "@/components/module/Admin/Coupons/CouponTable";
import CouponFormModal from "@/components/module/Admin/Coupons/CouponFormModal";

export default function AdminCouponsPage() {
  const {
    coupons,
    paginatedCoupons,
    isLoading,
    isError,
    page,
    setPage,
    totalPage,
    isModalOpen,
    setIsModalOpen,
    formData,
    handleInputChange,
    handleSubmit,
    isCreating,
    handleToggleActive,
    handleDelete,
    stats,
  } = useAdminCoupons();

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-500/20">
              <Ticket className="w-6 h-6" />
            </span>
            Coupon Management
          </h1>
          <p className="text-neutral-500 mt-1.5 font-medium">
            Create, monitor, and configure discounts and promotional codes.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/20 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          Create New Coupon
        </motion.button>
      </div>

      {/* Stats */}
      <CouponStats stats={stats} isLoading={isLoading} />

      {/* Table */}
      <CouponTable
        coupons={coupons}
        paginatedCoupons={paginatedCoupons}
        isLoading={isLoading}
        isError={isError}
        page={page}
        setPage={setPage}
        totalPage={totalPage}
        handleToggleActive={handleToggleActive}
        handleDelete={handleDelete}
      />

      {/* Create Coupon Modal */}
      <CouponFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isCreating={isCreating}
      />
    </div>
  );
}
