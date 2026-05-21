const { Violation, Drone, User, Notification } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/violations
// Query: q, status, drone_id, user_id, date_from, date_to, min_fine, max_fine, page, limit, sort_by, sort_order
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const {
      q,
      status,
      drone_id,
      user_id,
      date_from,
      date_to,
      min_fine,
      max_fine,
      sort_by = 'date_recorded',
      sort_order = 'DESC',
    } = req.query;

    const where = {};

    // Tìm kiếm theo loại vi phạm hoặc mô tả
    if (q) {
      where[Op.or] = [
        { violation_type: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    if (status) where.status = status;
    if (drone_id) where.drone_id = drone_id;

    // Lọc theo ngày vi phạm
    if (date_from || date_to) {
      where.date_recorded = {};
      if (date_from) where.date_recorded[Op.gte] = date_from;
      if (date_to) where.date_recorded[Op.lte] = date_to;
    }

    // Lọc theo mức phạt
    if (min_fine || max_fine) {
      where.fine_amount = {};
      if (min_fine) where.fine_amount[Op.gte] = parseFloat(min_fine);
      if (max_fine) where.fine_amount[Op.lte] = parseFloat(max_fine);
    }

    if (req.user.role.name === 'user') {
      where.user_id = req.user.id;
    } else if (user_id) {
      where.user_id = user_id;
    }

    const validSortFields = ['id', 'date_recorded', 'fine_amount', 'status', 'violation_type', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'date_recorded';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Violation.findAndCountAll({
      where,
      include: [
        { model: Drone, as: 'drone', attributes: ['id', 'model_name', 'serial_number'] },
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'phone'] },
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

// GET /api/violations/:id
const getById = async (req, res) => {
  try {
    const violation = await Violation.findByPk(req.params.id, {
      include: [
        { model: Drone, as: 'drone' },
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
      ],
    });

    if (!violation) {
      return res.status(404).json({ success: false, message: 'Vi phạm không tồn tại' });
    }

    // User chỉ xem vi phạm của mình
    if (req.user.role.name === 'user' && violation.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xem vi phạm này' });
    }

    return res.json({ success: true, data: violation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/violations (Admin/Police)
const create = async (req, res) => {
  try {
    const { drone_id, user_id, violation_type, description, fine_amount, date_recorded, evidence_images } = req.body;

    const drone = await Drone.findByPk(drone_id);
    if (!drone) {
      return res.status(404).json({ success: false, message: 'Máy bay không tồn tại trong hệ thống' });
    }

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại trong hệ thống' });
    }

    if (drone.owner_id !== user_id) {
      return res.status(400).json({ success: false, message: 'Người dùng được chọn không phải là chủ sở hữu của máy bay vi phạm' });
    }

    const violation = await Violation.create({
      drone_id,
      user_id,
      violation_type,
      description: description || null,
      fine_amount: fine_amount || 0,
      status: 'unpaid',
      date_recorded: date_recorded || new Date(),
      evidence_images: evidence_images || [],
    });

    await Notification.create({
      user_id,
      title: '⚠️ Bạn có vi phạm mới',
      content: `Máy bay ${drone.model_name} bị ghi nhận vi phạm: "${violation_type}". Mức phạt: ${new Intl.NumberFormat('vi-VN').format(fine_amount || 0)} VND`,
      type: 'system',
    });

    return res.status(201).json({ success: true, message: 'Ghi nhận vi phạm thành công', data: violation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/violations/:id (Admin/Police)
const update = async (req, res) => {
  try {
    const violation = await Violation.findByPk(req.params.id);
    if (!violation) {
      return res.status(404).json({ success: false, message: 'Vi phạm không tồn tại' });
    }

    if (violation.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Không thể chỉnh sửa vi phạm đã nộp phạt' });
    }

    const { violation_type, description, fine_amount, date_recorded, evidence_images } = req.body;
    const updates = {};
    if (violation_type !== undefined) updates.violation_type = violation_type;
    if (description !== undefined) updates.description = description;
    if (fine_amount !== undefined) updates.fine_amount = fine_amount;
    if (date_recorded !== undefined) updates.date_recorded = date_recorded;
    if (evidence_images !== undefined) updates.evidence_images = evidence_images;

    await violation.update(updates);
    return res.json({ success: true, message: 'Cập nhật vi phạm thành công', data: violation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/violations/:id/status (Admin)
const updateStatus = async (req, res) => {
  try {
    const violation = await Violation.findByPk(req.params.id);
    if (!violation) {
      return res.status(404).json({ success: false, message: 'Vi phạm không tồn tại' });
    }

    const { status } = req.body;

    if (violation.status === status) {
      return res.status(400).json({ success: false, message: `Vi phạm đã ở trạng thái ${status}` });
    }

    await violation.update({ status });

    if (status === 'paid') {
      await Notification.create({
        user_id: violation.user_id,
        title: '✅ Xác nhận đã nộp phạt',
        content: `Vi phạm "${violation.violation_type}" đã được xác nhận hoàn thành nộp phạt`,
        type: 'system',
      });
    }

    return res.json({ success: true, message: `Đã cập nhật trạng thái vi phạm thành ${status === 'paid' ? 'đã nộp phạt' : 'chưa nộp phạt'}`, data: violation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/violations/:id/pay (User/Admin/Police - Mock pay)
const pay = async (req, res) => {
  try {
    const violation = await Violation.findByPk(req.params.id);
    if (!violation) {
      return res.status(404).json({ success: false, message: 'Vi phạm không tồn tại' });
    }

    if (req.user.role.name === 'user' && violation.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền thanh toán vi phạm này' });
    }

    if (violation.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Vi phạm đã được thanh toán' });
    }

    await violation.update({ status: 'paid' });

    // Tạo thông báo
    await Notification.create({
      user_id: violation.user_id,
      title: '✅ Nộp phạt thành công',
      content: `Đã hoàn tất thanh toán trực tuyến biên lai lỗi: "${violation.violation_type}".`,
      type: 'system',
    });

    return res.json({ success: true, message: 'Thanh toán vi phạm thành công', data: violation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/violations/:id (Admin)
const remove = async (req, res) => {
  try {
    const violation = await Violation.findByPk(req.params.id);
    if (!violation) {
      return res.status(404).json({ success: false, message: 'Vi phạm không tồn tại' });
    }

    if (violation.status === 'paid') {
      return res.status(400).json({ success: false, message: 'Không thể xóa vi phạm đã nộp phạt' });
    }

    await violation.destroy();
    return res.json({ success: true, message: 'Đã xóa vi phạm thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, updateStatus, update, pay, remove };
