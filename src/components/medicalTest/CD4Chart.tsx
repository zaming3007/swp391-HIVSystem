import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    useTheme,
    alpha,
    Divider
} from '@mui/material';
import { CD4Test } from '../../types';
import { format, parseISO } from 'date-fns';

interface CD4ChartProps {
    data: CD4Test[];
    height?: number;
}

const CD4Chart: React.FC<CD4ChartProps> = ({ data, height = 400 }) => {
    const theme = useTheme();
    const [chartPoints, setChartPoints] = useState<string>('');
    const [axisLabels, setAxisLabels] = useState<JSX.Element[]>([]);
    const [horizontalLines, setHorizontalLines] = useState<JSX.Element[]>([]);
    const [dataPoints, setDataPoints] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if (data.length === 0) return;

        // Sắp xếp dữ liệu theo thời gian
        const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Tìm giá trị lớn nhất và nhỏ nhất
        let minValue = Math.min(...sortedData.map(d => d.value));
        let maxValue = Math.max(...sortedData.map(d => d.value));

        // Đảm bảo có khoảng cách đủ lớn
        minValue = Math.max(0, Math.floor(minValue / 100) * 100);
        maxValue = Math.ceil(maxValue / 100) * 100 + 100; // Thêm không gian ở trên

        // Tính toán vị trí cho từng điểm
        const chartWidth = 100;
        const chartHeight = 100;
        const padding = { top: 10, right: 5, bottom: 25, left: 15 };

        const xScale = (index: number) => (chartWidth - padding.left - padding.right) / (sortedData.length - 1 || 1) * index + padding.left;
        const yScale = (value: number) => chartHeight - padding.bottom - ((value - minValue) / (maxValue - minValue || 1)) * (chartHeight - padding.top - padding.bottom);

        // Tạo điểm cho đường biểu đồ
        let points = '';
        const pointsArray: { x: number, y: number, value: number, date: string }[] = [];

        sortedData.forEach((d, i) => {
            const x = xScale(i);
            const y = yScale(d.value);
            points += `${x},${y} `;
            pointsArray.push({ x, y, value: d.value, date: d.date });
        });

        setChartPoints(points);

        // Tạo nhãn trục x
        const xLabels = sortedData.map((d, i) => (
            <text
                key={`x-${i}`}
                x={xScale(i)}
                y={chartHeight - padding.bottom / 2}
                textAnchor="middle"
                fontSize="4"
                fontWeight="bold"
                fill={theme.palette.text.primary}
            >
                {format(parseISO(d.date), 'MM/yyyy')}
            </text>
        ));

        // Tạo nhãn trục y và đường ngang
        const step = (maxValue - minValue) / 5;
        const yLabels: JSX.Element[] = [];
        const horizontalLines: JSX.Element[] = [];
        const yValues = [300, 400, 500, 600, 700];

        for (let i = 0; i <= 5; i++) {
            const value = minValue + step * i;
            const y = yScale(value);

            yLabels.push(
                <text
                    key={`y-${i}`}
                    x={padding.left - 2}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize="4"
                    fontWeight="bold"
                    fill={theme.palette.text.primary}
                >
                    {Math.round(value)}
                </text>
            );

            horizontalLines.push(
                <line
                    key={`h-${i}`}
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke={theme.palette.divider}
                    strokeWidth="0.5"
                    strokeDasharray="3,3"
                />
            );
        }

        // Vùng tham chiếu bình thường (500-1500)
        const normalRangeMinY = yScale(500);
        const normalRangeMaxY = yScale(1500);

        horizontalLines.push(
            <rect
                key="normal-range"
                x={padding.left}
                y={normalRangeMaxY}
                width={chartWidth - padding.left - padding.right}
                height={normalRangeMinY - normalRangeMaxY}
                fill={alpha(theme.palette.success.light, 0.2)}
            />
        );

        horizontalLines.push(
            <line
                key="normal-min"
                x1={padding.left}
                y1={normalRangeMinY}
                x2={chartWidth - padding.right}
                y2={normalRangeMinY}
                stroke={theme.palette.success.main}
                strokeWidth="1"
            />
        );

        // Tạo các điểm dữ liệu
        const dataPointsElements = sortedData.map((point, index) => {
            const x = xScale(index);
            const y = yScale(point.value);

            return (
                <g key={`point-${index}`}>
                    <circle
                        cx={x}
                        cy={y}
                        r="3"
                        fill={theme.palette.primary.main}
                        stroke={theme.palette.background.paper}
                        strokeWidth="1.5"
                    />
                    <text
                        x={x}
                        y={y - 5}
                        textAnchor="middle"
                        fontSize="4"
                        fontWeight="bold"
                        fill={theme.palette.primary.main}
                    >
                        {point.value}
                    </text>
                </g>
            );
        });

        setDataPoints(dataPointsElements);
        setAxisLabels([...xLabels, ...yLabels]);
        setHorizontalLines(horizontalLines);

    }, [data, theme.palette]);

    if (data.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="body1" color="text.secondary" align="center">
                        Không có dữ liệu CD4 để hiển thị
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom align="center" fontWeight="bold" color="primary">
                    Lịch sử CD4 (cells/mm³)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height, position: 'relative' }}>
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {/* Đường ngang và vùng bình thường */}
                        {horizontalLines}

                        {/* Trục y */}
                        <line
                            x1="15"
                            y1="75"
                            x2="15"
                            y2="10"
                            stroke={theme.palette.text.primary}
                            strokeWidth="1"
                        />

                        {/* Trục x */}
                        <line
                            x1="15"
                            y1="75"
                            x2="95"
                            y2="75"
                            stroke={theme.palette.text.primary}
                            strokeWidth="1"
                        />

                        {/* Đường biểu đồ */}
                        <polyline
                            points={chartPoints}
                            fill="none"
                            stroke={theme.palette.primary.main}
                            strokeWidth="1"
                        />

                        {/* Các điểm dữ liệu */}
                        {dataPoints}

                        {/* Nhãn trục */}
                        {axisLabels}
                    </svg>
                </Box>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight="medium">
                        * Vùng màu xanh nhạt (500-1500 cells/mm³) là khoảng tham chiếu bình thường
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default CD4Chart; 