# Giao Diện Đặt Lịch Khám HIV - Hướng Dẫn Sử Dụng

## 🎯 Tổng Quan

Tính năng đặt lịch khám HIV đã được tích hợp hoàn toàn vào giao diện chính của hệ thống với thiết kế thân thiện và bảo mật cao.

## 🚀 Cách Truy Cập

### 1. Từ Trang Chủ (Homepage)
- **Nút chính**: Nhấn vào nút "**Đặt Lịch Ngay**" trong phần nổi bật ở đầu trang
- **Card tính năng**: Click vào card "**Đặt Lịch Khám**" trong phần tính năng hệ thống

### 2. Từ Menu Navigation
- **Menu chính**: Click "**Đặt Lịch Khám**" trên thanh menu (màu xanh, nổi bật)
- **Menu dropdown**: Vào "Dịch vụ" → "**Đặt lịch khám HIV**"

### 3. URL Trực Tiếp
```
/appointment-booking
```

## 🎨 Tính Năng Giao Diện

### ✨ Thiết Kế Hiện Đại
- **Responsive Design**: Tương thích mọi thiết bị (desktop, tablet, mobile)
- **Bootstrap 5**: Sử dụng framework CSS hiện đại
- **Font Awesome Icons**: Biểu tượng trực quan và đẹp mắt
- **Gradient Colors**: Màu sắc gradient chuyên nghiệp

### 🔒 Bảo Mật & Riêng Tư
- **Đặt lịch ẩn danh**: Checkbox để bảo vệ danh tính
- **Thông tin mã hóa**: Hiển thị cam kết bảo mật
- **Form validation**: Kiểm tra dữ liệu đầu vào

### 📱 Trải Nghiệm Người Dùng
- **Loading states**: Hiển thị trạng thái đang xử lý
- **Success/Error messages**: Thông báo rõ ràng
- **Interactive elements**: Hover effects và animations
- **Time slot selection**: Chọn giờ khám trực quan

## 🛠️ Cấu Trúc Kỹ Thuật

### React Components
```
AppointmentBooking.js - Component chính cho đặt lịch
├── State Management (React Hooks)
├── API Integration (Fetch)
├── Form Validation
└── UI Interactions
```

### CSS Styling
```
appointment-booking.css - Styles tùy chỉnh
├── Responsive Grid Layout
├── Custom Animations
├── Interactive Elements
└── Mobile Optimizations
```

### Integration Points
```
App.js - Routing configuration
Header.js - Navigation menu items
Home.js - Homepage integration
_ReactLayout.cshtml - Script includes
```

## 📋 Quy Trình Đặt Lịch

### Bước 1: Chọn Bác Sĩ
- Dropdown hiển thị danh sách bác sĩ có sẵn
- Thông tin: Tên bác sĩ + Chuyên khoa

### Bước 2: Chọn Ngày
- Date picker với giới hạn:
  - Từ hôm nay đến 30 ngày tới
  - Không cho phép chọn ngày quá khứ

### Bước 3: Chọn Giờ
- Grid layout hiển thị các khung giờ
- Màu sắc phân biệt:
  - **Xanh**: Có thể đặt
  - **Xám**: Đã hết chỗ
  - **Highlight**: Đã chọn

### Bước 4: Thông Tin Bệnh Nhân
- **Đăng nhập**: Tự động điền thông tin
- **Ẩn danh**: Form nhập thông tin riêng

### Bước 5: Xác Nhận
- Review thông tin
- Submit và nhận mã lịch hẹn

## 🎯 Tính Năng Đặc Biệt

### 🔐 Đặt Lịch Ẩn Danh
```javascript
// Khi checkbox được chọn
isAnonymous: true
patientInfo: {
    fullName: "...",
    phoneNumber: "...",
    email: "...",
    // Thông tin không liên kết với tài khoản
}
```

### 📊 Real-time Availability
```javascript
// Tự động load lịch trống khi chọn bác sĩ/ngày
useEffect(() => {
    if (selectedDoctor && selectedDate) {
        loadAvailableSlots();
    }
}, [selectedDoctor, selectedDate]);
```

### 🎨 Interactive UI Elements
- **Hover effects** trên cards và buttons
- **Loading spinners** khi xử lý
- **Smooth transitions** giữa các trạng thái
- **Responsive grid** cho time slots

## 📱 Mobile Optimization

### Responsive Breakpoints
```css
@media (max-width: 768px) {
    .time-slot-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    .btn-appointment {
        width: 100%;
    }
}
```

### Touch-Friendly
- Buttons có kích thước tối thiểu 44px
- Spacing phù hợp cho touch interaction
- Scroll behavior mượt mà

## 🔧 Cấu Hình & Tùy Chỉnh

### Màu Sắc Chủ Đạo
```css
:root {
    --primary-color: #007bff;
    --success-color: #28a745;
    --warning-color: #ffc107;
    --danger-color: #dc3545;
}
```

### Animation Timing
```css
.transition-standard {
    transition: all 0.3s ease;
}
```

## 🚀 Deployment Notes

### Files Added/Modified
```
✅ AppointmentBooking.js - New component
✅ appointment-booking.css - New styles
✅ App.js - Added routing
✅ Home.js - Added UI elements
✅ Header.js - Added navigation
✅ _ReactLayout.cshtml - Added includes
```

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🎉 Kết Luận

Giao diện đặt lịch khám HIV đã được tích hợp hoàn chỉnh với:

1. **Truy cập dễ dàng** từ nhiều điểm trong hệ thống
2. **Thiết kế hiện đại** và thân thiện người dùng
3. **Bảo mật cao** với tùy chọn ẩn danh
4. **Responsive** trên mọi thiết bị
5. **Performance tối ưu** với React hooks

Người dùng có thể đặt lịch khám HIV một cách thuận tiện, bảo mật và riêng tư ngay từ trang chủ của hệ thống. 