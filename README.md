# 💧 SafeWater Tracker — SDG 6

**SafeWater Tracker** is a MERN web app to track household water usage, provide NGO/admin dashboards, and detect water shortage risk.

## Live (example)
Frontend: https://safewater-tracker.vercel.app  
Backend:  https://safewater-tracker.onrender.com

## Features
- Role-based auth: household / NGO / admin (JWT)
- Daily water logging
- Google Maps SafeStations
- Charts (Chart.js)
- Alerts when region 7-day average < threshold
- Deployed: Render (backend) + Vercel (frontend)

## Tech
Frontend: React, Tailwind (optional), Chart.js, Google Maps  
Backend: Node.js, Express, MongoDB Atlas, JWT

## Run locally
1. Backend
   - `cd server`
   - create `.env` with `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`
   - `npm install`
   - `npm run dev`
2. Frontend
   - `cd client`
   - create `.env` with `REACT_APP_API_URL`, `REACT_APP_GOOGLE_MAPS_KEY`
   - `npm install`
   - `npm start`

## Notes for demo
- Create three users (roles: household, ngo, admin) via `/register`.
- Log usage (POST /api/water) and show AdminPanel alerts.
