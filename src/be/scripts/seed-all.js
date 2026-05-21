/**
 * UAV ID - Full Database Seed Script
 * Run: node scripts/seed-all.js
 */
require('dotenv').config();
const { hashPassword } = require('../src/utils/helpers');
const {
  sequelize, Role, User, Manufacturer, DroneCategory,
  Drone, FlightZone, FlightPermit, FlightLog,
  Registration, Violation, Inspection, Notification, SystemSetting,
} = require('../src/models');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Ảnh placeholder (URL Unsplash thực)
const AVATARS = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=4',
  'https://i.pravatar.cc/150?img=5',
];
const DRONE_IMGS = [
  'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400',
  'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400',
];
const EVIDENCE_IMGS = [
  'https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?w=400',
];
const ZONE_MAP = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600';

async function main() {
  await sequelize.authenticate();
  console.log('\n🌱 Bắt đầu seed toàn bộ CSDL...\n');

  // ── 1. Roles ──────────────────────────────────────────────────
  await Role.bulkCreate([
    { name: 'admin',  description: 'Quản trị viên hệ thống' },
    { name: 'police', description: 'Cảnh sát hàng không' },
    { name: 'user',   description: 'Chủ sở hữu UAV' },
  ], { ignoreDuplicates: true });
  const roles = await Role.findAll({ raw: true });
  const rm = {}; roles.forEach(r => { rm[r.name] = r.id; });
  console.log('✅ Roles');

  // ── 2. System Settings ────────────────────────────────────────
  await SystemSetting.bulkCreate([
    { key_name: 'max_drone_per_user',        key_value: '10',    description: 'Số drone tối đa/người' },
    { key_name: 'otp_expires_minutes',       key_value: '10',    description: 'Thời gian OTP (phút)' },
    { key_name: 'registration_auto_approve', key_value: 'false', description: 'Tự động duyệt hồ sơ' },
    { key_name: 'max_altitude_default',      key_value: '120',   description: 'Độ cao bay tối đa mặc định (m)' },
    { key_name: 'contact_email',             key_value: 'support@uavid.vn', description: 'Email hỗ trợ' },
  ], { ignoreDuplicates: true });
  console.log('✅ SystemSettings');

  // ── 3. Manufacturers ──────────────────────────────────────────
  await Manufacturer.bulkCreate([
    { name: 'DJI',            country: 'Trung Quốc', support_email: 'support@dji.com' },
    { name: 'Autel Robotics', country: 'Mỹ',         support_email: 'support@autelrobotics.com' },
    { name: 'Parrot',         country: 'Pháp',        support_email: 'support@parrot.com' },
    { name: 'Yuneec',         country: 'Trung Quốc', support_email: 'support@yuneec.com' },
    { name: 'Skydio',         country: 'Mỹ',         support_email: 'support@skydio.com' },
    { name: 'Viettel Aero',   country: 'Việt Nam',   support_email: 'aero@viettel.com.vn' },
  ], { ignoreDuplicates: true });
  const mfrs = await Manufacturer.findAll({ raw: true });
  const mfm = {}; mfrs.forEach(m => { mfm[m.name] = m.id; });
  console.log('✅ Manufacturers');

  // ── 4. DroneCategories ────────────────────────────────────────
  await DroneCategory.bulkCreate([
    { name: 'Nông nghiệp',         description: 'UAV phun thuốc, tưới tiêu' },
    { name: 'Quay phim / Chụp ảnh',description: 'UAV camera chuyên nghiệp' },
    { name: 'Giải trí',            description: 'UAV cá nhân, giải trí' },
    { name: 'Khảo sát địa hình',   description: 'UAV đo đạc, lập bản đồ' },
    { name: 'Quân sự',             description: 'UAV quốc phòng' },
    { name: 'Tìm kiếm cứu nạn',   description: 'UAV hỗ trợ cứu hộ' },
    { name: 'Vận chuyển hàng hóa', description: 'UAV giao nhận, logistics' },
  ], { ignoreDuplicates: true });
  const cats = await DroneCategory.findAll({ raw: true });
  const cm = {}; cats.forEach(c => { cm[c.name] = c.id; });
  console.log('✅ DroneCategories');

  // ── 5. Users ──────────────────────────────────────────────────
  const usersData = [
    { role: 'admin',  full_name: 'Quản Trị Viên',    email: 'admin@uavid.vn',   password: 'Admin@123456',  phone: '0901000001', cccd: '001001000001', address: 'Bộ GTVT, Hà Nội', avatar: AVATARS[0] },
    { role: 'police', full_name: 'Nguyễn Văn An',    email: 'police1@uavid.vn', password: 'Police@123456', phone: '0901000002', cccd: '001001000002', address: 'Cục Hàng không VN, Hà Nội', avatar: AVATARS[1] },
    { role: 'police', full_name: 'Trần Thị Bình',    email: 'police2@uavid.vn', password: 'Police@123456', phone: '0901000003', cccd: '001001000003', address: 'Sân bay TSN, TP.HCM', avatar: AVATARS[2] },
    { role: 'user',   full_name: 'Lê Văn Cường',     email: 'user1@uavid.vn',   password: 'User@123456',   phone: '0901000004', cccd: '001001000004', address: '12 Lý Tự Trọng, Q1, TP.HCM', avatar: AVATARS[3] },
    { role: 'user',   full_name: 'Phạm Thị Dung',    email: 'user2@uavid.vn',   password: 'User@123456',   phone: '0901000005', cccd: '001001000005', address: '45 Trần Phú, Ba Đình, HN', avatar: AVATARS[4] },
    { role: 'user',   full_name: 'Nguyễn Minh Đức',  email: 'user3@uavid.vn',   password: 'User@123456',   phone: '0901000006', cccd: '001001000006', address: '78 Nguyễn Huệ, Hải Châu, ĐN', avatar: AVATARS[0] },
  ];
  const userIds = {};
  for (const u of usersData) {
    const [user, created] = await User.findOrCreate({
      where: { email: u.email },
      defaults: {
        role_id: rm[u.role],
        full_name: u.full_name,
        password: await hashPassword(u.password),
        phone: u.phone,
        cccd_number: u.cccd,
        address: u.address,
        avatar_url: u.avatar,
        status: 'active',
      },
    });
    if (!created && !user.avatar_url) await user.update({ avatar_url: u.avatar });
    userIds[u.email] = user.id;
  }
  console.log('✅ Users');

  const admin   = userIds['admin@uavid.vn'];
  const police1 = userIds['police1@uavid.vn'];
  const police2 = userIds['police2@uavid.vn'];
  const user1   = userIds['user1@uavid.vn'];
  const user2   = userIds['user2@uavid.vn'];
  const user3   = userIds['user3@uavid.vn'];

  // ── 6. FlightZones ────────────────────────────────────────────
  const zones = [
    { name: 'Sân bay Nội Bài',         zone_type: 'forbidden',   description: 'Vùng cấm tuyệt đối, bán kính 8km', zone_map_url: ZONE_MAP },
    { name: 'Sân bay Tân Sơn Nhất',    zone_type: 'forbidden',   description: 'Vùng cấm tuyệt đối, bán kính 8km', zone_map_url: ZONE_MAP },
    { name: 'Sân bay Đà Nẵng',         zone_type: 'forbidden',   description: 'Vùng cấm tuyệt đối, bán kính 8km', zone_map_url: ZONE_MAP },
    { name: 'Khu Hồ Tây - Hà Nội',    zone_type: 'restricted',  description: 'Khu hạn chế, cần xin phép trước 24h', zone_map_url: ZONE_MAP },
    { name: 'Khu Ba Đình - Hà Nội',    zone_type: 'restricted',  description: 'Khu vực nhạy cảm chính trị', zone_map_url: ZONE_MAP },
    { name: 'Công viên Thống Nhất',    zone_type: 'free',        description: 'Bay tự do dưới 30m', zone_map_url: ZONE_MAP },
    { name: 'Bãi biển Mỹ Khê',        zone_type: 'free',        description: 'Khu vực bay tự do Đà Nẵng', zone_map_url: ZONE_MAP },
    { name: 'Đồng bằng Cửu Long',     zone_type: 'restricted',  description: 'Khu nông nghiệp, cần phép bay phun thuốc', zone_map_url: ZONE_MAP },
  ];
  for (const z of zones) {
    await FlightZone.findOrCreate({ where: { name: z.name }, defaults: z });
  }
  const zoneList = await FlightZone.findAll({ raw: true });
  const zm = {}; zoneList.forEach(z => { zm[z.name] = z.id; });
  console.log('✅ FlightZones');

  // ── 7. Drones ─────────────────────────────────────────────────
  const dronesData = [
    { owner: user1, mfr: 'DJI',   cat: 'Quay phim / Chụp ảnh', model: 'DJI Mini 3 Pro',       serial: 'DJI-001-2024', weight: 0.249, height: 120 },
    { owner: user1, mfr: 'DJI',   cat: 'Nông nghiệp',           model: 'DJI Agras T40',         serial: 'DJI-002-2024', weight: 24.8,  height: 50  },
    { owner: user2, mfr: 'Parrot',cat: 'Khảo sát địa hình',    model: 'Parrot ANAFI USA',      serial: 'PAR-001-2024', weight: 0.5,   height: 150 },
    { owner: user2, mfr: 'Autel Robotics', cat: 'Quay phim / Chụp ảnh', model: 'Autel EVO II Pro', serial: 'AUT-001-2024', weight: 1.19, height: 100 },
    { owner: user3, mfr: 'Skydio',cat: 'Tìm kiếm cứu nạn',    model: 'Skydio X2',             serial: 'SKY-001-2024', weight: 0.8,   height: 200 },
    { owner: user3, mfr: 'Yuneec',cat: 'Giải trí',              model: 'Yuneec Typhoon H3',     serial: 'YUN-001-2024', weight: 1.95,  height: 80  },
    { owner: user1, mfr: 'Viettel Aero', cat: 'Vận chuyển hàng hóa', model: 'Viettel VA-01', serial: 'VTT-001-2024', weight: 5.0, height: 60 },
  ];
  const droneIds = {};
  for (const d of dronesData) {
    const [drone] = await Drone.findOrCreate({
      where: { serial_number: d.serial },
      defaults: {
        owner_id: d.owner,
        manufacturer_id: mfm[d.mfr] || null,
        category_id: cm[d.cat] || null,
        model_name: d.model,
        serial_number: d.serial,
        weight: d.weight,
        max_flight_height: d.height,
        images: [DRONE_IMGS[0], DRONE_IMGS[1]],
      },
    });
    droneIds[d.serial] = drone.id;
  }
  console.log('✅ Drones');

  const d1 = droneIds['DJI-001-2024'];
  const d2 = droneIds['DJI-002-2024'];
  const d3 = droneIds['PAR-001-2024'];
  const d4 = droneIds['AUT-001-2024'];
  const d5 = droneIds['SKY-001-2024'];

  // ── 8. Registrations (với QR thật) ───────────────────────────
  const regsData = [
    { drone_id: d1, status: 'approved',  serial: 'DJI-001-2024' },
    { drone_id: d2, status: 'approved',  serial: 'DJI-002-2024' },
    { drone_id: d3, status: 'pending',   serial: 'PAR-001-2024' },
    { drone_id: d4, status: 'rejected',  serial: 'AUT-001-2024', admin_note: 'Thiếu giấy phép nhập khẩu' },
    { drone_id: d5, status: 'approved',  serial: 'SKY-001-2024' },
  ];
  const regIds = {};
  for (const reg of regsData) {
    const exists = await Registration.findOne({ where: { drone_id: reg.drone_id } });
    if (exists) { regIds[reg.serial] = exists.id; continue; }
    let code = null, qr = null, issue = null;
    if (reg.status === 'approved') {
      code = `UAV-${uuidv4().split('-')[0].toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      qr = await QRCode.toDataURL(JSON.stringify({ code, drone_id: reg.drone_id, issued: new Date().toISOString() }), { width: 300 });
      issue = new Date();
    }
    const r = await Registration.create({
      drone_id: reg.drone_id,
      status: reg.status,
      identification_code: code,
      qr_code_url: qr,
      issue_date: issue,
      admin_note: reg.admin_note || null,
      documents: ['https://images.unsplash.com/photo-1568667256549-094345857637?w=400'],
    });
    regIds[reg.serial] = r.id;
  }
  console.log('✅ Registrations');

  // ── 9. FlightPermits ──────────────────────────────────────────
  const now = new Date();
  const fut = (h) => new Date(now.getTime() + h * 3600000);
  const past = (h) => new Date(now.getTime() - h * 3600000);
  const permitsData = [
    { drone_id: d1, user_id: user1, zone: 'Công viên Thống Nhất', start: fut(24), end: fut(26), purpose: 'Quay phim sự kiện', status: 'approved' },
    { drone_id: d1, user_id: user1, zone: 'Bãi biển Mỹ Khê',     start: fut(48), end: fut(50), purpose: 'Chụp ảnh du lịch',  status: 'pending'  },
    { drone_id: d2, user_id: user1, zone: 'Đồng bằng Cửu Long',  start: fut(10), end: fut(12), purpose: 'Phun thuốc nông nghiệp', status: 'approved' },
    { drone_id: d3, user_id: user2, zone: 'Khu Hồ Tây - Hà Nội', start: fut(72), end: fut(74), purpose: 'Khảo sát địa hình', status: 'rejected'  },
    { drone_id: d5, user_id: user3, zone: 'Đồng bằng Cửu Long',  start: fut(5),  end: fut(7),  purpose: 'Tìm kiếm cứu nạn', status: 'approved' },
  ];
  const permitIds = [];
  for (const p of permitsData) {
    const zid = zm[p.zone];
    if (!zid) continue;
    const exists = await Registration.findOne({ where: { drone_id: p.drone_id, status: 'approved' } });
    const [permit] = await FlightPermit.findOrCreate({
      where: { drone_id: p.drone_id, start_time: p.start },
      defaults: { drone_id: p.drone_id, user_id: p.user_id, zone_id: zid, start_time: p.start, end_time: p.end, purpose: p.purpose, status: p.status },
    });
    permitIds.push(permit.id);
  }
  console.log('✅ FlightPermits');

  // ── 10. FlightLogs ────────────────────────────────────────────
  const logsData = [
    { drone_id: d1, start: past(50), end: past(48), alt: 80,  dist: 2.5 },
    { drone_id: d1, start: past(100),end: past(98), alt: 60,  dist: 1.8 },
    { drone_id: d2, start: past(24), end: past(22), alt: 30,  dist: 5.2 },
    { drone_id: d3, start: past(72), end: past(70), alt: 120, dist: 8.1 },
    { drone_id: d5, start: past(10), end: past(9),  alt: 150, dist: 3.0 },
  ];
  for (const l of logsData) {
    const exists = await FlightLog.findOne({ where: { drone_id: l.drone_id, start_time: l.start } });
    if (!exists) {
      await FlightLog.create({ drone_id: l.drone_id, start_time: l.start, end_time: l.end, max_altitude: l.alt, distance: l.dist });
    }
  }
  console.log('✅ FlightLogs');

  // ── 11. Violations ────────────────────────────────────────────
  const violationsData = [
    { drone_id: d3, user_id: user2, type: 'Bay vào vùng cấm',       desc: 'Phát hiện bay vào vùng cấm sân bay Nội Bài', fine: 15000000, status: 'unpaid',  date: past(240) },
    { drone_id: d4, user_id: user2, type: 'Bay đêm không có phép',  desc: 'Bay lúc 22h không xin phép', fine: 5000000,  status: 'paid',   date: past(480) },
    { drone_id: d1, user_id: user1, type: 'Vượt độ cao quy định',   desc: 'Bay vượt 150m trong khu dân cư', fine: 3000000,  status: 'unpaid', date: past(48)  },
  ];
  for (const v of violationsData) {
    const exists = await Violation.findOne({ where: { drone_id: v.drone_id, violation_type: v.type } });
    if (!exists) {
      await Violation.create({
        drone_id: v.drone_id, user_id: v.user_id,
        violation_type: v.type, description: v.desc,
        fine_amount: v.fine, status: v.status,
        date_recorded: v.date,
        evidence_images: [EVIDENCE_IMGS[0]],
      });
    }
  }
  console.log('✅ Violations');

  // ── 12. Inspections ───────────────────────────────────────────
  const today = new Date().toLocaleDateString('sv-SE');
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('sv-SE');
  const inspData = [
    { drone_id: d1, inspector: police1, date: yesterday, result: 'pass', notes: 'Máy bay đạt tiêu chuẩn, đầy đủ giấy tờ' },
    { drone_id: d3, inspector: police2, date: yesterday, result: 'fail', notes: 'Camera chưa đăng ký, thiếu đèn hiệu' },
    { drone_id: d5, inspector: police1, date: today,     result: 'pass', notes: 'Đạt, trang bị đầy đủ thiết bị cứu nạn' },
  ];
  for (const i of inspData) {
    const exists = await Inspection.findOne({ where: { drone_id: i.drone_id, inspection_date: i.date } });
    if (!exists) {
      await Inspection.create({
        drone_id: i.drone_id, inspector_id: i.inspector,
        inspection_date: i.date, result: i.result, notes: i.notes,
        inspection_images: [DRONE_IMGS[2]],
      });
    }
  }
  console.log('✅ Inspections');

  // ── 13. Notifications ─────────────────────────────────────────
  const notifsData = [
    { user_id: user1, title: '✅ Hồ sơ DJI Mini 3 Pro được phê duyệt', content: 'Máy bay của bạn đã được cấp mã định danh UAV', type: 'registration', is_read: false },
    { user_id: user1, title: '⚠️ Cảnh báo vi phạm', content: 'Máy bay DJI Mini 3 Pro bị ghi nhận vượt độ cao quy định', type: 'system', is_read: false },
    { user_id: user2, title: '❌ Hồ sơ bị từ chối', content: 'Autel EVO II Pro: thiếu giấy phép nhập khẩu', type: 'registration', is_read: true },
    { user_id: user2, title: '✅ Đã nộp phạt thành công', content: 'Vi phạm bay đêm không phép đã được xác nhận hoàn thành', type: 'system', is_read: true },
    { user_id: user3, title: '✅ Giấy phép bay được cấp', content: 'Giấy phép bay tại Đồng bằng Cửu Long đã được phê duyệt', type: 'permit', is_read: false },
  ];
  for (const n of notifsData) {
    const exists = await Notification.findOne({ where: { user_id: n.user_id, title: n.title } });
    if (!exists) await Notification.create(n);
  }
  console.log('✅ Notifications');

  // ── Tổng kết ──────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(55));
  console.log('  ✅ SEED HOÀN TẤT - THỐNG KÊ');
  console.log('═'.repeat(55));
  const counts = await Promise.all([
    User.count(), Drone.count(), Registration.count(),
    FlightZone.count(), FlightPermit.count(), FlightLog.count(),
    Violation.count(), Inspection.count(), Notification.count(),
  ]);
  const labels = ['Users','Drones','Registrations','FlightZones','FlightPermits','FlightLogs','Violations','Inspections','Notifications'];
  labels.forEach((l, i) => console.log(`  ${l.padEnd(18)}: ${counts[i]}`));

  console.log('\n  👑 ADMIN    : admin@uavid.vn   / Admin@123456');
  console.log('  🚔 POLICE 1 : police1@uavid.vn / Police@123456');
  console.log('  🚔 POLICE 2 : police2@uavid.vn / Police@123456');
  console.log('  👤 USER 1   : user1@uavid.vn   / User@123456');
  console.log('  👤 USER 2   : user2@uavid.vn   / User@123456');
  console.log('  👤 USER 3   : user3@uavid.vn   / User@123456');
  console.log('═'.repeat(55) + '\n');
  process.exit(0);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
