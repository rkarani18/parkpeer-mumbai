# ParkPeer Mumbai 🚗🏢
> **Peer-to-Peer Fractional Parking Marketplace for Gated Societies in Mumbai**  
> *(The "Airbnb for Private Residential Parking")*

[![React 19](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js Express](https://img.shields.io/badge/Backend-Node.js_+_Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB_+_Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet_+_React--Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Open Source](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-rkarani18-orange.svg)](https://github.com/rkarani18)

---

## 📌 Problem & Concept

Mumbai suffers from severe street congestion, predatory towing, and a chronic shortage of commercial parking spaces around key venues, corporate hubs, and cultural auditoriums. Meanwhile, thousands of residential flat owners in gated societies leave their designated parking slots empty all day while they are away at work.

**ParkPeer** bridges this gap:
- Flat owners monetize idle parking bays during office hours (Mon–Fri, 9 AM – 6 PM) for **passive monthly income**.
- Daily commuters and visitors find guaranteed, secure, affordable parking (**₹100 – ₹180/day pass**) right next to their destinations.
- Society security guards effortlessly verify visitors via **dynamic digital QR passes** without cumbersome paper gate registers.

---

## 🌟 Core Features & Views

### 1. 🔍 Mumbai-Wide Landmark & Destination Search Engine
- **Search Any Venue**: Type anywhere in Mumbai—e.g. **Shanmukhananda Hall**, **Jio World Centre**, **NCPA Nariman Point**, **Phoenix Palladium**, **Tata Memorial Hospital**, **Bandra Kurla Complex (BKC)**, etc.
- **Auto-Radius Proximity Matching**: Instantly computes straight-line distance, walking time (`🚶 X min walk`), and driving time (`🚗 X min drive`) to all neighboring residential parking spots.
- **OpenStreetMap Nominatim Integration**: When an unlisted Mumbai landmark or street address is searched, the engine falls back to live geocoding across Greater Mumbai.
- **Radius Filters**: Switch between **1 km**, **3 km**, **5 km**, and **10 km** search radiuses.

### 2. 🗺️ Interactive Map & Navigation
- **Interactive Leaflet Map**: Custom dynamic price badge pins (`₹120/day`, `₹150/day`), walking duration labels, destination target pin, and walking radius circles.
- **Turn-by-Turn Google Maps Navigation**: Every parking spot card and digital pass includes a **"Navigate to Spot"** button that opens Google Maps navigation directly to the verified coordinates and society address.

### 3. 📸 Mandatory Parking Spot Photos
- Every listing requires verified parking spot photos showing the exact bay, stilt/basement access, and society gate so drivers know exactly where to park.
- Hosts can select high-resolution presets (Covered Stilt Bay, Secure Basement Parking, Society Open Podium, Covered Stilt with 15A EV Socket) or upload their own image URLs.

### 4. 💰 Affordable Fair Daily Pricing
- Designed specifically for Mumbai commuters: fair flat-rate daily passes capped at **₹100 – ₹200/day** (or ~₹18–₹25/hr), replacing exorbitant street parking fees.

### 5. 🏠 Host View (Flat Owner Listing & Map Pin Dropper)
- **Interactive Map Pin Dropper**: Flat owners can click anywhere on the Mumbai map or use GPS geolocation to pinpoint their society's exact gate entrance coordinates.
- **Passive Income Simulator**: Real-time monthly earnings calculator based on daily rate and availability windows (e.g., ₹150/day × 22 work days = **₹3,300/month per slot**).
- **Listing Management**: Specify flat/tower number, parking slot number, spot type (*Covered*, *Basement*, *Stilt*, *Podium*), society rules, and security amenities.

### 6. 🤝 The Handshake (Dynamic Digital QR Gate Pass)
- **High-Contrast Digital Gate Pass**: Instant mobile-ready pass formatted for Mumbai society security checkpoints.
- **Dynamic QR Code**: Generated via `qrcode.react` with cryptographic verification payloads.
- **Indian Vehicle Plate Ribbon**: Distinctive Indian registration badge styling (`[IND] MH 01 DK 4521`).
- **Live Status Tracking**: Automatically transitions between `READY AT GATE`, `CHECKED IN (Parked)`, and `COMPLETED`.

### 7. 🛡️ Guard View (Security Gate Booth Scanner)
- **Live Camera QR Scanner**: Built using `html5-qrcode` to scan incoming driver QR passes at the boom barrier.
- **One-Click Quick Demo Scan**: Instant test button for demo pass `PARK-BKC-7842`.
- **Tactile Gate Controls**:
  - `✅ PERMIT ENTRY & RAISE BOOM BARRIER` -> Checks in driver and timestamps gate entry.
  - `🚗 RECORD VEHICLE EXIT & FREE SPOT` -> Marks session completed and frees slot.
- **Real-Time Security Audit Log**: Live feed of vehicles permitted entry and exited.

---

## 🛠️ Tech Stack Architecture

```
┌────────────────────────────────────────────────────────┐
│                   ParkPeer Mumbai                     │
├──────────────────────────┬─────────────────────────────┤
│ Frontend (Vite + React)  │ Backend (Node + Express)    │
│ • React 19               │ • Express.js (ES Modules)   │
│ • Tailwind CSS v4        │ • MongoDB + Mongoose        │
│ • React Router DOM v7    │ • Haversine Proximity Calc  │
│ • Leaflet / React-Leaflet│ • Nominatim Geocoding API   │
│ • html5-qrcode           │ • CORS & Morgan Logger      │
│ • qrcode.react           │                             │
└──────────────────────────┴─────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [MongoDB](https://www.mongodb.com/) (running locally on `mongodb://127.0.0.1:27017` or via MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/rkarani18/parkpeer-mumbai.git
cd parkpeer-mumbai
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env     # or edit .env with your MongoDB URI
npm run seed             # Seeds 24+ Mumbai spots (including Sion, Matunga, BKC, etc.)
npm start                # Starts backend server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev              # Starts Vite dev server on http://localhost:5173
```

Open your browser at `http://localhost:5173`.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/spots` | List all spots with optional filters (locality, price, query) |
| `GET` | `/api/spots/destinations?q=:query` | Autocomplete search for Mumbai landmarks with coordinates |
| `GET` | `/api/spots/near?lat=:lat&lng=:lng&radiusKm=:r` | Find spots near destination with walking & driving minutes |
| `GET` | `/api/spots/localities` | List supported Mumbai localities |
| `GET` | `/api/spots/:id` | Get full details of a specific parking spot |
| `POST` | `/api/spots` | Create a new parking spot listing |
| `DELETE` | `/api/spots/:id` | Delete a parking spot listing |
| `POST` | `/api/bookings` | Book a parking slot and generate dynamic QR pass |
| `GET` | `/api/bookings` | List all bookings |
| `GET` | `/api/bookings/:id` | Fetch specific booking pass details |
| `GET` | `/api/bookings/verify/:code` | Guard verification of QR code payload |
| `POST` | `/api/bookings/:id/checkin` | Guard permits entry and raises boom barrier |
| `POST` | `/api/bookings/:id/checkout` | Guard records vehicle exit |
| `POST` | `/api/seed/reset` | Resets and reseeds database with fresh Mumbai data |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - open-source for community development.

## 👤 Author

Developed by **Rishabh Karani** ([@rkarani18](https://github.com/rkarani18))
