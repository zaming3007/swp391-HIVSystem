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
                Dịch Vụ Chăm Sóc HIV/AIDS Toàn Diện
            </Typography>
            <Typography variant="subtitle1" paragraph>
                Chúng tôi cung cấp các dịch vụ chuyên biệt về HIV/AIDS bao gồm xét nghiệm, điều trị ARV, tư vấn sức khỏe, hỗ trợ tâm lý và các dịch vụ dự phòng nhằm nâng cao chất lượng cuộc sống cho người sống chung với HIV.
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
                    <Tab label="Xét Nghiệm HIV" {...a11yProps(1)} />
                    <Tab label="Điều Trị HIV" {...a11yProps(2)} />
                    <Tab label="Chăm Sóc Hỗ Trợ" {...a11yProps(3)} />
                    <Tab label="Dịch Vụ Dự Phòng" {...a11yProps(4)} />
                    <Tab label="Hỗ Trợ Tâm Lý" {...a11yProps(5)} />
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
                    {filterByCategory('hiv-testing').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('hiv-testing').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ xét nghiệm HIV nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* HIV Treatment Tab */}
            <TabPanel value={tabValue} index={2}>
                <Grid container spacing={4}>
                    {filterByCategory('hiv-treatment').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('hiv-treatment').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ điều trị HIV nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* HIV Care Tab */}
            <TabPanel value={tabValue} index={3}>
                <Grid container spacing={4}>
                    {filterByCategory('hiv-care').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('hiv-care').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ chăm sóc hỗ trợ nào phù hợp với "{searchTerm}"</Typography>
                        </Box>
                    )}
                </Grid>
            </TabPanel>

            {/* HIV Prevention Tab */}
            <TabPanel value={tabValue} index={4}>
                <Grid container spacing={4}>
                    {filterByCategory('hiv-prevention').map((service) => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                    {filterByCategory('hiv-prevention').length === 0 && (
                        <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">Không tìm thấy dịch vụ dự phòng HIV nào phù hợp với "{searchTerm}"</Typography>
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
                            <Typography variant="h6">Không tìm thấy dịch vụ hỗ trợ tâm lý nào phù hợp với "{searchTerm}"</Typography>
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
                            label={service.category === 'hiv-testing' ? 'Xét Nghiệm HIV' :
                                service.category === 'hiv-treatment' ? 'Điều Trị HIV' :
                                    service.category === 'hiv-care' ? 'Chăm Sóc Hỗ Trợ' :
                                        service.category === 'hiv-prevention' ? 'Dịch Vụ Dự Phòng' :
                                            service.category === 'mental-health' ? 'Hỗ Trợ Tâm Lý' : 'Khác'}
                            color={
                                service.category === 'hiv-testing' ? 'info' :
                                    service.category === 'hiv-treatment' ? 'primary' :
                                        service.category === 'hiv-care' ? 'success' :
                                            service.category === 'hiv-prevention' ? 'secondary' :
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
        name: 'Xét Nghiệm HIV Nhanh',
        description: 'Dịch vụ xét nghiệm HIV nhanh, bảo mật với kết quả trong vòng 20 phút. Bao gồm tư vấn trước và sau xét nghiệm.',
        category: 'hiv-testing',
        price: 100,
        duration: 30,
        image: '/services/image4.jpg',
    },
    {
        id: '2',
        name: 'Tư Vấn Tâm Lý Cho Người Nhiễm HIV',
        description: 'Dịch vụ tư vấn tâm lý chuyên sâu giúp đối phó với các thách thức tâm lý khi sống chung với HIV, do các chuyên gia tâm lý có kinh nghiệm thực hiện.',
        category: 'mental-health',
        price: 150,
        duration: 60,
        image: '/services/image5.jpg',
    },
    {
        id: '3',
        name: 'Tư Vấn Dinh Dưỡng Cho Người Nhiễm HIV',
        description: 'Tư vấn về chế độ dinh dưỡng phù hợp cho người sống chung với HIV, giúp tăng cường hệ miễn dịch và hỗ trợ điều trị ARV hiệu quả.',
        category: 'hiv-care',
        price: 120,
        duration: 45,
        image: '/services/image6.jpg',
    },
    {
        id: '4',
        name: 'Xét Nghiệm CD4 và Tải Lượng Virus',
        description: 'Xét nghiệm chuyên sâu đánh giá số lượng tế bào CD4 và tải lượng virus HIV trong máu, giúp theo dõi hiệu quả điều trị.',
        category: 'hiv-testing',
        price: 250,
        duration: 60,
        image: '/services/image7.jpg',
    },
    {
        id: '5',
        name: 'Điều Trị ARV & Theo Dõi',
        description: 'Dịch vụ điều trị thuốc kháng retrovirus (ARV) và theo dõi định kỳ, giúp kiểm soát virus HIV và nâng cao chất lượng cuộc sống.',
        category: 'hiv-treatment',
        price: 200,
        duration: 90,
        image: '/services/image8.jpg',
    },
    {
        id: '6',
        name: 'Nhóm Hỗ Trợ Đồng Đẳng',
        description: 'Các buổi sinh hoạt nhóm hỗ trợ đồng đẳng, nơi người sống chung với HIV có thể chia sẻ kinh nghiệm và hỗ trợ lẫn nhau.',
        category: 'mental-health',
        price: 50,
        duration: 120,
        image: '/services/image9.jpg',
    },
    {
        id: '7',
        name: 'Tư Vấn Dự Phòng Lây Truyền HIV',
        description: 'Dịch vụ tư vấn về các biện pháp dự phòng lây truyền HIV, bao gồm sử dụng bao cao su, PrEP, và PEP.',
        category: 'hiv-prevention',
        price: 100,
        duration: 45,
        image: '/services/image10.jpg',
    },
    {
        id: '8',
        name: 'Điều Trị Dự Phòng Trước Phơi Nhiễm (PrEP)',
        description: 'Dịch vụ cung cấp và theo dõi điều trị PrEP cho người có nguy cơ cao nhiễm HIV, giúp giảm nguy cơ lây nhiễm.',
        category: 'hiv-prevention',
        price: 150,
        duration: 60,
        image: '/services/image11.jpg',
    },
    {
        id: '9',
        name: 'Điều Trị Các Bệnh Nhiễm Trùng Cơ Hội',
        description: 'Dịch vụ chẩn đoán và điều trị các bệnh nhiễm trùng cơ hội thường gặp ở người nhiễm HIV như lao, viêm phổi PCP, nhiễm nấm.',
        category: 'hiv-treatment',
        price: 180,
        duration: 60,
        image: '/services/image12.jpg',
    },
    {
        id: '10',
        name: 'Tư Vấn Tiết Lộ Tình Trạng HIV',
        description: 'Hỗ trợ tư vấn về cách tiết lộ tình trạng HIV với bạn tình, gia đình và người thân, giúp giảm kỳ thị và nhận được sự hỗ trợ.',
        category: 'mental-health',
        price: 120,
        duration: 60,
        image: '/services/image13.jpg',
    },
    {
        id: '11',
        name: 'Hỗ Trợ Tuân Thủ Điều Trị',
        description: 'Dịch vụ hỗ trợ tuân thủ điều trị ARV, bao gồm nhắc nhở uống thuốc, theo dõi tác dụng phụ và tư vấn vượt qua khó khăn.',
        category: 'hiv-care',
        price: 80,
        duration: 30,
        image: '/services/image14.jpg',
    },
    {
        id: '12',
        name: 'Điều Trị Dự Phòng Sau Phơi Nhiễm (PEP)',
        description: 'Dịch vụ cấp cứu cung cấp thuốc PEP trong vòng 72 giờ sau khi có nguy cơ phơi nhiễm HIV, giúp giảm nguy cơ lây nhiễm.',
        category: 'hiv-prevention',
        price: 200,
        duration: 45,
        image: '/services/testingHIV.jpg',
    },
];

export default ServicesPage; 