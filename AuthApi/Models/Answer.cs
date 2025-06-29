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
        
        [Column("consultation_id")]
        [Required]
        public string ConsultationId { get; set; }
        
        [Column("responder_id")]
        [Required]
        public string ResponderId { get; set; }
        
        [Column("responder_name")]
        public string ResponderName { get; set; }
        
        [Column("content")]
        [Required]
        public string Content { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("ConsultationId")]
        public virtual Consultation Consultation { get; set; }
    }
} 