using System.ComponentModel.DataAnnotations;

namespace AuthApi.Models
{
    public class CreateBlogPostModel
    {
        [Required]
        public string Title { get; set; }
        
        public string Summary { get; set; }
        
        [Required]
        public string Content { get; set; }
        
        public string CoverImage { get; set; }
        
        public string Status { get; set; } = "draft"; // draft, published
    }
    
    public class UpdateBlogPostModel
    {
        [Required]
        public string Id { get; set; }
        
        [Required]
        public string Title { get; set; }
        
        public string Summary { get; set; }
        
        [Required]
        public string Content { get; set; }
        
        public string CoverImage { get; set; }
        
        public string Status { get; set; }
    }
} 