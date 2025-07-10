import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    CircularProgress,
    Card,
    CardMedia,
    IconButton,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip
} from '@mui/material';
import { PhotoCamera, Save, Delete, Visibility, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import blogService, { BlogPost } from '../../services/blogService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const initialBlog: BlogPost = {
    title: '',
    summary: '',
    content: '',
    coverImage: '',
    status: 'draft'
};

const BlogForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPost>(initialBlog);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [previewOpen, setPreviewOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isEditMode = !!id;

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image']
    ];

    useEffect(() => {
        if (isEditMode) {
            fetchBlogData();
        }
    }, [id]);

    const fetchBlogData = async () => {
        try {
            setLoading(true);
            const data = await blogService.getBlogPostById(id!);
            setBlog(data);
        } catch (error) {
            console.error('Error fetching blog post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBlog(prev => ({ ...prev, [name]: value }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
        setBlog(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }));
    };

    const handleContentChange = (value: string) => {
        setBlog(prev => ({ ...prev, content: value }));

        if (errors.content) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.content;
                return newErrors;
            });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        try {
            setUploadProgress(true);
            const imageUrl = await blogService.uploadCoverImage(file);
            setBlog(prev => ({ ...prev, coverImage: imageUrl }));

            if (errors.coverImage) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.coverImage;
                    return newErrors;
                });
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setUploadProgress(false);
        }
    };

    const handleRemoveImage = () => {
        setBlog(prev => ({ ...prev, coverImage: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!blog.title.trim()) {
            newErrors.title = 'Tiêu đề không được để trống';
        }

        if (!blog.content.trim()) {
            newErrors.content = 'Nội dung không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSaving(true);

            if (isEditMode) {
                await blogService.updateBlogPost(id!, blog);
            } else {
                await blogService.createBlogPost(blog);
            }

            navigate('/admin/blogs');
        } catch (error) {
            console.error('Error saving blog post:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/blogs');
    };

    const handleOpenPreview = () => {
        if (validateForm()) {
            setPreviewOpen(true);
        }
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        {isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                    </Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Visibility />}
                            onClick={handleOpenPreview}
                            sx={{ mr: 1 }}
                        >
                            Xem trước
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<ArrowBack />}
                            onClick={handleCancel}
                        >
                            Quay lại
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tiêu đề"
                                name="title"
                                value={blog.title}
                                onChange={handleInputChange}
                                error={!!errors.title}
                                helperText={errors.title}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tóm tắt"
                                name="summary"
                                value={blog.summary || ''}
                                onChange={handleInputChange}
                                multiline
                                rows={3}
                                placeholder="Tóm tắt ngắn về nội dung bài viết (hiển thị ở trang danh sách)"
                            />
                        </Grid>

                        <Grid item xs={12} md={8}>
                            <Typography variant="subtitle1" gutterBottom>
                                Nội dung bài viết
                            </Typography>
                            <ReactQuill
                                theme="snow"
                                value={blog.content}
                                onChange={handleContentChange}
                                modules={{
                                    toolbar: toolbarOptions
                                }}
                                style={{ height: '400px', marginBottom: '50px' }}
                            />
                            {errors.content && (
                                <FormHelperText error>{errors.content}</FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="subtitle1" gutterBottom>
                                Ảnh bìa
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<PhotoCamera />}
                                    disabled={uploadProgress}
                                    fullWidth
                                >
                                    {uploadProgress ? 'Đang tải ảnh...' : 'Chọn ảnh'}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        ref={fileInputRef}
                                    />
                                </Button>
                            </Box>

                            {blog.coverImage && (
                                <Card sx={{ mb: 2, position: 'relative' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={blog.coverImage}
                                        alt="Ảnh bìa bài viết"
                                    />
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(255, 255, 255, 0.7)',
                                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
                                        }}
                                        onClick={handleRemoveImage}
                                        size="small"
                                    >
                                        <Delete />
                                    </IconButton>
                                </Card>
                            )}

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="status-label">Trạng thái</InputLabel>
                                <Select
                                    labelId="status-label"
                                    value={blog.status}
                                    onChange={handleStatusChange as any}
                                    label="Trạng thái"
                                >
                                    <MenuItem value="draft">Bản nháp</MenuItem>
                                    <MenuItem value="published">Xuất bản</MenuItem>
                                </Select>
                                <FormHelperText>
                                    {blog.status === 'published' ?
                                        'Bài viết sẽ được công khai ngay sau khi lưu' :
                                        'Bài viết sẽ được lưu nhưng chưa công khai'
                                    }
                                </FormHelperText>
                            </FormControl>

                            <Box sx={{ mt: 4 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    startIcon={<Save />}
                                    disabled={saving}
                                >
                                    {saving ? 'Đang lưu...' : 'Lưu bài viết'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>
                    Xem trước bài viết
                    <Chip
                        label={blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                        color={blog.status === 'published' ? 'success' : 'default'}
                        size="small"
                        sx={{ ml: 2 }}
                    />
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mb: 3 }}>
                        {blog.coverImage && (
                            <Box sx={{ mb: 3, width: '100%', height: 300, overflow: 'hidden' }}>
                                <img
                                    src={blog.coverImage}
                                    alt="Ảnh bìa"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </Box>
                        )}

                        <Typography variant="h4" gutterBottom>
                            {blog.title}
                        </Typography>

                        {blog.summary && (
                            <Typography variant="subtitle1" sx={{ mb: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                                {blog.summary}
                            </Typography>
                        )}

                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 3 }}>
                            Ngày xuất bản: {formatDate(new Date())}
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Box dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePreview} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BlogForm; 