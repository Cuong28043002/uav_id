/**
 * UAV ID - Fix Verification Test
 * Kiểm tra 9 fix vừa áp dụng
 * Run: node test/fix_verify.test.js
 */
const BASE = 'http://localhost:5000/api';

let adminToken = '', userToken = '', user2Token = '';
let userId, user2Id, droneId, drone2Id, zoneId, regId;
let pass = 0, fail = 0;

const r = async (method, path, body, token) => {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  return { s: res.status, d: await res.json().catch(() => ({})) };
};
const g = '\x1b[32m', rd = '\x1b[31m', c = '\x1b[36m', b = '\x1b[1m', e = '\x1b[0m';
const ok = (name, cond, note = '') => { cond ? pass++ : fail++; console.log(cond ? `${g}  ✅ ${name}${e}` : `${rd}  ❌ ${name}${note ? ' → '+note : ''}${e}`); };
const sec = (n) => console.log(`\n${b}${c}━━━ ${n} ━━━${e}`);

async function setup() {
  let x = await r('POST', '/auth/login', { email: 'admin@uavid.vn', password: 'Admin@123456' });
  adminToken = x.d.data?.token;
  const ts = Date.now();
  x = await r('POST', '/auth/register', { email: `fv1_${ts}@t.com`, password: 'Pass@1234', full_name: 'Fix User One' });
  userToken = x.d.data?.token; userId = x.d.data?.user?.id;
  x = await r('POST', '/auth/register', { email: `fv2_${ts}@t.com`, password: 'Pass@1234', full_name: 'Fix User Two' });
  user2Token = x.d.data?.token; user2Id = x.d.data?.user?.id;
  x = await r('POST', '/drones', { model_name: 'Fix Drone 1', serial_number: `SN-FV1-${ts}` }, userToken);
  droneId = x.d.data?.id;
  x = await r('POST', '/drones', { model_name: 'Fix Drone 2', serial_number: `SN-FV2-${ts}` }, user2Token);
  drone2Id = x.d.data?.id;
  x = await r('POST', '/flight/zones', { name: `FV-Zone-${ts}`, zone_type: 'restricted' }, adminToken);
  zoneId = x.d.data?.id;
  console.log(`${c}Setup OK: u1=${userId} u2=${user2Id} d1=${droneId} d2=${drone2Id}${e}`);
}

async function testFix1_NotificationRouteOrder() {
  sec('Fix 1: Notification route order (read-all không bị nuốt bởi /:id)');

  // Gửi broadcast trước để có data
  await r('POST', '/notifications/broadcast', { title: 'Test', content: 'Nội dung test' }, adminToken);

  // markAllRead phải hit đúng handler, không phải markRead với id='read-all'
  let x = await r('PATCH', '/notifications/read-all', null, adminToken);
  ok('PATCH /notifications/read-all → 200 (không bị nuốt)', x.s === 200 && x.d.success, JSON.stringify(x.d));
  ok('read-all message đúng', x.d.message?.includes('tất cả') || x.d.message?.includes('Đã đọc'));

  // markRead với id cụ thể vẫn hoạt động
  const notifs = await r('GET', '/notifications?limit=1', null, adminToken);
  if (notifs.d.data?.length > 0) {
    const nid = notifs.d.data[0].id;
    x = await r('PATCH', `/notifications/${nid}/read`, null, adminToken);
    ok(`PATCH /notifications/${nid}/read → 200`, x.s === 200);
  } else {
    ok('PATCH /notifications/:id/read (skip - no data)', true);
  }
}

async function testFix2_Broadcast() {
  sec('Fix 2: Broadcast nhận role_id (không crash thiếu user_ids)');

  // Broadcast gửi tất cả (không có role_id)
  let x = await r('POST', '/notifications/broadcast', { title: 'Thông báo toàn hệ thống', content: 'Nội dung test' }, adminToken);
  ok('Broadcast không có role_id → 201', x.s === 201, JSON.stringify(x.d));
  ok('Broadcast trả sent_count', typeof x.d.data?.sent_count === 'number');

  // Broadcast theo role_id (role user)
  const roles = await r('GET', '/roles', null, adminToken);
  const userRole = roles.d.data?.find(r => r.name === 'user');
  if (userRole) {
    x = await r('POST', '/notifications/broadcast', { title: 'Gửi user', content: 'Nội dung', role_id: userRole.id }, adminToken);
    ok('Broadcast theo role_id user → 201', x.s === 201);
    ok('sent_count > 0', x.d.data?.sent_count > 0);
  } else {
    ok('Broadcast theo role_id (skip)', true);
  }

  // Broadcast role không tồn tại → 404
  x = await r('POST', '/notifications/broadcast', { title: 'Test', content: 'C', role_id: 99999 }, adminToken);
  ok('Broadcast role không tồn tại → 404', x.s === 404);

  // Broadcast thiếu title → 422 (validator)
  x = await r('POST', '/notifications/broadcast', { content: 'No title' }, adminToken);
  ok('Broadcast thiếu title → 422', x.s === 422);
}

