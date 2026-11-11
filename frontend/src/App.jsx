import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DriverSearchPage } from './pages/DriverSearchPage';
import { HostDashboardPage } from './pages/HostDashboardPage';
import { GuardScannerPage } from './pages/GuardScannerPage';
import { BookingPassPage } from './pages/BookingPassPage';
import { DriverBookingsPage } from './pages/DriverBookingsPage';
import { ShieldCheck, Car, Building2, Heart } from 'lucide-react';

export function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DriverSearchPage />} />
            <Route path="/host" element={<HostDashboardPage />} />
            <Route path="/guard" element={<GuardScannerPage />} />
            <Route path="/booking-pass/:id" element={<BookingPassPage />} />
            <Route path="/my-passes" element={<DriverBookingsPage />} />
          </Routes>
        </main>

        {/* Global Footer & Quick Persona Switcher */}
        <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 text-sm">ParkPeer Mumbai</span>
              <span>•</span>
              <span>Peer-to-Peer Fractional Society Parking</span>
            </div>

            {/* Quick Persona Navigation */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-medium">Quick Role Switch:</span>
              <Link
                to="/"
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-medium text-slate-700 transition-colors"
              >
                Driver View
              </Link>
              <Link
                to="/host"
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-medium text-slate-700 transition-colors"
              >
                Host View
              </Link>
              <Link
                to="/guard"
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 font-bold text-amber-800 border border-amber-200 transition-colors"
              >
                Guard View
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
