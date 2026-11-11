import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import spotRoutes from './routes/spotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { seedDatabase } from './seed.js';
import { ParkingSpot } from './models/ParkingSpot.js';
import { Booking } from './models/Booking.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/spots', spotRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'ParkPeer Mumbai API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Reset / reseed endpoint for quick testing
app.post('/api/seed/reset', async (req, res) => {
  try {
    await ParkingSpot.deleteMany({});
    await Booking.deleteMany({});
    await seedDatabase();
    res.json({ success: true, message: 'Database reset & reseeded with fresh Mumbai parking spots!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀 ParkPeer Mumbai Backend running on http://localhost:${PORT}`);
      console.log(`📡 Spots API: http://localhost:${PORT}/api/spots`);
      console.log(`📡 Bookings API: http://localhost:${PORT}/api/bookings`);
      console.log(`🛡️  Verification API: http://localhost:${PORT}/api/bookings/verify/:code\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

