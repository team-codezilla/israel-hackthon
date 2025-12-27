// CRMS Admin Dashboard Logic
// Handles lab status, stats, audit log display, and admin actions

// DOM elements
const labCardsDiv = document.getElementById('labCards');
const allBookingsTable = document.getElementById('allBookingsTable').getElementsByTagName('tbody')[0];
const auditLog = document.getElementById('auditLog');
const labStatsChart = document.getElementById('labStatsChart');

// Store labs for card actions
let labsCache = [];


// Render lab status cards (Green, Yellow, Red)
function renderLabCards(labs) {
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
                ${lab.currentBooking ? `<span>Team: <b>${lab.currentBooking.teamName}</b><br>Time: ${new Date(lab.currentBooking.startTime).toLocaleString()} - ${new Date(lab.currentBooking.endTime).toLocaleString()}</span>` : '<span>No current booking</span>'}
            </div>
            <button class="force-reset-btn" onclick="resetLab('${lab.name}')">Force Reset</button>
        `;
        labCardsDiv.appendChild(card);
    });
}

// Render all bookings in table
function renderAllBookings(bookings) {
    allBookingsTable.innerHTML = '';
    if (!bookings.length) {
        allBookingsTable.innerHTML = '<tr><td colspan="5">No bookings found.</td></tr>';
        return;
    }
    bookings.forEach(b => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${b.lab}</td>
            <td>${b.teamName}</td>
            <td>${new Date(b.startTime).toLocaleString()}</td>
            <td>${new Date(b.endTime).toLocaleString()}</td>
            <td>${b.status}</td>
        `;
        allBookingsTable.appendChild(row);
    });
}

// Load labs and bookings, then render
async function loadDashboard() {
    try {
        // Get labs
        const labsRes = await fetch('/api/admin/labs');
        const labs = await labsRes.json();
        labsCache = labs;
        renderLabCards(labs);
        // Get bookings
        const bookingsRes = await fetch('/api/bookings');
        const bookings = await bookingsRes.json();
        renderAllBookings(bookings);
    } catch (err) {
        labCardsDiv.innerHTML = '<div style="color:red">Error loading dashboard data.</div>';
    }
}

// Expose resetLab globally for card button
window.resetLab = async function(labName) {
    if (!confirm(`Force reset ${labName}?`)) return;
    try {
        const res = await fetch('/api/admin/reset-lab', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lab: labName })
        });
        const data = await res.json();
        alert(data.message || 'Reset complete.');
        loadDashboard();
        loadAuditLog();
    } catch (err) {
        alert('Error resetting lab.');
    }
}

async function loadAuditLog() {
    try {
        const res = await fetch('/api/admin/audit-log');
        const logs = await res.json();
        auditLog.textContent = logs.join('\n');
    } catch (err) {
        auditLog.textContent = 'Error loading audit log.';
    }
}

// Load lab utilization stats (bar chart)
async function loadLabStats() {
    try {
        const res = await fetch('/api/admin/labs');
        const labs = await res.json();
        const labels = labs.map(l => l.name);
        const data = labs.map(l => l.utilization);
        new Chart(labStatsChart, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Lab Utilization (hours)',
                    data,
                    backgroundColor: ['#00ffe7', '#0077ff', '#ff0044'],
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    } catch (err) {
        // Chart error
    }
}

// Initial load
loadDashboard();
loadAuditLog();
loadLabStats();
