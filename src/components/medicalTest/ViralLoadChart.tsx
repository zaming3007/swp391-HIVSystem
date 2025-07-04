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
import { ViralLoadTest } from '../../types';
import { format, parseISO } from 'date-fns';

interface ViralLoadChartProps {
    data: ViralLoadTest[];
    height?: number;
}

const ViralLoadChart: React.FC<ViralLoadChartProps> = ({ data, height = 400 }) => {
    const theme = useTheme();
    const [chartPoints, setChartPoints] = useState<string>('');
    const [axisLabels, setAxisLabels] = useState<JSX.Element[]>([]);
    const [horizontalLines, setHorizontalLines] = useState<JSX.Element[]>([]);
    const [dataPoints, setDataPoints] = useState<JSX.Element[]>([]);

    // Chuyển đổi giá trị sang log10 để biểu diễn
    const toLog10 = (value: number): number => {
        return value === 0 ? 0 : Math.log10(Math.max(1, value));
    };

    // Chuyển đổi giá trị log10 sang thang đo thực
    const fromLog10 = (value: number): number => {
        return Math.pow(10, value);
    };

    useEffect(() => {
        if (data.length === 0) return;

        // Sắp xếp dữ liệu theo thời gian
        const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Chuyển đổi giá trị sang log10 để biểu diễn
        const logValues = sortedData.map(d => toLog10(d.value));

        // Tìm giá trị lớn nhất và nhỏ nhất (log10)
        let minValue = Math.min(...logValues);
        let maxValue = Math.max(...logValues);

        // Đảm bảo có khoảng cách đủ lớn
        minValue = Math.max(0, Math.floor(minValue));
        maxValue = Math.ceil(maxValue) + 0.5; // Thêm không gian ở trên

        // Tính toán vị trí cho từng điểm
        const chartWidth = 100;
        const chartHeight = 100;
        const padding = { top: 10, right: 5, bottom: 25, left: 15 };

        const xScale = (index: number) => (chartWidth - padding.left - padding.right) / (sortedData.length - 1 || 1) * index + padding.left;
        const yScale = (value: number) => chartHeight - padding.bottom - ((value - minValue) / (maxValue - minValue || 1)) * (chartHeight - padding.top - padding.bottom);

        // Tạo điểm cho đường biểu đồ
        let points = '';

        sortedData.forEach((d, i) => {
            const x = xScale(i);
            const y = yScale(toLog10(d.value));
            points += `${x},${y} `;
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
        const yLabels: JSX.Element[] = [];
        const horizontalLines: JSX.Element[] = [];

        // Tạo các điểm chia trục y theo thang log
        const yValues = [0, 1, 2, 3, 4, 5];

        yValues.forEach(value => {
            if (value >= minValue && value <= maxValue) {
                const y = yScale(value);

                yLabels.push(
                    <text
                        key={`y-${value}`}
                        x={padding.left - 2}
                        y={y}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fontSize="4"
                        fontWeight="bold"
                        fill={theme.palette.text.primary}
                    >
                        {value === 0 ? '0' : `10${value}`}
                    </text>
                );

                horizontalLines.push(
                    <line
                        key={`h-${value}`}
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
        });

        // Vùng tham chiếu không phát hiện virus (dưới 20 copies/mL)
        const undetectableY = yScale(toLog10(20));

        horizontalLines.push(
            <rect
                key="undetectable-range"
                x={padding.left}
                y={yScale(maxValue)}
                width={chartWidth - padding.left - padding.right}
                height={undetectableY - yScale(maxValue)}
                fill={alpha(theme.palette.success.light, 0.2)}
            />
        );

        // Đường ngưỡng phát hiện virus
        horizontalLines.push(
            <line
                key="detection-limit"
                x1={padding.left}
                y1={undetectableY}
                x2={chartWidth - padding.right}
                y2={undetectableY}
                stroke={theme.palette.error.main}
                strokeWidth="1"
                strokeDasharray="4,2"
            />
        );

        // Tạo các điểm dữ liệu
        const dataPointsElements = sortedData.map((point, index) => {
            const x = xScale(index);
            const y = yScale(toLog10(point.value));

            return (
                <g key={`point-${index}`}>
                    <circle
                        cx={x}
                        cy={y}
                        r="3"
                        fill={point.value < 20 ? theme.palette.success.main : theme.palette.error.main}
                        stroke={theme.palette.background.paper}
                        strokeWidth="1.5"
                    />
                    <text
                        x={x}
                        y={y - 5}
                        textAnchor="middle"
                        fontSize="4"
                        fontWeight="bold"
                        fill={point.value < 20 ? theme.palette.success.main : theme.palette.error.main}
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
                        Không có dữ liệu tải lượng virus để hiển thị
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom align="center" fontWeight="bold" color="primary">
                    Tải lượng virus (copies/mL)
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height, position: 'relative' }}>
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {/* Đường ngang và vùng không phát hiện */}
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
                            stroke={theme.palette.error.main}
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
                        * Đường đứt đoạn màu đỏ (20 copies/mL) là ngưỡng phát hiện virus
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight="medium">
                        * Vùng màu xanh nhạt là khoảng không phát hiện virus
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ViralLoadChart; 