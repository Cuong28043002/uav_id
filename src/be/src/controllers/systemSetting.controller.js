const { SystemSetting } = require('../models');
const { Op } = require('sequelize');
const { paginationParams, paginationMeta } = require('../utils/helpers');

// GET /api/settings?q=
const getAll = async (req, res) => {
  try {
    const { page, limit, offset } = paginationParams(req.query);
    const { q } = req.query;

    const where = {};
    if (q) {
      where[Op.or] = [
        { key_name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
      ];
    }

    const { count, rows } = await SystemSetting.findAndCountAll({ where, limit, offset, order: [['key_name', 'ASC']] });
    return res.json({ success: true, data: rows, meta: paginationMeta(count, page, limit) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getByKey = async (req, res) => {
  try {
    const item = await SystemSetting.findOne({ where: { key_name: req.params.key } });
    if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy cài đặt này' });
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/settings - Upsert (thêm mới hoặc cập nhật)
const upsert = async (req, res) => {
  try {
    const { key_name, key_value, description } = req.body;

    const [item, created] = await SystemSetting.findOrCreate({
      where: { key_name },
      defaults: { key_name, key_value, description },
    });

    if (!created) {
      await item.update({ key_value, description: description !== undefined ? description : item.description });
    }

    return res.status(created ? 201 : 200).json({
      success: true,
      message: created ? 'Thêm cài đặt thành công' : 'Cập nhật cài đặt thành công',
      data: item,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const item = await SystemSetting.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Cài đặt không tồn tại' });
    await item.destroy();
    return res.json({ success: true, message: 'Đã xóa cài đặt thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getByKey, upsert, remove };
