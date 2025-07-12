import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Divider,
    Avatar,
    Button,
    TextField,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    IconButton,
    Chip
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import { getPostById, getCommentsByPostId, createComment, incrementViewCount, getAllPublishedPosts, BlogPost, BlogComment } from '../../services/blogService';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const BlogDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [post, setPost] = useState<BlogPost | null>(null);
    const [comments, setComments] = useState<BlogComment[]>([]);
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
    const [commentName, setCommentName] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    // Lấy thông tin bài viết
                    const fetchedPost = await getPostById(id);

                    if (fetchedPost) {
                        // Kiểm tra quyền xem bài viết
                        if (fetchedPost.status !== 1 && user?.role !== "staff") {
                            navigate('/blog');
                            return;
                        }

                        setPost(fetchedPost);

                        // Tăng lượt xem
                        await incrementViewCount(id);

                        // Lấy danh sách bình luận
                        const fetchedComments = await getCommentsByPostId(id);
                        setComments(fetchedComments);

                        // Lấy các bài viết liên quan (trừ bài viết hiện tại)
                        const allPosts = await getAllPublishedPosts();
                        const related = allPosts
                            .filter(p => p.id !== id)
                            .slice(0, 3);
                        setRelatedPosts(related);
                    } else {
                        // Không tìm thấy bài viết
                        navigate('/blog');
                    }
                } catch (error) {
                    console.error('Error fetching blog data:', error);
                    navigate('/blog');
                }
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleSubmitComment = async () => {
        if (!isAuthenticated) {
            setError('Vui lòng đăng nhập để bình luận');
            return;
        }

        if (!commentContent.trim()) {
            setError('Vui lòng nhập nội dung bình luận');
            return;
        }

        if (id) {
            try {
                const newComment = await createComment(id, { content: commentContent });
                if (newComment) {
                    setComments([...comments, newComment]);
                    setCommentContent('');
                    setError('');

                    // Cập nhật số lượng bình luận của bài viết
                    if (post) {
                        setPost(prev => prev ? { ...prev, commentCount: prev.commentCount + 1 } : null);
                    }
                } else {
                    setError('Không thể thêm bình luận. Vui lòng thử lại.');
                }
            } catch (error) {
                console.error('Error creating comment:', error);
                setError('Có lỗi xảy ra khi thêm bình luận');
            }
        }
    };

    if (!post) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5">Đang tải bài viết...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/blog')}
                sx={{ mb: 2 }}
            >
                Quay lại danh sách
            </Button>

            <Grid container spacing={4}>
                {/* Cột chính với nội dung bài viết */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {post.title}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                            <Chip
                                icon={<CalendarTodayIcon />}
                                label={new Date(post.publishedAt || post.createdAt).toLocaleDateString('vi-VN')}
                                variant="outlined"
                                size="small"
                            />
                            <Chip
                                icon={<VisibilityIcon />}
                                label={`${post.viewCount} lượt xem`}
                                variant="outlined"
                                size="small"
                            />
                            <Chip
                                icon={<CommentIcon />}
                                label={`${post.commentCount} bình luận`}
                                variant="outlined"
                                size="small"
                            />
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box sx={{
                            '& img': { maxWidth: '100%', height: 'auto' },
                            '& h1, & h2, & h3, & h4, & h5, & h6': { mt: 3, mb: 2 },
                            '& p': { mb: 2 },
                            '& ul, & ol': { pl: 4, mb: 2 },
                            '& blockquote': {
                                borderLeft: '4px solid #ccc',
                                pl: 2,
                                fontStyle: 'italic',
                                my: 2
                            }
                        }}>
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </Box>
                    </Paper>

                    {/* Phần bình luận */}
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Bình luận ({comments.length})
                        </Typography>

                        {isAuthenticated ? (
                            <Box sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Nội dung bình luận"
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    margin="normal"
                                    multiline
                                    rows={4}
                                    error={!!error && !commentContent.trim()}
                                />
                                {error && (
                                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                        {error}
                                    </Typography>
                                )}
                                <Button
                                    variant="contained"
                                    onClick={handleSubmitComment}
                                    sx={{ mt: 2 }}
                                >
                                    Gửi bình luận
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                                <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
                                    Vui lòng <a href="/login" style={{ color: '#1976d2' }}>đăng nhập</a> để bình luận
                                </Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 3 }} />

                        {comments.length > 0 ? (
                            <List>
                                {comments.map((comment) => (
                                    <ListItem
                                        key={comment.id}
                                        alignItems="flex-start"
                                        sx={{
                                            mb: 2,
                                            bgcolor: 'background.paper',
                                            borderRadius: 1,
                                            boxShadow: 1
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <PersonIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="subtitle1">
                                                        {comment.userName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={comment.content}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Sidebar với bài viết liên quan */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Bài viết liên quan
                        </Typography>

                        {relatedPosts.length > 0 ? (
                            <List disablePadding>
                                {relatedPosts.map((relatedPost) => (
                                    <ListItem
                                        key={relatedPost.id}
                                        disablePadding
                                        sx={{ mb: 2 }}
                                        onClick={() => navigate(`/blog/${relatedPost.id}`)}
                                        button
                                    >
                                        <Card sx={{ width: '100%' }}>
                                            <CardContent>
                                                <Typography variant="subtitle1" noWrap>
                                                    {relatedPost.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(relatedPost.publishedDate).toLocaleDateString('vi-VN')}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography color="text.secondary">
                                Không có bài viết liên quan.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default BlogDetailPage; 