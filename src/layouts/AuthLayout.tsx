import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper } from '@mui/material';

const AuthLayout: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                bgcolor: 'primary.light',
                backgroundImage: 'linear-gradient(to right bottom, #7E57C2, #26A69A)'
            }}
        >
            <Container component="main" maxWidth="sm" sx={{ py: 8 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 2
                    }}
                >
                    <Outlet />
                </Paper>
            </Container>
        </Box>
    );
};

export default AuthLayout; 