// Booking Routes
// Handles user booking creation and retrieval

const express = require('express');
const router = express.Router();
const schedulerService = require('../services/schedulerService');
const logService = require('../services/logService');

// POST /api/bookings - Create a booking
router.post('/', (req, res) => {
    const { teamName, lab, startTime, endTime } = req.body;
    // Validate input
    if (!teamName || !lab || !startTime || !endTime) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }
    // Try to create booking
    const result = schedulerService.createBooking(teamName, lab, startTime, endTime);
    if (result.success) {
        logService.logAction(`Booking created: Team ${teamName} booked ${lab} from ${startTime} to ${endTime}`);
        return res.status(201).json(result.booking);
    } else {
        return res.status(409).json({ message: result.message });
    }
});

// GET /api/bookings - List all bookings
router.get('/', (req, res) => {
    const bookings = schedulerService.getAllBookings();
    res.json(bookings);
});

module.exports = router;
