const { Notification, User } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');

const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const { is_read, type } = req.query;

    const where = { user_id: req.user.id };
    if (is_read !== undefined) where.is_read = is_read === 'true';
    if (type) where.type = type;

    const { count, rows } = await Notification.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return res.json({ success: true, data: rows, meta: paginationMeta(count, page, limit) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markRead = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!notif) {
      return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
    }

    await notif.update({ is_read: true });
    return res.json({ success: true, message: 'Đã đánh dấu đã đọc' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    );

    return res.json({ success: true, message: 'Đã đọc tất cả thông báo' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const notif = await Notification.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!notif) {
      return res.status(404).json({ success: false, message: 'Thông báo không tồn tại' });
    }

    await notif.destroy();
    return res.json({ success: true, message: 'Đã xóa thông báo' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/notifications/broadcast (Admin)
// body: { title, content, type?, role_id? }
const broadcast = async (req, res) => {
  try {
    const { title, content, type, role_id } = req.body;

    // Lấy danh sách user cần gửi
    const userWhere = {};
    if (role_id) userWhere.role_id = role_id;

    const users = await User.findAll({ where: userWhere, attributes: ['id'] });

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng nào phù hợp' });
    }

    const notifications = users.map((u) => ({
      user_id: u.id,
      title,
      content,
      type: type || 'system',
      is_read: false,
    }));

    await Notification.bulkCreate(notifications);

    return res.status(201).json({
      success: true,
      message: `Đã gửi thông báo đến ${notifications.length} người dùng`,
      data: { sent_count: notifications.length },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, markRead, markAllRead, remove, broadcast };
