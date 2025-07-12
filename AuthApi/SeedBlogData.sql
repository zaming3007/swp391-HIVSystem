-- Insert sample blog posts
INSERT INTO "BlogPosts" (
    "id", 
    "title", 
    "content", 
    "summary", 
    "author_id", 
    "author_name", 
    "status", 
    "view_count", 
    "comment_count", 
    "created_at", 
    "published_at"
) VALUES 
(
    'blog-1', 
    'Hiểu về HIV và AIDS: Những điều cơ bản cần biết',
    'HIV (Human Immunodeficiency Virus) là virus gây suy giảm miễn dịch ở người. Khi không được điều trị, HIV có thể dẫn đến AIDS (Acquired Immunodeficiency Syndrome).

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

Hiện tại, HIV có thể được điều trị hiệu quả bằng thuốc ARV (Antiretroviral). Với điều trị đúng cách, người nhiễm HIV có thể sống khỏe mạnh và không lây truyền virus cho người khác.',
    'Tìm hiểu những kiến thức cơ bản về HIV/AIDS, cách lây truyền, phòng ngừa và điều trị hiệu quả.',
    'staff-1',
    'Bác sĩ Nguyễn Văn A',
    1,
    0,
    0,
    NOW(),
    NOW()
),
(
    'blog-2',
    'Tầm quan trọng của việc tuân thủ điều trị ARV',
    'Tuân thủ điều trị ARV (Antiretroviral) là yếu tố quan trọng nhất trong việc điều trị HIV thành công.

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
- Cần thay đổi lịch uống thuốc',
    'Hướng dẫn chi tiết về tầm quan trọng và cách tuân thủ điều trị ARV hiệu quả cho người nhiễm HIV.',
    'staff-1',
    'Bác sĩ Nguyễn Văn A',
    1,
    0,
    0,
    NOW(),
    NOW()
),
(
    'blog-3',
    'Dinh dưỡng và lối sống lành mạnh cho người nhiễm HIV',
    'Dinh dưỡng đóng vai trò quan trọng trong việc hỗ trợ hệ miễn dịch và cải thiện chất lượng cuộc sống của người nhiễm HIV.

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
- Tránh caffeine trước khi ngủ',
    'Hướng dẫn về chế độ dinh dưỡng và lối sống lành mạnh giúp tăng cường sức khỏe cho người nhiễm HIV.',
    'staff-1',
    'Bác sĩ Nguyễn Văn A',
    1,
    0,
    0,
    NOW(),
    NOW()
);

-- Insert sample comments
INSERT INTO "BlogComments" (
    "id",
    "blog_post_id",
    "user_id", 
    "user_name",
    "content",
    "created_at"
) VALUES 
(
    'comment-1',
    'blog-1',
    'user-1',
    'Nguyễn Thị B',
    'Cảm ơn bác sĩ đã chia sẻ những thông tin hữu ích. Bài viết rất dễ hiểu và có tính thực tiễn cao.',
    NOW()
),
(
    'comment-2', 
    'blog-1',
    'user-2',
    'Trần Văn C',
    'Tôi đã hiểu rõ hơn về HIV qua bài viết này. Hy vọng sẽ có thêm nhiều bài viết hữu ích như vậy.',
    NOW()
),
(
    'comment-3',
    'blog-2', 
    'user-3',
    'Lê Thị D',
    'Việc tuân thủ điều trị thực sự rất quan trọng. Cảm ơn bác sĩ đã nhắc nhở và hướng dẫn cụ thể.',
    NOW()
);

-- Update comment count for blog posts
UPDATE "BlogPosts" SET "comment_count" = 2 WHERE "id" = 'blog-1';
UPDATE "BlogPosts" SET "comment_count" = 1 WHERE "id" = 'blog-2';
