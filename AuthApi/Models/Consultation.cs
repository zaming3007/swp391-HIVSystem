using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("Consultations")]
    public class Consultation
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("patient_id")]
        [Required]
        public string PatientId { get; set; }
        
        [Column("title")]
        [Required]
        public string Title { get; set; }
        
        [Column("question")]
        [Required]
        public string Question { get; set; }
        
        [Column("category")]
        public string Category { get; set; }
        
        [Column("status")]
        public string Status { get; set; } = "pending"; // pending, answered
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Relationship with Answers
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
} 