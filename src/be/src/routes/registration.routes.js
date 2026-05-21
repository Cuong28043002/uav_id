const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/registration.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

/**
 * @swagger
 * tags:
 *   name: Registrations
 *   description: Hồ sơ định danh máy bay UAV
 */

/**
 * @swagger
 * /api/registrations:
 *   get:
 *     summary: Danh sách hồ sơ định danh
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Tìm theo mã định danh
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, approved, rejected, revoked] }
 *       - in: query
 *         name: drone_id
 *         schema: { type: integer }
 *       - in: query
 *         name: issue_from
 *         description: Lọc từ ngày cấp (YYYY-MM-DD)
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: issue_to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: created_from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: created_to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [id, status, issue_date, createdAt] }
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
router.get('/', authenticate, ctrl.getAll);

/**
 * @swagger
 * /api/registrations/{id}/qr:
 *   get:
 *     summary: Lấy mã QR của hồ sơ định danh
 *     tags: [Registrations]
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
router.get('/:id/qr', authenticate, ctrl.getQr);

/**
 * @swagger
 * /api/registrations/{id}:
 *   get:
 *     summary: Chi tiết hồ sơ định danh
 *     tags: [Registrations]
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
router.get('/:id', authenticate, ctrl.getById);

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Nộp hồ sơ định danh
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [drone_id]
 *             properties:
 *               drone_id:
 *                 type: integer
 *                 description: ID máy bay cần định danh
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/',
  authenticate,
  [
    body('drone_id').isInt({ min: 1 }).withMessage('ID máy bay không hợp lệ'),
    body('documents').optional().isArray().withMessage('Danh sách tài liệu đính kèm phải là mảng'),
  ],
  validate,
  ctrl.create
);

/**
 * @swagger
 * /api/registrations/{id}/review:
 *   patch:
 *     summary: Duyệt hoặc từ chối hồ sơ (Admin)
 *     tags: [Registrations]
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
 *                 enum: [approved, rejected]
 *               admin_note:
 *                 type: string
 *                 description: Ghi chú của admin (bắt buộc khi từ chối)
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.patch(
  '/:id/review',
  authenticate,
  authorize('admin', 'police'),
  [
    body('status').isIn(['approved', 'rejected']).withMessage('Trạng thái phải là approved hoặc rejected'),
    body('admin_note')
      .if(body('status').equals('rejected'))
      .notEmpty()
      .withMessage('Vui lòng nhập lý do từ chối hồ sơ'),
  ],
  validate,
  ctrl.review
);

/**
 * @swagger
 * /api/registrations/{id}/revoke:
 *   patch:
 *     summary: Thu hồi mã định danh (Admin)
 *     tags: [Registrations]
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
 *               admin_note:
 *                 type: string
 *                 description: Lý do thu hồi
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.patch(
  '/:id/revoke',
  authenticate,
  authorize('admin', 'police'),
  [body('admin_note').notEmpty().withMessage('Vui lòng nhập lý do thu hồi mã định danh')],
  validate,
  ctrl.revoke
);

module.exports = router;
