const { Manufacturer, Drone } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/manufacturers - q, country, page, limit
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const { q, country, sort_by = 'name', sort_order = 'ASC' } = req.query;

    const where = {};
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { support_email: { [Op.like]: `%${q}%` } },
      ];
    }
    if (country) where.country = { [Op.like]: `%${country}%` };

    const validSortFields = ['id', 'name', 'country', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'name';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Manufacturer.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderField, orderDir]],
    });

    return res.json({ success: true, data: rows, meta: paginationMeta(count, page, limit) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/manufacturers/:id
const getById = async (req, res) => {
  try {
    const item = await Manufacturer.findByPk(req.params.id, {
      include: [{ model: Drone, as: 'drones', attributes: ['id', 'model_name', 'serial_number'], limit: 5 }],
    });
    if (!item) return res.status(404).json({ success: false, message: 'Nhà sản xuất không tồn tại' });
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/manufacturers (Admin)
const create = async (req, res) => {
  try {
    const { name, country, support_email } = req.body;

    const existing = await Manufacturer.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Nhà sản xuất này đã tồn tại trong hệ thống' });
    }

    const item = await Manufacturer.create({ name, country, support_email });
    return res.status(201).json({ success: true, message: 'Thêm nhà sản xuất thành công', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/manufacturers/:id (Admin)
const update = async (req, res) => {
  try {
    const item = await Manufacturer.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Nhà sản xuất không tồn tại' });

    const { name, country, support_email } = req.body;

    if (name && name !== item.name) {
      const existing = await Manufacturer.findOne({ where: { name, id: { [Op.ne]: item.id } } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Tên nhà sản xuất này đã tồn tại' });
      }
    }

    await item.update({ name, country, support_email });
    return res.json({ success: true, message: 'Cập nhật nhà sản xuất thành công', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/manufacturers/:id (Admin)
const remove = async (req, res) => {
  try {
    const item = await Manufacturer.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Nhà sản xuất không tồn tại' });

    const droneCount = await Drone.count({ where: { manufacturer_id: item.id } });
    if (droneCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Không thể xóa nhà sản xuất này vì có ${droneCount} máy bay đang liên kết`,
      });
    }

    await item.destroy();
    return res.json({ success: true, message: 'Đã xóa nhà sản xuất thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
