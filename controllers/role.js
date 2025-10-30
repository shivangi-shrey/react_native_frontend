import Role from '../Models/Role.js';

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Role.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Role already exists' });

    const role = new Role({ name });
    await role.save();
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (err) {
    res.status(500).json({ message: 'Error creating role', error: err.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching roles', error: err.message });
  }
};
export const updateRole = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Role.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({ message: 'Role deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};