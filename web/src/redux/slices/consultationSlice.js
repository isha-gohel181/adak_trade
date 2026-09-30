import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authorizedFetch } from '../../utils/apiClient';

// Helper to get local date string YYYY-MM-DD
const getLocalDateString = (d = new Date()) => {
  const dateObj = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return new Date().toISOString().split('T')[0];
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// ── Fetch Available Slots (Filtered by date or future) ───────────────────────
export const fetchAvailableSlots = createAsyncThunk(
  'consultation/fetchAvailableSlots',
  async ({ date } = {}, { rejectWithValue }) => {
    try {
      const endpoint = date 
        ? `/consultations/slots/available?date=${encodeURIComponent(date)}`
        : '/consultations/slots/available';

      const res = await authorizedFetch(endpoint, { method: 'GET' });
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || 'Failed to fetch slots');
      }
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Network error fetching slots');
    }
  }
);

// ── Fetch All Upcoming Slots for Calendar Indicator Badges ──────────────────
export const fetchAllUpcomingSlots = createAsyncThunk(
  'consultation/fetchAllUpcomingSlots',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authorizedFetch('/consultations/slots/available', { method: 'GET' });
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || 'Failed to fetch all slots');
      }
      return data?.data || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Network error fetching all slots');
    }
  }
);

// ── Create Order for Paid Consultation ───────────────────────────────────────
export const createConsultationOrder = createAsyncThunk(
  'consultation/createConsultationOrder',
  async ({ slotId }, { rejectWithValue }) => {
    try {
      const res = await authorizedFetch('/consultations/create-order', {
        method: 'POST',
        body: JSON.stringify({ slotId }),
      });
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || 'Failed to create consultation order');
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error creating order');
    }
  }
);

// ── Book Consultation ───────────────────────────────────────────────────────
export const bookConsultation = createAsyncThunk(
  'consultation/bookConsultation',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await authorizedFetch('/consultations/book', {
        method: 'POST',
        body: formData, // FormData handles multipart/form-data directly
      });
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data?.message || 'Failed to book consultation');
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error booking consultation');
    }
  }
);

const initialState = {
  slots: [],
  allUpcomingSlots: [],
  selectedDate: getLocalDateString(),
  selectedSlot: null,
  loading: false,
  allSlotsLoading: false,
  bookingLoading: false,
  error: null,
  bookingSuccess: false,
  lastBooking: null,
};

const consultationSlice = createSlice({
  name: 'consultation',
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedSlot: (state, action) => {
      state.selectedSlot = action.payload;
    },
    resetBookingState: (state) => {
      state.bookingSuccess = false;
      state.lastBooking = null;
      state.error = null;
      state.bookingLoading = false;
      state.selectedSlot = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Date Slots
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.loading = false;
        state.slots = action.payload || [];
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Upcoming Slots
      .addCase(fetchAllUpcomingSlots.pending, (state) => {
        state.allSlotsLoading = true;
      })
      .addCase(fetchAllUpcomingSlots.fulfilled, (state, action) => {
        state.allSlotsLoading = false;
        state.allUpcomingSlots = action.payload || [];
      })
      .addCase(fetchAllUpcomingSlots.rejected, (state) => {
        state.allSlotsLoading = false;
      })

      // Book Consultation
      .addCase(bookConsultation.pending, (state) => {
        state.bookingLoading = true;
        state.error = null;
        state.bookingSuccess = false;
      })
      .addCase(bookConsultation.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookingSuccess = true;
        state.lastBooking = action.payload?.data;
        // Mark slot as booked locally
        if (state.selectedSlot) {
          state.slots = state.slots.map((s) =>
            s._id === state.selectedSlot._id ? { ...s, isBooked: true } : s
          );
          state.allUpcomingSlots = state.allUpcomingSlots.map((s) =>
            s._id === state.selectedSlot._id ? { ...s, isBooked: true } : s
          );
        }
      })
      .addCase(bookConsultation.rejected, (state, action) => {
        state.bookingLoading = false;
        state.error = action.payload;
        state.bookingSuccess = false;
      });
  },
});

export const { setSelectedDate, setSelectedSlot, resetBookingState, clearError } = consultationSlice.actions;
export default consultationSlice.reducer;
