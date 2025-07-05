using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("Answers")]
    public class Answer
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("consultation_id")]
        public string ConsultationId { get; set; }

        [Required]
        [Column("responder_id")]
        public string ResponderId { get; set; }

        [Required]
        [Column("responder_name")]
        public string ResponderName { get; set; }

        [Required]
        [Column("content")]
        public string Content { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("ConsultationId")]
        public virtual Consultation Consultation { get; set; }

        [ForeignKey("ResponderId")]
        public virtual User Responder { get; set; }
    }
} 