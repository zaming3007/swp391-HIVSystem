using AuthApi.Data;
using AuthApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace AuthApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SeedController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("blog-data")]
        public async Task<ActionResult> SeedBlogData()
        {
            try
            {
                // Check if data already exists
                if (_context.BlogPosts.Any())
                {
                    return Ok(new { message = "Blog data already exists", count = _context.BlogPosts.Count() });
                }

                // Create sample blog posts
                var posts = new List<BlogPost>
                {
                    new BlogPost
                    {
                        Id = "blog-1",
                        Title = "Hiểu về HIV và AIDS: Những điều cơ bản cần biết",
                        Content = @"HIV (Human Immunodeficiency Virus) là virus gây suy giảm miễn dịch ở người. Khi không được điều trị, HIV có thể dẫn đến AIDS (Acquired Immunodeficiency Syndrome).

## Cách lây truyền HIV

HIV có thể lây truyền qua:
- Quan hệ tình dục không an toàn
- Tiếp xúc với máu nhiễm HIV
- Từ mẹ sang con trong thai kỳ, sinh nở hoặc cho con bú
- Dùng chung kim tiêm

## Phòng ngừa HIV

- Sử dụng bao cao su khi quan hệ tình dục
- Không dùng chung kim tiêm
- Xét nghiệm HIV định kỳ
- Sử dụng thuốc PrEP nếu có nguy cơ cao

## Điều trị HIV

Hiện tại, HIV có thể được điều trị hiệu quả bằng thuốc ARV (Antiretroviral). Với điều trị đúng cách, người nhiễm HIV có thể sống khỏe mạnh và không lây truyền virus cho người khác.",
                        Summary = "Tìm hiểu những kiến thức cơ bản về HIV/AIDS, cách lây truyền, phòng ngừa và điều trị hiệu quả.",
                        AuthorId = "staff-1",
                        AuthorName = "Bác sĩ Nguyễn Văn A",
                        Status = BlogPostStatus.Published,
                        ViewCount = 125,
                        CommentCount = 2,
                        CreatedAt = DateTime.UtcNow.AddDays(-7),
                        PublishedAt = DateTime.UtcNow.AddDays(-7)
                    },
                    new BlogPost
                    {
                        Id = "blog-2",
                        Title = "Tầm quan trọng của việc tuân thủ điều trị ARV",
                        Content = @"Tuân thủ điều trị ARV (Antiretroviral) là yếu tố quan trọng nhất trong việc điều trị HIV thành công.

## Tại sao cần tuân thủ điều trị?

1. **Kiểm soát tải lượng virus**: Uống thuốc đều đặn giúp giảm tải lượng HIV trong máu xuống mức không phát hiện được.

2. **Ngăn ngừa kháng thuốc**: Không tuân thủ có thể dẫn đến virus kháng thuốc, làm giảm hiệu quả điều trị.

3. **Bảo vệ hệ miễn dịch**: Điều trị đúng cách giúp duy trì và phục hồi hệ miễn dịch.

## Mẹo tuân thủ điều trị

- Đặt báo thức nhắc nhở uống thuốc
- Sử dụng hộp thuốc theo ngày
- Tìm hiểu về tác dụng phụ và cách xử lý
- Thường xuyên tái khám theo lịch hẹn

## Khi nào cần liên hệ bác sĩ?

- Quên uống thuốc nhiều lần
- Xuất hiện tác dụng phụ nghiêm trọng
- Có thay đổi về sức khỏe
- Cần thay đổi lịch uống thuốc",
                        Summary = "Hướng dẫn chi tiết về tầm quan trọng và cách tuân thủ điều trị ARV hiệu quả cho người nhiễm HIV.",
                        AuthorId = "staff-1",
                        AuthorName = "Bác sĩ Nguyễn Văn A",
                        Status = BlogPostStatus.Published,
                        ViewCount = 89,
                        CommentCount = 1,
                        CreatedAt = DateTime.UtcNow.AddDays(-5),
                        PublishedAt = DateTime.UtcNow.AddDays(-5)
                    },
                    new BlogPost
                    {
                        Id = "blog-3",
                        Title = "Dinh dưỡng và lối sống lành mạnh cho người nhiễm HIV",
                        Content = @"Dinh dưỡng đóng vai trò quan trọng trong việc hỗ trợ hệ miễn dịch và cải thiện chất lượng cuộc sống của người nhiễm HIV.

## Nguyên tắc dinh dưỡng

### 1. Chế độ ăn cân bằng
- Protein: Thịt nạc, cá, trứng, đậu
- Carbohydrate: Gạo lứt, yến mạch, khoai lang
- Chất béo tốt: Dầu olive, quả bơ, các loại hạt
- Vitamin và khoáng chất: Rau xanh, trái cây

### 2. Tăng cường miễn dịch
- Vitamin C: Cam, chanh, ổi
- Vitamin D: Ánh nắng mặt trời, cá béo
- Kẽm: Thịt đỏ, hạt bí ngô
- Selenium: Hạt Brazil, cá ngừ

## Lối sống lành mạnh

### Tập thể dục
- Tập thể dục nhẹ nhàng 30 phút/ngày
- Yoga, đi bộ, bơi lội
- Tránh tập quá sức

### Quản lý stress
- Thiền định, thở sâu
- Tham gia hoạt động xã hội
- Tìm kiếm hỗ trợ tâm lý

### Giấc ngủ
- Ngủ đủ 7-8 tiếng/đêm
- Tạo môi trường ngủ thoải mái
- Tránh caffeine trước khi ngủ",
                        Summary = "Hướng dẫn về chế độ dinh dưỡng và lối sống lành mạnh giúp tăng cường sức khỏe cho người nhiễm HIV.",
                        AuthorId = "staff-1",
                        AuthorName = "Bác sĩ Nguyễn Văn A",
                        Status = BlogPostStatus.Published,
                        ViewCount = 67,
                        CommentCount = 0,
                        CreatedAt = DateTime.UtcNow.AddDays(-3),
                        PublishedAt = DateTime.UtcNow.AddDays(-3)
                    },
                    new BlogPost
                    {
                        Id = "blog-4",
                        Title = "Bản nháp: Hướng dẫn xét nghiệm HIV định kỳ",
                        Content = @"Xét nghiệm HIV định kỳ là một phần quan trọng trong việc chăm sóc sức khỏe...",
                        Summary = "Hướng dẫn về tần suất và quy trình xét nghiệm HIV định kỳ.",
                        AuthorId = "staff-1",
                        AuthorName = "Bác sĩ Nguyễn Văn A",
                        Status = BlogPostStatus.Draft,
                        ViewCount = 0,
                        CommentCount = 0,
                        CreatedAt = DateTime.UtcNow.AddDays(-1)
                    }
                };

                _context.BlogPosts.AddRange(posts);

                // Create sample comments
                var comments = new List<BlogComment>
                {
                    new BlogComment
                    {
                        Id = "comment-1",
                        BlogPostId = "blog-1",
                        UserId = "user-1",
                        UserName = "Nguyễn Thị B",
                        Content = "Cảm ơn bác sĩ đã chia sẻ những thông tin hữu ích. Bài viết rất dễ hiểu và có tính thực tiễn cao.",
                        CreatedAt = DateTime.UtcNow.AddDays(-6)
                    },
                    new BlogComment
                    {
                        Id = "comment-2",
                        BlogPostId = "blog-1",
                        UserId = "user-2",
                        UserName = "Trần Văn C",
                        Content = "Tôi đã hiểu rõ hơn về HIV qua bài viết này. Hy vọng sẽ có thêm nhiều bài viết hữu ích như vậy.",
                        CreatedAt = DateTime.UtcNow.AddDays(-5)
                    },
                    new BlogComment
                    {
                        Id = "comment-3",
                        BlogPostId = "blog-2",
                        UserId = "user-3",
                        UserName = "Lê Thị D",
                        Content = "Việc tuân thủ điều trị thực sự rất quan trọng. Cảm ơn bác sĩ đã nhắc nhở và hướng dẫn cụ thể.",
                        CreatedAt = DateTime.UtcNow.AddDays(-4)
                    }
                };

                _context.BlogComments.AddRange(comments);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Blog sample data created successfully", postsCount = posts.Count, commentsCount = comments.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error seeding blog data: {ex.Message}" });
            }
        }
    }
}
