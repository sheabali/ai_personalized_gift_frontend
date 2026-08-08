"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, XCircle, Calendar, Loader2 } from "lucide-react";

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    code: string;
    discountType: string;
    discountValue: string;
    minOrderValue: string;
    maxUsageLimit: string;
    expiresAt: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
}

export default function CouponFormModal({
  isOpen,
  onClose,
  formData,
  handleInputChange,
  handleSubmit,
  isCreating,
}: CouponFormModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

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
                  onClick={onClose}
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
                      placeholder="Blank = Unlimited"
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
                    onClick={onClose}
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
  );
}
