using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthApi.Models
{
    [Table("BlogPosts")]
    public class BlogPost
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [Column("title")]
        [Required]
        public string Title { get; set; }
        
        [Column("summary")]
        public string Summary { get; set; } = string.Empty;
        
        [Column("content")]
        [Required]
        public string Content { get; set; }
        
        [Column("cover_image")]
        public string CoverImage { get; set; } = string.Empty;
        
        [Column("published_date")]
        public DateTime? PublishedDate { get; set; }
        
        [Column("status")]
        [Required]
        public string Status { get; set; } = "draft"; // draft, published
        
        [Column("view_count")]
        public int ViewCount { get; set; } = 0;
        
        [Column("AuthorId")]
        public string AuthorId { get; set; }
        
        [ForeignKey("AuthorId")]
        public User Author { get; set; }
        
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
} 