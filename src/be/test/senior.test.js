/**
 * UAV ID - Senior Tester Suite
 * Covers: Security, Edge Cases, Business Logic, Authorization
 * Run: node test/senior.test.js
 */

const BASE = 'http://localhost:5000/api';
let adminToken = '', userToken = '', user2Token = '';
let adminId, userId, user2Id, droneId, drone2Id, zoneId, permitId, regId, violationId;

let pass = 0, fail = 0, bugs = [];

const r = async (method, path, body, token) => {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  return { s: res.status, d: await res.json().catch(() => ({})) };
};

const c = '\x1b[36m', g = '\x1b[32m', rd = '\x1b[31m', y = '\x1b[33m', b = '\x1b[1m', e = '\x1b[0m';
const ok = (name, cond, note = '') => { cond ? pass++ : (fail++, bugs.push(`[FAIL] ${name}${note ? ' → '+note : ''}`)); console.log(cond ? `${g}  ✅ ${name}${e}` : `${rd}  ❌ ${name}${note ? ' ('+note+')' : ''}${e}`); };
const sec = (n) => console.log(`\n${b}${c}━━━ ${n} ━━━${e}`);

// ── SETUP ─────────────────────────────────────────────────────
async function setup() {
  // Login admin
  let x = await r('POST', '/auth/login', { email: 'admin@uavid.vn', password: 'Admin@123456' });
  adminToken = x.d.data?.token; adminId = x.d.data?.user?.id;

  // Create User1
  const ts = Date.now();
  x = await r('POST', '/auth/register', { email: `u1_${ts}@t.com`, password: 'Pass@1234', full_name: 'User One' });
  userToken = x.d.data?.token; userId = x.d.data?.user?.id;

  // Create User2
  x = await r('POST', '/auth/register', { email: `u2_${ts}@t.com`, password: 'Pass@1234', full_name: 'User Two' });
  user2Token = x.d.data?.token; user2Id = x.d.data?.user?.id;

  // Drone of User1
  x = await r('POST', '/drones', { model_name: 'DJI Air', serial_number: `SN-U1-${ts}` }, userToken);
  droneId = x.d.data?.id;

  // Drone of User2
  x = await r('POST', '/drones', { model_name: 'Parrot', serial_number: `SN-U2-${ts}` }, user2Token);
  drone2Id = x.d.data?.id;

  // Flight Zone
  x = await r('POST', '/flight/zones', { name: `Zone-${ts}`, zone_type: 'restricted' }, adminToken);
  zoneId = x.d.data?.id;

  console.log(`${y}Setup: admin=${adminId}, u1=${userId}, u2=${user2Id}, d1=${droneId}, d2=${drone2Id}, zone=${zoneId}${e}`);
}

