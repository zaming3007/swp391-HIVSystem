using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AuthApi.Models
{
    [Table("BlogPosts")]
    public class BlogPost
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("title")]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [Column("content")]
        public string Content { get; set; } = string.Empty;

        [Column("summary")]
        [MaxLength(1000)]
        public string Summary { get; set; } = string.Empty;

        [Required]
        [Column("author_id")]
        public string AuthorId { get; set; } = string.Empty;

        [Column("author_name")]
        [MaxLength(200)]
        public string AuthorName { get; set; } = string.Empty;

        [Column("status")]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public BlogPostStatus Status { get; set; } = BlogPostStatus.Draft;

        [Column("view_count")]
        public int ViewCount { get; set; } = 0;

        [Column("comment_count")]
        public int CommentCount { get; set; } = 0;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("published_at")]
        public DateTime? PublishedAt { get; set; }

        // Navigation properties
        [ForeignKey("AuthorId")]
        public virtual User? Author { get; set; }

        public virtual ICollection<BlogComment> Comments { get; set; } = new List<BlogComment>();
    }

    [Table("BlogComments")]
    public class BlogComment
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("blog_post_id")]
        public string BlogPostId { get; set; } = string.Empty;

        [Required]
        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        [Column("user_name")]
        [MaxLength(200)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [Column("content")]
        [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("BlogPostId")]
        public virtual BlogPost? BlogPost { get; set; }

        [ForeignKey("UserId")]
        public virtual User? User { get; set; }
    }

    public enum BlogPostStatus
    {
        Draft = 0,
        Published = 1
    }

    // DTOs for API requests/responses
    public class BlogPostCreateDto
    {
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Summary { get; set; } = string.Empty;

        public BlogPostStatus Status { get; set; } = BlogPostStatus.Draft;
    }

    public class BlogPostUpdateDto
    {
        [Required]
        [MaxLength(500)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Summary { get; set; } = string.Empty;

        public BlogPostStatus Status { get; set; }
    }

    public class BlogCommentCreateDto
    {
        [Required]
        [MaxLength(2000)]
        public string Content { get; set; } = string.Empty;
    }

    public class BlogPostDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string AuthorId { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public BlogPostStatus Status { get; set; }
        public int ViewCount { get; set; }
        public int CommentCount { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
    }

    public class BlogCommentDto
    {
        public string Id { get; set; } = string.Empty;
        public string BlogPostId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
