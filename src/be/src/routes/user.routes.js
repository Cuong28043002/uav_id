const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { body, param, query } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

const updateUserValidator = [
  body('full_name').optional().isLength({ min: 2, max: 150 }).withMessage('Họ tên phải từ 2 đến 150 ký tự'),
  body('phone').optional().matches(/^[0-9+\-\s]{8,20}$/).withMessage('Số điện thoại không hợp lệ'),
  body('address').optional().isLength({ max: 500 }).withMessage('Địa chỉ tối đa 500 ký tự'),
  body('cccd_number').optional().isLength({ min: 9, max: 20 }).withMessage('Số CCCD/CMND không hợp lệ'),
  body('role_id').optional().isInt({ min: 1 }).withMessage('Role ID phải là số nguyên dương'),
  body('status').optional().isIn(['active', 'banned']).withMessage('Trạng thái phải là active hoặc banned'),
];

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Xem hồ sơ cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.get('/profile', authenticate, ctrl.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Cập nhật hồ sơ cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.put(
  '/profile',
  authenticate,
  [
    body('full_name').optional().isLength({ min: 2, max: 150 }).withMessage('Họ tên phải từ 2 đến 150 ký tự'),
    body('phone').optional().matches(/^[0-9+\-\s]{8,20}$/).withMessage('Số điện thoại không hợp lệ'),
    body('address').optional().isLength({ max: 500 }).withMessage('Địa chỉ tối đa 500 ký tự'),
    body('cccd_number').optional().isLength({ min: 9, max: 20 }).withMessage('Số CCCD/CMND không hợp lệ'),
  ],
  validate,
  ctrl.updateProfile
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Danh sách người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Tìm kiếm theo họ tên, email, điện thoại, CCCD
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [active, banned] }
 *       - in: query
 *         name: role_id
 *         schema: { type: integer }
 *       - in: query
 *         name: created_from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: created_to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [id, full_name, email, createdAt, status] }
 *       - in: query
 *         name: sort_order
 *         schema: { type: string, enum: [ASC, DESC] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', authenticate, authorize('admin'), ctrl.getAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Chi tiết người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.get('/:id', authenticate, authorize('admin'), ctrl.getById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               role_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, banned]
 *               cccd_number:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:id', authenticate, authorize('admin'), updateUserValidator, validate, ctrl.update);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Khóa / mở khóa tài khoản (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, banned]
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  [body('status').isIn(['active', 'banned']).withMessage('Trạng thái phải là active hoặc banned')],
  validate,
  ctrl.updateStatus
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
