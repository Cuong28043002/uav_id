const express = require('express');
const router = express.Router();
const fpCtrl = require('../controllers/flightPermit.controller');
const flCtrl = require('../controllers/flightLog.controller');
const fzCtrl = require('../controllers/flightZone.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

// ─── Flight Zones ────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: FlightZones
 *   description: Khu vực bay (cấm / hạn chế / tự do)
 */

/**
 * @swagger
 * /api/flight/zones:
 *   get:
 *     summary: Danh sách khu vực bay
 *     tags: [FlightZones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Tìm theo tên hoặc mô tả
 *         schema: { type: string }
 *       - in: query
 *         name: zone_type
 *         schema: { type: string, enum: [forbidden, restricted, free] }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [id, name, zone_type, createdAt] }
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
router.get('/zones', authenticate, fzCtrl.getAll);

/**
 * @swagger
 * /api/flight/zones/{id}:
 *   get:
 *     summary: Chi tiết khu vực bay
 *     tags: [FlightZones]
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
router.get('/zones/:id', authenticate, fzCtrl.getById);

/**
 * @swagger
 * /api/flight/zones:
 *   post:
 *     summary: Tạo khu vực bay mới (Admin)
 *     tags: [FlightZones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, zone_type]
 *             properties:
 *               name:
 *                 type: string
 *               zone_type:
 *                 type: string
 *                 enum: [forbidden, restricted, free]
 *               coordinates:
 *                 type: object
 *                 description: GeoJSON hoặc mảng tọa độ
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/zones',
  authenticate,
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Tên khu vực không được bỏ trống').isLength({ max: 150 }).withMessage('Tên khu vực tối đa 150 ký tự'),
    body('zone_type').isIn(['forbidden', 'restricted', 'free']).withMessage('Loại khu vực phải là forbidden, restricted hoặc free'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Mô tả tối đa 1000 ký tự'),
  ],
  validate,
  fzCtrl.create
);

/**
 * @swagger
 * /api/flight/zones/{id}:
 *   put:
 *     summary: Cập nhật khu vực bay (Admin)
 *     tags: [FlightZones]
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
 *               name:
 *                 type: string
 *               zone_type:
 *                 type: string
 *                 enum: [forbidden, restricted, free]
 *               coordinates:
 *                 type: object
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.put(
  '/zones/:id',
  authenticate,
  authorize('admin'),
  [
    body('name').optional().isLength({ min: 1, max: 150 }).withMessage('Tên khu vực không hợp lệ'),
    body('zone_type').optional().isIn(['forbidden', 'restricted', 'free']).withMessage('Loại khu vực không hợp lệ'),
  ],
  validate,
  fzCtrl.update
);

/**
 * @swagger
 * /api/flight/zones/{id}:
 *   delete:
 *     summary: Xóa khu vực bay (Admin)
 *     tags: [FlightZones]
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
router.delete('/zones/:id', authenticate, authorize('admin'), fzCtrl.remove);

// ─── Flight Permits ──────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: FlightPermits
 *   description: Giấy phép bay chuyến
 */

/**
 * @swagger
 * /api/flight/permits:
 *   get:
 *     summary: Danh sách giấy phép bay
 *     tags: [FlightPermits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, approved, rejected] }
 *       - in: query
 *         name: drone_id
 *         schema: { type: integer }
 *       - in: query
 *         name: zone_id
 *         schema: { type: integer }
 *       - in: query
 *         name: user_id
 *         schema: { type: integer }
 *       - in: query
 *         name: start_from
 *         description: Lọc từ thời điểm bay (ISO 8601)
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: start_to
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: created_from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: created_to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [id, status, start_time, end_time, createdAt] }
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
router.get('/permits', authenticate, fpCtrl.getAll);

/**
 * @swagger
 * /api/flight/permits/{id}:
 *   get:
 *     summary: Chi tiết giấy phép bay
 *     tags: [FlightPermits]
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
router.get('/permits/:id', authenticate, fpCtrl.getById);

/**
 * @swagger
 * /api/flight/permits:
 *   post:
 *     summary: Đăng ký xin cấp phép bay
 *     tags: [FlightPermits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [drone_id, zone_id, start_time, end_time]
 *             properties:
 *               drone_id:
 *                 type: integer
 *               zone_id:
 *                 type: integer
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-01T08:00:00.000Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-01T10:00:00.000Z"
 *               purpose:
 *                 type: string
 *                 example: Quay phim sự kiện
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/permits',
  authenticate,
  [
    body('drone_id').isInt({ min: 1 }).withMessage('ID máy bay không hợp lệ'),
    body('zone_id').isInt({ min: 1 }).withMessage('ID khu vực bay không hợp lệ'),
    body('start_time').isISO8601().withMessage('Thời gian bắt đầu không đúng định dạng (ISO 8601)'),
    body('end_time').isISO8601().withMessage('Thời gian kết thúc không đúng định dạng (ISO 8601)'),
    body('purpose').optional().isLength({ max: 500 }).withMessage('Mục đích bay tối đa 500 ký tự'),
  ],
  validate,
  fpCtrl.create
);

/**
 * @swagger
 * /api/flight/permits/{id}/review:
 *   patch:
 *     summary: Duyệt hoặc từ chối giấy phép (Admin/Police)
 *     tags: [FlightPermits]
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
 *               note:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.patch(
  '/permits/:id/review',
  authenticate,
  authorize('admin', 'police'),
  [body('status').isIn(['approved', 'rejected']).withMessage('Trạng thái phải là approved hoặc rejected')],
  validate,
  fpCtrl.review
);

/**
 * @swagger
 * /api/flight/permits/{id}:
 *   delete:
 *     summary: Xóa giấy phép bay
 *     tags: [FlightPermits]
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
router.delete('/permits/:id', authenticate, fpCtrl.remove);

// ─── Flight Logs ─────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: FlightLogs
 *   description: Nhật ký bay
 */

/**
 * @swagger
 * /api/flight/logs:
 *   get:
 *     summary: Danh sách nhật ký bay
 *     tags: [FlightLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: drone_id
 *         schema: { type: integer }
 *       - in: query
 *         name: permit_id
 *         schema: { type: integer }
 *       - in: query
 *         name: start_from
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: start_to
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: min_altitude
 *         schema: { type: number }
 *       - in: query
 *         name: max_altitude
 *         schema: { type: number }
 *       - in: query
 *         name: min_distance
 *         schema: { type: number }
 *       - in: query
 *         name: max_distance
 *         schema: { type: number }
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
router.get('/logs', authenticate, flCtrl.getAll);

/**
 * @swagger
 * /api/flight/logs/{id}:
 *   get:
 *     summary: Chi tiết nhật ký bay
 *     tags: [FlightLogs]
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
router.get('/logs/:id', authenticate, flCtrl.getById);

/**
 * @swagger
 * /api/flight/logs:
 *   post:
 *     summary: Ghi nhật ký bay
 *     tags: [FlightLogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [drone_id, start_time]
 *             properties:
 *               drone_id:
 *                 type: integer
 *               permit_id:
 *                 type: integer
 *                 nullable: true
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               max_altitude:
 *                 type: number
 *                 description: Độ cao tối đa (m)
 *               distance:
 *                 type: number
 *                 description: Khoảng cách bay (km)
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/logs',
  authenticate,
  [
    body('drone_id').isInt({ min: 1 }).withMessage('ID máy bay không hợp lệ'),
    body('start_time').isISO8601().withMessage('Thời gian bắt đầu không đúng định dạng'),
    body('end_time').optional().isISO8601().withMessage('Thời gian kết thúc không đúng định dạng'),
    body('permit_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('ID giấy phép không hợp lệ'),
    body('max_altitude').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Độ cao phải là số không âm'),
    body('distance').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Khoảng cách phải là số không âm'),
  ],
  validate,
  flCtrl.create
);

/**
 * @swagger
 * /api/flight/logs/{id}:
 *   put:
 *     summary: Cập nhật nhật ký bay
 *     tags: [FlightLogs]
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
 *               end_time:
 *                 type: string
 *                 format: date-time
 *               max_altitude:
 *                 type: number
 *               distance:
 *                 type: number
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.put(
  '/logs/:id',
  authenticate,
  [
    body('end_time').optional().isISO8601().withMessage('Thời gian kết thúc không đúng định dạng'),
    body('max_altitude').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Độ cao phải là số không âm'),
    body('distance').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Khoảng cách phải là số không âm'),
  ],
  validate,
  flCtrl.update
);

/**
 * @swagger
 * /api/flight/logs/{id}:
 *   delete:
 *     summary: Xóa nhật ký bay (Admin)
 *     tags: [FlightLogs]
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
router.delete('/logs/:id', authenticate, authorize('admin'), flCtrl.remove);

module.exports = router;
