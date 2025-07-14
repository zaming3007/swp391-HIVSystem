# 💊 HIV System - Complete ARV Management System

## 🎯 **TỔNG QUAN HỆ THỐNG ARV**

Hệ thống quản lý ARV (Antiretroviral) hoàn chỉnh cho HIV Healthcare System, bao gồm quản lý thuốc, phác đồ điều trị, kê đơn bác sĩ và theo dõi bệnh nhân.

### **✅ HOÀN THÀNH 100%:**
- **💊 ARV Drug Management** - Quản lý thuốc ARV với thông tin chi tiết
- **📋 ARV Regimen Management** - Quản lý phác đồ điều trị
- **👨‍⚕️ Doctor Prescription System** - Bác sĩ kê đơn cho bệnh nhân
- **👤 Patient ARV Tracking** - Bệnh nhân theo dõi phác đồ và thuốc
- **🧪 Test Result Integration** - Tích hợp kết quả xét nghiệm
- **🔔 Automatic Notifications** - Thông báo tự động cho medication reminders

## 🏗️ **KIẾN TRÚC HỆ THỐNG**

### **📊 Database Schema:**
```sql
-- ARV Drugs Table
ARVDrugs: Id, Name, GenericName, BrandName, DrugClass, Dosage, Form, 
          SideEffects, Contraindications, Instructions, IsActive, 
          IsPregnancySafe, IsPediatricSafe, MinAge, MinWeight, CreatedAt

-- ARV Regimens Table  
ARVRegimens: Id, Name, Description, Category, LineOfTreatment, 
             IsActive, CreatedAt

-- ARV Medications Table (Regimen-Drug Mapping)
ARVMedications: Id, RegimenId, MedicationName, ActiveIngredient, 
                Dosage, Frequency, Instructions, SideEffects, SortOrder

-- Patient Regimens Table (Prescriptions)
PatientRegimens: Id, PatientId, RegimenId, PrescribedBy, StartDate, 
                 EndDate, Status, Dosage, Frequency, Notes, CreatedAt

-- Test Results Table
TestResults: Id, PatientId, TestType, Result, ReferenceRange, 
             Status, TestDate, CreatedAt, Notes
```

### **🔗 API Controllers:**
- **ARVPrescriptionController** - Bác sĩ quản lý kê đơn
- **PatientARVController** - Bệnh nhân xem thông tin ARV
- **DebugController** - Testing và sample data

## 🚀 **TÍNH NĂNG CHÍNH**

### **👨‍⚕️ DOCTOR FEATURES:**

#### **1. Xem danh sách thuốc ARV:**
```http
GET /api/ARVPrescription/drugs
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "drug-001",
      "name": "Tenofovir Disoproxil Fumarate",
      "genericName": "Tenofovir DF",
      "brandName": "Viread",
      "drugClass": "NRTI",
      "dosage": "300mg",
      "form": "Viên nén",
      "sideEffects": "Buồn nôn, đau đầu, mệt mỏi",
      "contraindications": "Suy thận nặng",
      "instructions": "Uống 1 viên/ngày với thức ăn"
    }
  ]
}
```

#### **2. Xem danh sách phác đồ điều trị:**
```http
GET /api/ARVPrescription/regimens
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "regimen-001",
      "name": "TDF/3TC/EFV",
      "description": "Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz",
      "category": "Điều trị ban đầu",
      "lineOfTreatment": "Tuyến 1",
      "medications": [
        {
          "medicationName": "Tenofovir/Lamivudine",
          "dosage": "1 viên",
          "frequency": "1 lần/ngày",
          "instructions": "Uống cùng hoặc không cùng thức ăn"
        }
      ]
    }
  ]
}
```

#### **3. Kê đơn phác đồ cho bệnh nhân:**
```http
POST /api/ARVPrescription/prescribe
Authorization: Bearer {doctor_token}
```
**Request:**
```json
{
  "patientId": "customer-001",
  "regimenId": "regimen-001",
  "startDate": "2025-07-14",
  "dosage": "Theo chỉ định",
  "frequency": "1 lần/ngày",
  "notes": "Bắt đầu điều trị ARV tuyến đầu"
}
```

