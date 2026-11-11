import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  SlidersHorizontal,
  Layers,
  Map as MapIcon,
  List as ListIcon,
  ShieldCheck,
  Building,
  RotateCcw,
  Crosshair,
  X,
  Compass,
  Footprints,
  Car,
} from 'lucide-react';
import { api } from '../services/api';
import { MapSearch } from '../components/MapSearch';
import { SpotCard } from '../components/SpotCard';
import { BookingModal } from '../components/BookingModal';
import { DestinationSearchBar } from '../components/DestinationSearchBar';

// Major Mumbai Zones
const MUMBAI_ZONES = [
  { name: 'Entire Mumbai', value: 'All', coords: [19.0760, 72.8777], zoom: 11 },
  { name: 'Central (Sion / Matunga)', value: 'Central Mumbai', coords: [19.0348, 72.8595], zoom: 14 },
  { name: 'South Mumbai', value: 'South Mumbai', coords: [18.9600, 72.8200], zoom: 13 },
  { name: 'Western Suburbs', value: 'Western Suburbs', coords: [19.1400, 72.8400], zoom: 12 },
  { name: 'Eastern & Powai', value: 'Eastern Suburbs', coords: [19.0900, 72.9050], zoom: 13 },
  { name: 'Thane & Navi Mumbai', value: 'Thane & Navi Mumbai', coords: [19.1500, 72.9900], zoom: 12 },
];

