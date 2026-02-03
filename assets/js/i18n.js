const TRANSLATIONS = {
    en: {
        tagline: "Healthy, Shiny, Stylish Hair — Designed for You",
        book_btn: "Book Appointment",
        nav_services: "Our Services",
        nav_about: "About",
        nav_contact: "Contact",

        // About Section
        about_title: "About Us",
        about_desc: "The Moon Salon is a professional hair salon providing complete hair care services, from styling to deep hair treatment. We focus on healthy, beautiful, and fashionable hair using quality products and skilled stylists.",

        // Form
        form_name: "Name",
        form_phone: "Phone Number",
        form_service: "Choose Service",
        form_date: "Date",
        form_time: "Time",
        form_notes: "Notes (Optional)",
        form_submit: "Confirm Booking",

        // Messages
        msg_success: "Booking Confirmed!",
        msg_contact_us: "We will contact you shortly.",
        msg_double_book: "Selected time is no longer available. Please choose another time.",
        msg_closed_monday: "Sorry, we are closed on Mondays. Please choose another day.",

        // Footer/Contact
        contact_title: "Contact Us",
        opening_hours: "09:00 – 18:00 (Closed Monday)",
        get_directions: "Get Directions",
        facebook_page: "Visit Facebook Page"
    },
    th: {
        tagline: "ผมสุขภาพดี เงางาม มีสไตล์ ในแบบของคุณ",
        book_btn: "จองคิว",
        nav_services: "บริการของเรา",
        nav_about: "เกี่ยวกับเรา",
        nav_contact: "ติดต่อเรา",

        // About Section
        about_title: "เกี่ยวกับเรา",
        about_desc: "The Moon Salon คือร้านทำผมมืออาชีพ ให้บริการดูแลเส้นผมครบวงจร ตั้งแต่การจัดแต่งทรงจนถึงการบำรุงลึก เน้นผมสุขภาพดี สวยงาม และทันสมัย ด้วยผลิตภัณฑ์คุณภาพและช่างผู้เชี่ยวชาญ",

        // Form
        form_name: "ชื่อ",
        form_phone: "เบอร์โทรศัพท์",
        form_service: "เลือกบริการ",
        form_date: "วันที่",
        form_time: "เวลา",
        form_notes: "หมายเหตุ (ไม่ระบุได้)",
        form_submit: "ยืนยันการจอง",

        // Messages
        msg_success: "การจองสำเร็จ!",
        msg_contact_us: "เราจะติดต่อกลับโดยเร็วที่สุด",
        msg_double_book: "เวลานี้ถูกจองแล้ว กรุณาเลือกเวลาใหม่",
        msg_closed_monday: "ขออภัย ร้านหยุดทุกวันจันทร์ กรุณาเลือกวันอื่น",

        // Footer/Contact
        contact_title: "ติดต่อเรา",
        opening_hours: "09:00 – 18:00 (หยุดทุกวันจันทร์)",
        get_directions: "นำทางมาร้าน",
        facebook_page: "ไปที่เพจ Facebook"
    }
};

let currentLang = 'th'; // Default to TH

function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;

    // Update active button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === lang) {
            btn.classList.add('active');
        }
    });

    // Update text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (TRANSLATIONS[lang][key]) {
            // Handle input placeholders specifically
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = TRANSLATIONS[lang][key];
            } else {
                el.innerText = TRANSLATIONS[lang][key];
            }
        }
    });

    // Dispatch event for other components to react if needed
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Initial set
document.addEventListener('DOMContentLoaded', () => {
    setLanguage('th');
});
