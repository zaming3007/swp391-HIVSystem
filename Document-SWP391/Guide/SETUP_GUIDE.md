# 🚀 HƯỚNG DẪN SETUP DATABASE DỄ DÀNG NHẤT

## ⚡ Setup nhanh trong 3 bước:

### Bước 1: Mở SQL Server Management Studio (SSMS)
- Tải SSMS miễn phí từ Microsoft nếu chưa có
- Kết nối với server name: `.\SQLEXPRESS` hoặc `(local)`
- Dùng Windows Authentication (không cần password)

### Bước 2: Chạy script tự động
1. Trong SSMS, click **New Query**
2. Copy toàn bộ nội dung file `CreateDatabase.sql` 
3. Paste vào query window
4. Click **Execute** (F5)
5. ✅ Xong! Database và users test đã được tạo

### Bước 3: Test ứng dụng
```bash
cd swp391-HIVSystem\Backend\HIVSystem.Web
dotnet run
```

🌐 Mở trình duyệt:
- **Homepage:** http://localhost:5072
- **Test Database:** http://localhost:5072/Test/Database  
- **Login:** http://localhost:5072/Account/Login

## 🔑 Test Accounts đã tạo sẵn:
- **Admin:** `admin` / `admin123`
- **Doctor:** `doctor` / `doctor123`
- **Patient:** `patient` / `patient123`

## 🛠️ Nếu gặp lỗi:

### Lỗi kết nối database:
- Kiểm tra SQL Server đang chạy: Services → SQL Server (SQLEXPRESS)
- Thử connection string khác trong appsettings.json:
  ```json
  "Server=.;Database=HIVHealthcareSystem;Trusted_Connection=True;TrustServerCertificate=True"
  ```

### Không tìm thấy SQLEXPRESS:
- Cài SQL Server Express miễn phí từ Microsoft
- Hoặc dùng SQL Server Developer Edition
- Hoặc dùng LocalDB: `Server=(localdb)\\MSSQLLocalDB`

### Visual Studio không thể chạy:
```bash
# Restore packages
dotnet restore

# Build project  
dotnet build

# Run application
dotnet run
```

## 🎯 Luồng test hoàn chỉnh:
1. ✅ Chạy script SQL tạo database
2. ✅ Chạy ứng dụng: `dotnet run`
3. ✅ Mở http://localhost:5072/Test/Database
4. ✅ Kiểm tra kết nối thành công
5. ✅ Login với admin/admin123
6. ✅ Thành công! 🎉

---
**📝 Ghi chú:** Cách này dùng Windows Authentication nên không cần setup password, đơn giản nhất! 