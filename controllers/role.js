import Role from '../Models/Role.js';

export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const existing = await Role.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Role already exists' });

    const role = await Role.create({ name, permissions });
    res.json({ message: 'Role created successfully', role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(id, { name, permissions }, { new: true });
    res.json({ message: 'Role updated successfully', role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

