// Mock Proxmox Service
// Simulates infrastructure actions (VM reset, etc.)

function simulateReset(labName) {
    console.log(`Simulating Proxmox API call to reset ${labName}... Success`);
}

module.exports = {
    simulateReset
};
