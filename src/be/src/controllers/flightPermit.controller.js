const { FlightPermit, Drone, User, FlightZone, Notification, Registration } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/flight/permits
// Query: status, drone_id, zone_id, user_id, start_from, start_to, created_from, created_to, page, limit
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const {
      status,
      drone_id,
      zone_id,
      user_id,
      start_from,
      start_to,
      created_from,
      created_to,
      q,
      sort_by = 'createdAt',
      sort_order = 'DESC',
    } = req.query;

    const where = {};

    if (status) where.status = status;
    if (drone_id) where.drone_id = drone_id;
    if (zone_id) where.zone_id = zone_id;

    // Lọc theo khoảng thời gian bay
    if (start_from || start_to) {
      where.start_time = {};
      if (start_from) where.start_time[Op.gte] = new Date(start_from);
      if (start_to) where.start_time[Op.lte] = new Date(start_to);
    }

    // Lọc theo ngày tạo
    if (created_from || created_to) {
      where.createdAt = {};
      if (created_from) where.createdAt[Op.gte] = new Date(created_from);
      if (created_to) where.createdAt[Op.lte] = new Date(created_to + ' 23:59:59');
    }

    if (req.user.role.name === 'user') {
      where.user_id = req.user.id;
    } else if (user_id) {
      where.user_id = user_id;
    }

    const validSortFields = ['id', 'status', 'start_time', 'end_time', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'createdAt';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await FlightPermit.findAndCountAll({
      where,
      include: [
        { model: Drone, as: 'drone', attributes: ['id', 'model_name', 'serial_number'] },
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'phone'] },
        { model: FlightZone, as: 'zone', attributes: ['id', 'name', 'zone_type'] },
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

// GET /api/flight/permits/:id
const getById = async (req, res) => {
  try {
    const permit = await FlightPermit.findByPk(req.params.id, {
      include: [
        { model: Drone, as: 'drone' },
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: FlightZone, as: 'zone' },
      ],
    });

    if (!permit) {
      return res.status(404).json({ success: false, message: 'Giấy phép bay không tồn tại' });
    }

    if (req.user.role.name === 'user' && permit.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xem giấy phép này' });
    }

    return res.json({ success: true, data: permit });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/flight/permits
const create = async (req, res) => {
  try {
    const { drone_id, zone_id, start_time, end_time, purpose } = req.body;

    // Validate thời gian
    const startDate = new Date(start_time);
    const endDate = new Date(end_time);
    const now = new Date();

    if (startDate <= now) {
      return res.status(400).json({ success: false, message: 'Thời gian bắt đầu phải lớn hơn thời điểm hiện tại' });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ success: false, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu' });
    }

    const drone = await Drone.findByPk(drone_id);
    if (!drone) {
      return res.status(404).json({ success: false, message: 'Máy bay không tồn tại' });
    }

    if (req.user.role.name === 'user' && drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không phải chủ sở hữu của máy bay này' });
    }

    // Kiểm tra máy bay đã được cấp định danh hợp lệ chưa (phải có biển số mới được xin phép bay)
    const activeReg = await Registration.findOne({ where: { drone_id, status: 'approved' } });
    if (!activeReg) {
      return res.status(400).json({
        success: false,
        message: 'Máy bay chưa được cấp mã định danh hợp lệ, không đủ điều kiện xin phép bay.',
      });
    }

    const zone = await FlightZone.findByPk(zone_id);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Khu vực bay không tồn tại' });
    }

    if (zone.zone_type === 'forbidden') {
      return res.status(400).json({
        success: false,
        message: `Khu vực "${zone.name}" là vùng cấm bay, không thể xin cấp phép`,
      });
    }

    // Kiểm tra xung đột thời gian với giấy phép khác
    const conflict = await FlightPermit.findOne({
      where: {
        drone_id,
        status: 'approved',
        [Op.or]: [
          { start_time: { [Op.between]: [startDate, endDate] } },
          { end_time: { [Op.between]: [startDate, endDate] } },
          {
            start_time: { [Op.lte]: startDate },
            end_time: { [Op.gte]: endDate },
          },
        ],
      },
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Máy bay đã có giấy phép bay được duyệt trong khoảng thời gian này',
      });
    }

    const permit = await FlightPermit.create({
      drone_id,
      user_id: req.user.id,
      zone_id,
      start_time: startDate,
      end_time: endDate,
      purpose,
      status: 'pending',
    });

    return res.status(201).json({ success: true, message: 'Đã gửi yêu cầu cấp phép bay thành công. Vui lòng chờ xét duyệt.', data: permit });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/flight/permits/:id/review
const review = async (req, res) => {
  try {
    const permit = await FlightPermit.findByPk(req.params.id, {
      include: [
        { model: Drone, as: 'drone', attributes: ['id', 'model_name'] },
        { model: FlightZone, as: 'zone', attributes: ['id', 'name'] },
      ],
    });

    if (!permit) {
      return res.status(404).json({ success: false, message: 'Giấy phép bay không tồn tại' });
    }

    if (permit.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Giấy phép này đã được xử lý với trạng thái: ${permit.status}` });
    }

    const { status, note } = req.body;
    await permit.update({ status });

    await Notification.create({
      user_id: permit.user_id,
      title: status === 'approved' ? '✅ Giấy phép bay được cấp' : '❌ Yêu cầu cấp phép bay bị từ chối',
      content: status === 'approved'
        ? `Giấy phép bay tại khu vực "${permit.zone.name}" cho máy bay ${permit.drone.model_name} đã được phê duyệt`
        : `Yêu cầu cấp phép bay bị từ chối. ${note ? 'Lý do: ' + note : ''}`,
      type: 'permit',
    });

    return res.json({ success: true, message: 'Xử lý giấy phép bay thành công', data: permit });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/flight/permits/:id
const remove = async (req, res) => {
  try {
    const permit = await FlightPermit.findByPk(req.params.id);
    if (!permit) {
      return res.status(404).json({ success: false, message: 'Giấy phép bay không tồn tại' });
    }

    if (permit.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể hủy giấy phép đang ở trạng thái chờ duyệt' });
    }

    if (req.user.role.name === 'user' && permit.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền hủy giấy phép này' });
    }

    await permit.destroy();
    return res.json({ success: true, message: 'Đã hủy yêu cầu cấp phép bay thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, review, remove };
