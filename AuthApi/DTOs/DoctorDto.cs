using System.ComponentModel.DataAnnotations;

namespace AuthApi.DTOs
{
    public class DoctorDto
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public int Experience { get; set; }
        public string Bio { get; set; } = string.Empty;
        public bool Available { get; set; }
        public string ProfileImage { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class CreateDoctorDto
    {
        [Required(ErrorMessage = "Họ là bắt buộc")]
        [StringLength(50, ErrorMessage = "Họ không được vượt quá 50 ký tự")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên là bắt buộc")]
        [StringLength(50, ErrorMessage = "Tên không được vượt quá 50 ký tự")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Giới tính là bắt buộc")]
        public string Gender { get; set; } = string.Empty;

        public DateTime? DateOfBirth { get; set; }

        [Required(ErrorMessage = "Chuyên khoa là bắt buộc")]
        [StringLength(100, ErrorMessage = "Chuyên khoa không được vượt quá 100 ký tự")]
        public string Specialization { get; set; } = string.Empty;

        [Range(0, 50, ErrorMessage = "Kinh nghiệm phải từ 0 đến 50 năm")]
        public int Experience { get; set; }

        [StringLength(1000, ErrorMessage = "Tiểu sử không được vượt quá 1000 ký tự")]
        public string Bio { get; set; } = string.Empty;

        public string? ProfileImage { get; set; }
    }

    public class UpdateDoctorDto
    {
        [Required(ErrorMessage = "Họ là bắt buộc")]
        [StringLength(50, ErrorMessage = "Họ không được vượt quá 50 ký tự")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên là bắt buộc")]
        [StringLength(50, ErrorMessage = "Tên không được vượt quá 50 ký tự")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Số điện thoại là bắt buộc")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string Phone { get; set; } = string.Empty;

        [Required(ErrorMessage = "Chuyên khoa là bắt buộc")]
        [StringLength(100, ErrorMessage = "Chuyên khoa không được vượt quá 100 ký tự")]
        public string Specialization { get; set; } = string.Empty;

        [Range(0, 50, ErrorMessage = "Kinh nghiệm phải từ 0 đến 50 năm")]
        public int Experience { get; set; }

        [StringLength(1000, ErrorMessage = "Tiểu sử không được vượt quá 1000 ký tự")]
        public string Bio { get; set; } = string.Empty;

        public bool Available { get; set; } = true;

        public string? ProfileImage { get; set; }
    }
}
