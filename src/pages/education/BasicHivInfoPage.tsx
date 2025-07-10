import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Chip,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Search as SearchIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import doc1Img from '../../images/document/image1.jpg';
import doc2Img from '../../images/document/image2.jpg';
import doc3Img from '../../images/document/image3.jpg';

const articles = [
    {
        id: "hiv-basics-1",
        title: "HIV/AIDS: Hiểu Biết Cơ Bản",
        summary: "Tìm hiểu về HIV/AIDS, cách lây truyền và phòng ngừa cơ bản.",
        content: `
        <h3>HIV là gì?</h3>
        <p>HIV (Human Immunodeficiency Virus) là virus gây suy giảm miễn dịch ở người. Virus này tấn công hệ thống miễn dịch của cơ thể, đặc biệt là tế bào CD4, làm suy yếu khả năng chống lại bệnh tật.</p>
        
        <h3>AIDS là gì?</h3>
        <p>AIDS (Acquired Immunodeficiency Syndrome) là giai đoạn cuối cùng của nhiễm HIV. Một người được chẩn đoán mắc AIDS khi hệ thống miễn dịch của họ bị tổn thương nghiêm trọng và cơ thể không thể chống lại nhiễm trùng.</p>
        
        <h3>Cách lây truyền HIV</h3>
        <ul>
            <li>Quan hệ tình dục không bảo vệ với người nhiễm HIV</li>
            <li>Dùng chung kim tiêm, bơm tiêm hoặc dụng cụ tiêm chích ma túy</li>
            <li>Từ mẹ sang con trong quá trình mang thai, sinh nở hoặc cho con bú</li>
            <li>Tiếp xúc với máu hoặc các chất dịch cơ thể bị nhiễm HIV</li>
        </ul>
        
        <h3>HIV KHÔNG lây qua:</h3>
        <ul>
            <li>Tiếp xúc thông thường như bắt tay, ôm, hôn má</li>
            <li>Ho hoặc hắt hơi</li>
            <li>Dùng chung bát đĩa, ly cốc hoặc đồ dùng ăn uống</li>
            <li>Sử dụng chung nhà vệ sinh, phòng tắm</li>
            <li>Côn trùng cắn, bao gồm muỗi</li>
        </ul>
        
        <h3>Các biện pháp phòng ngừa</h3>
        <ul>
            <li>Sử dụng bao cao su đúng cách mỗi lần quan hệ tình dục</li>
            <li>Không dùng chung bơm kim tiêm hoặc các dụng cụ tiêm chích</li>
            <li>Xét nghiệm HIV định kỳ, đặc biệt nếu bạn có hành vi nguy cơ</li>
            <li>Điều trị dự phòng trước phơi nhiễm (PrEP) và sau phơi nhiễm (PEP) trong trường hợp cần thiết</li>
        </ul>
        `,
        imageUrl: doc3Img,
        author: "TS. Nguyễn Văn A",
        publishDate: "2023-05-15",
        tags: ["Kiến thức cơ bản", "HIV/AIDS", "Phòng ngừa"]
    },
    {
        id: "hiv-testing",
        title: "Xét Nghiệm HIV: Khi Nào và Như Thế Nào?",
        summary: "Hướng dẫn về các loại xét nghiệm HIV, thời điểm xét nghiệm và quy trình thực hiện.",
        content: `
        <h3>Tại sao nên xét nghiệm HIV?</h3>
        <p>Xét nghiệm HIV là cách duy nhất để biết chắc chắn tình trạng nhiễm HIV của bạn. Biết sớm tình trạng nhiễm HIV giúp bạn tiếp cận điều trị sớm, ngăn chặn sự tiến triển của virus và giảm nguy cơ lây truyền cho người khác.</p>
        
        <h3>Khi nào nên xét nghiệm HIV?</h3>
        <p>Bạn nên xét nghiệm HIV nếu:</p>
        <ul>
            <li>Bạn đã quan hệ tình dục không bảo vệ</li>
            <li>Bạn có nhiều bạn tình</li>
            <li>Bạn đã dùng chung bơm kim tiêm khi tiêm chích ma túy</li>
            <li>Bạn đã tiếp xúc với máu hoặc dịch cơ thể của người nhiễm HIV</li>
            <li>Bạn đang mang thai hoặc dự định có thai</li>
            <li>Bạn đã được chẩn đoán mắc bệnh lây truyền qua đường tình dục khác</li>
        </ul>
        
        <h3>Các loại xét nghiệm HIV</h3>
        <p><strong>1. Xét nghiệm kháng thể HIV:</strong> Phát hiện kháng thể mà cơ thể sản xuất để chống lại HIV. Có thể mất 3-12 tuần sau khi nhiễm bệnh để cơ thể sản xuất đủ kháng thể để phát hiện.</p>
        
        <p><strong>2. Xét nghiệm kháng nguyên/kháng thể kết hợp:</strong> Phát hiện cả kháng thể HIV và kháng nguyên p24 (một protein của virus). Có thể phát hiện nhiễm HIV sớm hơn, từ 2-6 tuần sau khi phơi nhiễm.</p>
        
        <p><strong>3. Xét nghiệm axit nucleic (NAT):</strong> Phát hiện trực tiếp HIV trong máu. Có thể phát hiện nhiễm HIV sớm nhất, từ 10-33 ngày sau khi phơi nhiễm.</p>
        
        <h3>Quy trình xét nghiệm HIV</h3>
        <p>Quy trình xét nghiệm HIV thường đơn giản và nhanh chóng:</p>
        <ol>
            <li>Tư vấn trước xét nghiệm: Nhân viên y tế sẽ giải thích về quy trình, kết quả có thể và tính bảo mật</li>
            <li>Lấy mẫu: Có thể là mẫu máu từ tĩnh mạch, mẫu máu từ đầu ngón tay, hoặc mẫu nước bọt</li>
            <li>Xét nghiệm: Mẫu được xét nghiệm tại chỗ (test nhanh) hoặc gửi đến phòng thí nghiệm</li>
            <li>Nhận kết quả: Thời gian nhận kết quả từ vài phút (test nhanh) đến vài ngày (xét nghiệm phòng thí nghiệm)</li>
            <li>Tư vấn sau xét nghiệm: Nhân viên y tế sẽ giải thích kết quả và các bước tiếp theo</li>
        </ol>
        
        <h3>Thời kỳ cửa sổ là gì?</h3>
        <p>Thời kỳ cửa sổ là khoảng thời gian từ khi nhiễm HIV đến khi xét nghiệm có thể phát hiện. Trong thời kỳ này, người nhiễm có thể truyền HIV cho người khác mặc dù xét nghiệm vẫn cho kết quả âm tính. Thời kỳ cửa sổ phụ thuộc vào loại xét nghiệm sử dụng, từ 10 ngày đến 3 tháng.</p>
        
        <h3>Tính bảo mật của xét nghiệm HIV</h3>
        <p>Xét nghiệm HIV được thực hiện với sự bảo mật cao. Kết quả xét nghiệm được giữ kín và chỉ được chia sẻ với bạn và nhân viên y tế trực tiếp chăm sóc cho bạn. Bạn cũng có thể lựa chọn xét nghiệm ẩn danh tại một số cơ sở.</p>
        `,
        imageUrl: doc1Img,
        author: "BS. Trần Thị B",
        publishDate: "2023-06-20",
        tags: ["Xét nghiệm", "Chẩn đoán", "Phòng ngừa"]
    },
    {
        id: "hiv-prevention",
        title: "Các Biện Pháp Phòng Ngừa HIV Hiện Đại",
        summary: "Tìm hiểu về các phương pháp phòng ngừa HIV hiện đại như PrEP, PEP và U=U.",
        content: `
        <h3>Phòng ngừa HIV trong thế kỷ 21</h3>
        <p>Các biện pháp phòng ngừa HIV đã tiến bộ đáng kể trong những thập kỷ gần đây. Ngày nay, chúng ta có nhiều công cụ hiệu quả để ngăn ngừa lây nhiễm HIV.</p>
        
        <h3>PrEP - Dự phòng trước phơi nhiễm</h3>
        <p>PrEP (Pre-Exposure Prophylaxis) là thuốc uống hàng ngày giúp ngăn ngừa lây nhiễm HIV cho người chưa nhiễm virus nhưng có nguy cơ cao.</p>
        
        <p><strong>Cách thức hoạt động:</strong> PrEP chứa hai loại thuốc kháng virus (tenofovir và emtricitabine) có thể ngăn chặn HIV nhân lên trong cơ thể nếu bạn bị phơi nhiễm.</p>
        
        <p><strong>Hiệu quả:</strong> Khi uống đúng cách và đều đặn, PrEP có thể giảm nguy cơ lây nhiễm HIV qua đường tình dục lên đến 99% và qua đường tiêm chích ma túy lên đến 74%.</p>
        
        <p><strong>Ai nên dùng PrEP?</strong></p>
        <ul>
            <li>Người có quan hệ tình dục với người nhiễm HIV</li>
            <li>Nam quan hệ đồng tính hoặc song tính có quan hệ tình dục không sử dụng bao cao su</li>
            <li>Người có nhiều bạn tình</li>
            <li>Người có tiền sử mắc các bệnh lây truyền qua đường tình dục</li>
            <li>Người tiêm chích ma túy và dùng chung bơm kim tiêm</li>
        </ul>
        
        <h3>PEP - Dự phòng sau phơi nhiễm</h3>
        <p>PEP (Post-Exposure Prophylaxis) là biện pháp điều trị khẩn cấp để ngăn chặn HIV phát triển trong cơ thể sau khi có khả năng đã bị phơi nhiễm.</p>
        
        <p><strong>Thời gian quan trọng:</strong> PEP phải được bắt đầu trong vòng 72 giờ sau khi phơi nhiễm (càng sớm càng tốt) và phải uống đủ 28 ngày.</p>
        
        <p><strong>Các trường hợp cần PEP:</strong></p>
        <ul>
            <li>Quan hệ tình dục không bảo vệ với người nhiễm HIV</li>
            <li>Bao cao su bị rách hoặc trượt khi quan hệ với người nhiễm HIV</li>
            <li>Bị bạo lực tình dục</li>
            <li>Dùng chung dụng cụ tiêm chích với người nhiễm HIV</li>
            <li>Nhân viên y tế bị phơi nhiễm với máu hoặc dịch cơ thể của bệnh nhân nhiễm HIV</li>
        </ul>
        
        <h3>U=U: Không phát hiện = Không lây truyền</h3>
        <p>U=U (Undetectable = Untransmittable) là một thông điệp khoa học quan trọng: người nhiễm HIV đang điều trị ARV và đạt được tải lượng virus không phát hiện được sẽ không lây truyền HIV qua đường tình dục.</p>
        
        <p>Nghiên cứu lớn như PARTNER, PARTNER 2, và Opposites Attract đã xác nhận rằng không có trường hợp lây truyền HIV nào từ người có tải lượng virus không phát hiện được cho bạn tình của họ, ngay cả khi không sử dụng biện pháp bảo vệ khác.</p>
        
        <h3>Các biện pháp phòng ngừa khác</h3>
        <ul>
            <li><strong>Bao cao su:</strong> Khi sử dụng đúng cách, bao cao su vẫn là một trong những biện pháp hiệu quả nhất để ngăn ngừa HIV và các bệnh lây truyền qua đường tình dục khác</li>
            <li><strong>Khám và điều trị các bệnh lây truyền qua đường tình dục:</strong> Các bệnh này có thể làm tăng nguy cơ lây nhiễm HIV</li>
            <li><strong>Sử dụng bơm kim tiêm sạch:</strong> Không dùng chung dụng cụ tiêm chích giúp giảm nguy cơ lây nhiễm HIV đáng kể</li>
            <li><strong>Xét nghiệm thường xuyên:</strong> Biết tình trạng HIV của bạn và bạn tình là bước quan trọng trong việc ngăn ngừa lây truyền</li>
        </ul>
        `,
        imageUrl: doc2Img,
        author: "PGS.TS. Lê Văn C",
        publishDate: "2023-07-10",
        tags: ["PrEP", "PEP", "U=U", "Phòng ngừa"]
    }
];

const BasicHivInfoPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Thông Tin Cơ Bản về HIV/AIDS
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{ mb: 4 }}>
                Tìm hiểu những kiến thức cơ bản, chính xác và cập nhật về HIV/AIDS, giúp bạn hiểu rõ hơn về căn bệnh này và biết cách phòng ngừa hiệu quả.
            </Typography>

            {/* Search bar */}
            <Box sx={{ mb: 4, mt: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm thông tin..."
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

            {/* Featured Info Box */}
            <Paper
                elevation={3}
                sx={{
                    p: 3,
                    mb: 5,
                    borderRadius: 2,
                    backgroundImage: 'linear-gradient(to right, #e0f7fa, #b2ebf2)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center'
                }}
            >
                <Box sx={{ flex: 1, pr: { xs: 0, md: 3 }, mb: { xs: 3, md: 0 } }}>
                    <Typography variant="h4" gutterBottom>
                        Hiểu Đúng về HIV/AIDS
                    </Typography>
                    <Typography variant="body1" paragraph>
                        HIV là virus gây suy giảm miễn dịch ở người. AIDS là giai đoạn cuối cùng của nhiễm HIV khi hệ thống miễn dịch bị tổn thương nghiêm trọng.
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Nhiễm HIV không phải là bản án tử hình" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Điều trị ARV giúp người nhiễm sống khỏe mạnh" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="K=K: Điều trị hiệu quả = Không lây truyền" />
                        </ListItem>
                    </List>
                </Box>
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    maxWidth: { xs: '100%', md: '50%' }
                }}>
                    <img
                        src="/hivicon.png"
                        alt="HIV Awareness"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '250px',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
            </Paper>

            {/* Articles Grid */}
            <Grid container spacing={4}>
                {filteredArticles.map((article) => (
                    <Grid item xs={12} md={6} lg={4} key={article.id}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6,
                                }
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="200"
                                image={article.imageUrl || '/hivicon.png'}
                                alt={article.title}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {article.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {article.summary}
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                    {article.tags?.map((tag) => (
                                        <Chip
                                            key={tag}
                                            label={tag}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    ))}
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {article.author}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {article.publishDate}
                                    </Typography>
                                </Box>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    endIcon={<ArrowForwardIcon />}
                                >
                                    Đọc thêm
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filteredArticles.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6">
                        Không tìm thấy bài viết nào phù hợp với "{searchTerm}"
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default BasicHivInfoPage; 