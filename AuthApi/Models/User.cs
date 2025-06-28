using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("users")]
    public class User
    {
        [Key]
        [Column("id")]
        public string Id { get; set; }
        
        [Required]
        [Column("first_name")]
        public string FirstName { get; set; }
        
        [Required]
        [Column("last_name")]
        public string LastName { get; set; }
        
        [Required]
        [EmailAddress]
        [Column("email")]
        public string Email { get; set; }
        
        [Required]
        [Column("password_hash")]
        public string PasswordHash { get; set; }
        
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;
        
        [Column("gender")]
        public string Gender { get; set; } = "Unspecified";
        
        [Column("date_of_birth")]
        [Required]
        public string DateOfBirth { get; set; }
        
        [Required]
        [Column("role")]
        public string Role { get; set; } = "customer";
        
        [Column("profile_image")]
        public string ProfileImage { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
        
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
} 