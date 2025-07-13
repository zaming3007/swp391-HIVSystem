import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Thêm link Reminder vào menu
const menuItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Dịch vụ', path: '/services' },
    { name: 'Đặt lịch', path: '/appointment' },
    { name: 'Tư vấn', path: '/consultation' },
    { name: 'Phác đồ ARV', path: '/app/arv-treatment' },
    { name: 'Nhắc nhở', path: '/reminder' },
    { name: 'Hồ sơ', path: '/profile' },
    { name: 'Liên hệ', path: '/contact' },
    { name: 'Về chúng tôi', path: '/about' },
];

const MainLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
                <Outlet />
            </Container>
            <Footer />
        </Box>
    );
};

export default MainLayout; 