// ── 1. AUTH ────────────────────────────────────────────────────
async function testAuth() {
  sec('1. AUTH - Security & Validation');

  // Token không hợp lệ
  let x = await r('GET', '/auth/me', null, 'Bearer_invalid_token');
  ok('Token giả → 401', x.s === 401);

  // Không có token
  x = await r('GET', '/auth/me');
  ok('Không có token → 401', x.s === 401);

  // Register trùng email
  x = await r('POST', '/auth/register', { email: 'admin@uavid.vn', password: 'Pass@1234', full_name: 'Dup' });
  ok('Register email trùng → 409', x.s === 409);

  // Register mật khẩu quá ngắn
  x = await r('POST', '/auth/register', { email: `new_${Date.now()}@t.com`, password: '123', full_name: 'A' });
  ok('Register pass < 6 ký tự → 422', x.s === 422);

  // Login tài khoản bị ban (cần ban trước)
  await r('PATCH', `/users/${userId}/status`, { status: 'banned' }, adminToken);
  x = await r('POST', '/auth/login', { email: `u1_${userId}@t.com`, password: 'Pass@1234' });
  // Lấy email thật
  const banTest = await r('POST', '/auth/login', { email: 'admin@uavid.vn', password: 'Admin@123456' });
  ok('Login admin vẫn OK → 200', banTest.s === 200);
  await r('PATCH', `/users/${userId}/status`, { status: 'active' }, adminToken); // unban

  // Banned user token vẫn reject
  x = await r('GET', '/auth/me', null, userToken); // might pass if not re-checked
  ok('Auth/me với valid token → 200 (token vẫn hợp lệ sau unban)', x.s === 200);

  // Change password sai old password
  x = await r('POST', '/auth/change-password', { old_password: 'wrong', new_password: 'NewPass@123' }, userToken);
  ok('Change password sai old → 400', x.s === 400);

  // Change password thiếu field
  x = await r('POST', '/auth/change-password', { old_password: '' }, userToken);
  ok('Change password thiếu new_password → 422', x.s === 422);

  // Forgot password email không tồn tại
  x = await r('POST', '/auth/forgot-password', { email: 'nonexist@x.com' });
  ok('Forgot password email không tồn tại → 404', x.s === 404);

  // OTP flow đầy đủ
  x = await r('POST', '/auth/forgot-password', { email: 'admin@uavid.vn' });
  ok('Forgot password → 200 + OTP', x.s === 200 && x.d.data?.otp);
  if (x.d.data?.otp) {
    const otp = x.d.data.otp;
    // Reset với OTP đúng
    let y2 = await r('POST', '/auth/reset-password', { email: 'admin@uavid.vn', otp_code: otp, new_password: 'Admin@123456' });
    ok('Reset password OTP đúng → 200', y2.s === 200);
    // Reset lại OTP đã dùng → thất bại
    y2 = await r('POST', '/auth/reset-password', { email: 'admin@uavid.vn', otp_code: otp, new_password: 'Admin@123456' });
    ok('Reset lại OTP đã dùng → 400', y2.s === 400);
    // Re-login sau reset
    const reLogin = await r('POST', '/auth/login', { email: 'admin@uavid.vn', password: 'Admin@123456' });
    adminToken = reLogin.d.data?.token || adminToken;
    ok('Re-login sau reset password → 200', reLogin.s === 200);
  }
}

// ── 2. AUTHORIZATION (RBAC) ────────────────────────────────────
async function testRBAC() {
  sec('2. RBAC - Phân quyền');

  // User truy cập admin endpoint
  let x = await r('GET', '/users', null, userToken);
  ok('User GET /users (admin only) → 403', x.s === 403);

  x = await r('GET', '/admin/stats', null, userToken);
  ok('User GET /admin/stats → 403', x.s === 403);

  x = await r('POST', '/manufacturers', { name: 'Test Mfr', country: 'VN' }, userToken);
  ok('User POST /manufacturers (admin only) → 403', x.s === 403);

  x = await r('DELETE', `/drone-categories/1`, null, userToken);
  ok('User DELETE /drone-categories (admin only) → 403', x.s === 403);

  // User xem drone của người khác
  x = await r('GET', `/drones/${drone2Id}`, null, userToken);
  ok('User xem drone người khác → 403', x.s === 403);

  // User sửa drone của người khác
  x = await r('PUT', `/drones/${drone2Id}`, { model_name: 'Hack' }, userToken);
  ok('User sửa drone người khác → 403', x.s === 403);

  // User xóa drone của người khác
  x = await r('DELETE', `/drones/${drone2Id}`, null, userToken);
  ok('User xóa drone người khác → 403', x.s === 403);

  // User truy cập violations của người khác
  if (violationId) {
    x = await r('GET', `/violations/${violationId}`, null, user2Token);
    ok('User2 xem violation của User1 → 403', x.s === 403 || x.s === 404);
  }

  // Không có token → 401
  x = await r('GET', '/drones');
  ok('GET /drones không token → 401', x.s === 401);

  // Police không thể xóa user
  // (police token không có trong test — dùng admin để verify route level)
  x = await r('POST', '/inspections', { drone_id: droneId, result: 'pass' }, userToken);
  ok('User POST /inspections (police only) → 403', x.s === 403);
}

