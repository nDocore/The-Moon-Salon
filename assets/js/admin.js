import { DataManager } from './data.js';

window.checkLogin = function () {
    const pin = document.getElementById('pin-input').value;
    if (pin === 'admin888') {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        loadBookings();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
};

window.changeDate = function (days) {
    const d = new Date(currentAdminDate);
    d.setDate(d.getDate() + days);
    currentAdminDate = d.toISOString().split('T')[0];
    renderTimeline();
};

window.setDate = function (dateString) {
    currentAdminDate = dateString;
    renderTimeline();
};

window.updateStatus = async function (id, status) {
    if (confirm(`Change status to ${status}?`)) {
        await DataManager.updateBookingStatus(id, status);
        loadBookings();
    }
};

// Global state for admin dashboard
let currentAdminDate = new Date().toISOString().split('T')[0];

async function loadBookings() {
    await renderBookingList();
    await renderTimeline();
}

async function renderBookingList() {
    const list = document.getElementById('booking-list');
    const bookings = await DataManager.getBookings();

    // Sort by Date + Time
    bookings.sort((a, b) => {
        return new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time);
    });

    list.innerHTML = bookings.map(b => `
        <tr>
            <td>
                <div>${b.date}</div>
                <div style="color: var(--text-secondary);">${b.time}</div>
            </td>
            <td>
                <div>${b.customerName}</div>
                <div style="color: var(--text-secondary); font-size: 0.9rem;">${b.phone}</div>
                ${b.notes ? `<div style="font-size: 0.8rem; color: var(--accent-moon); margin-top:4px;">Note: ${b.notes}</div>` : ''}
            </td>
            <td>
                ${b.serviceName || 'Unknown Service'}
                <div style="font-size: 0.8rem; color: var(--text-secondary);">${b.duration} min</div>
            </td>
            <td>
                <span class="status-badge status-${b.status}">${b.status}</span>
            </td>
            <td>
                ${b.status === 'pending' ? `
                    <button class="action-btn btn-confirm" onclick="updateStatus('${b.id}', 'confirmed')">✓</button>
                    <button class="action-btn btn-cancel" onclick="updateStatus('${b.id}', 'cancelled')">✕</button>
                ` : ''}
                ${b.status === 'confirmed' ? `
                    <button class="action-btn btn-cancel" onclick="updateStatus('${b.id}', 'cancelled')">Cancel</button>
                ` : ''}
            </td>
        </tr>
    `).join('');

    if (bookings.length === 0) {
        list.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem;">No bookings found.</td></tr>';
    }
}

async function renderTimeline() {
    const container = document.getElementById('timeline-view');
    if (!container) return;

    const allBookings = await DataManager.getBookings();
    const bookings = allBookings.filter(b => b.date === currentAdminDate && b.status !== 'cancelled');
    const startHour = 9;
    const endHour = 18;
    const totalHours = endHour - startHour;

    // Create Timeline HTML Structure
    let timelineHTML = `
        <div class="timeline-container">
            <div class="timeline-header">
                <h3>Schedule: ${currentAdminDate}</h3>
                <div class="timeline-controls">
                    <button onclick="changeDate(-1)" class="btn-secondary" style="padding: 4px 12px;">←</button>
                    <input type="date" value="${currentAdminDate}" onchange="setDate(this.value)" style="background: transparent; border: 1px solid #555; color: white; padding: 4px; border-radius: 4px;">
                    <button onclick="changeDate(1)" class="btn-secondary" style="padding: 4px 12px;">→</button>
                </div>
            </div>
            <div class="timeline-track">
    `;

    // Render Hour Markers
    for (let h = startHour; h <= endHour; h++) {
        const leftPos = ((h - startHour) / totalHours) * 100;
        timelineHTML += `<div class="timeline-hour" style="left: ${leftPos}%">${h}:00</div>`;
    }

    // Render Booking Blocks
    bookings.forEach(b => {
        const [h, m] = b.time.split(':').map(Number);
        const startTimeInHours = h + (m / 60);
        const durationInHours = parseInt(b.duration) / 60;

        const leftPos = ((startTimeInHours - startHour) / totalHours) * 100;
        const width = (durationInHours / totalHours) * 100;

        timelineHTML += `
            <div class="timeline-block ${b.status}" 
                 style="left: ${leftPos}%; width: ${width}%;"
                 title="${b.time} - ${b.customerName} (${b.serviceName})">
                ${b.time} ${b.customerName}
            </div>
        `;
    });

    timelineHTML += `</div></div>`;
    container.innerHTML = timelineHTML;
}

// Initial initialization if needed
DataManager.init();
