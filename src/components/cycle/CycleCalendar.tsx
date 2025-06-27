import { useState } from 'react';
import { Box, Grid, Typography, IconButton, Paper } from '@mui/material';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CycleCalendarProps {
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
}

const CycleCalendar = ({ selectedDate, onDateSelect }: CycleCalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const nextMonth = addMonths(currentMonth, 1);

    // Mock cycle data - in a real app this would come from state/backend
    const mockCycleData = {
        periodStart: new Date(2024, 0, 5),
        cycleLength: 28,
        periodLength: 5
    };

    const getDaysInMonth = (month: Date) => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);
        return eachDayOfInterval({ start, end });
    };

    const isPeriodDay = (date: Date) => {
        if (!mockCycleData.periodStart) return false;

        const periodEnd = addMonths(mockCycleData.periodStart, 2); // Show predictions for 2 months
        const cycles = Math.floor(
            (date.getTime() - mockCycleData.periodStart.getTime()) /
            (mockCycleData.cycleLength * 24 * 60 * 60 * 1000)
        );

        for (let i = 0; i <= cycles; i++) {
            const cycleStart = addMonths(mockCycleData.periodStart, i);
            const cycleEnd = new Date(cycleStart.getTime() + (mockCycleData.periodLength * 24 * 60 * 60 * 1000));

            if (isWithinInterval(date, { start: cycleStart, end: cycleEnd })) {
                return true;
            }
        }
        return false;
    };

    const renderMonth = (month: Date) => {
        const days = getDaysInMonth(month);
        const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        return (
            <Box sx={{ width: '100%' }}>
                <Typography variant="h6" align="center" gutterBottom>
                    {format(month, 'MMMM yyyy', { locale: vi })}
                </Typography>

                <Grid container spacing={1}>
                    {weekDays.map(day => (
                        <Grid item xs={12 / 7} key={day}>
                            <Typography
                                align="center"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'text.secondary',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {day}
                            </Typography>
                        </Grid>
                    ))}

                    {days.map(day => (
                        <Grid item xs={12 / 7} key={day.toISOString()}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1,
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    bgcolor: isPeriodDay(day) ? 'pink' : 'transparent',
                                    border: isSameDay(day, selectedDate || new Date()) ? '2px solid primary.main' : 'none',
                                    '&:hover': {
                                        bgcolor: 'action.hover'
                                    }
                                }}
                                onClick={() => onDateSelect(day)}
                            >
                                <Typography
                                    align="center"
                                    sx={{
                                        color: !isSameMonth(day, month) ? 'text.disabled' : 'text.primary'
                                    }}
                                >
                                    {format(day, 'd')}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <IconButton onClick={() => setCurrentMonth(prev => addMonths(prev, -1))}>
                    <ChevronLeft />
                </IconButton>
                <Typography variant="h6">Lịch theo dõi</Typography>
                <IconButton onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
                    <ChevronRight />
                </IconButton>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    {renderMonth(currentMonth)}
                </Grid>
                <Grid item xs={12} md={6}>
                    {renderMonth(nextMonth)}
                </Grid>
            </Grid>
        </Box>
    );
};

export default CycleCalendar; 