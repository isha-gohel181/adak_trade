import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import {
  fetchAdminSlots,
  createSlots,
  deleteSlot,
} from "../../store/slices/consultationSlice";
import { toast } from "react-hot-toast";

const ConsultationSlots = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { slots, loading, error } = useSelector((state: RootState) => state.consultation);

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

  const handleCreateSingleSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime) {
      toast.error("Please provide date and start time");
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const newSlot = {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      duration,
      price: duration === 15 ? 0 : price,
    };

    try {
      await dispatch(createSlots([newSlot])).unwrap();
      toast.success("Slot created successfully");
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

  const parseTime = (dateStr: string, timeStr: string) => {
    return new Date(`${dateStr}T${timeStr}`);
  };

  const generatePreview = () => {
    if (!bulkStartDate || !bulkEndDate) {
      toast.error("Please select a start and end date for bulk generation.");
      return;
    }

    const startD = new Date(bulkStartDate);
    const endD = new Date(bulkEndDate);

    if (startD > endD) {
      toast.error("Start date must be before end date.");
      return;
    }

    const generated: any[] = [];

    // Iterate through each day
    let currentD = new Date(startD);
    while (currentD <= endD) {
      const dateString = currentD.toISOString().split("T")[0];
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

        let slotStartTime = parseTime(dateString, startT);
        const dayEndTime = parseTime(dateString, endT);

        const breakStartTime = breakStartT ? parseTime(dateString, breakStartT) : null;
        const breakEndTime = breakEndT ? parseTime(dateString, breakEndT) : null;

        while (slotStartTime < dayEndTime) {
          const slotEndTime = new Date(slotStartTime.getTime() + dur * 60000);

          // Stop if this slot exceeds the day's end time
          if (slotEndTime > dayEndTime) break;

          // Check if it overlaps with break
          let isBreak = false;
          if (breakStartTime && breakEndTime) {
            if (slotStartTime < breakEndTime && slotEndTime > breakStartTime) {
              isBreak = true;
            }
          }

          if (!isBreak) {
            // Check for overlaps with existing slots from database
            const hasOverlap = slots.some(existingSlot => {
              const exStart = new Date(existingSlot.startTime);
              const exEnd = new Date(existingSlot.endTime);
              return slotStartTime < exEnd && slotEndTime > exStart;
            });

            if (!hasOverlap) {
              generated.push({
                _tempId: Math.random().toString(),
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
    toast.success(`Generated ${generated.length} slots for preview. Check the table below.`);
  };

  const removePreviewSlot = (tempId: string) => {
    setPreviewSlots(prev => prev.filter(s => s._tempId !== tempId));
  };

  const handleSaveBulkSlots = async () => {
    if (previewSlots.length === 0) return;
    try {
      const payload = previewSlots.map(({ _tempId, ...rest }) => rest);
      await dispatch(createSlots(payload)).unwrap();
      toast.success(`${payload.length} slots created successfully!`);
      setPreviewSlots([]);
    } catch (err: any) {
      toast.error(err || "Failed to save bulk slots");
    }
  };

  // Filters for Existing Database Slots
  const [slotSearchDate, setSlotSearchDate] = useState("");
  const [slotStatusFilter, setSlotStatusFilter] = useState<"all" | "available" | "booked">("all");

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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Consultation Slots</h1>
          <p className="text-xs text-gray-500 mt-0.5">Configure 15-min free or 30-min paid consultation schedule</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("single")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition ${
              activeTab === "single" 
                ? "bg-white dark:bg-gray-700 shadow text-primary font-bold" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Single Slot
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`px-4 py-2 rounded-md font-medium text-sm transition ${
              activeTab === "bulk" 
                ? "bg-white dark:bg-gray-700 shadow text-primary font-bold" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            Bulk Generator
          </button>
        </div>
      </div>

      {/* SINGLE SLOT TAB */}
      {activeTab === "single" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Create New Slot</h2>
          <form onSubmit={handleCreateSingleSlot} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                <input
                  type="time"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                <select
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value) as 15 | 30)}
                >
                  <option value={15}>15 Minutes (Free)</option>
                  <option value={30}>30 Minutes (Paid)</option>
                </select>
              </div>
              {duration === 30 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
              )}
            </div>
            
            <div className="border-t border-stroke pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md"
              >
                + Add Single Slot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* BULK GENERATOR TAB */}
      {activeTab === "bulk" && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Bulk Slot Generator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary"
                value={bulkStartDate}
                onChange={(e) => setBulkStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary"
                value={bulkEndDate}
                onChange={(e) => setBulkEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekday Config */}
            <div className="border border-stroke dark:border-strokedark p-4 rounded-lg bg-gray-50 dark:bg-boxdark">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Weekdays (Mon - Fri)</h3>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={wdActive} onChange={(e) => setWdActive(e.target.checked)} className="mr-2" />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
              
              {wdActive ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Start Time</label>
                    <input type="time" value={wdStart} onChange={e => setWdStart(e.target.value)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">End Time</label>
                    <input type="time" value={wdEnd} onChange={e => setWdEnd(e.target.value)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Break Start (Optional)</label>
                    <input type="time" value={wdBreakStart} onChange={e => setWdBreakStart(e.target.value)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Break End (Optional)</label>
                    <input type="time" value={wdBreakEnd} onChange={e => setWdBreakEnd(e.target.value)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Duration</label>
                    <select value={wdDuration} onChange={e => setWdDuration(Number(e.target.value) as 15|30)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800">
                      <option value={15}>15 Min (Free)</option>
                      <option value={30}>30 Min (Paid)</option>
                    </select>
                  </div>
                  {wdDuration === 30 && (
                    <div>
                      <label className="block text-xs font-medium mb-1">Price (₹)</label>
                      <input type="number" min="0" value={wdPrice} onChange={e => setWdPrice(Number(e.target.value))} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Weekdays are disabled.</p>
              )}
            </div>

            {/* Weekend Config */}
            <div className="border border-stroke dark:border-strokedark p-4 rounded-lg bg-gray-50 dark:bg-boxdark">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Weekends (Sat - Sun)</h3>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={weActive} onChange={(e) => setWeActive(e.target.checked)} className="mr-2" />
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
              
              {weActive ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Start Time</label>
                    <input type="time" value={weStart} onChange={e => setWeStart(e.target.value)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">End Time</label>
                    <input type="time" value={weEnd} onChange={e => setWeEnd(e.target.value)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Break Start (Optional)</label>
                    <input type="time" value={weBreakStart} onChange={e => setWeBreakStart(e.target.value)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Break End (Optional)</label>
                    <input type="time" value={weBreakEnd} onChange={e => setWeBreakEnd(e.target.value)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Duration</label>
                    <select value={weDuration} onChange={e => setWeDuration(Number(e.target.value) as 15|30)} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800">
                      <option value={15}>15 Min (Free)</option>
                      <option value={30}>30 Min (Paid)</option>
                    </select>
                  </div>
                  {weDuration === 30 && (
                    <div>
                      <label className="block text-xs font-medium mb-1">Price (₹)</label>
                      <input type="number" min="0" value={wePrice} onChange={e => setWePrice(Number(e.target.value))} className="w-full rounded border px-2 py-1 text-sm dark:bg-gray-800" />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Weekends are disabled.</p>
              )}
            </div>
          </div>

          <div className="mt-8 border-t border-stroke pt-6 flex justify-end">
            <button
              type="button"
              onClick={generatePreview}
              className="px-8 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 shadow-md text-lg"
            >
              Generate Preview
            </button>
          </div>

          {/* Preview Section */}
          {previewSlots.length > 0 && (
            <div className="mt-8 border-t pt-6 border-stroke dark:border-strokedark">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white">Preview: {previewSlots.length} Slots Generated</h3>
                <button
                  onClick={handleSaveBulkSlots}
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 shadow-md text-lg"
                >
                  Save {previewSlots.length} Slots to Database
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Note: Existing slots overlapping with generated times were automatically skipped.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {previewSlots.map((slot) => {
                  const sDate = new Date(slot.startTime);
                  return (
                    <div key={slot._tempId} className="p-3 bg-white dark:bg-gray-800 border rounded shadow-sm text-center relative group">
                      <button 
                        onClick={() => removePreviewSlot(slot._tempId)}
                        className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition"
                        title="Remove from preview"
                      >
                        ✕
                      </button>
                      <div className="text-xs font-bold text-gray-800 dark:text-white mb-1">
                        {sDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs text-primary font-medium">
                        {sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        {slot.duration}m • {slot.price === 0 ? "Free" : `₹${slot.price}`}
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 sm:p-6 border-b border-stroke dark:border-strokedark gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Existing Database Slots</h2>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 py-1 px-3 rounded-full font-bold">
              Total: {slots.length} (Showing {filteredExistingSlots.length})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <input
              type="date"
              value={slotSearchDate}
              onChange={(e) => setSlotSearchDate(e.target.value)}
              className="rounded border border-stroke dark:border-strokedark bg-transparent py-1.5 px-3 text-xs outline-none focus:border-primary"
              title="Filter slots by date"
            />
            {slotSearchDate && (
              <button
                onClick={() => setSlotSearchDate("")}
                className="text-xs text-red-500 hover:underline"
              >
                Clear Date
              </button>
            )}

            <div className="flex bg-gray-100 dark:bg-gray-700 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setSlotStatusFilter("all")}
                className={`px-2.5 py-1 rounded ${
                  slotStatusFilter === "all" ? "bg-white dark:bg-gray-800 font-bold shadow-2xs" : "text-gray-500"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSlotStatusFilter("available")}
                className={`px-2.5 py-1 rounded ${
                  slotStatusFilter === "available" ? "bg-white dark:bg-gray-800 text-emerald-600 font-bold shadow-2xs" : "text-gray-500"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setSlotStatusFilter("booked")}
                className={`px-2.5 py-1 rounded ${
                  slotStatusFilter === "booked" ? "bg-white dark:bg-gray-800 text-rose-600 font-bold shadow-2xs" : "text-gray-500"
                }`}
              >
                Booked
              </button>
            </div>

            <button
              onClick={() => dispatch(fetchAdminSlots())}
              disabled={loading}
              className="p-1.5 rounded border border-stroke hover:bg-gray-50 dark:border-strokedark text-xs text-gray-600 dark:text-gray-300"
              title="Refresh Slots"
            >
              🔄
            </button>
          </div>
        </div>
        
        {error && <div className="p-6 text-red-500">{error}</div>}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6 max-h-[800px] overflow-y-auto">
          {filteredExistingSlots.map((slot) => {
            const startDate = new Date(slot.startTime);
            const endDate = new Date(slot.endTime);
            const isBooked = slot.isBooked;

            return (
              <div
                key={slot._id}
                className={`p-4 rounded-lg border-2 relative transition hover:shadow-md ${
                  isBooked
                    ? "bg-red-50 border-red-500 dark:bg-red-900/20"
                    : "bg-green-50 border-green-500 dark:bg-green-900/20"
                }`}
              >
                <div className="text-sm font-bold text-gray-800 dark:text-white mb-2 border-b pb-1">
                  {startDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">
                  {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                  {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs font-semibold mt-2 text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-black/20 p-1 inline-block rounded">
                  {slot.duration} Min • {slot.price === 0 ? "Free" : `₹${slot.price}`}
                </div>
                <div className={`text-xs mt-2 font-bold flex items-center gap-1 ${isBooked ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                  <span className={`w-2 h-2 rounded-full ${isBooked ? "bg-red-600" : "bg-green-600"}`}></span>
                  {isBooked ? "BOOKED" : "AVAILABLE"}
                </div>
                
                {!isBooked && (
                  <button
                    onClick={() => handleDelete(slot._id)}
                    className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                    title="Delete Slot"
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
          {filteredExistingSlots.length === 0 && !loading && (
            <div className="col-span-full text-center py-10 text-gray-500">
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
