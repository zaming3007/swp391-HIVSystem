using System;
using System.ComponentModel.DataAnnotations;

namespace AuthApi.Models
{
    // Request DTOs
    public class CreateBlogPostRequest
    {
        [Required]
        public string Title { get; set; }
        
        public string Summary { get; set; }
        
        [Required]
        public string Content { get; set; }
        
        public string CoverImage { get; set; }
        
        public string Status { get; set; } = "draft"; // draft, published
    }
    
    public class UpdateBlogPostRequest
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

    // Response DTOs
    public class BlogPostResponse
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Content { get; set; }
        public string CoverImage { get; set; }
        public DateTime? PublishedDate { get; set; }
        public string Status { get; set; }
        public int ViewCount { get; set; }
        public string AuthorId { get; set; }
        public string AuthorName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
    
    public class BlogPostListResponse
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string CoverImage { get; set; }
        public DateTime? PublishedDate { get; set; }
        public string Status { get; set; }
        public int ViewCount { get; set; }
        public string AuthorName { get; set; }
        public DateTime CreatedAt { get; set; }
    }
} 