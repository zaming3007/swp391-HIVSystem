import { Paper, Typography, Box, Divider } from '@mui/material';
import { format, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CycleSummaryProps {
    selectedDate: Date | null;
}

const CycleSummary = ({ selectedDate }: CycleSummaryProps) => {
    // Mock data - in a real app this would come from state/backend
    const mockCycleData = {
        lastPeriod: new Date(2024, 0, 5),
        cycleLength: 28,
        periodLength: 5,
        nextPeriod: addDays(new Date(2024, 0, 5), 28),
        ovulationDay: addDays(new Date(2024, 0, 5), 14),
        fertileDays: {
            start: addDays(new Date(2024, 0, 5), 12),
            end: addDays(new Date(2024, 0, 5), 16),
        }
    };

    const formatDate = (date: Date) => {
        return format(date, 'dd/MM/yyyy', { locale: vi });
    };

    return (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
                Thông tin chu kì
            </Typography>

            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Kì kinh gần nhất
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatDate(mockCycleData.lastPeriod)}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="subtitle2" color="text.secondary">
                    Kì kinh tiếp theo (dự đoán)
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatDate(mockCycleData.nextPeriod)}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="subtitle2" color="text.secondary">
                    Ngày rụng trứng (dự đoán)
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {formatDate(mockCycleData.ovulationDay)}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="subtitle2" color="text.secondary">
                    Thời kì dễ thụ thai
                </Typography>
                <Typography variant="body1">
                    {formatDate(mockCycleData.fertileDays.start)} - {formatDate(mockCycleData.fertileDays.end)}
                </Typography>
            </Box>

            <Box sx={{ mt: 3, bgcolor: 'primary.light', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle2" color="primary.contrastText">
                    Độ dài chu kì trung bình: {mockCycleData.cycleLength} ngày
                </Typography>
                <Typography variant="subtitle2" color="primary.contrastText">
                    Độ dài kì kinh trung bình: {mockCycleData.periodLength} ngày
                </Typography>
            </Box>
        </Paper>
    );
};

export default CycleSummary; 