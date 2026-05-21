const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UAV ID System API',
      version: '1.0.0',
      description: `
## Hệ thống Quản lý và Định danh Máy bay Không người lái (UAV)

### 🔐 Hướng dẫn xác thực
1. Gọi **POST /api/auth/login** với \`{"email":"admin@uavid.vn","password":"Admin@123456"}\`
2. Copy giá trị \`data.token\` từ response
3. Click nút **Authorize 🔓** (góc phải trên)
4. Paste **chỉ token** (KHÔNG có chữ "Bearer ") vào ô input → Click Authorize

> ⚠️ **Lưu ý**: Swagger tự thêm "Bearer " vào header. Chỉ paste raw token.

### 🧑‍💻 Tài khoản test
| Role | Email | Password |
|------|-------|----------|
| 👑 Admin | admin@uavid.vn | Admin@123456 |
| 🚔 Police | police1@uavid.vn | Police@123456 |
| 👤 User | user1@uavid.vn | User@123456 |

### 📋 Phân quyền
| Role    | Mô tả                                      |
|---------|---------------------------------------------|
| admin   | Toàn quyền quản trị hệ thống               |
| police  | Kiểm tra, ghi vi phạm, duyệt phép bay      |
| user    | Người dùng thông thường, chủ UAV           |
      `,
      contact: {
        name: 'UAV ID Team',
        email: 'admin@uavid.vn',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    security: [
      { bearerAuth: [] },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: '⚠️ CHỈ nhập TOKEN (không có chữ "Bearer "). Ví dụ: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
      schemas: {
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            meta: { $ref: '#/components/schemas/Pagination' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
