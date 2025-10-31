import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'Access denied, token missing' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // MongoDB se user find karo
    const user = await User.findById(decoded.id).populate('role'); 
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.user = user; // ab poora user object store ho gaya
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
