import express from 'express';
import crypto from 'crypto';
import { Booking } from '../models/Booking.js';
import { ParkingSpot } from '../models/ParkingSpot.js';

const router = express.Router();

// Helper to compute hours between HH:mm strings
const calculateHours = (start, end) => {
  if (!start || !end) return 1;
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const startMinutes = startH * 60 + (startM || 0);
  const endMinutes = endH * 60 + (endM || 0);
  const diffMinutes = endMinutes - startMinutes;
  if (diffMinutes <= 0) return 1;
  return Math.max(1, Math.round((diffMinutes / 60) * 10) / 10);
};

// Generate verification code
const generateVerificationCode = (area = 'MUM') => {
  const cleanArea = area.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'MUM';
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PARK-${cleanArea}-${randomChars}`;
};

// POST /api/bookings - Create new booking (Driver View)
router.post('/', async (req, res) => {
  try {
    const {
      spotId,
      driverName,
      driverPhone,
      vehicleNumber,
      vehicleModel,
      bookingDate,
      startTime,
      endTime,
    } = req.body;

    if (!spotId) {
      return res.status(400).json({ success: false, message: 'Parking spot ID is required' });
    }

    const spot = await ParkingSpot.findById(spotId);
    if (!spot) {
      return res.status(404).json({ success: false, message: 'Parking spot not found' });
    }

    const durationHours = calculateHours(startTime || '09:00', endTime || '18:00');
    const hourlyRate = spot.hourlyRate || 20;
    const dailyCap = spot.dailyRate || 150;
    // Fair pricing: Cap at daily pass rate (₹100 - ₹200/day max)
    const totalAmount = durationHours >= 5 
      ? dailyCap 
      : Math.min(Math.round(durationHours * hourlyRate), dailyCap);
    const verificationCode = generateVerificationCode(spot.area);

    // Dynamic QR payload formatted for instant verification
    const qrData = {
      app: 'ParkPeer Mumbai',
      verificationCode,
      spotId: spot._id,
      society: spot.societyName,
      flat: spot.flatNumber,
      spotNumber: spot.spotNumber,
      vehicle: vehicleNumber.toUpperCase().trim(),
      driver: driverName.trim(),
      date: bookingDate || new Date().toISOString().split('T')[0],
      slot: `${startTime} - ${endTime}`,
      timestamp: Date.now(),
    };

    const newBooking = new Booking({
      spot: spot._id,
      spotDetails: {
        societyName: spot.societyName,
        spotNumber: spot.spotNumber,
        flatNumber: spot.flatNumber,
        area: spot.area,
        address: spot.address,
        landmark: spot.landmark,
        hostName: spot.hostName,
        hostPhone: spot.hostPhone,
        entryInstructions: spot.entryInstructions,
        latitude: spot.latitude,
        longitude: spot.longitude,
        images: spot.images || [],
      },
      driverName,
      driverPhone,
      vehicleNumber: vehicleNumber.toUpperCase().trim(),
      vehicleModel: vehicleModel || 'Car',
      bookingDate: bookingDate || new Date().toISOString().split('T')[0],
      startTime: startTime || '09:00',
      endTime: endTime || '18:00',
      durationHours,
      hourlyRate,
      dailyRate: dailyCap,
      totalAmount,
      status: 'CONFIRMED',
      verificationCode,
      qrPayload: JSON.stringify(qrData),
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully! Dynamic QR code generated.',
      data: savedBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET /api/bookings - Fetch list of bookings
router.get('/', async (req, res) => {
  try {
    const { driverPhone, societyName, status } = req.query;
    const filter = {};

    if (driverPhone) filter.driverPhone = driverPhone;
    if (societyName) filter['spotDetails.societyName'] = new RegExp(societyName, 'i');
    if (status) filter.status = status;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/bookings/verify/:code - Verify QR code or verification code (Guard View)
router.get('/verify/:code', async (req, res) => {
  try {
    const code = req.params.code.trim().toUpperCase();

    // Check if code matches verificationCode OR if it's a booking _id
    let booking = await Booking.findOne({ verificationCode: code }).populate('spot');

    if (!booking && code.match(/^[0-9a-fA-F]{24}$/)) {
      booking = await Booking.findById(code).populate('spot');
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: `No active booking found matching code: "${code}". Please check with driver.`,
      });
    }

    res.json({
      success: true,
      valid: true,
      message: 'Valid booking identified',
      data: booking,
    });
  } catch (error) {
    console.error('Error verifying code:', error);
    res.status(500).json({ success: false, valid: false, message: error.message });
  }
});

// GET /api/bookings/:id - Single booking details (Pass View)
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('spot');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings/:id/checkin - Security Guard Entry Approval
router.post('/:id/checkin', async (req, res) => {
  try {
    const { guardName, notes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.status === 'CHECKED_IN') {
      return res.status(400).json({
        success: false,
        message: `Driver already checked in at ${new Date(booking.checkInTime).toLocaleTimeString('en-IN')}`,
        data: booking,
      });
    }

    booking.status = 'CHECKED_IN';
    booking.checkInTime = new Date();
    booking.guardVerifiedBy = guardName || 'Gate 1 Security Officer';
    booking.guardNotes = notes || 'Vehicle plate and spot number verified.';

    await booking.save();

    res.json({
      success: true,
      message: '✅ Driver entry approved! Barrier raised & vehicle admitted.',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings/:id/checkout - Security Guard Exit Verification
router.post('/:id/checkout', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = 'COMPLETED';
    booking.checkOutTime = new Date();
    await booking.save();

    res.json({
      success: true,
      message: '✅ Vehicle checkout recorded. Parking spot is now free.',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

