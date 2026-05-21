const { LookupHistory, Registration, Drone, User, Manufacturer, DroneCategory } = require('../models');
const { paginationParams, paginationMeta } = require('../utils/helpers');
const { Op } = require('sequelize');

// GET /api/lookup/:identification_code (Public)
const lookup = async (req, res) => {
  try {
    const { identification_code } = req.params;

    const reg = await Registration.findOne({
      where: { identification_code, status: 'approved' },
      include: [
        {
          model: Drone,
          as: 'drone',
          attributes: ['id', 'model_name', 'serial_number', 'weight', 'max_flight_height', 'images'],
          include: [
            { model: User, as: 'owner', attributes: ['id', 'full_name'] },
            { model: Manufacturer, as: 'manufacturer', attributes: ['id', 'name', 'country'] },
            { model: DroneCategory, as: 'category', attributes: ['id', 'name'] },
          ],
        },
      ],
      attributes: ['id', 'identification_code', 'issue_date', 'status'],
    });

    if (!reg) {
      // Vẫn log lần tra cứu thất bại
      await LookupHistory.create({
        identification_code,
        ip_address: req.ip || req.headers['x-forwarded-for'] || null,
        device_info: req.headers['user-agent'] || null,
      }).catch(() => {});

      return res.status(404).json({
        success: false,
        message: `Không tìm thấy UAV với mã định danh "${identification_code}"`,
      });
    }

    // Ghi lịch sử tra cứu
    await LookupHistory.create({
      identification_code,
      ip_address: req.ip || req.headers['x-forwarded-for'] || null,
      device_info: req.headers['user-agent'] || null,
    }).catch(() => {});

    return res.json({
      success: true,
      message: 'Tra cứu thành công',
      data: {
        identification_code: reg.identification_code,
        issue_date: reg.issue_date,
        status: reg.status,
        drone: reg.drone,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/lookup-history (Admin/Police)
// Query: q, ip_address, date_from, date_to, page, limit
const getHistory = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const { q, ip_address, date_from, date_to, sort_by = 'createdAt', sort_order = 'DESC' } = req.query;

    const where = {};

    if (q) {
      where.identification_code = { [Op.like]: `%${q}%` };
    }

    if (ip_address) {
      where.ip_address = { [Op.like]: `%${ip_address}%` };
    }

    if (date_from || date_to) {
      where.createdAt = {};
      if (date_from) where.createdAt[Op.gte] = new Date(date_from);
      if (date_to) where.createdAt[Op.lte] = new Date(date_to + ' 23:59:59');
    }

    const validSortFields = ['id', 'identification_code', 'ip_address', 'createdAt'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'createdAt';
    const orderDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows } = await LookupHistory.findAndCountAll({
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

module.exports = { lookup, getHistory };
