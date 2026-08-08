"use client";

import { useState } from "react";
import {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useToggleCouponStatusMutation,
  useDeleteCouponMutation,
} from "@/redux/api/couponApi";
import { toast } from "sonner";

export function useAdminCoupons() {
  const { data: response, isLoading, isError } = useGetAllCouponsQuery(undefined);
  const coupons = response?.data || [];

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [toggleStatus] = useToggleCouponStatusMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  // Pagination state
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderValue: "",
    maxUsageLimit: "",
    expiresAt: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : null,
        maxUsageLimit: formData.maxUsageLimit ? Number(formData.maxUsageLimit) : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
      };
      const res = await createCoupon(payload).unwrap();
      if (res.success) {
        toast.success("Coupon created successfully! 🎟️");
        setIsModalOpen(false);
        setFormData({
          code: "",
          discountType: "PERCENTAGE",
          discountValue: "",
          minOrderValue: "",
          maxUsageLimit: "",
          expiresAt: "",
        });
        setPage(1);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create coupon");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await toggleStatus({ id, isActive: !currentStatus }).unwrap();
      if (res.success) {
        toast.success(`Coupon ${!currentStatus ? "activated" : "deactivated"} successfully!`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update coupon status");
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon "${code}"?`)) return;
    try {
      const res = await deleteCoupon(id).unwrap();
      if (res.success) {
        toast.success("Coupon deleted successfully!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete coupon");
    }
  };

  // Stats
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(
    (c: any) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date())
  ).length;
  const expiredCoupons = coupons.filter(
    (c: any) => c.expiresAt && new Date(c.expiresAt) <= new Date()
  ).length;

  // Client-side pagination
  const totalPage = Math.ceil(coupons.length / ITEMS_PER_PAGE);
  const paginatedCoupons = coupons.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return {
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
    stats: {
      totalCoupons,
      activeCoupons,
      expiredCoupons,
    },
  };
}
