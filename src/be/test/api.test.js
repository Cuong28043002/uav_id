/**
 * UAV ID System - Automated API Test Script
 * Chạy: node test/api.test.js
 * Yêu cầu: Server đang chạy tại http://localhost:5000
 */

const BASE_URL = 'http://localhost:5000/api';

let adminToken = '';
let policeToken = '';
let userToken = '';
let testUserId = '';
let testDroneId = '';
let testRegId = '';
let testZoneId = '';
let testPermitId = '';
let testViolationId = '';
let testInspectionId = '';

const colors = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};

let passed = 0;
let failed = 0;

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

function test(name, condition, detail = '') {
  if (condition) {
    console.log(colors.green(`  ✅ ${name}`));
    passed++;
  } else {
    console.log(colors.red(`  ❌ ${name}`) + (detail ? colors.red(` → ${detail}`) : ''));
    failed++;
  }
}

function section(name) {
  console.log(colors.bold(colors.blue(`\n━━━ ${name} ━━━`)));
}

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
async function testAuth() {
  section('AUTH - Đăng ký & Đăng nhập');

  // Đăng ký thiếu field
  let r = await request('POST', '/auth/register', { email: 'test@test.com' });
  test('Register thiếu field → 422', r.status === 422, JSON.stringify(r.data));

  // Đăng ký email sai định dạng
  r = await request('POST', '/auth/register', { email: 'notanemail', password: '123456', full_name: 'Test' });
  test('Register email không hợp lệ → 422', r.status === 422);

  // Đăng ký admin (lần đầu có thể không có role, dùng seed data)
  r = await request('POST', '/auth/register', {
    email: `admin_${Date.now()}@uavid.vn`,
    password: 'Admin@123456',
    full_name: 'Quản trị viên Test',
    phone: '0901234567',
  });
  test('Register thành công → 201', r.status === 201, JSON.stringify(r.data));

  // Đăng nhập admin (seed với admin@uavid.vn nếu đã tạo)
  // Giả sử đã seed admin account qua database.sql
  r = await request('POST', '/auth/login', { email: 'admin@uavid.vn', password: 'Admin@123456' });
  if (r.status === 200 && r.data.data?.token) {
    adminToken = r.data.data.token;
    test('Login admin thành công → 200 + token', true);
  } else {
    // Thử tài khoản mới tạo
    r = await request('POST', '/auth/login', { email: 'test@uavid.vn', password: 'Admin@123456' });
    adminToken = r.data.data?.token || '';
    test('Login admin → cần seed dữ liệu admin trước', r.status === 200, 'Hãy tạo admin qua database.sql');
  }

  // Login sai mật khẩu
  r = await request('POST', '/auth/login', { email: 'admin@uavid.vn', password: 'wrongpassword' });
  test('Login sai mật khẩu → 401', r.status === 401 || r.status === 400);

  // Login không có email
  r = await request('POST', '/auth/login', { password: '123456' });
  test('Login thiếu email → 422', r.status === 422);

  // /auth/me
  if (adminToken) {
    r = await request('GET', '/auth/me', null, adminToken);
    test('/auth/me với token hợp lệ → 200', r.status === 200 && r.data.success);
  }
}

