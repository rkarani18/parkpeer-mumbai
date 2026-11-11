import mongoose from 'mongoose';

const parkingSpotSchema = new mongoose.Schema(
  {
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    hostName: {
      type: String,
      required: [true, 'Host name is required'],
      trim: true,
    },
    hostPhone: {
      type: String,
      required: [true, 'Host phone number is required'],
      trim: true,
    },
    societyName: {
      type: String,
      required: [true, 'Society name is required'],
      trim: true,
    },
    flatNumber: {
      type: String,
      required: [true, 'Flat number is required'],
      trim: true,
    },
    spotNumber: {
      type: String,
      required: [true, 'Parking spot number is required'],
      trim: true,
    },
    spotType: {
      type: String,
      enum: ['Covered', 'Basement', 'Open', 'Stilt'],
      default: 'Covered',
    },
    vehicleCompatibility: {
      type: String,
      enum: ['Any Car', 'Hatchback / Sedan', 'SUV / Large', 'Two Wheeler'],
      default: 'Any Car',
    },
    area: {
      type: String,
      required: [true, 'Mumbai hub/area is required (e.g. BKC, Lower Parel)'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    landmark: {
      type: String,
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    hourlyRate: {
      type: Number,
      default: 20,
      min: [5, 'Hourly rate must be at least ₹5'],
    },
    dailyRate: {
      type: Number,
      default: 150,
      min: [50, 'Daily rate must be at least ₹50'],
    },
    availability: {
      days: {
        type: [String],
        default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      },
      startTime: {
        type: String,
        default: '09:00',
      },
      endTime: {
        type: String,
        default: '18:00',
      },
    },
    amenities: {
      type: [String],
      default: ['24/7 Security Guard', 'CCTV Surveillance', 'Covered Roof'],
    },
    entryInstructions: {
      type: String,
      default: 'Show dynamic QR code to security guard at main gate.',
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'Parking spot photos are compulsory'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one parking spot photo is compulsory',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geo or text queries if needed
parkingSpotSchema.index({ area: 1, isActive: 1 });
parkingSpotSchema.index({ latitude: 1, longitude: 1 });

export const ParkingSpot = mongoose.model('ParkingSpot', parkingSpotSchema);

