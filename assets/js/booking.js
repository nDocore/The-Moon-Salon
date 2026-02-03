import { DataManager } from './data.js';

const BookingSystem = {
    selectedService: null,
    selectedDate: null,
    selectedTime: null,

    init: () => {
        // Event listeners will be attached by main.js or here if container exists
    },

    // Utilities
    isMonday: (dateString) => {
        const d = new Date(dateString);
        return d.getDay() === 1; // 0=Sun, 1=Mon
    },

    getExistingBookingsForDate: async (dateString) => {
        const allBookings = await DataManager.getBookings();
        return allBookings.filter(b => b.date === dateString && b.status !== 'cancelled');
    },

    // Time Slot Logic
    generateTimeSlots: async (dateString, serviceDuration) => {
        if (!dateString || !serviceDuration) return [];
        if (BookingSystem.isMonday(dateString)) return []; // Closed Mondays

        const slots = [];
        const startHour = 9;
        const endHour = 18;
        const existingBookings = await BookingSystem.getExistingBookingsForDate(dateString);

        // Generate all possible start times (30 min intervals)
        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += 30) {
                // Calculate potential end time
                // Convert duration to minutes for easier calculation
                let startInMinutes = h * 60 + m;
                let endInMinutes = startInMinutes + serviceDuration;

                // End time check (Must finish by 18:00)
                if (endInMinutes > endHour * 60) {
                    continue; // Skip if service exceeds closing time
                }

                const potentialStart = startInMinutes;
                const potentialEnd = endInMinutes;

                let isOverlap = false;
                for (let booking of existingBookings) {
                    const [bStartH, bStartM] = booking.time.split(':').map(Number);
                    const bDuration = parseInt(booking.duration);

                    const bStart = bStartH * 60 + bStartM;
                    const bEnd = bStart + bDuration;

                    // Overlap Condition: (StartA < EndB) and (EndA > StartB)
                    if (potentialStart < bEnd && potentialEnd > bStart) {
                        isOverlap = true;
                        break;
                    }
                }

                if (!isOverlap) {
                    const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                    slots.push(timeString);
                }
            }
        }
        return slots;
    },

    submitBooking: async (formData) => {
        // 1. Strict Date Check (Monday)
        if (BookingSystem.isMonday(formData.date)) {
            alert(TRANSLATIONS[currentLang].msg_closed_monday);
            return false;
        }

        // 2. Strict Overlap Check
        const validSlots = await BookingSystem.generateTimeSlots(formData.date, formData.duration);

        if (!validSlots.includes(formData.time)) {
            alert(TRANSLATIONS[currentLang].msg_double_book);
            return false;
        }

        await DataManager.addBooking(formData);
        return true;
    }
};

export { BookingSystem };