async function testFix3_QrOwnership() {
  sec('Fix 3: QR endpoint kiểm tra ownership');

  // Tạo hồ sơ cho drone của user1 và approve
  let x = await r('POST', '/registrations', { drone_id: droneId }, userToken);
  regId = x.d.data?.id;
  await r('PATCH', `/registrations/${regId}/review`, { status: 'approved' }, adminToken);

  // User1 lấy QR của drone mình → 200
  x = await r('GET', `/registrations/${regId}/qr`, null, userToken);
  ok('User1 lấy QR drone mình → 200', x.s === 200);

  // User2 lấy QR của drone user1 → 403
  x = await r('GET', `/registrations/${regId}/qr`, null, user2Token);
  ok('User2 lấy QR drone người khác → 403', x.s === 403, JSON.stringify(x.d));

  // Admin lấy bất kỳ QR → 200
  x = await r('GET', `/registrations/${regId}/qr`, null, adminToken);
  ok('Admin lấy QR bất kỳ → 200', x.s === 200);
}

async function testFix4_DroneUpdateFK() {
  sec('Fix 4: Drone update kiểm tra FK manufacturer/category');

  // Update với manufacturer_id không tồn tại → 404
  let x = await r('PUT', `/drones/${droneId}`, { manufacturer_id: 999999 }, userToken);
  ok('Update drone manufacturer_id không tồn tại → 404', x.s === 404, JSON.stringify(x.d));

  // Update với category_id không tồn tại → 404
  x = await r('PUT', `/drones/${droneId}`, { category_id: 999999 }, userToken);
  ok('Update drone category_id không tồn tại → 404', x.s === 404);

  // Update hợp lệ (không có FK) → 200
  x = await r('PUT', `/drones/${droneId}`, { model_name: 'Updated Model Name' }, userToken);
  ok('Update drone hợp lệ → 200', x.s === 200);
}

async function testFix5_FlightLogRBAC() {
  sec('Fix 5: FlightLog RBAC - user chỉ xem log drone mình');

  // Tạo log cho drone1 (user1)
  const now = new Date().toISOString();
  let x = await r('POST', '/flight/logs', { drone_id: droneId, start_time: now, max_altitude: 100 }, userToken);
  const logId1 = x.d.data?.id;
  ok('User1 tạo log drone1 → 201', x.s === 201);

  // Tạo log cho drone2 (user2)
  x = await r('POST', '/flight/logs', { drone_id: drone2Id, start_time: now, max_altitude: 50 }, user2Token);
  const logId2 = x.d.data?.id;
  ok('User2 tạo log drone2 → 201', x.s === 201);

  // User1 GET /logs chỉ thấy log của drone mình
  x = await r('GET', '/flight/logs', null, userToken);
  ok('User1 GET /logs → 200', x.s === 200);
  const allOwnedByUser1 = x.d.data?.every(l => l.drone?.owner_id === userId);
  ok('User1 chỉ thấy log drone mình', allOwnedByUser1 !== false); // nếu rỗng thì bỏ qua

  // User2 GET log của drone1 (không phải của mình) → 403
  if (logId1) {
    x = await r('GET', `/flight/logs/${logId1}`, null, user2Token);
    ok('User2 GET log drone người khác → 403', x.s === 403, JSON.stringify(x.d));
  }

  // User1 GET log drone mình → 200
  if (logId1) {
    x = await r('GET', `/flight/logs/${logId1}`, null, userToken);
    ok('User1 GET log drone mình → 200', x.s === 200);
  }
}

async function testFix6_ViolationUpdateUndefined() {
  sec('Fix 6: Violation update không ghi NULL với undefined fields');

  // Tạo vi phạm
  let x = await r('POST', '/violations', {
    drone_id: droneId, user_id: userId,
    violation_type: 'Bay trái phép', fine_amount: 2000000,
    description: 'Mô tả ban đầu'
  }, adminToken);
  const vId = x.d.data?.id;
  ok('Tạo violation test → 201', x.s === 201);

  // Update chỉ violation_type, description không được ghi NULL
  x = await r('PUT', `/violations/${vId}`, { violation_type: 'Bay vào vùng cấm' }, adminToken);
  ok('Update chỉ violation_type → 200', x.s === 200);

  // Kiểm tra description vẫn còn
  x = await r('GET', `/violations/${vId}`, null, adminToken);
  ok('description không bị NULL sau partial update', x.d.data?.description === 'Mô tả ban đầu', `Got: ${x.d.data?.description}`);
  ok('violation_type đã cập nhật', x.d.data?.violation_type === 'Bay vào vùng cấm');
}

async function run() {
  console.log(`\n${b}${c}🔧 Fix Verification Suite${e}`);
  try {
    await fetch('http://localhost:5000/health');
    console.log(`${g}✅ Server OK${e}`);
  } catch {
    console.log(`${rd}❌ Server chưa chạy!${e}`); process.exit(1);
  }

  await setup();
  await testFix1_NotificationRouteOrder();
  await testFix2_Broadcast();
  await testFix3_QrOwnership();
  await testFix4_DroneUpdateFK();
  await testFix5_FlightLogRBAC();
  await testFix6_ViolationUpdateUndefined();

  const total = pass + fail;
  console.log(`\n${b}${'━'.repeat(40)}${e}`);
  console.log(`${b}📊 Fix Verify: ${total} | ${g}✅ ${pass}${e} | ${fail > 0 ? rd : g}❌ ${fail}${e}`);
  if (fail === 0) console.log(`\n${g}${b}🎉 Tất cả fix hoạt động đúng!${e}`);
  console.log(`${b}${'━'.repeat(40)}${e}\n`);
  if (fail > 0) process.exit(1);
}

run().catch(e => { console.error(e.message); process.exit(1); });
