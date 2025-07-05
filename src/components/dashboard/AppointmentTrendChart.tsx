import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    ButtonGroup,
    Button,
    useTheme,
    CircularProgress
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { AppointmentTrendData } from '../../services/mockData/dashboardMockData';

interface AppointmentTrendChartProps {
    height?: number;
}

const AppointmentTrendChart: React.FC<AppointmentTrendChartProps> = ({ height = 400 }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AppointmentTrendData[]>([]);
    const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await dashboardService.fetchAppointmentTrend(period);
                setData(result);
                setError(null);
            } catch (err) {
                console.error('Error fetching appointment trend data:', err);
                setError('Không thể tải dữ liệu xu hướng lịch hẹn');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period]);

    const handlePeriodChange = (newPeriod: 'month' | 'quarter' | 'year') => {
        setPeriod(newPeriod);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        backgroundColor: 'background.paper',
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        boxShadow: theme.shadows[2]
                    }}
                >
                    <Typography variant="subtitle2">{label}</Typography>
                    <Typography variant="body2" color="primary.main">
                        Đã đặt lịch: <strong>{payload[0].value}</strong>
                    </Typography>
                    <Typography variant="body2" color="success.main">
                        Đã hoàn thành: <strong>{payload[1].value}</strong>
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                        Đã hủy: <strong>{payload[2].value}</strong>
                    </Typography>
                    <Typography variant="body2" color="error.main">
                        Không đến: <strong>{payload[3].value}</strong>
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader
                title="Thống kê lịch hẹn theo thời gian"
                action={
                    <ButtonGroup size="small" variant="outlined">
                        <Button
                            onClick={() => handlePeriodChange('month')}
                            variant={period === 'month' ? 'contained' : 'outlined'}
                        >
                            Tháng
                        </Button>
                        <Button
                            onClick={() => handlePeriodChange('quarter')}
                            variant={period === 'quarter' ? 'contained' : 'outlined'}
                        >
                            Quý
                        </Button>
                        <Button
                            onClick={() => handlePeriodChange('year')}
                            variant={period === 'year' ? 'contained' : 'outlined'}
                        >
                            Năm
                        </Button>
                    </ButtonGroup>
                }
            />
            <CardContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height }}>
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ height, width: '100%' }}>
                        {/* @ts-ignore */}
                        <ResponsiveContainer width="100%" height="100%">
                            {/* @ts-ignore */}
                            <BarChart
                                data={data}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                {/* @ts-ignore */}
                                <CartesianGrid strokeDasharray="3 3" />
                                {/* @ts-ignore */}
                                <XAxis dataKey="month" />
                                {/* @ts-ignore */}
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                {/* @ts-ignore */}
                                <Legend />
                                {/* @ts-ignore */}
                                <Bar dataKey="scheduled" name="Đã đặt lịch" fill={theme.palette.primary.main} />
                                {/* @ts-ignore */}
                                <Bar dataKey="completed" name="Đã hoàn thành" fill={theme.palette.success.main} />
                                {/* @ts-ignore */}
                                <Bar dataKey="cancelled" name="Đã hủy" fill={theme.palette.warning.main} />
                                {/* @ts-ignore */}
                                <Bar dataKey="noShow" name="Không đến" fill={theme.palette.error.main} />
                            </BarChart>
                        </ResponsiveContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                * Số lượng lịch hẹn theo trạng thái
                            </Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default AppointmentTrendChart; 