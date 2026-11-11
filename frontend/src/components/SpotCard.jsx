import React from 'react';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle2,
  Navigation,
  Sparkles,
  ExternalLink,
  Camera,
} from 'lucide-react';

export const SpotCard = ({ spot, isSelected, onSelect, onBook }) => {
  const {
    societyName,
    flatNumber,
    spotNumber,
    spotType,
    vehicleCompatibility,
    area,
    address,
    landmark,
    hourlyRate = 20,
    dailyRate = 150,
    availability,
    amenities = [],
    rating = 4.8,
    reviewsCount = 16,
    distanceKm,
    distanceMeters,
    walkingMins,
    drivingMins,
    images = [],
    latitude,
    longitude,
  } = spot;

  const daysText = availability?.days?.join(', ') || 'Mon-Fri';
  const hoursText = `${availability?.startTime || '09:00'} - ${availability?.endTime || '18:00'}`;

  // Default fallback image if none provided
  const spotImage =
    images[0] ||
    'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80';

  // Universal Google Maps Turn-by-Turn Navigation URL
  const googleMapsUrl =
    latitude && longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&destination_place_id=${encodeURIComponent(
          societyName + ', ' + address
        )}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          societyName + ', ' + address + ', Mumbai'
        )}`;

  return (
    <div
      onClick={onSelect}
      className={`relative rounded-3xl bg-white border transition-all duration-200 cursor-pointer text-left overflow-hidden ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-xl scale-[1.01]'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Compulsory Parking Spot Image with Badges */}
      <div className="relative w-full h-44 bg-slate-900 overflow-hidden group">
        <img
          src={spotImage}
          alt={`Parking Spot ${spotNumber} at ${societyName}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

        {/* Top Badges over image */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white shadow-md">
              {area}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-md">
              {spotType}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-extrabold text-slate-900 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg shadow-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Bottom Banner over image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
          <span className="text-[11px] font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1">
            <Camera className="w-3 h-3 text-amber-400" />
            <span>Verified Spot Photo</span>
          </span>

          {/* Proximity walking badge */}
          {walkingMins !== undefined && walkingMins <= 20 ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-white shadow-md flex items-center gap-1">
              <span>🚶 {walkingMins}m walk</span>
              <span className="opacity-90 font-normal">({distanceMeters || Math.round(distanceKm * 1000)}m)</span>
            </span>
          ) : distanceKm !== undefined && distanceKm < 999 ? (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/90 text-slate-900 shadow-md flex items-center gap-1">
              <Navigation className="w-3 h-3 text-blue-600" />
              {distanceKm} km away
            </span>
          ) : null}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600">
            {societyName}
          </h3>

          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
            <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
              Spot {spotNumber}
            </span>
            <span>•</span>
            <span>Resident Flat {flatNumber}</span>
          </div>
        </div>

        {/* Address & Landmark */}
        <div className="flex items-start gap-1.5 text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <div className="line-clamp-2">
            <span>{address}</span>
            {landmark && (
              <span className="text-blue-600 font-medium block mt-0.5">
                📌 {landmark}
              </span>
            )}
          </div>
        </div>

        {/* Availability Window */}
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-900">{hoursText}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{daysText}</span>
        </div>

        {/* Footer: Google Maps Navigation Button & Book Button */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">₹{dailyRate || 150}</span>
              <span className="text-xs text-slate-600 font-bold">/ day pass</span>
            </div>
            <span className="text-[10px] text-slate-400 block font-medium">or ₹{hourlyRate}/hr</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Google Maps Redirect Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Open Google Maps Turn-by-Turn GPS Navigation"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <span>Maps</span>
              <ExternalLink className="w-3 h-3 text-emerald-500 opacity-70" />
            </a>

            {/* Book Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBook(spot);
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer"
            >
              Book Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
