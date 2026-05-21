const { sequelize, User, Drone, Registration, FlightPermit, FlightLog, Violation, Inspection, LookupHistory, Role } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// GET /api/admin/stats
const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDrones,
      regByStatus,
      permitByStatus,
      violationByStatus,
      inspectionByResult,
      recentRegistrations,
      recentViolations,
      totalLookups,
      usersByRole,
    ] = await Promise.all([
      // Tổng số người dùng
      User.count(),

      // Tổng số máy bay
      Drone.count(),

      // Hồ sơ định danh theo trạng thái
      Registration.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),

      // Giấy phép bay theo trạng thái
      FlightPermit.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),

      // Vi phạm theo trạng thái
      Violation.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        group: ['status'],
        raw: true,
      }),

      // Kiểm tra theo kết quả
      Inspection.findAll({
        attributes: ['result', [fn('COUNT', col('id')), 'count']],
        group: ['result'],
        raw: true,
      }),

      // 5 hồ sơ mới nhất
      Registration.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [{ model: Drone, as: 'drone', attributes: ['id', 'model_name', 'serial_number'] }],
        attributes: ['id', 'status', 'identification_code', 'createdAt'],
      }),

      // 5 vi phạm mới nhất
      Violation.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, as: 'user', attributes: ['id', 'full_name'] },
          { model: Drone, as: 'drone', attributes: ['id', 'model_name'] },
        ],
        attributes: ['id', 'violation_type', 'fine_amount', 'status', 'date_recorded'],
      }),

      // Tổng tra cứu
      LookupHistory.count(),

      // Người dùng theo role
      User.findAll({
        attributes: ['role_id', [fn('COUNT', col('User.id')), 'count']],
        include: [{ model: Role, as: 'role', attributes: ['name'] }],
        group: ['role_id', 'role.id'],
        raw: true,
      }),
    ]);

    // Tính tổng vi phạm chưa nộp phạt
    const unpaidFines = await Violation.sum('fine_amount', { where: { status: 'unpaid' } });

    // Đăng ký trong 30 ngày gần nhất
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsersThisMonth = await User.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } });
    const newDronesThisMonth = await Drone.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } });

    // Format reg by status thành object
    const formatByKey = (arr, key) => {
      const result = {};
      arr.forEach((item) => { result[item[key]] = parseInt(item.count); });
      return result;
    };

    return res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalDrones,
          totalLookups,
          unpaidFines: unpaidFines || 0,
          newUsersThisMonth,
          newDronesThisMonth,
        },
        registrations: formatByKey(regByStatus, 'status'),
        flightPermits: formatByKey(permitByStatus, 'status'),
        violations: formatByKey(violationByStatus, 'status'),
        inspections: formatByKey(inspectionByResult, 'result'),
        usersByRole: usersByRole.map((u) => ({
          role: u['role.name'] || u.role_name || null,
          count: parseInt(u.count),
        })),
        recent: {
          registrations: recentRegistrations,
          violations: recentViolations,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/stats/monthly?year=2024
const getMonthlyStats = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const [monthlyUsers, monthlyDrones, monthlyRegistrations, monthlyViolations] = await Promise.all([
      User.findAll({
        attributes: [
          [fn('MONTH', col('createdAt')), 'month'],
          [fn('COUNT', col('id')), 'count'],
        ],
        where: { createdAt: { [Op.between]: [`${year}-01-01`, `${year}-12-31 23:59:59`] } },
        group: [fn('MONTH', col('createdAt'))],
        raw: true,
      }),
      Drone.findAll({
        attributes: [
          [fn('MONTH', col('createdAt')), 'month'],
          [fn('COUNT', col('id')), 'count'],
        ],
        where: { createdAt: { [Op.between]: [`${year}-01-01`, `${year}-12-31 23:59:59`] } },
        group: [fn('MONTH', col('createdAt'))],
        raw: true,
      }),
      Registration.findAll({
        attributes: [
          [fn('MONTH', col('createdAt')), 'month'],
          [fn('COUNT', col('id')), 'count'],
        ],
        where: { createdAt: { [Op.between]: [`${year}-01-01`, `${year}-12-31 23:59:59`] } },
        group: [fn('MONTH', col('createdAt'))],
        raw: true,
      }),
      Violation.findAll({
        attributes: [
          [fn('MONTH', col('createdAt')), 'month'],
          [fn('COUNT', col('id')), 'count'],
          [fn('SUM', col('fine_amount')), 'total_fine'],
        ],
        where: { createdAt: { [Op.between]: [`${year}-01-01`, `${year}-12-31 23:59:59`] } },
        group: [fn('MONTH', col('createdAt'))],
        raw: true,
      }),
    ]);

    // Chuẩn hóa thành mảng 12 tháng
    const toMonthArray = (data, valueKey = 'count') => {
      const arr = Array(12).fill(0);
      data.forEach((item) => { arr[parseInt(item.month) - 1] = parseInt(item[valueKey]) || 0; });
      return arr;
    };

    return res.json({
      success: true,
      data: {
        year,
        months: ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
        users: toMonthArray(monthlyUsers),
        drones: toMonthArray(monthlyDrones),
        registrations: toMonthArray(monthlyRegistrations),
        violations: toMonthArray(monthlyViolations),
        fines: toMonthArray(monthlyViolations, 'total_fine'),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, getMonthlyStats };
