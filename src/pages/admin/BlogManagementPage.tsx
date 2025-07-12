import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Publish as PublishIcon,
    UnpublishedOutlined as UnpublishIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
    getAllPosts,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    BlogPost,
    BlogPostCreateDto,
    BlogPostUpdateDto
} from '../../services/blogService';

const BlogManagementPage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        summary: '',
        status: 0 as 0 | 1 // 0 = Draft, 1 = Published
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await getAllPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            showSnackbar('Lỗi khi tải danh sách bài viết', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleOpenDialog = (post?: BlogPost) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title,
                content: post.content,
                summary: post.summary,
                status: post.status
            });
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                content: '',
                summary: '',
                status: 0
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingPost(null);
        setFormData({
            title: '',
            content: '',
            summary: '',
            status: 0
        });
    };

    const handleSubmit = async () => {
        try {
            if (editingPost) {
                // Update existing post
                const updated = await updatePost(editingPost.id, formData as BlogPostUpdateDto);
                if (updated) {
                    showSnackbar('Cập nhật bài viết thành công', 'success');
                    fetchPosts();
                    handleCloseDialog();
                } else {
                    showSnackbar('Lỗi khi cập nhật bài viết', 'error');
                }
            } else {
                // Create new post
                const created = await createPost(formData as BlogPostCreateDto);
                if (created) {
                    showSnackbar('Tạo bài viết thành công', 'success');
                    fetchPosts();
                    handleCloseDialog();
                } else {
                    showSnackbar('Lỗi khi tạo bài viết', 'error');
                }
            }
        } catch (error) {
            console.error('Error saving post:', error);
            showSnackbar('Có lỗi xảy ra khi lưu bài viết', 'error');
        }
    };

    const handleDelete = async (postId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            try {
                const success = await deletePost(postId);
                if (success) {
                    showSnackbar('Xóa bài viết thành công', 'success');
                    fetchPosts();
                } else {
                    showSnackbar('Lỗi khi xóa bài viết', 'error');
                }
            } catch (error) {
                console.error('Error deleting post:', error);
                showSnackbar('Có lỗi xảy ra khi xóa bài viết', 'error');
            }
        }
    };

    const handlePublish = async (postId: string, currentStatus: number) => {
        try {
            const success = currentStatus === 1
                ? await unpublishPost(postId)
                : await publishPost(postId);

            if (success) {
                const action = currentStatus === 1 ? 'hủy xuất bản' : 'xuất bản';
                showSnackbar(`${action} bài viết thành công`, 'success');
                fetchPosts();
            } else {
                showSnackbar('Lỗi khi thay đổi trạng thái bài viết', 'error');
            }
        } catch (error) {
            console.error('Error changing post status:', error);
            showSnackbar('Có lỗi xảy ra khi thay đổi trạng thái bài viết', 'error');
        }
    };

    const getStatusColor = (status: number) => {
        return status === 1 ? 'success' : 'default';
    };

    const getStatusText = (status: number) => {
        return status === 1 ? 'Đã xuất bản' : 'Bản nháp';
    };

    if (user?.role !== 'staff') {
        return (
            <Container>
                <Alert severity="error">
                    Bạn không có quyền truy cập trang này.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Quản lý Blog
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Tạo bài viết mới
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>Tác giả</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Lượt xem</TableCell>
                            <TableCell>Bình luận</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>
                                    <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
                                        {post.title}
                                    </Typography>
                                </TableCell>
                                <TableCell>{post.authorName}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusText(post.status)}
                                        color={getStatusColor(post.status)}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{post.viewCount}</TableCell>
                                <TableCell>{post.commentCount}</TableCell>
                                <TableCell>
                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                                        title="Xem bài viết"
                                    >
                                        <ViewIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(post)}
                                        title="Chỉnh sửa"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handlePublish(post.id, post.status)}
                                        title={post.status === 1 ? 'Hủy xuất bản' : 'Xuất bản'}
                                    >
                                        {post.status === 1 ? <UnpublishIcon /> : <PublishIcon />}
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(post.id)}
                                        title="Xóa"
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Create/Edit Post */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Tiêu đề"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Tóm tắt"
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            fullWidth
                            multiline
                            rows={2}
                        />
                        <TextField
                            label="Nội dung"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            fullWidth
                            multiline
                            rows={10}
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 0 | 1 })}
                                label="Trạng thái"
                            >
                                <MenuItem value={0}>Bản nháp</MenuItem>
                                <MenuItem value={1}>Xuất bản</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingPost ? 'Cập nhật' : 'Tạo'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default BlogManagementPage;
