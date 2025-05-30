using System.ComponentModel.DataAnnotations;

namespace HIVHealthcareSystem.Models
{
    public class ProfileViewModel
    {
        public int UserID { get; set; }

        [Required(ErrorMessage = "Họ tên là bắt buộc")]
        [StringLength(100, ErrorMessage = "Họ tên không được quá 100 ký tự")]
        [Display(Name = "Họ và tên")]
        public string FullName { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        [Display(Name = "Số điện thoại")]
        public string? PhoneNumber { get; set; }

        [DataType(DataType.Date)]
        [Display(Name = "Ngày sinh")]
        public DateTime? DateOfBirth { get; set; }

        [Display(Name = "Giới tính")]
        public string? Gender { get; set; }

        [StringLength(255, ErrorMessage = "Địa chỉ không được quá 255 ký tự")]
        [Display(Name = "Địa chỉ")]
        public string? Address { get; set; }

        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;

        [Display(Name = "Tên đăng nhập")]
        public string Username { get; set; } = string.Empty;
    }
} 