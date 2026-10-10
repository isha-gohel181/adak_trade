import mongoose, { Schema } from 'mongoose';

const consultationSlotSchema = new Schema({
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number, enum: [15, 30], required: true }, // duration in minutes
    price: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
    isBooked: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.ConsultationSlot || mongoose.model('ConsultationSlot', consultationSlotSchema);
