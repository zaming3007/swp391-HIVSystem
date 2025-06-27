import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Tabs,
    Tab,
} from '@mui/material';

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
            id={`team-tabpanel-${index}`}
            aria-labelledby={`team-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `team-tab-${index}`,
        'aria-controls': `team-tabpanel-${index}`,
    };
}

interface TeamMember {
    id: number;
    name: string;
    title: string;
    department: 'medical' | 'mental-health' | 'administrative';
    image: string;
    description: string;
    specialties?: string[];
}

const TeamPage: React.FC = () => {
    const [tabValue, setTabValue] = React.useState(0);

    // Đọc tabIndex từ localStorage khi component được mount hoặc khi localStorage thay đổi
    React.useEffect(() => {
        const selectedTab = localStorage.getItem('selectedTeamTab');
        if (selectedTab !== null) {
            const tabIndex = parseInt(selectedTab);
            setTabValue(tabIndex);
            // Xóa giá trị sau khi đã sử dụng để tránh ảnh hưởng đến lần sau
            localStorage.removeItem('selectedTeamTab');
        }
    }, []);

    // Lắng nghe sự thay đổi để cập nhật tab khi click dropdown
    React.useEffect(() => {
        const handleTabChange = (event: CustomEvent) => {
            const tabIndex = event.detail.tabIndex;
            setTabValue(tabIndex);
        };

        // Lắng nghe custom event từ Header component
        window.addEventListener('teamTabChange', handleTabChange as EventListener);

        return () => {
            window.removeEventListener('teamTabChange', handleTabChange as EventListener);
        };
    }, []);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const filterByDepartment = (department: string) => {
        return teamMembers.filter((member) => member.department === department);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Đội Ngũ Chuyên Gia
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
                    Những chuyên gia hàng đầu trong lĩnh vực chăm sóc sức khỏe giới tính
                </Typography>
                <Divider sx={{ my: 4 }} />
            </Box>

            {/* Tabs phân loại đội ngũ */}
            <Box sx={{ width: '100%', mb: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="team department tabs"
                        centered
                    >
                        <Tab label="Tất Cả" {...a11yProps(0)} />
                        <Tab label="Đội Ngũ Y Tế" {...a11yProps(1)} />
                        <Tab label="Tư Vấn Tâm Lý" {...a11yProps(2)} />
                        <Tab label="Hành Chính" {...a11yProps(3)} />
                    </Tabs>
                </Box>
            </Box>

            {/* Tất cả thành viên */}
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={4}>
                    {teamMembers.map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <TeamMemberCard member={member} />
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            {/* Đội ngũ y tế */}
            <TabPanel value={tabValue} index={1}>
                <Grid container spacing={4}>
                    {filterByDepartment('medical').map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <TeamMemberCard member={member} />
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            {/* Tư vấn tâm lý */}
            <TabPanel value={tabValue} index={2}>
                <Grid container spacing={4}>
                    {filterByDepartment('mental-health').map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <TeamMemberCard member={member} />
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            {/* Đội ngũ hành chính */}
            <TabPanel value={tabValue} index={3}>
                <Grid container spacing={4}>
                    {filterByDepartment('administrative').map((member) => (
                        <Grid item xs={12} sm={6} md={4} key={member.id}>
                            <TeamMemberCard member={member} />
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            {/* Giới thiệu chung về đội ngũ */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Cam Kết Của Đội Ngũ
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body1" paragraph>
                    Đội ngũ chuyên gia của chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao,
                    tôn trọng và khẳng định bản dạng giới cho tất cả bệnh nhân. Mỗi thành viên trong đội ngũ của chúng tôi
                    đều được đào tạo chuyên sâu trong lĩnh vực của họ và có hiểu biết sâu sắc về nhu cầu sức khỏe đặc biệt
                    của cộng đồng đa dạng giới.
                </Typography>
                <Typography variant="body1" paragraph>
                    Chúng tôi không ngừng cập nhật kiến thức và kỹ năng thông qua các khóa đào tạo liên tục,
                    nghiên cứu y khoa mới nhất và tham gia các hội thảo chuyên ngành trong nước và quốc tế.
                    Điều này đảm bảo rằng chúng tôi luôn cung cấp dịch vụ chăm sóc sức khỏe tiên tiến nhất,
                    dựa trên bằng chứng khoa học và thực hành lâm sàng tốt nhất.
                </Typography>
            </Box>
        </Container>
    );
};

interface TeamMemberCardProps {
    member: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="300"
                image={member.image}
                alt={member.name}
                sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                    {member.name}
                </Typography>
                <Typography gutterBottom variant="subtitle1" color="primary.main">
                    {member.title}
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body2" color="text.secondary" paragraph>
                    {member.description}
                </Typography>
                {member.specialties && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            Chuyên môn:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {member.specialties.join(', ')}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// Dữ liệu mẫu về đội ngũ
const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: 'TS. BS. Nguyễn Văn A',
        title: 'Giám đốc Y khoa',
        department: 'medical',
        image: 'https://i.pravatar.cc/300?img=1',
        description: 'Bác sĩ nội tiết với hơn 15 năm kinh nghiệm trong lĩnh vực y học giới tính và liệu pháp hormone.',
        specialties: ['Nội tiết học', 'Liệu pháp hormone', 'Y học giới tính']
    },
    {
        id: 2,
        name: 'ThS. BS. Trần Thị B',
        title: 'Bác sĩ Chuyên khoa Nội tiết',
        department: 'medical',
        image: 'https://i.pravatar.cc/300?img=5',
        description: 'Chuyên gia về liệu pháp hormone cho người chuyển giới, với nhiều nghiên cứu được công bố quốc tế.',
        specialties: ['Liệu pháp hormone', 'Chăm sóc sức khỏe chuyển giới']
    },
    {
        id: 3,
        name: 'TS. Lê Văn C',
        title: 'Trưởng khoa Tâm lý',
        department: 'mental-health',
        image: 'https://i.pravatar.cc/300?img=8',
        description: 'Nhà tâm lý học lâm sàng với chuyên môn về giới tính, bản dạng giới và sức khỏe tâm thần LGBTQ+.',
        specialties: ['Tâm lý học lâm sàng', 'Tư vấn bản dạng giới', 'Trị liệu tâm lý']
    },
    {
        id: 4,
        name: 'ThS. Phạm Thị D',
        title: 'Chuyên viên Tâm lý',
        department: 'mental-health',
        image: 'https://i.pravatar.cc/300?img=9',
        description: 'Nhà trị liệu tâm lý chuyên về hỗ trợ người chuyển giới và người phi nhị nguyên giới trong quá trình chuyển đổi.',
        specialties: ['Trị liệu tâm lý', 'Tư vấn giới tính', 'Hỗ trợ chuyển đổi']
    },
    {
        id: 5,
        name: 'BS. Hoàng Văn E',
        title: 'Bác sĩ Da liễu',
        department: 'medical',
        image: 'https://i.pravatar.cc/300?img=3',
        description: 'Chuyên gia về chăm sóc da cho người đang sử dụng liệu pháp hormone và các vấn đề da liễu liên quan đến giới tính.',
        specialties: ['Da liễu', 'Chăm sóc da cho người dùng hormone']
    },
    {
        id: 6,
        name: 'CN. Vũ Thị F',
        title: 'Quản lý Điều dưỡng',
        department: 'medical',
        image: 'https://i.pravatar.cc/300?img=10',
        description: 'Điều dưỡng viên với chuyên môn về chăm sóc sau phẫu thuật khẳng định giới tính và hỗ trợ bệnh nhân.',
        specialties: ['Điều dưỡng', 'Chăm sóc hậu phẫu']
    },
    {
        id: 7,
        name: 'ThS. Đỗ Văn G',
        title: 'Giám đốc Điều hành',
        department: 'administrative',
        image: 'https://i.pravatar.cc/300?img=4',
        description: 'Quản lý điều hành với hơn 10 năm kinh nghiệm trong lĩnh vực quản lý y tế và dịch vụ chăm sóc sức khỏe.',
    },
    {
        id: 8,
        name: 'CN. Ngô Thị H',
        title: 'Điều phối viên Bệnh nhân',
        department: 'administrative',
        image: 'https://i.pravatar.cc/300?img=7',
        description: 'Chuyên gia liên lạc và hỗ trợ bệnh nhân, đảm bảo trải nghiệm tốt nhất cho mọi người đến với trung tâm.',
    },
    {
        id: 9,
        name: 'TS. Trịnh Văn I',
        title: 'Chuyên gia Ngôn ngữ trị liệu',
        department: 'medical',
        image: 'https://i.pravatar.cc/300?img=6',
        description: 'Chuyên gia về luyện giọng nói và giao tiếp cho người chuyển giới, với nhiều năm kinh nghiệm lâm sàng.',
        specialties: ['Ngôn ngữ trị liệu', 'Luyện giọng nói', 'Kỹ năng giao tiếp']
    }
];

export default TeamPage; 