import { createTheme } from '@mui/material/styles';
import { purple, teal } from '@mui/material/colors';

// Create a theme instance.
export const theme = createTheme({
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: teal[500],
        },
        background: {
            default: '#fff',
            paper: '#f9f9f9',
        },
    },
    components: {
        MuiGrid: {
            defaultProps: {
                // This fixes the Grid component issue for all grids
                component: 'div',
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
    },
    typography: {
        fontFamily: [
            'Poppins',
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
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
            fontWeight: 500,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
});

export default theme; 