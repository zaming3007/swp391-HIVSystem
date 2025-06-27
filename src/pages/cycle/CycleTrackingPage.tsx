import { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, useTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CycleCalendar from '../../components/cycle/CycleCalendar';
import CycleSummary from '../../components/cycle/CycleSummary';
import CycleInfo from '../../components/cycle/CycleInfo';

const CycleTrackingPage = () => {
    const theme = useTheme();
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom color="primary">
                    Theo dõi chu kì kinh nguyệt
                </Typography>

                <Grid container spacing={3}>
                    {/* Calendar Section */}
                    <Grid item xs={12} md={8}>
                        <Paper
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                height: 'auto',
                                borderRadius: 2,
                                boxShadow: theme.shadows[2]
                            }}
                        >
                            <CycleCalendar
                                selectedDate={selectedDate}
                                onDateSelect={setSelectedDate}
                            />
                        </Paper>
                    </Grid>

                    {/* Summary Section */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <CycleSummary selectedDate={selectedDate} />
                            <CycleInfo />
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </LocalizationProvider>
    );
};

export default CycleTrackingPage; 