// ═══════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════
async function testUsers() {
  section('USERS - Quản lý người dùng');
  if (!adminToken) { console.log(colors.yellow('  ⚠ Bỏ qua (cần adminToken)')); return; }

  // Tạo user để test
  let r = await request('POST', '/auth/register', {
    email: `user_test_${Date.now()}@uavid.vn`,
    password: 'User@123456',
    full_name: 'Người Dùng Test',
    phone: '0987654321',
  });
  testUserId = r.data.data?.user?.id;
  userToken = r.data.data?.token;
  test('Tạo user test → 201', r.status === 201);

  // Danh sách users
  r = await request('GET', '/users', null, adminToken);
  test('GET /users (Admin) → 200', r.status === 200 && Array.isArray(r.data.data));

  // Filter theo status
  r = await request('GET', '/users?status=active&page=1&limit=5', null, adminToken);
  test('GET /users?status=active → 200 với phân trang', r.status === 200 && r.data.meta?.page === 1);

  // Tìm kiếm
  r = await request('GET', '/users?q=Người Dùng&sort_by=full_name&sort_order=ASC', null, adminToken);
  test('GET /users?q= tìm kiếm → 200', r.status === 200);

  // Chi tiết user
  if (testUserId) {
    r = await request('GET', `/users/${testUserId}`, null, adminToken);
    test(`GET /users/:id → 200`, r.status === 200 && r.data.data?.id === testUserId);

    // Cập nhật user
    r = await request('PUT', `/users/${testUserId}`, { address: 'Hà Nội, Việt Nam' }, adminToken);
    test('PUT /users/:id → 200', r.status === 200);

    // Khóa tài khoản
    r = await request('PATCH', `/users/${testUserId}/status`, { status: 'banned' }, adminToken);
    test('PATCH /users/:id/status = banned → 200', r.status === 200);

    // Mở lại
    r = await request('PATCH', `/users/${testUserId}/status`, { status: 'active' }, adminToken);
    test('PATCH /users/:id/status = active → 200', r.status === 200);

    // Validation: status sai
    r = await request('PATCH', `/users/${testUserId}/status`, { status: 'invalid' }, adminToken);
    test('PATCH status sai → 422', r.status === 422);
  }

  // Profile
  if (userToken) {
    r = await request('GET', '/users/profile', null, userToken);
    test('GET /users/profile → 200', r.status === 200);

    r = await request('PUT', '/users/profile', { full_name: 'Đã Cập Nhật', phone: '0909090909' }, userToken);
    test('PUT /users/profile → 200', r.status === 200);
  }
}

// ═══════════════════════════════════════════════════════════
// DRONES
// ═══════════════════════════════════════════════════════════
async function testDrones() {
  section('DRONES - Quản lý máy bay');
  const token = userToken || adminToken;
  if (!token) { console.log(colors.yellow('  ⚠ Bỏ qua (cần token)')); return; }

  // Thêm drone thiếu field
  let r = await request('POST', '/drones', { model_name: 'DJI Mini' }, token);
  test('POST /drones thiếu serial_number → 422', r.status === 422);

  // Thêm drone hợp lệ
  r = await request('POST', '/drones', {
    model_name: 'DJI Mini 3 Pro',
    serial_number: `SN-TEST-${Date.now()}`,
    weight: 0.249,
    max_flight_height: 120,
  }, token);
  testDroneId = r.data.data?.id;
  test('POST /drones thành công → 201', r.status === 201 && r.data.success, JSON.stringify(r.data));

  // Thêm drone trùng serial
  if (r.status === 201) {
    const sn = r.data.data?.serial_number;
    r = await request('POST', '/drones', { model_name: 'Test', serial_number: sn }, token);
    test('POST /drones serial trùng → 409', r.status === 409);
  }

  // Danh sách drones
  r = await request('GET', '/drones', null, token);
  test('GET /drones → 200', r.status === 200 && Array.isArray(r.data.data));

  // Filter nâng cao
  r = await request('GET', '/drones?min_weight=0.1&max_weight=0.5&sort_by=weight', null, token);
  test('GET /drones?min_weight&max_weight → 200', r.status === 200);

  r = await request('GET', '/drones?q=DJI&sort_by=model_name&sort_order=ASC', null, token);
  test('GET /drones?q=DJI → 200', r.status === 200);

  // Chi tiết
  if (testDroneId) {
    r = await request('GET', `/drones/${testDroneId}`, null, token);
    test('GET /drones/:id → 200', r.status === 200);

    // Cập nhật
    r = await request('PUT', `/drones/${testDroneId}`, { model_name: 'DJI Mini 3 Pro (Updated)' }, token);
    test('PUT /drones/:id → 200', r.status === 200);

    // Validation weight âm
    r = await request('PUT', `/drones/${testDroneId}`, { weight: -1 }, token);
    test('PUT /drones/:id weight âm → 422', r.status === 422);
  }
}

