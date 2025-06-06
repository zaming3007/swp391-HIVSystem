# 📋 Hệ thống Chăm sóc Sức khỏe HIV - Hướng dẫn Dữ liệu Mẫu

## 🎯 **CẤU TRÚC VAI TRÒ ĐƠN GIẢN (Chỉ 3 Vai trò)**

| ID Vai trò | Tên Vai trò | Mô tả | Số lượng |
|---------|-----------|-------------|-------|
| **1** | **Admin** | Quản trị viên hệ thống với quyền truy cập đầy đủ | 1 người dùng |
| **2** | **Doctor** | Bác sĩ cung cấp dịch vụ chăm sóc sức khỏe | 3 người dùng |
| **3** | **Customer** | Khách hàng nhận dịch vụ chăm sóc sức khỏe | 6 người dùng |

## 👥 **NGƯỜI DÙNG MẪU**

### 🔑 **Tài khoản Admin**
| Tên đăng nhập | Mật khẩu | Họ tên | Vai trò |
|----------|----------|-----------|------|
| `admin` | `test123` | Quản trị viên hệ thống | Admin |

### 👨‍⚕️ **Tài khoản Bác sĩ** 
| Tên đăng nhập | Mật khẩu | Họ tên | Chuyên khoa |
|----------|----------|-----------|-----------|
| `dr.nguyen` | `test123` | BS. Nguyễn Văn An | Chuyên khoa HIV/AIDS |
| `dr.tran` | `test123` | BS. Trần Thị Bình | Nội khoa Tổng quát |
| `dr.le` | `test123` | BS. Lê Văn Cường | Bệnh nhiễm trùng |

### 🏥 **Tài khoản Khách hàng**
| Tên đăng nhập | Mật khẩu | Họ tên | Loại dịch vụ |
|----------|----------|-----------|------|
| `customer001` | `test123` | Nguyễn Thị Dung | Khách hàng HIV |
| `customer002` | `test123` | Trần Văn Em | Khách hàng HIV |
| `customer003` | `test123` | Lê Thị Phương | Khách hàng HIV |
| `customer004` | `test123` | Phạm Văn Giang | Khách hàng HIV |
| `customer005` | `test123` | Võ Văn Hùng | Khám sức khỏe |
| `customer006` | `test123` | Đào Thị Inh | Chăm sóc phòng ngừa |

## 📊 **DỮ LIỆU MẪU BAO GỒM**

### 🏥 **Cơ sở Hạ tầng Y tế**
- ✅ **3 Cơ sở Y tế** (Trung tâm HIV Trung ương, Phòng khám Quận, Bệnh viện)
- ✅ **3 Bác sĩ** với hồ sơ đầy đủ, học vấn, chứng chỉ
- ✅ **6 Khách hàng** với lịch sử y tế, dị ứng, liên hệ khẩn cấp

### 💊 **Dữ liệu Y tế**
- ✅ **5 Thuốc ARV** với thông tin thuốc đầy đủ
- ✅ **6 Loại Xét nghiệm** (CD4, Tải lượng Virus, Tổng phân tích máu, v.v.)
- ✅ **Cuộc hẹn Đang hoạt động** và các lần khám đã hoàn thành
- ✅ **Kế hoạch Điều trị** với lịch trình thuốc
- ✅ **Kết quả Xét nghiệm** và báo cáo phòng thí nghiệm

### 📱 **Tính năng Hệ thống**
- ✅ **Bài viết Blog** và tài nguyên giáo dục
- ✅ **Thông báo** và nhắc nhở
- ✅ **Phiên Tư vấn** (video/chat)
- ✅ **Tư vấn Ẩn danh**
- ✅ **Cài đặt Hệ thống** và cấu hình

## 🚀 **CÀI ĐẶT**

### 1. **Chạy Schema Cơ sở dữ liệu**
```sql
-- Đầu tiên, chạy file schema chính
sqlcmd -S .\SQLEXPRESS -i HIVHealthcareSystem.sql
```

### 2. **Tải Dữ liệu Mẫu**
```sql
-- Sau đó, chạy file dữ liệu mẫu
sqlcmd -S .\SQLEXPRESS -i HIVHealthcareSystem_SampleData.sql
```

### 3. **Xác minh Cài đặt**
```sql
-- Kiểm tra vai trò và người dùng
SELECT r.RoleName, COUNT(u.UserID) as UserCount 
FROM Roles r 
LEFT JOIN Users u ON r.RoleID = u.RoleID 
GROUP BY r.RoleName;

-- Kết quả mong đợi:
-- Admin: 1
-- Doctor: 3  
-- Customer: 6
```

## 🧪 **KỊCH BẢN KIỂM THỬ**

### 🔐 **Kiểm thử Đăng nhập**
- **Admin**: Đăng nhập bằng `admin` để truy cập bảng điều khiển admin
- **Bác sĩ**: Đăng nhập bằng `dr.nguyen` để xem lịch hẹn khách hàng
- **Khách hàng**: Đăng nhập bằng `customer001` để đặt lịch hẹn

### 📅 **Đặt lịch Hẹn**
1. Đăng nhập bằng bất kỳ tài khoản khách hàng nào
2. Điều hướng đến đặt lịch hẹn
3. Chọn bác sĩ và khung giờ
4. Xác minh đặt lịch thành công

### 📋 **Hồ sơ Y tế**
- **Xem Khách hàng**: Đăng nhập bằng khách hàng để xem lịch sử y tế của mình
- **Xem Bác sĩ**: Đăng nhập bằng bác sĩ để xem khách hàng được phân công
- **Xem Admin**: Đăng nhập bằng admin để truy cập toàn bộ hệ thống

## 🎛️ **QUYỀN VAI TRÒ**

### 👑 **Admin (RoleID = 1)**
- ✅ Truy cập toàn bộ hệ thống
- ✅ Quản lý người dùng
- ✅ Cấu hình hệ thống
- ✅ Truy cập tất cả dữ liệu

### 👨‍⚕️ **Doctor (RoleID = 2)**
- ✅ Quản lý khách hàng
- ✅ Lập lịch hẹn
- ✅ Truy cập hồ sơ y tế
- ✅ Lập kế hoạch điều trị
- ❌ Quản trị hệ thống

### 🏥 **Customer (RoleID = 3)**
- ✅ Quản lý hồ sơ cá nhân
- ✅ Đặt lịch hẹn
- ✅ Hồ sơ y tế của mình
- ✅ Đặt lịch tư vấn
- ❌ Dữ liệu khách hàng khác
- ❌ Chức năng quản trị

## 📈 **DỮ LIỆU THỰC TẾ**

- **Tên Việt Nam**: Tất cả người dùng có tên Việt Nam thực tế
- **Dữ liệu Y tế**: Giao thức điều trị HIV và thuốc chính xác
- **Lịch trình**: Giờ làm việc và tình trạng có mặt thực tế của bác sĩ
- **Kết quả Xét nghiệm**: Giá trị phòng thí nghiệm và giải thích chính xác về mặt y tế
- **Địa điểm**: Địa chỉ và thông tin liên lạc TP. Hồ Chí Minh

---

**Cập nhật lần cuối**: Tháng 1/2024  
**Phiên bản Cơ sở dữ liệu**: Hệ thống Chăm sóc Sức khỏe HIV v1.0  
**Tổng số Bản ghi**: 30+ bản ghi mẫu chính với encoding UTF-8 được sửa lỗi 