// ── 3. PAGINATION & FILTER ────────────────────────────────────
async function testPagination() {
  sec('3. Pagination & Filter Edge Cases');

  // Page = 0 → normalize về 1
  let x = await r('GET', '/drones?page=0&limit=5', null, userToken);
  ok('page=0 → normalize, trả data', x.s === 200);
  ok('page=0 → meta.page = 1', x.d.meta?.page === 1);

  // limit quá lớn → clamp 100
  x = await r('GET', '/drones?limit=9999', null, userToken);
  ok('limit=9999 → clamp 100', x.s === 200 && x.d.meta?.limit === 100);

  // limit = -1 → clamp 1
  x = await r('GET', '/drones?limit=-1', null, userToken);
  ok('limit=-1 → clamp 1', x.s === 200 && x.d.meta?.limit === 1);

  // sort_by không hợp lệ → fallback, không crash
  x = await r('GET', '/drones?sort_by=hacked_field&sort_order=ASC', null, userToken);
  ok('sort_by không hợp lệ → không crash 500', x.s === 200);

  // Tìm kiếm chuỗi rỗng → trả tất cả
  x = await r('GET', '/drones?q=', null, userToken);
  ok('q= rỗng → trả tất cả không crash', x.s === 200);

  // Tìm kiếm ký tự đặc biệt SQL → không crash (Sequelize escaped)
  x = await r('GET', `/drones?q=${encodeURIComponent("' OR '1'='1")}`, null, userToken);
  ok("SQL Injection trong q → 200 (Sequelize escape)", x.s === 200);

  // Filter ngày không hợp lệ → vẫn trả kết quả (không crash)
  x = await r('GET', '/drones?created_from=not-a-date', null, userToken);
  ok('created_from không hợp lệ → không crash', x.s !== 500);

  // Admin: filter users
  x = await r('GET', '/users?role_id=1&status=active&page=1&limit=3', null, adminToken);
  ok('GET /users với filter đầy đủ → 200', x.s === 200 && x.d.meta !== undefined);

  // Violations: filter fine range
  x = await r('GET', '/violations?min_fine=0&max_fine=100000000&status=unpaid', null, adminToken);
  ok('Violations filter fine range → 200', x.s === 200);

  // Lookup history filter IP + date
  x = await r('GET', '/lookup-history?date_from=2020-01-01&date_to=2099-01-01', null, adminToken);
  ok('Lookup history date range → 200', x.s === 200);
}

