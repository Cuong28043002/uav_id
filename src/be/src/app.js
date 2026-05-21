require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { sequelize } = require('./models');

const app = express();

// ─── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ─── Swagger UI ──────────────────────────────────────────────
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'UAV ID System API Docs',
    customCss: `
      .topbar { background-color: #1a1a2e !important; }
      .topbar-wrapper img { content: url("https://img.icons8.com/fluency/48/drone.png"); }
      .swagger-ui .info .title { color: #16213e; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  })
);

// JSON spec endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/drones', require('./routes/drone.routes'));
app.use('/api/registrations', require('./routes/registration.routes'));
app.use('/api/flight', require('./routes/flight.routes'));
app.use('/api', require('./routes/enforcement.routes'));
app.use('/api', require('./routes/misc.routes'));

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    docs: `http://localhost:${process.env.PORT || 5000}/api-docs`,
  });
});

// ─── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} không tồn tại` });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Lỗi server nội bộ', error: err.message });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công');

    // Sync models - alter:true để thêm cột mới vào bảng hiện có
    await sequelize.sync({ alter: true });
    console.log('✅ Đồng bộ models thành công');

    app.listen(PORT, () => {
      console.log(`\n🚀 UAV ID Backend đang chạy tại http://localhost:${PORT}`);
      console.log(`📖 Swagger UI: http://localhost:${PORT}/api-docs`);
      console.log(`❤  Health: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Lỗi khởi động:', error);
    process.exit(1);
  }
};

start();
