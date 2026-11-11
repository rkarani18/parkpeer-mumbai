import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    spot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParkingSpot',
      required: [true, 'Parking spot reference is required'],
    },
    spotDetails: {
      societyName: { type: String, required: true },
      spotNumber: { type: String, required: true },
      flatNumber: { type: String, required: true },
      area: { type: String, required: true },
      address: { type: String, required: true },
      landmark: { type: String },
      hostName: { type: String, required: true },
      hostPhone: { type: String, required: true },
      entryInstructions: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      images: { type: [String], default: [] },
    },
    driverName: {
      type: String,
      required: [true, 'Driver name is required'],
      trim: true,
    },
    driverPhone: {
      type: String,
      required: [true, 'Driver contact number is required'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Vehicle plate number is required'],
      uppercase: true,
      trim: true,
    },
    vehicleModel: {
      type: String,
      trim: true,
      default: 'Car',
    },
    bookingDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Booking date is required'],
    },
    startTime: {
      type: String, // HH:mm
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // HH:mm
      required: [true, 'End time is required'],
    },
    durationHours: {
      type: Number,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
    },
    dailyRate: {
      type: Number,
      default: 150,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    qrPayload: {
      type: String,
      required: true,
    },
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null,
    },
    guardVerifiedBy: {
      type: String,
      default: null,
    },
    guardNotes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ 'spotDetails.societyName': 1, bookingDate: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
