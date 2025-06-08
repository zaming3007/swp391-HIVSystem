using System;
using System.Collections.Generic;
using System.Linq;

namespace HIVSystem.Web.Services
{
    public class MockMedicalDataService
    {
        public static MedicalRecordsDto GetUserMedicalRecords(int userId)
        {
            // Generate consistent data based on userId
            var random = new Random(userId);
            var baseDate = DateTime.Now.AddMonths(-6);
            
            var cd4Results = new List<TestResultDto>();
            var viralLoadResults = new List<TestResultDto>();
            
            // Generate 6 months of test data (monthly)
            for (int i = 0; i < 6; i++)
            {
                var testDate = baseDate.AddMonths(i);
                
                // CD4 Count trend (improvement over time)
                var cd4Value = 200 + (i * 30) + random.Next(-20, 40);
                cd4Results.Add(new TestResultDto
                {
                    TestId = $"CD4_{userId}_{i + 1:D3}",
                    TestType = "CD4_COUNT",
                    Date = testDate,
                    Value = cd4Value,
                    Unit = "cells/μL",
                    NormalRange = "500-1200",
                    Status = cd4Value < 350 ? "Low" : cd4Value < 500 ? "Below Normal" : "Normal",
                    Notes = cd4Value < 350 ? "Cần theo dõi chặt chẽ" : "Ổn định"
                });
                
                // Viral Load trend (decreasing over time with treatment)
                var vlValue = Math.Max(50, 10000 - (i * 1500) + random.Next(-500, 1000));
                viralLoadResults.Add(new TestResultDto
                {
                    TestId = $"VL_{userId}_{i + 1:D3}",
                    TestType = "VIRAL_LOAD",
                    Date = testDate,
                    Value = vlValue,
                    Unit = "copies/mL",
                    NormalRange = "<50",
                    Status = vlValue < 50 ? "Undetectable" : vlValue < 1000 ? "Low" : "Detectable",
                    Notes = vlValue < 50 ? "Virus không phát hiện được" : "Đang điều trị"
                });
            }
            
            return new MedicalRecordsDto
            {
                UserId = userId,
                PatientId = $"HIV{userId:D3}",
                CD4Results = cd4Results.OrderByDescending(x => x.Date).ToList(),
                ViralLoadResults = viralLoadResults.OrderByDescending(x => x.Date).ToList(),
                ARVRegimen = new ARVRegimenDto
                {
                    CurrentRegimen = "TDF + 3TC + EFV",
                    StartDate = baseDate.AddMonths(-2),
                    PrescribedBy = "BS. Nguyễn Văn An",
                    NextAppointment = DateTime.Now.AddDays(30),
                    Adherence = random.Next(85, 100)
                },
                LastUpdated = DateTime.Now
            };
        }
        
        public static List<MedicalHistoryDto> GetUserMedicalHistory(int userId)
        {
            var random = new Random(userId);
            var history = new List<MedicalHistoryDto>();
            var baseDate = DateTime.Now.AddMonths(-8);
            
            var visitTypes = new[] { "Khám định kỳ", "Tái khám", "Khám cấp cứu", "Tư vấn điều trị" };
            var doctors = new[] { "BS. Nguyễn Văn An", "BS. Trần Thị Bình", "BS. Lê Văn Cường" };
            
            for (int i = 0; i < 8; i++)
            {
                var visitDate = baseDate.AddMonths(i).AddDays(random.Next(1, 28));
                history.Add(new MedicalHistoryDto
                {
                    VisitId = $"VISIT_{userId}_{i + 1:D3}",
                    Date = visitDate,
                    VisitType = visitTypes[random.Next(visitTypes.Length)],
                    Doctor = doctors[random.Next(doctors.Length)],
                    Facility = "Bệnh viện Nhiệt đới Trung ương",
                    Diagnosis = "HIV/AIDS - Điều trị ARV",
                    Treatment = "Tiếp tục phác đồ ARV, tư vấn tuân thủ điều trị",
                    Notes = $"Tình trạng bệnh nhân ổn định. CD4: {200 + i * 30}. Viral Load: {Math.Max(50, 10000 - i * 1200)}",
                    Status = "Completed"
                });
            }
            
            return history.OrderByDescending(x => x.Date).ToList();
        }
        
        public static List<NotificationDto> GetUserNotifications(int userId)
        {
            var notifications = new List<NotificationDto>();
            var now = DateTime.Now;
            
            // Recent test results notification
            notifications.Add(new NotificationDto
            {
                Id = $"notif_{userId}_001",
                Type = "TEST_RESULT",
                Title = "Có kết quả xét nghiệm mới",
                Message = "Kết quả CD4 và Viral Load tháng này đã có. Click để xem chi tiết.",
                Timestamp = now.AddHours(-2),
                IsRead = false,
                Priority = "high",
                Icon = "fas fa-flask",
                ActionUrl = "/Home/Index?tab=medical-records"
            });
            
            // Appointment reminder
            notifications.Add(new NotificationDto
            {
                Id = $"notif_{userId}_002", 
                Type = "APPOINTMENT",
                Title = "Lịch hẹn sắp tới",
                Message = "Bạn có lịch tái khám vào ngày 15/02. Nhớ mang theo thẻ bảo hiểm.",
                Timestamp = now.AddDays(-1),
                IsRead = false,
                Priority = "medium",
                Icon = "fas fa-calendar-check",
                ActionUrl = "/Home/AppointmentBooking"
            });
            
            // Profile update reminder
            notifications.Add(new NotificationDto
            {
                Id = $"notif_{userId}_003",
                Type = "PROFILE_UPDATE",
                Title = "Cần cập nhật thông tin",
                Message = "Vui lòng cập nhật thông tin liên lạc và địa chỉ hiện tại.",
                Timestamp = now.AddDays(-3),
                IsRead = true,
                Priority = "low", 
                Icon = "fas fa-user-edit",
                ActionUrl = "/Home/Index?tab=profile"
            });
            
            return notifications.OrderByDescending(x => x.Timestamp).ToList();
        }
    }
    
    // DTOs
    public class MedicalRecordsDto
    {
        public int UserId { get; set; }
        public string PatientId { get; set; } = string.Empty;
        public List<TestResultDto> CD4Results { get; set; } = new();
        public List<TestResultDto> ViralLoadResults { get; set; } = new();
        public ARVRegimenDto ARVRegimen { get; set; } = new();
        public DateTime LastUpdated { get; set; }
    }
    
    public class TestResultDto
    {
        public string TestId { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public double Value { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string NormalRange { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
    }
    
    public class ARVRegimenDto
    {
        public string CurrentRegimen { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public string PrescribedBy { get; set; } = string.Empty;
        public DateTime NextAppointment { get; set; }
        public int Adherence { get; set; }
    }
    
    public class MedicalHistoryDto
    {
        public string VisitId { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string VisitType { get; set; } = string.Empty;
        public string Doctor { get; set; } = string.Empty;
        public string Facility { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
        public string Treatment { get; set; } = string.Empty;
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
    
    public class NotificationDto
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string ActionUrl { get; set; } = string.Empty;
    }
} 