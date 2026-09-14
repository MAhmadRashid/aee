require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log("Connecting to:", uri);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
    console.log("SUCCESS: Connected to MongoDB!");
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  }
}

testConnection();
