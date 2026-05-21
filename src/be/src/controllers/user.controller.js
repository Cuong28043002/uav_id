const { User, Role, Drone } = require('../models');
const { hashPassword, paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/users
// Query: q, status, role_id, created_from, created_to, page, limit, sort_by, sort_order
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const { q, status, role_id, created_from, created_to, sort_by = 'createdAt', sort_order = 'DESC' } = req.query;

    const where = {};

    // Tìm kiếm toàn văn: họ tên, email, số điện thoại, CCCD
    if (q) {
      where[Op.or] = [
        { full_name: { [Op.like]: `%${q}%` } },
        { email: { [Op.like]: `%${q}%` } },
        { phone: { [Op.like]: `%${q}%` } },
        { cccd_number: { [Op.like]: `%${q}%` } },
      ];
    }

    if (status) where.status = status;
    if (role_id) where.role_id = role_id;

    // Lọc theo khoảng thời gian tạo
    if (created_from || created_to) {
      where.createdAt = {};
      if (created_from) where.createdAt[Op.gte] = new Date(created_from);
      if (created_to) where.createdAt[Op.lte] = new Date(created_to + ' 23:59:59');
    }

    const validSortFields = ['id', 'full_name', 'email', 'createdAt', 'status'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'createdAt';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: Role, as: 'role', attributes: ['id', 'name'] }],
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [[orderField, orderDir]],
      distinct: true,
    });

    return res.json({
      success: true,
      data: rows,
      meta: paginationMeta(count, page, limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/:id
const getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Role, as: 'role', attributes: ['id', 'name', 'description'] },
        { model: Drone, as: 'drones', attributes: ['id', 'model_name', 'serial_number'], limit: 5 },
      ],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/:id
const update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    const { full_name, phone, address, role_id, status, cccd_number } = req.body;

    // Kiểm tra CCCD trùng (nếu thay đổi)
    if (cccd_number && cccd_number !== user.cccd_number) {
      const existing = await User.findOne({ where: { cccd_number, id: { [Op.ne]: user.id } } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Số CCCD đã được sử dụng bởi tài khoản khác' });
      }
    }

    await user.update({ full_name, phone, address, role_id, status, cccd_number });
    const updated = await User.findByPk(user.id, { include: [{ model: Role, as: 'role' }], attributes: { exclude: ['password'] } });

    return res.json({ success: true, message: 'Cập nhật người dùng thành công', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/users/:id/status
const updateStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    // Không cho tự khóa tài khoản mình
    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Không thể thay đổi trạng thái tài khoản của chính bạn' });
    }

    const { status } = req.body;
    await user.update({ status });

    return res.json({
      success: true,
      message: `Tài khoản đã ${status === 'banned' ? 'bị khóa' : 'được mở khóa'} thành công`,
      data: { id: user.id, status },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/:id
const remove = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Không thể xóa tài khoản của chính bạn' });
    }

    const droneCount = await Drone.count({ where: { owner_id: user.id } });
    if (droneCount > 0) {
      return res.status(409).json({
        success: false,
        message: `Không thể xóa người dùng này vì họ đang sở hữu ${droneCount} máy bay`,
      });
    }

    await user.destroy();
    return res.json({ success: true, message: 'Đã xóa người dùng thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Role, as: 'role', attributes: ['id', 'name'] },
        { model: Drone, as: 'drones', attributes: ['id', 'model_name', 'serial_number'] },
      ],
      attributes: { exclude: ['password'] },
    });
    return res.json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const { full_name, phone, address, cccd_number } = req.body;

    // Kiểm tra CCCD trùng (nếu thay đổi)
    if (cccd_number && cccd_number !== user.cccd_number) {
      const existing = await User.findOne({ where: { cccd_number, id: { [Op.ne]: user.id } } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Số CCCD đã được sử dụng bởi tài khoản khác' });
      }
    }

    await user.update({ full_name, phone, address, cccd_number });
    const updated = await User.findByPk(user.id, { attributes: { exclude: ['password'] } });
    return res.json({ success: true, message: 'Cập nhật hồ sơ thành công', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, update, updateStatus, remove, getProfile, updateProfile };
