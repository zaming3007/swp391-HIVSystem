-- Tạo bảng BlogPosts nếu chưa tồn tại
DROP TABLE IF EXISTS "BlogPosts";

CREATE TABLE IF NOT EXISTS "BlogPosts" (
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "Title" character varying(200) NOT NULL,
    "Summary" character varying(500) NULL,
    "Content" text NOT NULL,
    "CoverImage" character varying(500) NULL,
    "PublishedDate" timestamp with time zone NULL,
    "Status" character varying(20) NOT NULL DEFAULT 'draft',
    "ViewCount" integer NOT NULL DEFAULT 0,
    "AuthorId" character varying(255) NULL,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" timestamp with time zone NULL,
    CONSTRAINT "PK_BlogPosts" PRIMARY KEY ("Id")
);

-- Tạo bảng FileUploads nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS "FileUploads" (
    "Id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "FileName" character varying(200) NOT NULL,
    "FilePath" character varying(500) NOT NULL,
    "FileType" character varying(100) NOT NULL,
    "FileSize" bigint NOT NULL,
    "EntityType" character varying(50) NULL,
    "EntityId" uuid NULL,
    "CreatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CreatedBy" uuid NULL,
    CONSTRAINT "PK_FileUploads" PRIMARY KEY ("Id")
);

-- Thêm một số bài viết mẫu
INSERT INTO "BlogPosts" 
    ("Title", "Summary", "Content", "CoverImage", "Status", "AuthorId")