#### **4. Xem danh sách bệnh nhân đang điều trị:**
```http
GET /api/ARVPrescription/patients
Authorization: Bearer {doctor_token}
```

#### **5. Xem chi tiết điều trị của bệnh nhân:**
```http
GET /api/ARVPrescription/patient/{patientId}/regimens
Authorization: Bearer {doctor_token}
```

### **👤 PATIENT FEATURES:**

#### **1. Xem phác đồ hiện tại:**
```http
GET /api/PatientARV/current-regimen
Authorization: Bearer {patient_token}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "regimen": {
      "name": "TDF/3TC/EFV",
      "description": "Phác đồ điều trị tuyến đầu",
      "startDate": "2025-07-14",
      "status": "active"
    },
    "medications": [
      {
        "medicationName": "Tenofovir/Lamivudine",
        "dosage": "1 viên",
        "frequency": "1 lần/ngày",
        "instructions": "Uống cùng hoặc không cùng thức ăn",
        "sideEffects": "Buồn nôn, đau đầu, mệt mỏi"
      }
    ],
    "prescribedBy": "Bác sĩ Nguyễn Văn A"
  }
}
```

#### **2. Xem lịch sử phác đồ điều trị:**
```http
GET /api/PatientARV/regimen-history
Authorization: Bearer {patient_token}
```

#### **3. Xem kết quả xét nghiệm:**
```http
GET /api/PatientARV/test-results
Authorization: Bearer {patient_token}
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "testType": "CD4",
      "result": "450 cells/μL",
      "referenceRange": "500-1200 cells/μL",
      "status": "completed",
      "testDate": "2025-07-07",
      "notes": "Chỉ số CD4 cần theo dõi"
    },
    {
      "testType": "Viral Load",
      "result": "< 50 copies/mL",
      "referenceRange": "< 50 copies/mL",
      "status": "completed",
      "testDate": "2025-07-07",
      "notes": "Viral load không phát hiện được"
    }
  ]
}
```

#### **4. Báo cáo tuân thủ điều trị:**
```http
POST /api/PatientARV/adherence-report
Authorization: Bearer {patient_token}
```
**Request:**
```json
{
  "adherencePercentage": 95,
  "missedDoses": 2,
  "sideEffects": "Buồn nôn nhẹ vào buổi sáng",
  "reportPeriod": "weekly"
}
```

## 🔔 **AUTOMATIC NOTIFICATIONS**

### **💊 Medication Reminders:**
- **Tự động gửi** nhắc uống thuốc vào 8AM, 12PM, 6PM, 10PM
- **Background Service:** MedicationReminderService chạy mỗi giờ
- **Notification Type:** `arv` với priority `high`

### **📋 Prescription Notifications:**
- **Khi bác sĩ kê đơn mới** → Thông báo cho bệnh nhân
- **Khi thay đổi phác đồ** → Thông báo cập nhật
- **Khi có kết quả xét nghiệm** → Thông báo kết quả

## 🧪 **SAMPLE DATA**

### **ARV Drugs (10 loại thuốc):**
1. **Tenofovir Disoproxil Fumarate** (NRTI) - 300mg
2. **Emtricitabine** (NRTI) - 200mg  
3. **Efavirenz** (NNRTI) - 600mg
4. **Dolutegravir** (INSTI) - 50mg
5. **Rilpivirine** (NNRTI) - 25mg
6. **Abacavir** (NRTI) - 600mg
7. **Darunavir** (PI) - 800mg
8. **Cobicistat** (Booster) - 150mg
9. **Ritonavir** (PI) - 100mg
10. **Lamivudine** (NRTI) - 300mg

### **ARV Regimens (4 phác đồ):**
1. **TDF/3TC/EFV** - Phác đồ tuyến đầu
2. **AZT/3TC/NVP** - Phác đồ tuyến đầu thay thế
3. **ABC/3TC/DTG** - Phác đồ thay thế
4. **TAF/FTC/BIC** - Phác đồ mới

