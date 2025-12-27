// Cyber Range Management System Backend
// Main Express server entry point
// All infrastructure actions are simulated (mocked)

const express = require('express');
const path = require('path');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const labRoutes = require('./routes/labRoutes');
const logService = require('./services/logService');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/labs', labRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
});

// Start server
app.listen(PORT, () => {
    logService.logAction(`Server started on port ${PORT}`);
    console.log(`CRMS backend running on http://localhost:${PORT}`);
});

/*
In-memory DB is used for demo. To add a real DB, replace store.js with DB logic.
*/