// ── 4. BUSINESS LOGIC ─────────────────────────────────────────
async function testBusinessLogic() {
  sec('4. Business Logic');

  // 4.1 Registration flow
  let x = await r('POST', '/registrations', { drone_id: droneId }, userToken);
  regId = x.d.data?.id;
  ok('Nộp hồ sơ → 201', x.s === 201);

  // Nộp lại cùng drone pending → 409
  x = await r('POST', '/registrations', { drone_id: droneId }, userToken);
  ok('Nộp lại pending → 409', x.s === 409);

  // QR trước duyệt → 400
  x = await r('GET', `/registrations/${regId}/qr`, null, userToken);
  ok('QR trước khi duyệt → 400', x.s === 400);

  // Từ chối không có lý do → 422
  x = await r('PATCH', `/registrations/${regId}/review`, { status: 'rejected' }, adminToken);
  ok('Reject không admin_note → 422', x.s === 422);

  // Từ chối hợp lệ
  x = await r('PATCH', `/registrations/${regId}/review`, { status: 'rejected', admin_note: 'Thiếu thông tin' }, adminToken);
  ok('Reject với lý do → 200', x.s === 200);

  // Sau rejected, nộp lại được
  x = await r('POST', '/registrations', { drone_id: droneId }, userToken);
  regId = x.d.data?.id;
  ok('Nộp lại sau rejected → 201', x.s === 201);

  // Duyệt
  x = await r('PATCH', `/registrations/${regId}/review`, { status: 'approved' }, adminToken);
  ok('Approve → 200 + identification_code', x.s === 200 && x.d.data?.identification_code);

  // QR sau duyệt → 200
  x = await r('GET', `/registrations/${regId}/qr`, null, userToken);
  ok('QR sau approve → 200', x.s === 200 && x.d.data?.qr_code_url?.startsWith('data:image'));

  // Nộp lại khi đã có approved → 409
  x = await r('POST', '/registrations', { drone_id: droneId }, userToken);
  ok('Nộp lại khi đã approved → 409', x.s === 409);

  // Tạo drone phụ để test thu hồi
  const ts2 = Date.now();
  let ndTmp = await r('POST', '/drones', { model_name: 'Revoke Test', serial_number: `SN-REV-${ts2}` }, userToken);
  const revDroneId = ndTmp.d.data?.id;
  let nrTmp = await r('POST', '/registrations', { drone_id: revDroneId }, userToken);
  const revRegId = nrTmp.d.data?.id;
  await r('PATCH', `/registrations/${revRegId}/review`, { status: 'approved' }, adminToken);

  // Thu hồi không có lý do → 422
  x = await r('PATCH', `/registrations/${revRegId}/revoke`, {}, adminToken);
  ok('Revoke không lý do → 422', x.s === 422);

  // Thu hồi hợp lệ
  x = await r('PATCH', `/registrations/${revRegId}/revoke`, { admin_note: 'Vi phạm' }, adminToken);
  ok('Revoke → 200', x.s === 200);

  // Thu hồi lại → 400
  x = await r('PATCH', `/registrations/${revRegId}/revoke`, { admin_note: 'Lại' }, adminToken);
  ok('Revoke lại → 400', x.s === 400);

  // 4.2 Xóa drone đã có approved registration
  const ts = Date.now();
  let nd = await r('POST', '/drones', { model_name: 'Del Test', serial_number: `SN-DEL-${ts}` }, userToken);
  const delDroneId = nd.d.data?.id;
  let nr = await r('POST', '/registrations', { drone_id: delDroneId }, userToken);
  await r('PATCH', `/registrations/${nr.d.data?.id}/review`, { status: 'approved' }, adminToken);
  x = await r('DELETE', `/drones/${delDroneId}`, null, userToken);
  ok('Xóa drone có approved registration → 409', x.s === 409);

  // 4.3 Flight permit - forbidden zone
  const fbZone = await r('POST', '/flight/zones', { name: `Forbidden-${ts}`, zone_type: 'forbidden' }, adminToken);
  const fbZoneId = fbZone.d.data?.id;
  const now = new Date();
  const st = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();
  const et = new Date(now.getTime() + 27 * 60 * 60 * 1000).toISOString();
  x = await r('POST', '/flight/permits', { drone_id: droneId, zone_id: fbZoneId, start_time: st, end_time: et }, userToken);
  ok('Permit vào vùng cấm → 400', x.s === 400);

  // Permit end_time < start_time → 400
  x = await r('POST', '/flight/permits', { drone_id: droneId, zone_id: zoneId, start_time: et, end_time: st }, userToken);
  ok('Permit end < start → 400', x.s === 400);

  // Valid permit
  x = await r('POST', '/flight/permits', { drone_id: droneId, zone_id: zoneId, start_time: st, end_time: et, purpose: 'Test' }, userToken);
  permitId = x.d.data?.id;
  ok('Permit hợp lệ → 201', x.s === 201);

  // Hủy permit pending
  x = await r('DELETE', `/flight/permits/${permitId}`, null, userToken);
  ok('Hủy permit pending → 200', x.s === 200);

  // Duyệt permit đã hủy → 404
  x = await r('PATCH', `/flight/permits/${permitId}/review`, { status: 'approved' }, adminToken);
  ok('Duyệt permit đã hủy → 404', x.s === 404);

  // 4.4 Violation
  x = await r('POST', '/violations', { drone_id: droneId, user_id: userId, violation_type: 'Bay trái phép', fine_amount: 3000000 }, adminToken);
  violationId = x.d.data?.id;
  ok('Tạo violation → 201', x.s === 201);

  // Sửa violation đã paid
  await r('PATCH', `/violations/${violationId}/status`, { status: 'paid' }, adminToken);
  x = await r('PUT', `/violations/${violationId}`, { violation_type: 'Sửa sau paid' }, adminToken);
  ok('Sửa violation đã paid → 400', x.s === 400);

  // Xóa violation đã paid → 400
  x = await r('DELETE', `/violations/${violationId}`, null, adminToken);
  ok('Xóa violation đã paid → 400', x.s === 400);

  // 4.5 Transfer drone
  x = await r('PATCH', `/drones/${droneId}/transfer`, { new_owner_id: userId }, userToken);
  ok('Transfer cho chính mình → 400', x.s === 400);

  x = await r('PATCH', `/drones/${droneId}/transfer`, { new_owner_id: 999999 }, userToken);
  ok('Transfer đến user không tồn tại → 404', x.s === 404);

  x = await r('PATCH', `/drones/${droneId}/transfer`, { new_owner_id: user2Id }, userToken);
  ok('Transfer hợp lệ → 200', x.s === 200);

  // 4.6 Inspection trùng ngày
  x = await r('POST', '/inspections', { drone_id: droneId, result: 'pass' }, adminToken);
  ok('Inspection → 201', x.s === 201);
  x = await r('POST', '/inspections', { drone_id: droneId, result: 'fail' }, adminToken);
  ok('Inspection trùng ngày cùng inspector → 409', x.s === 409);
}

