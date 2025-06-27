import { createTheme } from '@mui/material/styles';

// Define primary colors for gender healthcare theme
// Soothing, gentle colors are chosen to convey care and inclusivity
export const theme = createTheme({
    palette: {
        primary: {
            main: '#7E57C2', // Purple - represents gender inclusivity
            light: '#B085F5',
            dark: '#4D2C91',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#26A69A', // Teal - represents healthcare/wellness
            light: '#64D8CB',
            dark: '#00766C',
            contrastText: '#ffffff',
        },
        error: {
            main: '#F44336',
        },
        background: {
            default: '#F5F7FA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#333333',
            secondary: '#666666',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 600,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
    },
});

export default theme; 