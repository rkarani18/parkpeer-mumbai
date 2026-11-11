import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, IndianRupee, Crosshair, X, Footprints } from 'lucide-react';

// Custom price badge Leaflet icon with optional walking time
const createPriceIcon = (dailyRate, walkingMins, isSelected = false) => {
  const bgClass = isSelected
    ? 'bg-blue-600 text-white ring-4 ring-blue-300 scale-110 z-50'
    : 'bg-white text-slate-900 border border-slate-300 shadow-md hover:bg-slate-900 hover:text-white';

  const walkHtml = walkingMins && walkingMins <= 15
    ? `<div style="font-size:9px; background:#10b981; color:white; border-radius:9999px; padding:1px 5px; font-weight:800; margin-left:2px;">🚶${walkingMins}m</div>`
    : '';

  const html = `
    <div class="flex items-center justify-center font-bold px-2 py-1 rounded-full text-xs transition-all duration-200 transform ${bgClass}" style="box-shadow: 0 4px 12px rgba(0,0,0,0.15); white-space: nowrap;">
      <span>₹${dailyRate || 150}</span>
      <span class="text-[9px] opacity-80 ml-0.5">/day</span>
      ${walkHtml}
    </div>
  `;

  return L.divIcon({
    className: 'custom-map-price-marker',
    html: html,
    iconSize: [80, 28],
    iconAnchor: [40, 14],
  });
};

// Target destination pin
const createDestinationIcon = (name = 'Destination') => {
  return L.divIcon({
    className: 'destination-target-pin',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:#dc2626; color:white; font-weight:900; font-size:11px; padding:4px 10px; border-radius:9999px; box-shadow:0 4px 15px rgba(220,38,38,0.5); white-space:nowrap; border:2px solid white; display:flex; align-items:center; gap:4px;">
          <span>🎯 ${name}</span>
        </div>
        <div style="width:14px; height:14px; background:#dc2626; border-radius:50%; border:3px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.4); margin-top:-2px;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

// Component to handle map clicks for manual destination pin
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

// Controller to smoothly pan to target
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 14, { duration: 1.0 });
    }
  }, [center, zoom, map]);
  return null;
};

export const MapSearch = ({
  spots = [],
  selectedSpot = null,
  onSelectSpot,
  onBookSpot,
  destination = null,
  onMapClickPoint,
  onClearDestination,
  radiusMeters = 2500,
  defaultCenter = [19.0760, 72.8777],
  defaultZoom = 12,
}) => {
  const center = selectedSpot && selectedSpot.latitude && selectedSpot.longitude
    ? [selectedSpot.latitude, selectedSpot.longitude]
    : destination && destination.lat && destination.lng
    ? [destination.lat, destination.lng]
    : defaultCenter;

  const zoom = selectedSpot ? 16 : destination ? 15 : defaultZoom;

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController center={center} zoom={zoom} />

        <MapClickHandler onMapClick={onMapClickPoint} />

        {/* Destination Target Marker & Walking Radius Circle */}
        {destination && destination.lat && destination.lng && (
          <>
            <Marker
              position={[destination.lat, destination.lng]}
              icon={createDestinationIcon(destination.name || 'Your Venue')}
            >
              <Popup>
                <div className="p-1 text-xs text-left">
                  <strong className="text-red-600 block text-sm">
                    🎯 {destination.displayName || destination.name}
                  </strong>
                  <p className="text-slate-500 mt-0.5">{destination.address}</p>
                  <span className="inline-block mt-2 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Showing residential parking spots nearby
                  </span>
                </div>
              </Popup>
            </Marker>

            <Circle
              center={[destination.lat, destination.lng]}
              radius={radiusMeters}
              pathOptions={{
                color: '#2563eb',
                fillColor: '#3b82f6',
                fillOpacity: 0.12,
                weight: 2,
                dashArray: '5, 8',
              }}
            />
          </>
        )}

        {/* Parking Spot Pins */}
        {spots.map((spot) => {
          if (!spot.latitude || !spot.longitude) return null;
          const isSelected = selectedSpot?._id === spot._id;

          return (
            <Marker
              key={spot._id}
              position={[spot.latitude, spot.longitude]}
              icon={createPriceIcon(spot.dailyRate, spot.walkingMins, isSelected)}
              eventHandlers={{
                click: () => onSelectSpot(spot),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-1 max-w-xs text-left">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold mb-1">
                    <span className="px-1.5 py-0.5 bg-blue-50 rounded text-[10px]">
                      {spot.area}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{spot.spotType}</span>
                  </div>

                  {spot.images?.[0] && (
                    <img
                      src={spot.images[0]}
                      alt={spot.societyName}
                      className="w-full h-24 object-cover rounded-lg mb-1.5"
                    />
                  )}

                  <h4 className="font-bold text-sm text-slate-900 leading-tight">
                    {spot.societyName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {spot.address}
                  </p>

                  {/* Proximity walking indicator */}
                  {spot.walkingMins && spot.walkingMins < 999 && (
                    <div className="mt-2 p-1.5 bg-emerald-50 rounded-lg text-emerald-800 text-[11px] font-bold flex items-center justify-between border border-emerald-200/60">
                      <span>🚶 {spot.walkingMins} min walk ({spot.distanceMeters || Math.round(spot.distanceKm * 1000)}m)</span>
                      {spot.drivingMins && <span>🚗 {spot.drivingMins}m drive</span>}
                    </div>
                  )}

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900 leading-tight">
                        ₹{spot.dailyRate || 150}
                        <span className="text-[10px] font-normal text-slate-500">/day</span>
                      </div>
                      <span className="text-[9px] text-slate-400">or ₹{spot.hourlyRate || 20}/hr</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={
                          spot.latitude && spot.longitude
                            ? `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}&destination_place_id=${encodeURIComponent(
                                spot.societyName + ', ' + spot.address
                              )}`
                            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                spot.societyName + ', ' + spot.address + ', Mumbai'
                              )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3 text-emerald-600" />
                        <span>Navigate</span>
                      </a>
                      <button
                        onClick={() => onBookSpot(spot)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                      >
                        Book Spot
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating map helper */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md flex items-center gap-2 text-xs text-slate-700 pointer-events-none">
        <Navigation className="w-3.5 h-3.5 text-blue-600" />
        <span>Click pin to view exact society gate & walking distance</span>
      </div>
    </div>
  );
};