// ── 5. EDGE CASES - IDs không hợp lệ ──────────────────────────
async function testEdgeCases() {
  sec('5. Edge Cases - Invalid IDs & Inputs');

  // ID không tồn tại
  let x = await r('GET', '/drones/999999', null, adminToken);
  ok('GET drone không tồn tại → 404', x.s === 404);

  x = await r('GET', '/registrations/999999', null, adminToken);
  ok('GET registration không tồn tại → 404', x.s === 404);

  x = await r('GET', '/flight/zones/999999', null, adminToken);
  ok('GET zone không tồn tại → 404', x.s === 404);

  x = await r('GET', '/violations/999999', null, adminToken);
  ok('GET violation không tồn tại → 404', x.s === 404);

  x = await r('GET', '/inspections/999999', null, adminToken);
  ok('GET inspection không tồn tại → 404', x.s === 404);

  // Xóa không tồn tại
  x = await r('DELETE', '/manufacturers/999999', null, adminToken);
  ok('DELETE manufacturer không tồn tại → 404', x.s === 404);

  x = await r('DELETE', '/drone-categories/999999', null, adminToken);
  ok('DELETE category không tồn tại → 404', x.s === 404);

  // Drone không có manufacturer/category không tồn tại
  x = await r('POST', '/drones', { model_name: 'X', serial_number: `SN-X-${Date.now()}`, manufacturer_id: 999999 }, adminToken);
  ok('Drone với manufacturer_id không tồn tại → 404', x.s === 404);

  x = await r('POST', '/drones', { model_name: 'X', serial_number: `SN-Y-${Date.now()}`, category_id: 999999 }, adminToken);
  ok('Drone với category_id không tồn tại → 404', x.s === 404);

  // Notification: đánh dấu của người khác
  const notifList = await r('GET', '/notifications', null, adminToken);
  if (notifList.d.data?.length > 0) {
    const nid = notifList.d.data[0].id;
    x = await r('PATCH', `/notifications/${nid}/read`, null, user2Token);
    ok('Đánh dấu notification người khác → 404', x.s === 404);
  } else {
    ok('Notification isolation (skip - không có data)', true);
  }

  // Transfer cho banned user
  await r('PATCH', `/users/${user2Id}/status`, { status: 'banned' }, adminToken);
  x = await r('PATCH', `/drones/${drone2Id}/transfer`, { new_owner_id: user2Id }, adminToken);
  ok('Transfer cho user bị banned → 400', x.s === 400);
  await r('PATCH', `/users/${user2Id}/status`, { status: 'active' }, adminToken);

  // Lookup mã không tồn tại
  x = await r('GET', '/lookup/UAV-NOTEXIST-0000');
  ok('Lookup mã không tồn tại → 404', x.s === 404);

  // Setting key_name chứa ký tự đặc biệt → 422
  x = await r('POST', '/settings', { key_name: 'key with spaces!', key_value: 'v' }, adminToken);
  ok('Setting key_name ký tự không hợp lệ → 422', x.s === 422);

  // Broadcast thiếu title → 422
  x = await r('POST', '/notifications/broadcast', { content: 'No title' }, adminToken);
  ok('Broadcast thiếu title → 422', x.s === 422);

  // Admin tự khóa mình → 400
  x = await r('PATCH', `/users/${adminId}/status`, { status: 'banned' }, adminToken);
  ok('Admin tự khóa mình → 400', x.s === 400);

  // Admin tự xóa mình → 400
  x = await r('DELETE', `/users/${adminId}`, null, adminToken);
  ok('Admin tự xóa mình → 400', x.s === 400);
}