VALUES
    (
        'Hiểu về HIV/AIDS: Các thông tin cơ bản', 
        'Tìm hiểu thông tin cơ bản về HIV/AIDS, cách lây truyền, phòng ngừa và điều trị.', 
        '<h2>HIV/AIDS là gì?</h2><p>HIV (Human Immunodeficiency Virus) là virus gây suy giảm miễn dịch ở người. Virus này tấn công hệ thống miễn dịch của cơ thể, đặc biệt là tế bào CD4, làm suy yếu khả năng chống lại nhiễm trùng và bệnh tật.</p><p>AIDS (Acquired Immunodeficiency Syndrome) là giai đoạn cuối cùng của nhiễm HIV khi hệ thống miễn dịch bị tổn thương nghiêm trọng, dẫn đến các bệnh nhiễm trùng cơ hội.</p><h2>Cách lây truyền</h2><p>HIV có thể lây truyền qua:</p><ul><li>Quan hệ tình dục không an toàn với người nhiễm HIV</li><li>Dùng chung kim tiêm hoặc các dụng cụ tiêm chích ma túy</li><li>Từ mẹ sang con trong quá trình mang thai, sinh nở hoặc cho con bú</li><li>Tiếp xúc với máu hoặc các dịch cơ thể chứa HIV</li></ul><h2>Phòng ngừa</h2><p>Có nhiều biện pháp phòng ngừa HIV hiệu quả:</p><ul><li>Sử dụng bao cao su khi quan hệ tình dục</li><li>Không dùng chung kim tiêm hoặc dụng cụ tiêm chích</li><li>Điều trị dự phòng trước phơi nhiễm (PrEP) cho người có nguy cơ cao</li><li>Điều trị dự phòng sau phơi nhiễm (PEP)</li><li>Điều trị ARV cho người nhiễm HIV để giảm nguy cơ lây truyền</li></ul><h2>Điều trị</h2><p>Hiện nay, HIV có thể được kiểm soát hiệu quả bằng liệu pháp thuốc kháng retrovirus (ARV). Điều trị ARV giúp người nhiễm HIV sống khỏe mạnh và giảm đáng kể khả năng lây truyền virus cho người khác.</p>', 
        '/uploads/blog/hiv-basics.jpg', 
        'published', 
        NULL
    ),
    (
        'Sống khỏe với HIV: Chế độ dinh dưỡng và luyện tập', 
        'Hướng dẫn về chế độ dinh dưỡng và luyện tập phù hợp cho người sống với HIV.', 
        '<h2>Tầm quan trọng của dinh dưỡng đối với người sống chung với HIV</h2><p>Dinh dưỡng đóng vai trò quan trọng trong việc duy trì sức khỏe và hỗ trợ hệ miễn dịch cho người sống chung với HIV. Chế độ ăn uống cân bằng giúp cơ thể chống lại nhiễm trùng, duy trì cân nặng khỏe mạnh và tăng cường hiệu quả của thuốc ARV.</p><h2>Nguyên tắc dinh dưỡng</h2><p>Người sống chung với HIV nên tuân thủ các nguyên tắc dinh dưỡng sau:</p><ul><li>Đảm bảo đủ protein từ thịt, cá, trứng, đậu và các sản phẩm từ sữa</li><li>Bổ sung nhiều trái cây và rau xanh giàu vitamin và khoáng chất</li><li>Tiêu thụ đủ carbohydrate phức hợp như gạo lứt, yến mạch, khoai lang</li><li>Hạn chế thực phẩm nhiều đường và chất béo bão hòa</li><li>Uống đủ nước (8-10 cốc mỗi ngày)</li></ul><h2>Hoạt động thể chất</h2><p>Luyện tập thể dục đều đặn mang lại nhiều lợi ích cho người sống chung với HIV:</p><ul><li>Tăng cường sức mạnh cơ bắp và xương</li><li>Cải thiện sức khỏe tim mạch</li><li>Giảm căng thẳng và cải thiện tâm trạng</li><li>Giúp duy trì cân nặng hợp lý</li></ul><p>Nên tập thể dục ít nhất 150 phút mỗi tuần, kết hợp giữa các bài tập cardio nhẹ nhàng và bài tập sức mạnh. Luôn tham khảo ý kiến bác sĩ trước khi bắt đầu chương trình tập luyện mới.</p>', 
        '/uploads/blog/healthy-living-hiv.jpg', 
        'published', 
        NULL
    ),
    (
        'Giảm kỳ thị và phân biệt đối xử với người nhiễm HIV', 
        'Hiểu về kỳ thị và phân biệt đối xử liên quan đến HIV và cách chúng ta có thể thay đổi nhận thức xã hội.', 
        '<h2>Kỳ thị HIV là gì?</h2><p>Kỳ thị HIV là thái độ tiêu cực, định kiến và phân biệt đối xử đối với người sống chung với HIV. Kỳ thị thường bắt nguồn từ nỗi sợ hãi, thiếu hiểu biết về HIV và các định kiến xã hội.</p><h2>Tác động của kỳ thị</h2><p>Kỳ thị và phân biệt đối xử có thể gây ra những hậu quả nghiêm trọng:</p><ul><li>Ngăn cản người dân đi xét nghiệm HIV</li><li>Làm giảm khả năng tiếp cận dịch vụ y tế của người nhiễm</li><li>Gây ra trầm cảm, lo âu và cô lập xã hội</li><li>Ảnh hưởng đến cơ hội việc làm, giáo dục và các quyền cơ bản</li></ul><h2>Cách giảm kỳ thị</h2><p>Mỗi người đều có thể đóng góp vào việc giảm kỳ thị HIV thông qua:</p><ul><li>Tìm hiểu và chia sẻ thông tin chính xác về HIV</li><li>Sử dụng ngôn ngữ không kỳ thị khi nói về HIV và người sống chung với HIV</li><li>Thách thức các định kiến và thông tin sai lệch</li><li>Ủng hộ các chính sách bảo vệ quyền của người sống chung với HIV</li><li>Tôn trọng quyền riêng tư và bảo mật thông tin của người nhiễm HIV</li></ul><h2>Kết luận</h2><p>Giảm kỳ thị và phân biệt đối xử là yếu tố quan trọng trong cuộc chiến chống lại HIV/AIDS. Khi mỗi người đều được tôn trọng, được tiếp cận dịch vụ y tế không kỳ thị, và được hòa nhập đầy đủ vào cộng đồng, chúng ta sẽ tiến gần hơn đến mục tiêu chấm dứt dịch HIV/AIDS.</p>', 
        '/uploads/blog/hiv-stigma.jpg', 
        'published', 
        NULL
    );

-- Thêm chỉ mục cho bảng BlogPosts
CREATE INDEX IF NOT EXISTS "IX_BlogPosts_Status" ON "BlogPosts" ("Status");
CREATE INDEX IF NOT EXISTS "IX_BlogPosts_CreatedAt" ON "BlogPosts" ("CreatedAt");
CREATE INDEX IF NOT EXISTS "IX_BlogPosts_AuthorId" ON "BlogPosts" ("AuthorId"); 