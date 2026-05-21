const { Role } = require('../models');

const getAll = async (req, res) => {
  try {
    const roles = await Role.findAll({ order: [['id', 'ASC']] });
    return res.json({ success: true, data: roles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Role không tồn tại' });
    return res.json({ success: true, data: role });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Role.findOne({ where: { name } });
    if (exists) return res.status(409).json({ success: false, message: 'Role đã tồn tại' });

    const role = await Role.create({ name, description });
    return res.status(201).json({ success: true, data: role });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Role không tồn tại' });
    const { description } = req.body;
    await role.update({ description });
    return res.json({ success: true, data: role });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update };
