# 🛡️ Cyber Range Management System (CRMS)

## 📌 Project Overview
Cyber Range Management System (CRMS) is a full-stack web application designed to manage and schedule shared cybersecurity labs (Green, Yellow, Red) used by multiple teams.

It automates lab booking, prevents conflicts, and resets labs after usage.

This project is built for hackathons, academic demos, and learning full-stack system design.

## ❗ Problem Statement
Cybersecurity training centers face challenges such as:
- Limited number of cyber labs
- Multiple teams requesting labs simultaneously
- Manual booking causing conflicts
- No automatic lab cleanup
- No admin visibility or audit tracking

## ✅ Solution
CRMS solves this by providing:
- A team booking system for cyber labs
- Time-based scheduling with conflict prevention
- Automatic lab cleanup after usage
- Admin dashboard for monitoring and control
- Audit logs for system actions

> All infrastructure actions (VM creation, reset) are simulated (mocked).

## 🔄 Lab Lifecycle
Available → Booked → Cleaning → Available

## 👥 Features

### 👤 User Features
- Book a cyber lab (Green / Yellow / Red)
- Select start and end time
- View booking status in real time
- See automatic status updates

### 🧑‍💼 Admin Features
- View all bookings
- View lab status dashboard
- Force reset a lab
- Monitor lab usage
- Track system activity logs

## 🧠 Automation Logic
- Prevents overlapping bookings
- Automatically triggers cleanup after booking ends
- Simulates infrastructure reset
- Logs all important actions

## 🛠️ Tech Stack
**Frontend**
- HTML
- CSS (modern dark cyber theme)
- JavaScript

**Backend**
- Node.js
- Express.js
- REST APIs

**Data Handling**
- In-memory storage (extendable to database)

**Infrastructure**
- Mocked Proxmox / VM operations

## 🌐 Live Demo
https://team-codezilla.github.io/israel-hackthon/

## 📁 Project Structure
cyber-range-management/
├── frontend/
├── backend/
├── logs/
└── README.md

