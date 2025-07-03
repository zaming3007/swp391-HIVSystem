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
                Dịch Vụ Y Tế Toàn Diện
            </Typography>
            <Typography variant="subtitle1" paragraph>
                Chúng tôi cung cấp các dịch vụ y tế toàn diện bao gồm phòng ngừa, tư vấn, xét nghiệm, điều trị và chăm sóc sức khỏe để nâng cao chất lượng cuộc sống cho tất cả mọi người trong cộng đồng.
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
                    <Tab label="Sức Khỏe Tổng Quát" {...a11yProps(1)} />
                    <Tab label="Tư Vấn Điều Trị" {...a11yProps(2)} />
                    <Tab label="Chăm Sóc Sức Khỏe" {...a11yProps(3)} />
                    <Tab label="Dịch Vụ Dự Phòng" {...a11yProps(4)} />
                    <Tab label="Sức Khỏe Tâm Thần" {...a11yProps(5)} />
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

            {/* HIV Testing Tab */}
            <TabPanel value={tabValue} index={1}>
                <Grid container spacing={4}>
                    {filterByCategory('general-health').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('general-health').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ sức khỏe tổng quát nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* HIV Treatment Tab */}
            <TabPanel value={tabValue} index={2}>
                <Grid container spacing={4}>
                    {filterByCategory('treatment-counseling').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('treatment-counseling').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ tư vấn điều trị nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* HIV Care Tab */}
            <TabPanel value={tabValue} index={3}>
                <Grid container spacing={4}>
                    {filterByCategory('healthcare').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('healthcare').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ chăm sóc sức khỏe nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* HIV Prevention Tab */}
            <TabPanel value={tabValue} index={4}>
                <Grid container spacing={4}>
                    {filterByCategory('prevention').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('prevention').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ dự phòng nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* Mental Health Tab */}
            <TabPanel value={tabValue} index={5}>
                <Grid container spacing={4}>
                    {filterByCategory('mental-health').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('mental-health').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ sức khỏe tâm thần nào phù hợp với "{searchTerm}"</Typography>
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
                            label={service.category === 'general-health' ? 'Sức Khỏe Tổng Quát' :
                                service.category === 'treatment-counseling' ? 'Tư Vấn Điều Trị' :
                                    service.category === 'healthcare' ? 'Chăm Sóc Sức Khỏe' :
                                        service.category === 'prevention' ? 'Dịch Vụ Dự Phòng' :
                                            service.category === 'mental-health' ? 'Sức Khỏe Tâm Thần' : 'Khác'}
                            color={
                                service.category === 'general-health' ? 'info' :
                                    service.category === 'treatment-counseling' ? 'primary' :
                                        service.category === 'healthcare' ? 'success' :
                                            service.category === 'prevention' ? 'secondary' :
                                                service.category === 'mental-health' ? 'warning' : 'default'
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
        name: 'Khám Sức Khỏe Tổng Quát',
        description: 'Dịch vụ khám sức khỏe toàn diện với các bác sĩ chuyên môn cao, giúp phát hiện sớm các vấn đề sức khỏe tiềm ẩn.',
        category: 'general-health',
        price: 150,
        duration: 60,
        image: '/primaryhealthy.png',
    },
    {
        id: '2',
        name: 'Tư Vấn Tâm Lý Chuyên Sâu',
        description: 'Dịch vụ tư vấn tâm lý cá nhân với các chuyên gia tâm lý giàu kinh nghiệm, giúp cải thiện sức khỏe tinh thần.',
        category: 'mental-health',
        price: 120,
        duration: 50,
        image: '/mental.png',
    },
    {
        id: '3',
        name: 'Tư Vấn Dinh Dưỡng & Lối Sống',
        description: 'Tư vấn về chế độ dinh dưỡng và lối sống lành mạnh, phù hợp với tình trạng sức khỏe cá nhân.',
        category: 'healthcare',
        price: 100,
        duration: 45,
        image: '/counseling.svg',
    },
    {
        id: '4',
        name: 'Dịch Vụ Xét Nghiệm Tổng Quát',
        description: 'Các xét nghiệm toàn diện giúp đánh giá tình trạng sức khỏe và phát hiện sớm các vấn đề tiềm ẩn.',
        category: 'general-health',
        price: 200,
        duration: 60,
        image: '/homepageImage.jpg',
    },
    {
        id: '5',
        name: 'Tư Vấn Liệu Pháp Hormone',
        description: 'Tư vấn chuyên sâu về liệu pháp hormone, phù hợp với nhu cầu cá nhân và tình trạng sức khỏe.',
        category: 'treatment-counseling',
        price: 180,
        duration: 90,
        image: '/genderaff.png',
    },
    {
        id: '6',
        name: 'Liệu Pháp Tâm Lý Nhóm',
        description: 'Các buổi trị liệu tâm lý theo nhóm, giúp chia sẻ kinh nghiệm và hỗ trợ lẫn nhau.',
        category: 'mental-health',
        price: 80,
        duration: 120,
        image: '/service-1.svg',
    },
    {
        id: '7',
        name: 'Tư Vấn Sức Khỏe Sinh Sản',
        description: 'Dịch vụ tư vấn về sức khỏe sinh sản, kế hoạch hóa gia đình và các vấn đề liên quan.',
        category: 'healthcare',
        price: 130,
        duration: 45,
        image: '/service-2.svg',
    },
    {
        id: '8',
        name: 'Dịch Vụ Tiêm Phòng Vaccine',
        description: 'Tiêm chủng và tư vấn về các loại vaccine cần thiết để phòng ngừa bệnh tật.',
        category: 'prevention',
        price: 60,
        duration: 30,
        image: '/service-3.svg',
    },
    {
        id: '9',
        name: 'Theo Dõi & Quản Lý Bệnh Mãn Tính',
        description: 'Dịch vụ theo dõi và quản lý các bệnh mãn tính, giúp kiểm soát tốt tình trạng sức khỏe.',
        category: 'treatment-counseling',
        price: 120,
        duration: 45,
        image: '/hormone-therapy.svg',
    },
];

export default ServicesPage; 