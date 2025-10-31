import User from '../Models/User.js';
import Role from '../Models/Role.js';

export const getUsers = async (req, res) => {
  const users = await User.find().populate('role');
  res.json(users);
};

export const assignRole = async (req, res) => {
  try{
  const { userId, roleId } = req.body;
  const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ message: "Role not found" });

  const user = await User.findByIdAndUpdate(userId, { role: roleId }, { new: true }).populate('role');
  res.json({ message: 'Role assigned successfully', user })
}
catch (err) {
    res.status(500).json({ message: err.message });
  }
};
