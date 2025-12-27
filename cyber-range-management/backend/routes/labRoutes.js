// Lab Routes
// (Optional: For future expansion)
// Currently not used, but ready for lab-specific APIs

const express = require('express');
const router = express.Router();

// Example: GET /api/labs/list
router.get('/list', (req, res) => {
    res.json({ labs: ['Green', 'Yellow', 'Red'] });
});

module.exports = router;
