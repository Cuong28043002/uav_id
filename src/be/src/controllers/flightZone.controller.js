const { FlightZone } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/flight/zones
// Query: q, zone_type, page, limit, sort_by, sort_order
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const { q, zone_type, sort_by = 'name', sort_order = 'ASC' } = req.query;

    const where = {};

    if (q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    if (zone_type) where.zone_type = zone_type;

    const validSortFields = ['id', 'name', 'zone_type', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'name';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await FlightZone.findAndCountAll({
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

// GET /api/flight/zones/:id
const getById = async (req, res) => {
  try {
    const zone = await FlightZone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Khu vực bay không tồn tại' });
    }
    return res.json({ success: true, data: zone });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/flight/zones (Admin)
const create = async (req, res) => {
  try {
    const { name, zone_type, coordinates, description } = req.body;

    const existing = await FlightZone.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Tên khu vực bay này đã tồn tại trong hệ thống' });
    }

    const zone = await FlightZone.create({ name, zone_type, coordinates: coordinates || null, description });
    return res.status(201).json({ success: true, message: 'Tạo khu vực bay thành công', data: zone });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/flight/zones/:id (Admin)
const update = async (req, res) => {
  try {
    const zone = await FlightZone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Khu vực bay không tồn tại' });
    }

    const { name, zone_type, coordinates, description } = req.body;

    // Kiểm tra trùng tên (không tính bản ghi hiện tại)
    if (name && name !== zone.name) {
      const existing = await FlightZone.findOne({ where: { name, id: { [Op.ne]: zone.id } } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Tên khu vực bay này đã tồn tại' });
      }
    }

    await zone.update({ name, zone_type, coordinates, description });
    return res.json({ success: true, message: 'Cập nhật khu vực bay thành công', data: zone });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/flight/zones/:id (Admin)
const remove = async (req, res) => {
  try {
    const { FlightPermit } = require('../models');
    const zone = await FlightZone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Khu vực bay không tồn tại' });
    }

    // Kiểm tra có giấy phép liên quan
    const permitCount = await FlightPermit.count({ where: { zone_id: zone.id } });
    if (permitCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Không thể xóa khu vực đang có ${permitCount} giấy phép bay liên quan`,
      });
    }

    await zone.destroy();
    return res.json({ success: true, message: 'Đã xóa khu vực bay thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
