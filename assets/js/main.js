document.addEventListener('DOMContentLoaded', () => {
    renderServices();
    initBookingForm();
    renderGallery(); // Placeholder function
});

// Render Services from DataManager
function renderServices() {
    const list = document.getElementById('services-list');
    const services = DataManager.getServices();

    list.innerHTML = services.map(s => `
        <div class="glass-card" style="padding: 2rem; position: relative; overflow: hidden;">
            <div style="background: rgba(224, 224, 255, 0.1); width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1rem; border: 1px solid rgba(255,255,255,0.1);">
                ✦
            </div>
            <h3 style="margin-bottom: 0.5rem; font-size: 1.25rem;">${s.name_en}</h3>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">${s.name_th}</p>
            
            <div class="section-divider" style="margin: 1rem 0; width: 30px; height: 2px; align-self: flex-start;"></div>

            <div style="display:flex; justify-content:space-between; align-items: flex-end; margin-top: auto;">
                <span style="color: var(--text-secondary); font-size: 0.9rem;">${s.duration} min</span>
                <span style="color: var(--accent-moon); font-weight: 600; font-size: 1.1rem;">-</span>
            </div>
        </div>
    `).join('');
}

// Booking Form Logic
function initBookingForm() {
    const app = document.getElementById('app');

    // Inject Booking Section
    const bookingSection = document.createElement('section');
    bookingSection.id = 'booking';
    bookingSection.className = 'section';
    bookingSection.style.background = 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.5))';

    bookingSection.innerHTML = `
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 1rem;" data-i18n="book_btn">Book Appointment</h2>
            <div class="section-divider"></div>
            
            <div class="glass-card" style="max-width: 600px; margin: 0 auto; padding: 3rem;">
                <form id="booking-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
                    
                    <div>
                        <label data-i18n="form_name" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Name</label>
                        <input type="text" name="name" required style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px;">
                    </div>

                    <div>
                        <label data-i18n="form_phone" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Phone</label>
                        <input type="tel" name="phone" required style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px;">
                    </div>

                    <div>
                        <label data-i18n="form_service" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Service</label>
                        <select name="serviceId" id="service-select" required style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px;">
                            <option value="">-- Select --</option>
                            ${DataManager.getServices().map(s => `<option value="${s.id}" data-duration="${s.duration}">${s.name_en} / ${s.name_th}</option>`).join('')}
                        </select>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div>
                            <label data-i18n="form_date" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Date</label>
                            <input type="date" name="date" id="date-select" required style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px;">
                        </div>
                        <div>
                            <label data-i18n="form_time" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Time</label>
                            <select name="time" id="time-select" required disabled style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px;">
                                <option value="">-- Select Date First --</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label data-i18n="form_notes" style="display: block; margin-bottom: 0.5rem; color: var(--text-secondary);">Notes</label>
                        <textarea name="notes" style="width: 100%; padding: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px;" rows="3"></textarea>
                    </div>

                    <button type="submit" class="btn-primary" style="margin-top: 1rem; width: 100%;" data-i18n="form_submit">Confirm Booking</button>
                </form>
            </div>
        </div>
    `;

    app.appendChild(bookingSection);

    // Form Event Listeners
    const form = document.getElementById('booking-form');
    const serviceSelect = document.getElementById('service-select');
    const dateSelect = document.getElementById('date-select');
    const timeSelect = document.getElementById('time-select');

    // Update slots when date or service changes
    function updateSlots() {
        const date = dateSelect.value;
        const serviceOption = serviceSelect.options[serviceSelect.selectedIndex];

        if (!date || !serviceOption.value) {
            timeSelect.innerHTML = '<option value="">-- Select Service & Date --</option>';
            timeSelect.disabled = true;
            return;
        }

        // 1. Strict Date Check (Monday) with immediate UI feedback
        if (BookingSystem.isMonday(date)) {
            alert(TRANSLATIONS[currentLang].msg_closed_monday);
            dateSelect.value = ''; // Clear invalid date
            timeSelect.innerHTML = '<option value="">-- Select Valid Date --</option>';
            timeSelect.disabled = true;
            return;
        }

        const duration = parseInt(serviceOption.getAttribute('data-duration'));
        const slots = BookingSystem.generateTimeSlots(date, duration);

        if (slots.length === 0) {
            timeSelect.innerHTML = '<option value="">No slots available (Full)</option>';
            timeSelect.disabled = true;
        } else {
            timeSelect.innerHTML = slots.map(t => `<option value="${t}">${t}</option>`).join('');
            timeSelect.disabled = false;
        }
    }

    serviceSelect.addEventListener('change', updateSlots);
    dateSelect.addEventListener('change', updateSlots);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const serviceOption = serviceSelect.options[serviceSelect.selectedIndex];

        // Final check for Monday on submission
        if (BookingSystem.isMonday(formData.get('date'))) {
            alert(TRANSLATIONS[currentLang].msg_closed_monday);
            return; // Prevent form submission
        }

        const booking = {
            customerName: formData.get('name'),
            phone: formData.get('phone'),
            serviceId: formData.get('serviceId'),
            serviceName: serviceOption.text,
            duration: parseInt(serviceOption.getAttribute('data-duration')),
            date: formData.get('date'),
            time: formData.get('time'),
            notes: formData.get('notes'),
            created: new Date().toISOString()
        };

        if (BookingSystem.submitBooking(booking)) {
            alert(TRANSLATIONS[currentLang].msg_success);
            form.reset();
            updateSlots(); // Reset slots
        }
    });
}

