# Cyber Range Management System (CRMS)

## Overview
A full-stack system to manage cybersecurity training labs, schedule bookings, auto-reset environments, and provide admin/audit visibility. All infrastructure actions are simulated for demo purposes.

## Features
- Team registration and lab booking (no login required)
- Lab lifecycle: Available → Booked → Cleaning → Available
- Time-slot conflict detection and prevention
- Auto-expiry and simulated lab reset
- Admin dashboard: view labs, force reset, utilization stats
- Audit log of all actions (file + memory)
- Mock infrastructure layer (simulated Proxmox API)

## Tech Stack
- **Frontend:** HTML, CSS (dark cyber theme), JavaScript, Chart.js
- **Backend:** Node.js, Express, modular structure
- **Database:** In-memory (easy to swap for real DB)

## Project Structure
```
cyber-range-management/
│
├── frontend/
│   ├── index.html        (user booking)
│   ├── admin.html        (admin dashboard)
│   ├── css/style.css
│   ├── js/app.js
│   └── js/admin.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── bookingRoutes.js
│   │   ├── adminRoutes.js
│   │   └── labRoutes.js
│   ├── services/
│   │   ├── schedulerService.js
│   │   ├── mockProxmoxService.js
│   │   └── logService.js
│   └── data/
│       └── store.js
│
├── logs/
│   └── activity.log
│
└── README.md
```

## How to Run (Backend)
1. Open terminal in `cyber-range-management/backend`
2. Run:
   ```
   npm install express
   node server.js
   ```
3. Backend runs at [http://localhost:3000](http://localhost:3000)

## How Frontend Connects to Backend
- All frontend pages (`index.html`, `admin.html`) use JavaScript `fetch()` to call backend REST APIs.
- No authentication required for demo.
- Open `index.html` for user booking, `admin.html` for admin dashboard.

## API Endpoints
### User APIs
- `POST /api/bookings` — Create a booking
- `GET /api/bookings` — List all bookings

### Admin APIs
- `GET /api/admin/labs` — Get lab status and utilization
- `POST /api/admin/reset-lab` — Force reset a lab
- `GET /api/admin/audit-log` — Get audit log

## Notes
- All infrastructure actions are simulated (see `mockProxmoxService.js`).
- To add a real database, replace `store.js` logic.
- For hackathon demo, all code is well-commented and modular.

---
**For questions or demo, open both frontend HTML files in browser and run backend server.**