export const DriverSearchPage = () => {
  const navigate = useNavigate();

  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDestination, setActiveDestination] = useState(null); // { name, displayName, lat, lng, area, address }
  const [radiusKm, setRadiusKm] = useState(3);
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [bookingSpot, setBookingSpot] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'map' | 'list'
  const [maxPrice, setMaxPrice] = useState(200);

  const activeZoneObj = MUMBAI_ZONES.find((z) => z.value === selectedZone) || MUMBAI_ZONES[0];

  const fetchSpots = async () => {
    try {
      setLoading(true);

      // If driver is searching near a destination (e.g. Shanmukhananda Hall)
      if (activeDestination && activeDestination.lat && activeDestination.lng) {
        const res = await api.getSpotsNear(
          activeDestination.lat,
          activeDestination.lng,
          radiusKm,
          maxPrice
        );
        if (res.success && res.data) {
          setSpots(res.data);
          if (res.data.length > 0) {
            setSelectedSpot(res.data[0]);
          }
        }
      } else {
        // Standard zone or search filter
        const params = {};
        if (maxPrice) params.maxPrice = maxPrice;
        if (selectedZone !== 'All') params.region = selectedZone;

        const res = await api.getSpots(params);
        if (res.success && res.data) {
          setSpots(res.data);
          if (res.data.length > 0 && !selectedSpot) {
            setSelectedSpot(res.data[0]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, [activeDestination, radiusKm, maxPrice, selectedZone]);

  const handleSelectDestination = (venue) => {
    setActiveDestination(venue);
  };

  const handleClearDestination = () => {
    setActiveDestination(null);
  };

  const handleMapClickPoint = (lat, lng) => {
    setActiveDestination({
      name: 'Pinned Map Location',
      displayName: 'Pinned Location on Map',
      area: 'Mumbai',
      address: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      lat,
      lng,
      category: 'Map Pin',
    });
  };

  const handleBookingSuccess = (booking) => {
    setBookingSpot(null);
    navigate(`/booking-pass/${booking._id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-left">
      {/* Top Header & Destination Search Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto space-y-3.5">
          {/* Destination Search Bar Component */}
          <DestinationSearchBar
            activeDestination={activeDestination}
            onSelectDestination={handleSelectDestination}
            onClearDestination={handleClearDestination}
          />

          {/* Subheader: Proximity Radius Filter / Zone Tabs & View controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            {/* If Destination is active: Show Walking / Driving Distance Radius Filter */}
            {activeDestination ? (
              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-blue-600" />
                  Max Distance:
                </span>
                {[
                  { label: '🚶 Within 1 km (Walk)', value: 1 },
                  { label: '🚶 Within 3 km', value: 3 },
                  { label: '🚗 Within 5 km', value: 5 },
                  { label: '🚗 Within 10 km', value: 10 },
                ].map((rad) => (
                  <button
                    key={rad.value}
                    onClick={() => setRadiusKm(rad.value)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      radiusKm === rad.value
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {rad.label}
                  </button>
                ))}
              </div>
            ) : (
              /* Zone Filter Pills */
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider shrink-0 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  Zone:
                </span>
                {MUMBAI_ZONES.map((zone) => {
                  const isSelected = selectedZone === zone.value;
                  return (
                    <button
                      key={zone.value}
                      onClick={() => {
                        setSelectedZone(zone.value);
                        setActiveDestination(null);
                      }}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {zone.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Right side: Max price filter & View mode */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
                <span className="font-semibold text-slate-500">Max Pass:</span>
                <span className="font-black text-slate-900">₹{maxPrice}</span>
                <input
                  type="range"
                  min="100"
                  max="220"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-16 accent-blue-600 cursor-pointer"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    viewMode === 'split'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Split Map & List"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-xs">Split</span>
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    viewMode === 'map'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Map View"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-xs">Map</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-xs">List</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-slate-600 font-medium text-sm">
              Finding parking spots near your destination...
            </p>
          </div>
        ) : (
          <div className="h-[calc(100vh-230px)] min-h-[520px]">
            {/* Split View */}
            {viewMode === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
                {/* Spot List Column (5 cols) */}
                <div className="lg:col-span-5 h-full flex flex-col">
                  {/* Results Count & Proximity Banner */}
                  <div className="mb-2.5 px-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        {spots.length} Society Parking Spots Found
                      </span>
                      {activeDestination && spots[0]?.distanceMeters && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Nearest: {spots[0].distanceMeters}m ({spots[0].walkingMins} min walk)
                        </span>
                      )}
                    </div>
                    {activeDestination && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Sorted by walking distance to <strong>{activeDestination.name}</strong>
                      </p>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {spots.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                        <Building className="w-12 h-12 text-slate-300 mx-auto" />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">
                            No Spots Within {radiusKm} km
                          </h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Try expanding the search radius to 5 km or increasing the price filter.
                          </p>
                        </div>
                        <button
                          onClick={() => setRadiusKm(radiusKm + 3)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors"
                        >
                          Expand Search Radius to {radiusKm + 3} km
                        </button>
                      </div>
                    ) : (
                      spots.map((spot) => (
                        <SpotCard
                          key={spot._id}
                          spot={spot}
                          isSelected={selectedSpot?._id === spot._id}
                          onSelect={() => setSelectedSpot(spot)}
                          onBook={(s) => setBookingSpot(s)}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Map Column (7 cols) */}
                <div className="lg:col-span-7 h-full">
                  <MapSearch
                    spots={spots}
                    selectedSpot={selectedSpot}
                    onSelectSpot={(s) => setSelectedSpot(s)}
                    onBookSpot={(s) => setBookingSpot(s)}
                    destination={activeDestination}
                    onMapClickPoint={handleMapClickPoint}
                    onClearDestination={handleClearDestination}
                    radiusMeters={radiusKm * 1000}
                    defaultCenter={activeZoneObj.coords}
                    defaultZoom={activeZoneObj.zoom}
                  />
                </div>
              </div>
            )}

            {/* Map Only View */}
            {viewMode === 'map' && (
              <div className="w-full h-full">
                <MapSearch
                  spots={spots}
                  selectedSpot={selectedSpot}
                  onSelectSpot={(s) => setSelectedSpot(s)}
                  onBookSpot={(s) => setBookingSpot(s)}
                  destination={activeDestination}
                  onMapClickPoint={handleMapClickPoint}
                  onClearDestination={handleClearDestination}
                  radiusMeters={radiusKm * 1000}
                  defaultCenter={activeZoneObj.coords}
                  defaultZoom={activeZoneObj.zoom}
                />
              </div>
            )}

            {/* List Only View */}
            {viewMode === 'list' && (
              <div className="h-full overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {spots.map((spot) => (
                    <SpotCard
                      key={spot._id}
                      spot={spot}
                      isSelected={selectedSpot?._id === spot._id}
                      onSelect={() => setSelectedSpot(spot)}
                      onBook={(s) => setBookingSpot(s)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Checkout Modal */}
      {bookingSpot && (
        <BookingModal
          spot={bookingSpot}
          onClose={() => setBookingSpot(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};
