import User from '../Models/User.js';
import Role from '../Models/Role.js';

export const getUsers = async (req, res) => {
  const users = await User.find().populate('role');
  res.json(users);
};

export const assignRole = async (req, res) => {
  const { userId, roleId } = req.body;
  const user = await User.findByIdAndUpdate(userId, { role: roleId }, { new: true }).populate('role');
  res.json({ message: 'Role assigned successfully', user });
};
