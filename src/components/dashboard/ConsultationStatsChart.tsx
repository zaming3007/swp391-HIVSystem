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
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { ConsultationStatsData } from '../../services/mockData/dashboardMockData';

interface ConsultationStatsChartProps {
    height?: number;
}

const ConsultationStatsChart: React.FC<ConsultationStatsChartProps> = ({ height = 400 }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ConsultationStatsData[]>([]);
    const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await dashboardService.fetchConsultationStats(period);
                setData(result);
                setError(null);
            } catch (err) {
                console.error('Error fetching consultation stats data:', err);
                setError('Không thể tải dữ liệu thống kê tư vấn');
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
                        Câu hỏi mới: <strong>{payload[0].value}</strong>
                    </Typography>
                    <Typography variant="body2" color="success.main">
                        Câu hỏi đã trả lời: <strong>{payload[1].value}</strong>
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                        Thời gian phản hồi trung bình: <strong>{payload[2].value}</strong> giờ
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader
                title="Thống kê tư vấn trực tuyến"
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
                            <ComposedChart
                                data={data}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                {/* @ts-ignore */}
                                <CartesianGrid strokeDasharray="3 3" />
                                {/* @ts-ignore */}
                                <XAxis dataKey="month" />
                                {/* @ts-ignore */}
                                <YAxis yAxisId="left" />
                                {/* @ts-ignore */}
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip content={<CustomTooltip />} />
                                {/* @ts-ignore */}
                                <Legend />
                                {/* @ts-ignore */}
                                <Bar
                                    yAxisId="left"
                                    dataKey="newQuestions"
                                    name="Câu hỏi mới"
                                    fill={theme.palette.primary.main}
                                />
                                {/* @ts-ignore */}
                                <Bar
                                    yAxisId="left"
                                    dataKey="answeredQuestions"
                                    name="Câu hỏi đã trả lời"
                                    fill={theme.palette.success.main}
                                />
                                {/* @ts-ignore */}
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="avgResponseTime"
                                    name="Thời gian phản hồi (giờ)"
                                    stroke={theme.palette.warning.main}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 8 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                * Số lượng câu hỏi và thời gian phản hồi trung bình
                            </Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ConsultationStatsChart; 