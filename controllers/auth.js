import User from '../Models/User.js';
import Role from '../Models/Role.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ======================
// 🧩 SIGNUP CONTROLLER
// ======================
export const signup = async (req, res) => {
  console.log("📩 Signup request received:", req.body);

  try {
    const { name, email, password, roleName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    // Find role or default to Employee
    const role = await Role.findOne({ name: roleName }) || await Role.findOne({ name: 'Employee' });
    if (!role) {
      console.log("❌ Role not found");
      return res.status(400).json({ message: 'Role not found' });
    }

    // Create and save new user
    const newUser = new User({ name, email, password, role: role._id });
    await newUser.save();

    console.log("✅ User saved successfully");
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error("🔥 Signup error:", err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// ======================
// 🔐 LOGIN CONTROLLER
// ======================
export const login = async (req, res) => {
  console.log("📩 Login request received:", req.body);

  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Invalid credentials");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role.name },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: '1d' }
    );

    console.log("✅ Login successful");
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email, role: user.role.name }
    });

  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
