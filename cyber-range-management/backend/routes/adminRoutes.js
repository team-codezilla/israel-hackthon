// Admin Routes
// Handles admin dashboard actions

const express = require('express');
const router = express.Router();
const schedulerService = require('../services/schedulerService');
const mockProxmoxService = require('../services/mockProxmoxService');
const logService = require('../services/logService');

// GET /api/admin/labs - Get lab status and utilization
router.get('/labs', (req, res) => {
    const labs = schedulerService.getLabStatus();
    res.json(labs);
});

// POST /api/admin/reset-lab - Force reset a lab
router.post('/reset-lab', (req, res) => {
    const { lab } = req.body;
    if (!lab) return res.status(400).json({ message: 'Lab name required.' });
    const result = schedulerService.forceResetLab(lab);
    if (result.success) {
        mockProxmoxService.simulateReset(lab);
        logService.logAction(`Admin forced reset of ${lab}`);
        res.json({ message: `Lab ${lab} reset.` });
    } else {
        res.status(404).json({ message: result.message });
    }
});

// GET /api/admin/audit-log - Get audit log
router.get('/audit-log', (req, res) => {
    res.json(logService.getLogs());
});

module.exports = router;
