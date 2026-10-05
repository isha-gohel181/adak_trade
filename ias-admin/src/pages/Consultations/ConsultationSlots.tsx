import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchAdminSlots,
  createSlots,
  deleteSlot,
} from "../../store/slices/consultationSlice";
import { toast } from "react-hot-toast";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import {
  Calendar,
  Clock,
  Sparkles,
  Check,
  Trash2,
  RotateCcw,
  AlertCircle,
  Plus,
} from "lucide-react";

// Safe Date Parser that handles YYYY-MM-DD, DD-MM-YYYY, or standard string
const parseDateSafe = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const trimmed = dateStr.trim();

  // Format: YYYY-MM-DD
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split("-").map(Number);
    if (y < 2020 || y > 2099 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  }

  // Format: DD-MM-YYYY
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split("-").map(Number);
    if (y < 2020 || y > 2099 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  }

  const dt = new Date(trimmed);
  if (!isNaN(dt.getTime())) {
    const y = dt.getFullYear();
    if (y < 2020 || y > 2099) return null;
    return new Date(y, dt.getMonth(), dt.getDate(), 0, 0, 0, 0);
  }

  return null;
};

// Reusable Flatpickr Calendar Field with clean UI
interface CalendarPickerProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minDate?: string | Date;
  id?: string;
}

