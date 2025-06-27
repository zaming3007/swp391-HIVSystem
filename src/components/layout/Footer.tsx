import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) => theme.palette.primary.main,
                color: 'white',
            }}
        >
            <Container maxWidth="sm">
                <Typography variant="body1" align="center">
                    © {new Date().getFullYear()} Gender Healthcare - Group 7 - SWR302
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer; 