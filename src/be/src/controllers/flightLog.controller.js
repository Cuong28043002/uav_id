const { FlightLog, Drone, FlightPermit } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/flight/logs
// Query: drone_id, permit_id, start_from, start_to, min_altitude, max_altitude, min_distance, max_distance
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const {
      drone_id,
      permit_id,
      start_from,
      start_to,
      min_altitude,
      max_altitude,
      min_distance,
      max_distance,
      sort_by = 'start_time',
      sort_order = 'DESC',
    } = req.query;

    const where = {};
    if (drone_id) where.drone_id = drone_id;
    if (permit_id) where.permit_id = permit_id;

    // Lọc theo khoảng thời gian bay
    if (start_from || start_to) {
      where.start_time = {};
      if (start_from) where.start_time[Op.gte] = new Date(start_from);
      if (start_to) where.start_time[Op.lte] = new Date(start_to);
    }

    // Lọc theo độ cao
    if (min_altitude || max_altitude) {
      where.max_altitude = {};
      if (min_altitude) where.max_altitude[Op.gte] = parseFloat(min_altitude);
      if (max_altitude) where.max_altitude[Op.lte] = parseFloat(max_altitude);
    }

    // Lọc theo khoảng cách
    if (min_distance || max_distance) {
      where.distance = {};
      if (min_distance) where.distance[Op.gte] = parseFloat(min_distance);
      if (max_distance) where.distance[Op.lte] = parseFloat(max_distance);
    }

    const validSortFields = ['id', 'start_time', 'end_time', 'max_altitude', 'distance', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'start_time';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // User chỉ thấy log của drone mình
    const droneWhere = {};
    if (req.user.role.name === 'user') droneWhere.owner_id = req.user.id;

    const { count, rows } = await FlightLog.findAndCountAll({
      where,
      include: [
        { model: Drone, as: 'drone', where: droneWhere, attributes: ['id', 'model_name', 'serial_number', 'owner_id'] },
        { model: FlightPermit, as: 'permit', attributes: ['id', 'status', 'purpose', 'start_time', 'end_time'] },
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

// GET /api/flight/logs/:id
const getById = async (req, res) => {
  try {
    const log = await FlightLog.findByPk(req.params.id, {
      include: [
        { model: Drone, as: 'drone', attributes: ['id', 'model_name', 'serial_number', 'owner_id'] },
        { model: FlightPermit, as: 'permit' },
      ],
    });

    if (!log) {
      return res.status(404).json({ success: false, message: 'Nhật ký bay không tồn tại' });
    }

    // User chỉ xem log drone mình sở hữu
    if (req.user.role.name === 'user' && log.drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xem nhật ký bay này' });
    }

    return res.json({ success: true, data: log });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/flight/logs
const create = async (req, res) => {
  try {
    const { drone_id, permit_id, start_time, end_time, max_altitude, distance } = req.body;

    const drone = await Drone.findByPk(drone_id);
    if (!drone) {
      return res.status(404).json({ success: false, message: 'Máy bay không tồn tại' });
    }

    if (req.user.role.name === 'user' && drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền ghi nhật ký cho máy bay này' });
    }

    // Kiểm tra permit tồn tại và hợp lệ nếu có
    if (permit_id) {
      const permit = await FlightPermit.findOne({
        where: { id: permit_id, drone_id },
      });
      if (!permit) {
        return res.status(404).json({ success: false, message: 'Giấy phép bay không tồn tại hoặc không thuộc máy bay này' });
      }
      if (permit.status !== 'approved') {
        return res.status(400).json({ success: false, message: 'Giấy phép bay chưa được phê duyệt hoặc đã bị hủy/hết hạn' });
      }

      // Kiểm tra thời gian bay có nằm trong khung giờ được cấp phép không
      const logStart = new Date(start_time);
      const logEnd = end_time ? new Date(end_time) : null;
      if (logStart < new Date(permit.start_time) || logStart > new Date(permit.end_time)) {
        return res.status(400).json({
          success: false,
          message: `Thời gian bắt đầu bay không nằm trong khung giờ cấp phép (${new Date(permit.start_time).toLocaleString('vi-VN')} - ${new Date(permit.end_time).toLocaleString('vi-VN')})`,
        });
      }
      if (logEnd && logEnd > new Date(permit.end_time)) {
        return res.status(400).json({
          success: false,
          message: `Thời gian kết thúc bay vượt quá khung giờ cấp phép (${new Date(permit.end_time).toLocaleString('vi-VN')})`,
        });
      }
    }

    // Validate thời gian
    if (end_time && new Date(end_time) <= new Date(start_time)) {
      return res.status(400).json({ success: false, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu' });
    }

    const log = await FlightLog.create({
      drone_id,
      permit_id: permit_id || null,
      start_time,
      end_time: end_time || null,
      max_altitude: max_altitude || null,
      distance: distance || null,
    });

    return res.status(201).json({ success: true, message: 'Ghi nhật ký bay thành công', data: log });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/flight/logs/:id
const update = async (req, res) => {
  try {
    const log = await FlightLog.findByPk(req.params.id, {
      include: [{ model: Drone, as: 'drone' }],
    });

    if (!log) {
      return res.status(404).json({ success: false, message: 'Nhật ký bay không tồn tại' });
    }

    if (req.user.role.name === 'user' && log.drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa nhật ký này' });
    }

    const { end_time, max_altitude, distance } = req.body;

    if (end_time && new Date(end_time) <= new Date(log.start_time)) {
      return res.status(400).json({ success: false, message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu' });
    }

    await log.update({ end_time, max_altitude, distance });
    return res.json({ success: true, message: 'Cập nhật nhật ký bay thành công', data: log });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/flight/logs/:id (Admin only)
const remove = async (req, res) => {
  try {
    const log = await FlightLog.findByPk(req.params.id);
    if (!log) {
      return res.status(404).json({ success: false, message: 'Nhật ký bay không tồn tại' });
    }

    await log.destroy();
    return res.json({ success: true, message: 'Đã xóa nhật ký bay thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