const CalendarPickerField: React.FC<CalendarPickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select date...",
  minDate = "today",
  id,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    fpRef.current = flatpickr(inputRef.current, {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "F j, Y",
      altInputClass:
        "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 px-4 pr-10 text-sm font-medium text-gray-800 dark:text-white shadow-xs outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer",
      defaultDate: value || undefined,
      minDate: minDate,
      monthSelectorType: "static",
      onChange: (_selectedDates, dateStr) => {
        onChange(dateStr);
      },
    });

    return () => {
      fpRef.current?.destroy();
    };
  }, []);

  // Update flatpickr when value changes externally
  useEffect(() => {
    if (fpRef.current && value) {
      fpRef.current.setDate(value, false);
    } else if (fpRef.current && !value) {
      fpRef.current.clear();
    }
  }, [value]);

  return (
    <div className="w-full">
      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 px-4 pr-10 text-sm font-medium text-gray-800 dark:text-white shadow-xs outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => fpRef.current?.open()}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
          title="Open calendar"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ConsultationSlots = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { slots, loading, error } = useSelector(
    (state: RootState) => state.consultation
  );

  // Tabs state
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

  // Single Slot State
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState<15 | 30>(15);
  const [price, setPrice] = useState(0);

  // Bulk Generator State
  const [bulkStartDate, setBulkStartDate] = useState("");
  const [bulkEndDate, setBulkEndDate] = useState("");

  const [wdActive, setWdActive] = useState(true);
  const [wdStart, setWdStart] = useState("10:00");
  const [wdEnd, setWdEnd] = useState("17:00");
  const [wdBreakStart, setWdBreakStart] = useState("13:00");
  const [wdBreakEnd, setWdBreakEnd] = useState("14:00");
  const [wdDuration, setWdDuration] = useState<15 | 30>(15);
  const [wdPrice, setWdPrice] = useState(0);

  const [weActive, setWeActive] = useState(true);
  const [weStart, setWeStart] = useState("09:00");
  const [weEnd, setWeEnd] = useState("21:00");
  const [weBreakStart, setWeBreakStart] = useState("13:00");
  const [weBreakEnd, setWeBreakEnd] = useState("14:00");
  const [weDuration, setWeDuration] = useState<15 | 30>(30);
  const [wePrice, setWePrice] = useState(500);

  const [previewSlots, setPreviewSlots] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchAdminSlots());
  }, [dispatch]);

  // Quick Preset Helper for Bulk Generator
  const applyPreset = (days: number) => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const startStr = `${y}-${m}-${d}`;

    const end = new Date();
    end.setDate(today.getDate() + (days - 1));
    const ey = end.getFullYear();
    const em = String(end.getMonth() + 1).padStart(2, "0");
    const ed = String(end.getDate()).padStart(2, "0");
    const endStr = `${ey}-${em}-${ed}`;

    setBulkStartDate(startStr);
    setBulkEndDate(endStr);
    toast.success(`Selected range: ${startStr} to ${endStr} (${days} days)`);
  };

  const handleCreateSingleSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime) {
      toast.error("Please provide date and start time");
      return;
    }

    const parsedDate = parseDateSafe(date);
    if (!parsedDate) {
      toast.error("Please select a valid date from the calendar");
      return;
    }

    const [sH, sM] = startTime.split(":").map(Number);
    const startDateTime = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
      sH,
      sM,
      0,
      0
    );
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const newSlot = {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      duration,
      price: duration === 15 ? 0 : price,
    };

    try {
      await dispatch(createSlots([newSlot])).unwrap();
      await dispatch(fetchAdminSlots());
      toast.success("Slot created successfully");
      setStartTime("");
    } catch (err: any) {
      toast.error(err || "Failed to create slot");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      try {
        await dispatch(deleteSlot(id)).unwrap();
        toast.success("Slot deleted");
      } catch (err: any) {
        toast.error(err || "Failed to delete slot");
      }
    }
  };

  const generatePreview = () => {
    if (!bulkStartDate || !bulkEndDate) {
      toast.error("Please select both a Start Date and End Date from the calendar.");
      return;
    }

    const startD = parseDateSafe(bulkStartDate);
    const endD = parseDateSafe(bulkEndDate);

    if (!startD || !endD) {
      toast.error("Invalid dates selected. Please use the calendar selector.");
      return;
    }

    if (startD.getTime() > endD.getTime()) {
      toast.error("Start date must be on or before the end date.");
      return;
    }

    const diffDays =
      Math.round((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays > 60) {
      toast.error(
        `Selected range is ${diffDays} days. Please limit bulk generation to maximum 60 days at a time.`
      );
      return;
    }

    if (!wdActive && !weActive) {
      toast.error("Please enable at least Weekdays or Weekends.");
      return;
    }

    const generated: any[] = [];
    let currentD = new Date(startD);
    let loopGuard = 0;

    // Iterate through each day
    while (currentD.getTime() <= endD.getTime() && loopGuard < 100) {
      loopGuard++;
      const year = currentD.getFullYear();
      const month = currentD.getMonth();
      const day = currentD.getDate();
      const dayOfWeek = currentD.getDay(); // 0 is Sunday, 6 is Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const active = isWeekend ? weActive : wdActive;

      if (active) {
        const startT = isWeekend ? weStart : wdStart;
        const endT = isWeekend ? weEnd : wdEnd;
        const breakStartT = isWeekend ? weBreakStart : wdBreakStart;
        const breakEndT = isWeekend ? weBreakEnd : wdBreakEnd;
        const dur = isWeekend ? weDuration : wdDuration;
        const prc = isWeekend ? wePrice : wdPrice;

        const [sH, sM] = (startT || "09:00").split(":").map(Number);
        const [eH, eM] = (endT || "18:00").split(":").map(Number);

        let slotStartTime = new Date(year, month, day, sH, sM, 0, 0);
        const dayEndTime = new Date(year, month, day, eH, eM, 0, 0);

        let breakStartTime: Date | null = null;
        let breakEndTime: Date | null = null;

        if (breakStartT && breakEndT) {
          const [bSH, bSM] = breakStartT.split(":").map(Number);
          const [bEH, bEM] = breakEndT.split(":").map(Number);
          breakStartTime = new Date(year, month, day, bSH, bSM, 0, 0);
          breakEndTime = new Date(year, month, day, bEH, bEM, 0, 0);
        }

        let innerGuard = 0;
        while (slotStartTime.getTime() < dayEndTime.getTime() && innerGuard < 100) {
          innerGuard++;
          const slotEndTime = new Date(slotStartTime.getTime() + dur * 60000);

          // Stop if this slot exceeds the day's end time
          if (slotEndTime.getTime() > dayEndTime.getTime()) break;

          // Check if it overlaps with break
          let isBreak = false;
          if (breakStartTime && breakEndTime) {
            if (
              slotStartTime.getTime() < breakEndTime.getTime() &&
              slotEndTime.getTime() > breakStartTime.getTime()
            ) {
              isBreak = true;
            }
          }

          if (!isBreak) {
            // Check for overlaps with existing slots from database
            const hasOverlap = (slots || []).some((existingSlot) => {
              const exStart = new Date(existingSlot.startTime).getTime();
              const exEnd = new Date(existingSlot.endTime).getTime();
              return slotStartTime.getTime() < exEnd && slotEndTime.getTime() > exStart;
            });

            if (!hasOverlap) {
              generated.push({
                _tempId:
                  "slot_" + Math.random().toString(36).substring(2, 9) + Date.now(),
                startTime: slotStartTime.toISOString(),
                endTime: slotEndTime.toISOString(),
                duration: dur,
                price: dur === 15 ? 0 : prc,
              });
            }
          }

          slotStartTime = slotEndTime; // advance to next slot
        }
      }

      currentD.setDate(currentD.getDate() + 1);
    }

    setPreviewSlots(generated);
    if (generated.length === 0) {
      toast.info(
        "No new slots generated. Check if working hours are set or all slots already exist in database."
      );
    } else {
      toast.success(
        `Generated ${generated.length} slots for preview! Review below and click 'Save to Database'.`
      );
    }
  };

  const removePreviewSlot = (tempId: string) => {
    setPreviewSlots((prev) => prev.filter((s) => s._tempId !== tempId));
  };

  const handleSaveBulkSlots = async () => {
    if (previewSlots.length === 0) return;
    try {
      const payload = previewSlots.map(({ _tempId, ...rest }) => rest);
      await dispatch(createSlots(payload)).unwrap();
      await dispatch(fetchAdminSlots());
      toast.success(`${payload.length} slots created and saved successfully!`);
      setPreviewSlots([]);
    } catch (err: any) {
      toast.error(err || "Failed to save bulk slots");
    }
  };

  // Filters for Existing Database Slots
  const [slotSearchDate, setSlotSearchDate] = useState("");
  const [slotStatusFilter, setSlotStatusFilter] = useState<
    "all" | "available" | "booked"
  >("all");

  const filteredExistingSlots = (slots || []).filter((slot) => {
    const slotDateStr = new Date(slot.startTime).toISOString().split("T")[0];
    const matchesDate = slotSearchDate ? slotDateStr === slotSearchDate : true;
    const matchesStatus =
      slotStatusFilter === "all"
        ? true
        : slotStatusFilter === "booked"
        ? slot.isBooked
        : !slot.isBooked;

    return matchesDate && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2.5">
            <Calendar className="w-7 h-7 text-blue-600" />
            Manage Consultation Slots
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure 15-minute free or 30-minute paid consultation availability for students.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("single")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "single"
                ? "bg-white dark:bg-gray-700 shadow-xs text-blue-600 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
            }`}
          >
            <Plus className="w-4 h-4" />
            Single Slot
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === "bulk"
                ? "bg-white dark:bg-gray-700 shadow-xs text-blue-600 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Bulk Generator
          </button>
        </div>
      </div>

      {/* SINGLE SLOT TAB */}
      {activeTab === "single" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Create Individual Slot
          </h2>
          <form onSubmit={handleCreateSingleSlot} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
              <div>
                <CalendarPickerField
                  label="Select Date"
                  value={date}
                  onChange={setDate}
                  placeholder="Choose date"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 px-3 text-sm font-medium text-gray-800 dark:text-white shadow-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                  Duration & Tier
                </label>
                <select
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 px-3 text-sm font-medium text-gray-800 dark:text-white shadow-xs outline-none focus:border-blue-500"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) as 15 | 30)}
                >
                  <option value={15}>15 Minutes (Free)</option>
                  <option value={30}>30 Minutes (Paid)</option>
                </select>
              </div>
              {duration === 30 ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-2.5 px-3 text-sm font-medium text-gray-800 dark:text-white shadow-xs outline-none focus:border-blue-500"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
              ) : (
                <div className="flex items-center pb-2.5 text-xs font-medium text-emerald-600">
                  ✓ Complimentary (Free)
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Single Slot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BULK GENERATOR TAB */}
      {activeTab === "bulk" && (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Bulk Schedule Generator
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Generate recurrent 15m or 30m slots across days in seconds with automatic overlap protection.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
              <span className="text-[11px] font-bold text-gray-500 px-2 uppercase">
                Presets:
              </span>
              <button
                type="button"
                onClick={() => applyPreset(7)}
                className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 rounded-lg text-gray-700 dark:text-gray-200 transition cursor-pointer"
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset(14)}
                className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 rounded-lg text-gray-700 dark:text-gray-200 transition cursor-pointer"
              >
                14 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset(30)}
                className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 rounded-lg text-gray-700 dark:text-gray-200 transition cursor-pointer"
              >
                30 Days
              </button>
            </div>
          </div>

          {/* Date Picker Range with Calendar Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-5 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40">
            <div>
              <CalendarPickerField
                label="Start Date"
                value={bulkStartDate}
                onChange={setBulkStartDate}
                placeholder="Select start date"
              />
            </div>
            <div>
              <CalendarPickerField
                label="End Date"
                value={bulkEndDate}
                onChange={setBulkEndDate}
                placeholder="Select end date"
              />
            </div>
          </div>

          {/* Weekday & Weekend Config Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekday Config */}
            <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Weekdays (Mon - Fri)
                  </h3>
                </div>
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={wdActive}
                    onChange={(e) => setWdActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Active
                  </span>
                </label>
              </div>

              {wdActive ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={wdStart}
                      onChange={(e) => setWdStart(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={wdEnd}
                      onChange={(e) => setWdEnd(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Break Start (Optional)
                    </label>
                    <input
                      type="time"
                      value={wdBreakStart}
                      onChange={(e) => setWdBreakStart(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Break End (Optional)
                    </label>
                    <input
                      type="time"
                      value={wdBreakEnd}
                      onChange={(e) => setWdBreakEnd(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Slot Duration
                    </label>
                    <select
                      value={wdDuration}
                      onChange={(e) =>
                        setWdDuration(Number(e.target.value) as 15 | 30)
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    >
                      <option value={15}>15 Min (Free)</option>
                      <option value={30}>30 Min (Paid)</option>
                    </select>
                  </div>
                  {wdDuration === 30 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={wdPrice}
                        onChange={(e) => setWdPrice(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">
                  Weekdays schedule is disabled.
                </div>
              )}
            </div>

            {/* Weekend Config */}
            <div className="border border-gray-200 dark:border-gray-700 p-5 rounded-2xl bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">
                    Weekends (Sat - Sun)
                  </h3>
                </div>
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={weActive}
                    onChange={(e) => setWeActive(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mr-2"
                  />
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Active
                  </span>
                </label>
              </div>

              {weActive ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={weStart}
                      onChange={(e) => setWeStart(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={weEnd}
                      onChange={(e) => setWeEnd(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Break Start (Optional)
                    </label>
                    <input
                      type="time"
                      value={weBreakStart}
                      onChange={(e) => setWeBreakStart(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Break End (Optional)
                    </label>
                    <input
                      type="time"
                      value={weBreakEnd}
                      onChange={(e) => setWeBreakEnd(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      Slot Duration
                    </label>
                    <select
                      value={weDuration}
                      onChange={(e) =>
                        setWeDuration(Number(e.target.value) as 15 | 30)
                      }
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                    >
                      <option value={15}>15 Min (Free)</option>
                      <option value={30}>30 Min (Paid)</option>
                    </select>
                  </div>
                  {weDuration === 30 && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={wePrice}
                        onChange={(e) => setWePrice(Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium dark:text-white"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-gray-400">
                  Weekends schedule is disabled.
                </div>
              )}
            </div>
          </div>

          {/* GENERATE PREVIEW BUTTON */}
          <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6 flex justify-end">
            <button
              type="button"
              onClick={generatePreview}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-blue-500/20 text-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              Generate Preview
            </button>
          </div>

          {/* Preview Section */}
          {previewSlots.length > 0 && (
            <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-emerald-950 dark:text-emerald-200">
                      Preview Ready: {previewSlots.length} Slots Generated
                    </h3>
                    <p className="text-xs text-emerald-800/80 dark:text-emerald-400">
                      Slots are verified and ready to save. Overlaps with existing database slots have been skipped.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSaveBulkSlots}
                  disabled={loading}
                  className="w-full sm:w-auto px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md text-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Save {previewSlots.length} Slots to Database
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                {previewSlots.map((slot) => {
                  const sDate = new Date(slot.startTime);
                  return (
                    <div
                      key={slot._tempId}
                      className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xs text-center relative group hover:border-blue-400 transition"
                    >
                      <button
                        onClick={() => removePreviewSlot(slot._tempId)}
                        className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition text-xs font-bold"
                        title="Remove slot"
                      >
                        ✕
                      </button>
                      <div className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">
                        {sDate.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                        {sDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="text-[11px] font-medium text-gray-500 mt-1">
                        {slot.duration}m •{" "}
                        {slot.price === 0 ? "Free" : `₹${slot.price}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* EXISTING SLOTS GRID */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xs border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Existing Database Slots
            </h2>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 py-1 px-3 rounded-full font-bold">
              Total: {slots.length} (Showing {filteredExistingSlots.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <input
              type="date"
              value={slotSearchDate}
              onChange={(e) => setSlotSearchDate(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-1.5 px-3 text-xs outline-none focus:border-blue-500 font-medium"
              title="Filter slots by date"
            />
            {slotSearchDate && (
              <button
                onClick={() => setSlotSearchDate("")}
                className="text-xs text-red-500 hover:underline font-semibold"
              >
                Clear Date
              </button>
            )}

            <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setSlotStatusFilter("all")}
                className={`px-3 py-1 rounded-md font-semibold ${
                  slotStatusFilter === "all"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-2xs"
                    : "text-gray-500"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSlotStatusFilter("available")}
                className={`px-3 py-1 rounded-md font-semibold ${
                  slotStatusFilter === "available"
                    ? "bg-white dark:bg-gray-800 text-emerald-600 shadow-2xs"
                    : "text-gray-500"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setSlotStatusFilter("booked")}
                className={`px-3 py-1 rounded-md font-semibold ${
                  slotStatusFilter === "booked"
                    ? "bg-white dark:bg-gray-800 text-rose-600 shadow-2xs"
                    : "text-gray-500"
                }`}
              >
                Booked
              </button>
            </div>

            <button
              onClick={() => dispatch(fetchAdminSlots())}
              disabled={loading}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 transition"
              title="Refresh Slots"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-6 text-red-500 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 max-h-[800px] overflow-y-auto">
          {filteredExistingSlots.map((slot) => {
            const startDate = new Date(slot.startTime);
            const endDate = new Date(slot.endTime);
            const isBooked = slot.isBooked;

            return (
              <div
                key={slot._id}
                className={`p-4 rounded-xl border-2 relative transition hover:shadow-md ${
                  isBooked
                    ? "bg-red-50/60 border-red-300 dark:bg-red-950/20 dark:border-red-900"
                    : "bg-emerald-50/60 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-900"
                }`}
              >
                <div className="text-xs font-bold text-gray-900 dark:text-white mb-2 border-b border-gray-200/60 dark:border-gray-700 pb-1.5">
                  {startDate.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="text-xs text-gray-800 dark:text-gray-200 font-semibold">
                  {startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {endDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-[11px] font-bold mt-2 text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-black/40 px-2 py-1 inline-block rounded-md border border-gray-200/50 dark:border-gray-700">
                  {slot.duration} Min •{" "}
                  {slot.price === 0 ? "Free" : `₹${slot.price}`}
                </div>
                <div
                  className={`text-[11px] mt-2 font-extrabold flex items-center gap-1.5 ${
                    isBooked
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isBooked ? "bg-red-600" : "bg-emerald-500"
                    }`}
                  ></span>
                  {isBooked ? "BOOKED" : "AVAILABLE"}
                </div>

                {!isBooked && (
                  <button
                    onClick={() => handleDelete(slot._id)}
                    className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                    title="Delete Slot"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
          {filteredExistingSlots.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-gray-400 text-sm">
              {slotSearchDate || slotStatusFilter !== "all"
                ? "No slots match the selected date or filter."
                : "No slots available. Start by creating some above!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationSlots;
