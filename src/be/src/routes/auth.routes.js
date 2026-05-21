const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Xác thực và quản lý tài khoản
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, email, password]
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               cccd_number:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 *       409:
 *         $ref: '#/components/schemas/Error'
 */
router.post(
  '/register',
  [
    body('full_name').notEmpty().withMessage('Họ tên không được rỗng'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự'),
  ],
  validate,
  ctrl.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         $ref: '#/components/schemas/Error'
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu không được rỗng'),
  ],
  validate,
  ctrl.login
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.get('/me', authenticate, ctrl.getMe);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [old_password, new_password]
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/change-password',
  authenticate,
  [
    body('old_password').notEmpty().withMessage('Mật khẩu cũ không được bỏ trống'),
    body('new_password').isLength({ min: 6 }).withMessage('Mật khẩu mới tối thiểu 6 ký tự'),
  ],
  validate,
  ctrl.changePassword
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Quên mật khẩu - gửi OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/forgot-password',
  [body('email').isEmail().withMessage('Email không hợp lệ')],
  validate,
  ctrl.forgotPassword
);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Đặt lại mật khẩu bằng OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp_code, new_password]
 *             properties:
 *               email:
 *                 type: string
 *               otp_code:
 *                 type: string
 *               new_password:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('otp_code').notEmpty().withMessage('Mã OTP không được bỏ trống'),
    body('new_password').isLength({ min: 6 }).withMessage('Mật khẩu mới tối thiểu 6 ký tự'),
  ],
  validate,
  ctrl.resetPassword
);

module.exports = router;
