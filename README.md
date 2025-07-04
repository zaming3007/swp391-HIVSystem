# HIV Healthcare System
                                             
Hệ thống quản lý và hỗ trợ chăm sóc sức khỏe cho bệnh nhân HIV, cung cấp các công cụ để quản lý thuốc, đặt lịch hẹn và tư vấn trực tuyến.

## Cấu Trúc Dự Án

Dự án bao gồm ba phần chính:
1. **Frontend**: Ứng dụng React sử dụng TypeScript, Redux và Material UI
2. **AuthApi**: API .NET cho xác thực và quản lý người dùng
3. **AppointmentApi**: API .NET cho quản lý lịch hẹn và dịch vụ

## Hướng Dẫn Cài Đặt

### Yêu Cầu Hệ Thống
- Node.js 16+ và npm
- .NET 8.0 SDK
- PostgreSQL (hoặc sử dụng cấu hình database có sẵn)

### Cài Đặt Frontend

1. Đi đến thư mục gốc của dự án:
```bash
cd HIV-HealthcareSystem
```

2. Cài đặt các dependency:
```bash
npm install
```

3. Tạo file môi trường:
```bash
cp src/env.sample .env
```

4. Cập nhật file `.env` với URL API backend:
```
VITE_API_URL="https://localhost:7090/api"
```

5. Chạy môi trường phát triển:
```bash
npm run dev
```

Frontend sẽ khả dụng tại `http://localhost:5175`.

### Cài Đặt Backend

#### AuthApi

1. Đi đến thư mục AuthApi:
```bash
cd HIV-HealthcareSystem/AuthApi
```

2. Khôi phục các package .NET:
```bash
dotnet restore
```

3. Chạy API:
```bash
dotnet run
```

AuthApi sẽ khả dụng tại:
- HTTPS: `https://localhost:7090/api/Auth`
- Swagger UI: `https://localhost:7090/swagger`

#### AppointmentApi

1. Đi đến thư mục AppointmentApi:
```bash
cd HIV-HealthcareSystem/AppointmentApi
```

2. Khôi phục các package .NET:
```bash
dotnet restore
```

3. Chạy API:
```bash
dotnet run
```

AppointmentApi sẽ khả dụng tại:
- HTTPS: `https://localhost:7091/api`
- Swagger UI: `https://localhost:7091/swagger`

### Chạy Toàn Bộ Hệ Thống

Để chạy cả frontend và backend cùng một lúc:

```bash
npm run dev:all
```

## Tính Năng

### Xác Thực & Quản Lý Người Dùng
- Đăng ký người dùng với xác thực
- Đăng nhập người dùng
- Xác thực JWT
- Quản lý thông tin cá nhân

### Đặt Lịch Hẹn
- Đặt lịch hẹn trực tiếp hoặc qua telemedicine
- Xem lịch sử lịch hẹn
- Quản lý lịch hẹn sắp tới

### Nhắc Nhở Thuốc
- Thiết lập nhắc nhở thuốc ARV
- Theo dõi việc tuân thủ uống thuốc

### Tư Vấn Trực Tuyến
- Đặt câu hỏi với chuyên gia y tế
- Xem lịch sử tư vấn
- Nhận tư vấn y tế chuyên nghiệp

### Giáo Dục Sức Khỏe
- Thông tin cơ bản về HIV
- Hướng dẫn sống khỏe mạnh với HIV
- Tài liệu giảm kỳ thị

## Công Nghệ Sử Dụng

### Frontend
- React 18
- TypeScript
- Material UI
- Redux Toolkit cho quản lý state
- Axios cho các request API
- React Router cho routing
- Vite cho phát triển và build

### Backend
- ASP.NET Core 8.0 Web API
- Entity Framework Core
- JWT Authentication
- PostgreSQL
- Swagger UI cho API documentation

## API Endpoints

### Authentication API
- POST `/api/Auth/login` - Đăng nhập người dùng
- POST `/api/Auth/register` - Đăng ký người dùng
- GET `/api/Auth/me` - Lấy thông tin người dùng hiện tại (yêu cầu xác thực)

### Appointment API
- GET `/api/appointments/user/{userId}` - Lấy tất cả lịch hẹn của người dùng
- GET `/api/appointments/user/{userId}/status/{status}` - Lấy lịch hẹn theo trạng thái
- POST `/api/appointments` - Tạo lịch hẹn mới
- PUT `/api/appointments/{appointmentId}` - Cập nhật lịch hẹn
- PUT `/api/appointments/{appointmentId}/cancel` - Hủy lịch hẹn

### Doctors API
- GET `/api/doctors` - Lấy danh sách bác sĩ
- GET `/api/doctors/{id}` - Lấy thông tin chi tiết bác sĩ
- GET `/api/doctors/services/{serviceId}` - Lấy bác sĩ theo dịch vụ

### Consultation API
- GET `/api/consultations/patient/{userId}` - Lấy tất cả tư vấn của bệnh nhân
- GET `/api/consultations/{consultationId}` - Lấy chi tiết tư vấn
- POST `/api/consultations` - Tạo tư vấn mới
- PUT `/api/consultations/{consultationId}/answer` - Trả lời tư vấn

## Tài Khoản Demo
role: 'admin' | 'doctor' | 'customer' | 'staff';
Bạn có thể sử dụng tài khoản demo sau:
- Email: `demo@example.com`
- Mật khẩu: `password123`

## Giấy Phép

Dự án này được cấp phép theo giấy phép MIT.
