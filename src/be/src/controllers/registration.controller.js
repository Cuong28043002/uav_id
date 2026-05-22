const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { Registration, Drone, User, Notification, Manufacturer, DroneCategory } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/registrations
// Query: q (identification_code), status, drone_id, issue_from, issue_to, created_from, created_to
//        page, limit, sort_by, sort_order
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const {
      q,
      status,
      drone_id,
      issue_from,
      issue_to,
      created_from,
      created_to,
      sort_by = 'createdAt',
      sort_order = 'DESC',
    } = req.query;

    const where = {};

    // Tìm kiếm theo mã định danh
    if (q) {
      where.identification_code = { [Op.like]: `%${q}%` };
    }

    if (status) where.status = status;
    if (drone_id) where.drone_id = drone_id;

    // Lọc theo ngày cấp
    if (issue_from || issue_to) {
      where.issue_date = {};
      if (issue_from) where.issue_date[Op.gte] = issue_from;
      if (issue_to) where.issue_date[Op.lte] = issue_to;
    }

    // Lọc theo ngày tạo hồ sơ
    if (created_from || created_to) {
      where.createdAt = {};
      if (created_from) where.createdAt[Op.gte] = new Date(created_from);
      if (created_to) where.createdAt[Op.lte] = new Date(created_to + ' 23:59:59');
    }

    // Điều kiện join drone (user chỉ thấy drone của mình)
    const droneWhere = {};
    if (req.user.role.name === 'user') {
      droneWhere.owner_id = req.user.id;
    }

    const validSortFields = ['id', 'status', 'issue_date', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'createdAt';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await Registration.findAndCountAll({
      where,
      include: [
        {
          model: Drone,
          as: 'drone',
          where: droneWhere,
          include: [
            { model: User, as: 'owner', attributes: ['id', 'full_name', 'email', 'phone'] },
            { model: Manufacturer, as: 'manufacturer', attributes: ['id', 'name', 'country'] },
            { model: DroneCategory, as: 'category', attributes: ['id', 'name'] },
          ],
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

// GET /api/registrations/:id
const getById = async (req, res) => {
  try {
    const reg = await Registration.findByPk(req.params.id, {
      include: [
        {
          model: Drone,
          as: 'drone',
          include: [
            { model: User, as: 'owner', attributes: { exclude: ['password'] } },
            { model: Manufacturer, as: 'manufacturer' },
            { model: DroneCategory, as: 'category' },
          ],
        },
      ],
    });

    if (!reg) {
      return res.status(404).json({ success: false, message: 'Hồ sơ định danh không tồn tại' });
    }

    // User chỉ xem được hồ sơ của drone mình
    if (req.user.role.name === 'user' && reg.drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xem hồ sơ này' });
    }

    return res.json({ success: true, data: reg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/registrations/:id/qr - Lấy QR code riêng
const getQr = async (req, res) => {
  try {
    const reg = await Registration.findByPk(req.params.id, {
      attributes: ['id', 'identification_code', 'qr_code_url', 'status', 'drone_id'],
      include: [{ model: Drone, as: 'drone', attributes: ['id', 'owner_id'] }],
    });

    if (!reg) {
      return res.status(404).json({ success: false, message: 'Hồ sơ không tồn tại' });
    }

    // Kiểm tra quyền: user chỉ lấy QR của drone mình sở hữu
    if (req.user.role.name === 'user' && reg.drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xem mã QR này' });
    }

    if (reg.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Hồ sơ chưa được phê duyệt, chưa có mã QR' });
    }

    return res.json({
      success: true,
      data: {
        identification_code: reg.identification_code,
        qr_code_url: reg.qr_code_url,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/registrations/:id/qr-image - Trả về ảnh nhị phân QR code trực tiếp (phục vụ hiển thị qua thẻ link ảnh)
const getQrImage = async (req, res) => {
  try {
    const reg = await Registration.findByPk(req.params.id, {
      attributes: ['id', 'qr_code_url'],
    });

    if (!reg || !reg.qr_code_url) {
      return res.status(404).send('Không tìm thấy ảnh QR code');
    }

    const matches = reg.qr_code_url.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).send('Định dạng ảnh không hợp lệ');
    }

    const imageType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    res.writeHead(200, {
      'Content-Type': imageType,
      'Content-Length': buffer.length,
      'Cache-Control': 'public, max-age=86400',
    });
    return res.end(buffer);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

// POST /api/registrations
const create = async (req, res) => {
  try {
    const { drone_id, documents } = req.body;

    const drone = await Drone.findByPk(drone_id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'full_name'] }],
    });

    if (!drone) {
      return res.status(404).json({ success: false, message: 'Máy bay không tồn tại trong hệ thống' });
    }

    if (req.user.role.name === 'user' && drone.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Bạn không phải chủ sở hữu của máy bay này' });
    }

    // Kiểm tra hồ sơ pending
    const pending = await Registration.findOne({ where: { drone_id, status: 'pending' } });
    if (pending) {
      return res.status(409).json({ success: false, message: 'Máy bay này đã có hồ sơ đang chờ xét duyệt' });
    }

    // Kiểm tra đã có hồ sơ approved
    const approved = await Registration.findOne({ where: { drone_id, status: 'approved' } });
    if (approved) {
      return res.status(409).json({
        success: false,
        message: `Máy bay đã có mã định danh hợp lệ: ${approved.identification_code}`,
      });
    }

    const reg = await Registration.create({ drone_id, status: 'pending', documents: documents || [] });

    return res.status(201).json({ success: true, message: 'Nộp hồ sơ định danh thành công. Vui lòng chờ xét duyệt.', data: reg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/registrations/:id/review (Admin)
const review = async (req, res) => {
  try {
    const reg = await Registration.findByPk(req.params.id, {
      include: [{ model: Drone, as: 'drone' }],
    });

    if (!reg) {
      return res.status(404).json({ success: false, message: 'Hồ sơ định danh không tồn tại' });
    }

    if (reg.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Hồ sơ này đã được xử lý với trạng thái: ${reg.status}`,
      });
    }

    const { status, admin_note, identification_code: req_identification_code, signature } = req.body;

    let identification_code = reg.identification_code;
    let qr_code_url = reg.qr_code_url;

    if (status === 'approved') {
      identification_code = req_identification_code || `UAV-${uuidv4().split('-')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      qr_code_url = await QRCode.toDataURL(
        JSON.stringify({
          code: identification_code,
          drone_id: reg.drone_id,
          serial: reg.drone.serial_number,
          issued: new Date().toISOString(),
        }),
        { errorCorrectionLevel: 'H', width: 300 }
      );
    }

    await reg.update({
      status,
      admin_note: admin_note || null,
      identification_code,
      qr_code_url,
      signature: signature || null,
      issue_date: status === 'approved' ? new Date() : reg.issue_date,
    });

    await Notification.create({
      user_id: reg.drone.owner_id,
      title: status === 'approved' ? '✅ Hồ sơ định danh được phê duyệt' : '❌ Hồ sơ định danh bị từ chối',
      content: status === 'approved'
        ? `Máy bay ${reg.drone.model_name} đã được cấp mã định danh: ${identification_code}`
        : `Hồ sơ định danh máy bay ${reg.drone.model_name} bị từ chối. Lý do: ${admin_note || 'Không có ghi chú'}`,
      type: 'registration',
    });

    return res.json({ success: true, message: 'Xử lý hồ sơ thành công', data: reg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/registrations/:id/revoke (Admin)
const revoke = async (req, res) => {
  try {
    const reg = await Registration.findByPk(req.params.id, {
      include: [{ model: Drone, as: 'drone' }],
    });

    if (!reg) {
      return res.status(404).json({ success: false, message: 'Hồ sơ định danh không tồn tại' });
    }

    if (reg.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể thu hồi hồ sơ đang ở trạng thái đã phê duyệt' });
    }

    const { admin_note } = req.body;
    await reg.update({ status: 'revoked', admin_note: admin_note || 'Thu hồi bởi quản trị viên' });

    await Notification.create({
      user_id: reg.drone.owner_id,
      title: '⚠️ Mã định danh bị thu hồi',
      content: `Mã định danh ${reg.identification_code} của máy bay ${reg.drone.model_name} đã bị thu hồi. Lý do: ${admin_note || 'Không có ghi chú'}`,
      type: 'registration',
    });

    return res.json({ success: true, message: 'Đã thu hồi mã định danh thành công', data: reg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, getQr, getQrImage, create, review, revoke };
