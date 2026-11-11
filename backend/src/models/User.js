import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide user name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['host', 'driver', 'guard', 'admin'],
      default: 'driver',
    },
    societyName: {
      type: String,
      trim: true,
    },
    flatNumber: {
      type: String,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    vehicleModel: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);

