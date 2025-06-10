using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVSystem.Core.Entities
{
    public class DoctorSchedule
    {
        [Key]
        public int ScheduleID { get; set; }

        public int? DoctorID { get; set; }

        public int? DayOfWeek { get; set; } // 1-7 tương ứng với Thứ 2 - Chủ nhật

        public TimeSpan? StartTime { get; set; }

        public TimeSpan? EndTime { get; set; }

        public int SlotDuration { get; set; } = 30; // Thời gian mỗi lượt khám (phút)

        public int? MaxPatients { get; set; } // Số bệnh nhân tối đa trong ngày

        public bool IsAvailable { get; set; } = true;

        [StringLength(255)]
        public string? Notes { get; set; }

        // Navigation properties
        [ForeignKey("DoctorID")]
        public virtual Doctor? Doctor { get; set; }
    }
} 