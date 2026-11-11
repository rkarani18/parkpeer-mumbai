# ParkPeer Mumbai 🚗🏢
> **Peer-to-Peer Fractional Parking Marketplace for Gated Societies in Mumbai**
> *(The "Airbnb for Private Residential Parking")*

ParkPeer allows flat owners in Mumbai's gated societies (in commercial hubs like BKC, Lower Parel, Nariman Point, Andheri East, and Powai) to monetize their empty parking slots during office hours (Mon-Fri, 9 AM - 6 PM) by renting them to commercial drivers and corporate professionals.

---

## 🌟 Core Features & Views

### 1. 🚗 Driver View (Map & List Search)
- **Interactive Leaflet Map**: Mumbai map centered around key business districts with custom interactive price badge pins (`₹90/hr`, `₹110/hr`, `₹120/hr`).
- **Commercial Hub Filters**: Quick filter by **BKC**, **Lower Parel**, **Nariman Point**, **Andheri East**, **Powai**, or all Mumbai.
- **Search & Price Range**: Search by society name, landmark, or street address; filter with an interactive price slider.
- **Slot Reservation**: Driver selects date, arrival/departure time, enters driver details and vehicle registration plate (e.g., `MH 01 DK 4521`).
- **Instant Gate Pass Generation**: Automatically creates booking, generates dynamic QR code & security verification code.

### 2. 🏠 Host View (Flat Owner Dashboard)
- **Passive Income Simulator**: Real-time monthly earnings calculator based on hourly rate, work hours, and availability days (e.g. ₹90/hr × 8 hrs × 22 days = **₹15,840/month passive income**).
- **List Spot Form**: Flat owners specify:
  - Society / Apartment Name (e.g., *Kalpataru Sparkle*, *Lodha Bellissimo*, *Rustomjee Seasons*)
  - Flat / Tower Number (e.g., *Tower B - 1402*)
  - Parking Spot Number / Bay (e.g., *B1 - Slot 38*)
  - Spot Type (*Covered*, *Basement*, *Stilt*, *Open*)
  - Hub Area & Address
  - Availability Windows (Day toggles: Mon-Fri, Sat, Sun; Start & End times)
  - Hourly Rate in INR (₹)
  - Amenities (*24/7 Security Guard*, *CCTV Surveillance*, *Covered Roof*, *EV Charging 15A*, *Boom Barrier*)
  - Guard Entry Instructions
- **Manage Listings**: View active spots and delete or toggle availability.

### 3. 🤝 The Handshake (Dynamic QR System)
- **Official Digital Gate Pass**: High-contrast, mobile-first visitor pass formatted for Mumbai society security.
- **Dynamic QR Code**: Rendered via `qrcode.react`, containing dynamic encrypted payload.
- **High-Visibility Vehicle Plate**: Indian-style registration ribbon (`[IND] MH 01 DK 4521`).
- **Pass Details**: Allocated spot number, resident flat number, host phone number, and scheduled hours.
- **Live Syncing Status**: Automatically updates in real time between `READY AT GATE`, `CHECKED IN (Parked)`, and `COMPLETED`.

### 4. 🛡️ Guard View (Security Gate Booth Scanner)
- **Camera QR Scanner**: Real-time camera scanner powered by `html5-qrcode` to scan driver passes at the boom barrier.
- **1-Click Quick Demo Scan**: Test instantly with demo code `PARK-BKC-7842` without needing camera permissions.
- **Manual Code / Plate Lookup**: Guards can search by pass code or vehicle plate.
- **Tactile Gate Controls**:
  - `✅ PERMIT ENTRY & RAISE BOOM BARRIER` -> Checks in driver and logs timestamp.
  - `🚗 RECORD VEHICLE EXIT & FREE SPOT` -> Marks parking session completed.
- **Today's Gate Log**: Audit trail of vehicles admitted and exited through the gate.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 + Vite
  - Tailwind CSS v4
  - React Router DOM v7
  - Leaflet & React-Leaflet
  - `qrcode.react`
  - `html5-qrcode`
  - Lucide React Icons
- **Backend**:
  - Node.js + Express (ES Modules)
  - MongoDB + Mongoose (Indexes, Schemas, Validations)
  - CORS, Morgan, Dotenv
- **Database**:
  - MongoDB (`mumbai_parking_db` on `127.0.0.1:27017`)

---

## 🚀 Running the Project

### 1. Backend Server
```bash
cd backend
npm install
npm run seed     # Seeds realistic Mumbai spots & demo booking
npm start        # Runs on http://localhost:5000
```

### 2. Frontend Server
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/spots` | Fetch available parking spots with area, price, & search filters |
| `GET` | `/api/spots/:id` | Fetch single parking spot details |
| `POST` | `/api/spots` | Host lists a new parking spot |
| `DELETE` | `/api/spots/:id` | Delete a parking spot listing |
| `POST` | `/api/bookings` | Driver books a spot & generates dynamic QR code |
| `GET` | `/api/bookings` | List active / past bookings |
| `GET` | `/api/bookings/:id` | Single booking pass details |
| `GET` | `/api/bookings/verify/:code` | Guard scans or verifies dynamic QR / pass code |
| `POST` | `/api/bookings/:id/checkin` | Guard permits entry & raises barrier |
| `POST` | `/api/bookings/:id/checkout` | Guard records vehicle exit |
| `POST` | `/api/seed/reset` | Resets and reseeds database with fresh Mumbai data |

