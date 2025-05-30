using System.ComponentModel.DataAnnotations;

namespace HIVHealthcareSystem.Models
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Username là bắt buộc")]
        [StringLength(50, ErrorMessage = "Username không được quá 50 ký tự")]
        [Display(Name = "Tên đăng nhập")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password là bắt buộc")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password phải từ 6-100 ký tự")]
        [DataType(DataType.Password)]
        [Display(Name = "Mật khẩu")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Xác nhận password là bắt buộc")]
        [DataType(DataType.Password)]
        [Display(Name = "Xác nhận mật khẩu")]
        [Compare("Password", ErrorMessage = "Mật khẩu xác nhận không khớp")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        [Display(Name = "Email")]
        public string Email { get; set; } = string.Empty;

        // Các trường này sẽ được đặt giá trị mặc định trong controller
        public string FullName { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public int RoleID { get; set; } = 3; // Mặc định là khách hàng (role ID = 3)
        public bool IsAnonymous { get; set; } = false;
    }

    public class RoleOption
    {
        public int Value { get; set; }
        public string Text { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
} 