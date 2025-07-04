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
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    AreaChart,
    ReferenceLine
} from 'recharts';
import { dashboardService } from '../../services/dashboardService';
import { CD4TrendData } from '../../services/mockData/dashboardMockData';

interface CD4TrendChartProps {
    height?: number;
}

const CD4TrendChart: React.FC<CD4TrendChartProps> = ({ height = 400 }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CD4TrendData[]>([]);
    const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await dashboardService.fetchCD4Trend(period);
                setData(result);
                setError(null);
            } catch (err) {
                console.error('Error fetching CD4 trend data:', err);
                setError('Không thể tải dữ liệu xu hướng CD4');
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
                    <Typography variant="body2" color="primary">
                        CD4 trung bình: <strong>{payload[0].value}</strong> cells/mm³
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Thấp nhất: <strong>{payload[1].value}</strong> cells/mm³
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Cao nhất: <strong>{payload[2].value}</strong> cells/mm³
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader
                title="Xu hướng CD4 theo thời gian"
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
                            <AreaChart
                                data={data}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                {/* @ts-ignore */}
                                <XAxis dataKey="month" />
                                {/* @ts-ignore */}
                                <YAxis domain={[0, 'auto']} />
                                <Tooltip content={<CustomTooltip />} />
                                {/* @ts-ignore */}
                                <Legend />
                                {/* @ts-ignore */}
                                <ReferenceLine y={500} stroke={theme.palette.warning.main} strokeDasharray="3 3" />
                                {/* @ts-ignore */}
                                <ReferenceLine y={1500} stroke={theme.palette.success.main} strokeDasharray="3 3" />
                                {/* @ts-ignore */}
                                <Area
                                    type="monotone"
                                    dataKey="minCD4"
                                    name="CD4 thấp nhất"
                                    stroke={theme.palette.grey[500]}
                                    fill={theme.palette.grey[200]}
                                    activeDot={{ r: 6 }}
                                    stackId="1"
                                />
                                {/* @ts-ignore */}
                                <Area
                                    type="monotone"
                                    dataKey="avgCD4"
                                    name="CD4 trung bình"
                                    stroke={theme.palette.primary.main}
                                    fill={theme.palette.primary.light}
                                    activeDot={{ r: 8 }}
                                />
                                {/* @ts-ignore */}
                                <Area
                                    type="monotone"
                                    dataKey="maxCD4"
                                    name="CD4 cao nhất"
                                    stroke={theme.palette.success.main}
                                    fill={theme.palette.success.light}
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                * Vùng tham chiếu bình thường: 500-1500 cells/mm³
                            </Typography>
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default CD4TrendChart; 