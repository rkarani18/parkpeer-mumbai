import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Search, Check, Crosshair } from 'lucide-react';

// Custom Pin Icon for Location Picker
const pickerIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
      <div style="background:#2563eb; color:white; font-weight:bold; font-size:11px; padding:4px 8px; border-radius:9999px; box-shadow:0 4px 12px rgba(37,99,235,0.4); white-space:nowrap; border:2px solid white; display:flex; align-items:center; gap:4px;">
        <span>📍 Society Gate</span>
      </div>
      <div style="width:14px; height:14px; background:#2563eb; border-radius:50%; border:3px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3); margin-top:-2px;"></div>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

// Component to handle map clicks and marker placement
function LocationMarker({ position, onPositionChange }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom(), { duration: 0.5 });
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = e.target;
        if (marker != null) {
          const latLng = marker.getLatLng();
          onPositionChange(latLng.lat, latLng.lng);
        }
      },
    }),
    [onPositionChange]
  );

  return position ? (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[position.lat, position.lng]}
      icon={pickerIcon}
    />
  ) : null;
}

// Controller to smoothly pan to newly selected area
function MapFlyController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom || 15, { duration: 0.8 });
    }
  }, [center, zoom, map]);
  return null;
}

export const MapLocationPicker = ({
  latitude,
  longitude,
  onChangeCoordinates,
  onLocalityChange,
  localities = [],
}) => {
  const [mapCenter, setMapCenter] = useState(
    latitude && longitude ? [latitude, longitude] : [19.0760, 72.8777] // Center of Mumbai
  );
  const [selectedLocality, setSelectedLocality] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const currentPos = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  const handlePositionChange = (lat, lng) => {
    onChangeCoordinates(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
  };

  const handleSelectLocality = (locName) => {
    setSelectedLocality(locName);
    const found = localities.find((l) => l.name === locName);
    if (found && found.lat && found.lng) {
      handlePositionChange(found.lat, found.lng);
      setMapCenter([found.lat, found.lng]);
      if (onLocalityChange) {
        onLocalityChange(found.name, found.region);
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          handlePositionChange(lat, lng);
          setMapCenter([lat, lng]);
        },
        (err) => {
          alert('GPS permission not granted. Please click directly on the map instead.');
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Top Locality Quick Jump & GPS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={selectedLocality}
              onChange={(e) => handleSelectLocality(e.target.value)}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">🎯 Jump to any Mumbai Area / Locality...</option>
              {localities.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name} ({loc.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="px-3 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Crosshair className="w-3.5 h-3.5 text-blue-600" />
          <span>My Current Location</span>
        </button>
      </div>

      {/* Interactive Map Box */}
      <div className="relative w-full h-72 rounded-2xl overflow-hidden border-2 border-blue-200 shadow-inner">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapFlyController center={mapCenter} zoom={15} />

          <LocationMarker
            position={currentPos}
            onPositionChange={handlePositionChange}
          />
        </MapContainer>

        {/* Floating guidance banner */}
        <div className="absolute top-2 left-2 right-2 z-[400] bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-xl shadow-md flex items-center justify-between pointer-events-none">
          <span>👇 <strong>Click anywhere on map</strong> or drag the blue pin to set exact parking gate</span>
          <span className="text-blue-300 font-mono text-[10px]">
            {latitude && longitude ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` : 'No pin placed'}
          </span>
        </div>
      </div>

      {/* Selected Coordinates Status */}
      {latitude && longitude ? (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Exact Gate Location Pinned:</span>
            <span className="font-mono font-bold">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded">
            Drag pin anytime to fine-tune
          </span>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span>Click on the map above to drop the exact parking pin</span>
        </div>
      )}
    </div>
  );
};

