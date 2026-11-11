import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Car,
  Phone,
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  QrCode,
  IndianRupee,
} from 'lucide-react';
import { api } from '../services/api';

export const BookingModal = ({ spot, onClose, onBookingSuccess }) => {
  if (!spot) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    driverName: 'Rohan Sharma',
    driverPhone: '+91 98200 45678',
    vehicleNumber: 'MH 02 EE 7821',
    vehicleModel: 'Honda City',
    bookingDate: todayStr,
    startTime: spot.availability?.startTime || '09:00',
    endTime: spot.availability?.endTime || '18:00',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Calculate duration in hours
  const calculateDuration = (start, end) => {
    if (!start || !end) return 1;
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const diff = (endH * 60 + endM) - (startH * 60 + startM);
    if (diff <= 0) return 1;
    return Math.max(1, Math.round((diff / 60) * 10) / 10);
  };

  const durationHours = calculateDuration(formData.startTime, formData.endTime);
  const dailyCap = spot.dailyRate || 150;
  const hourlyRate = spot.hourlyRate || 20;
  const isFullDay = durationHours >= 4;
  const totalAmount = isFullDay ? dailyCap : Math.min(Math.round(durationHours * hourlyRate), dailyCap);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        spotId: spot._id,
        driverName: formData.driverName,
        driverPhone: formData.driverPhone,
        vehicleNumber: formData.vehicleNumber.toUpperCase().trim(),
        vehicleModel: formData.vehicleModel,
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
      };

      const result = await api.createBooking(payload);
      if (result.success && result.data) {
        onBookingSuccess(result.data);
      } else {
        throw new Error(result.message || 'Failed to complete booking');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold uppercase tracking-wider">
              <span>Secure Society Gate Pass</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Book Parking Slot
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spot Summary Banner */}
        <div className="p-3 mx-6 mt-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {spot.images?.[0] && (
              <img
                src={spot.images[0]}
                alt={spot.societyName}
                className="w-16 h-16 rounded-xl object-cover shrink-0 border border-blue-200"
              />
            )}
            <div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-200 text-blue-900 uppercase">
                {spot.area}
              </span>
              <h4 className="font-bold text-slate-900 text-sm leading-tight mt-0.5">
                {spot.societyName}
              </h4>
              <p className="text-xs text-slate-600">
                Spot <span className="font-semibold">{spot.spotNumber}</span> • Flat{' '}
                <span className="font-semibold">{spot.flatNumber}</span>
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-500 block">Day Pass</span>
            <span className="text-lg font-black text-blue-700">₹{spot.dailyRate || 150}</span>
            <span className="text-[10px] text-slate-500 block">or ₹{spot.hourlyRate || 20}/hr</span>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Time & Date Row */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Parking Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={todayStr}
                required
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Arrival Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Departure Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-3 py-2 pl-9 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Driver & Vehicle Details */}
          <div className="pt-2 border-t border-slate-100">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Driver & Vehicle (Required for Security Pass)
            </h5>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Driver Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Sharma"
                      value={formData.driverName}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 12345"
                      value={formData.driverPhone}
                      onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                      className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vehicle Registration Plate
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="MH 01 AB 1234"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 pl-8 rounded-xl border border-slate-300 font-mono font-bold text-sm tracking-wider uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <Car className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Security will verify this plate at gate entry
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Car Model / Make
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hyundai Creta, Honda City"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Calculation Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Duration Window</span>
              <span className="font-semibold text-white">{durationHours} Hours</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Pricing Plan</span>
              <span className="text-emerald-400 font-bold">
                {isFullDay ? `Full Day Pass Capped (Max ₹${dailyCap})` : `₹${hourlyRate}/hr`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-bold block">Total Amount</span>
                <span className="text-[10px] text-slate-400">Fair society rate</span>
              </div>
              <span className="text-2xl font-extrabold text-emerald-400">₹{totalAmount}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Gate Pass & QR Code...
              </span>
            ) : (
              <>
                <QrCode className="w-5 h-5" />
                <span>Confirm Booking & Generate QR Pass</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

