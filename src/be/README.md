# UAV ID System - Backend API

Hệ thống quản lý và định danh máy bay không người lái (UAV) - Backend Node.js/Express/Sequelize

## 🚀 Khởi động nhanh

### 1. Cài đặt dependencies
```bash
cd be
npm install
```

### 2. Cấu hình môi trường
Chỉnh sửa file `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=uav_id_db
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

### 3. Tạo database
```bash
# Import script SQL vào MySQL
mysql -u root -p < database.sql
```

### 4. Chạy server
```bash
npm run dev
```

## 📖 API Documentation

Swagger UI: **http://localhost:5000/api-docs**

## 🗂️ Cấu trúc thư mục

```
be/
├── src/
│   ├── app.js                    # Entry point Express
│   ├── config/
│   │   ├── database.js           # Sequelize config
│   │   └── swagger.js            # OpenAPI/Swagger config
│   ├── models/
│   │   ├── index.js              # Khởi tạo Sequelize + tất cả associations
│   │   ├── Role.js
│   │   ├── User.js
│   │   ├── Manufacturer.js
│   │   ├── DroneCategory.js
│   │   ├── Drone.js
│   │   ├── Registration.js
│   │   ├── FlightZone.js
│   │   ├── FlightPermit.js
│   │   ├── FlightLog.js
│   │   ├── Violation.js
│   │   ├── Inspection.js
│   │   ├── Notification.js
│   │   ├── OtpCode.js
│   │   ├── LookupHistory.js
│   │   └── SystemSetting.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── drone.controller.js
│   │   ├── registration.controller.js
│   │   ├── flightPermit.controller.js
│   │   ├── flightLog.controller.js
│   │   ├── flightZone.controller.js
│   │   ├── violation.controller.js
│   │   ├── inspection.controller.js
│   │   ├── notification.controller.js
│   │   ├── lookup.controller.js
│   │   ├── manufacturer.controller.js
│   │   ├── droneCategory.controller.js
│   │   ├── role.controller.js
│   │   └── systemSetting.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── drone.routes.js
│   │   ├── registration.routes.js
│   │   ├── flight.routes.js       # Zones + Permits + Logs
│   │   ├── enforcement.routes.js  # Violations + Inspections
│   │   └── misc.routes.js         # Notifications, Settings, Lookup...
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT verify + role authorize
│   │   └── validate.middleware.js
│   └── utils/
│       └── helpers.js
├── database.sql                  # Script tạo DB + seed data
├── .env
└── package.json
```

## 🔐 Phân quyền

| Role   | Mô tả |
|--------|-------|
| admin  | Toàn quyền hệ thống |
| police | Kiểm tra, vi phạm, duyệt phép bay |
| user   | Chủ UAV |

## 📋 Danh sách API chính

### Auth
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/auth/me | Thông tin tôi |
| POST | /api/auth/change-password | Đổi mật khẩu |
| POST | /api/auth/forgot-password | Quên mật khẩu |
| POST | /api/auth/reset-password | Đặt lại mật khẩu |

### Drones
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/drones | Danh sách UAV |
| POST | /api/drones | Đăng ký UAV |
| GET | /api/drones/:id | Chi tiết UAV |
| PUT | /api/drones/:id | Cập nhật UAV |
| DELETE | /api/drones/:id | Xóa UAV |

### Lookup (Công khai)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/lookup/:code | Tra cứu UAV theo mã |

> Xem đầy đủ tại **Swagger UI**
