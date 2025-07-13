import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';

interface TimeSlotDemoProps {
    onClose: () => void;
}

const TimeSlotDemo: React.FC<TimeSlotDemoProps> = ({ onClose }) => {
    const mockTimeSlots = [
        { time: '08:00', isAvailable: true, isBooked: false },
        { time: '08:30', isAvailable: false, isBooked: true, patientName: 'Nguyễn Văn A' },
        { time: '09:00', isAvailable: true, isBooked: false },
        { time: '09:30', isAvailable: false, isBooked: true, patientName: 'Trần Thị B' },
        { time: '10:00', isAvailable: true, isBooked: false },
        { time: '10:30', isAvailable: true, isBooked: false },
        { time: '11:00', isAvailable: false, isBooked: true, patientName: 'Lê Văn C' },
        { time: '11:30', isAvailable: true, isBooked: false },
    ];

    return (
        <Paper sx={{ p: 3, m: 2 }}>
            <Typography variant="h5" gutterBottom>
                🎯 Demo: Hiển thị TẤT CẢ khung giờ làm việc
            </Typography>

            <Typography variant="body1" paragraph>
                Bây giờ hệ thống sẽ hiển thị TẤT CẢ khung giờ làm việc của bác sĩ, bao gồm cả đã đặt và chưa đặt:
            </Typography>

            {/* Legend */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: 'success.main',
                        border: '1px solid',
                        borderColor: 'success.main',
                        borderRadius: 1
                    }} />
                    <Typography variant="caption">Có sẵn - Có thể đặt</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: '#ffebee',
                        border: '1px solid #e57373',
                        borderRadius: 1
                    }} />
                    <Typography variant="caption">Đã đặt - Không thể chọn</Typography>
                </Box>
            </Box>

            {/* Time Slots Demo */}
            <Grid container spacing={2}>
                {mockTimeSlots.map((slot) => (
                    <Grid item xs={6} sm={4} md={3} key={slot.time}>
                        <Button
                            variant="outlined"
                            color={slot.isBooked ? 'error' : 'success'}
                            fullWidth
                            disabled={slot.isBooked}
                            sx={{
                                mb: 1,
                                position: 'relative',
                                '&.Mui-disabled': {
                                    backgroundColor: '#ffebee',
                                    color: '#c62828',
                                    border: '1px solid #e57373'
                                }
                            }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" fontWeight="medium">
                                    {slot.time}
                                </Typography>
                                {slot.isBooked && (
                                    <Typography variant="caption" display="block">
                                        Đã đặt
                                        {slot.patientName && (
                                            <span> - {slot.patientName}</span>
                                        )}
                                    </Typography>
                                )}
                                {slot.isAvailable && (
                                    <Typography variant="caption" display="block" color="success.main">
                                        Có sẵn
                                    </Typography>
                                )}
                            </Box>
                        </Button>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={onClose}>
                    Hiểu rồi
                </Button>
            </Box>

            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                ✅ Hiển thị TẤT CẢ khung giờ làm việc của bác sĩ<br />
                ✅ Khung giờ đã đặt: màu đỏ, không thể chọn, hiển thị tên bệnh nhân<br />
                ✅ Khung giờ có sẵn: màu xanh, có thể đặt lịch<br />
                ✅ Không còn bị ẩn khung giờ đã đặt<br />
                ✅ Tự động refresh khi có lỗi trùng lịch
            </Typography>
        </Paper>
    );
};

export default TimeSlotDemo;
