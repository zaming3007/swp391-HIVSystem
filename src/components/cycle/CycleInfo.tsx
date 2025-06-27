import { Paper, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Circle } from '@mui/icons-material';

const CycleInfo = () => {
    const cyclePhases = [
        {
            name: 'Kì kinh nguyệt',
            description: 'Thời kì xuất huyết, kéo dài 3-7 ngày',
            color: 'pink'
        },
        {
            name: 'Thời kì rụng trứng',
            description: 'Xảy ra khoảng ngày thứ 14 của chu kì',
            color: '#90caf9'
        },
        {
            name: 'Thời kì dễ thụ thai',
            description: '5 ngày trước và sau ngày rụng trứng',
            color: '#81c784'
        }
    ];

    const healthTips = [
        'Uống đủ nước và giữ cơ thể đủ ẩm',
        'Tập thể dục nhẹ nhàng để giảm đau bụng kinh',
        'Ăn đủ chất dinh dưỡng, đặc biệt là sắt',
        'Tránh caffeine và rượu bia',
        'Nghỉ ngơi đầy đủ khi có dấu hiệu mệt mỏi'
    ];

    return (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary">
                Thông tin hữu ích
            </Typography>

            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Các giai đoạn của chu kì
                </Typography>

                <List dense>
                    {cyclePhases.map((phase, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <Circle sx={{ color: phase.color, fontSize: 12 }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={phase.name}
                                secondary={phase.description}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                                secondaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Lời khuyên sức khỏe
                </Typography>

                <List dense>
                    {healthTips.map((tip, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                <Circle sx={{ color: 'primary.main', fontSize: 8 }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={tip}
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box sx={{ mt: 3, bgcolor: 'info.light', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="info.contrastText">
                    Lưu ý: Thông tin này chỉ mang tính chất tham khảo. Vui lòng tham khảo ý kiến bác sĩ nếu có bất kỳ lo ngại nào về sức khỏe.
                </Typography>
            </Box>
        </Paper>
    );
};

export default CycleInfo; 