import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  QrCode,
  ShieldCheck,
  Calendar,
  Clock,
  Car,
  MapPin,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';

export const DriverBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.getBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              My Society QR Gate Passes
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your dynamic QR codes to scan at society security gates
            </p>
          </div>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            Loading your gate passes...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 bg-white rounded-3xl border border-slate-200 text-center p-6 max-w-md mx-auto">
            <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Passes Yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Book a residential society parking slot near your office in BKC or Lower Parel.
            </p>
            <Link
              to="/"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Search Available Spots
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => {
              const isCheckedIn = booking.status === 'CHECKED_IN';
              const isCompleted = booking.status === 'COMPLETED';

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Status ribbon */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">
                      {booking.spotDetails?.area || 'Mumbai'}
                    </span>

                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isCheckedIn
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCompleted
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isCheckedIn ? 'PARKED' : booking.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {booking.spotDetails?.societyName}
                    </h3>
                    <div className="text-xs text-slate-600 mt-0.5">
                      Spot <strong className="text-slate-800">{booking.spotDetails?.spotNumber}</strong> • Flat {booking.spotDetails?.flatNumber}
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                        <Car className="w-3.5 h-3.5 text-blue-600" />
                        <span>{booking.vehicleNumber}</span>
                      </div>
                      <span className="text-slate-400">•</span>
                      <span>₹{booking.totalAmount}</span>
                    </div>

                    <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {booking.bookingDate} ({booking.startTime} - {booking.endTime})
                      </span>
                    </div>
                  </div>

                  {/* Pass code & View button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {booking.verificationCode}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/booking-pass/${booking._id}`}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>View QR Pass</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

