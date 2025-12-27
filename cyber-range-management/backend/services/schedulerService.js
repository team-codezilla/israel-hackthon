// Scheduler Service
// Core logic for booking, conflict detection, lab lifecycle, auto-clean

const store = require('../data/store');
const mockProxmoxService = require('./mockProxmoxService');
const logService = require('./logService');

// Booking status: Available → Booked → Cleaning → Available
const LABS = ['Green', 'Yellow', 'Red'];

function createBooking(teamName, lab, startTime, endTime) {
    // Validate input
    const s = new Date(startTime);
    const e = new Date(endTime);
    if (isNaN(s) || isNaN(e)) return { success: false, message: 'Invalid date/time.' };
    if (s < new Date()) return { success: false, message: 'Start time must be in the future.' };
    if (s >= e) return { success: false, message: 'End time must be after start time.' };
    if (!LABS.includes(lab)) return { success: false, message: 'Invalid lab.' };
    // Check lab exists in store
    const labObj = store.labs.find(l => l.name === lab);
    if (!labObj) return { success: false, message: 'Lab not found.' };
    // Prevent overlapping bookings for the same lab
    for (const b of store.bookings) {
        if (b.lab === lab && (b.status === 'Booked' || b.status === 'Cleaning')) {
            const bs = new Date(b.startTime);
            const be = new Date(b.endTime);
            // Overlap if (start < existing end) && (end > existing start)
            if ((s < be) && (e > bs)) {
                return { success: false, message: 'Time slot conflict: Lab already booked or cleaning.' };
            }
        }
    }
    // Create booking
    const booking = {
        id: store.bookings.length + 1,
        teamName,
        lab,
        startTime,
        endTime,
        status: 'Booked'
    };
    store.bookings.push(booking);
    // Update lab status
    labObj.status = 'Booked';
    labObj.currentBooking = booking;
    // Schedule auto-expiry and clean
    const msUntilEnd = e - Date.now();
    if (msUntilEnd > 0) {
        setTimeout(() => expireBooking(booking), msUntilEnd);
    } else {
        // If booking is in the past, expire immediately (should not happen)
        expireBooking(booking);
    }
    console.log(`[BOOKING] Team '${teamName}' booked ${lab} from ${s.toLocaleString()} to ${e.toLocaleString()}`);
    return { success: true, booking };
}

function expireBooking(booking) {
    // Mark booking as expired, start cleaning
    booking.status = 'Cleaning';
    const labObj = store.labs.find(l => l.name === booking.lab);
    if (labObj) {
        labObj.status = 'Cleaning';
        labObj.currentBooking = booking;
    }
    logService.logAction(`Booking expired: ${booking.lab} cleaning started.`);
    console.log(`[CLEANING] Lab ${booking.lab} cleaning started (auto-reset)`);
    mockProxmoxService.simulateReset(booking.lab);
    // Simulate cleaning duration (e.g., 5 seconds)
    setTimeout(() => {
        booking.status = 'Completed';
        if (labObj) {
            labObj.status = 'Available';
            labObj.currentBooking = null;
        }
        logService.logAction(`Lab ${booking.lab} cleaned and available.`);
        console.log(`[AVAILABLE] Lab ${booking.lab} is now available.`);
    }, 5000);
}

function getAllBookings() {
    return store.bookings;
}

function getLabStatus() {
    // Add utilization stats (hours booked)
    return store.labs.map(lab => {
        const utilization = store.bookings
            .filter(b => b.lab === lab.name && b.status === 'Booked')
            .reduce((sum, b) => sum + ((new Date(b.endTime) - new Date(b.startTime)) / 3600000), 0);
        return {
            name: lab.name,
            status: lab.status,
            currentBooking: lab.currentBooking,
            utilization: Math.round(utilization * 100) / 100
        };
    });
}

function forceResetLab(labName) {
    const labObj = store.labs.find(l => l.name === labName);
    if (!labObj) return { success: false, message: 'Lab not found.' };
    // Cancel any current booking for this lab
    if (labObj.currentBooking && labObj.currentBooking.status === 'Booked') {
        labObj.currentBooking.status = 'Cancelled';
    }
    labObj.status = 'Cleaning';
    labObj.currentBooking = null;
    logService.logAction(`Force reset started for ${labName}`);
    console.log(`[FORCE RESET] Lab ${labName} cleaning started (admin reset)`);
    setTimeout(() => {
        labObj.status = 'Available';
        logService.logAction(`Lab ${labName} force reset and available.`);
        console.log(`[AVAILABLE] Lab ${labName} is now available (after force reset).`);
    }, 5000);
    return { success: true };
}

module.exports = {
    createBooking,
    getAllBookings,
    getLabStatus,
    forceResetLab
};
