import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  Car,
  Phone,
  User,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Navigation,
  Camera,
} from 'lucide-react';
import { api } from '../services/api';

export const BookingPassPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooking = async () => {
    try {
      setRefreshing(true);
      const res = await api.getBookingById(id);
      if (res.success && res.data) {
        setBooking(res.data);
      } else {
        throw new Error(res.message || 'Booking not found');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to load booking');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooking();
    const interval = setInterval(fetchBooking, 8000);
    return () => clearInterval(interval);
  }, [id]);

  const copyCode = () => {
    if (booking?.verificationCode) {
      navigator.clipboard.writeText(booking.verificationCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Generating your dynamic society pass...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Gate Pass Not Found</h2>
        <p className="text-slate-600 text-sm mb-6">{error || 'This booking ID could not be loaded.'}</p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm"
        >
          Return to Spot Search
        </Link>
      </div>
    );
  }

  const {
    spotDetails,
    spot,
    driverName,
    driverPhone,
    vehicleNumber,
    vehicleModel,
    bookingDate,
    startTime,
    endTime,
    status,
    verificationCode,
    qrPayload,
    totalAmount,
    checkInTime,
  } = booking;

  const isCheckedIn = status === 'CHECKED_IN';
  const isCompleted = status === 'COMPLETED';

  // Extract coordinates for Google Maps
  const lat = spotDetails?.latitude || spot?.latitude;
  const lng = spotDetails?.longitude || spot?.longitude;
  const googleMapsUrl =
    lat && lng
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
          (spotDetails?.societyName || '') + ', ' + (spotDetails?.address || '')
        )}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          (spotDetails?.societyName || '') + ', ' + (spotDetails?.address || '') + ', Mumbai'
        )}`;

  // Spot photo
  const spotImage =
    spotDetails?.images?.[0] ||
    spot?.images?.[0] ||
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200/80 py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Map</span>
          </Link>

          <button
            onClick={fetchBooking}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 transition-colors"
            title="Refresh status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span>Live Sync</span>
          </button>
        </div>

        {/* Official Society Gate Pass Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left relative">
          {/* Top Pass Header */}
          <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full text-white">
                  MUMBAI SOCIETY VISITOR GATE PASS
                </span>
                <h1 className="text-xl font-black mt-2 tracking-tight">
                  {spotDetails?.societyName}
                </h1>
                <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span>{spotDetails?.area}, Mumbai</span>
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-right shrink-0">
                {isCheckedIn ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    CHECKED IN
                  </span>
                ) : isCompleted ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-500 text-white">
                    COMPLETED
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-400 text-slate-900 animate-pulse">
                    READY AT GATE
                  </span>
                )}
              </div>
            </div>

            {/* Allocated Spot Highlight */}
            <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-200 uppercase tracking-wider block font-semibold">
                  ALLOCATED SPOT
                </span>
                <span className="text-lg font-black text-white">
                  {spotDetails?.spotNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-blue-200 uppercase tracking-wider block font-semibold">
                  RESIDENT FLAT
                </span>
                <span className="text-sm font-bold text-white">
                  {spotDetails?.flatNumber}
                </span>
              </div>
            </div>
          </div>

          {/* TURN-BY-TURN GOOGLE MAPS NAVIGATION BANNER */}
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-emerald-900 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold block text-slate-900 leading-tight">
                  Driving to this society?
                </span>
                <span className="text-[11px] text-slate-500">
                  Turn-by-turn spoken GPS directions
                </span>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <span>Start Navigation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Dynamic QR Code Section */}
          <div className="p-6 text-center border-b border-dashed border-slate-200 relative bg-slate-50/50">
            <div className="inline-block p-4 bg-white rounded-3xl shadow-md border-2 border-slate-900/10 mb-3 relative group">
              <QRCodeSVG
                value={qrPayload || verificationCode}
                size={180}
                level="H"
                includeMargin={true}
                className="mx-auto rounded-xl"
              />
              <div className="text-[10px] text-slate-400 font-mono mt-1 font-semibold">
                SCAN AT SECURITY BOOM BARRIER
              </div>
            </div>

            {/* Verification Code Box */}
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-medium">Pass Code:</span>
              <span className="font-mono font-black text-base text-slate-900 tracking-wider bg-slate-200 px-2 py-0.5 rounded-lg">
                {verificationCode}
              </span>
              <button
                onClick={copyCode}
                className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                title="Copy Code"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            {copied && (
              <span className="text-[11px] font-semibold text-emerald-600 block mt-1">
                Copied to clipboard!
              </span>
            )}
          </div>

          {/* Vehicle Plate Ribbon (Indian Style Plate) */}
          <div className="px-6 py-3 bg-amber-50 border-y border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 px-1.5 bg-blue-700 rounded text-white flex flex-col items-center justify-center leading-none">
                <span className="text-[7px] font-bold">IND</span>
              </div>
              <div>
                <span className="font-mono font-black text-lg tracking-widest text-slate-900">
                  {vehicleNumber}
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  {vehicleModel || 'Vehicle Pass'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Total Paid
              </span>
              <span className="text-base font-extrabold text-slate-900">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          {/* Compulsory Parking Spot Photo Recognition */}
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Spot Photo (Look for this Bay):</span>
              </span>
              <span className="text-[10px] font-bold text-blue-600">
                Bay {spotDetails?.spotNumber}
              </span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-slate-300 shadow-sm h-36">
              <img
                src={spotImage}
                alt="Parking Spot Bay"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-white">
                Spot: {spotDetails?.spotNumber} (Flat {spotDetails?.flatNumber})
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 space-y-3 text-xs text-slate-600">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                  Driver Name
                </span>
                <span className="font-bold text-slate-800 text-sm">{driverName}</span>
                <span className="text-[11px] text-slate-500 block">{driverPhone}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                  Valid Slot Time
                </span>
                <span className="font-bold text-slate-800 text-sm">
                  {startTime} - {endTime}
                </span>
                <span className="text-[11px] text-slate-500 block">{bookingDate}</span>
              </div>
            </div>

            {/* Resident Host Information */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
              <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">
                Society Host & Flat Owner
              </span>
              <div className="flex items-center justify-between mt-1 text-slate-800">
                <div>
                  <span className="font-semibold">{spotDetails?.hostName}</span>
                  <span className="text-[11px] text-slate-500 block">
                    Flat {spotDetails?.flatNumber}
                  </span>
                </div>
                <a
                  href={`tel:${spotDetails?.hostPhone}`}
                  className="px-2.5 py-1 bg-white text-blue-600 font-semibold rounded-lg border border-blue-200 text-xs shadow-xs hover:bg-blue-50 transition-colors"
                >
                  Call Host
                </a>
              </div>
            </div>

            {/* Security Entry Instructions */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                Gate Entry Instructions
              </span>
              <p className="text-slate-700 text-xs leading-relaxed">
                {spotDetails?.entryInstructions ||
                  'Show this QR code at the main security booth. Security guard will scan and raise the barrier.'}
              </p>
            </div>

            {checkInTime && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Checked in at{' '}
                  <strong>{new Date(checkInTime).toLocaleTimeString('en-IN')}</strong> by gate security.
                </span>
              </div>
            )}
          </div>

          {/* Pass Footer / Quick Actions */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 space-y-2">
            <Link
              to={`/guard?code=${verificationCode}`}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Simulate Guard Gate Scan (Open Guard View)</span>
            </Link>

            <Link
              to="/"
              className="block w-full py-2 text-center text-xs text-slate-600 hover:text-slate-900 font-semibold"
            >
              Book Another Parking Spot
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
