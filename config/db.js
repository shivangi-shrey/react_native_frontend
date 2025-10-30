import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // .env file load karne ke liye

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // ❌ quotes hatao!
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
