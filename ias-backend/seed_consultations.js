import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ConsultationSlot from './models/ConsultationSlot.js';

dotenv.config();

async function seedUpcomingSlots() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create upcoming slots for today and next 14 days
    const now = new Date();
    const newSlots = [];

    for (let dayOffset = 0; dayOffset <= 14; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() + dayOffset);
      const dateStr = targetDate.toISOString().split('T')[0];

      // Time slots: 10:00 AM, 11:30 AM, 02:00 PM, 04:30 PM, 07:00 PM
      const slotTimes = [
        { hour: 10, min: 0, duration: 15, price: 0 },
        { hour: 11, min: 30, duration: 15, price: 0 },
        { hour: 14, min: 0, duration: 15, price: 0 },
        { hour: 16, min: 30, duration: 15, price: 0 },
        { hour: 19, min: 0, duration: 15, price: 0 },
      ];

      for (const st of slotTimes) {
        const start = new Date(targetDate);
        start.setHours(st.hour, st.min, 0, 0);

        const end = new Date(start.getTime() + st.duration * 60000);

        // Check if slot already exists
        const exists = await ConsultationSlot.findOne({
          startTime: start,
        });

        if (!exists) {
          newSlots.push({
            startTime: start,
            endTime: end,
            duration: st.duration,
            price: st.price,
            isActive: true,
            isBooked: false,
          });
        }
      }
    }

    if (newSlots.length > 0) {
      await ConsultationSlot.insertMany(newSlots);
      console.log(`Successfully created ${newSlots.length} new upcoming consultation slots!`);
    } else {
      console.log('Slots already exist for upcoming days.');
    }

    const total = await ConsultationSlot.countDocuments();
    console.log(`Total slots now: ${total}`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding slots:', err);
    process.exit(1);
  }
}

seedUpcomingSlots();
