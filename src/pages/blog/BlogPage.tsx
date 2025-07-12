import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Box,
    Chip,
    TextField,
    InputAdornment,
    Pagination,
    Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import { getAllPublishedPosts, searchPosts, BlogPost } from '../../services/blogService';

const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const postsPerPage = 6;

    useEffect(() => {
        // Lấy danh sách bài viết khi component được mount
        const fetchPosts = async () => {
            try {
                const allPosts = searchTerm
                    ? await searchPosts(searchTerm)
                    : await getAllPublishedPosts();
                setPosts(allPosts);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setPosts([]);
            }
        };

        fetchPosts();
    }, [searchTerm]);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(1); // Reset về trang 1 khi tìm kiếm
    };

    const handlePostClick = (postId: string) => {
        navigate(`/blog/${postId}`);
    };

    // Tính toán các bài viết hiển thị trên trang hiện tại
    const indexOfLastPost = page * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    // Hàm cắt nội dung để hiển thị tóm tắt
    const truncateContent = (content: string, maxLength: number = 150) => {
        // Loại bỏ các ký tự markdown
        const plainText = content.replace(/#{1,6}\s?[^\n]+/g, '')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/`([^`]+)`/g, '$1');

        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength) + '...';
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Blog Chia Sẻ Kinh Nghiệm
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
                    Nơi chia sẻ kinh nghiệm, kiến thức và câu chuyện về cuộc sống với HIV
                </Typography>

                <TextField
                    fullWidth
                    placeholder="Tìm kiếm bài viết..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {posts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        Không tìm thấy bài viết nào phù hợp.
                    </Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={4}>
                        {currentPosts.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 6
                                        }
                                    }}
                                >
                                    <CardActionArea onClick={() => handlePostClick(post.id)}>
                                        <CardMedia
                                            component="div"
                                            sx={{
                                                height: 140,
                                                bgcolor: 'primary.light',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="h5" color="white">
                                                {post.title.split(' ').slice(0, 2).join(' ')}
                                            </Typography>
                                        </CardMedia>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h6" component="h2" noWrap>
                                                {post.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 80, overflow: 'hidden' }}>
                                                {truncateContent(post.content)}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN')}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Chip
                                                        icon={<VisibilityIcon fontSize="small" />}
                                                        label={post.viewCount}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        icon={<CommentIcon fontSize="small" />}
                                                        label={post.commentCount}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {totalPages > 1 && (
                        <Stack spacing={2} sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                            />
                        </Stack>
                    )}
                </>
            )}
        </Container>
    );
};

export default BlogPage; 