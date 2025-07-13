import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';

const AuthLayout: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Left side - Branding */}
            <Box
                sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    p: 6,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.1)',
                        zIndex: 1
                    }
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <Box
                        component="img"
                        src="/hivicon.png"
                        alt="HIV Care Center"
                        sx={{
                            width: 120,
                            height: 120,
                            mb: 4,
                            filter: 'brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                        }}
                    />
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        Trung Tâm HIV/AIDS
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            opacity: 0.9,
                            lineHeight: 1.6,
                            maxWidth: 400,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }}
                    >
                        Hệ thống chăm sóc và điều trị HIV toàn diện với đội ngũ y tế chuyên nghiệp
                    </Typography>
                </Box>
            </Box>

            {/* Right side - Auth Form */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#f8fafc',
                    p: { xs: 3, sm: 6 },
                    minHeight: '100vh'
                }}
            >
                <Container component="main" maxWidth="sm">
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 4, sm: 6 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: 4,
                            bgcolor: 'white',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            maxWidth: 480,
                            width: '100%'
                        }}
                    >
                        <Outlet />
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
};

export default AuthLayout; 