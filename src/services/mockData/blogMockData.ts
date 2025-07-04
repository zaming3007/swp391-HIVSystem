import { BlogPost, BlogComment } from '../../types/blog';
import { v4 as uuidv4 } from 'uuid';

// Dữ liệu mẫu cho các bài viết blog
export const MOCK_BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: 'Sống khỏe mạnh với HIV: Những điều cần biết',
        content: `# Sống khỏe mạnh với HIV: Những điều cần biết

HIV không còn là bản án tử hình như trước đây. Với sự phát triển của y học hiện đại, người sống chung với HIV có thể có cuộc sống khỏe mạnh và bình thường nếu tuân thủ điều trị.

## Tuân thủ điều trị ARV
Điều quan trọng nhất đối với người sống chung với HIV là tuân thủ điều trị thuốc kháng virus (ARV).

## Chế độ dinh dưỡng hợp lý
Một chế độ ăn uống cân bằng, giàu dinh dưỡng sẽ giúp tăng cường hệ miễn dịch.

## Tập thể dục đều đặn
Hoạt động thể chất thường xuyên giúp tăng cường sức khỏe tim mạch, cải thiện tâm trạng và giảm stress.`,
        publishedDate: '2023-05-15T08:00:00Z',
        status: 'published',
        viewCount: 1250,
        commentCount: 8
    },
    {
        id: '2',
        title: 'Hiểu đúng về lây nhiễm HIV và cách phòng tránh',
        content: `# Hiểu đúng về lây nhiễm HIV và cách phòng tránh

Hiểu biết đúng về cách lây truyền HIV là bước đầu tiên trong việc phòng ngừa lây nhiễm.

## Các con đường lây truyền HIV
HIV chỉ lây truyền qua một số con đường cụ thể:
1. Quan hệ tình dục không an toàn
2. Tiếp xúc với máu nhiễm HIV
3. Từ mẹ sang con

## Những cách KHÔNG lây truyền HIV
HIV KHÔNG lây truyền qua tiếp xúc thông thường như bắt tay, ôm, dùng chung bát đĩa, ho, hắt hơi, muỗi đốt.`,
        publishedDate: '2023-06-22T10:30:00Z',
        status: 'published',
        viewCount: 980,
        commentCount: 5
    },
    {
        id: '3',
        title: 'Chia sẻ kinh nghiệm: Hành trình 10 năm sống chung với HIV',
        content: `# Chia sẻ kinh nghiệm: Hành trình 10 năm sống chung với HIV

## Bắt đầu hành trình
Tôi còn nhớ như in cảm giác 10 năm trước khi nhận kết quả xét nghiệm dương tính.

## Những thách thức ban đầu
Thời gian đầu là khoảng thời gian khó khăn nhất. Tôi phải đối mặt với sự kỳ thị từ chính bản thân mình.

## Bước ngoặt: Điều trị ARV
Quyết định tuân thủ điều trị ARV là bước ngoặt quan trọng nhất.`,
        publishedDate: '2023-07-10T14:15:00Z',
        status: 'published',
        viewCount: 1560,
        commentCount: 12
    },
    {
        id: '4',
        title: 'Giảm kỳ thị và phân biệt đối xử với người nhiễm HIV',
        content: `# Giảm kỳ thị và phân biệt đối xử với người nhiễm HIV

Kỳ thị và phân biệt đối xử là một trong những rào cản lớn nhất đối với việc phòng chống HIV/AIDS.

## Hiểu về kỳ thị và phân biệt đối xử
**Kỳ thị** là thái độ tiêu cực, định kiến hoặc niềm tin sai lệch về HIV/AIDS và người nhiễm HIV.
**Phân biệt đối xử** là hành động đối xử bất công dựa trên tình trạng HIV thực tế hoặc nhận thức.`,
        publishedDate: '2023-08-05T09:45:00Z',
        status: 'published',
        viewCount: 870,
        commentCount: 7
    },
    {
        id: '5',
        title: 'Tầm quan trọng của xét nghiệm HIV định kỳ',
        content: `# Tầm quan trọng của xét nghiệm HIV định kỳ

Xét nghiệm HIV định kỳ là một trong những công cụ quan trọng nhất trong phòng chống HIV/AIDS.

## Tại sao nên xét nghiệm HIV định kỳ?
### Phát hiện sớm = Điều trị sớm
Phát hiện HIV càng sớm, việc điều trị càng hiệu quả.

### Ngăn ngừa lây truyền
Biết tình trạng HIV của mình giúp bạn có những biện pháp phòng ngừa lây truyền cho người khác.`,
        publishedDate: '2023-09-12T11:20:00Z',
        status: 'draft',
        viewCount: 0,
        commentCount: 0
    }
];

