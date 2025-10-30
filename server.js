import dotenv from 'dotenv'
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

 import authRoutes from "./Routes/authRoutes.js";
 import userRoutes from './Routes/users.js';
import roleRoutes from './Routes/roles.js';


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

app.get("/api", (req, res) => {
  res.send("API running successfully");
});

const PORT = process.env.PORT|| 5000;
app.listen(PORT, "0.0.0.0", () => console.log("Server running on port 10000"));
