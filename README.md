# HIV Healthcare System
                                             
Hệ thống quản lý và hỗ trợ chăm sóc sức khỏe cho bệnh nhân HIV, cung cấp các công cụ để quản lý thuốc, đặt lịch hẹn và tư vấn trực tuyến.

## Hướng dẫn cài đặt và cấu hình

### Yêu cầu hệ thống
- Node.js (phiên bản 16 trở lên)
- .NET SDK (phiên bản 8.0 trở lên)
- npm hoặc yarn

### Các bước cài đặt

1. **Clone dự án**
   ```bash
   git clone <repository-url>
   cd HIV-HealthcareSystem_stock
   ```

2. **Cài đặt các dependencies cho phần Frontend**
   ```bash
   cd HIV-HealthcareSystem
   npm install
   ```

3. **Cấu hình kết nối API**
   
   Dự án đã được cấu hình để kết nối với database trên Railway. Không cần thay đổi cấu hình trong `src/services/api.ts` vì đã được thiết lập sẵn URL kết nối:
   ```javascript
   const baseURL = 'https://interchange.proxy.rlwy.net:46712/api';
   ```

4. **Chạy ứng dụng Frontend**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ: http://localhost:5175

5. **Chạy Backend API (nếu cần phát triển)**
   
   Nếu bạn cần phát triển và chạy API localy:
   ```bash
   cd AppointmentApi
   dotnet run
   ```
   
   Và trong một terminal khác:
   ```bash
   cd AuthApi
   dotnet run
   ```

   Hoặc chạy cả frontend và backend cùng lúc:
   ```bash
   npm run dev:all
   ```

### Lưu ý về kết nối database

- Dự án đã được cấu hình để kết nối với database PostgreSQL trên Railway.
- Thông tin kết nối đã được cấu hình trong các file `appsettings.json` của các project API.
- Không cần thay đổi cấu hình này nếu bạn muốn sử dụng database đã được setup sẵn.

### Cấu hình cho môi trường phát triển

Nếu bạn muốn sử dụng database local hoặc database khác, bạn cần thay đổi chuỗi kết nối trong các file sau:

1. `HIV-HealthcareSystem/AppointmentApi/appsettings.json`
2. `HIV-HealthcareSystem/AuthApi/appsettings.json`

Thay đổi giá trị của `ConnectionStrings:DefaultConnection` thành chuỗi kết nối của bạn.

### Cấu hình API URL cho Frontend

Nếu bạn chạy API trên local hoặc một server khác, bạn cần thay đổi API URL trong file `src/services/api.ts`:

```javascript
// Thay đổi URL này thành URL của API của bạn
const baseURL = 'https://your-api-url/api';
```

## Cấu trúc dự án

- `HIV-HealthcareSystem/`: Frontend React
  - `src/`: Mã nguồn React
  - `public/`: Tài nguyên tĩnh
- `AppointmentApi/`: API quản lý lịch hẹn
- `AuthApi/`: API xác thực và phân quyền

## Cấu Trúc Dự Án

Dự án bao gồm ba phần chính:
1. **Frontend**: Ứng dụng React sử dụng TypeScript, Redux và Material UI
2. **AuthApi**: API .NET cho xác thực và quản lý người dùng
3. **AppointmentApi**: API .NET cho quản lý lịch hẹn và dịch vụ

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
- GET `/api/consultations/{consultationId}`