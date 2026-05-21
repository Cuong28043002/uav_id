# 🚁 Hệ Thống Định Danh và Giám Sát UAV (UAV ID System)

Hệ thống quản lý, giám sát và định danh máy bay không người lái (UAV) toàn diện, được thiết kế và xây dựng theo mô hình Client-Server. Hệ thống hỗ trợ định danh thiết bị qua mã QR, quản lý cấp phép bay, theo dõi hành trình và giám sát vi phạm thực địa theo chuẩn định danh từ xa (Remote ID).

[![Node.js Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=flat-svg&logo=node.js)](src/be)
[![React Native Frontend](https://img.shields.io/badge/Frontend-React%20Native%20%7C%20Expo-blue?style=flat-svg&logo=react)](src/fe)
[![Database](https://img.shields.io/badge/Database-MySQL-orange?style=flat-svg&logo=mysql)](src/uav_id_db.sql)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-svg)](LICENSE)

---

## 📌 Tổng Quan Hệ Thống

Dự án bao gồm hai thành phần chính:
1. **Backend**: API RESTful xây dựng bằng Node.js/Express, sử dụng Sequelize ORM kết nối cơ sở dữ liệu MySQL. Hỗ trợ tài liệu hóa API tự động qua Swagger UI.
2. **Frontend**: Ứng dụng di động đa nền tảng (iOS/Android) xây dựng bằng React Native (Expo SDK 54), tích hợp cơ chế phân quyền 3 lớp (Admin, Cảnh sát, Người dùng).

---

## ✨ Các Tính Năng Chính Theo Vai Trò

### 1. 👤 Chủ Sở Hữu UAV (User)
* **Quản lý thiết bị (My Drones)**: Đăng ký sở hữu thiết bị bay mới, gửi hồ sơ định danh lên hệ thống và nhận mã định danh kèm tem QR Code duy nhất cho mỗi UAV.
* **Yêu cầu cấp phép bay (Request Flight)**: Xin phép bay cho thiết bị cụ thể với đầy đủ thông tin về vùng bay (tọa độ GPS, bán kính), thời gian bay, độ cao tối đa.
* **Giám sát trực quan (Live Flight)**: Theo dõi hành trình chuyến bay thời gian thực, mô phỏng tọa độ GPS và nhận cảnh báo nếu bay vào vùng cấm hoặc vùng hạn chế.
* **Nhật ký bay (Flight Logs)**: Lưu trữ lịch sử chuyến bay và các thông số kỹ thuật (độ cao, tốc độ, lộ trình).
* **Tra cứu vi phạm (My Violations)**: Xem chi tiết các vi phạm bị ghi nhận bởi lực lượng chức năng.

### 2. 👮 Cảnh Sát Hàng Không (Police)
* **Quét mã QR định danh (QR Scanner)**: Sử dụng camera quét mã QR dán trên UAV để tra cứu nhanh thông tin chủ sở hữu, trạng thái đăng ký, giấy phép bay hiện hành.
* **Tra cứu thực địa (Search Drones)**: Tra cứu nhanh thiết bị theo mã định danh hoặc tên chủ sở hữu.
* **Ghi nhận vi phạm (Report Violation)**: Lập biên bản vi phạm trực tiếp ngay tại thực địa đối với các UAV vi phạm (không phép, bay sai vùng, sai thời gian...) kèm hình ảnh và tọa độ GPS.
* **Bản đồ vùng bay (Zones Map)**: Xem bản đồ trực quan các vùng cấm bay (vùng đỏ) và vùng hạn chế bay (vùng vàng).
* **Duyệt giấy phép bay**: Phê duyệt các yêu cầu xin cấp phép bay của người dùng trong khu vực quản lý.

### 3. 🛡️ Quản Trị Viên Hệ Thống (Admin)
* **Quản lý người dùng (Manage Users)**: Kích hoạt, khóa tài khoản hoặc thay đổi phân quyền (Admin, Police, User).
* **Phê duyệt UAV (Approve Drones)**: Thẩm định hồ sơ đăng ký UAV, phê duyệt và cấp mã định danh chính thức.
* **Cấu hình hệ thống (System Settings)**: Điều chỉnh các thông số hệ thống, thời hạn OTP, giới hạn vùng bay, v.v.
* **Quản lý danh mục**: Quản lý danh sách nhà sản xuất (Manufacturer) và các dòng máy bay (Drone Category).

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database & ORM**: MySQL & Sequelize ORM
* **Bảo mật**: JWT (JSON Web Tokens), bcryptjs (mã hóa mật khẩu)
* **Tài liệu API**: Swagger UI (`swagger-jsdoc` & `swagger-ui-express`)
* **Tiện ích**: `nodemailer` (gửi email OTP), `qrcode` (tự động tạo QR code định danh), `multer` (quản lý upload file)

### Frontend
* **Framework**: React Native & Expo SDK 54
* **Navigation**: React Navigation v7 (Stack & Bottom Tabs)
* **HTTP Client**: Axios
* **UI Components**: Expo Linear Gradient, Vector Icons, Safe Area Context

---

## 🗂️ Cấu Trúc Dự Án

```
uav_id/
├── references/              # Tài liệu tham khảo kỹ thuật & Quy chuẩn Remote ID
├── src/
│   ├── be/                  # Source code Backend (Node.js/Express)
│   │   ├── src/
│   │   │   ├── config/      # Cấu hình DB, Swagger
│   │   │   ├── controllers/ # Logic xử lý API
│   │   │   ├── models/      # Định nghĩa các bảng dữ liệu (Sequelize)
│   │   │   ├── routes/      # Định nghĩa các endpoints API
│   │   │   ├── middlewares/ # Middleware bảo mật (JWT, Role check)
│   │   │   └── utils/       # Hàm tiện ích
│   │   └── database.sql     # File SQL sao lưu dữ liệu ban đầu
│   ├── fe/                  # Source code Frontend (React Native/Expo)
│   │   ├── src/
│   │   │   ├── api/         # Cấu hình gọi API (Axios client)
│   │   │   ├── components/  # Các component dùng chung
│   │   │   ├── navigation/  # Cấu hình luồng màn hình (Stack, Tabs)
│   │   │   └── screens/     # Các màn hình chức năng chia theo vai trò
│   │   └── App.js           # Entry point của ứng dụng Mobile
│   ├── uav_id_db.sql        # Database dự phòng
│   └── account.txt          # Danh sách tài khoản thử nghiệm
└── README.md                # Tài liệu dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt và Khởi Chạy

### 1. Thiết Lập Cơ Sở Dữ Liệu
1. Tạo một cơ sở dữ liệu MySQL trống có tên là `uav_id_db`.
2. Khởi tạo dữ liệu bằng cách import file `src/uav_id_db.sql` hoặc `src/be/database.sql` vào database vừa tạo.
   ```bash
   mysql -u root -p uav_id_db < src/uav_id_db.sql
   ```

### 2. Cài Đặt và Chạy Backend
1. Di chuyển vào thư mục backend:
   ```bash
   cd src/be
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo và cấu hình file `.env` tại thư mục `src/be/`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=uav_id_db
   DB_USER=your_mysql_user       # Thay bằng user MySQL của bạn (VD: root)
   DB_PASSWORD=your_mysql_password # Thay bằng mật khẩu MySQL của bạn
   JWT_SECRET=UAV_ID_SECRET_KEY_2026
   ```
4. Khởi chạy backend ở chế độ phát triển:
   ```bash
   npm run dev
   ```
   * *Backend sẽ chạy tại:* `http://localhost:5000`
   * *Tài liệu API (Swagger UI) tại:* `http://localhost:5000/api-docs`

### 3. Cài Đặt và Chạy Frontend
1. Di chuyển vào thư mục frontend:
   ```bash
   cd src/fe
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Cấu hình địa chỉ IP backend trong file `src/fe/src/api/client.js` (hoặc cấu hình tương đương) để trỏ về IP của máy tính chạy server (không dùng `localhost` khi test trên thiết bị thật).
4. Khởi chạy ứng dụng Expo:
   ```bash
   npm start
   ```
5. Sử dụng ứng dụng **Expo Go** trên điện thoại di động (iOS hoặc Android) để quét mã QR được hiển thị trên terminal để trải nghiệm ứng dụng trực tiếp.

---

## 🔑 Tài Khoản Thử Nghiệm

Hệ thống đã được cấu hình sẵn các tài khoản demo tương ứng với từng vai trò phục vụ mục đích kiểm thử (Xem thêm tại [account.txt](src/account.txt)):

| Vai Trò | Email Đăng Nhập | Mật Khẩu | Quyền Hạn |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@uavid.vn` | `Admin@123456` | Quản lý người dùng, duyệt UAV, cấu hình hệ thống |
| **POLICE** | `police1@uavid.vn`<br>`police2@uavid.vn` | `Police@123456` | Quét QR định danh, lập biên bản vi phạm, duyệt phép bay |
| **USER** | `user1@uavid.vn`<br>`user2@uavid.vn`<br>`user3@uavid.vn` | `User@123456` | Đăng ký UAV, xin cấp phép bay, theo dõi hành trình bay |

---

## 📑 Tài Liệu Tham Khảo Kỹ Thuật

Thư mục `references/` chứa các tài liệu quy chuẩn kỹ thuật phục vụ xây dựng hệ thống:
* **Tài liệu ASTM F3411**: Quy chuẩn quốc tế về Định danh từ xa của UAV (UAS Remote ID).
* **Tài liệu FAA (Remote ID Final Rule)**: Quy định của Cục Hàng không Liên bang Mỹ về định danh thiết bị bay.
* **REST API Design Rulebook**: Quy chuẩn thiết kế API RESTful.
* **WebSocket**: Cơ chế truyền dữ liệu thời gian thực phục vụ cho Live Tracking.
