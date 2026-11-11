import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, ShieldCheck, PlusCircle, Ticket, MapPin, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const location = useLocation();

  const navItems = [
    {
      to: '/',
      label: 'Find Parking',
      sub: 'Driver View',
      icon: Car,
    },
    {
      to: '/host',
      label: 'Host Dashboard',
      sub: 'Flat Owner',
      icon: PlusCircle,
    },
    {
      to: '/guard',
      label: 'Guard Gate Scan',
      sub: 'Security Booth',
      icon: ShieldCheck,
      highlight: true,
    },
    {
      to: '/my-passes',
      label: 'My QR Passes',
      sub: 'Active Bookings',
      icon: Ticket,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                  Park<span className="text-blue-600">Peer</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wider">
                  Mumbai
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Airbnb for Gated Society Parking
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : item.highlight
                      ? 'text-amber-800 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-blue-600'
                        : item.highlight
                        ? 'text-amber-600'
                        : 'text-slate-500'
                    }`}
                  />
                  <div className="text-left hidden md:block">
                    <span className="block leading-tight">{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal leading-none block">
                      {item.sub}
                    </span>
                  </div>
                  <span className="md:hidden">{item.label.split(' ')[0]}</span>

                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

