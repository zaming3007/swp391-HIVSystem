import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    SvgIconProps,
    useTheme
} from '@mui/material';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactElement<SvgIconProps>;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    description,
    trend,
    color = 'primary'
}) => {
    const theme = useTheme();

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                            {value}
                        </Typography>
                        {description && (
                            <Typography variant="body2" color="text.secondary">
                                {description}
                            </Typography>
                        )}
                        {trend && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography
                                    variant="body2"
                                    color={trend.isPositive ? 'success.main' : 'error.main'}
                                    sx={{ fontWeight: 'medium' }}
                                >
                                    {trend.isPositive ? '+' : ''}{trend.value}%
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                    so với tháng trước
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: theme.palette[color].light,
                            color: theme.palette[color].main,
                            borderRadius: '50%',
                            width: 48,
                            height: 48,
                            p: 1
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatCard; 