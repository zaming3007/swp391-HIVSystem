import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Typography,
    Stack,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    Forum as ForumIcon,
    Healing as HealingIcon,
    Notifications as NotificationsIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import Chatbot from '../../components/Chatbot/Chatbot';

const HomePage: React.FC = () => {
    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    py: 8,
                    borderRadius: 2,
                    mb: 6,
                    mt: 2,
                    backgroundImage: 'linear-gradient(45deg, #7E57C2 30%, #26A69A 90%)',
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h3" component="h1" gutterBottom>
                                Chăm Sóc Sức Khỏe HIV Toàn Diện
                            </Typography>
                            <Typography variant="h6" paragraph>
                                Chúng tôi cung cấp các dịch vụ chăm sóc và điều trị HIV chất lượng cao trong môi trường
                                an toàn, tôn trọng và bảo mật thông tin cá nhân.
                            </Typography>
                            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="large"
                                    component={RouterLink}
                                    to="/services"
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Dịch Vụ Của Chúng Tôi
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    size="large"
                                    component={RouterLink}
                                    to="/auth/register"
                                >
                                    Tham Gia Ngay
                                </Button>
                            </Stack>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Box
                                component="img"
                                src="/homepageImage.jpg"
                                alt="Nhóm người đa dạng"
                                sx={{
                                    width: '100%',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    display: { xs: 'none', sm: 'block' },
                                }}
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>

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
        </Box>
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