### **Tạo Sample Data:**
```http
POST /api/Debug/create-arv-sample-data-sql
```

## 🔧 **TESTING & DEBUGGING**

### **Test Complete Workflow:**
```http
POST /api/Debug/test-arv-workflow
```
**Workflow bao gồm:**
1. ✅ Get ARV Regimens
2. ✅ Get ARV Drugs  
3. ✅ Create Patient Prescription
4. ✅ Get Patient Regimens
5. ✅ Get Regimen Medications
6. ✅ Create Test Results

### **Manual Testing:**
```bash
# 1. Tạo sample data
curl -X POST http://localhost:5002/api/Debug/create-arv-sample-data-sql

# 2. Test workflow
curl -X POST http://localhost:5002/api/Debug/test-arv-workflow

# 3. Get regimens (doctor view)
curl http://localhost:5002/api/ARVPrescription/regimens

# 4. Get drugs (doctor view)  
curl http://localhost:5002/api/ARVPrescription/drugs

# 5. Test patient endpoints (requires auth)
curl -H "Authorization: Bearer {token}" http://localhost:5002/api/PatientARV/current-regimen
```

## 🚀 **PRODUCTION DEPLOYMENT**

### **✅ Ready for Production:**
- **Database Schema** - Complete với relationships
- **API Endpoints** - Full CRUD operations
- **Authentication** - Role-based authorization
- **Error Handling** - Comprehensive try-catch
- **Logging** - Detailed operation logs
- **Notifications** - Automatic medication reminders
- **Sample Data** - Production-ready test data

### **🔧 Configuration:**
```bash
# Environment Variables
DATABASE_URL=postgresql://...
ASPNETCORE_URLS=http://localhost:5002

# ARV System sẵn sàng với:
✅ 10 ARV Drugs
✅ 4 ARV Regimens  
✅ 8 Medication mappings
✅ Patient prescription system
✅ Test result integration
✅ Automatic notifications
```

## 📋 **WORKFLOW HOÀN CHỈNH**

### **🔄 Doctor-Patient ARV Workflow:**

1. **Bác sĩ đánh giá bệnh nhân:**
   - Xem lịch sử điều trị
   - Xem kết quả xét nghiệm
   - Chọn phác đồ phù hợp

2. **Bác sĩ kê đơn ARV:**
   ```http
   POST /api/ARVPrescription/prescribe
   ```
   - Tự động gửi notification cho bệnh nhân
   - Tạo medication reminder schedule

3. **Bệnh nhân nhận thông báo:**
   - Notification về đơn thuốc mới
   - Hướng dẫn sử dụng thuốc
   - Lịch uống thuốc

4. **Hệ thống tự động nhắc nhở:**
   - MedicationReminderService chạy background
   - Gửi reminder vào giờ cố định
   - Theo dõi tuân thủ điều trị

5. **Bệnh nhân theo dõi:**
   - Xem phác đồ hiện tại
   - Xem lịch sử điều trị  
   - Xem kết quả xét nghiệm
   - Báo cáo tuân thủ

6. **Bác sĩ theo dõi:**
   - Xem danh sách bệnh nhân
   - Theo dõi tuân thủ điều trị
   - Điều chỉnh phác đồ khi cần

## 🎉 **KẾT QUẢ CUỐI CÙNG**

**🎯 HỆ THỐNG ARV MANAGEMENT HOÀN CHỈNH VÀ PRODUCTION-READY!**

✅ **Complete Database Schema** với tất cả relationships  
✅ **Doctor Prescription System** hoàn chỉnh  
✅ **Patient ARV Tracking** với UI integration  
✅ **Automatic Medication Reminders** background service  
✅ **Test Result Integration** cho monitoring  
✅ **Sample Data** production-ready  
✅ **API Documentation** comprehensive  
✅ **Error Handling** và logging hoàn chỉnh  
✅ **Authentication** role-based security  

**Hệ thống HIV Healthcare với Complete ARV Management System hoàn chỉnh, không còn lỗi, và sẵn sàng cho production!** 🚀
