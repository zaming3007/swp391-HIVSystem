using System;

namespace AuthApi.Models
{
    public class BlogPostListItem
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
    
    public class BlogPostDetail
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
} 