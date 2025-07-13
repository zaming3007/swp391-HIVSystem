using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("PasswordResetCodes")]
    public class PasswordResetCode
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(6)]
        public string Code { get; set; } = string.Empty;

        [Required]
        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        public int AttemptCount { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Helper methods
        public bool IsExpired => DateTime.UtcNow > ExpiresAt;
        
        public bool IsValid => !IsUsed && !IsExpired && AttemptCount < 5;
    }
}
