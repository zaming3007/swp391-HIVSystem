# 🏥 HIV Treatment and Medical Services System

<div align="center">

![HIV Care System](https://img.shields.io/badge/HIV-Care%20System-blue?style=for-the-badge)
![.NET 8.0](https://img.shields.io/badge/.NET-8.0-purple?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=for-the-badge&logo=postgresql)

**Hệ thống quản lý điều trị và dịch vụ y tế HIV/AIDS toàn diện**

*Cung cấp nền tảng tích hợp để quản lý lịch hẹn, tư vấn trực tuyến, theo dõi điều trị ARV và hỗ trợ bệnh nhân HIV*

</div>

---

## 📋 Tổng Quan Dự Án

Hệ thống HIV Treatment and Medical Services là một ứng dụng web hiện đại được phát triển để hỗ trợ toàn diện việc chăm sóc và điều trị bệnh nhân HIV/AIDS. Dự án được xây dựng với kiến trúc microservices, sử dụng .NET 8.0 cho backend và React với TypeScript cho frontend.

### 🎯 Mục Tiêu Chính
- **Cải thiện chất lượng chăm sóc**: Tích hợp toàn bộ quy trình điều trị HIV
- **Tăng khả năng tiếp cận**: Đặt lịch hẹn và tư vấn trực tuyến dễ dàng
- **Bảo mật thông tin**: Đảm bảo riêng tư thông tin y tế nhạy cảm
- **Hỗ trợ tuân thủ điều trị**: Theo dõi và nhắc nhở uống thuốc ARV

## 🏗️ Kiến Trúc Hệ Thống

### Frontend Stack
```
React 18 + TypeScript
├── Material-UI (MUI) v5      # UI Components
├── Redux Toolkit             # State Management
├── React Router v6           # Routing
├── Axios                     # HTTP Client
└── Vite                      # Build Tool
```

### Backend Stack
```
.NET 8.0 Web API
├── Entity Framework Core     # ORM
├── PostgreSQL               # Database
├── JWT Authentication       # Security
└── Swagger/OpenAPI         # Documentation
```

### Database
- **Primary**: PostgreSQL trên Railway Cloud
- **Connection**: Entity Framework Core với Connection Pooling
- **Approach**: Code-First Migrations

## 🚀 Tính Năng Chính

### 👥 Quản Lý Người Dùng & Phân Quyền
- **4 vai trò chính**: Admin, Staff, Doctor, Customer
- **Xác thực JWT**: Bảo mật với Bearer Token
- **Role-based Access Control**: Phân quyền chi tiết theo vai trò
- **Profile Management**: Quản lý thông tin cá nhân

### 📅 Hệ Thống Đặt Lịch Hẹn
- **Booking Interface**: Giao diện đặt lịch thân thiện
- **Real-time Availability**: Kiểm tra lịch trống theo thời gian thực
- **Auto-confirmation**: Tự động xác nhận không cần phê duyệt
- **Multi-role Management**: Dashboard riêng cho staff/doctor

### 💬 Tư Vấn Trực Tuyến
- **Anonymous Consultation**: Hỏi đáp ẩn danh bảo mật
- **Topic Categorization**: Phân loại theo chủ đề y tế
- **Professional Response**: Bác sĩ/staff trả lời chuyên nghiệp
- **Status Tracking**: Theo dõi trạng thái (Pending → Answered)

### 🏥 Quản Lý Điều Trị ARV
- **Regimen Management**: Quản lý phác đồ điều trị ARV
- **Treatment History**: Lịch sử điều trị chi tiết
- **Medication Reminders**: Nhắc nhở uống thuốc tự động
- **Compliance Monitoring**: Đánh giá tuân thủ điều trị

### 📝 Hệ Thống Blog & Giáo Dục
- **Content Management**: Staff quản lý nội dung giáo dục
- **Interactive Comments**: Người dùng tương tác với bài viết
- **Category Organization**: Tổ chức theo chủ đề
- **Draft/Publish Workflow**: Quy trình xuất bản

## 🛠️ Cài Đặt & Triển Khai

### Yêu Cầu Hệ Thống
- **Node.js**: v18+
- **.NET SDK**: 8.0
- **PostgreSQL**: 14+ (hoặc Railway)
- **Git**: Latest version

### 🚀 Quick Start

#### 1. Clone Repository
```bash
git clone [repository-url]
cd swp391-HIVSystem
```

#### 2. Frontend Setup
```bash
# Cài đặt dependencies
npm install

# Chạy development server (port 5175)
npm run dev
```

#### 3. Backend Setup

**AuthApi (Port 5000)**
```bash
cd AuthApi
dotnet restore
dotnet run
```

**AppointmentApi (Port 5002)**
```bash
cd AppointmentApi
dotnet restore
dotnet run
```

#### 4. Chạy Tất Cả Services
```bash
# Chạy đồng thời frontend + backend
npm run dev:all
```

### 🌐 URLs & Ports
- **Frontend**: http://localhost:5175
- **AuthApi**: http://localhost:5000
- **AppointmentApi**: http://localhost:5002

---

## 🔧 Cấu Hình

### Environment Variables
Tạo file `.env` trong thư mục gốc:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APPOINTMENT_API_URL=http://localhost:5002
```

### Database Connection
Railway PostgreSQL (Production):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=interchange.proxy.rlwy.net;Port=46712;Database=railway;Username=postgres;Password=***"
  }
}
```

## 👥 Tài Khoản Demo

| Vai Trò | Email | Password | Mô Tả |
|---------|-------|----------|--------|
| **Admin** | admin@gmail.com | admin123 | Quản trị hệ thống |
| **Staff** | staff@gmail.com | staff123 | Nhân viên y tế |
| **Doctor** | doctor@gmail.com | doctor123 | Bác sĩ điều trị |

## 📱 Giao Diện & Trải Nghiệm

### Menu Navigation
```
Trang chủ → Đặt lịch hẹn → Tư vấn → Blog → Dịch Vụ → Tài Liệu
```

### Responsive Design
- **Mobile-first**: Tối ưu cho điện thoại
- **Tablet-friendly**: Thích ứng màn hình tablet
- **Desktop**: Trải nghiệm đầy đủ trên máy tính

### Key Features
- **Modern UI**: Material Design với gradient đẹp mắt
- **Dark/Light Mode**: Hỗ trợ chế độ sáng/tối
- **Accessibility**: Tuân thủ WCAG 2.1
- **Performance**: Lazy loading và code splitting

## 🔒 Bảo Mật & Quyền Riêng Tư

### Authentication & Authorization
- **JWT Tokens**: Xác thực an toàn với Bearer Token
- **Role-based Access**: Phân quyền chi tiết theo vai trò
- **Token Expiration**: Tự động hết hạn và refresh
- **Password Security**: BCrypt hashing

### Data Protection
- **HTTPS**: Mã hóa dữ liệu truyền tải
- **Input Validation**: Kiểm tra và sanitize dữ liệu
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy

## 📊 Cấu Trúc Dự Án

```
swp391-HIVSystem/
├── 📁 src/
│   ├── 📁 components/           # UI Components
│   │   ├── 📁 auth/            # Authentication components
│   │   ├── 📁 consultation/    # Consultation components
│   │   ├── 📁 dashboard/       # Dashboard components
│   │   └── 📁 layout/          # Layout components
│   ├── 📁 pages/               # Page components
│   │   ├── 📁 admin/           # Admin pages
│   │   ├── 📁 doctor/          # Doctor pages
│   │   ├── 📁 staff/           # Staff pages
│   │   └── 📁 home/            # Public pages
│   ├── 📁 services/            # API services
│   ├── 📁 store/               # Redux store
│   ├── 📁 types/               # TypeScript definitions
│   └── 📁 utils/               # Utility functions
├── 📁 AuthApi/                 # Authentication API (.NET)
├── 📁 AppointmentApi/          # Appointment API (.NET)
└── 📁 public/                  # Static assets
```

## 🧪 Testing & Quality Assurance

### Frontend Testing
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Backend Testing
```bash
# API tests
dotnet test

# Coverage report
dotnet test --collect:"XPlat Code Coverage"
```

### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **SonarQube**: Code quality analysis
- **Husky**: Pre-commit hooks

## 🚀 Deployment & Production

### Build Production
```bash
# Frontend build
npm run build

# Backend publish
dotnet publish -c Release
```

### Docker Support
```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS backend
```

### CI/CD Pipeline
- **GitHub Actions**: Automated testing và deployment
- **Railway**: Automatic deployment từ Git
- **Environment Management**: Dev/Staging/Production

## 📈 Performance & Monitoring

### Frontend Optimization
- **Code Splitting**: Lazy loading components
- **Bundle Analysis**: Webpack bundle analyzer
- **Image Optimization**: WebP format support
- **Caching Strategy**: Service worker caching

### Backend Performance
- **Connection Pooling**: Database connection optimization
- **Response Caching**: API response caching
- **Compression**: Gzip compression
- **Rate Limiting**: API rate limiting

## 🤝 Đóng Góp & Development

### Git Workflow
```bash
# 1. Fork repository
git clone [your-fork-url]

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes and commit
git commit -m "feat: add amazing feature"

# 4. Push and create PR
git push origin feature/amazing-feature
```

### Commit Convention
```
feat: new feature
fix: bug fix
docs: documentation
style: formatting
refactor: code refactoring
test: adding tests
chore: maintenance
```

## 📊 API Endpoints

### AuthApi (Port 5000)
```
POST   /api/auth/login           # Đăng nhập
POST   /api/auth/register        # Đăng ký
GET    /api/users               # Danh sách người dùng
GET    /api/consultations       # Tư vấn
GET    /api/doctors/dropdown    # Danh sách bác sĩ
```

### AppointmentApi (Port 5002)
```
GET    /api/appointments        # Danh sách lịch hẹn
POST   /api/appointments        # Tạo lịch hẹn mới
PUT    /api/appointments/{id}   # Cập nhật lịch hẹn
DELETE /api/appointments/{id}   # Xóa lịch hẹn
```

## 🎯 Roadmap & Future Features

### Phase 1 (Completed ✅)
- [x] User Authentication & Authorization
- [x] Appointment Booking System
- [x] Online Consultation Platform
- [x] Blog Management System
- [x] Real Database Integration

### Phase 2 (In Progress 🚧)
- [ ] ARV Treatment Management
- [ ] Medication Reminder System
- [ ] Advanced Analytics Dashboard
- [ ] Mobile App Development

### Phase 3 (Planned 📋)
- [ ] Telemedicine Video Calls
- [ ] AI-powered Health Insights
- [ ] Multi-language Support
- [ ] Integration with Hospital Systems

## 📄 License & Credits

**License**: Educational Project - SWP391 Course
**Developed by**: HIV Treatment System Team
**Version**: 1.0.0
**Last Updated**: July 2025

### Contributors
- **Frontend Development**: React/TypeScript Team
- **Backend Development**: .NET Core Team
- **Database Design**: PostgreSQL Team
- **UI/UX Design**: Material-UI Team

---

<div align="center">

**🏥 HIV Treatment and Medical Services System**

*Cải thiện chất lượng chăm sóc sức khỏe HIV/AIDS thông qua công nghệ*

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/your-repo)
[![Documentation](https://img.shields.io/badge/Docs-Wiki-blue?style=for-the-badge&logo=gitbook)](https://github.com/your-repo/wiki)
[![License](https://img.shields.io/badge/License-Educational-green?style=for-the-badge)](LICENSE)

**Made with ❤️ for HIV/AIDS healthcare improvement**

</div>