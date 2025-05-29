# HIV Healthcare System - Web Application

## Mô tả
Ứng dụng web quản lý hệ thống chăm sóc sức khỏe cho bệnh nhân HIV, được xây dựng bằng ASP.NET Core MVC và kết nối trực tiếp với SQL Server.

## Yêu cầu hệ thống
- .NET 9.0 SDK
- SQL Server (LocalDB hoặc SQL Server Express)
- Visual Studio hoặc Visual Studio Code

## Cách chạy ứng dụng

### 1. Chuẩn bị Database
Đảm bảo SQL Server đang chạy và database `HIVHealthcareSystem` đã được tạo với đầy đủ các bảng theo script database đã cung cấp.

### 2. Cấu hình Connection String
Kiểm tra file `appsettings.json` và cập nhật connection string nếu cần:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=HIVHealthcareSystem;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

### 3. Thêm dữ liệu test (tuỳ chọn)
Nếu muốn có dữ liệu test để đăng nhập, chạy script `SeedData.sql` trong SQL Server Management Studio hoặc Azure Data Studio.

### 4. Chạy ứng dụng
Mở terminal/command prompt tại thư mục dự án và chạy:
```bash
dotnet run
```

Hoặc trong Visual Studio: nhấn F5 hoặc Ctrl+F5

### 5. Truy cập ứng dụng
Mở trình duyệt và truy cập: `https://localhost:5001` hoặc `http://localhost:5000`

## Tài khoản test
Sau khi chạy script `SeedData.sql`, bạn có thể sử dụng các tài khoản sau để test:

| Vai trò | Username | Password | Mô tả |
|---------|----------|----------|--------|
| Admin | `admin` | `admin123` | Quản trị viên hệ thống |
| Doctor | `doctor` | `doctor123` | Bác sĩ |
| Patient | `patient` | `patient123` | Bệnh nhân |

## Chức năng hiện tại
- ✅ Đăng nhập với xác thực database
- ✅ Giao diện đăng nhập đẹp với Bootstrap
- ✅ Kết nối trực tiếp với SQL Server
- ✅ Hash password bằng SHA256
- ✅ Responsive design

## Cấu trúc dự án
```
HIVSystem.Web/
├── Controllers/
│   ├── AccountController.cs    # Xử lý đăng nhập
│   └── HomeController.cs       # Trang chủ
├── Data/
│   └── ApplicationDbContext.cs # Entity Framework DbContext
├── Models/
│   ├── User.cs                 # Model người dùng
│   └── LoginViewModel.cs       # ViewModel đăng nhập
├── Views/
│   ├── Account/
│   │   └── Login.cshtml        # Trang đăng nhập
│   ├── Home/
│   │   └── Index.cshtml        # Trang chủ
│   └── Shared/
│       └── _Layout.cshtml      # Layout chung
├── appsettings.json            # Cấu hình ứng dụng
├── Program.cs                  # Entry point
└── SeedData.sql               # Script tạo dữ liệu test
```

## Lưu ý
- Đây là phiên bản cơ bản để test kết nối database
- Trong môi trường production cần thêm các tính năng bảo mật khác
- Password hiện tại được hash bằng SHA256, nên xem xét sử dụng bcrypt hoặc PBKDF2 cho bảo mật tốt hơn
- Chưa có session management và authorization đầy đủ

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra SQL Server có đang chạy không
- Kiểm tra connection string trong `appsettings.json`
- Đảm bảo database `HIVHealthcareSystem` đã được tạo

### Lỗi đăng nhập
- Đảm bảo đã chạy script `SeedData.sql` để tạo tài khoản test
- Kiểm tra username và password có đúng không
- Kiểm tra bảng Users trong database có dữ liệu không

### Port đã được sử dụng
- Thay đổi port trong `launchSettings.json` hoặc dùng port khác
- Hoặc dừng process đang sử dụng port đó

## Liên hệ
Nếu có vấn đề gì, hãy kiểm tra log trong console hoặc Developer Tools của trình duyệt để debug. 