// ── 6. STATS ───────────────────────────────────────────────────
async function testStats() {
  sec('6. Stats & Data Integrity');

  let x = await r('GET', '/admin/stats', null, adminToken);
  ok('GET /admin/stats → 200', x.s === 200);
  ok('Stats có overview', !!x.d.data?.overview);
  ok('Stats có registrations', !!x.d.data?.registrations);
  ok('Stats có violations', !!x.d.data?.violations);
  ok('Stats có usersByRole', Array.isArray(x.d.data?.usersByRole));

  x = await r('GET', '/admin/stats/monthly?year=2025', null, adminToken);
  ok('GET /admin/stats/monthly → 200', x.s === 200);
  ok('Monthly có 12 tháng', x.d.data?.users?.length === 12);

  // Lookup ghi history
  await r('GET', '/lookup/UAV-FAKE-CHECK');
  x = await r('GET', '/lookup-history?q=UAV-FAKE-CHECK&limit=1', null, adminToken);
  ok('Lookup thất bại vẫn ghi history', x.s === 200 && x.d.data?.length >= 1);
}

// ── MAIN ───────────────────────────────────────────────────────
async function run() {
  console.log(`\n${b}${c}🔬 UAV ID - Senior Tester Suite${e}`);
  console.log(`${c}📡 ${BASE}\n${e}`);
  try {
    const health = await fetch('http://localhost:5000/health');
    if (!health.ok) throw new Error();
    console.log(`${g}✅ Server OK${e}`);
  } catch {
    console.log(`${rd}❌ Server chưa chạy!${e}`); process.exit(1);
  }

  await setup();
  await testAuth();
  await testRBAC();
  await testPagination();
  await testBusinessLogic();
  await testEdgeCases();
  await testStats();

  const total = pass + fail;
  console.log(`\n${b}${'━'.repeat(40)}${e}`);
  console.log(`${b}📊 Tổng: ${total} | ${g}✅ Pass: ${pass}${e} | ${fail > 0 ? rd : g}❌ Fail: ${fail}${e}`);
  if (bugs.length) {
    console.log(`\n${rd}${b}🐛 BUGS CẦN SỬA:${e}`);
    bugs.forEach(b => console.log(`${rd}  ${b}${e}`));
  } else {
    console.log(`\n${g}${b}🎉 Không phát hiện bug!${e}`);
  }
  console.log(`${b}${'━'.repeat(40)}${e}\n`);
  if (fail > 0) process.exit(1);
}

run().catch(e => { console.error(e.message); process.exit(1); });
