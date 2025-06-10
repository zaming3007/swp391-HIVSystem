# Khắc Phục Lỗi "Không thể tải danh sách bác sĩ"

## 🚨 Vấn Đề
Khi truy cập tính năng "Đặt Lịch Khám & Điều Trị HIV", xuất hiện lỗi:
```
Không thể tải danh sách bác sĩ
```

## 🔍 Nguyên Nhân
1. **Database chưa có dữ liệu bác sĩ**
2. **API endpoints chưa được cấu hình đúng**
3. **Dependency injection chưa được setup**
4. **Database connection issues**

## ✅ Giải Pháp

### Bước 1: Kiểm Tra Database
Truy cập: `/test/appointmenttest`

1. Click **"Check Database Status"** để xem trạng thái database
2. Nếu `Doctors: 0`, cần tạo dữ liệu mẫu

### Bước 2: Tạo Dữ Liệu Mẫu
Trên trang `/test/appointmenttest`:

1. Click **"Create Sample Doctors"** 
2. Hệ thống sẽ tạo:
   - 4 bác sĩ mẫu với chuyên khoa khác nhau
   - Lịch làm việc (Thứ 2-6, 8h-18h)
   - Thông tin đầy đủ

### Bước 3: Test API Endpoints
1. Click **"Test Get Doctors"** - Kiểm tra API lấy danh sách bác sĩ
2. Click **"Test Doctor Availability"** - Kiểm tra lịch trống

### Bước 4: Truy Cập Đặt Lịch
Sau khi có dữ liệu, click **"Go to Appointment Booking"** hoặc truy cập `/appointment-booking`

## 🛠️ Cấu Hình Kỹ Thuật

### Files Đã Được Tạo/Cập Nhật:
```
✅ HIVSystem.Web/Controllers/Api/AppointmentsController.cs
✅ HIVSystem.Web/Controllers/Api/SeedDataController.cs  
✅ HIVSystem.Web/Views/Test/AppointmentTest.cshtml
✅ HIVSystem.Web/Program.cs (thêm DI)
✅ HIVSystem.Web/HIVSystem.Web.csproj (thêm references)
```

### API Endpoints Available:
```
GET  /api/appointments/doctors/available
GET  /api/appointments/doctors/{id}/availability?date={date}
POST /api/appointments
POST /api/seeddata/doctors
GET  /api/seeddata/status
```

## 🔧 Troubleshooting Steps

### Nếu vẫn lỗi sau khi seed data:

1. **Kiểm tra Console Browser (F12)**:
   ```javascript
   // Mở Developer Tools và xem Console tab
   // Tìm lỗi 404, 500, hoặc CORS errors
   ```

2. **Test API trực tiếp**:
   ```
   Truy cập: /api/appointments/doctors/available
   Kết quả mong đợi: JSON array với danh sách bác sĩ
   ```

3. **Kiểm tra Database Connection**:
   ```
   Truy cập: /test/database
   Đảm bảo kết nối database thành công
   ```

### Nếu Database Connection Error:

1. **Cập nhật Connection String** trong `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=.;Database=HIVHealthcareSystem;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
     }
   }
   ```

2. **Chạy Migration** (nếu cần):
   ```bash
   dotnet ef database update
   ```

## 📋 Dữ Liệu Mẫu Được Tạo

### 4 Bác Sĩ Mẫu:
1. **Dr. Nguyễn Văn An** - HIV/AIDS Specialist (15 năm kinh nghiệm)
2. **Dr. Trần Thị Bình** - Infectious Disease (12 năm kinh nghiệm)  
3. **Dr. Lê Minh Cường** - Immunology (18 năm kinh nghiệm)
4. **Dr. Phạm Thu Hương** - General Medicine (10 năm kinh nghiệm)

### Lịch Làm Việc:
- **Thứ 2 - Thứ 6**: 8:00 AM - 6:00 PM
- **Time Slots**: 30 phút/slot
- **Available**: Tất cả slots đều có thể đặt

## 🎯 Kết Quả Mong Đợi

Sau khi hoàn thành các bước trên:

1. ✅ Trang đặt lịch hiển thị dropdown với 4 bác sĩ
2. ✅ Chọn ngày hiển thị các khung giờ available  
3. ✅ Có thể đặt lịch thành công
4. ✅ Nhận được mã lịch hẹn

## 🚀 Quick Start Commands

```bash
# 1. Chạy ứng dụng
dotnet run

# 2. Truy cập setup page
http://localhost:5000/test/appointmenttest

# 3. Click "Create Sample Doctors"

# 4. Truy cập appointment booking
http://localhost:5000/appointment-booking
```

## 📞 Support

Nếu vẫn gặp vấn đề, kiểm tra:
1. Console logs trong browser (F12)
2. Application logs trong Visual Studio
3. Database connection status
4. API response trong Network tab

---

**Lưu ý**: Đây là setup cho môi trường development. Production cần cấu hình bảo mật và dữ liệu thực tế. 