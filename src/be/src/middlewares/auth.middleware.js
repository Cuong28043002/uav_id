const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer')) {
      return res.status(401).json({ success: false, message: 'Không có token xác thực' });
    }

    // Tự động xử lý "Bearer Bearer token" (lỗi Swagger UI khi user nhập cả "Bearer ")
    // Lấy phần cuối cùng sau tất cả khoảng trắng
    const parts = authHeader.trim().split(/\s+/);
    const token = parts[parts.length - 1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ success: false, message: 'Tài khoản bị khóa' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token hết hạn hoặc không hợp lệ' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
    }
    if (!roles.includes(req.user.role.name)) {
      return res.status(403).json({
        success: false,
        message: `Yêu cầu quyền: ${roles.join(', ')}`,
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
