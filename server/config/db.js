const mongoose = require('mongoose');

// Enable/disable buffering so requests return fast without hanging if offline
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-life-os';
    
    // Connect with 2.5s fast timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500
    });
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('MongoDB connection is required in production:', error.message);
      process.exit(1);
    }
    console.log('--------------------------------------------------');
    console.log('⚠️ Local MongoDB server is currently offline or unreachable.');
    console.log('App will automatically seed & serve initial data in memory.');
    console.log('To persist data permanently, start MongoDB service on port 27017.');
    console.log('--------------------------------------------------');
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = connectDB;
module.exports.getIsConnected = getIsConnected;