// ═══════════════════════════════════════════════════════════
// REGISTRATIONS
// ═══════════════════════════════════════════════════════════
async function testRegistrations() {
  section('REGISTRATIONS - Hồ sơ định danh');
  const token = userToken || adminToken;
  if (!token || !testDroneId) { console.log(colors.yellow('  ⚠ Bỏ qua (cần droneId)')); return; }

  // Nộp hồ sơ
  let r = await request('POST', '/registrations', { drone_id: testDroneId }, token);
  testRegId = r.data.data?.id;
  test('POST /registrations → 201', r.status === 201, JSON.stringify(r.data));

  // Nộp lại cùng drone → 409
  r = await request('POST', '/registrations', { drone_id: testDroneId }, token);
  test('POST /registrations drone đã có pending → 409', r.status === 409);

  // Danh sách
  r = await request('GET', '/registrations', null, token);
  test('GET /registrations → 200', r.status === 200);

  // Filter theo status
  r = await request('GET', '/registrations?status=pending&sort_by=createdAt', null, adminToken || token);
  test('GET /registrations?status=pending → 200', r.status === 200);

  // Chi tiết
  if (testRegId) {
    r = await request('GET', `/registrations/${testRegId}`, null, token);
    test('GET /registrations/:id → 200', r.status === 200);

    // QR chưa duyệt → 400
    r = await request('GET', `/registrations/${testRegId}/qr`, null, token);
    test('GET /registrations/:id/qr chưa duyệt → 400', r.status === 400);
  }

  // Admin duyệt hồ sơ (bắt buộc có adminToken)
  if (adminToken && testRegId) {
    r = await request('PATCH', `/registrations/${testRegId}/review`, { status: 'approved' }, adminToken);
    test('PATCH /registrations/:id/review approved → 200', r.status === 200);

    // QR sau khi duyệt → 200
    r = await request('GET', `/registrations/${testRegId}/qr`, null, token);
    test('GET /registrations/:id/qr sau duyệt → 200', r.status === 200 && r.data.data?.qr_code_url);

    // Tạo drone phụ để test thu hồi
    const droneTmp = await request('POST', '/drones', {
      model_name: 'DJI Mini Temp',
      serial_number: `SN-TEMP-${Date.now()}`,
      weight: 0.249,
      max_flight_height: 120,
    }, token);
    const droneTmpId = droneTmp.data.data?.id;
    if (droneTmpId) {
      const regTmp = await request('POST', '/registrations', { drone_id: droneTmpId }, token);
      const regTmpId = regTmp.data.data?.id;
      if (regTmpId) {
        await request('PATCH', `/registrations/${regTmpId}/review`, { status: 'approved' }, adminToken);
        
        // Thu hồi thiếu lý do → 422
        r = await request('PATCH', `/registrations/${regTmpId}/revoke`, {}, adminToken);
        test('PATCH /revoke thiếu lý do → 422', r.status === 422);

        // Thu hồi hợp lệ
        r = await request('PATCH', `/registrations/${regTmpId}/revoke`, { admin_note: 'Vi phạm quy định bay' }, adminToken);
        test('PATCH /registrations/:id/revoke → 200', r.status === 200);
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════
// FLIGHT ZONES
// ═══════════════════════════════════════════════════════════
async function testFlightZones() {
  section('FLIGHT ZONES - Khu vực bay');
  if (!adminToken) { console.log(colors.yellow('  ⚠ Bỏ qua (cần adminToken)')); return; }

  // Tạo zone
  let r = await request('POST', '/flight/zones', {
    name: `Khu vực test ${Date.now()}`,
    zone_type: 'restricted',
    description: 'Khu vực hạn chế test',
  }, adminToken);
  testZoneId = r.data.data?.id;
  test('POST /flight/zones → 201', r.status === 201);

  // Tạo zone thiếu zone_type → 422
  r = await request('POST', '/flight/zones', { name: 'Zone no type' }, adminToken);
  test('POST /flight/zones thiếu zone_type → 422', r.status === 422);

  // Tạo zone sai zone_type → 422
  r = await request('POST', '/flight/zones', { name: 'Zone bad', zone_type: 'invalid' }, adminToken);
  test('POST /flight/zones zone_type không hợp lệ → 422', r.status === 422);

  // Danh sách
  r = await request('GET', '/flight/zones', null, adminToken);
  test('GET /flight/zones → 200', r.status === 200);

  // Filter
  r = await request('GET', '/flight/zones?zone_type=restricted&q=test', null, adminToken);
  test('GET /flight/zones?zone_type=restricted&q= → 200', r.status === 200);

  if (testZoneId) {
    // Chi tiết
    r = await request('GET', `/flight/zones/${testZoneId}`, null, adminToken);
    test('GET /flight/zones/:id → 200', r.status === 200);

    // Cập nhật
    r = await request('PUT', `/flight/zones/${testZoneId}`, { zone_type: 'free' }, adminToken);
    test('PUT /flight/zones/:id → 200', r.status === 200);
  }
}

// ═══════════════════════════════════════════════════════════
// FLIGHT PERMITS
// ═══════════════════════════════════════════════════════════
async function testFlightPermits() {
  section('FLIGHT PERMITS - Cấp phép bay');
  const token = userToken || adminToken;
  if (!token || !testDroneId || !testZoneId) { console.log(colors.yellow('  ⚠ Bỏ qua (cần droneId & zoneId)')); return; }

  const now = new Date();
  const startTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 ngày
  const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // +2 giờ

  // Đảm bảo hồ sơ được approved trước khi xin phép bay
  if (adminToken && testRegId) {
    await request('PATCH', `/registrations/${testRegId}/review`, { status: 'approved' }, adminToken);
  }

  // Nộp đơn
  let r = await request('POST', '/flight/permits', {
    drone_id: testDroneId,
    zone_id: testZoneId,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    purpose: 'Quay phim test',
  }, token);
  testPermitId = r.data.data?.id;
  test('POST /flight/permits → 201', r.status === 201, JSON.stringify(r.data));

  // start_time trong quá khứ → 400
  r = await request('POST', '/flight/permits', {
    drone_id: testDroneId,
    zone_id: testZoneId,
    start_time: '2020-01-01T08:00:00.000Z',
    end_time: '2020-01-01T10:00:00.000Z',
    purpose: 'Test',
  }, token);
  test('POST /flight/permits start_time quá khứ → 400', r.status === 400);

  // Danh sách
  r = await request('GET', '/flight/permits', null, token);
  test('GET /flight/permits → 200', r.status === 200);

  // Filter theo status và khoảng thời gian
  r = await request('GET', '/flight/permits?status=pending&page=1&limit=5', null, token);
  test('GET /flight/permits?status=pending → 200', r.status === 200);

  if (testPermitId && adminToken) {
    // Duyệt permit
    r = await request('PATCH', `/flight/permits/${testPermitId}/review`, { status: 'approved' }, adminToken);
    test('PATCH /flight/permits/:id/review → 200', r.status === 200);
  }
}

// ═══════════════════════════════════════════════════════════
// VIOLATIONS
// ═══════════════════════════════════════════════════════════
async function testViolations() {
  section('VIOLATIONS - Vi phạm');
  if (!adminToken || !testDroneId || !testUserId) { console.log(colors.yellow('  ⚠ Bỏ qua (cần admin + droneId + userId)')); return; }

  // Tạo vi phạm
  let r = await request('POST', '/violations', {
    drone_id: testDroneId,
    user_id: testUserId,
    violation_type: 'Bay vào vùng cấm',
    description: 'Phát hiện lúc 14:30 ngày test',
    fine_amount: 5000000,
  }, adminToken);
  testViolationId = r.data.data?.id;
  test('POST /violations → 201', r.status === 201, JSON.stringify(r.data));

  // Thiếu violation_type → 422
  r = await request('POST', '/violations', { drone_id: testDroneId, user_id: testUserId }, adminToken);
  test('POST /violations thiếu violation_type → 422', r.status === 422);

  // fine_amount âm → 422
  r = await request('POST', '/violations', {
    drone_id: testDroneId, user_id: testUserId,
    violation_type: 'Test', fine_amount: -1000,
  }, adminToken);
  test('POST /violations fine_amount âm → 422', r.status === 422);

  // Danh sách với filter nâng cao
  r = await request('GET', '/violations', null, adminToken);
  test('GET /violations → 200', r.status === 200);

  r = await request('GET', '/violations?status=unpaid&min_fine=1000000&sort_by=fine_amount&sort_order=DESC', null, adminToken);
  test('GET /violations filter nâng cao → 200', r.status === 200);

  if (testViolationId) {
    // Cập nhật trạng thái → paid
    r = await request('PATCH', `/violations/${testViolationId}/status`, { status: 'paid' }, adminToken);
    test('PATCH /violations/:id/status = paid → 200', r.status === 200);

    // Xóa vi phạm đã paid → 400
    r = await request('DELETE', `/violations/${testViolationId}`, null, adminToken);
    test('DELETE violation đã paid → 400', r.status === 400);
  }
}

// ═══════════════════════════════════════════════════════════
// INSPECTIONS
// ═══════════════════════════════════════════════════════════
async function testInspections() {
  section('INSPECTIONS - Kiểm tra');
  if (!adminToken || !testDroneId) { console.log(colors.yellow('  ⚠ Bỏ qua (cần admin + droneId)')); return; }

  // Tạo biên bản kiểm tra
  let r = await request('POST', '/inspections', {
    drone_id: testDroneId,
    result: 'pass',
    notes: 'Máy bay đạt tiêu chuẩn',
  }, adminToken);
  testInspectionId = r.data.data?.id;
  test('POST /inspections → 201', r.status === 201, JSON.stringify(r.data));

  // result không hợp lệ → 422
  r = await request('POST', '/inspections', { drone_id: testDroneId, result: 'unknown' }, adminToken);
  test('POST /inspections result không hợp lệ → 422', r.status === 422);

  // Danh sách
  r = await request('GET', '/inspections', null, adminToken);
  test('GET /inspections → 200', r.status === 200);

  // Filter
  r = await request('GET', '/inspections?result=pass&sort_by=inspection_date', null, adminToken);
  test('GET /inspections?result=pass → 200', r.status === 200);

  if (testInspectionId) {
    r = await request('PUT', `/inspections/${testInspectionId}`, { notes: 'Đã cập nhật ghi chú' }, adminToken);
    test('PUT /inspections/:id → 200', r.status === 200);
  }
}

// ═══════════════════════════════════════════════════════════
// STATS & MISC
// ═══════════════════════════════════════════════════════════
async function testStats() {
  section('STATS & MISC');
  if (!adminToken) { console.log(colors.yellow('  ⚠ Bỏ qua (cần adminToken)')); return; }

  // Dashboard stats
  let r = await request('GET', '/admin/stats', null, adminToken);
  test('GET /admin/stats → 200', r.status === 200 && r.data.data?.overview, JSON.stringify(r.data));

  // Monthly stats
  r = await request('GET', '/admin/stats/monthly?year=2024', null, adminToken);
  test('GET /admin/stats/monthly → 200', r.status === 200 && Array.isArray(r.data.data?.months));

  // Manufacturers
  r = await request('GET', '/manufacturers?q=DJI&sort_by=name', null, adminToken);
  test('GET /manufacturers?q=DJI → 200', r.status === 200);

  // Drone categories
  r = await request('GET', '/drone-categories?q=Nông&page=1&limit=5', null, adminToken);
  test('GET /drone-categories?q= → 200', r.status === 200);

  // System settings
  r = await request('GET', '/settings', null, adminToken);
  test('GET /settings → 200', r.status === 200);

  // Upsert setting
  r = await request('POST', '/settings', { key_name: 'test_key', key_value: 'test_value', description: 'Test setting' }, adminToken);
  test('POST /settings upsert → 201 hoặc 200', r.status === 201 || r.status === 200);

  // Lookup công khai (không cần token)
  r = await request('GET', '/lookup/UAV-INVALID-CODE');
  test('GET /lookup/:code không hợp lệ → 404', r.status === 404);

  // Lookup history
  r = await request('GET', '/lookup-history?page=1&limit=10', null, adminToken);
  test('GET /lookup-history (Admin) → 200', r.status === 200);

  // Notifications
  const token = userToken || adminToken;
  r = await request('GET', '/notifications', null, token);
  test('GET /notifications → 200', r.status === 200);
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════
async function run() {
  console.log(colors.bold(colors.cyan('\n🚁 UAV ID System - API Test Suite')));
  console.log(colors.cyan(`📡 Base URL: ${BASE_URL}\n`));

  // Check server health
  try {
    const health = await fetch('http://localhost:5000/health');
    if (!health.ok) throw new Error('Server không phản hồi');
    console.log(colors.green('✅ Server đang chạy\n'));
  } catch {
    console.log(colors.red('❌ Server chưa chạy! Hãy chạy "npm run dev" trước.\n'));
    process.exit(1);
  }

  await testAuth();
  await testUsers();
  await testDrones();
  await testRegistrations();
  await testFlightZones();
  await testFlightPermits();
  await testViolations();
  await testInspections();
  await testStats();

  // ─── Summary ───
  const total = passed + failed;
  console.log(colors.bold(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`));
  console.log(colors.bold(`📊 Kết quả: ${total} test cases`));
  console.log(colors.green(`   ✅ Passed: ${passed}`));
  if (failed > 0) {
    console.log(colors.red(`   ❌ Failed: ${failed}`));
  } else {
    console.log(colors.green(`   ❌ Failed: ${failed}`));
  }
  console.log(colors.bold(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`));

  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(colors.red('Lỗi chạy test: ' + err.message));
  process.exit(1);
});
