const fs = require('fs');
const path = 'src/app/(defaultLayout)/checkout/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add imports
code = code.replace(
  'import { useCreateOrderMutation } from "@/redux/api/orderApi";',
  'import { useCreateOrderMutation } from "@/redux/api/orderApi";\nimport { useValidateCouponMutation } from "@/redux/api/couponApi";'
);
code = code.replace(
  'import { useState } from "react";', // might not exist
  ''
);
if (!code.includes('useState')) {
  code = code.replace(
    'import { useRouter } from "next/navigation";',
    'import { useRouter } from "next/navigation";\nimport { useState } from "react";'
  );
}

// 2. Add state and mutation
const hookInsertStr = `  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();`;
const newStateStr = `  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();
  const [validateCoupon, { isLoading: isValidatingCoupon }] = useValidateCouponMutation();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState({ amount: 0, code: "" });

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await validateCoupon({ code: couponCode, subTotal: totalAmount }).unwrap();
      if (res.success) {
        setDiscount({ amount: res.data.discountAmount, code: res.data.code });
        toast.success(\`Coupon applied! You saved ৳\${res.data.discountAmount}\`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid coupon code");
      setDiscount({ amount: 0, code: "" });
    }
  };`;
code = code.replace(hookInsertStr, newStateStr);

// 3. Modify totalAmount in onSubmit
code = code.replace(
  '        totalAmount: totalAmount,',
  '        totalAmount: totalAmount - discount.amount,'
);

// 4. Update the "Pay" button for mobile
code = code.replace(
  'isOrdering ? "Processing..." : `Pay ৳${totalAmount.toFixed(2)}`',
  'isOrdering ? "Processing..." : `Pay ৳${(totalAmount - discount.amount).toFixed(2)}`'
);

// 5. Insert coupon input
const summaryInsertStr = `              <div className="space-y-4 pt-6 border-t border-neutral-100">`;
const couponInputHtml = `              <div className="flex gap-2 border-t border-neutral-100 pt-6">
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary outline-none"
                  disabled={discount.amount > 0}
                />
                <Button 
                  type="button"
                  onClick={discount.amount > 0 ? () => { setDiscount({ amount: 0, code: "" }); setCouponCode(""); } : handleApplyCoupon}
                  disabled={isValidatingCoupon || (!couponCode && discount.amount === 0)}
                  className="h-[50px] rounded-xl"
                  variant={discount.amount > 0 ? "outline" : "default"}
                >
                  {isValidatingCoupon ? "Applying..." : discount.amount > 0 ? "Remove" : "Apply"}
                </Button>
              </div>

              <div className="space-y-4 pt-6 border-t border-neutral-100">`;
code = code.replace(summaryInsertStr, couponInputHtml);

// 6. Update pricing breakdown
const pricingOldHtml = `                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-bold">৳{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-neutral-900">Total Due</span>
                  <span className="text-3xl font-extrabold text-neutral-900">৳{totalAmount.toFixed(2)}</span>
                </div>`;

const pricingNewHtml = `                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-bold">৳{totalAmount.toFixed(2)}</span>
                </div>
                {discount.amount > 0 && (
                  <div className="flex justify-between text-[#7E122C] font-medium">
                    <span>Discount ({discount.code})</span>
                    <span className="font-bold">-৳{discount.amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="pt-4 border-t border-neutral-100 flex justify-between items-end">
                  <span className="text-lg font-bold text-neutral-900">Total Due</span>
                  <span className="text-3xl font-extrabold text-neutral-900">৳{(totalAmount - discount.amount).toFixed(2)}</span>
                </div>`;
code = code.replace(pricingOldHtml, pricingNewHtml);

fs.writeFileSync(path, code);
