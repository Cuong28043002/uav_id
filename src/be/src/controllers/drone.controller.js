const { Drone, User, Manufacturer, DroneCategory, Registration } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/drones
// Query: q, owner_id, category_id, manufacturer_id, min_weight, max_weight, min_height, max_height
//        created_from, created_to, page, limit, sort_by, sort_order
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const {
      q,
      owner_id,
      category_id,
      manufacturer_id,
      min_weight,
      max_weight,
      min_height,
      max_height,
      created_from,
      created_to,
      sort_by = 'createdAt',
      sort_order = 'DESC',
    } = req.query;

    const where = {};

    // Tìm kiếm theo tên model hoặc serial
    if (q) {
      where[Op.or] = [
        { model_name: { [Op.like]: `%${q}%` } },
        { serial_number: { [Op.like]: `%${q}%` } },
      ];
    }

    if (manufacturer_id) where.manufacturer_id = manufacturer_id;
    if (category_id) where.category_id = category_id;

    // Lọc theo trọng lượng
    if (min_weight || max_weight) {
      where.weight = {};
      if (min_weight) where.weight[Op.gte] = parseFloat(min_weight);
      if (max_weight) where.weight[Op.lte] = parseFloat(max_weight);
    }

    // Lọc theo độ cao bay
    if (min_height || max_height) {
      where.max_flight_height = {};
      if (min_height) where.max_flight_height[Op.gte] = parseFloat(min_height);
      if (max_height) where.max_flight_height[Op.lte] = parseFloat(max_height);
    }

    // Lọc theo ngày tạo
    if (created_from || created_to) {
      where.createdAt = {};
      if (created_from) where.createdAt[Op.gte] = new Date(created_from);
      if (created_to) where.createdAt[Op.lte] = new Date(created_to + ' 23:59:59');
    }

    // User chỉ thấy drone của mình
    if (req.user.role.name === 'user') {
      where.owner_id = req.user.id;
    } else if (owner_id) {
      where.owner_id = owner_id;
    }

    const validSortFields = ['id', 'model_name', 'serial_number', 'weight', 'max_flight_height', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'createdAt';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Drone.findAndCountAll({
      where,
      include: [
        { model: User, as: 'owner', attributes: ['id', 'full_name', 'email', 'phone'] },
        { model: Manufacturer, as: 'manufacturer', attributes: ['id', 'name', 'country'] },
        { model: DroneCategory, as: 'category', attributes: ['id', 'name'] },
        {
          model: Registration,
          as: 'registrations',
          attributes: ['id', 'identification_code', 'status', 'issue_date', 'qr_code_url'],
        },
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

// GET /api/drones/:id
const getById = async (req, res) => {
  try {
    const drone = await Drone.findByPk(req.params.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'full_name', 'email', 'phone', 'address'] },
        { model: Manufacturer, as: 'manufacturer' },
        { model: DroneCategory, as: 'category' },
        {
          model: Registration,
          as: 'registrations',
          attributes: ['id', 'identification_code', 'status', 'issue_date', 'qr_code_url'],
          limit: 3,
          order: [['createdAt', 'DESC']],
        },
      ],
    });

    if (!drone) {
      return res.status(404).json({ success: false, message: 'Máy bay không tồn tại' });
    }

    if (req.user.role.name === 'user' && drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xem máy bay này' });
    }

    return res.json({ success: true, data: drone });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/drones
const create = async (req, res) => {
  try {
    const { manufacturer_id, category_id, serial_number, weight, max_flight_height, images } = req.body;
    const model_name = req.body.model_name || req.body.name || req.body.model;

    const existing = await Drone.findOne({ where: { serial_number } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Số serial này đã được đăng ký trong hệ thống' });
    }

    // Kiểm tra nhà sản xuất tồn tại
    if (manufacturer_id) {
      const mfr = await Manufacturer.findByPk(manufacturer_id);
      if (!mfr) {
        return res.status(404).json({ success: false, message: 'Nhà sản xuất không tồn tại' });
      }
    }

    // Kiểm tra danh mục tồn tại
    if (category_id) {
      const cat = await DroneCategory.findByPk(category_id);
      if (!cat) {
        return res.status(404).json({ success: false, message: 'Danh mục máy bay không tồn tại' });
      }
    }

    const drone = await Drone.create({
      owner_id: req.user.id,
      manufacturer_id: manufacturer_id || null,
      category_id: category_id || null,
      model_name,
      serial_number,
      weight: weight || null,
      max_flight_height: max_flight_height || null,
      images: images || [],
    });

    const created = await Drone.findByPk(drone.id, {
      include: [
        { model: User, as: 'owner', attributes: ['id', 'full_name', 'email'] },
        { model: Manufacturer, as: 'manufacturer', attributes: ['id', 'name'] },
        { model: DroneCategory, as: 'category', attributes: ['id', 'name'] },
      ],
    });

    return res.status(201).json({ success: true, message: 'Đăng ký máy bay thành công', data: created });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/drones/:id
const update = async (req, res) => {
  try {
    const drone = await Drone.findByPk(req.params.id);
    if (!drone) {
      return res.status(404).json({ success: false, message: 'Máy bay không tồn tại' });
    }

    if (req.user.role.name === 'user' && drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa máy bay này' });
    }

    const { manufacturer_id, category_id, weight, max_flight_height, images } = req.body;
    const model_name = req.body.model_name || req.body.name || req.body.model;

    // Kiểm tra FK nếu được truyền
    if (manufacturer_id !== undefined && manufacturer_id !== null) {
      const mfr = await Manufacturer.findByPk(manufacturer_id);
      if (!mfr) return res.status(404).json({ success: false, message: 'Nhà sản xuất không tồn tại' });
    }
    if (category_id !== undefined && category_id !== null) {
      const cat = await DroneCategory.findByPk(category_id);
      if (!cat) return res.status(404).json({ success: false, message: 'Danh mục máy bay không tồn tại' });
    }

    await drone.update({ manufacturer_id, category_id, model_name, weight, max_flight_height, images });

    const updated = await Drone.findByPk(drone.id, {
      include: [
        { model: Manufacturer, as: 'manufacturer', attributes: ['id', 'name'] },
        { model: DroneCategory, as: 'category', attributes: ['id', 'name'] },
      ],
    });

    return res.json({ success: true, message: 'Cập nhật thông tin máy bay thành công', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/drones/:id/transfer - Chuyển quyền sở hữu
const transfer = async (req, res) => {
  try {
    const drone = await Drone.findByPk(req.params.id);
    if (!drone) {
      return res.status(404).json({ success: false, message: 'Máy bay không tồn tại' });
    }

    if (req.user.role.name === 'user' && drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền chuyển nhượng máy bay này' });
    }

    const { new_owner_id } = req.body;

    const newOwner = await User.findByPk(new_owner_id);
    if (!newOwner) {
      return res.status(404).json({ success: false, message: 'Người nhận không tồn tại trong hệ thống' });
    }

    if (newOwner.status === 'banned') {
      return res.status(400).json({ success: false, message: 'Không thể chuyển nhượng cho tài khoản đang bị khóa' });
    }

    if (new_owner_id === drone.owner_id) {
      return res.status(400).json({ success: false, message: 'Người nhận là chủ sở hữu hiện tại' });
    }

    await drone.update({ owner_id: new_owner_id });

    return res.json({
      success: true,
      message: `Đã chuyển nhượng máy bay cho ${newOwner.full_name} thành công`,
      data: { drone_id: drone.id, new_owner: { id: newOwner.id, full_name: newOwner.full_name } },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/drones/:id
const remove = async (req, res) => {
  try {
    const drone = await Drone.findByPk(req.params.id);
    if (!drone) {
      return res.status(404).json({ success: false, message: 'Máy bay không tồn tại' });
    }

    if (req.user.role.name === 'user' && drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa máy bay này' });
    }

    // Kiểm tra hồ sơ approved
    const approved = await Registration.findOne({ where: { drone_id: drone.id, status: 'approved' } });
    if (approved) {
      return res.status(409).json({
        success: false,
        message: 'Không thể xóa máy bay đã có mã định danh được phê duyệt. Vui lòng thu hồi mã định danh trước.',
      });
    }

    await drone.destroy();
    return res.json({ success: true, message: 'Đã xóa máy bay thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, transfer, remove };
