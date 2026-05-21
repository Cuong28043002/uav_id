const spec = require('../src/config/swagger');

console.log('=== BẮT ĐẦU KIỂM TRA NÂNG CAO SWAGGER SPEC (OPENAPI 3.0) ===');
let errorCount = 0;

Object.entries(spec.paths).forEach(([path, methods]) => {
  Object.entries(methods).forEach(([method, details]) => {
    const route = `${method.toUpperCase()} ${path}`;

    // 1. Kiểm tra cấm in: body hoặc in: formData trong OpenAPI 3.0
    if (details.parameters) {
      details.parameters.forEach(p => {
        if (p.in === 'body' || p.in === 'formData') {
          console.log(`❌ [INVALID PARAM IN] ${route} -> Sử dụng 'in: ${p.in}' không hợp lệ trong OpenAPI 3.0 (phải dùng requestBody)`);
          errorCount++;
        }

        // 2. Kiểm tra thuộc tính type, format, enum nằm ngoài schema
        if (p.type || p.format || p.items) {
          console.log(`❌ [LEGACY OPENAPI 2.0 PARAM] ${route} -> Parameter '${p.name}' có thuộc tính type/format/items nằm ngoài schema! Swagger UI 3.x sẽ bị crash nút Execute.`);
          error(p);
          errorCount++;
        }

        if (!p.schema) {
          console.log(`❌ [MISSING SCHEMA] ${route} -> Parameter '${p.name}' thiếu schema`);
          errorCount++;
        }
      });
    }

    // 3. Kiểm tra Path parameters có khớp với URL không
    const matches = path.match(/\{([^}]+)\}/g);
    if (matches) {
      matches.forEach(m => {
        const paramName = m.replace(/[{}]/g, '');
        const hasParam = details.parameters && details.parameters.some(p => p.name === paramName && p.in === 'path');
        if (!hasParam) {
          console.log(`❌ [MISSING PATH PARAM] ${route} -> Thiếu định nghĩa parameter: ${paramName}`);
          errorCount++;
        }
      });
    }

    // 4. Kiểm tra requestBody
    if (details.requestBody && details.requestBody.content) {
      Object.entries(details.requestBody.content).forEach(([contentType, c]) => {
        if (!c.schema) {
          console.log(`❌ [MISSING SCHEMA IN REQ BODY] ${route} (${contentType}) -> Thiếu schema`);
          errorCount++;
        }
      });
    }

    // 5. Kiểm tra responses
    if (!details.responses || Object.keys(details.responses).length === 0) {
      console.log(`❌ [MISSING RESPONSES] ${route} -> Không có định nghĩa responses`);
      errorCount++;
    }
  });
});

console.log(`=== KIỂM TRA HOÀN TẤT. TỔNG SỐ LỖI OPENAPI: ${errorCount} ===`);
