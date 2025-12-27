// In-memory Data Store
// Replace with DB logic for production

// Predefined labs
const labs = [
    { name: 'Green', status: 'Available', currentBooking: null },
    { name: 'Yellow', status: 'Available', currentBooking: null },
    { name: 'Red', status: 'Available', currentBooking: null }
];

// Bookings array
const bookings = [];

module.exports = {
    labs,
    bookings
};
