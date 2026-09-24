import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchAvailableSlots,
  createConsultationOrder,
  bookConsultation,
  setSelectedDate,
  setSelectedSlot,
  resetBookingState,
  clearError
} from '../../redux/slices/consultationSlice';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://api.edrilla.com';

const ConsultationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { slots, selectedDate, selectedSlot, loading, bookingLoading, error, bookingSuccess, lastBooking } =
    useSelector((state) => state.consultation);
  const authUser = useSelector((state) => state.auth?.user);
  const authToken = useSelector((state) => state.auth?.token) || localStorage.getItem('edrilla_token');

  // Step state: 1 = Date & Slot selection, 2 = Consultation Details, 3 = Confirmation / Success
  const [step, setStep] = useState(1);

  // Calendar View Date state (month/year navigation)
  const [viewDate, setViewDate] = useState(new Date());
  const [allUpcomingSlots, setAllUpcomingSlots] = useState([]);

  // Form Details state
  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    department: '',
    institute: '',
    query: '',
    fileUpload: null,
  });
  const [fileName, setFileName] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Prefill form when auth user is available
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || authUser.fullName || authUser.name || '',
        designation: prev.designation || authUser.designation || '',
        department: prev.department || authUser.department || '',
        institute: prev.institute || authUser.institute || authUser.organization || '',
      }));
    }
  }, [authUser]);

  // Fetch all upcoming slots for calendar indicators
  useEffect(() => {
    if (isOpen) {
      fetch(`${BASE_URL}/consultations/slots/available`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.data) setAllUpcomingSlots(d.data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Fetch slots whenever selectedDate changes or modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAvailableSlots({ date: selectedDate }));
    }
  }, [isOpen, selectedDate, dispatch]);

  // Reset states on modal close/open
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      dispatch(resetBookingState());
      setFormErrors({});
      setFileName('');
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  // Calendar calculations
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const availableDatesSet = new Set(
    allUpcomingSlots
      .filter((s) => !s.isBooked && s.isActive)
      .map((s) => {
        try {
          return new Date(s.startTime).toISOString().split('T')[0];
        } catch {
          return '';
        }
      })
  );

  const bookedDatesSet = new Set(
    allUpcomingSlots
      .filter((s) => s.isBooked)
      .map((s) => {
        try {
          return new Date(s.startTime).toISOString().split('T')[0];
        } catch {
          return '';
        }
      })
  );

  const handleSelectDay = (day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    // Don't allow past dates before today
    if (dateStr < todayStr) return;

    dispatch(setSelectedDate(dateStr));
    dispatch(setSelectedSlot(null));
  };

  const formatSlotTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setFormErrors((prev) => ({ ...prev, fileUpload: 'File size must be less than 10MB' }));
        return;
      }
      setFormData((prev) => ({ ...prev, fileUpload: file }));
      setFileName(file.name);
      setFormErrors((prev) => ({ ...prev, fileUpload: null }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, fileUpload: null }));
    setFileName('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.designation.trim()) errors.designation = 'Designation is required';
    if (!formData.department.trim()) errors.department = 'Department is required';
    if (!formData.institute.trim()) errors.institute = 'Institute / Organization is required';
    if (!formData.query.trim()) errors.query = 'Query / Guidance is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToDetails = () => {
    if (!selectedSlot) return;
    setStep(2);
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) return;

    if (!authToken) {
      // Prompt user to login
      navigate('/login', { state: { returnUrl: location.pathname } });
      return;
    }

    // Build FormData payload
    const submission = new FormData();
    submission.append('slotId', selectedSlot._id);
    submission.append('fullName', formData.fullName.trim());
    submission.append('designation', formData.designation.trim());
    submission.append('department', formData.department.trim());
    submission.append('institute', formData.institute.trim());
    submission.append('query', formData.query.trim());

    if (formData.fileUpload) {
      submission.append('fileUpload', formData.fileUpload);
    }

    // Check if slot is paid (duration 30 and price > 0)
    if (selectedSlot.price > 0 && selectedSlot.duration === 30) {
      try {
        const orderResult = await dispatch(createConsultationOrder({ slotId: selectedSlot._id })).unwrap();
        if (orderResult.isFree) {
          // Fallback to free booking
          const result = await dispatch(bookConsultation(submission)).unwrap();
          if (result.success) setStep(3);
        } else {
          // Razorpay flow
          const options = {
            key: orderResult.key,
            amount: orderResult.amount,
            currency: orderResult.currency,
            name: 'Institute of Applied Statistics',
            description: `Consultation Slot (${selectedSlot.duration} Mins)`,
            order_id: orderResult.orderId,
            handler: async (response) => {
              submission.append('razorpay_order_id', response.razorpay_order_id);
              submission.append('razorpay_payment_id', response.razorpay_payment_id);
              submission.append('razorpay_signature', response.razorpay_signature);
              const result = await dispatch(bookConsultation(submission)).unwrap();
              if (result.success) setStep(3);
            },
            prefill: {
              name: formData.fullName,
              email: authUser?.email || '',
              contact: authUser?.phone || '',
            },
            theme: { color: '#011753' },
          };

          if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.open();
          } else {
            alert('Payment gateway failed to load. Please try again.');
          }
        }
      } catch (err) {
        console.error('Consultation order error:', err);
      }
    } else {
      // Free 15-min consultation booking
      try {
        const result = await dispatch(bookConsultation(submission)).unwrap();
        if (result.success) {
          setStep(3);
        }
      } catch (err) {
        console.error('Consultation booking error:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors"
                title="Back to Date & Slots"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <div>
              <h3 className="font-inter font-bold text-slate-900 text-lg leading-snug">
                {step === 1 && 'DARC Support Helpline'}
                {step === 2 && 'Consultation Details'}
                {step === 3 && 'Booking Confirmed'}
              </h3>
              <p className="font-inter text-xs text-slate-500">
                {step === 1 && 'Select a date and available consultation time slot'}
                {step === 2 && 'Fill in your research guidance requirements'}
                {step === 3 && 'Your expert consultation appointment is scheduled'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
              <span>{error}</span>
              <button 
                type="button" 
                onClick={() => dispatch(clearError())} 
                className="text-red-500 hover:text-red-800 font-bold ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* ──────────────── STEP 1: Date & Slot Selection ──────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Calendar Container */}
              <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-inter font-bold text-slate-800 text-sm">
                    {monthNames[month]} {year}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Day Names Grid */}
                <div className="grid grid-cols-7 gap-1 text-center font-inter font-semibold text-[11px] text-slate-400 mb-2">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const formattedMonth = String(month + 1).padStart(2, '0');
                    const formattedDay = String(day).padStart(2, '0');
                    const dayDateStr = `${year}-${formattedMonth}-${formattedDay}`;
                    const isPast = dayDateStr < todayStr;
                    const isSelected = dayDateStr === selectedDate;
                    const isToday = dayDateStr === todayStr;
                    const hasAvailable = availableDatesSet.has(dayDateStr);
                    const hasBooked = bookedDatesSet.has(dayDateStr);

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        disabled={isPast}
                        onClick={() => handleSelectDay(day)}
                        className={`h-10 w-full rounded-xl font-inter text-xs font-semibold flex flex-col items-center justify-center relative transition-all ${
                          isSelected
                            ? 'bg-[#011753] text-white shadow-md font-bold ring-2 ring-blue-600/30'
                            : isPast
                            ? 'text-slate-300 cursor-not-allowed'
                            : isToday
                            ? 'bg-blue-100/70 text-blue-900 border border-blue-300 font-bold'
                            : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-blue-50 hover:border-blue-200'
                        }`}
                      >
                        <span>{day}</span>
                        {!isPast && (
                          <span className="flex items-center gap-0.5 mt-0.5">
                            {hasAvailable && (
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`} />
                            )}
                            {!hasAvailable && hasBooked && (
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-rose-300' : 'bg-rose-500'}`} />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Status Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-200/60 font-inter text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-100" />
                    <span>Booked / Unavailable</span>
                  </div>
                </div>
              </div>

              {/* Slots Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-inter font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span>Available Slots</span>
                    <span className="text-xs font-normal text-slate-500">
                      ({new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })})
                    </span>
                  </h4>
                  {loading && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {loading ? (
                  <div className="py-8 text-center text-slate-400 font-inter text-xs">
                    Fetching consultation slots...
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                    <svg className="w-8 h-8 text-slate-400 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <p className="font-inter text-xs text-slate-600 font-medium">
                      No slots available for this date.
                    </p>
                    <p className="font-inter text-[11px] text-slate-400">
                      Please select another date on the calendar.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                    {slots.map((slot) => {
                      const isBooked = slot.isBooked;
                      const isPast = new Date(slot.startTime) < new Date();
                      const isDisabled = isBooked || isPast;
                      const isSelected = selectedSlot?._id === slot._id;
                      const isFree = slot.price === 0 || slot.duration === 15;

                      return (
                        <button
                          key={slot._id}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => dispatch(setSelectedSlot(slot))}
                          className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? 'bg-blue-50/80 border-[#011753] ring-2 ring-[#011753]/20 shadow-sm'
                              : isDisabled
                              ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                              : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-inter font-bold text-xs text-slate-800">
                              {formatSlotTime(slot.startTime)} - {formatSlotTime(slot.endTime)}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-[#011753] text-white flex items-center justify-center text-[10px]">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-inter text-[10px] text-slate-500 font-medium">
                              {slot.duration}m
                            </span>
                            <span
                              className={`font-inter text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isFree
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {isFree ? 'FREE' : `₹${slot.price}`}
                            </span>
                            {isBooked && (
                              <span className="font-inter text-[10px] text-rose-600 font-semibold ml-auto">
                                Booked
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ──────────────── STEP 2: Consultation Details Form ──────────────── */}
          {step === 2 && selectedSlot && (
            <div className="space-y-4">
              {/* Selected Slot Recap */}
              <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="font-inter text-[11px] text-blue-800 font-bold uppercase tracking-wider block">
                    Selected Appointment
                  </span>
                  <span className="font-inter font-bold text-slate-900 text-sm">
                    {new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    • {formatSlotTime(selectedSlot.startTime)} - {formatSlotTime(selectedSlot.endTime)}
                  </span>
                </div>
                <span className="font-inter text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedSlot.price === 0 || selectedSlot.duration === 15 ? 'FREE 15m' : `₹${selectedSlot.price}`}
                </span>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block font-inter text-xs font-semibold text-slate-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#011753]/20 ${
                      formErrors.fullName ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                </div>
                {formErrors.fullName && (
                  <p className="font-inter text-[11px] text-rose-500">{formErrors.fullName}</p>
                )}
              </div>

              {/* Designation & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-inter text-xs font-semibold text-slate-700">
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g. Student / Researcher / Faculty"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#011753]/20 ${
                        formErrors.designation ? 'border-rose-300' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {formErrors.designation && (
                    <p className="font-inter text-[11px] text-rose-500">{formErrors.designation}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block font-inter text-xs font-semibold text-slate-700">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18M3 7v14M21 7v14M6 7V3h12v4M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      placeholder="e.g. Biostatistics / Medicine / General"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#011753]/20 ${
                        formErrors.department ? 'border-rose-300' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {formErrors.department && (
                    <p className="font-inter text-[11px] text-rose-500">{formErrors.department}</p>
                  )}
                </div>
              </div>

              {/* Institute / Organization */}
              <div className="space-y-1">
                <label className="block font-inter text-xs font-semibold text-slate-700">
                  Institute / Organization <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="institute"
                    value={formData.institute}
                    onChange={handleInputChange}
                    placeholder="e.g. IAS DCS / AIIMS / Delhi University"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#011753]/20 ${
                      formErrors.institute ? 'border-rose-300' : 'border-slate-200'
                    }`}
                  />
                </div>
                {formErrors.institute && (
                  <p className="font-inter text-[11px] text-rose-500">{formErrors.institute}</p>
                )}
              </div>

              {/* Query / Guidance Needed */}
              <div className="space-y-1">
                <label className="block font-inter text-xs font-semibold text-slate-700">
                  Query / Guidance Needed <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="query"
                  rows={3}
                  value={formData.query}
                  onChange={handleInputChange}
                  placeholder="Describe your statistical problem, study design query, sample size calculation, or research guidance requirement..."
                  className={`w-full p-3 bg-slate-50 border rounded-xl font-inter text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#011753]/20 resize-none ${
                    formErrors.query ? 'border-rose-300' : 'border-slate-200'
                  }`}
                />
                {formErrors.query && (
                  <p className="font-inter text-[11px] text-rose-500">{formErrors.query}</p>
                )}
              </div>

              {/* Attach Document (Optional) */}
              <div className="space-y-1">
                <label className="block font-inter text-xs font-semibold text-slate-700">
                  Attach Document (Optional)
                </label>
                <div className="p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  {fileName ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-700 shrink-0">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        <span className="font-inter text-xs text-slate-800 font-medium truncate">
                          {fileName}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-xs font-bold text-rose-600 hover:text-rose-800 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 cursor-pointer py-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-500">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      <span className="font-inter text-xs text-slate-600 font-medium">
                        Upload PDF / Image File (Max 10MB)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {formErrors.fileUpload && (
                  <p className="font-inter text-[11px] text-rose-500">{formErrors.fileUpload}</p>
                )}
              </div>

              {!authToken && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                  <span className="font-inter text-xs text-amber-800">
                    You need to be logged in to confirm your booking.
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/login', { state: { returnUrl: location.pathname } })}
                    className="font-inter text-xs font-bold text-blue-700 hover:underline"
                  >
                    Log In →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ──────────────── STEP 3: Confirmation / Success ──────────────── */}
          {step === 3 && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 mx-auto flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-inter font-extrabold text-xl text-slate-900">
                  Consultation Booked Successfully!
                </h4>
                <p className="font-inter text-xs text-slate-600 max-w-md mx-auto">
                  Your appointment with the <strong className="text-slate-900">DARC Support Helpline</strong> panel has been registered.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 max-w-md mx-auto">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Candidate:</span>
                  <span className="font-bold text-slate-800">{formData.fullName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Date & Time:</span>
                  <span className="font-bold text-slate-800">
                    {selectedSlot && new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} • {selectedSlot && formatSlotTime(selectedSlot.startTime)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Duration:</span>
                  <span className="font-bold text-emerald-700">{selectedSlot?.duration || 15} Minutes</span>
                </div>
                {lastBooking?._id && (
                  <div className="flex justify-between text-xs pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Booking Ref:</span>
                    <span className="font-mono text-slate-700 text-[11px]">{lastBooking._id}</span>
                  </div>
                )}
              </div>

              <p className="font-inter text-[11px] text-slate-500 max-w-sm mx-auto">
                Our statistical research specialists will connect with you via Google Meet / Zoom at the scheduled time.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          {step === 1 && (
            <>
              <div className="text-xs text-slate-500 font-inter">
                {selectedSlot ? (
                  <span>
                    Selected: <strong className="text-slate-800">{formatSlotTime(selectedSlot.startTime)}</strong> ({selectedSlot.duration}m)
                  </span>
                ) : (
                  <span>Please choose a slot</span>
                )}
              </div>
              <button
                type="button"
                disabled={!selectedSlot}
                onClick={handleProceedToDetails}
                className="bg-[#011753] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-900 text-white font-inter text-xs font-bold px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
              >
                <span>Book Free Consultation</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="font-inter text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={bookingLoading}
                onClick={handleConfirmBooking}
                className="bg-[#011753] hover:bg-blue-900 disabled:opacity-60 text-white font-inter text-xs font-bold px-7 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
              >
                {bookingLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Booking Appointment...</span>
                  </>
                ) : (
                  <span>Confirm & Book Free</span>
                )}
              </button>
            </>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-[#011753] hover:bg-blue-900 text-white font-inter text-xs font-bold py-3 rounded-full transition-all shadow-md"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;
