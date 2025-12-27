// Cyber Range Management System - User Booking Logic
// Handles booking form submission and displays user's bookings


// DOM elements
const bookingForm = document.getElementById('bookingForm');
const bookingStatus = document.getElementById('bookingStatus');
const myBookingsTable = document.getElementById('myBookingsTable').getElementsByTagName('tbody')[0];
const labCardsDiv = document.getElementById('labCards');


// Helper: Format date for display
function formatDate(dt) {
    return new Date(dt).toLocaleString();
}

// Render lab status cards (Green, Yellow, Red)
async function renderLabCards() {
    try {
        const res = await fetch('/api/admin/labs');
        const labs = await res.json();
        labCardsDiv.innerHTML = '';
        labs.forEach(lab => {
            const card = document.createElement('div');
            card.className = `lab-card lab-${lab.name.toLowerCase()}`;
            card.innerHTML = `
                <div class="lab-card-header">${lab.name} Lab</div>
                <div class="lab-card-status status-${lab.status.toLowerCase()}">
                    Status: <b>${lab.status}</b>
                </div>
                <div class="lab-card-booking">
                    ${lab.currentBooking ? `<span>Team: <b>${lab.currentBooking.teamName}</b><br>Time: ${formatDate(lab.currentBooking.startTime)} - ${formatDate(lab.currentBooking.endTime)}</span>` : '<span>No current booking</span>'}
                </div>
            `;
            labCardsDiv.appendChild(card);
        });
    } catch (err) {
        labCardsDiv.innerHTML = '<div style="color:red">Error loading lab status.</div>';
    }
}


// Submit booking form
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const teamName = bookingForm.teamName.value.trim();
    const lab = bookingForm.lab.value;
    const startTime = bookingForm.startTime.value;
    const endTime = bookingForm.endTime.value;

    // Basic validation
    if (!teamName || !lab || !startTime || !endTime) {
        showBookingStatus('Please fill all fields.', false);
        return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
        showBookingStatus('End time must be after start time.', false);
        return;
    }

    // Send booking request to backend
    try {
        const res = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teamName, lab, startTime, endTime })
        });
        const data = await res.json();
        if (res.ok) {
            showBookingStatus('Booking successful!', true);
            loadMyBookings(teamName);
            renderLabCards();
        } else {
            showBookingStatus(data.message || 'Booking failed.', false);
        }
    } catch (err) {
        showBookingStatus('Error connecting to server.', false);
    }
});

// Show booking status message (success/error)
function showBookingStatus(msg, success) {
    bookingStatus.textContent = msg;
    bookingStatus.style.color = success ? '#00ffe7' : '#ff0044';
    bookingStatus.style.fontWeight = 'bold';
    bookingStatus.style.marginTop = '10px';
}


// Load bookings for this team and render in table
async function loadMyBookings(teamName) {
    myBookingsTable.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
    try {
        const res = await fetch('/api/bookings');
        const bookings = await res.json();
        myBookingsTable.innerHTML = '';
        const filtered = bookings.filter(b => b.teamName === bookingForm.teamName.value.trim());
        if (!filtered.length) {
            myBookingsTable.innerHTML = '<tr><td colspan="4">No bookings found.</td></tr>';
            return;
        }
        filtered.forEach(b => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${b.lab}</td>
                <td>${formatDate(b.startTime)}</td>
                <td>${formatDate(b.endTime)}</td>
                <td>${b.status}</td>
            `;
            myBookingsTable.appendChild(row);
        });
    } catch (err) {
        myBookingsTable.innerHTML = '<tr><td colspan="4">Error loading bookings.</td></tr>';
    }
}


// Reload bookings and lab cards when team name changes
bookingForm.teamName.addEventListener('input', () => {
    const teamName = bookingForm.teamName.value.trim();
    if (teamName) {
        loadMyBookings(teamName);
        renderLabCards();
    }
});

// Initial load
renderLabCards();
if (bookingForm.teamName.value.trim()) {
    loadMyBookings(bookingForm.teamName.value.trim());
}
