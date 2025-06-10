# Hướng Dẫn Test và Khắc Phục Lỗi - Hệ thống Y tế HIV

## 🔧 Các Vấn Đề Đã Khắc Phục

### 1. Lỗi Tạo Lịch Khám
**Vấn đề**: "An error occurred while saving the entity changes"
**Nguyên nhân**: Database schema không khớp với model
**Giải pháp**: 
- Cập nhật model Appointment với đầy đủ các trường
- Tạo model Facility
- Thêm API khắc phục lỗi database

### 2. Vấn đề Navigation Hồ Sơ
**Vấn đề**: Click "Hồ sơ cá nhân" redirect đến `/Account/Profile` và yêu cầu đăng nhập lại
**Nguyên nhân**: Conflict giữa MVC routing và React SPA routing
**Giải pháp**: 
- Sửa AccountController để redirect về React SPA
- Thêm logic xử lý redirect trong layout
- Cải thiện Profile component với tabs

### 3. Vấn đề MyAppointments View Not Found
**Vấn đề**: "The view 'MyAppointments' was not found"
**Nguyên nhân**: Link cũ vẫn trỏ đến MVC view không tồn tại
**Giải pháp**:
- Sửa AccountController.MyAppointments() redirect về React SPA
- Thêm ProfileTab support để mở đúng tab

## 🧪 Hướng Dẫn Test Chi Tiết

### Bước 1: Debug Tool - Chẩn đoán vấn đề
1. Truy cập: `http://localhost:5072/debug-appointment.html`
2. Chạy từng bước theo thứ tự:
   - **"1. Kiểm tra Database"** - Xem schema có đầy đủ không
   - **"2. Kiểm tra Doctors"** - Xem có bác sĩ nào không
   - **"3. Kiểm tra Facilities"** - Xem có cơ sở y tế không
   - **"4. Test Tạo Appointment"** - Test trực tiếp API
   - **"5. Kiểm tra Appointments"** - Xem danh sách đã tạo

### Bước 2: Khởi tạo Database (nếu cần)
1. Truy cập: `http://localhost:5072/database-init.html`
2. Click **"Kiểm tra Schema Database"** để xem tình trạng hiện tại
3. Click **"Khởi tạo Database"** để thêm các bảng và cột thiếu
4. Click **"Khắc phục lỗi Appointment"** để sửa các lỗi cụ thể

### Bước 3: Test End-to-End
1. Vào trang chủ → **"Đặt Lịch Khám"**
2. Điền thông tin bệnh nhân
3. Chọn bác sĩ và thời gian
4. Click **"Xác nhận đặt lịch"** → Phải thành công

### Bước 4: Test Navigation
1. Đăng nhập vào hệ thống
2. Click vào tên người dùng → **"Hồ sơ cá nhân"** → Phải vào được trang profile
3. Click **"Lịch đã đặt"** → Phải chuyển đến tab appointments trong profile

## 🛠️ Các Công Cụ Debug

### 1. Debug Appointment Tool
- **URL**: `http://localhost:5072/debug-appointment.html`
- **Chức năng**:
  - Kiểm tra database schema chi tiết
  - Test từng bước của appointment creation
  - Hiển thị error messages chi tiết
  - Raw response debugging

### 2. Database Initialization Tool
- **URL**: `http://localhost:5072/database-init.html`
- **Chức năng**:
  - Kiểm tra schema database
  - Khởi tạo bảng và cột thiếu
  - Khắc phục lỗi appointment cụ thể
  - Test tạo appointment
  - Test Profile API

### 3. API Endpoints Debug
- `POST /api/database/initialize` - Khởi tạo database
- `GET /api/database/check-schema` - Kiểm tra schema
- `POST /api/database/fix-appointment-error` - Khắc phục lỗi appointment

## 📋 Checklist Khắc Phục

### ✅ Database Issues
- [ ] Bảng Facilities đã được tạo
- [ ] Bảng Appointments có đầy đủ các cột: FacilityID, EndTime, AppointmentType, Purpose, ReminderSent, CreatedBy
- [ ] Có ít nhất 1 facility mặc định
- [ ] Foreign key constraints đã được thêm
- [ ] Không có missing columns

### ✅ Appointment Creation
- [ ] API `/api/appointments/doctors/available` trả về danh sách bác sĩ
- [ ] API `/api/appointments` POST request thành công
- [ ] Không có lỗi "entity changes" khi save
- [ ] Response trả về appointmentId và thông tin đầy đủ

### ✅ Navigation & Profile
- [ ] Click "Hồ sơ cá nhân" vào được trang profile (không redirect ra ngoài)
- [ ] Tab "Thông tin cá nhân" hiển thị và cập nhật được
- [ ] Tab "Lịch đã đặt" hiển thị danh sách appointment
- [ ] Link "Lịch đã đặt" từ menu chuyển đến profile tab appointments
- [ ] Không có lỗi "View not found"

### ✅ Session & Authentication
- [ ] Session được duy trì khi navigate
- [ ] Không bị logout khi chuyển trang
- [ ] User info hiển thị đúng trong profile

## 🚨 Troubleshooting Cụ Thể

### Lỗi "An error occurred while saving the entity changes"
**Các bước khắc phục:**
1. Vào Debug Tool → "1. Kiểm tra Database"
2. Nếu có missing columns → Vào Database Init → "Khởi tạo Database"
3. Nếu không có facilities → Click "Khắc phục lỗi Appointment"
4. Test lại với "4. Test Tạo Appointment"

### Lỗi "The view 'MyAppointments' was not found"
**Đã khắc phục:** AccountController.MyAppointments() giờ redirect về React SPA

### Profile không hiển thị hoặc redirect sai
**Các bước kiểm tra:**
1. Đảm bảo đã đăng nhập
2. Clear browser cache
3. Kiểm tra console browser có lỗi JavaScript không
4. Thử đăng xuất và đăng nhập lại

### Appointment history không load
**Các bước khắc phục:**
1. Vào Debug Tool → "5. Kiểm tra Appointments"
2. Nếu lỗi unauthorized → Đăng nhập lại
3. Nếu không có data → Tạo appointment test trước

## 🎯 Kết Quả Mong Đợi

Sau khi hoàn thành các bước:

1. **Debug Tool**: Tất cả 5 bước đều pass (màu xanh)
2. **Tạo lịch khám**: Hoạt động mượt mà, không có lỗi
3. **Hồ sơ cá nhân**: Truy cập được trực tiếp, có đầy đủ chức năng
4. **Lịch sử khám**: Hiển thị đúng các appointment đã đặt
5. **Navigation**: Mượt mà trong SPA, không bị reload trang

## 📞 Debug Commands

### Kiểm tra nhanh trong browser console:
```javascript
// Test API endpoints
fetch('/api/database/check-schema').then(r => r.json()).then(console.log);
fetch('/api/appointments/doctors/available').then(r => r.json()).then(console.log);
fetch('/api/appointments/my-appointments').then(r => r.json()).then(console.log);
```

### Kiểm tra session:
```javascript
// Check if user is logged in
console.log('Session check:', document.cookie);
```

---

**Lưu ý**: Hệ thống đã được thiết kế theo chuẩn y tế hiện đại với UI/UX thân thiện và bảo mật thông tin bệnh nhân. Tất cả các vấn đề đã được khắc phục với các tool debug chuyên dụng. 