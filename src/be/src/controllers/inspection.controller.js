const { Inspection, Drone, User } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/inspections
// Query: drone_id, inspector_id, result, date_from, date_to, q, page, limit, sort_by, sort_order
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const {
      drone_id,
      inspector_id,
      result,
      date_from,
      date_to,
      q,
      sort_by = 'inspection_date',
      sort_order = 'DESC',
    } = req.query;

    const where = {};

    if (drone_id) where.drone_id = drone_id;
    if (result) where.result = result;

    // Lọc theo khoảng ngày kiểm tra
    if (date_from || date_to) {
      where.inspection_date = {};
      if (date_from) where.inspection_date[Op.gte] = date_from;
      if (date_to) where.inspection_date[Op.lte] = date_to;
    }

    // Tìm kiếm ghi chú
    if (q) {
      where.notes = { [Op.like]: `%${q}%` };
    }

    if (req.user.role.name === 'police') {
      where.inspector_id = req.user.id;
    } else if (inspector_id) {
      where.inspector_id = inspector_id;
    }

    const validSortFields = ['id', 'inspection_date', 'result', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'inspection_date';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Inspection.findAndCountAll({
      where,
      include: [
        { model: Drone, as: 'drone', attributes: ['id', 'model_name', 'serial_number'] },
        { model: User, as: 'inspector', attributes: ['id', 'full_name', 'email'] },
      ],
      limit,
      offset,
      order: [[orderField, orderDir]],
      distinct: true,
    });

    return res.json({ success: true, data: rows, meta: paginationMeta(count, page, limit) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/inspections/:id
const getById = async (req, res) => {
  try {
    const inspection = await Inspection.findByPk(req.params.id, {
      include: [
        { model: Drone, as: 'drone' },
        { model: User, as: 'inspector', attributes: ['id', 'full_name', 'email', 'phone'] },
      ],
    });

    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Biên bản kiểm tra không tồn tại' });
    }

    return res.json({ success: true, data: inspection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/inspections (Police/Admin)
const create = async (req, res) => {
  try {
    const { drone_id, inspection_date, result, notes, inspection_images } = req.body;

    const drone = await Drone.findByPk(drone_id);
    if (!drone) {
      return res.status(404).json({ success: false, message: 'Máy bay không tồn tại trong hệ thống' });
    }

    // Kiểm tra đã có biên bản kiểm tra ngày hôm nay cho drone này chưa
    const today = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD
    const alreadyInspected = await Inspection.findOne({
      where: { drone_id, inspector_id: req.user.id, inspection_date: inspection_date || today },
    });

    if (alreadyInspected) {
      return res.status(409).json({
        success: false,
        message: 'Bạn đã tạo biên bản kiểm tra cho máy bay này vào ngày này rồi',
      });
    }

    const inspection = await Inspection.create({
      drone_id,
      inspector_id: req.user.id,
      inspection_date: inspection_date || today,  // default: today
      result,
      notes: notes || null,
      inspection_images: inspection_images || [],
    });

    const created = await Inspection.findByPk(inspection.id, {
      include: [
        { model: Drone, as: 'drone', attributes: ['id', 'model_name', 'serial_number'] },
        { model: User, as: 'inspector', attributes: ['id', 'full_name'] },
      ],
    });

    return res.status(201).json({ success: true, message: 'Lập biên bản kiểm tra thành công', data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/inspections/:id (Police/Admin)
const update = async (req, res) => {
  try {
    const inspection = await Inspection.findByPk(req.params.id);
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Biên bản kiểm tra không tồn tại' });
    }

    if (req.user.role.name === 'police' && inspection.inspector_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa biên bản này' });
    }

    const { inspection_date, result, notes, inspection_images } = req.body;
    await inspection.update({ inspection_date, result, notes, inspection_images });

    return res.json({ success: true, message: 'Cập nhật biên bản kiểm tra thành công', data: inspection });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/inspections/:id (Admin)
const remove = async (req, res) => {
  try {
    const inspection = await Inspection.findByPk(req.params.id);
    if (!inspection) {
      return res.status(404).json({ success: false, message: 'Biên bản kiểm tra không tồn tại' });
    }

    await inspection.destroy();
    return res.json({ success: true, message: 'Đã xóa biên bản kiểm tra thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
