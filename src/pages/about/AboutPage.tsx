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
    MedicalServices as MedicalServicesIcon,
    Psychology as PsychologyIcon,
    Science as ScienceIcon,
} from '@mui/icons-material';
import doctorImg from '../../images/team-medical/doctor1.jpg';

const AboutPage: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6 }}>
                <Typography variant="h3" component="h1" gutterBottom align="center">
                    Về Chúng Tôi
                </Typography>
                <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
                    Hệ thống chăm sóc và điều trị HIV/AIDS toàn diện
                </Typography>
                <Divider sx={{ my: 4 }} />
            </Box>

            {/* Phần giới thiệu */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src={doctorImg}
                        alt="Đội ngũ y tế chuyên về HIV/AIDS"
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
                        toàn diện và thấu hiểu cho người sống chung với HIV/AIDS tại Việt Nam.
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Được thành lập vào năm 2022, chúng tôi tự hào là một trong những cơ sở y tế tiên phong tại Việt Nam
                        trong việc cung cấp dịch vụ chăm sóc và điều trị HIV/AIDS toàn diện, tạo ra một môi trường an toàn, tôn trọng
                        và không kỳ thị cho tất cả bệnh nhân.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Dịch vụ xét nghiệm, điều trị và chăm sóc HIV/AIDS toàn diện" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Đội ngũ y bác sĩ chuyên khoa về HIV/AIDS có kinh nghiệm" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircleIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Môi trường không kỳ thị và bảo mật thông tin tối đa cho bệnh nhân" />
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
                                <MedicalServicesIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h5" component="h3" align="center" gutterBottom>
                                Chăm Sóc Toàn Diện
                            </Typography>
                            <Typography variant="body1" align="center">
                                Chúng tôi cam kết cung cấp dịch vụ chăm sóc HIV/AIDS toàn diện, từ xét nghiệm, điều trị ARV đến hỗ trợ tâm lý và dinh dưỡng,
                                được thiết kế riêng cho nhu cầu của từng bệnh nhân.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <PsychologyIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h5" component="h3" align="center" gutterBottom>
                                Không Kỳ Thị
                            </Typography>
                            <Typography variant="body1" align="center">
                                Chúng tôi tạo ra môi trường không kỳ thị, nơi mọi bệnh nhân đều được đối xử với phẩm giá và tôn trọng.
                                Chúng tôi cam kết bảo mật thông tin và bảo vệ quyền riêng tư của bệnh nhân.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <ScienceIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="h5" component="h3" align="center" gutterBottom>
                                Chất Lượng Vượt Trội
                            </Typography>
                            <Typography variant="body1" align="center">
                                Chúng tôi không ngừng cập nhật các phương pháp điều trị HIV/AIDS tiên tiến nhất, tuân thủ các hướng dẫn
                                quốc tế và đảm bảo bệnh nhân được tiếp cận với liệu pháp ARV hiệu quả nhất.
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
                    <strong>2022:</strong> Thành lập Trung tâm Chăm sóc và Điều trị HIV/AIDS đầu tiên tại Hà Nội, với đội ngũ 5 chuyên gia y tế.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>2023:</strong> Mở rộng dịch vụ, bổ sung thêm chương trình tư vấn tâm lý và hỗ trợ tuân thủ điều trị ARV.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>2024:</strong> Ra mắt nền tảng chăm sóc HIV/AIDS trực tuyến, bao gồm hệ thống nhắc nhở uống thuốc và tư vấn từ xa.
                </Typography>
                <Typography variant="body1" paragraph>
                    <strong>Hiện tại:</strong> Phục vụ hơn 500 bệnh nhân HIV/AIDS mỗi tháng với đội ngũ 20 chuyên gia y tế, tư vấn viên và nhân viên hỗ trợ.
                </Typography>
            </Box>

            {/* Tầm nhìn tương lai */}
            <Box>
                <Typography variant="h4" component="h2" gutterBottom>
                    Tầm Nhìn Tương Lai
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="body1" paragraph>
                    Chúng tôi hướng đến việc trở thành trung tâm hàng đầu về chăm sóc và điều trị HIV/AIDS tại Việt Nam,
                    nơi mọi người sống chung với HIV đều được tiếp cận với dịch vụ y tế chất lượng cao trong một môi trường an toàn và không kỳ thị.
                </Typography>
                <Typography variant="body1" paragraph>
                    Trong 5 năm tới, chúng tôi dự định mở rộng mạng lưới đến các thành phố lớn khác trên cả nước,
                    đồng thời phát triển các chương trình giáo dục cộng đồng để nâng cao nhận thức về HIV/AIDS và giảm kỳ thị liên quan.
                </Typography>
                <Typography variant="body1" paragraph>
                    Chúng tôi cũng cam kết nghiên cứu và áp dụng các phương pháp điều trị HIV/AIDS tiên tiến nhất,
                    hợp tác với các tổ chức quốc tế để đảm bảo bệnh nhân của chúng tôi được tiếp cận với những tiến bộ y học mới nhất.
                </Typography>
            </Box>
        </Container>
    );
};

export default AboutPage; 