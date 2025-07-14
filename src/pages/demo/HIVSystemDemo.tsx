import React, { useState } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Box,
    Tabs,
    Tab,
    Button,
    Alert,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip
} from '@mui/material';
import {
    Person as PersonIcon,
    LocalHospital as DoctorIcon,
    Science as TestIcon,
    Medication as ARVIcon,
    CheckCircle as CheckIcon,
    Star as StarIcon,
    Medication as MedicationIcon
} from '@mui/icons-material';
import TestResults from '../customer/TestResults';
import ARVManagement from '../customer/ARVManagement';
import PatientTestResults from '../doctor/PatientTestResults';
import ARVWorkflowDemo from './ARVWorkflowDemo';

const HIVSystemDemo: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const features = [
        {
            title: 'Xem kết quả xét nghiệm',
            description: 'Bệnh nhân có thể xem CD4, viral load và các xét nghiệm khác',
            icon: <TestIcon color="primary" />
        },
        {
            title: 'Quản lý phác đồ ARV',
            description: 'Theo dõi phác đồ điều trị hiện tại và lịch sử điều trị',
            icon: <ARVIcon color="secondary" />
        },
        {
            title: 'Ghi nhận tuân thủ điều trị',
            description: 'Bệnh nhân tự ghi nhận việc uống thuốc hàng ngày',
            icon: <CheckIcon color="success" />
        },
        {
            title: 'Quản lý bệnh nhân cho bác sĩ',
            description: 'Bác sĩ có thể kê đơn, theo dõi và cập nhật kết quả',
            icon: <DoctorIcon color="info" />
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    🏥 HIV Healthcare System Demo
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    Hệ thống quản lý điều trị HIV toàn diện cho bệnh nhân và bác sĩ
                </Typography>

                <Alert severity="info" sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="body1" fontWeight="medium">
                        🚀 Demo Features: Test Results Management & ARV Treatment Tracking
                    </Typography>
                    <Typography variant="body2">
                        Đây là demo 2 chức năng chính: Quản lý kết quả xét nghiệm và Theo dõi phác đồ ARV
                    </Typography>
                </Alert>
            </Box>

            {/* Features Overview */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        ✨ Tính năng chính
                    </Typography>
                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                    <Box sx={{ mr: 2, mt: 0.5 }}>
                                        {feature.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {feature.description}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* Demo Tabs */}
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                        <Tab
                            icon={<PersonIcon />}
                            label="Giao diện Bệnh nhân - Kết quả xét nghiệm"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<ARVIcon />}
                            label="Giao diện Bệnh nhân - Quản lý ARV"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<DoctorIcon />}
                            label="Giao diện Bác sĩ - Quản lý bệnh nhân"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<MedicationIcon />}
                            label="🔄 ARV Workflow Demo"
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>

                <CardContent>
                    {/* Customer Test Results */}
                    {tabValue === 0 && (
                        <Box>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                <Typography variant="body1" fontWeight="medium">
                                    👤 Giao diện Bệnh nhân - Xem kết quả xét nghiệm
                                </Typography>
                                <Typography variant="body2">
                                    Bệnh nhân có thể xem CD4 count, viral load và các xét nghiệm khác một cách dễ hiểu
                                </Typography>
                            </Alert>
                            <TestResults />
                        </Box>
                    )}

                    {/* Customer ARV Management */}
                    {tabValue === 1 && (
                        <Box>
                            <Alert severity="info" sx={{ mb: 3 }}>
                                <Typography variant="body1" fontWeight="medium">
                                    💊 Giao diện Bệnh nhân - Quản lý phác đồ ARV
                                </Typography>
                                <Typography variant="body2">
                                    Bệnh nhân có thể xem phác đồ hiện tại, lịch sử điều trị và ghi nhận tuân thủ
                                </Typography>
                            </Alert>
                            <ARVManagement />
                        </Box>
                    )}

                    {/* Doctor Interface */}
                    {tabValue === 2 && (
                        <Box>
                            <Alert severity="warning" sx={{ mb: 3 }}>
                                <Typography variant="body1" fontWeight="medium">
                                    👨‍⚕️ Giao diện Bác sĩ - Quản lý kết quả xét nghiệm bệnh nhân
                                </Typography>
                                <Typography variant="body2">
                                    Bác sĩ có thể xem, thêm và cập nhật kết quả xét nghiệm cho bệnh nhân
                                </Typography>
                            </Alert>
                            <PatientTestResults
                                patientId="customer-001"
                                patientName="Nguyễn Văn A"
                            />
                        </Box>
                    )}

                    {/* ARV Workflow Demo */}
                    {tabValue === 3 && (
                        <Box>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                <Typography variant="body1" fontWeight="medium">
                                    🔄 ARV Workflow Demo - Tương tác Bác sĩ - Bệnh nhân
                                </Typography>
                                <Typography variant="body2">
                                    Demo quy trình tương tác hoàn chỉnh giữa bác sĩ và bệnh nhân thông qua quản lý ARV
                                </Typography>
                            </Alert>
                            <ARVWorkflowDemo />
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Technical Implementation */}
            <Card sx={{ mt: 4 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        🔧 Triển khai kỹ thuật
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Backend (.NET 8.0 Web API)
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="TestResultsController - Quản lý kết quả xét nghiệm" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="PatientARVController - Quản lý phác đồ ARV" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="PostgreSQL Database với bảng TestResults" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Entity Framework Core ORM" />
                                </ListItem>
                            </List>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" gutterBottom>
                                Frontend (React + Material-UI)
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="TestResults.tsx - Giao diện bệnh nhân" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="ARVManagement.tsx - Quản lý phác đồ" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="PatientTestResults.tsx - Giao diện bác sĩ" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="TypeScript Services với API integration" />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>
                        📊 Dữ liệu Demo
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Chip label="CD4 Count: 450 cells/μL" color="warning" />
                        </Grid>
                        <Grid item>
                            <Chip label="Viral Load: Undetectable" color="success" />
                        </Grid>
                        <Grid item>
                            <Chip label="Phác đồ: TDF/3TC/EFV" color="primary" />
                        </Grid>
                        <Grid item>
                            <Chip label="Tuân thủ: 96.67%" color="success" />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            💡 <strong>Lưu ý:</strong> Đây là demo với dữ liệu mẫu. Trong thực tế, dữ liệu sẽ được lấy từ database PostgreSQL
                            thông qua các API endpoints đã được triển khai.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default HIVSystemDemo;
