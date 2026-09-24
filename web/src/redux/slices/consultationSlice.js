import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authorizedFetch } from '../../utils/apiClient';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://api.edrilla.com';

// ── Fetch Available Slots ───────────────────────────────────────────────────
export const fetchAvailableSlots = createAsyncThunk(
  'consultation/fetchAvailableSlots',
  async ({ date } = {}, { rejectWithValue }) => {
    try {
      const url = date 
        ? `${BASE_URL}/consultations/slots/available?date=${encodeURIComponent(date)}`
        : `${BASE_URL}/consultations/slots/available`;

      const res = await authorizedFetch(url, { method: 'GET' });
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

// ── Create Order for Paid Consultation ───────────────────────────────────────
export const createConsultationOrder = createAsyncThunk(
  'consultation/createConsultationOrder',
  async ({ slotId }, { rejectWithValue }) => {
    try {
      const res = await authorizedFetch(`${BASE_URL}/consultations/create-order`, {
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
      const res = await authorizedFetch(`${BASE_URL}/consultations/book`, {
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
  selectedDate: new Date().toISOString().split('T')[0],
  selectedSlot: null,
  loading: false,
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
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Slots
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
