import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Tabs,
    Tab,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import DashboardStatsGrid from '../../components/dashboard/DashboardStatsGrid';
import CD4TrendChart from '../../components/dashboard/CD4TrendChart';
import AppointmentTrendChart from '../../components/dashboard/AppointmentTrendChart';
import ConsultationStatsChart from '../../components/dashboard/ConsultationStatsChart';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`dashboard-tabpanel-${index}`}
            aria-labelledby={`dashboard-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const a11yProps = (index: number) => {
    return {
        id: `dashboard-tab-${index}`,
        'aria-controls': `dashboard-tabpanel-${index}`,
    };
};

const DashboardPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard & Báo cáo
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Thống kê và báo cáo tổng quan về hoạt động của hệ thống
                </Typography>

                <Paper sx={{ mt: 3 }}>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Thống kê tổng quan
                        </Typography>
                        <DashboardStatsGrid />
                    </Box>
                </Paper>

                <Paper sx={{ mt: 3 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            variant={isMobile ? "scrollable" : "fullWidth"}
                            scrollButtons={isMobile ? "auto" : undefined}
                            aria-label="Các báo cáo thống kê"
                        >
                            <Tab label="Chỉ số sức khỏe" {...a11yProps(0)} />
                            <Tab label="Lịch hẹn" {...a11yProps(1)} />
                            <Tab label="Tư vấn" {...a11yProps(2)} />
                        </Tabs>
                    </Box>

                    <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <CD4TrendChart height={400} />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                        <AppointmentTrendChart height={400} />
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                        <ConsultationStatsChart height={400} />
                    </TabPanel>
                </Paper>

                <Box sx={{ mt: 4, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        * Dữ liệu được cập nhật vào ngày {new Date().toLocaleDateString('vi-VN')}
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default DashboardPage; 