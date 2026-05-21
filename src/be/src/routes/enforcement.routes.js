const express = require('express');
const router = express.Router();
const vCtrl = require('../controllers/violation.controller');
const iCtrl = require('../controllers/inspection.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

// ─── Violations ──────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Violations
 *   description: Quản lý vi phạm UAV
 */

/**
 * @swagger
 * /api/violations:
 *   get:
 *     summary: Danh sách vi phạm
 *     tags: [Violations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Tìm theo loại vi phạm hoặc mô tả
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [unpaid, paid] }
 *       - in: query
 *         name: drone_id
 *         schema: { type: integer }
 *       - in: query
 *         name: user_id
 *         schema: { type: integer }
 *       - in: query
 *         name: date_from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: date_to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: min_fine
 *         schema: { type: number }
 *       - in: query
 *         name: max_fine
 *         schema: { type: number }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [id, date_recorded, fine_amount, status, violation_type, createdAt] }
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
router.get('/violations', authenticate, vCtrl.getAll);

/**
 * @swagger
 * /api/violations/{id}:
 *   get:
 *     summary: Chi tiết vi phạm
 *     tags: [Violations]
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
router.get('/violations/:id', authenticate, vCtrl.getById);

/**
 * @swagger
 * /api/violations:
 *   post:
 *     summary: Ghi nhận vi phạm (Admin/Police)
 *     tags: [Violations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [drone_id, user_id, violation_type]
 *             properties:
 *               drone_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *               violation_type:
 *                 type: string
 *                 example: Bay vào vùng cấm
 *               description:
 *                 type: string
 *               fine_amount:
 *                 type: number
 *                 example: 5000000
 *               date_recorded:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         $ref: '#/components/schemas/Error'
 */
router.post(
  '/violations',
  authenticate,
  authorize('admin', 'police'),
  [
    body('drone_id').isInt({ min: 1 }).withMessage('ID máy bay không hợp lệ'),
    body('user_id').isInt({ min: 1 }).withMessage('ID người dùng không hợp lệ'),
    body('violation_type').notEmpty().withMessage('Loại vi phạm không được bỏ trống').isLength({ max: 100 }).withMessage('Loại vi phạm tối đa 100 ký tự'),
    body('description').optional().isLength({ max: 2000 }).withMessage('Mô tả vi phạm tối đa 2000 ký tự'),
    body('fine_amount').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Mức phạt phải là số không âm'),
    body('date_recorded').optional().isISO8601().withMessage('Ngày ghi nhận không đúng định dạng (YYYY-MM-DD)'),
    body('evidence_images').optional().isArray().withMessage('Danh sách ảnh minh chứng phải là mảng'),
  ],
  validate,
  vCtrl.create
);

/**
 * @swagger
 * /api/violations/{id}:
 *   put:
 *     summary: Cập nhật vi phạm (Admin/Police)
 *     tags: [Violations]
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
 *               violation_type:
 *                 type: string
 *               fine_amount:
 *                 type: number
 *               date_recorded:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         $ref: '#/components/schemas/Error'
 */
router.put(
  '/violations/:id',
  authenticate,
  authorize('admin', 'police'),
  [
    body('violation_type').optional().isLength({ min: 1, max: 100 }).withMessage('Loại vi phạm không hợp lệ'),
    body('fine_amount').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Mức phạt phải là số không âm'),
    body('date_recorded').optional().isISO8601().withMessage('Ngày ghi nhận không đúng định dạng'),
    body('evidence_images').optional().isArray().withMessage('Danh sách ảnh minh chứng phải là mảng'),
  ],
  validate,
  vCtrl.update
);

/**
 * @swagger
 * /api/violations/{id}/status:
 *   patch:
 *     summary: Cập nhật trạng thái nộp phạt (Admin)
 *     tags: [Violations]
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
 *                 enum: [unpaid, paid]
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         $ref: '#/components/schemas/Error'
 */
router.patch(
  '/violations/:id/status',
  authenticate,
  authorize('admin'),
  [body('status').isIn(['unpaid', 'paid']).withMessage('Trạng thái phải là unpaid hoặc paid')],
  validate,
  vCtrl.updateStatus
);

router.put('/violations/:id/pay', authenticate, vCtrl.pay);

/**
 * @swagger
 * /api/violations/{id}:
 *   delete:
 *     summary: Xóa vi phạm (Admin)
 *     tags: [Violations]
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
router.delete('/violations/:id', authenticate, authorize('admin'), vCtrl.remove);

// ─── Inspections ─────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Inspections
 *   description: Biên bản kiểm tra UAV
 */

/**
 * @swagger
 * /api/inspections:
 *   get:
 *     summary: Danh sách biên bản kiểm tra
 *     tags: [Inspections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: drone_id
 *         schema: { type: integer }
 *       - in: query
 *         name: inspector_id
 *         schema: { type: integer }
 *       - in: query
 *         name: result
 *         schema: { type: string, enum: [pass, fail] }
 *       - in: query
 *         name: date_from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: date_to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: q
 *         description: Tìm trong phần ghi chú
 *         schema: { type: string }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [id, inspection_date, result, createdAt] }
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
router.get('/inspections', authenticate, iCtrl.getAll);

/**
 * @swagger
 * /api/inspections/{id}:
 *   get:
 *     summary: Chi tiết biên bản kiểm tra
 *     tags: [Inspections]
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
router.get('/inspections/:id', authenticate, iCtrl.getById);

/**
 * @swagger
 * /api/inspections:
 *   post:
 *     summary: Lập biên bản kiểm tra (Police/Admin)
 *     tags: [Inspections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [drone_id, result]
 *             properties:
 *               drone_id:
 *                 type: integer
 *               inspection_date:
 *                 type: string
 *                 format: date
 *               result:
 *                 type: string
 *                 enum: [pass, fail]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/inspections',
  authenticate,
  authorize('police', 'admin'),
  [
    body('drone_id').isInt({ min: 1 }).withMessage('ID máy bay không hợp lệ'),
    body('result').isIn(['pass', 'fail']).withMessage('Kết quả kiểm tra phải là pass hoặc fail'),
    body('inspection_date').optional().isISO8601().withMessage('Ngày kiểm tra không đúng định dạng (YYYY-MM-DD)'),
    body('notes').optional().isLength({ max: 2000 }).withMessage('Ghi chú tối đa 2000 ký tự'),
    body('inspection_images').optional().isArray().withMessage('Danh sách ảnh kiểm tra phải là mảng'),
  ],
  validate,
  iCtrl.create
);

/**
 * @swagger
 * /api/inspections/{id}:
 *   put:
 *     summary: Cập nhật biên bản kiểm tra (Police/Admin)
 *     tags: [Inspections]
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
 *               result:
 *                 type: string
 *                 enum: [pass, fail]
 *               inspection_date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.put(
  '/inspections/:id',
  authenticate,
  authorize('police', 'admin'),
  [
    body('result').optional().isIn(['pass', 'fail']).withMessage('Kết quả kiểm tra phải là pass hoặc fail'),
    body('inspection_date').optional().isISO8601().withMessage('Ngày kiểm tra không đúng định dạng'),
    body('notes').optional().isLength({ max: 2000 }).withMessage('Ghi chú tối đa 2000 ký tự'),
    body('inspection_images').optional().isArray().withMessage('Danh sách ảnh kiểm tra phải là mảng'),
  ],
  validate,
  iCtrl.update
);

/**
 * @swagger
 * /api/inspections/{id}:
 *   delete:
 *     summary: Xóa biên bản kiểm tra (Admin)
 *     tags: [Inspections]
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
router.delete('/inspections/:id', authenticate, authorize('admin'), iCtrl.remove);

module.exports = router;
