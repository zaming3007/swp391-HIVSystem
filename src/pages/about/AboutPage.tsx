import React from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    HealthAndSafety as HealthAndSafetyIcon,
    Diversity3 as DiversityIcon,
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Về Chúng Tôi
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
                    Chăm sóc sức khỏe toàn diện cho mọi bản dạng giới
                </Typography>
                <Divider sx={{ my: 4 }} />
            </Box>

            {/* Phần giới thiệu */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src="/diverse-group.jpg"
                        alt="Nhóm chuyên gia y tế đa dạng"
                        sx={{
                            width: '100%',
                            borderRadius: 2,
                            boxShadow: 3,
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Sứ Mệnh Của Chúng Tôi
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Chúng tôi là một trung tâm chăm sóc sức khỏe chuyên biệt với sứ mệnh cung cấp dịch vụ y tế chất lượng cao,
                        toàn diện và thấu hiểu cho cộng đồng đa dạng giới tại Việt Nam.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Được thành lập vào năm 2022, chúng tôi tự hào là một trong những cơ sở y tế tiên phong tại Việt Nam
                        trong việc cung cấp dịch vụ chăm sóc sức khỏe khẳng định giới tính, tạo ra một môi trường an toàn, tôn trọng
                        và không phán xét cho tất cả bệnh nhân.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Dịch vụ chăm sóc sức khỏe toàn diện dành cho cộng đồng LGBTQ+" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Đội ngũ chuyên gia y tế có chuyên môn cao và giàu kinh nghiệm" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Môi trường tôn trọng và thấu hiểu nhu cầu đặc biệt của mỗi cá nhân" />
                            </ListItem>
                        </List>
                    </Box>
                </Grid>
            </Grid>

            {/* Giá trị cốt lõi */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h4" component="h2" align="center" gutterBottom>
                    Giá Trị Cốt Lõi
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    Những nguyên tắc định hướng cho mọi hoạt động của chúng tôi
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <HealthAndSafetyIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h5" component="h3" align="center" gutterBottom>
                                Chăm Sóc Toàn Diện
                            </Typography>
                            <Typography variant="body1" align="center">
                                Chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe toàn diện, từ thể chất đến tinh thần,
                                được thiết kế riêng cho nhu cầu đặc biệt của mỗi cá nhân.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <DiversityIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h5" component="h3" align="center" gutterBottom>
                                Tôn Trọng Đa Dạng
                            </Typography>
                            <Typography variant="body1" align="center">
                                Chúng tôi tôn trọng và tôn vinh mọi bản dạng giới, định hướng tính dục và hình thể.
                                Sự đa dạng là điều kiện tiên quyết cho môi trường chăm sóc sức khỏe thực sự hòa nhập.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <CheckCircleIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h5" component="h3" align="center" gutterBottom>
                                Chất Lượng Vượt Trội
                            </Typography>
                            <Typography variant="body1" align="center">
                                Chúng tôi không ngừng nỗ lực để nâng cao chất lượng dịch vụ, áp dụng các phương pháp điều trị
                                tiên tiến nhất và tuân thủ các tiêu chuẩn y tế quốc tế.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Lịch sử phát triển */}
            <Box sx={{ mb: 6 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Lịch Sử Phát Triển
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body1" paragraph>
                    <strong>2022:</strong> Thành lập Trung tâm Chăm sóc Sức khỏe Giới tính đầu tiên tại Hà Nội, với đội ngũ 5 chuyên gia y tế.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>2023:</strong> Mở rộng dịch vụ, bổ sung thêm chương trình tư vấn tâm lý và hỗ trợ sức khỏe tâm thần.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>2024:</strong> Ra mắt nền tảng chăm sóc sức khỏe trực tuyến, giúp tiếp cận được nhiều bệnh nhân hơn trên toàn quốc.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Hiện tại:</strong> Phục vụ hơn 500 bệnh nhân mỗi tháng với đội ngũ 20 chuyên gia y tế, tư vấn viên và nhân viên hỗ trợ.
                </Typography>
            </Box>

            {/* Tầm nhìn tương lai */}
            <Box>
                <Typography variant="h4" component="h2" gutterBottom>
                    Tầm Nhìn Tương Lai
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body1" paragraph>
                    Chúng tôi hướng đến việc trở thành trung tâm hàng đầu về chăm sóc sức khỏe khẳng định giới tính tại Việt Nam,
                    nơi mọi người đều được tiếp cận với dịch vụ y tế chất lượng cao trong một môi trường an toàn và tôn trọng.
                </Typography>
                <Typography variant="body1" paragraph>
                    Trong 5 năm tới, chúng tôi dự định mở rộng mạng lưới đến các thành phố lớn khác trên cả nước,
                    đồng thời phát triển các chương trình giáo dục cộng đồng để nâng cao nhận thức về sức khỏe đa dạng giới.
                </Typography>
            </Box>
        </Container>
    );
};

export default AboutPage; 