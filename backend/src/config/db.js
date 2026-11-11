import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mumbai_parking_db', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(` MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    console.error('Make sure MongoDB service is running on 127.0.0.1:27017');
    throw error;
  }
};

