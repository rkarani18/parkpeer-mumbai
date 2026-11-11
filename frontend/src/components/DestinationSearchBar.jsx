import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  X,
  Compass,
  Building,
  Sparkles,
  Ticket,
  ShoppingBag,
  Activity,
  Navigation,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';

const QUICK_VENUES = [
  {
    name: 'Shanmukhananda Hall',
    label: '🎪 Shanmukhananda Hall (Sion)',
    lat: 19.0348,
    lng: 72.8595,
    area: 'Sion / Matunga',
    address: 'Comrade Harbanslal Marg, Flank Road, Sion East / Matunga',
  },
  {
    name: 'Jio World Convention Centre',
    label: '🏢 Jio World Centre (BKC)',
    lat: 19.0620,
    lng: 72.8640,
    area: 'BKC',
    address: 'G Block, Bandra Kurla Complex',
  },
  {
    name: 'High Street Phoenix',
    label: '🛍️ Phoenix & Palladium (Lower Parel)',
    lat: 18.9950,
    lng: 72.8250,
    area: 'Lower Parel',
    address: 'Senapati Bapat Marg, Lower Parel',
  },
  {
    name: 'Wankhede Stadium',
    label: '🏏 Wankhede Stadium (Churchgate)',
    lat: 18.9389,
    lng: 72.8258,
    area: 'Churchgate',
    address: 'Vinoo Mankad Road, Churchgate',
  },
  {
    name: 'Siddhivinayak Temple',
    label: '🛕 Siddhivinayak Temple (Prabhadevi)',
    lat: 19.0169,
    lng: 72.8304,
    area: 'Prabhadevi',
    address: 'SK Bole Marg, Prabhadevi',
  },
  {
    name: 'Lilavati Hospital',
    label: '🏥 Lilavati Hospital (Bandra)',
    lat: 19.0510,
    lng: 72.8290,
    area: 'Bandra West',
    address: 'Bandra Reclamation, Bandra West',
  },
];

export const DestinationSearchBar = ({
  activeDestination,
  onSelectDestination,
  onClearDestination,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.searchDestinations(query.trim());
        if (res.success && res.data) {
          setSuggestions(res.data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    onSelectDestination({
      name: item.name,
      displayName: item.displayName || item.name,
      area: item.area,
      address: item.address,
      lat: item.lat,
      lng: item.lng,
      category: item.category,
    });
    setQuery('');
    setIsOpen(false);
  };

  const getCategoryIcon = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('auditorium') || c.includes('event')) return Ticket;
    if (c.includes('shop') || c.includes('dining')) return ShoppingBag;
    if (c.includes('hospital')) return Activity;
    if (c.includes('temple') || c.includes('tourist')) return Sparkles;
    return Building;
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Active Destination Ribbon */}
      {activeDestination ? (
        <div className="p-3 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-2xl shadow-md flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            <div className="text-left truncate">
              <div className="flex items-center gap-1.5 text-[10px] text-blue-200 uppercase font-bold tracking-wider">
                <span>Visiting Destination Target:</span>
                <span className="bg-white/20 px-1.5 py-0.2 rounded text-white">Active</span>
              </div>
              <h4 className="font-extrabold text-sm truncate text-white">
                {activeDestination.displayName || activeDestination.name}
              </h4>
              <p className="text-[11px] text-blue-100 truncate">
                {activeDestination.address}
              </p>
            </div>
          </div>

          <button
            onClick={onClearDestination}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Search another location"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Change</span>
          </button>
        </div>
      ) : (
        /* Search Input */
        <div className="relative">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 flex items-center pointer-events-none text-blue-600">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                if (query.trim()) setIsOpen(true);
              }}
              placeholder="Where are you visiting in Mumbai? (e.g. Shanmukhananda Hall, Jio World, Lilavati Hospital)..."
              className="w-full pl-10 pr-10 py-3 bg-white border-2 border-blue-400/80 rounded-2xl text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
            />

            {loading && (
              <div className="absolute right-3.5">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {query && !loading && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                  setIsOpen(false);
                }}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl max-h-80 overflow-y-auto divide-y divide-slate-100 text-left animate-in fade-in duration-150">
              <div className="px-3 py-2 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Matching Mumbai Destinations ({suggestions.length})
              </div>

              {suggestions.map((item, idx) => {
                const Icon = getCategoryIcon(item.category);
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className="p-3 hover:bg-blue-50/80 cursor-pointer transition-colors flex items-start justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
                            {item.name}
                          </span>
                          {item.category && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {item.address}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 mt-1">
                      <span className="text-[10px] font-bold text-blue-600 group-hover:underline flex items-center gap-0.5">
                        Find Parking <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quick Venue Pick Pills */}
      {!activeDestination && (
        <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold text-[11px] shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Popular Destinations:
          </span>
          {QUICK_VENUES.map((venue, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(venue)}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/90 font-medium whitespace-nowrap shadow-2xs hover:border-blue-300 transition-all cursor-pointer text-[11px]"
            >
              {venue.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

