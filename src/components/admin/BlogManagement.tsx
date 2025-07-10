import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    InputAdornment,
    Tooltip,
    Divider,
    Alert,
    Snackbar
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import blogService, { BlogPost, BlogFilter } from '../../services/blogService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const BlogManagement: React.FC = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [filters, setFilters] = useState<BlogFilter>({ status: '', search: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    useEffect(() => {
        fetchPosts();
    }, [filters]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const data = await blogService.getBlogPosts(filters);
            setPosts(data);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            setSnackbar({
                open: true,
                message: 'Không thể tải danh sách bài viết. Vui lòng thử lại sau.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setFilters(prev => ({ ...prev, status: event.target.value as string }));
    };

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, search: searchTerm }));
    };

    const handleSearchKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleRefresh = () => {
        setSearchTerm('');
        setFilters({ status: '', search: '' });
        fetchPosts();
    };

    const handleCreatePost = () => {
        navigate('/admin/blogs/create');
    };

    const handleEditPost = (id: string) => {
        navigate(`/admin/blogs/edit/${id}`);
    };

    const handleViewPost = (id: string) => {
        navigate(`/blog/${id}`);
    };

    const handleDeleteClick = (id: string) => {
        setPostToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (postToDelete) {
            try {
                await blogService.deleteBlogPost(postToDelete);
                setPosts(posts.filter(post => post.id !== postToDelete));
                setDeleteDialogOpen(false);
                setPostToDelete(null);
                setSnackbar({
                    open: true,
                    message: 'Xóa bài viết thành công',
                    severity: 'success'
                });
            } catch (error) {
                console.error('Error deleting post:', error);
                setSnackbar({
                    open: true,
                    message: 'Không thể xóa bài viết. Vui lòng thử lại sau.',
                    severity: 'error'
                });
            }
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setPostToDelete(null);
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
        } catch (error) {
            return 'Không xác định';
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" component="h1">Quản lý bài viết</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreatePost}
                    >
                        Tạo bài viết mới
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', mb: 3, gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        label="Tìm kiếm"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                        sx={{ flexGrow: 1, minWidth: '200px' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Tìm theo tiêu đề hoặc nội dung..."
                    />
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSearch}
                        startIcon={<FilterIcon />}
                    >
                        Lọc
                    </Button>
                    <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                        <InputLabel id="status-filter-label">Trạng thái</InputLabel>
                        <Select
                            labelId="status-filter-label"
                            value={filters.status || ''}
                            onChange={handleStatusFilterChange as any}
                            label="Trạng thái"
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="published">Đã xuất bản</MenuItem>
                            <MenuItem value="draft">Bản nháp</MenuItem>
                        </Select>
                    </FormControl>
                    <Tooltip title="Làm mới">
                        <IconButton onClick={handleRefresh} color="default">
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell width="40%">Tiêu đề</TableCell>
                                <TableCell width="15%">Trạng thái</TableCell>
                                <TableCell width="10%">Lượt xem</TableCell>
                                <TableCell width="15%">Ngày tạo</TableCell>
                                <TableCell width="20%" align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Đang tải...</TableCell>
                                </TableRow>
                            ) : posts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Box sx={{ py: 3 }}>
                                            <Typography variant="body1" sx={{ mb: 2 }}>
                                                Không tìm thấy bài viết nào
                                            </Typography>
                                            {filters.status || filters.search ? (
                                                <Button
                                                    variant="outlined"
                                                    onClick={handleRefresh}
                                                    startIcon={<RefreshIcon />}
                                                >
                                                    Xóa bộ lọc
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    onClick={handleCreatePost}
                                                    startIcon={<AddIcon />}
                                                >
                                                    Tạo bài viết mới
                                                </Button>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (rowsPerPage > 0
                                    ? posts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : posts
                                ).map((post) => (
                                    <TableRow
                                        key={post.id}
                                        hover
                                        sx={{
                                            '&:last-child td, &:last-child th': { border: 0 },
                                            backgroundColor: post.status === 'draft' ? 'rgba(0, 0, 0, 0.02)' : 'inherit'
                                        }}
                                    >
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
                                                    {post.title}
                                                </Typography>
                                                {post.summary && (
                                                    <Typography variant="body2" color="text.secondary" sx={{
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                    }}>
                                                        {post.summary}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                                color={post.status === 'published' ? 'success' : 'default'}
                                                size="small"
                                                variant={post.status === 'published' ? 'filled' : 'outlined'}
                                            />
                                        </TableCell>
                                        <TableCell>{post.viewCount || 0}</TableCell>
                                        <TableCell>{formatDate(post.createdAt)}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Xem">
                                                <IconButton onClick={() => handleViewPost(post.id!)} color="info" size="small">
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Sửa">
                                                <IconButton onClick={() => handleEditPost(post.id!)} color="primary" size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton onClick={() => handleDeleteClick(post.id!)} color="error" size="small">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={posts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Hiển thị mỗi trang:"
                />
            </Paper>

            {/* Dialog xác nhận xóa */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Xác nhận xóa bài viết
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác và
                        tất cả dữ liệu liên quan đến bài viết sẽ bị mất vĩnh viễn.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar thông báo */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default BlogManagement; 