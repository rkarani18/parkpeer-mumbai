import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Building2,
  Calendar,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Sparkles,
  TrendingUp,
  MapPin,
  Car,
  Crosshair,
  Camera,
  Navigation,
  ExternalLink,
  Plus,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { MapLocationPicker } from '../components/MapLocationPicker';

const DAYS_OF_WEEK = [
  { key: 'Mon', label: 'Mon' },
  { key: 'Tue', label: 'Tue' },
  { key: 'Wed', label: 'Wed' },
  { key: 'Thu', label: 'Thu' },
  { key: 'Fri', label: 'Fri' },
  { key: 'Sat', label: 'Sat' },
  { key: 'Sun', label: 'Sun' },
];

const PHOTO_PRESETS = [
  {
    title: 'Covered Basement Slot',
    url: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Covered Stilt Bay',
    url: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Wide SUV Society Slot',
    url: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Society Barrier Gate',
    url: 'https://images.unsplash.com/photo-1617886903355-9354bb57751f?auto=format&fit=crop&w=800&q=80',
  },
];

export const HostDashboardPage = () => {
  const [spots, setSpots] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [customImageUrl, setCustomImageUrl] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    hostName: 'Vikramaditya Mehta',
    hostPhone: '+91 98201 44521',
    societyName: 'Kalpataru Sparkle',
    flatNumber: 'Tower B - 1402',
    spotNumber: 'B1 - Slot 38',
    spotType: 'Covered',
    vehicleCompatibility: 'Any Car',
    area: 'BKC (Bandra East)',
    address: 'Kalanagar, BKC Connector Road, Bandra East, Mumbai - 400051',
    landmark: 'Opposite Asian Heart Institute, 3 mins from Jio World Drive',
    latitude: 19.0621,
    longitude: 72.8532,
    hourlyRate: 20,
    dailyRate: 150,
    availability: {
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '09:00',
      endTime: '18:00',
    },
    amenities: ['24/7 Security Guard', 'CCTV Surveillance', 'Covered Roof'],
    entryInstructions: 'Inform Gate 2 security you are visiting Flat 1402 resident parking slot.',
    images: [
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
    ],
  });

  const fetchSpots = async () => {
    try {
      setLoading(true);
      const res = await api.getSpots();
      if (res.success && res.data) {
        setSpots(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load listings.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLocalities = async () => {
    try {
      const res = await api.getLocalities();
      if (res.success && res.data) {
        setLocalities(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSpots();
    fetchLocalities();
  }, []);

  const workDaysPerMonth = (formData.availability.days.length || 5) * 4.2;
  const estimatedMonthlyEarnings = Math.round(
    (formData.dailyRate || 150) * workDaysPerMonth
  );

  const toggleDay = (dayKey) => {
    const currentDays = formData.availability.days || [];
    const exists = currentDays.includes(dayKey);
    const newDays = exists
      ? currentDays.filter((d) => d !== dayKey)
      : [...currentDays, dayKey];

    setFormData({
      ...formData,
      availability: {
        ...formData.availability,
        days: newDays,
      },
    });
  };

  const toggleAmenity = (amenity) => {
    const current = formData.amenities || [];
    const exists = current.includes(amenity);
    const updated = exists
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setFormData({ ...formData, amenities: updated });
  };

  const handleCoordinatesChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleLocalitySelected = (name) => {
    setFormData((prev) => ({
      ...prev,
      area: name,
    }));
  };

  const addPresetImage = (url) => {
    if (!formData.images.includes(url)) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url],
      }));
    }
  };

  const addCustomImage = (e) => {
    e.preventDefault();
    if (customImageUrl.trim() && !formData.images.includes(customImageUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, customImageUrl.trim()],
      }));
      setCustomImageUrl('');
    }
  };

  const removeImage = (urlToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== urlToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    // COMPULSORY IMAGE VALIDATION
    if (!formData.images || formData.images.length === 0) {
      setError('Parking spot photos are compulsory! Please select or add at least 1 photo.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.createSpot(formData);
      if (res.success) {
        setMessage('🎉 Parking spot listed successfully on ParkPeer Mumbai with photos & navigation pin!');
        setShowForm(false);
        fetchSpots();
      } else {
        throw new Error(res.message || 'Failed to list spot');
      }
    } catch (err) {
      setError(err.message || 'Failed to list spot');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (spotId) => {
    if (!window.confirm('Are you sure you want to remove this parking spot listing?')) return;
    try {
      await api.deleteSpot(spotId);
      fetchSpots();
    } catch (err) {
      alert('Failed to remove spot');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section & Passive Income Simulator */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-400/20">
              For Flat Owners Across Greater Mumbai
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold mt-3 tracking-tight">
              Rent Your Empty Parking Spot During Work Hours
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300">
              Your car is at work from 9 AM to 6 PM. Rent out your vacant society parking spot to corporate professionals anywhere across Mumbai.
            </p>
          </div>

          {/* Monthly Passive Income Card */}
          <div className="mt-6 sm:mt-8 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-300 font-medium">Estimated Monthly Passive Income</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  ₹{estimatedMonthlyEarnings.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-slate-300 font-normal">/ month</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{showForm ? 'Close Listing Form' : 'List A Parking Spot'}</span>
            </button>
          </div>
        </div>

        {/* Success or Error Feedback */}
        {message && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Spot Listing Form */}
        {showForm && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-in fade-in duration-300 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  List Your Society Parking Spot
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pin your exact society parking gate on the map and add spot photos so drivers can visually identify and navigate to it
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Society & Flat Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
                  1. Society & Spot Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Society / Apartment Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kalpataru Sparkle"
                      value={formData.societyName}
                      onChange={(e) => setFormData({ ...formData, societyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Flat / Tower Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tower B - Flat 1402"
                      value={formData.flatNumber}
                      onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parking Spot Number / Bay *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B1 - Slot 38"
                      value={formData.spotNumber}
                      onChange={(e) => setFormData({ ...formData, spotNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Spot Type
                    </label>
                    <select
                      value={formData.spotType}
                      onChange={(e) => setFormData({ ...formData, spotType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Covered">Covered</option>
                      <option value="Basement">Basement</option>
                      <option value="Stilt">Stilt</option>
                      <option value="Open">Open</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Vehicle Allowed
                    </label>
                    <select
                      value={formData.vehicleCompatibility}
                      onChange={(e) => setFormData({ ...formData, vehicleCompatibility: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Any Car">Any Car</option>
                      <option value="Hatchback / Sedan">Hatchback / Sedan</option>
                      <option value="SUV / Large">SUV / Large</option>
                      <option value="Two Wheeler">Two Wheeler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mumbai Locality / Area *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bandra West, Juhu, Borivali"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Interactive Map Pin Selector for Google Maps Navigation */}
                <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>Interactive Map Pin (Google Maps Navigation Target)</span>
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Drivers will be navigated directly to this exact GPS location via Google Maps.
                    </p>
                  </div>

                  <MapLocationPicker
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onChangeCoordinates={handleCoordinatesChange}
                    onLocalityChange={handleLocalitySelected}
                    localities={localities}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kalanagar, BKC Connector Road, Bandra East, Mumbai - 400051"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nearby Landmark
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 3 mins from Jio World Drive, opposite Asian Heart"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* COMPULSORY PARKING SPOT PHOTOS SECTION */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      2. Parking Spot Photos <span className="text-red-500 font-black">* (COMPULSORY)</span>
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {formData.images.length} Photo{formData.images.length !== 1 ? 's' : ''} Added
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-3">
                  Drivers must be able to visually identify your parking bay. Select from Mumbai society presets or paste a custom photo URL.
                </p>

                {/* Preset Photo Selectors */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {PHOTO_PRESETS.map((preset, idx) => {
                    const isAdded = formData.images.includes(preset.url);
                    return (
                      <div
                        key={idx}
                        onClick={() => addPresetImage(preset.url)}
                        className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all group ${
                          isAdded
                            ? 'border-emerald-500 ring-2 ring-emerald-300 shadow-md'
                            : 'border-slate-200 hover:border-blue-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="w-full h-20 object-cover"
                        />
                        <div className="p-1.5 bg-white text-center">
                          <span className="text-[10px] font-bold text-slate-700 block truncate">
                            {preset.title}
                          </span>
                          <span className="text-[9px] font-semibold text-blue-600 block">
                            {isAdded ? '✓ Selected' : '+ Use Photo'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Photo URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste any custom parking spot photo URL (https://...)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomImage}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    + Add URL
                  </button>
                </div>

                {/* Selected Photos Gallery Preview */}
                {formData.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {formData.images.map((imgUrl, i) => (
                      <div
                        key={i}
                        className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-300 shadow-xs group"
                      >
                        <img src={imgUrl} alt="Spot preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(imgUrl)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Availability Windows & Pricing */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
                  3. Availability Window & Hourly Pricing (INR ₹)
                </h3>

                {/* Days Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Available Days of the Week:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const selected = formData.availability.days.includes(day.key);
                      return (
                        <button
                          type="button"
                          key={day.key}
                          onClick={() => toggleDay(day.key)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Available From
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.availability.startTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availability: { ...formData.availability, startTime: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Available Until
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.availability.endTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availability: { ...formData.availability, endTime: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Day Pass (INR ₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min="50"
                        max="250"
                        required
                        value={formData.dailyRate || 150}
                        onChange={(e) =>
                          setFormData({ ...formData, dailyRate: Number(e.target.value) })
                        }
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      Suggested ₹100 - ₹200 / day
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hourly Rate (INR ₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 font-bold text-slate-500">₹</span>
                      <input
                        type="number"
                        min="10"
                        max="50"
                        required
                        value={formData.hourlyRate || 20}
                        onChange={(e) =>
                          setFormData({ ...formData, hourlyRate: Number(e.target.value) })
                        }
                        className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Short visits (~₹20/hr)
                    </span>
                  </div>
                </div>
              </div>

              {/* Amenities & Security Instructions */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
                  4. Society Security & Instructions
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    '24/7 Security Guard',
                    'CCTV Surveillance',
                    'Covered Roof',
                    'Boom Barrier Gate',
                    'EV Charging (15A)',
                    'Elevator Access',
                  ].map((amenity) => {
                    const checked = formData.amenities.includes(amenity);
                    return (
                      <button
                        type="button"
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                          checked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {checked ? '✓ ' : '+ '}
                        {amenity}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guard & Visitor Gate Instructions
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Enter through Gate 2. Inform security guard you are visiting Flat 1402. Spot is adjacent to Lift Lobby B."
                    value={formData.entryInstructions}
                    onChange={(e) => setFormData({ ...formData, entryInstructions: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {submitting ? 'Publishing Spot with Photos...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Listings Grid */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Society Parking Spots Across Mumbai ({spots.length})
              </h2>
              <p className="text-xs text-slate-500">
                Active listings with compulsory photos & GPS Google Maps navigation
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Loading listings...
            </div>
          ) : spots.length === 0 ? (
            <div className="py-12 bg-white rounded-3xl border border-slate-200 text-center p-6">
              <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No parking spots listed yet</p>
              <p className="text-xs text-slate-500 mt-1">
                Be the first flat owner to list your vacant parking spot.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {spots.map((spot) => {
                const spotImg =
                  spot.images?.[0] ||
                  'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80';
                const gMapsUrl =
                  spot.latitude && spot.longitude
                    ? `https://www.google.com/maps/dir/?api=1&destination=${spot.latitude},${spot.longitude}&destination_place_id=${encodeURIComponent(
                        spot.societyName + ', ' + spot.address
                      )}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        spot.societyName + ', ' + spot.address
                      )}`;

                return (
                  <div
                    key={spot._id}
                    className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between overflow-hidden"
                  >
                    {/* Spot Photo */}
                    <div className="relative w-full h-36 bg-slate-900">
                      <img src={spotImg} alt={spot.societyName} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-xs">
                          {spot.area}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-semibold">
                        Spot {spot.spotNumber} • {spot.spotType}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 text-base leading-tight">
                            {spot.societyName}
                          </h3>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-slate-900 block">
                              ₹{spot.dailyRate || 150}/day
                            </span>
                            <span className="text-[10px] text-slate-400">or ₹{spot.hourlyRate || 20}/hr</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 mt-1">
                          <span>Flat {spot.flatNumber}</span>
                          <span className="mx-1">•</span>
                          <span>{spot.hostName}</span>
                        </div>

                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                          {spot.address}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        {/* Direct Google Maps Link */}
                        <a
                          href={gMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Navigation className="w-3 h-3 text-emerald-600" />
                          <span>Google Maps</span>
                          <ExternalLink className="w-3 h-3 text-emerald-500" />
                        </a>

                        <button
                          onClick={() => handleDelete(spot._id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
