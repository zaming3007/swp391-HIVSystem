import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Typography,
    Stack,
    Alert,
    Chip,
    Divider
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    Forum as ForumIcon,
    Healing as HealingIcon,
    Notifications as NotificationsIcon,
    ArrowForward as ArrowForwardIcon,
    Dashboard as DashboardIcon,
    AdminPanelSettings as AdminIcon,
    MedicalServices as DoctorIcon,
    SupportAgent as StaffIcon
} from '@mui/icons-material';
import { RootState } from '../../store/store';
import Chatbot from '../../components/Chatbot/Chatbot';

const HomePage: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    const getManagementLink = () => {
        if (!user) return null;

        switch (user.role) {
            case 'admin':
                return {
                    title: 'Quản trị hệ thống',
                    description: 'Truy cập bảng điều khiển quản trị để quản lý toàn bộ hệ thống',
                    link: '/admin',
                    icon: <AdminIcon />,
                    color: '#7E57C2'
                };
            case 'staff':
                return {
                    title: 'Giao diện nhân viên',
                    description: 'Quản lý lịch hẹn, tư vấn và hỗ trợ bệnh nhân',
                    link: '/staff',
                    icon: <StaffIcon />,
                    color: '#26A69A'
                };
            case 'doctor':
                return {
                    title: 'Giao diện bác sĩ',
                    description: 'Quản lý lịch hẹn, tư vấn và hồ sơ bệnh nhân',
                    link: '/doctor',
                    icon: <DoctorIcon />,
                    color: '#FF7043'
                };
            default:
                return null;
        }
    };

    const managementInfo = getManagementLink();

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    bgcolor: 'primary.light',
                    color: 'white',
                    py: { xs: 6, md: 10 },
                    mb: 8,
                    overflow: 'hidden',
                    backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.1)',
                        zIndex: 1
                    }
                }}
            >
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 6,
                        alignItems: 'center',
                        minHeight: { xs: 'auto', md: '500px' }
                    }}>
                        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                            <Typography
                                variant="h2"
                                component="h1"
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    lineHeight: 1.2,
                                    mb: 3
                                }}
                            >
                                Trung Tâm Chăm Sóc HIV/AIDS
                            </Typography>
                            <Typography
                                variant="h5"
                                paragraph
                                sx={{
                                    fontWeight: 300,
                                    opacity: 0.95,
                                    mb: 4,
                                    lineHeight: 1.6
                                }}
                            >
                                Cung cấp dịch vụ chăm sóc và điều trị HIV chất lượng cao với đội ngũ y tế chuyên nghiệp,
                                trong môi trường an toàn và bảo mật.
                            </Typography>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={3}
                                sx={{ mt: 5 }}
                                alignItems="center"
                            >
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    component={RouterLink}
                                    to="/appointment"
                                    endIcon={<CalendarIcon />}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Đặt Lịch Hẹn
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    component={RouterLink}
                                    to="/consultation"
                                    endIcon={<ForumIcon />}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        fontSize: '1.1rem',
                                        fontWeight: 600,
                                        borderRadius: 3,
                                        borderColor: 'white',
                                        color: 'white',
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            transform: 'translateY(-2px)'
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Tư Vấn Trực Tuyến
                                </Button>
                            </Stack>
                        </Box>
                        <Box sx={{
                            flex: 1,
                            display: { xs: 'none', md: 'block' },
                            textAlign: 'center'
                        }}>
                            <Box
                                component="img"
                                src="/hivicon.png"
                                alt="HIV Care Center"
                                sx={{
                                    width: '100%',
                                    maxWidth: 400,
                                    height: 'auto',
                                    filter: 'brightness(1.2)',
                                    opacity: 0.9
                                }}
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Quick Stats Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
                    gap: 3,
                    mb: 6
                }}>
                    <Card sx={{
                        textAlign: 'center',
                        p: 3,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>24/7</Typography>
                        <Typography variant="body1">Hỗ trợ khẩn cấp</Typography>
                    </Card>
                    <Card sx={{
                        textAlign: 'center',
                        p: 3,
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>100%</Typography>
                        <Typography variant="body1">Bảo mật thông tin</Typography>
                    </Card>
                    <Card sx={{
                        textAlign: 'center',
                        p: 3,
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>10+</Typography>
                        <Typography variant="body1">Năm kinh nghiệm</Typography>
                    </Card>
                    <Card sx={{
                        textAlign: 'center',
                        p: 3,
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        color: 'white',
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>1000+</Typography>
                        <Typography variant="body1">Bệnh nhân tin tưởng</Typography>
                    </Card>
                </Box>
            </Container>
            {/* Services Section */}
            <Container maxWidth="lg" sx={{ mb: 8 }}>
                <Typography
                    variant="h3"
                    component="h2"
                    textAlign="center"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        mb: 6,
                        color: 'primary.main'
                    }}
                >
                    Dịch Vụ Chăm Sóc Toàn Diện
                </Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                    gap: 4
                }}>
                    <Card sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.15)'
                        }
                    }}>
                        <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3
                        }}>
                            <HealingIcon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                            Điều Trị HIV
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Điều trị ARV hiện đại, theo dõi sức khỏe định kỳ và hỗ trợ tuân thủ điều trị.
                        </Typography>
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="/services"
                            sx={{ borderRadius: 2 }}
                        >
                            Tìm hiểu thêm
                        </Button>
                    </Card>

                    <Card sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.15)'
                        }
                    }}>
                        <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3
                        }}>
                            <ForumIcon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                            Tư Vấn Trực Tuyến
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Tư vấn y tế trực tuyến bảo mật với đội ngũ chuyên gia giàu kinh nghiệm.
                        </Typography>
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="/consultation"
                            sx={{ borderRadius: 2 }}
                        >
                            Đặt câu hỏi
                        </Button>
                    </Card>

                    <Card sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: 3,
                        boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.15)'
                        }
                    }}>
                        <Box sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3
                        }}>
                            <CalendarIcon sx={{ fontSize: 40, color: 'white' }} />
                        </Box>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                            Đặt Lịch Hẹn
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            Đặt lịch khám bệnh, xét nghiệm và tái khám một cách dễ dàng và nhanh chóng.
                        </Typography>
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="/appointment"
                            sx={{ borderRadius: 2 }}
                        >
                            Đặt lịch ngay
                        </Button>
                    </Card>
                </Box>
            </Container>

            {/* Management Panel for Staff/Doctor/Admin */}
            {
                managementInfo && (
                    <Container maxWidth="lg" sx={{ mb: 6 }}>
                        <Alert
                            severity="info"
                            sx={{
                                mb: 3,
                                '& .MuiAlert-message': { width: '100%' }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ color: managementInfo.color }}>
                                        {managementInfo.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            Chào mừng, {user?.name}!
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2">
                                                Bạn đang đăng nhập với vai trò:
                                            </Typography>
                                            <Chip
                                                label={user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'staff' ? 'Nhân viên' : 'Bác sĩ'}
                                                size="small"
                                                color={user?.role === 'admin' ? 'secondary' : user?.role === 'staff' ? 'info' : 'warning'}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                <Button
                                    variant="contained"
                                    component={RouterLink}
                                    to={managementInfo.link}
                                    startIcon={<DashboardIcon />}
                                    sx={{
                                        bgcolor: managementInfo.color,
                                        '&:hover': {
                                            bgcolor: managementInfo.color,
                                            opacity: 0.8
                                        }
                                    }}
                                >
                                    Vào trang quản lý
                                </Button>
                            </Box>
                        </Alert>

                        <Card sx={{ p: 3, bgcolor: 'grey.50' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Box sx={{ color: managementInfo.color }}>
                                    {managementInfo.icon}
                                </Box>
                                <Typography variant="h5" component="h2">
                                    {managementInfo.title}
                                </Typography>
                            </Box>
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {managementInfo.description}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    component={RouterLink}
                                    to={managementInfo.link}
                                    sx={{
                                        bgcolor: managementInfo.color,
                                        '&:hover': {
                                            bgcolor: managementInfo.color,
                                            opacity: 0.8
                                        }
                                    }}
                                >
                                    Truy cập ngay
                                </Button>
                                <Button
                                    variant="outlined"
                                    component={RouterLink}
                                    to="/profile"
                                >
                                    Xem hồ sơ
                                </Button>
                            </Stack>
                        </Card>
                    </Container>
                )
            }

            {/* Services Overview */}
            <Container maxWidth="lg" sx={{ my: 8 }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom>
                    Dịch Vụ Của Chúng Tôi
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
                    Các dịch vụ chăm sóc sức khỏe và điều trị HIV chất lượng cao
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    {services.map((service) => (
                        <Box key={service.title} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: '33.333%' } }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={service.image}
                                    alt={service.title}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h3">
                                        {service.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {service.description}
                                    </Typography>
                                    <Button
                                        size="small"
                                        color="primary"
                                        component={RouterLink}
                                        to={service.link}
                                        endIcon={<ArrowForwardIcon />}
                                    >
                                        Tìm hiểu thêm
                                    </Button>
                                </CardContent>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Container>

            {/* Tài liệu giáo dục và giảm kỳ thị */}
            <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h2" align="center" gutterBottom>
                        Tài Liệu Giáo Dục & Giảm Kỳ Thị
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
                        Hiểu đúng về HIV và cách phòng ngừa giúp giảm kỳ thị trong cộng đồng
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
                        {educationalResources.map((resource, index) => (
                            <Card key={index} sx={{ width: { xs: '100%', sm: '45%', md: '30%' }, mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>{resource.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{resource.description}</Typography>
                                    <Button
                                        size="small"
                                        component={RouterLink}
                                        to={resource.link}
                                        sx={{ mt: 2 }}
                                        endIcon={<ArrowForwardIcon />}
                                    >
                                        Đọc thêm
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ my: 8 }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom>
                    Tại Sao Chọn Chúng Tôi
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
                    Cam kết của chúng tôi về chăm sóc chất lượng và dịch vụ toàn diện
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
                    {features.map((feature) => (
                        <Box
                            key={feature.title}
                            sx={{
                                width: { xs: '100%', sm: 'calc(50% - 16px)', md: '25%' },
                                textAlign: 'center',
                                p: 2
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mb: 2,
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <Typography variant="h5" component="h3" gutterBottom>
                                {feature.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {feature.description}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>

            {/* CTA Section */}
            <Container maxWidth="md" sx={{ my: 8, textAlign: 'center' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Sẵn Sàng Bắt Đầu?
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                    Tham gia cộng đồng bệnh nhân của chúng tôi và trải nghiệm dịch vụ chăm sóc sức khỏe được thiết kế riêng cho nhu cầu của bạn.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    component={RouterLink}
                    to="/auth/register"
                    sx={{ mt: 2 }}
                >
                    Tạo Tài Khoản
                </Button>
            </Container>

            {/* Chatbot Component */}
            <Chatbot />
        </Box >
    );
};

// Sample data
const services = [
    {
        title: 'Điều Trị ARV',
        description: 'Điều trị bằng thuốc kháng retrovirus (ARV) với các phác đồ phù hợp cho từng cá nhân, được theo dõi bởi các chuyên gia y tế.',
        image: '/primaryhealthy.png',
        link: '/services#arv-treatment',
    },
    {
        title: 'Tư Vấn & Xét Nghiệm',
        description: 'Dịch vụ tư vấn và xét nghiệm nhanh, bảo mật với CD4, tải lượng virus và các xét nghiệm liên quan khác.',
        image: '/counseling.svg',
        link: '/services#testing',
    },
    {
        title: 'Hỗ Trợ Tâm Lý',
        description: 'Dịch vụ tư vấn tâm lý chuyên sâu giúp vượt qua các rào cản tâm lý và xã hội khi sống chung với HIV.',
        image: '/mental.png',
        link: '/services#mental-support',
    },
];

const features = [
    {
        title: 'Đặt Lịch Hẹn Dễ Dàng',
        description: 'Lên lịch hẹn trực tuyến thuận tiện, có thể chọn bác sĩ điều trị và đảm bảo riêng tư.',
        icon: <CalendarIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    },
    {
        title: 'Tư Vấn Chuyên Gia',
        description: 'Tiếp cận kiến thức chuyên môn thông qua dịch vụ tư vấn trực tuyến với đội ngũ bác sĩ chuyên khoa.',
        icon: <ForumIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    },
    {
        title: 'Chăm Sóc Toàn Diện',
        description: 'Quản lý tổng thể việc điều trị HIV từ xét nghiệm, điều trị ARV đến theo dõi sức khỏe định kỳ.',
        icon: <HealingIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    },
    {
        title: 'Nhắc Nhở Thông Minh',
        description: 'Hệ thống nhắc nhở lịch tái khám và uống thuốc theo phác đồ điều trị đúng giờ.',
        icon: <NotificationsIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
    },
];

const educationalResources = [
    {
        title: 'Hiểu đúng về HIV/AIDS',
        description: 'Thông tin cơ bản về HIV/AIDS, cách lây truyền và phòng ngừa hiệu quả.',
        link: '/education/basic-hiv-info',
    },
    {
        title: 'Sống khỏe với HIV',
        description: 'Hướng dẫn về dinh dưỡng, tập luyện và duy trì lối sống lành mạnh khi sống chung với HIV.',
        link: '/education/living-with-hiv',
    },
    {
        title: 'Giảm kỳ thị trong cộng đồng',
        description: 'Những hiểu lầm phổ biến và cách giáo dục cộng đồng để giảm kỳ thị với người nhiễm HIV.',
        link: '/education/stigma-reduction',
    },
];

export default HomePage; 