import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Alert,
    Divider
} from '@mui/material';
import {
    Person as PatientIcon,
    LocalHospital as DoctorIcon,
    Medication as MedicationIcon,
    Notifications as NotificationIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckIcon
} from '@mui/icons-material';

const ARVWorkflowDemo: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            label: 'Bệnh nhân ghi nhận tuân thủ điều trị',
            description: 'Bệnh nhân sử dụng ứng dụng để ghi nhận việc uống thuốc hàng ngày',
            icon: <PatientIcon color="primary" />,
            details: [
                'Ghi nhận số liều đã uống trong ngày',
                'Thêm ghi chú về tác dụng phụ (nếu có)',
                'Hệ thống tự động tính tỷ lệ tuân thủ',
                'Dữ liệu được lưu vào database'
            ]
        },
        {
            label: 'Hệ thống phân tích và cảnh báo',
            description: 'Hệ thống tự động phân tích mức độ tuân thủ và tạo cảnh báo',
            icon: <TrendingUpIcon color="warning" />,
            details: [
                'Tính toán tỷ lệ tuân thủ theo tuần/tháng',
                'Phát hiện xu hướng giảm tuân thủ',
                'Tạo cảnh báo khi tuân thủ < 85%',
                'Gửi thông báo đến bác sĩ phụ trách'
            ]
        },
        {
            label: 'Bác sĩ nhận thông báo và xem chi tiết',
            description: 'Bác sĩ được thông báo và có thể xem chi tiết tuân thủ của bệnh nhân',
            icon: <NotificationIcon color="error" />,
            details: [
                'Nhận thông báo real-time',
                'Xem biểu đồ tuân thủ chi tiết',
                'Phân tích nguyên nhân giảm tuân thủ',
                'Xem lịch sử điều trị của bệnh nhân'
            ]
        },
        {
            label: 'Bác sĩ tương tác với bệnh nhân',
            description: 'Bác sĩ có thể gửi lời khuyên hoặc điều chỉnh phác đồ điều trị',
            icon: <DoctorIcon color="success" />,
            details: [
                'Gửi tin nhắn khuyến khích/nhắc nhở',
                'Điều chỉnh liều lượng thuốc',
                'Thay đổi phác đồ điều trị',
                'Lên lịch tái khám'
            ]
        },
        {
            label: 'Bệnh nhân nhận phản hồi',
            description: 'Bệnh nhân nhận được phản hồi từ bác sĩ và cập nhật điều trị',
            icon: <MedicationIcon color="primary" />,
            details: [
                'Nhận tin nhắn từ bác sĩ',
                'Cập nhật phác đồ mới (nếu có)',
                'Theo dõi hướng dẫn mới',
                'Tiếp tục ghi nhận tuân thủ'
            ]
        }
    ];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                🔄 Workflow Tương Tác Bác Sĩ - Bệnh Nhân
            </Typography>
            <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
                Quy trình quản lý ARV thông minh trong hệ thống HIV Healthcare
            </Typography>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', backgroundColor: 'primary.light', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PatientIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Bệnh nhân</Typography>
                            </Box>
                            <Typography variant="body2">
                                • Ghi nhận tuân thủ hàng ngày<br/>
                                • Nhận thông báo từ bác sĩ<br/>
                                • Theo dõi tiến trình điều trị
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', backgroundColor: 'success.light', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <DoctorIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Bác sĩ</Typography>
                            </Box>
                            <Typography variant="body2">
                                • Theo dõi tuân thủ real-time<br/>
                                • Điều chỉnh phác đồ điều trị<br/>
                                • Tương tác trực tiếp với bệnh nhân
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', backgroundColor: 'warning.light', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUpIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Hệ thống</Typography>
                            </Box>
                            <Typography variant="body2">
                                • Phân tích dữ liệu tự động<br/>
                                • Cảnh báo sớm<br/>
                                • Thông báo real-time
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Workflow Stepper */}
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Chi tiết quy trình
                    </Typography>
                    
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel
                                    optional={
                                        index === steps.length - 1 ? (
                                            <Typography variant="caption">Bước cuối</Typography>
                                        ) : null
                                    }
                                    icon={step.icon}
                                >
                                    <Typography variant="h6">{step.label}</Typography>
                                </StepLabel>
                                <StepContent>
                                    <Typography sx={{ mb: 2 }}>
                                        {step.description}
                                    </Typography>
                                    
                                    <Paper sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Chi tiết thực hiện:
                                        </Typography>
                                        <List dense>
                                            {step.details.map((detail, detailIndex) => (
                                                <ListItem key={detailIndex} sx={{ py: 0.5 }}>
                                                    <ListItemIcon sx={{ minWidth: 30 }}>
                                                        <CheckIcon color="success" fontSize="small" />
                                                    </ListItemIcon>
                                                    <ListItemText primary={detail} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Paper>

                                    <Box sx={{ mb: 2 }}>
                                        <div>
                                            <Button
                                                variant="contained"
                                                onClick={handleNext}
                                                sx={{ mt: 1, mr: 1 }}
                                                disabled={index === steps.length - 1}
                                            >
                                                {index === steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                                            </Button>
                                            <Button
                                                disabled={index === 0}
                                                onClick={handleBack}
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                Quay lại
                                            </Button>
                                        </div>
                                    </Box>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>

                    {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                    🎉 Workflow hoàn thành!
                                </Typography>
                                <Typography>
                                    Quy trình tương tác giữa bác sĩ và bệnh nhân đã được thiết lập hoàn chỉnh. 
                                    Hệ thống sẽ tự động hỗ trợ việc theo dõi và quản lý điều trị ARV hiệu quả.
                                </Typography>
                            </Alert>
                            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                Xem lại từ đầu
                            </Button>
                        </Paper>
                    )}
                </CardContent>
            </Card>

            {/* Benefits */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        🎯 Lợi ích của workflow
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Cho bệnh nhân:
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Nhận được sự theo dõi chặt chẽ từ bác sĩ" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Được hướng dẫn kịp thời khi có vấn đề" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Tăng động lực tuân thủ điều trị" />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Cho bác sĩ:
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Theo dõi bệnh nhân real-time" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Can thiệp kịp thời khi cần thiết" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Tối ưu hóa hiệu quả điều trị" />
                                </ListItem>
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ARVWorkflowDemo;
