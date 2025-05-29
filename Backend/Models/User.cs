using System;
using System.ComponentModel.DataAnnotations;

namespace HIVHealthcareSystem.Models
{
    public class User
    {
        public int UserID { get; set; }
        
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }
        
        [Required(ErrorMessage = "Password is required")]
        public string PasswordHash { get; set; }
        
        public string Email { get; set; }
        
        [Required(ErrorMessage = "Full name is required")]
        public string FullName { get; set; }
        
        public string PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string ProfileImage { get; set; }
        public int RoleID { get; set; }
        public bool IsAnonymous { get; set; }
        public bool IsActive { get; set; }
        public DateTime? LastLoginDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
} 