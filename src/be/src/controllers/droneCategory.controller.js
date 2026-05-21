const { DroneCategory, Drone } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/drone-categories - q, page, limit
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const { q, sort_by = 'name', sort_order = 'ASC' } = req.query;

    const where = {};
    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    const validSortFields = ['id', 'name', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'name';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await DroneCategory.findAndCountAll({
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

const getById = async (req, res) => {
  try {
    const item = await DroneCategory.findByPk(req.params.id, {
      include: [{ model: Drone, as: 'drones', attributes: ['id', 'model_name'], limit: 5 }],
    });
    if (!item) return res.status(404).json({ success: false, message: 'Danh mục máy bay không tồn tại' });
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await DroneCategory.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Danh mục với tên này đã tồn tại trong hệ thống' });
    }

    const item = await DroneCategory.create({ name, description });
    return res.status(201).json({ success: true, message: 'Thêm danh mục thành công', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const item = await DroneCategory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Danh mục máy bay không tồn tại' });

    const { name, description } = req.body;

    if (name && name !== item.name) {
      const existing = await DroneCategory.findOne({ where: { name, id: { [Op.ne]: item.id } } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Tên danh mục này đã tồn tại' });
      }
    }

    await item.update({ name, description });
    return res.json({ success: true, message: 'Cập nhật danh mục thành công', data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const item = await DroneCategory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Danh mục máy bay không tồn tại' });

    const droneCount = await Drone.count({ where: { category_id: item.id } });
    if (droneCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Không thể xóa danh mục này vì có ${droneCount} máy bay đang sử dụng`,
      });
    }

    await item.destroy();
    return res.json({ success: true, message: 'Đã xóa danh mục thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
