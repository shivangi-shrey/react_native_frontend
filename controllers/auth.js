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
    const { name, email, password } = req.body;

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Count total users
    const userCount = await User.countDocuments();

    let role;
    if (userCount === 0) {
      // 🔥 First user → Admin
      role = await Role.findOne({ name: 'Admin' });
      if (!role) {
        // Auto-create Admin role if missing
        role = await Role.create({ name: 'Admin', permissions: ['*'] });
      }
      console.log("👑 First user assigned as Admin");
    } else {
      // 🧱 Others → Employee
      role = await Role.findOne({ name: 'Employee' });
      if (!role) {
        role = await Role.create({ name: 'Employee', permissions: [] });
      }
      console.log("👤 Assigned as Employee");
    }

    // ✅ Create and save user (password plain form me)
    const newUser = await User.create({
      name,
      email,
      password, // hashing model me auto ho jaayega
      role: role._id,
    });

    console.log("✅ User saved successfully");
    res.status(201).json({
      message: `User registered successfully as ${role.name}`,
      user: { id: newUser._id, email: newUser.email, role: role.name },
    });

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

    // ✅ Check if user exists
    const user = await User.findOne({ email }).populate('role');
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Invalid credentials");
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // ✅ Get role name
    const userRole = user.role?.name || 'Employee';

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: userRole },
      process.env.JWT_SECRET || 'mysecretkey',
      { expiresIn: '1d' }
    );

    console.log(`✅ Login successful as ${userRole}`);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: userRole,
      },
    });

  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = req.user; // 🧠 middleware se aaya

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
};
