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

const DB_KEYS = {
    SERVICES: 'moon_services',
    BOOKINGS: 'moon_bookings'
};

const DataManager = {
    init: () => {
        if (!localStorage.getItem(DB_KEYS.SERVICES)) {
            localStorage.setItem(DB_KEYS.SERVICES, JSON.stringify(SAMPLE_SERVICES));
        }
        if (!localStorage.getItem(DB_KEYS.BOOKINGS)) {
            localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify([]));
        }
    },

    getServices: () => {
        return JSON.parse(localStorage.getItem(DB_KEYS.SERVICES) || '[]');
    },

    getBookings: () => {
        return JSON.parse(localStorage.getItem(DB_KEYS.BOOKINGS) || '[]');
    },

    addBooking: (booking) => {
        const bookings = DataManager.getBookings();
        // Simple ID generation
        booking.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        booking.status = 'pending';
        bookings.push(booking);
        localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
        return booking;
    },

    updateBookingStatus: (id, status) => {
        const bookings = DataManager.getBookings();
        const index = bookings.findIndex(b => b.id === id);
        if (index !== -1) {
            bookings[index].status = status;
            localStorage.setItem(DB_KEYS.BOOKINGS, JSON.stringify(bookings));
            return true;
        }
        return false;
    }
};

// Initialize on load
DataManager.init();
