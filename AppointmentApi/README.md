# Appointment API Documentation

API quản lý lịch hẹn dành cho ứng dụng chăm sóc sức khỏe.

## Công nghệ sử dụng
- .NET 8.0
- Swagger UI
- JWT Authentication

## Cài đặt và chạy

### Yêu cầu
- .NET SDK 8.0
- Visual Studio 2022 hoặc VS Code

### Các bước cài đặt
1. Clone dự án từ git repository
2. Di chuyển đến thư mục dự án:
   ```
   cd AppointmentApi
   ```
3. Khôi phục các package:
   ```
   dotnet restore
   ```
4. Build dự án:
   ```
   dotnet build
   ```
5. Chạy dự án:
   ```
   dotnet run
   ```

Đường dẫn Swagger UI: `http://localhost:5002/swagger/index.html`

## API Endpoints

### Doctors (Bác sĩ)
- `GET /api/doctors`: Lấy danh sách tất cả bác sĩ
- `GET /api/doctors/{id}`: Lấy thông tin chi tiết một bác sĩ theo ID
- `GET /api/doctors/specialization/{specialization}`: Lấy danh sách bác sĩ theo chuyên môn
- `GET /api/doctors/service/{serviceId}`: Lấy danh sách bác sĩ có thể thực hiện dịch vụ
- `GET /api/doctors/{id}/schedule`: Lấy lịch làm việc của bác sĩ

### Services (Dịch vụ)
- `GET /api/services`: Lấy danh sách tất cả dịch vụ
- `GET /api/services/{id}`: Lấy thông tin chi tiết một dịch vụ theo ID
- `GET /api/services/category/{category}`: Lấy danh sách dịch vụ theo danh mục
- `GET /api/services/doctor/{doctorId}`: Lấy danh sách dịch vụ mà bác sĩ có thể thực hiện

### Appointments (Lịch hẹn)
- `GET /api/appointments`: Lấy danh sách tất cả lịch hẹn (yêu cầu quyền Admin)
- `GET /api/appointments/{id}`: Lấy thông tin chi tiết một lịch hẹn theo ID
- `GET /api/appointments/patient`: Lấy danh sách lịch hẹn của người dùng hiện tại
- `GET /api/appointments/doctor/{doctorId}`: Lấy danh sách lịch hẹn của một bác sĩ (yêu cầu quyền Admin)
- `POST /api/appointments`: Tạo lịch hẹn mới
- `PUT /api/appointments/{id}`: Cập nhật thông tin lịch hẹn
- `DELETE /api/appointments/{id}`: Hủy lịch hẹn
- `GET /api/appointments/available-slots`: Lấy các khung giờ trống có thể đặt lịch

## Dữ liệu demo

Dự án này sử dụng dữ liệu in-memory cho mục đích demo. Các dữ liệu mẫu bao gồm:
- 3 bác sĩ với các chuyên khoa khác nhau
- 5 dịch vụ liên quan đến chăm sóc HIV/AIDS
- Lịch làm việc của các bác sĩ

## Xác thực và Phân quyền

API sử dụng JWT để xác thực và phân quyền. Để sử dụng các API endpoint yêu cầu xác thực, cần thêm token JWT vào request header:

```
Authorization: Bearer <your_token>
```

## Phản hồi API

Tất cả các API endpoint đều trả về phản hồi với định dạng thống nhất:

```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

Trong trường hợp lỗi:

```json
{
  "success": false,
  "message": "Lỗi xảy ra",
  "data": null
}
``` 