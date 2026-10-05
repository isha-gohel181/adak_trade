import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSettings, validateCoupon, clearCoupon, fetchAllCoupons } from '../redux/slices/configSlice'
import { buyNow } from '../redux/slices/enrollmentSlice'
import CheckoutBreakdown from '../components/CheckoutBreakdown'
import { useLanguage } from '../context/LanguageContext'
import sanitizeDisplay from '../utils/textSanitize'

const resolveImageUrl = (course) => {
  const imgPath = course?.thumbnail || course?.coverImage || course?.horizontalCarouselImage || course?.image
  if (!imgPath || typeof imgPath !== 'string') return '/courses/curator.png'
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) return imgPath
  if (imgPath.startsWith('/courses/') || imgPath.startsWith('/images/')) return imgPath

  const rawBase = import.meta.env.VITE_IMAGE_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5000'
  const cleanBase = rawBase.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
  return `${cleanBase}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`
}

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useLanguage()

  const searchParams = new URLSearchParams(location.search)
  const urlCourseId = searchParams.get('course_id')
  const urlPlanId = searchParams.get('plan_id')
  const urlAcc = searchParams.get('acc')
  const urlAmount = searchParams.get('amount')

  const selectedPlan =
    location.state?.plan ||
    (urlPlanId
      ? { id: urlPlanId, title: 'Standard Access', price: urlAmount ? Number(urlAmount) : 3499 }
      : { id: 'standard', title: 'Full Course Access', price: 3499 })

  const course =
    location.state?.course ||
    (urlCourseId
      ? { id: urlCourseId, _id: urlCourseId, title: 'IAS DCS Course Enrollment' }
      : { id: 'default', title: 'IAS DCS Professional Program', thumbnail: '/courses/curator.png' })

  const accParam = urlAcc || location.state?.acc || ''

  const { settings, coupons, couponData, couponError, couponLoading } = useSelector((state) => state.config)
  const authUser = useSelector((state) => state.auth?.user)

  const rawBase = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  const BASE_API = rawBase.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')

  const [formData, setFormData] = useState(() => {
    let savedUser = null
    try {
      const lsUser = localStorage.getItem('user') || localStorage.getItem('userInfo') || localStorage.getItem('edrilla_user')
      if (lsUser) {
        savedUser = JSON.parse(lsUser)
      }
    } catch (e) {
      console.error('Error parsing user from storage', e)
    }

    return {
      fullName: savedUser?.name || savedUser?.fullName || '',
      email: savedUser?.email || '',
      phone: savedUser?.phone || savedUser?.mobile || '',
      company: savedUser?.company?.name || (typeof savedUser?.company === 'string' ? savedUser.company : '') || '',
      gst: savedUser?.gst || savedUser?.company?.gstNumber || '',
      coupon: '',
    }
  })

  // Prefill when authUser changes
  useEffect(() => {
    if (!authUser) return
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || authUser.name || authUser.fullName || '',
      email: prev.email || authUser.email || '',
      phone: prev.phone || authUser.phone || authUser.mobile || '',
      company: prev.company || authUser.company?.name || (typeof authUser.company === 'string' ? authUser.company : '') || '',
      gst: prev.gst || authUser.company?.gstNumber || authUser.gst || '',
    }))
  }, [authUser])

  const [isVerified, setIsVerified] = useState(false)
  const [showOTPModal, setShowOTPModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [otpMessage, setOtpMessage] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const basePrice = Number(selectedPlan.price || course.salePrice || course.price || 3499)
  const gstRate = Number(settings?.gstRate ?? 0.18)
  const discount = couponData
    ? couponData.discountType === 'percentage'
      ? (basePrice * Number(couponData.discountPercent)) / 100
      : Number(couponData.discountAmount || 0)
    : 0
  const discountedBase = Math.max(0, basePrice - discount)
  const gstAmount = discountedBase * gstRate
  const total = discountedBase + gstAmount

  const formatCurrency = (v) =>
    `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  useEffect(() => {
    window.scrollTo(0, 0)
    dispatch(fetchSettings())
    dispatch(fetchAllCoupons())
    dispatch(clearCoupon())
  }, [dispatch])

  // Track verified status
  useEffect(() => {
    const localUser = (() => {
      try {
        return JSON.parse(localStorage.getItem('edrilla_user') || localStorage.getItem('user') || '{}')
      } catch {
        return {}
      }
    })()
    const verified = Boolean(
      authUser?.isVerified ||
        authUser?.verified ||
        authUser?.emailVerified ||
        localUser?.isVerified ||
        localUser?.verified ||
        localUser?.emailVerified
    )
    setIsVerified(verified)
  }, [authUser])

  // Load Razorpay SDK
  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'))
      document.body.appendChild(script)
    })

  const handlePayment = async () => {
    if (!formData.fullName.trim()) {
      alert('Please enter your full name.')
      return
    }
    if (!formData.email.trim()) {
      alert('Please enter a valid email address.')
      return
    }

    setIsProcessing(true)
    try {
      await loadRazorpayScript()
    } catch (e) {
      console.error('Razorpay SDK load error', e)
      alert('Payment gateway failed to load. Please refresh and try again.')
      setIsProcessing(false)
      return
    }

    try {
      const payload = {
        courseId: course._id || course.id || '',
        guestEmail: formData.email.trim(),
        guestName: formData.fullName.trim(),
        couponCode: formData.coupon || '',
        is_verify: Boolean(isVerified),
        coursePlanId: selectedPlan.id || selectedPlan._id || '',
      }

      if (accParam) payload.acc = accParam

      const chkRes = await fetch(`${BASE_API}/checkout/check-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const chkData = await chkRes.json()

      if (!chkRes.ok) {
        alert(chkData?.message || 'Order validation failed. Please check your details.')
        setIsProcessing(false)
        return
      }

      if (!chkData?.success || !chkData?.is_valid) {
        alert(chkData?.data?.message || chkData?.message || 'Unable to place order at this time.')
        setIsProcessing(false)
        return
      }

      const razor = chkData?.razorpay || {}
      const rKey = razor.key || settings?.RAZORPAY_KEY_ID || settings?.settings?.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
      const order = razor.order || {}
      const rAmount = order.amount != null ? order.amount : Math.round(total * 100)

      const options = {
        key: rKey,
        amount: rAmount,
        currency: razor.currency || 'INR',
        name: 'IAS DCS - Institute of Applied Statistics',
        description: course.title || 'Course Enrollment',
        order_id: order.id,
        handler: async function (response) {
          try {
            const buyPayload = {
              courseId: course._id || course.id || '',
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              guestEmail: formData.email.trim(),
              guestName: formData.fullName.trim(),
              paymentProvider: 'razorpay',
              coursePlanId: selectedPlan.id || selectedPlan._id || '',
              couponCode: formData.coupon || '',
              company: formData.company,
              gst: formData.gst,
            }

            if (accParam) buyPayload.acc = accParam

            await dispatch(buyNow(buyPayload)).unwrap()
            setShowSuccessModal(true)
          } catch (error) {
            console.error('Finalization error:', error)
            alert(error || 'Payment succeeded but enrollment confirmation is processing. Please check your email.')
          } finally {
            setIsProcessing(false)
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          courseId: course._id || course.id || '',
          planId: selectedPlan.id || '',
        },
        theme: { color: '#017DC3' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Order creation error:', err)
      alert(err?.message || 'Unable to initiate checkout.')
      setIsProcessing(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (name === 'coupon' && value) {
      dispatch(validateCoupon(value))
    } else if (name === 'coupon' && !value) {
      dispatch(clearCoupon())
    }
  }

  const handleApplyCoupon = () => {
    if (formData.coupon) {
      dispatch(validateCoupon(formData.coupon))
    }
  }

  const sendOtp = async () => {
    if (!formData.email) {
      setOtpMessage('Please enter an email address first.')
      return
    }
    setSendingOtp(true)
    setOtpMessage('')
    try {
      const res = await fetch(`${BASE_API}/sendotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to send OTP')

      if (data?.is_verify) {
        setIsVerified(true)
        setOtpMessage('Email is already verified')
        setShowOTPModal(false)
      } else {
        setOtpMessage('Verification code sent to your email.')
        setShowOTPModal(true)
      }
    } catch (err) {
      setOtpMessage(err.message || 'Network error while sending OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setOtpMessage('Please enter the 6-digit OTP.')
      return
    }
    setVerifyingOtp(true)
    setOtpMessage('')
    try {
      const res = await fetch(`${BASE_API}/verifyotp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otp.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Invalid or expired OTP')

      setIsVerified(true)
      if (data?.data?.user) {
        try {
          localStorage.setItem('edrilla_user', JSON.stringify(data.data.user))
        } catch {}
      }
      setOtpMessage('Email verified successfully!')
      setShowOTPModal(false)
      setOtp('')
    } catch (err) {
      setOtpMessage(err.message || 'Verification failed')
    } finally {
      setVerifyingOtp(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-inter text-slate-900 pb-20">
      {/* Top Breadcrumb Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-sm font-semibold"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Course</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#017DC3]">Secure Checkout</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="hidden sm:inline">256-Bit SSL Secured</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5FA] border border-[#017DC3]/20 text-[#017DC3] text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#BFD419]" />
            Official IAS DCS Enrollment
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Complete Your <span className="text-[#017DC3]">Enrollment</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1">
            Fill in your details below to activate instant access to your course and learning dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Student Details */}
            <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#EBF5FA] text-[#017DC3] font-bold flex items-center justify-center text-sm border border-[#017DC3]/30">
                  1
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Student Details</h2>
                  <p className="text-xs text-slate-500">Your certificate and course access will be issued to these details.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Full Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:bg-white focus:border-[#017DC3] focus:ring-2 focus:ring-[#017DC3]/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      disabled={isVerified}
                      onChange={handleChange}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:bg-white focus:border-[#017DC3] focus:ring-2 focus:ring-[#017DC3]/20 outline-none transition-all ${
                        isVerified ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''
                      }`}
                    />

                    {/* Email Verification Action */}
                    <div className="mt-2.5 flex items-center gap-2">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Email Verified
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={sendOtp}
                          disabled={sendingOtp || !formData.email}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                            sendingOtp || !formData.email
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-[#EBF5FA] text-[#017DC3] border-[#017DC3]/30 hover:bg-[#017DC3] hover:text-white'
                          }`}
                        >
                          {sendingOtp ? 'Sending OTP...' : 'Verify Email'}
                        </button>
                      )}
                      {otpMessage && <span className="text-xs text-slate-500">{otpMessage}</span>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Phone Number <span className="text-slate-400">(Optional)</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 border border-r-0 border-slate-200 bg-slate-100 text-slate-600 rounded-l-xl text-sm font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-r-xl px-4 py-3.5 text-sm text-slate-900 focus:bg-white focus:border-[#017DC3] focus:ring-2 focus:ring-[#017DC3]/20 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Step 2: Billing & GST (Optional) */}
            <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#EBF5FA] text-[#017DC3] font-bold flex items-center justify-center text-sm border border-[#017DC3]/30">
                  2
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Institution & Billing (Optional)</h2>
                  <p className="text-xs text-slate-500">Provide organization or GSTIN details for tax invoice reconciliation.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Acme Corp / University"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 focus:bg-white focus:border-[#017DC3] focus:ring-2 focus:ring-[#017DC3]/20 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    GSTIN Number
                  </label>
                  <input
                    type="text"
                    name="gst"
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    value={formData.gst}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 uppercase focus:bg-white focus:border-[#017DC3] focus:ring-2 focus:ring-[#017DC3]/20 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Step 3: Promo / Coupon Code */}
            <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
                <span className="w-8 h-8 rounded-full bg-[#EBF5FA] text-[#017DC3] font-bold flex items-center justify-center text-sm border border-[#017DC3]/30">
                  3
                </span>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Discounts & Promo Codes</h2>
                  <p className="text-xs text-slate-500">Select an active coupon or enter a promotional voucher code.</p>
                </div>
              </div>

              <div className="space-y-3">
                {Array.isArray(coupons) && coupons.length > 0 && (
                  <div className="mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Available Coupons
                    </label>
                    <select
                      name="coupon"
                      value={formData.coupon}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-[#017DC3] outline-none transition-all"
                    >
                      <option value="">-- Choose a Coupon Code --</option>
                      {coupons.map((c) => (
                        <option key={c._id} value={c.code}>
                          {c.code} — {c.discountType === 'percentage' ? `${c.discountPercent}% OFF` : `₹${c.discountAmount} OFF`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    name="coupon"
                    placeholder="Enter Coupon Code"
                    value={formData.coupon}
                    onChange={handleChange}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm uppercase text-slate-900 focus:bg-white focus:border-[#017DC3] outline-none transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !formData.coupon}
                    className={`px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      couponLoading || !formData.coupon
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-[#017DC3] text-white hover:bg-[#006AA7] shadow-sm'
                    }`}
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>

                {couponError && <p className="text-xs text-red-600 font-semibold mt-1">{couponError}</p>}
                {couponData && (
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    ✓ Coupon "{couponData.code}" applied! You save {formatCurrency(discount)}.
                  </p>
                )}
              </div>
            </section>

            {/* Step 4: Pay Now CTA */}
            <div className="pt-2">
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                type="button"
                className={`w-full py-5 rounded-2xl bg-[#017DC3] hover:bg-[#006AA7] text-white font-black text-base uppercase tracking-widest shadow-lg shadow-[#017DC3]/25 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 ${
                  isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span>{isProcessing ? 'Processing Order...' : `Pay ${formatCurrency(total)} & Enroll Now`}</span>
              </button>

              <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2 px-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Instant Dashboard Activation
                </span>
                <span>Supported: UPI • Cards • NetBanking</span>
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Course & Order Summary (5 Cols) */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Course Card Preview */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Selected Program</h3>

              <div className="flex gap-4 items-start">
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src={resolveImageUrl(course)}
                    alt={sanitizeDisplay(course.title)}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = '/courses/curator.png'
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#EBF5FA] text-[#017DC3] text-[10px] font-extrabold uppercase tracking-wider border border-[#017DC3]/20 mb-1.5">
                    {course.categoryId?.name || course.category?.name || 'Professional Course'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {sanitizeDisplay(course.title)}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Tier: {selectedPlan.title || 'Standard'}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <CheckoutBreakdown
              basePrice={basePrice}
              discount={discount}
              gstRate={gstRate}
              couponData={couponData}
            />

            {/* Key Benefits List */}
            <div className="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Included with this course</h4>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#017DC3" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Complete curriculum & interactive lesson materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#017DC3" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Verified IAS DCS Certificate of Completion</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#017DC3" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Access to discussion forums and community Q&A</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#017DC3" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Lifetime learning updates on course content</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#EBF5FA] text-[#017DC3] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-900">Verify Email Address</h3>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              We sent a 6-digit verification code to <span className="font-semibold text-slate-900">{formData.email}</span>.
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-center text-lg font-mono tracking-widest text-slate-900 focus:bg-white focus:border-[#017DC3] outline-none mb-4"
            />

            {otpMessage && <p className="text-xs text-slate-500 mb-4">{otpMessage}</p>}

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowOTPModal(false)
                  setOtp('')
                  setOtpMessage('')
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold uppercase transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={verifyOtp}
                disabled={verifyingOtp || !otp}
                className={`px-6 py-2.5 rounded-xl bg-[#017DC3] text-white text-xs font-bold uppercase transition-all ${
                  verifyingOtp || !otp ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#006AA7] shadow-sm'
                }`}
              >
                {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-200">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Enrollment Confirmed
            </span>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 mb-2">Welcome to the Course!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-8">
              Your payment was successful and your course access has been activated on your dashboard.
            </p>

            <button
              onClick={() => navigate('/dashboard/my-courses')}
              className="w-full py-4 rounded-xl bg-[#017DC3] hover:bg-[#006AA7] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#017DC3]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Go to My Learning Dashboard</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout
