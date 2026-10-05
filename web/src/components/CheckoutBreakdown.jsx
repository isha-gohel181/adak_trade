import React from 'react'

const CheckoutBreakdown = ({
  basePrice = 0,
  discount = 0,
  gstRate = 0.18,
  couponData = null,
  className = '',
  compact = false
}) => {
  const format = (v) => `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const discountedBase = Math.max(0, basePrice - discount)
  const effectiveGstRate = Number(gstRate ?? 0.18)
  const gstAmount = discountedBase * effectiveGstRate
  const total = discountedBase + gstAmount
  const savingsPercent = couponData && couponData.discountType === 'percentage' ? couponData.discountPercent : null

  return (
    <div className={`bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 tracking-tight">Order Summary</h4>
          <p className="text-xs text-slate-500 mt-0.5">Price & tax breakdown</p>
        </div>
        {couponData?.code && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {couponData.code}
          </span>
        )}
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between items-center text-slate-600">
          <dt>Base Price</dt>
          <dd className="font-semibold text-slate-900">{format(basePrice)}</dd>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <dt className="flex items-center gap-1.5">
              <span>Coupon Discount</span>
              {savingsPercent && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                  {savingsPercent}% OFF
                </span>
              )}
            </dt>
            <dd className="font-bold">-{format(discount)}</dd>
          </div>
        )}

        <div className="flex justify-between items-center text-slate-600">
          <dt>GST ({(effectiveGstRate * 100).toFixed(0)}%)</dt>
          <dd className="font-semibold text-slate-900">{format(gstAmount)}</dd>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
          <dt className="text-base font-extrabold text-slate-900">Total Amount</dt>
          <dd className="text-2xl font-black text-[#017DC3] tracking-tight">{format(total)}</dd>
        </div>
      </dl>

      {!compact && (
        <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
          Taxes are calculated in accordance with applicable statutory regulations. All payments are processed securely.
        </p>
      )}
    </div>
  )
}

export default CheckoutBreakdown
