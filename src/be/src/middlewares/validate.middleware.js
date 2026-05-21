const { validationResult } = require('express-validator');

/**
 * Middleware xử lý lỗi validation từ express-validator
 * Trả lỗi đầu tiên tìm được (để tránh spam lỗi)
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(422).json({
      success: false,
      message: messages[0], // Lỗi đầu tiên - tiếng Việt
      errors: messages,     // Toàn bộ lỗi
    });
  }
  return next();
};

module.exports = { validate };