// Dữ liệu mẫu cho các bình luận
export const MOCK_BLOG_COMMENTS: BlogComment[] = [
    {
        id: '1',
        postId: '1',
        userName: 'Nguyễn Văn A',
        content: 'Bài viết rất bổ ích, tôi đã học được nhiều điều mới về cách chăm sóc sức khỏe khi sống chung với HIV.',
        createdAt: '2023-05-16T10:30:00Z'
    },
    {
        id: '2',
        postId: '1',
        userName: 'Trần Thị B',
        content: 'Tôi đã áp dụng chế độ dinh dưỡng được đề cập trong bài và thấy sức khỏe cải thiện rõ rệt.',
        createdAt: '2023-05-17T14:45:00Z'
    },
    {
        id: '3',
        postId: '2',
        userName: 'Lê Văn C',
        content: 'Thông tin về các cách không lây truyền HIV rất hữu ích, giúp giảm kỳ thị trong cộng đồng.',
        createdAt: '2023-06-23T09:15:00Z'
    },
    {
        id: '4',
        postId: '3',
        userName: 'Phạm Thị D',
        content: 'Câu chuyện của bạn thật truyền cảm hứng. Cảm ơn vì đã chia sẻ.',
        createdAt: '2023-07-11T16:20:00Z'
    },
    {
        id: '5',
        postId: '4',
        userName: 'Hoàng Văn E',
        content: 'Giáo dục là chìa khóa để giảm kỳ thị. Cần có thêm nhiều bài viết như thế này.',
        createdAt: '2023-08-06T08:10:00Z'
    }
];

// Hàm lấy tất cả bài viết đã xuất bản
export const getAllPublishedPosts = () => {
    return MOCK_BLOG_POSTS.filter(post => post.status === 'published');
};

// Hàm lấy chi tiết một bài viết theo id
export const getPostById = (id: string) => {
    return MOCK_BLOG_POSTS.find(post => post.id === id);
};

// Hàm lấy các bình luận của một bài viết
export const getCommentsByPostId = (postId: string) => {
    return MOCK_BLOG_COMMENTS.filter(comment => comment.postId === postId);
};

// Hàm tìm kiếm bài viết
export const searchPosts = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return MOCK_BLOG_POSTS.filter(
        post =>
            post.status === 'published' &&
            (post.title.toLowerCase().includes(lowerCaseQuery) ||
                post.content.toLowerCase().includes(lowerCaseQuery))
    );
};

// Hàm thêm bình luận mới
export const addComment = (postId: string, userName: string, content: string) => {
    const newComment: BlogComment = {
        id: uuidv4(),
        postId,
        userName,
        content,
        createdAt: new Date().toISOString()
    };

    MOCK_BLOG_COMMENTS.push(newComment);

    // Cập nhật số lượng bình luận của bài viết
    const post = MOCK_BLOG_POSTS.find(p => p.id === postId);
    if (post) {
        post.commentCount += 1;
    }

    return newComment;
};

// Hàm tăng lượt xem bài viết
export const incrementViewCount = (postId: string) => {
    const post = MOCK_BLOG_POSTS.find(p => p.id === postId);
    if (post) {
        post.viewCount += 1;
    }
    return post;
}; 