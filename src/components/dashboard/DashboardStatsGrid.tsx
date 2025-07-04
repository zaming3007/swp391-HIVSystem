import React, { useState, useEffect } from 'react';
import { Grid, CircularProgress, Box, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import BiotechIcon from '@mui/icons-material/Biotech';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

import StatCard from './StatCard';
import { dashboardService } from '../../services/dashboardService';
import { DashboardStats } from '../../services/mockData/dashboardMockData';

const DashboardStatsGrid: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const result = await dashboardService.fetchDashboardStats();
                setStats(result);
                setError(null);
            } catch (err) {
                console.error('Error fetching dashboard stats:', err);
                setError('Không thể tải dữ liệu thống kê tổng quan');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !stats) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <Typography color="error">{error || 'Không có dữ liệu'}</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Tổng số bệnh nhân"
                    value={stats.totalPatients.toLocaleString()}
                    icon={<PeopleAltIcon />}
                    color="primary"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Bệnh nhân mới (tháng này)"
                    value={stats.newPatientsThisMonth.toLocaleString()}
                    icon={<PersonAddIcon />}
                    color="secondary"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Tổng số lịch hẹn"
                    value={stats.totalAppointments.toLocaleString()}
                    icon={<EventIcon />}
                    color="info"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Lịch hẹn đã hoàn thành"
                    value={stats.completedAppointments.toLocaleString()}
                    icon={<CheckCircleIcon />}
                    color="success"
                    description={`${((stats.completedAppointments / stats.totalAppointments) * 100).toFixed(1)}% tỷ lệ hoàn thành`}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard
                    title="Tư vấn đang chờ"
                    value={stats.pendingConsultations.toLocaleString()}
                    icon={<QuestionAnswerIcon />}
                    color="warning"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard
                    title="CD4 trung bình"
                    value={`${stats.avgCD4Count.toLocaleString()} cells/mm³`}
                    icon={<BiotechIcon />}
                    color="info"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
                <StatCard
                    title="Tỷ lệ ức chế virus"
                    value={`${(stats.viralSuppressionRate * 100).toFixed(1)}%`}
                    icon={<HealthAndSafetyIcon />}
                    color="success"
                    description="Tỷ lệ bệnh nhân có tải lượng virus dưới ngưỡng phát hiện"
                />
            </Grid>
        </Grid>
    );
};

export default DashboardStatsGrid; 