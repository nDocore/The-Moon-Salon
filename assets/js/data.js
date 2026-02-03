import { db, ref, get, set, push, update, child } from './firebase.js';

const SAMPLE_SERVICES = [
    { id: 's1', name_en: 'Haircut (Men & Women)', name_th: 'ตัดผม (ชาย & หญิง)', price: 500, duration: 60 },
    { id: 's2', name_en: 'Wash & Styling', name_th: 'สระไดร์', price: 350, duration: 45 },
    { id: 's3', name_en: 'Hair Coloring', name_th: 'ทำสีผม', price: 2500, duration: 120 },
    { id: 's4', name_en: 'Hair Spa Treatment', name_th: 'ทรีทเม้นท์สปาผม', price: 1500, duration: 90 },
    { id: 's5', name_en: 'Keratin Treatment', name_th: 'เคราตินทรีทเม้นท์', price: 3000, duration: 150 },
    { id: 's6', name_en: 'Korean Style Perm', name_th: 'ดัดสไตล์เกาหลี', price: 3500, duration: 120 },
    { id: 's7', name_en: 'Cold Perm', name_th: 'ดัดเย็น (Cold Perm)', price: 2000, duration: 120 },
    { id: 's8', name_en: 'Keratin Hair Straightening', name_th: 'ยืดเคราติน', price: 3500, duration: 180 },
    { id: 's9', name_en: 'Natural Hair Straightening', name_th: 'ยืดผมธรรมชาติ', price: 3000, duration: 180 }
];

const DB_PATHS = {
    SERVICES: 'moon/services',
    BOOKINGS: 'moon/bookings'
};

const DataManager = {
    init: async () => {
        const servicesRef = ref(db, DB_PATHS.SERVICES);
        const snapshot = await get(servicesRef);
        if (!snapshot.exists()) {
            await set(servicesRef, SAMPLE_SERVICES);
        }
    },

    getServices: async () => {
        const snapshot = await get(ref(db, DB_PATHS.SERVICES));
        return snapshot.exists() ? snapshot.val() : [];
    },

    getBookings: async () => {
        const snapshot = await get(ref(db, DB_PATHS.BOOKINGS));
        if (snapshot.exists()) {
            const data = snapshot.val();
            // Convert object to array if Firebase returns it as object
            return Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        }
        return [];
    },

    addBooking: async (booking) => {
        const bookingsRef = ref(db, DB_PATHS.BOOKINGS);
        const newBookingRef = push(bookingsRef);
        booking.status = 'pending';
        booking.id = newBookingRef.key;
        await set(newBookingRef, booking);
        return booking;
    },

    updateBookingStatus: async (id, status) => {
        const bookingRef = ref(db, `${DB_PATHS.BOOKINGS}/${id}`);
        await update(bookingRef, { status: status });
        return true;
    }
};

export { DataManager, SAMPLE_SERVICES };
