import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "./Models/Role.js"; // <-- apne Models folder ka sahi path dena

dotenv.config();

const roles = [
  { name: "Admin" },
  { name: "Employee" }
];

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB Connected for seeding roles");

    for (let roleData of roles) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) {
        await Role.create(roleData);
        console.log(`🌱 Role '${roleData.name}' created`);
      } else {
        console.log(`⚙️ Role '${roleData.name}' already exists`);
      }
    }

    console.log("✅ Roles seeding completed");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("❌ Error seeding roles:", err.message);
  });
