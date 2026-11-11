import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Car,
  User,
  Clock,
  MapPin,
  Camera,
  Search,
  ArrowRight,
  Sparkles,
  Building2,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { api } from '../services/api';

export const GuardScannerPage = () => {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';

  const [inputCode, setInputCode] = useState(initialCode);
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successActionMessage, setSuccessActionMessage] = useState(null);
  const [gateLog, setGateLog] = useState([]);
  const [activeSocietyGate, setActiveSocietyGate] = useState('All Societies (Central Gate)');

  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  // Auto-verify if code passed in URL query parameter
  useEffect(() => {
    if (initialCode) {
      handleVerify(initialCode);
    }
  }, [initialCode]);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  const handleVerify = async (codeToVerify) => {
    const code = (codeToVerify || inputCode).trim();
    if (!code) return;

    setLoading(true);
    setErrorMessage(null);
    setSuccessActionMessage(null);
    setVerifyResult(null);

    try {
      // If code is a JSON string from dynamic QR, parse it
      let parsedCode = code;
      if (code.startsWith('{') && code.endsWith('}')) {
        try {
          const parsed = JSON.parse(code);
          parsedCode = parsed.verificationCode || parsed.bookingId || code;
        } catch (e) {
          // keep as string
        }
      }

      const res = await api.verifyCode(parsedCode);
      if (res.success && res.data) {
        setVerifyResult(res.data);
      } else {
        setErrorMessage(res.message || 'No active booking found for this code.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Verification failed. Please check code or try again.');
    } finally {
      setLoading(false);
    }
  };

  const startCameraScanner = async () => {
    setErrorMessage(null);
    setIsScanning(true);

    try {
      // Allow DOM to render scanner div
      setTimeout(async () => {
        try {
          const html5QrCode = new Html5Qrcode('qr-reader');
          html5QrCodeRef.current = html5QrCode;

          await html5QrCode.start(
            { facingMode: 'environment' },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              // On successful scan
              stopCameraScanner();
              setInputCode(decodedText);
              handleVerify(decodedText);
            },
            (error) => {
              // Scanning frame, ignore normal frame errors
            }
          );
        } catch (err) {
          console.error('Camera startup error:', err);
          setErrorMessage('Camera access error or permission denied. You can use manual code input or the Demo Scan button below.');
          setIsScanning(false);
        }
      }, 100);
    } catch (err) {
      setIsScanning(false);
    }
  };

  const stopCameraScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
    }
    setIsScanning(false);
  };

  // Guard Action: Approve Entry & Check in driver
  const handleApproveEntry = async () => {
    if (!verifyResult?._id) return;
    setLoading(true);
    try {
      const res = await api.checkInBooking(verifyResult._id, {
        guardName: 'Gate 1 Security Officer',
        notes: 'Verified dynamic QR code & vehicle number match.',
      });
      if (res.success) {
        setVerifyResult(res.data);
        setSuccessActionMessage('ENTRY GRANTED: Barrier raised! Vehicle registered in society.');
        // Add to gate log
        setGateLog((prev) => [
          {
            id: res.data._id,
            vehicle: res.data.vehicleNumber,
            driver: res.data.driverName,
            spot: res.data.spotDetails?.spotNumber,
            flat: res.data.spotDetails?.flatNumber,
            time: new Date().toLocaleTimeString('en-IN'),
            type: 'ENTRY',
          },
          ...prev,
        ]);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  // Guard Action: Record vehicle exit
  const handleRecordExit = async () => {
    if (!verifyResult?._id) return;
    setLoading(true);
    try {
      const res = await api.checkOutBooking(verifyResult._id);
      if (res.success) {
        setVerifyResult(res.data);
        setSuccessActionMessage('EXIT RECORDED: Vehicle departed. Spot marked free.');
        setGateLog((prev) => [
          {
            id: res.data._id,
            vehicle: res.data.vehicleNumber,
            driver: res.data.driverName,
            spot: res.data.spotDetails?.spotNumber,
            flat: res.data.spotDetails?.flatNumber,
            time: new Date().toLocaleTimeString('en-IN'),
            type: 'EXIT',
          },
          ...prev,
        ]);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-6 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Guard Booth Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Society Security Portal
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-emerald-400 font-semibold">Active Gate</span>
              </div>
              <h1 className="text-lg font-black text-white">
                Guard Gate QR Verification
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeSocietyGate}
              onChange={(e) => setActiveSocietyGate(e.target.value)}
              className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-xl text-xs text-white focus:outline-none"
            >
              <option>Kalpataru Sparkle (Gate 1)</option>
              <option>Rustomjee Seasons (Gate 2)</option>
              <option>Lodha Bellissimo (Main Gate)</option>
              <option>All Societies (Central Gate)</option>
            </select>
          </div>
        </div>

        {/* Scan & Search Control Box */}
        <div className="p-5 bg-slate-800 rounded-3xl border border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Verify Visitor Booking</span>
            </h2>

            {/* Quick Demo Scan Button */}
            <button
              onClick={() => {
                setInputCode('PARK-BKC-7842');
                handleVerify('PARK-BKC-7842');
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30 transition-colors"
            >
              ⚡ Quick Test (PARK-BKC-7842)
            </button>
          </div>

          {/* Camera Scanner View */}
          {isScanning ? (
            <div className="space-y-3">
              <div
                id="qr-reader"
                className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border-2 border-amber-500 bg-black min-h-[260px]"
              />
              <button
                onClick={stopCameraScanner}
                className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close Camera
              </button>
            </div>
          ) : (
            <button
              onClick={startCameraScanner}
              className="w-full py-4 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <Camera className="w-5 h-5 text-slate-950" />
              <span>SCAN DRIVER'S QR CODE (CAMERA)</span>
            </button>
          )}

          {/* Manual Input Form */}
          <div className="pt-2 border-t border-slate-700/60">
            <span className="text-[11px] text-slate-400 mb-1.5 block">
              Or enter Pass Code / Vehicle Plate manually:
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. PARK-BKC-7842 or MH01DK4521"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl font-mono text-sm uppercase font-bold tracking-wider text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !inputCode.trim()}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Verify</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Action / Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-start gap-3 shadow-lg">
            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Verification Failed</h4>
              <p className="text-xs text-red-300 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {successActionMessage && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-sm flex items-start gap-3 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Gate Action Successful</h4>
              <p className="text-xs text-emerald-300 mt-0.5">{successActionMessage}</p>
            </div>
          </div>
        )}

        {/* Verification Result Card */}
        {verifyResult && (
          <div className="p-6 bg-slate-800 rounded-3xl border-2 border-emerald-500/80 shadow-2xl space-y-5 animate-in slide-in-from-bottom-2">
            {/* Status Header */}
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    VERIFIED & APPROVED
                  </span>
                  <h3 className="text-lg font-black text-white">
                    {verifyResult.spotDetails?.societyName}
                  </h3>
                </div>
              </div>

              {/* Status pill */}
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    verifyResult.status === 'CHECKED_IN'
                      ? 'bg-blue-600 text-white'
                      : verifyResult.status === 'COMPLETED'
                      ? 'bg-slate-600 text-white'
                      : 'bg-emerald-500 text-slate-950'
                  }`}
                >
                  {verifyResult.status === 'CHECKED_IN'
                    ? 'CURRENTLY PARKED'
                    : verifyResult.status}
                </span>
              </div>
            </div>

            {/* Vehicle & Spot Match Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Vehicle Card */}
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  VEHICLE REGISTRATION PLATE
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-1.5 py-0.5 bg-blue-700 rounded text-[9px] font-bold text-white">
                    IND
                  </div>
                  <span className="font-mono text-xl font-black text-amber-400 tracking-wider">
                    {verifyResult.vehicleNumber}
                  </span>
                </div>
                <span className="text-xs text-slate-400 block mt-1">
                  {verifyResult.vehicleModel || 'Car'}
                </span>
              </div>

              {/* Spot Card */}
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  ALLOCATED PARKING SPOT
                </span>
                <span className="font-black text-xl text-emerald-400 mt-1 block">
                  {verifyResult.spotDetails?.spotNumber}
                </span>
                <span className="text-xs text-slate-300 block mt-1">
                  Flat <strong className="text-white">{verifyResult.spotDetails?.flatNumber}</strong> (Host: {verifyResult.spotDetails?.hostName})
                </span>
              </div>
            </div>

            {/* Time Slot & Driver Info */}
            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-700/60 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Driver Info
                </span>
                <span className="font-bold text-white text-sm">
                  {verifyResult.driverName}
                </span>
                <span className="text-slate-400 block">{verifyResult.driverPhone}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Approved Slot
                </span>
                <span className="font-bold text-white text-sm">
                  {verifyResult.startTime} - {verifyResult.endTime}
                </span>
                <span className="text-slate-400 block">{verifyResult.bookingDate}</span>
              </div>
            </div>

            {/* Host Instructions */}
            {verifyResult.spotDetails?.entryInstructions && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-300">
                <strong>Host Instructions: </strong>
                <span>{verifyResult.spotDetails.entryInstructions}</span>
              </div>
            )}

            {/* Guard Large Action Buttons */}
            <div className="pt-2 space-y-2.5">
              {verifyResult.status !== 'CHECKED_IN' ? (
                <button
                  type="button"
                  onClick={handleApproveEntry}
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-6 h-6 text-slate-950" />
                  <span>✅ PERMIT ENTRY & RAISE BOOM BARRIER</span>
                </button>
              ) : (
                <div className="p-3 bg-blue-950/70 border border-blue-800 rounded-xl text-center text-xs text-blue-300 font-semibold mb-2">
                  Vehicle is currently parked inside society.
                </div>
              )}

              {verifyResult.status === 'CHECKED_IN' && (
                <button
                  type="button"
                  onClick={handleRecordExit}
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>RECORD VEHICLE EXIT & FREE SPOT</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Gate Entry Activity Log */}
        {gateLog.length > 0 && (
          <div className="p-5 bg-slate-800 rounded-3xl border border-slate-700 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Today's Security Gate Log
            </h3>
            <div className="space-y-2">
              {gateLog.map((log, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-slate-900 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.type === 'ENTRY'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {log.type}
                    </span>
                    <span className="font-mono font-bold text-white">{log.vehicle}</span>
                    <span className="text-slate-400">({log.driver})</span>
                  </div>
                  <div className="text-right text-slate-400">
                    <span className="text-slate-300 font-semibold">{log.spot}</span>
                    <span className="mx-1">•</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

