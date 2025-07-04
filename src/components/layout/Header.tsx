import React, { useState, useRef } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    Button,
    IconButton,
    Stack,
    MenuItem,
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    Menu,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AuthStatus from '../auth/AuthStatus';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const Header: React.FC = () => {
    const location = useLocation();
    const { user } = useSelector((state: RootState) => state.auth);
    const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
    const [teamMenuOpen, setTeamMenuOpen] = useState(false);
    const [resourcesMenuOpen, setResourcesMenuOpen] = useState(false);
    const [moreMenuOpen, setMoreMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const servicesButtonRef = useRef<HTMLButtonElement>(null);
    const teamButtonRef = useRef<HTMLButtonElement>(null);
    const resourcesButtonRef = useRef<HTMLButtonElement>(null);
    const moreButtonRef = useRef<HTMLButtonElement>(null);

    // Các dịch vụ dropdown với thông tin tab
    const serviceItems = [
        { name: 'Tất cả Dịch vụ', path: '/services', tabIndex: 0 },
        { name: 'Xét nghiệm HIV', path: '/services', tabIndex: 1 },
        { name: 'Điều trị HIV', path: '/services', tabIndex: 2 },
        { name: 'Chăm sóc HIV', path: '/services', tabIndex: 3 },
        { name: 'Dự phòng HIV', path: '/services', tabIndex: 4 },
        { name: 'Hỗ trợ Tâm lý', path: '/services', tabIndex: 5 }
    ];

    // Các danh mục đội ngũ dropdown với thông tin tab
    const teamItems = [
        { name: 'Tất Cả', path: '/team', tabIndex: 0 },
        { name: 'Bác sĩ Điều trị', path: '/team', tabIndex: 1 },
        { name: 'Tư Vấn Tâm Lý', path: '/team', tabIndex: 2 },
        { name: 'Hành Chính', path: '/team', tabIndex: 3 }
    ];

    // Tài liệu giáo dục và giảm kỳ thị
    const resourceItems = [
        { name: 'Thông tin HIV/AIDS', path: '/education/basic-hiv-info', tabIndex: 0 },
        { name: 'Sống khỏe với HIV', path: '/education/living-with-hiv', tabIndex: 1 },
        { name: 'Giảm kỳ thị', path: '/education/stigma-reduction', tabIndex: 2 }
    ];

    // Menu thêm để tiết kiệm không gian
    const moreMenuItems = [
        { name: 'Về chúng tôi', path: '/about' },
        { name: 'Đội ngũ y tế', path: '/team', hasSubmenu: false },
        { name: 'Liên hệ', path: '/contact' },
        { name: 'Tư vấn trực tuyến', path: '/app/consultations' }
    ];

    // Kiểm tra đường dẫn hiện tại để xác định nút nào đang được active
    const isActive = (path: string) => {
        if (path === '/services') {
            return location.pathname === path || location.pathname.includes('/services');
        }
        if (path === '/team') {
            return location.pathname === path || location.pathname.includes('/team');
        }
        if (path === '/education') {
            return location.pathname.includes('/education');
        }
        if (path === '/blog') {
            return location.pathname === path || location.pathname.includes('/blog');
        }
        if (path === '/app/reminder') {
            return location.pathname === path;
        }
        return location.pathname === path;
    };

    // Mở/đóng menu dịch vụ
    const handleServicesMenuToggle = () => {
        setServicesMenuOpen((prevOpen) => !prevOpen);
    };

    // Mở/đóng menu đội ngũ
    const handleTeamMenuToggle = () => {
        setTeamMenuOpen((prevOpen) => !prevOpen);
    };

    // Mở/đóng menu tài liệu
    const handleResourcesMenuToggle = () => {
        setResourcesMenuOpen((prevOpen) => !prevOpen);
    };

    // Mở/đóng menu thêm
    const handleMoreMenuToggle = () => {
        setMoreMenuOpen((prevOpen) => !prevOpen);
    };

    // Đóng menu dịch vụ khi click ra ngoài
    const handleServicesMenuClose = (event: Event | React.SyntheticEvent) => {
        if (
            servicesButtonRef.current &&
            servicesButtonRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setServicesMenuOpen(false);
    };

    // Đóng menu đội ngũ khi click ra ngoài
    const handleTeamMenuClose = (event: Event | React.SyntheticEvent) => {
        if (
            teamButtonRef.current &&
            teamButtonRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setTeamMenuOpen(false);
    };

    // Đóng menu tài liệu khi click ra ngoài
    const handleResourcesMenuClose = (event: Event | React.SyntheticEvent) => {
        if (
            resourcesButtonRef.current &&
            resourcesButtonRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setResourcesMenuOpen(false);
    };

    // Đóng menu thêm khi click ra ngoài
    const handleMoreMenuClose = (event: Event | React.SyntheticEvent) => {
        if (
            moreButtonRef.current &&
            moreButtonRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }
        setMoreMenuOpen(false);
    };

    // Mở/đóng menu mobile
    const handleMobileMenuToggle = () => {
        setMobileMenuOpen((prevOpen) => !prevOpen);
    };

    // Xử lý chọn một mục dịch vụ
    const handleServiceItemClick = (tabIndex: number) => {
        setServicesMenuOpen(false);
        if (location.pathname === '/services') {
            const event = new CustomEvent('serviceTabChange', {
                detail: { tabIndex }
            });
            window.dispatchEvent(event);
        } else {
            localStorage.setItem('selectedServiceTab', tabIndex.toString());
        }
    };

    // Xử lý chọn một mục đội ngũ
    const handleTeamItemClick = (tabIndex: number) => {
        setTeamMenuOpen(false);
        if (location.pathname === '/team') {
            const event = new CustomEvent('teamTabChange', {
                detail: { tabIndex }
            });
            window.dispatchEvent(event);
        } else {
            localStorage.setItem('selectedTeamTab', tabIndex.toString());
        }
    };

    const navItems = [
        { name: 'Trang chủ', path: '/' },
        // Dịch vụ và Đội ngũ được xử lý riêng với dropdown
        { name: 'Về chúng tôi', path: '/about' },
        { name: 'Liên hệ', path: '/contact' },
    ];

    return (
        <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'primary.main', boxShadow: 2 }}>
            <Container maxWidth="xl">
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
                        <IconButton
                            component={RouterLink}
                            to="/"
                            sx={{ display: 'flex', alignItems: 'center', p: 0 }}
                        >
                            <img
                                src="/hivicon.png"
                                alt="Biểu tượng Trung tâm Y tế"
                                style={{ width: '2em', height: '2em', marginRight: '10px' }}
                            />
                            <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                                Trung tâm HIV/AIDS
                            </Typography>
                        </IconButton>
                    </Box>

                    {/* Menu cho màn hình lớn */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, alignItems: 'center' }}>
                        {/* Trang chủ */}
                        <Button
                            component={RouterLink}
                            to="/"
                            sx={{
                                color: isActive('/') ? 'primary.main' : 'text.secondary',
                                fontWeight: isActive('/') ? 'bold' : 'normal',
                                borderBottom: isActive('/') ? '2px solid' : 'none',
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: 'primary.main',
                                },
                                fontSize: '0.85rem',
                                px: 1
                            }}
                        >
                            Trang chủ
                        </Button>

                        {/* Đặt lịch hẹn */}
                        <Button
                            component={RouterLink}
                            to="/appointment"
                            sx={{
                                color: isActive('/appointment') ? 'primary.main' : 'text.secondary',
                                fontWeight: isActive('/appointment') ? 'bold' : 'normal',
                                borderBottom: isActive('/appointment') ? '2px solid' : 'none',
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: 'primary.main',
                                },
                                fontSize: '0.85rem',
                                px: 1
                            }}
                        >
                            Đặt lịch hẹn
                        </Button>

                        {/* Nút Dịch vụ với dropdown */}
                        <Button
                            ref={servicesButtonRef}
                            onClick={handleServicesMenuToggle}
                            sx={{
                                color: isActive('/services') ? 'primary.main' : 'text.secondary',
                                fontWeight: isActive('/services') ? 'bold' : 'normal',
                                borderBottom: isActive('/services') ? '2px solid' : 'none',
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: 'primary.main',
                                },
                                fontSize: '0.85rem',
                                px: 1
                            }}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            Dịch vụ
                        </Button>
                        <Popper
                            open={servicesMenuOpen}
                            anchorEl={servicesButtonRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                            sx={{ zIndex: 1300 }}
                        >
                            {({ TransitionProps }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: 'top left' }}
                                >
                                    <Paper elevation={3} sx={{ mt: 1 }}>
                                        <ClickAwayListener onClickAway={handleServicesMenuClose}>
                                            <MenuList
                                                autoFocusItem={servicesMenuOpen}
                                                id="services-menu"
                                                aria-labelledby="services-button"
                                            >
                                                {serviceItems.map((item, index) => (
                                                    <MenuItem
                                                        key={item.name}
                                                        component={RouterLink}
                                                        to={item.path}
                                                        onClick={() => handleServiceItemClick(item.tabIndex)}
                                                        sx={{
                                                            py: 1,
                                                            ...(index === 0 && {
                                                                color: 'primary.main',
                                                                fontWeight: 'bold',
                                                                borderLeft: '3px solid',
                                                            })
                                                        }}
                                                    >
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>

                        {/* Tài liệu giáo dục */}
                        <Button
                            ref={resourcesButtonRef}
                            onClick={handleResourcesMenuToggle}
                            sx={{
                                color: isActive('/education') ? 'primary.main' : 'text.secondary',
                                fontWeight: isActive('/education') ? 'bold' : 'normal',
                                borderBottom: isActive('/education') ? '2px solid' : 'none',
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: 'primary.main',
                                },
                                fontSize: '0.85rem',
                                px: 1
                            }}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            Tài liệu
                        </Button>
                        <Popper
                            open={resourcesMenuOpen}
                            anchorEl={resourcesButtonRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                            sx={{ zIndex: 1300 }}
                        >
                            {({ TransitionProps }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: 'top left' }}
                                >
                                    <Paper elevation={3} sx={{ mt: 1 }}>
                                        <ClickAwayListener onClickAway={handleResourcesMenuClose}>
                                            <MenuList
                                                autoFocusItem={resourcesMenuOpen}
                                                id="resources-menu"
                                                aria-labelledby="resources-button"
                                            >
                                                {resourceItems.map((item) => (
                                                    <MenuItem
                                                        key={item.name}
                                                        component={RouterLink}
                                                        to={item.path}
                                                        sx={{ py: 1 }}
                                                    >
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>

                        {/* Thêm nút Blog chia sẻ vào menu chính */}
                        <Button
                            component={RouterLink}
                            to="/blog"
                            sx={{
                                color: isActive('/blog') ? 'primary.main' : 'text.secondary',
                                fontWeight: isActive('/blog') ? 'bold' : 'normal',
                                borderBottom: isActive('/blog') ? '2px solid' : 'none',
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: 'primary.main',
                                },
                                fontSize: '0.85rem',
                                px: 1
                            }}
                        >
                            Blog chia sẻ
                        </Button>

                        {/* Menu thêm */}
                        <Button
                            ref={moreButtonRef}
                            onClick={handleMoreMenuToggle}
                            sx={{
                                color: 'text.secondary',
                                borderRadius: 0,
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: 'primary.main',
                                },
                                fontSize: '0.85rem',
                                px: 1
                            }}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            Thêm
                        </Button>
                        <Menu
                            anchorEl={moreButtonRef.current}
                            open={moreMenuOpen}
                            onClose={handleMoreMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'more-button',
                            }}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            {moreMenuItems.map((item) =>
                                <MenuItem
                                    key={item.name}
                                    component={RouterLink}
                                    to={item.path}
                                    onClick={handleMoreMenuClose}
                                >
                                    {item.name}
                                </MenuItem>
                            )}
                        </Menu>

                        {/* Team Menu Popper */}
                        <Popper
                            open={teamMenuOpen}
                            anchorEl={teamButtonRef.current}
                            role={undefined}
                            placement="right-start"
                            transition
                            disablePortal
                            sx={{ zIndex: 1301 }}
                        >
                            {({ TransitionProps }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{ transformOrigin: 'left top' }}
                                >
                                    <Paper elevation={3}>
                                        <ClickAwayListener onClickAway={handleTeamMenuClose}>
                                            <MenuList
                                                autoFocusItem={teamMenuOpen}
                                                id="team-menu"
                                                aria-labelledby="team-button"
                                            >
                                                {teamItems.map((item) => (
                                                    <MenuItem
                                                        key={item.name}
                                                        component={RouterLink}
                                                        to={item.path}
                                                        onClick={() => {
                                                            handleTeamItemClick(item.tabIndex);
                                                            handleMoreMenuClose({} as React.SyntheticEvent);
                                                        }}
                                                        sx={{ py: 1 }}
                                                    >
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                    </Box>

                    {/* AuthStatus và Menu mobile */}
                    <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Thêm AuthStatus */}
                        <AuthStatus />

                        {/* Menu mobile */}
                        <IconButton
                            color="inherit"
                            aria-label="open menu"
                            edge="end"
                            onClick={handleMobileMenuToggle}
                            sx={{ display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>

            {/* Menu mobile drawer */}
            <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            >
                <Box sx={{ width: 250 }}>
                    <List>
                        <ListItem component={RouterLink} to="/">
                            <ListItemText primary="Trang chủ" />
                        </ListItem>
                        <ListItem component={RouterLink} to="/appointment">
                            <ListItemText primary="Đặt lịch hẹn" />
                        </ListItem>
                        <ListItem component={RouterLink} to="/services">
                            <ListItemText primary="Dịch vụ" />
                        </ListItem>
                        <ListItem component={RouterLink} to="/education/basic-hiv-info">
                            <ListItemText primary="Tài liệu" />
                        </ListItem>
                        <ListItem component={RouterLink} to="/blog">
                            <ListItemText primary="Blog chia sẻ" />
                        </ListItem>
                        <ListItem component={RouterLink} to="/team">
                            <ListItemText primary="Đội ngũ y tế" />
                        </ListItem>
                        <ListItem component={RouterLink} to="/contact">
                            <ListItemText primary="Liên hệ" />
                        </ListItem>
                        <ListItem component={RouterLink} to="/about">
                            <ListItemText primary="Về chúng tôi" />
                        </ListItem>

                        {/* Conditional Menu Items based on role */}
                        {user?.role === 'customer' && (
                            <>
                                <ListItem component={RouterLink} to="/app/reminder">
                                    <ListItemText primary="Nhắc nhở thuốc" />
                                </ListItem>
                                <ListItem component={RouterLink} to="/app/consultations">
                                    <ListItemText primary="Tư vấn trực tuyến" />
                                </ListItem>
                                <ListItem component={RouterLink} to="/app/test-results">
                                    <ListItemText primary="Kết quả xét nghiệm" />
                                </ListItem>
                            </>
                        )}

                        {user?.role === 'doctor' && (
                            <>
                                <ListItem component={RouterLink} to="/doctor">
                                    <ListItemText primary="Dashboard" />
                                </ListItem>
                                <ListItem component={RouterLink} to="/doctor/patients">
                                    <ListItemText primary="Bệnh nhân" />
                                </ListItem>
                                <ListItem component={RouterLink} to="/doctor/appointments">
                                    <ListItemText primary="Lịch hẹn" />
                                </ListItem>
                            </>
                        )}

                        {user?.role === 'staff' && (
                            <>
                                <ListItem component={RouterLink} to="/staff">
                                    <ListItemText primary="Dashboard" />
                                </ListItem>
                                <ListItem component={RouterLink} to="/staff/patients">
                                    <ListItemText primary="Danh sách bệnh nhân" />
                                </ListItem>
                                <ListItem component={RouterLink} to="/staff/check-in">
                                    <ListItemText primary="Hỗ trợ check-in" />
                                </ListItem>
                            </>
                        )}

                        {user?.role === 'admin' && (
                            <>
                                <ListItem component={RouterLink} to="/admin/dashboard">
                                    <ListItemIcon>
                                        <DashboardIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Dashboard & Báo cáo" />
                                </ListItem>
                                <ListItem component={RouterLink} to="/admin/users">
                                    <ListItemIcon>
                                        <PeopleIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Quản lý người dùng" />
                                </ListItem>
                                <ListItem component={RouterLink} to="/admin/services">
                                    <ListItemIcon>
                                        <MedicalServicesIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary="Quản lý dịch vụ" />
                                </ListItem>
                            </>
                        )}
                    </List>
                </Box>
            </Drawer>
        </AppBar >
    );
};

export default Header; 