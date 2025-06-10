using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HIVSystem.Core.Entities
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Email { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [StringLength(15)]
        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        [StringLength(255)]
        public string? Address { get; set; }

        [StringLength(255)]
        public string? ProfileImage { get; set; }

        public int? RoleID { get; set; }

        public bool IsAnonymous { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public DateTime? LastLoginDate { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public DateTime? ModifiedDate { get; set; }

        // Navigation properties
        [ForeignKey("RoleID")]
        public virtual Role? Role { get; set; }

        public virtual Patient? Patient { get; set; }
        public virtual Doctor? Doctor { get; set; }
        public virtual ICollection<Appointment> CreatedAppointments { get; set; } = new List<Appointment>();
    }
} 