function renderGallery() {
    // Placeholder Gallery using CSS Gradients/Patterns since we don't have real images
    const gallerySection = document.createElement('section');
    gallerySection.className = 'section';
    gallerySection.innerHTML = `
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem;">Gallery</h2>
            <div class="masonry-grid">
                <div class="gallery-item tall" style="background: url('assets/images/balayage.jpg') center/cover no-repeat; display: flex; align-items: flex-end; justify-content: flex-start; position: relative;">
                    <div style="background: rgba(0,0,0,0.6); width: 100%; padding: 1rem; backdrop-filter: blur(2px);">
                        <span style="color: white; font-weight: 500;">Balayage Style</span>
                    </div>
                </div>
                <div class="gallery-item" style="background: url('assets/images/korean-haircut.jpg') center/cover no-repeat; display: flex; align-items: flex-end; justify-content: flex-start; position: relative;">
                    <div style="background: rgba(0,0,0,0.6); width: 100%; padding: 1rem; backdrop-filter: blur(2px);">
                        <span style="color: white; font-weight: 500;">Korean Haircut</span>
                    </div>
                </div>
                <div class="gallery-item" style="background: url('assets/images/haircolor.jpg') center/cover no-repeat; display: flex; align-items: flex-end; justify-content: flex-start; position: relative;">
                     <div style="background: rgba(0,0,0,0.6); width: 100%; padding: 1rem; backdrop-filter: blur(2px);">
                        <span style="color: white; font-weight: 500;">Ash Purple Color</span>
                    </div>
                </div>
                <div class="gallery-item wide" style="background: url('assets/images/kids-fashion.jpg') center/cover no-repeat; display: flex; align-items: flex-end; justify-content: flex-start; position: relative;">
                    <div style="background: rgba(0,0,0,0.6); width: 100%; padding: 1rem; backdrop-filter: blur(2px);">
                        <span style="color: white; font-weight: 500;">Kids Fashion Hair</span>
                    </div>
                </div>
                <div class="gallery-item" style="background: url('assets/images/silver-keratin.jpg') center/cover no-repeat; display: flex; align-items: flex-end; justify-content: flex-start; position: relative;">
                    <div style="background: rgba(0,0,0,0.6); width: 100%; padding: 1rem; backdrop-filter: blur(2px);">
                        <span style="color: white; font-weight: 500;">Silver Hair & Keratin</span>
                    </div>
                </div>
                 <div class="gallery-item" style="background: url('assets/images/korean-perm.jpg') center/cover no-repeat; display: flex; align-items: flex-end; justify-content: flex-start; position: relative;">
                    <div style="background: rgba(0,0,0,0.6); width: 100%; padding: 1rem; backdrop-filter: blur(2px);">
                        <span style="color: white; font-weight: 500;">Korean Digital Perm</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    // Insert before Contact section (assuming Contact is last)
    const contactSection = document.getElementById('contact');
    contactSection.parentNode.insertBefore(gallerySection, contactSection);
}

function scrollToBooking() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}
