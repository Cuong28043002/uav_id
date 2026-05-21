const { User, Role, OtpCode } = require('../models');
const {
  generateToken,
  hashPassword,
  comparePassword,
  generateOtp,
  otpExpiresAt,
} = require('../utils/helpers');
const { Op } = require('sequelize');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { full_name, email, password, phone, cccd_number, address } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email đã được sử dụng' });
    }

    const userRole = await Role.findOne({ where: { name: 'user' } });
    if (!userRole) {
      return res.status(500).json({ success: false, message: 'Cấu hình hệ thống bị lỗi' });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({
      role_id: userRole.id,
      full_name,
      email,
      password: hashed,
      phone,
      cccd_number,
      address,
      status: 'active',
    });

    const token = generateToken({ id: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: { token, user: { id: user.id, full_name: user.full_name, email: user.email } },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ success: false, message: 'Tài khoản bị khóa' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role.name,
          status: user.status,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    return res.json({ success: true, data: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/change-password
const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await comparePassword(old_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng' });
    }

    user.password = await hashPassword(new_password);
    await user.save();

    return res.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email không tồn tại' });
    }

    const otp = generateOtp();
    await OtpCode.create({
      user_id: user.id,
      otp_code: otp,
      expires_at: otpExpiresAt(),
      type: 'forgot_password',
      is_used: false,
    });

    // In production: send email with OTP
    return res.json({
      success: true,
      message: 'OTP đã gửi đến email',
      data: { otp }, // remove in production
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp_code, new_password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email không tồn tại' });
    }

    const otpRecord = await OtpCode.findOne({
      where: {
        user_id: user.id,
        otp_code,
        type: 'forgot_password',
        is_used: false,
        expires_at: { [Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']],
    });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP không hợp lệ hoặc đã hết hạn' });
    }

    user.password = await hashPassword(new_password);
    await user.save();

    otpRecord.is_used = true;
    await otpRecord.save();

    return res.json({ success: true, message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, changePassword, forgotPassword, resetPassword };
