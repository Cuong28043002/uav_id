/**
 * UAV ID System - Seed Accounts Script
 * Tạo tài khoản mẫu cho 3 vai trò: admin, police, user
 * Run: node scripts/seed-accounts.js
 */
require('dotenv').config();
const { hashPassword } = require('../src/utils/helpers');
const { sequelize, Role, User, Drone, Registration, Manufacturer, DroneCategory, FlightZone } = require('../src/models');

const accounts = [
  // ─── ADMIN ────────────────────────────────────────────────────
  {
    role: 'admin',
    full_name: 'Quản trị viên',
    email: 'admin@uavid.vn',
    password: 'Admin@123456',
    phone: '0901000001',
    cccd_number: '001001000001',
    address: 'Bộ Giao thông Vận tải, Hà Nội',
  },
  // ─── POLICE ───────────────────────────────────────────────────
  {
    role: 'police',
    full_name: 'Nguyễn Văn Cảnh Sát',
    email: 'police1@uavid.vn',
    password: 'Police@123456',
    phone: '0901000002',
    cccd_number: '001001000002',
    address: 'Cục Hàng không Việt Nam, 119 Nguyễn Sơn, Hà Nội',
  },
  {
    role: 'police',
    full_name: 'Trần Thị An Ninh',
    email: 'police2@uavid.vn',
    password: 'Police@123456',
    phone: '0901000003',
    cccd_number: '001001000003',
    address: 'Sân bay Tân Sơn Nhất, TP.HCM',
  },
  // ─── USER ─────────────────────────────────────────────────────
  {
    role: 'user',
    full_name: 'Lê Văn A',
    email: 'user1@uavid.vn',
    password: 'User@123456',
    phone: '0901000004',
    cccd_number: '001001000004',
    address: '12 Lý Tự Trọng, Quận 1, TP.HCM',
  },
  {
    role: 'user',
    full_name: 'Phạm Thị B',
    email: 'user2@uavid.vn',
    password: 'User@123456',
    phone: '0901000005',
    cccd_number: '001001000005',
    address: '45 Trần Phú, Ba Đình, Hà Nội',
  },
  {
    role: 'user',
    full_name: 'Nguyễn Minh C',
    email: 'user3@uavid.vn',
    password: 'User@123456',
    phone: '0901000006',
    cccd_number: '001001000006',
    address: '78 Nguyễn Huệ, Hải Châu, Đà Nẵng',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('\n🔌 Kết nối database thành công\n');

    const roles = await Role.findAll({ raw: true });
    const roleMap = {};
    roles.forEach(r => { roleMap[r.name] = r.id; });

    if (!roleMap['admin'] || !roleMap['police'] || !roleMap['user']) {
      console.error('❌ Chưa có dữ liệu Roles. Hãy chạy database.sql trước!');
      process.exit(1);
    }

    const results = [];

    for (const acc of accounts) {
      const existing = await User.findOne({ where: { email: acc.email } });
      if (existing) {
        results.push({ ...acc, status: '⏭️  Đã tồn tại', id: existing.id });
        continue;
      }
      const hashedPwd = await hashPassword(acc.password);
      const user = await User.create({
        role_id: roleMap[acc.role],
        full_name: acc.full_name,
        email: acc.email,
        password: hashedPwd,
        phone: acc.phone,
        cccd_number: acc.cccd_number,
        address: acc.address,
        status: 'active',
      });
      results.push({ ...acc, status: '✅ Tạo mới', id: user.id });
    }

    // ─── Seed drone mẫu cho user1 ────────────────────────────────
    const user1 = await User.findOne({ where: { email: 'user1@uavid.vn' } });
    const mfrs = await Manufacturer.findAll({ raw: true });
    const cats = await DroneCategory.findAll({ raw: true });
    const dji  = mfrs.find(m => m.name === 'DJI');
    const parrot = mfrs.find(m => m.name === 'Parrot');
    const catFilm = cats.find(c => c.name === 'Quay phim / Chụp ảnh');
    const catAgri = cats.find(c => c.name === 'Nông nghiệp');

    let dronesSeed = 0;
    if (user1 && !await Drone.findOne({ where: { serial_number: 'DJI-SEED-001' } })) {
      await Drone.create({
        owner_id: user1.id,
        manufacturer_id: dji?.id || null,
        category_id: catFilm?.id || null,
        model_name: 'DJI Mini 3 Pro',
        serial_number: 'DJI-SEED-001',
        weight: 0.249,
        max_flight_height: 120,
      });
      dronesSeed++;
    }
    if (user1 && !await Drone.findOne({ where: { serial_number: 'PARROT-SEED-002' } })) {
      await Drone.create({
        owner_id: user1.id,
        manufacturer_id: parrot?.id || null,
        category_id: catAgri?.id || null,
        model_name: 'Parrot Bluegrass Fields',
        serial_number: 'PARROT-SEED-002',
        weight: 1.9,
        max_flight_height: 100,
      });
      dronesSeed++;
    }

    // ─── Seed flight zones mẫu ───────────────────────────────────
    let zonesSeed = 0;
    const zoneSamples = [
      { name: 'Sân bay Nội Bài - Vùng cấm', zone_type: 'forbidden', description: 'Vùng cấm bay xung quanh sân bay quốc tế Nội Bài (bán kính 8km)' },
      { name: 'Sân bay Tân Sơn Nhất - Vùng cấm', zone_type: 'forbidden', description: 'Vùng cấm bay xung quanh sân bay Tân Sơn Nhất (bán kính 8km)' },
      { name: 'Khu vực Hồ Tây - Hạn chế', zone_type: 'restricted', description: 'Khu vực bay hạn chế quanh Hồ Tây, cần xin phép' },
      { name: 'Công viên Thống Nhất - Tự do', zone_type: 'free', description: 'Khu vực được phép bay tự do dưới 30m' },
      { name: 'Bãi biển Mỹ Khê - Tự do', zone_type: 'free', description: 'Khu vực bay tự do tại bãi biển Mỹ Khê, Đà Nẵng' },
    ];
    for (const z of zoneSamples) {
      if (!await FlightZone.findOne({ where: { name: z.name } })) {
        await FlightZone.create(z);
        zonesSeed++;
      }
    }

    // ─── In kết quả ──────────────────────────────────────────────
    console.log('═'.repeat(60));
    console.log('  DANH SÁCH TÀI KHOẢN TEST');
    console.log('═'.repeat(60));

    let currentRole = '';
    for (const r of results) {
      if (r.role !== currentRole) {
        currentRole = r.role;
        const label = r.role === 'admin' ? '👑 ADMIN' : r.role === 'police' ? '🚔 POLICE' : '👤 USER';
        console.log(`\n  ${label}`);
        console.log('  ' + '─'.repeat(56));
      }
      console.log(`  ${r.status}  ID: ${String(r.id).padEnd(4)} | ${r.email.padEnd(25)} | ${r.password}`);
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`  ✅ Drone mẫu tạo mới: ${dronesSeed}`);
    console.log(`  ✅ Khu vực bay tạo mới: ${zonesSeed}`);
    console.log('═'.repeat(60));
    console.log('\n  💡 Swagger UI: http://localhost:5000/api-docs');
    console.log('  💡 POST /api/auth/login  →  { email, password }');
    console.log('═'.repeat(60) + '\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
  }
}

seed();
