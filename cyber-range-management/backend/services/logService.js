// Log Service
// Stores audit logs in memory and writes to file

const fs = require('fs');
const path = require('path');
const LOG_PATH = path.join(__dirname, '../../logs/activity.log');

const logs = [];

function logAction(action) {
    const entry = `[${new Date().toLocaleString()}] ${action}`;
    logs.push(entry);
    // Write to file (append)
    fs.appendFile(LOG_PATH, entry + '\n', err => {
        if (err) console.error('Log write error:', err);
    });
}

function getLogs() {
    return logs.slice(-100); // Last 100 actions
}

module.exports = {
    logAction,
    getLogs
};
