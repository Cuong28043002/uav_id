const express = require('express');
const router = express.Router();
const nCtrl = require('../controllers/notification.controller');
const sCtrl = require('../controllers/systemSetting.controller');
const rCtrl = require('../controllers/role.controller');
const mCtrl = require('../controllers/manufacturer.controller');
const cCtrl = require('../controllers/droneCategory.controller');
const lCtrl = require('../controllers/lookup.controller');
const statsCtrl = require('../controllers/stats.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate.middleware');

// ─── Admin Stats ─────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Thống kê & báo cáo (Admin)
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Dashboard thống kê tổng quan (Admin)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.get('/admin/stats', authenticate, authorize('admin'), statsCtrl.getDashboard);

/**
 * @swagger
 * /api/admin/stats/monthly:
 *   get:
 *     summary: Thống kê theo tháng (Admin)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema: { type: integer }
 *         description: "Năm thống kê (mặc định: năm hiện tại)"
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.get('/admin/stats/monthly', authenticate, authorize('admin'), statsCtrl.getMonthlyStats);

// ─── Notifications ────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Thông báo hệ thống
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Danh sách thông báo của tôi
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: is_read
 *         schema: { type: boolean }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [system, registration, permit] }
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
router.get('/notifications', authenticate, nCtrl.getAll);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     summary: Đánh dấu tất cả thông báo đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.patch('/notifications/read-all', authenticate, nCtrl.markAllRead);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Đánh dấu 1 thông báo đã đọc
 *     tags: [Notifications]
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
router.patch('/notifications/:id/read', authenticate, nCtrl.markRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Xóa thông báo
 *     tags: [Notifications]
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
router.delete('/notifications/:id', authenticate, nCtrl.remove);

/**
 * @swagger
 * /api/notifications/broadcast:
 *   post:
 *     summary: Gửi thông báo hàng loạt (Admin)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, content]
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               role_id:
 *                 type: integer
 *                 description: Gửi cho role cụ thể (bỏ trống = gửi tất cả)
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/notifications/broadcast',
  authenticate,
  authorize('admin'),
  [
    body('title').notEmpty().withMessage('Tiêu đề thông báo không được bỏ trống').isLength({ max: 255 }).withMessage('Tiêu đề tối đa 255 ký tự'),
    body('content').notEmpty().withMessage('Nội dung thông báo không được bỏ trống'),
    body('role_id').optional({ nullable: true }).isInt({ min: 1 }).withMessage('ID role không hợp lệ'),
  ],
  validate,
  nCtrl.broadcast
);

// ─── SystemSettings ────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: SystemSettings
 *   description: Cài đặt hệ thống (Admin)
 */

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Danh sách cài đặt (Admin)
 *     tags: [SystemSettings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Tìm theo key hoặc mô tả
 *         schema: { type: string }
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.get('/settings', authenticate, authorize('admin'), sCtrl.getAll);

/**
 * @swagger
 * /api/settings/{key}:
 *   get:
 *     summary: Chi tiết cài đặt theo key (Admin)
 *     tags: [SystemSettings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.get('/settings/:key', authenticate, authorize('admin'), sCtrl.getByKey);

/**
 * @swagger
 * /api/settings:
 *   post:
 *     summary: Thêm / cập nhật cài đặt (Admin)
 *     tags: [SystemSettings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key_name, key_value]
 *             properties:
 *               key_name:
 *                 type: string
 *               key_value:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/settings',
  authenticate,
  authorize('admin'),
  [
    body('key_name').notEmpty().withMessage('Tên cài đặt (key) không được bỏ trống').isAlphanumeric('en-US', { ignore: '_-' }).withMessage('Tên cài đặt chỉ được chứa chữ, số và dấu gạch'),
    body('key_value').notEmpty().withMessage('Giá trị cài đặt không được bỏ trống'),
  ],
  validate,
  sCtrl.upsert
);

/**
 * @swagger
 * /api/settings/{id}:
 *   delete:
 *     summary: Xóa cài đặt (Admin)
 *     tags: [SystemSettings]
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
router.delete('/settings/:id', authenticate, authorize('admin'), sCtrl.remove);

// ─── Roles ────────────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Phân quyền (Admin)
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Danh sách vai trò (Admin)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.get('/roles', authenticate, authorize('admin'), rCtrl.getAll);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Chi tiết vai trò (Admin)
 *     tags: [Roles]
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
router.get('/roles/:id', authenticate, authorize('admin'), rCtrl.getById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Tạo vai trò mới (Admin)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/roles',
  authenticate,
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Tên role không được bỏ trống'),
    body('description').optional().isLength({ max: 500 }).withMessage('Mô tả tối đa 500 ký tự'),
  ],
  validate,
  rCtrl.create
);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Cập nhật vai trò (Admin)
 *     tags: [Roles]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.put(
  '/roles/:id',
  authenticate,
  authorize('admin'),
  [body('description').optional().isLength({ max: 500 }).withMessage('Mô tả tối đa 500 ký tự')],
  validate,
  rCtrl.update
);

// ─── Manufacturers ────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Manufacturers
 *   description: Nhà sản xuất UAV
 */

/**
 * @swagger
 * /api/manufacturers:
 *   get:
 *     summary: Danh sách nhà sản xuất
 *     tags: [Manufacturers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Tìm theo tên hoặc email
 *         schema: { type: string }
 *       - in: query
 *         name: country
 *         schema: { type: string }
 *       - in: query
 *         name: sort_by
 *         schema: { type: string, enum: [id, name, country, createdAt] }
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
router.get('/manufacturers', authenticate, mCtrl.getAll);

/**
 * @swagger
 * /api/manufacturers/{id}:
 *   get:
 *     summary: Chi tiết nhà sản xuất
 *     tags: [Manufacturers]
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
router.get('/manufacturers/:id', authenticate, mCtrl.getById);

/**
 * @swagger
 * /api/manufacturers:
 *   post:
 *     summary: Thêm nhà sản xuất (Admin)
 *     tags: [Manufacturers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               support_email:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/manufacturers',
  authenticate,
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Tên nhà sản xuất không được bỏ trống').isLength({ max: 150 }).withMessage('Tên nhà sản xuất tối đa 150 ký tự'),
    body('country').optional().isLength({ max: 100 }).withMessage('Tên quốc gia tối đa 100 ký tự'),
    body('support_email').optional().isEmail().withMessage('Email hỗ trợ không đúng định dạng'),
  ],
  validate,
  mCtrl.create
);

/**
 * @swagger
 * /api/manufacturers/{id}:
 *   put:
 *     summary: Cập nhật nhà sản xuất (Admin)
 *     tags: [Manufacturers]
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
 *               support_email:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.put(
  '/manufacturers/:id',
  authenticate,
  authorize('admin'),
  [
    body('name').optional().isLength({ min: 1, max: 150 }).withMessage('Tên nhà sản xuất không hợp lệ'),
    body('support_email').optional().isEmail().withMessage('Email hỗ trợ không đúng định dạng'),
  ],
  validate,
  mCtrl.update
);

/**
 * @swagger
 * /api/manufacturers/{id}:
 *   delete:
 *     summary: Xóa nhà sản xuất (Admin)
 *     tags: [Manufacturers]
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
router.delete('/manufacturers/:id', authenticate, authorize('admin'), mCtrl.remove);

// ─── Drone Categories ─────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: DroneCategories
 *   description: Danh mục loại máy bay
 */

/**
 * @swagger
 * /api/drone-categories:
 *   get:
 *     summary: Danh sách danh mục máy bay
 *     tags: [DroneCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Tìm theo tên hoặc mô tả
 *         schema: { type: string }
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
router.get('/drone-categories', authenticate, cCtrl.getAll);

/**
 * @swagger
 * /api/drone-categories/{id}:
 *   get:
 *     summary: Chi tiết danh mục máy bay
 *     tags: [DroneCategories]
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
router.get('/drone-categories/:id', authenticate, cCtrl.getById);

/**
 * @swagger
 * /api/drone-categories:
 *   post:
 *     summary: Thêm danh mục máy bay (Admin)
 *     tags: [DroneCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/drone-categories',
  authenticate,
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Tên danh mục không được bỏ trống').isLength({ max: 100 }).withMessage('Tên danh mục tối đa 100 ký tự'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Mô tả tối đa 1000 ký tự'),
  ],
  validate,
  cCtrl.create
);

/**
 * @swagger
 * /api/drone-categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục máy bay (Admin)
 *     tags: [DroneCategories]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 */
router.put(
  '/drone-categories/:id',
  authenticate,
  authorize('admin'),
  [
    body('name').optional().isLength({ min: 1, max: 100 }).withMessage('Tên danh mục không hợp lệ'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Mô tả tối đa 1000 ký tự'),
  ],
  validate,
  cCtrl.update
);

/**
 * @swagger
 * /api/drone-categories/{id}:
 *   delete:
 *     summary: Xóa danh mục máy bay (Admin)
 *     tags: [DroneCategories]
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
router.delete('/drone-categories/:id', authenticate, authorize('admin'), cCtrl.remove);

// ─── Public Lookup ────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   name: Lookup
 *   description: Tra cứu định danh UAV (công khai)
 */

/**
 * @swagger
 * /api/lookup/{identification_code}:
 *   get:
 *     summary: Tra cứu UAV theo mã định danh (không cần đăng nhập)
 *     tags: [Lookup]
 *     parameters:
 *       - in: path
 *         name: identification_code
 *         required: true
 *         schema: { type: string }
 *         description: Mã định danh UAV (ví dụ UAV-ABC123-XY9Z)
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         $ref: '#/components/schemas/Error'
 */
router.get('/lookup/:identification_code', lCtrl.lookup);

/**
 * @swagger
 * /api/lookup-history:
 *   get:
 *     summary: Lịch sử tra cứu (Admin/Police)
 *     tags: [Lookup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Tìm theo mã định danh
 *         schema: { type: string }
 *       - in: query
 *         name: ip_address
 *         schema: { type: string }
 *       - in: query
 *         name: date_from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: date_to
 *         schema: { type: string, format: date }
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
router.get('/lookup-history', authenticate, authorize('admin', 'police'), lCtrl.getHistory);

module.exports = router;
