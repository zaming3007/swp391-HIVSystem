# 🚀 Quick Start Guide - Appointment Booking System

## ✅ Vấn Đề Đã Được Giải Quyết

Tôi đã tạo một **phiên bản đơn giản** của hệ thống đặt lịch khám để tránh các vấn đề phức tạp về Entity Framework configuration.

## 🎯 Các Bước Thực Hiện

### 1. **Ứng dụng đang chạy**
```
http://localhost:5000
```

### 2. **Truy cập trang Test & Setup**
```
http://localhost:5000/test/appointmenttest
```

### 3. **Tạo dữ liệu mẫu**
- Click **"Create Sample Doctors"** 
- Hệ thống sẽ tạo 4 bác sĩ mẫu trong bảng Users

### 4. **Test API**
- Click **"Test Get Doctors"** - Sẽ hiển thị danh sách bác sĩ
- Click **"Test Doctor Availability"** - Sẽ hiển thị khung giờ available

### 5. **Truy cập Appointment Booking**
```
http://localhost:5000/appointment-booking
```

## 🔧 Thay Đổi Đã Thực Hiện

### ✅ **SeedDataController** (Simplified)
- Sử dụng `ApplicationDbContext` thay vì `AppDbContext`
- Tạo doctor users trong bảng `Users` với username bắt đầu bằng "dr."
- Không cần tạo bảng `Doctors`, `DoctorSchedules` phức tạp

### ✅ **AppointmentsController** (Simplified)  
- API `/api/appointments/doctors/available` - Lấy danh sách bác sĩ từ bảng Users
- API `/api/appointments/doctors/{id}/availability` - Trả về time slots mặc định
- API `/api/appointments` - Tạo appointment demo (mock data)

### ✅ **Program.cs** (Simplified)
- Loại bỏ `AddInfrastructureServices` phức tạp
- Chỉ sử dụng `ApplicationDbContext` có sẵn

## 📋 Dữ Liệu Mẫu

Sau khi click "Create Sample Doctors", hệ thống tạo:

1. **dr.nguyen** - Dr. Nguyễn Văn An - HIV/AIDS Specialist
2. **dr.tran** - Dr. Trần Thị Bình - Infectious Disease  
3. **dr.le** - Dr. Lê Minh Cường - Immunology
4. **dr.pham** - Dr. Phạm Thu Hương - General Medicine

## 🎉 Kết Quả Mong Đợi

✅ **Database Status**: Hiển thị số lượng users và doctors  
✅ **Get Doctors**: Hiển thị 4 bác sĩ với thông tin đầy đủ  
✅ **Doctor Availability**: Hiển thị time slots từ 8:00-17:30  
✅ **Appointment Booking**: Có thể chọn bác sĩ và đặt lịch  

## 🔍 Troubleshooting

### Nếu vẫn lỗi "undefined":
1. Mở **Developer Tools** (F12)
2. Xem **Console** tab để kiểm tra lỗi JavaScript
3. Xem **Network** tab để kiểm tra API response

### Nếu API trả về lỗi:
1. Kiểm tra database connection
2. Đảm bảo ứng dụng đang chạy trên port 5000
3. Test API trực tiếp: `http://localhost:5000/api/seeddata/status`

## 📞 Next Steps

Sau khi test thành công phiên bản đơn giản này, chúng ta có thể:
1. Nâng cấp lên full appointment system với database schema đầy đủ
2. Thêm authentication và authorization
3. Implement real appointment booking logic
4. Add email notifications và reminders

---

**Lưu ý**: Đây là phiên bản demo đơn giản để test UI và basic functionality. Production system sẽ cần database schema đầy đủ và business logic phức tạp hơn. 