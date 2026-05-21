const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/drone.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

const createValidator = [
  body('model_name').notEmpty().withMessage('Tên model không được bỏ trống').isLength({ max: 150 }).withMessage('Tên model tối đa 150 ký tự'),
  body('serial_number').notEmpty().withMessage('Số serial không được bỏ trống').isLength({ max: 100 }).withMessage('Số serial tối đa 100 ký tự'),
  body('manufacturer_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('ID nhà sản xuất phải là số nguyên dương'),
  body('category_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('ID danh mục phải là số nguyên dương'),
  body('weight').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Trọng lượng phải là số không âm'),
  body('max_flight_height').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Độ cao bay tối đa phải là số không âm'),
  body('images').optional().isArray().withMessage('Danh sách ảnh phải là mảng'),
];

const updateValidator = [
  body('model_name').optional().isLength({ min: 1, max: 150 }).withMessage('Tên model không hợp lệ'),
  body('manufacturer_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('ID nhà sản xuất không hợp lệ'),
  body('category_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('ID danh mục không hợp lệ'),
  body('weight').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Trọng lượng phải là số không âm'),
  body('max_flight_height').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Độ cao bay tối đa phải là số không âm'),
  body('images').optional().isArray().withMessage('Danh sách ảnh phải là mảng'),
];

/**
 * @swagger
 * tags:
 *   name: Drones
 *   description: Quản lý máy bay không người lái
 */

/**
 * @swagger
 * /api/drones:
 *   get:
 *     summary: Danh sách máy bay
 *     tags: [Drones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Tìm kiếm theo tên model hoặc serial
 *         schema: { type: string }
 *       - in: query
 *         name: owner_id
 *         schema: { type: integer }
 *       - in: query
 *         name: category_id
 *         schema: { type: integer }
 *       - in: query
 *         name: manufacturer_id
 *         schema: { type: integer }
 *       - in: query
 *         name: min_weight
 *         schema: { type: number }
 *       - in: query
 *         name: max_weight
 *         schema: { type: number }
 *       - in: query
 *         name: min_height
 *         schema: { type: number }
 *       - in: query
 *         name: max_height
 *         schema: { type: number }
 *       - in: query
 *         name: created_from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: created_to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [id, model_name, serial_number, weight, max_flight_height, createdAt] }
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
 * /api/drones/{id}:
 *   get:
 *     summary: Chi tiết máy bay
 *     tags: [Drones]
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
 * /api/drones:
 *   post:
 *     summary: Đăng ký máy bay mới
 *     tags: [Drones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [model_name, serial_number]
 *             properties:
 *               model_name:
 *                 type: string
 *                 example: DJI Mini 3 Pro
 *               serial_number:
 *                 type: string
 *                 example: DJI12345678
 *               manufacturer_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               weight:
 *                 type: number
 *                 example: 0.249
 *               max_flight_height:
 *                 type: number
 *                 example: 120
 *               images:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post('/', authenticate, createValidator, validate, ctrl.create);

/**
 * @swagger
 * /api/drones/{id}:
 *   put:
 *     summary: Cập nhật thông tin máy bay
 *     tags: [Drones]
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
 *               model_name:
 *                 type: string
 *               manufacturer_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               weight:
 *                 type: number
 *               max_flight_height:
 *                 type: number
 *               images:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.put('/:id', authenticate, updateValidator, validate, ctrl.update);

/**
 * @swagger
 * /api/drones/{id}/transfer:
 *   patch:
 *     summary: Chuyển nhượng quyền sở hữu máy bay
 *     tags: [Drones]
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
 *             required: [new_owner_id]
 *             properties:
 *               new_owner_id:
 *                 type: integer
 *                 description: ID người nhận máy bay
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.patch(
  '/:id/transfer',
  authenticate,
  [body('new_owner_id').isInt({ min: 1 }).withMessage('ID người nhận không hợp lệ')],
  validate,
  ctrl.transfer
);

/**
 * @swagger
 * /api/drones/{id}:
 *   delete:
 *     summary: Xóa máy bay
 *     tags: [Drones]
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
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;
