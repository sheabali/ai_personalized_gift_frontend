"use client";

import { useState } from "react";
import {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useToggleCouponStatusMutation,
  useDeleteCouponMutation,
} from "@/redux/api/couponApi";
import {
  Ticket,
  Plus,
  Trash2,
  Calendar,
  Percent,
  TrendingUp,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle,
  XCircle,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCouponsPage() {
  const { data: response, isLoading, isError } = useGetAllCouponsQuery(undefined);
  const coupons = response?.data || [];

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [toggleStatus] = useToggleCouponStatusMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

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

  // Stats calculations
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter((c: any) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > new Date())).length;
  const expiredCoupons = coupons.filter((c: any) => c.expiresAt && new Date(c.expiresAt) <= new Date()).length;

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
          className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-xl shadow-rose-500/20 transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          Create New Coupon
        </motion.button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat 1 */}
        <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center gap-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-5 -mt-5"></div>
          <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Total Coupons</p>
            <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">{isLoading ? "..." : totalCoupons}</h3>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center gap-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-5 -mt-5"></div>
          <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Active & Valid</p>
            <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">{isLoading ? "..." : activeCoupons}</h3>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="relative overflow-hidden bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm flex items-center gap-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-5 -mt-5"></div>
          <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Expired</p>
            <h3 className="text-3xl font-extrabold text-neutral-900 mt-1">{isLoading ? "..." : expiredCoupons}</h3>
          </div>
        </div>
      </div>

      {/* Coupons Table/List */}
      <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
            <p className="text-neutral-500 font-medium">Loading coupons...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-rose-500">
            <AlertCircle className="w-10 h-10" />
            <p className="font-bold">Failed to load coupons</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="p-6 bg-rose-50 text-rose-500 rounded-full mb-4">
              <Ticket className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">No Coupons Yet</h3>
            <p className="text-neutral-500 max-w-sm mt-2 font-medium">
              Create your first promotional discount coupon code to incentivize purchases.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-bottom border-neutral-100">
                  <th className="p-6 text-sm font-bold text-neutral-500 uppercase tracking-wider">Coupon Code</th>
                  <th className="p-6 text-sm font-bold text-neutral-500 uppercase tracking-wider">Discount</th>
                  <th className="p-6 text-sm font-bold text-neutral-500 uppercase tracking-wider">Min. Spend</th>
                  <th className="p-6 text-sm font-bold text-neutral-500 uppercase tracking-wider">Usage / Limit</th>
                  <th className="p-6 text-sm font-bold text-neutral-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="p-6 text-sm font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="p-6 text-sm font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {coupons.map((coupon: any) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) <= new Date();
                  const isUsageLimitReached = coupon.maxUsageLimit && coupon.usageCount >= coupon.maxUsageLimit;
                  const isValid = coupon.isActive && !isExpired && !isUsageLimitReached;

                  return (
                    <tr key={coupon.id} className="hover:bg-neutral-50/50 transition-colors duration-150">
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-rose-50 text-rose-600 font-bold px-3 py-1.5 rounded-lg border border-rose-100 text-sm tracking-wider">
                            {coupon.code}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-bold text-neutral-800 text-sm">
                          {coupon.discountType === "PERCENTAGE" 
                            ? `${coupon.discountValue}% Off` 
                            : `৳${coupon.discountValue} Off`}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="text-neutral-500 text-sm font-medium">
                          {coupon.minOrderValue ? `৳${coupon.minOrderValue}` : "No minimum"}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-800 font-bold text-sm">{coupon.usageCount}</span>
                          <span className="text-neutral-400">/</span>
                          <span className="text-neutral-500 text-sm font-medium">
                            {coupon.maxUsageLimit ? coupon.maxUsageLimit : "∞"}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
                          <Calendar className="w-4 h-4 text-neutral-400" />
                          {coupon.expiresAt 
                            ? new Date(coupon.expiresAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Never Expires"}
                        </div>
                      </td>
                      <td className="p-6">
                        <button
                          onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                            isValid
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isValid ? "bg-emerald-500" : "bg-neutral-400"}`}></span>
                          {isValid ? "Active" : isExpired ? "Expired" : isUsageLimitReached ? "Limit Reached" : "Disabled"}
                        </button>
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          className="p-2 hover:bg-rose-50 hover:text-rose-500 text-neutral-400 rounded-xl transition-all duration-200"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Create Coupon */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
            ></motion.div>

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-neutral-100 z-10"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-extrabold text-neutral-900 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-rose-500" />
                    New Coupon Code
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-full text-neutral-500 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Code */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-700">Coupon Code *</label>
                    <input
                      type="text"
                      name="code"
                      required
                      placeholder="e.g. SUMMER25"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-500 font-mono font-bold tracking-wider text-neutral-800 uppercase"
                    />
                  </div>

                  {/* Type and Value Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-700">Type *</label>
                      <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-500 text-neutral-800 font-medium"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Amount (৳)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-700">Value *</label>
                      <input
                        type="number"
                        name="discountValue"
                        required
                        min="1"
                        placeholder={formData.discountType === "PERCENTAGE" ? "10" : "150"}
                        value={formData.discountValue}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-500 text-neutral-800 font-bold"
                      />
                    </div>
                  </div>

                  {/* Limits and Min Spend Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-700">Min. Order Value (৳)</label>
                      <input
                        type="number"
                        name="minOrderValue"
                        min="0"
                        placeholder="e.g. 500"
                        value={formData.minOrderValue}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-500 text-neutral-800 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-neutral-700">Max Usage Limit</label>
                      <input
                        type="number"
                        name="maxUsageLimit"
                        min="1"
                        placeholder="e.g. 100 (Blank = Unlimited)"
                        value={formData.maxUsageLimit}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-500 text-neutral-800 font-medium"
                      />
                    </div>
                  </div>

                  {/* Expiration Date */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-neutral-700 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      Expiration Date
                    </label>
                    <input
                      type="date"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-rose-500 text-neutral-800 font-medium"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-3 px-4 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-bold rounded-xl transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400 text-white font-bold rounded-xl shadow-xl shadow-rose-500/10 flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Coupon"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
