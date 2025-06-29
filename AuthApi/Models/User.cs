using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("first_name")]
        [Required]
        public string FirstName { get; set; }
        
        [Column("last_name")]
        [Required]
        public string LastName { get; set; }
        
        [Column("email")]
        [Required]
        public string Email { get; set; }
        
        [Column("password_hash")]
        [Required]
        public string PasswordHash { get; set; }
        
        [Column("phone")]
        public string Phone { get; set; }
        
        [Column("gender")]
        public string Gender { get; set; }
        
        [Column("date_of_birth")]
        public string DateOfBirth { get; set; }
        
        [Column("role")]
        public string Role { get; set; } = "customer";
        
        [Column("profile_image")]
        public string ProfileImage { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
        
        [NotMapped]
        public string FullName => $"{FirstName} {LastName}";
    }
} 