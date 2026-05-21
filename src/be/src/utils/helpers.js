const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const otpExpiresAt = () => {
  const minutes = parseInt(process.env.OTP_EXPIRES_MINUTES || '10');
  return new Date(Date.now() + minutes * 60 * 1000);
};

const paginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  generateOtp,
  otpExpiresAt,
  paginationParams,
  paginationMeta,
};
