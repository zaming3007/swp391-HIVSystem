import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Divider,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Chip,
} from '@mui/material';
import {
    Search as SearchIcon,
    AccessTime as AccessTimeIcon,
    AttachMoney as AttachMoneyIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`services-tabpanel-${index}`}
            aria-labelledby={`services-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `services-tab-${index}`,
        'aria-controls': `services-tabpanel-${index}`,
    };
}

const ServicesPage: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // Đọc tabIndex từ localStorage khi component được mount hoặc khi localStorage thay đổi
    useEffect(() => {
        const selectedTab = localStorage.getItem('selectedServiceTab');
        if (selectedTab !== null) {
            const tabIndex = parseInt(selectedTab);
            setTabValue(tabIndex);
            // Xóa giá trị sau khi đã sử dụng để tránh ảnh hưởng đến lần sau
            localStorage.removeItem('selectedServiceTab');
        }
    }, []);

    // Lắng nghe sự thay đổi của localStorage để cập nhật tab khi click dropdown
    useEffect(() => {
        const handleTabChange = (event: CustomEvent) => {
            const tabIndex = event.detail.tabIndex;
            setTabValue(tabIndex);
        };

        // Lắng nghe custom event từ Header component
        window.addEventListener('serviceTabChange', handleTabChange as EventListener);

        return () => {
            window.removeEventListener('serviceTabChange', handleTabChange as EventListener);
        };
    }, []);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const filteredServices = services.filter((service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filterByCategory = (category: string) => {
        return filteredServices.filter((service) => service.category === category);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Dịch Vụ Của Chúng Tôi
            </Typography>
            <Typography variant="subtitle1" paragraph>
                Chúng tôi cung cấp một loạt các dịch vụ chăm sóc sức khỏe khẳng định giới tính toàn diện được thiết kế để đáp ứng nhu cầu đặc biệt của bạn.
            </Typography>

            {/* Search bar */}
            <Box sx={{ mb: 4, mt: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm dịch vụ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                />
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="service categories"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab label="Tất Cả Dịch Vụ" {...a11yProps(0)} />
                    <Tab label="Chăm Sóc Khẳng Định Giới Tính" {...a11yProps(1)} />
                    <Tab label="Sức Khỏe Tâm Thần" {...a11yProps(2)} />
                    <Tab label="Chăm Sóc Cơ Bản" {...a11yProps(3)} />
                </Tabs>
            </Box>

            {/* All Services Tab */}
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={4}>
                    {filteredServices.map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filteredServices.length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* Gender-Affirming Care Tab */}
            <TabPanel value={tabValue} index={1}>
                <Grid container spacing={4}>
                    {filterByCategory('Gender-Affirming').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('Gender-Affirming').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ khẳng định giới tính nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* Mental Health Tab */}
            <TabPanel value={tabValue} index={2}>
                <Grid container spacing={4}>
                    {filterByCategory('Mental Health').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('Mental Health').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ sức khỏe tâm thần nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* Primary Care Tab */}
            <TabPanel value={tabValue} index={3}>
                <Grid container spacing={4}>
                    {filterByCategory('Primary Care').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('Primary Care').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ chăm sóc cơ bản nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>
        </Container>
    );
};

interface ServiceCardProps {
    service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    return (
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
                image={service.image || '/default-service.jpg'}
                alt={service.name}
            />
            <CardContent sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}>
                <Box>
                    <Box sx={{ mb: 1 }}>
                        <Chip
                            label={service.category === 'Gender-Affirming' ? 'Khẳng định giới tính' :
                                service.category === 'Mental Health' ? 'Sức khỏe tâm thần' :
                                    'Chăm sóc cơ bản'}
                            color={
                                service.category === 'Gender-Affirming' ? 'primary' :
                                    service.category === 'Mental Health' ? 'secondary' : 'default'
                            }
                            size="small"
                        />
                    </Box>
                    <Typography gutterBottom variant="h5" component="h2">
                        {service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {service.description}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {service.duration} phút
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AttachMoneyIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {service.price}.000 VNĐ
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Button
                    component={RouterLink}
                    to={`/app/appointments?service=${service.id}`}
                    variant="contained"
                    color="primary"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                >
                    Đặt Lịch Hẹn
                </Button>
            </CardContent>
        </Card>
    );
};

// Service type
interface Service {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    image?: string;
}

// Sample data
const services: Service[] = [
    {
        id: '1',
        name: 'Tư Vấn Liệu Pháp Hormone',
        description: 'Tư vấn ban đầu hoặc theo dõi cho liệu pháp hormone.',
        category: 'Gender-Affirming',
        price: 150,
        duration: 60,
        image: '/dv1.jpg',
    },
    {
        id: '2',
        name: 'Trị Liệu Giới Tính',
        description: 'Buổi trị liệu một-một tập trung vào bản dạng giới và quá trình chuyển đổi.',
        category: 'Mental Health',
        price: 120,
        duration: 50,
        image: '/dv2.jpg',
    },
    {
        id: '3',
        name: 'Trị Liệu Giọng Nói và Giao Tiếp',
        description: 'Trị liệu làm nữ hóa hoặc nam hóa giọng nói với chuyên gia ngôn ngữ trị liệu.',
        category: 'Gender-Affirming',
        price: 100,
        duration: 45,
        image: '/dv3.jpg',
    },
    {
        id: '4',
        name: 'Khám Sức Khỏe Tổng Quát Hàng Năm',
        description: 'Kiểm tra sức khỏe tổng quát hàng năm với đội ngũ y tế có hiểu biết về đa dạng giới.',
        category: 'Primary Care',
        price: 200,
        duration: 60,
        image: '/dv4.jpg',
    },
    {
        id: '5',
        name: 'Tư Vấn Tiền Phẫu Thuật',
        description: 'Tư vấn và chuẩn bị cho các thủ thuật phẫu thuật khẳng định giới tính.',
        category: 'Gender-Affirming',
        price: 180,
        duration: 90,
        image: '/dv5.jpg',
    },
    {
        id: '6',
        name: 'Tư Vấn Tâm Lý Cá Nhân',
        description: 'Tư vấn sức khỏe tâm thần tổng quát với các nhà trị liệu chuyên về giới tính.',
        category: 'Mental Health',
        price: 110,
        duration: 50,
        image: '/dv6.jpg',
    },
    {
        id: '7',
        name: 'Tư Vấn Sức Khỏe Tình Dục',
        description: 'Tư vấn bảo mật tập trung vào nhu cầu sức khỏe tình dục.',
        category: 'Primary Care',
        price: 130,
        duration: 45,
        image: '/dv7.jpg',
    },
    {
        id: '8',
        name: 'Buổi Nhóm Hỗ Trợ',
        description: 'Trị liệu nhóm và hỗ trợ cho các cá nhân đa dạng giới.',
        category: 'Mental Health',
        price: 40,
        duration: 120,
        image: '/dv8.jpg',
    },
    {
        id: '9',
        name: 'Chăm Sóc Sau Chuyển Đổi',
        description: 'Dịch vụ chăm sóc sức khỏe liên tục cho cá nhân sau quá trình chuyển đổi.',
        category: 'Gender-Affirming',
        price: 120,
        duration: 45,
        image: '/dv9.jpg',
    },
];

export default ServicesPage; 