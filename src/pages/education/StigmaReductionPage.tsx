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
    InputAdornment,
    Avatar
} from '@mui/material';
import {
    Search as SearchIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import doc7Img from '../../images/document/image7.jpg';
import doc8Img from '../../images/document/image8.jpg';

const articles = [
    {
        id: "stigma-myths",
        title: "Phá Vỡ Những Hiểu Lầm về HIV/AIDS",
        summary: "Tìm hiểu và đính chính những hiểu lầm phổ biến về HIV/AIDS để giảm sự kỳ thị.",
        content: `
        <h3>Hiểu lầm: HIV có thể lây truyền qua tiếp xúc thông thường</h3>
        <p><strong>Sự thật:</strong> HIV không lây truyền qua tiếp xúc thông thường như bắt tay, ôm, hôn má, ho, hắt hơi, dùng chung bát đĩa, bể bơi, nhà vệ sinh, hoặc côn trùng đốt. HIV chỉ lây truyền qua máu, tinh dịch, dịch âm đạo, và sữa mẹ.</p>
        
        <h3>Hiểu lầm: Người nhiễm HIV sẽ chết sớm</h3>
        <p><strong>Sự thật:</strong> Với điều trị ARV hiện đại, người nhiễm HIV có thể sống lâu dài và khỏe mạnh với tuổi thọ gần như tương đương với người không nhiễm HIV.</p>
        
        <h3>Hiểu lầm: Người nhiễm HIV không nên có con</h3>
        <p><strong>Sự thật:</strong> Với việc điều trị ARV hiệu quả và theo dõi y tế phù hợp, nguy cơ lây truyền HIV từ mẹ sang con có thể giảm xuống dưới 1%. Nhiều người nhiễm HIV đã có con khỏe mạnh và không nhiễm HIV.</p>
        
        <h3>Hiểu lầm: HIV là bệnh của người đồng tính hoặc người tiêm chích ma túy</h3>
        <p><strong>Sự thật:</strong> HIV có thể ảnh hưởng đến bất kỳ ai, không phân biệt tuổi tác, giới tính, khuynh hướng tình dục, chủng tộc, hay đẳng cấp xã hội. Việc gắn HIV với nhóm người cụ thể là không chính xác và gây ra sự kỳ thị.</p>
        
        <h3>Hiểu lầm: Người nhiễm HIV luôn có các triệu chứng rõ ràng</h3>
        <p><strong>Sự thật:</strong> Nhiều người nhiễm HIV không có triệu chứng trong nhiều năm. Cách duy nhất để biết chắc chắn tình trạng nhiễm HIV là xét nghiệm.</p>
        
        <h3>Hiểu lầm: Người nhiễm HIV không thể làm việc, học tập hoặc tham gia các hoạt động thông thường</h3>
        <p><strong>Sự thật:</strong> Người nhiễm HIV có thể làm việc, học tập, và tham gia mọi hoạt động xã hội bình thường. Không có lý do y tế hay khoa học nào để hạn chế sự tham gia của họ trong các hoạt động này.</p>
        
        <h3>Hiểu lầm: Nếu cả hai người đều nhiễm HIV, họ không cần thực hiện tình dục an toàn</h3>
        <p><strong>Sự thật:</strong> Ngay cả khi cả hai đều nhiễm HIV, vẫn cần thực hiện tình dục an toàn để tránh tái nhiễm với các chủng HIV khác có thể kháng thuốc, và để ngăn ngừa các bệnh lây truyền qua đường tình dục khác.</p>
        `,
        imageUrl: doc7Img,
        author: "ThS. Hoàng Thị G",
        publishDate: "2023-11-10",
        tags: ["Hiểu lầm", "Kỳ thị", "Giáo dục"]
    },
    {
        id: "reduce-stigma",
        title: "Các Chiến Lược Giảm Kỳ Thị HIV trong Cộng Đồng",
        summary: "Hướng dẫn về các cách thức để giảm sự kỳ thị và phân biệt đối xử liên quan đến HIV/AIDS.",
        content: `
        <h3>Tác hại của sự kỳ thị và phân biệt đối xử</h3>
        <p>Sự kỳ thị và phân biệt đối xử liên quan đến HIV có thể gây ra nhiều tác hại:</p>
        <ul>
            <li>Ngăn cản người ta đi xét nghiệm HIV và tìm kiếm điều trị</li>
            <li>Làm suy giảm chất lượng cuộc sống của người nhiễm HIV</li>
            <li>Cản trở các nỗ lực phòng ngừa HIV</li>
            <li>Làm tăng lo âu, trầm cảm và các vấn đề sức khỏe tâm thần khác</li>
            <li>Dẫn đến tình trạng bị cô lập xã hội và mất cơ hội việc làm, giáo dục</li>
        </ul>
        
        <h3>Chiến lược giảm kỳ thị HIV</h3>
        <p><strong>1. Giáo dục và nâng cao nhận thức</strong></p>
        <ul>
            <li>Cung cấp thông tin chính xác về HIV, bao gồm cách lây truyền và phòng ngừa</li>
            <li>Tổ chức các buổi nói chuyện, hội thảo, và chiến dịch truyền thông về HIV</li>
            <li>Lồng ghép giáo dục về HIV vào chương trình học tại trường học và nơi làm việc</li>
        </ul>
        
        <p><strong>2. Tiếp xúc trực tiếp với người nhiễm HIV</strong></p>
        <ul>
            <li>Tạo cơ hội cho người nhiễm HIV chia sẻ câu chuyện của họ</li>
            <li>Tổ chức các cuộc gặp gỡ giữa người nhiễm HIV và cộng đồng</li>
            <li>Phát triển các chương trình đồng đẳng và nhóm hỗ trợ</li>
        </ul>
        
        <p><strong>3. Sử dụng ngôn ngữ phù hợp</strong></p>
        <ul>
            <li>Tránh sử dụng các thuật ngữ mang tính kỳ thị như "nạn nhân AIDS" hay "người mắc AIDS"</li>
            <li>Thay vào đó, sử dụng các thuật ngữ như "người sống với HIV" hoặc "người nhiễm HIV"</li>
            <li>Không gắn HIV với "hành vi sai trái" hay "trừng phạt"</li>
        </ul>
        
        <p><strong>4. Thực thi chính sách và luật pháp bảo vệ</strong></p>
        <ul>
            <li>Ban hành và thực thi các luật chống phân biệt đối xử</li>
            <li>Đảm bảo quyền riêng tư và bảo mật thông tin của người nhiễm HIV</li>
            <li>Thúc đẩy các chính sách hòa nhập tại nơi làm việc và trường học</li>
        </ul>
        
        <p><strong>5. Đào tạo cho nhân viên y tế</strong></p>
        <ul>
            <li>Đào tạo nhân viên y tế về cách chăm sóc người nhiễm HIV mà không có sự kỳ thị</li>
            <li>Thúc đẩy môi trường y tế thân thiện và tôn trọng</li>
            <li>Đảm bảo bảo mật và riêng tư trong các dịch vụ y tế</li>
        </ul>
        
        <p><strong>6. Huy động sự tham gia của cộng đồng</strong></p>
        <ul>
            <li>Khuyến khích các nhà lãnh đạo cộng đồng và tôn giáo tham gia vào việc giảm kỳ thị</li>
            <li>Tổ chức các sự kiện cộng đồng để nâng cao nhận thức về HIV</li>
            <li>Hỗ trợ các tổ chức địa phương làm việc với người nhiễm HIV</li>
        </ul>
        
        <h3>Vai trò của truyền thông</h3>
        <p>Truyền thông đóng vai trò quan trọng trong việc giảm kỳ thị HIV thông qua:</p>
        <ul>
            <li>Cung cấp thông tin chính xác về HIV</li>
            <li>Tránh sử dụng ngôn ngữ và hình ảnh mang tính kỳ thị</li>
            <li>Kể những câu chuyện tích cực về người sống với HIV</li>
            <li>Thúc đẩy sự đa dạng và hòa nhập trong các nội dung truyền thông</li>
        </ul>
        `,
        imageUrl: doc8Img,
        author: "TS. Trần Văn H",
        publishDate: "2023-12-05",
        tags: ["Chiến lược", "Cộng đồng", "Kỳ thị"]
    }
];

const testimonials = [
    {
        id: 1,
        name: "Minh Anh",
        role: "Người sống với HIV từ 2012",
        content: "Tôi đã phải đối mặt với nhiều sự kỳ thị khi mọi người biết về tình trạng HIV của tôi. Nhưng qua thời gian, với sự hiểu biết và giáo dục, nhiều người xung quanh tôi đã thay đổi thái độ. Tôi tin rằng giáo dục là chìa khóa để xóa bỏ kỳ thị.",
        avatar: "/counseling.svg"
    },
    {
        id: 2,
        name: "Hoàng Nam",
        role: "Nhân viên y tế",
        content: "Là nhân viên y tế, tôi đã chứng kiến cách sự kỳ thị ngăn cản mọi người tìm kiếm dịch vụ chăm sóc HIV. Chúng ta cần tạo ra môi trường y tế an toàn và không phán xét để mọi người cảm thấy thoải mái khi tìm kiếm sự chăm sóc họ cần.",
        avatar: "/service-1.svg"
    },
    {
        id: 3,
        name: "Thu Hà",
        role: "Giáo viên",
        content: "Khi tôi dạy học sinh về HIV, tôi nhấn mạnh tầm quan trọng của sự đồng cảm và hiểu biết. Tôi tin rằng thế hệ trẻ có thể xây dựng một tương lai không có sự kỳ thị nếu chúng ta giáo dục họ từ sớm.",
        avatar: "/service-2.svg"
    }
];

const StigmaReductionPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Giảm Kỳ Thị HIV/AIDS
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{ mb: 4 }}>
                Tìm hiểu về sự kỳ thị liên quan đến HIV/AIDS và các chiến lược để giảm sự phân biệt đối xử, xây dựng một xã hội cởi mở và hòa nhập hơn cho tất cả mọi người.
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
                    backgroundImage: 'linear-gradient(to right, #ffebee, #ffcdd2)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center'
                }}
            >
                <Box sx={{ flex: 1, pr: { xs: 0, md: 3 }, mb: { xs: 3, md: 0 } }}>
                    <Typography variant="h4" gutterBottom>
                        Chống Kỳ Thị, Xây Dựng Sự Đồng Cảm
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Sự kỳ thị và phân biệt đối xử là một trong những rào cản lớn nhất trong việc phòng chống HIV/AIDS. Khi chúng ta thay đổi cách nhìn và đối xử với người nhiễm HIV, chúng ta không chỉ cải thiện cuộc sống của họ mà còn giúp kiểm soát dịch HIV hiệu quả hơn.
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleIcon color="error" />
                            </ListItemIcon>
                            <ListItemText primary="Hiểu biết đúng về HIV giúp xóa bỏ sự kỳ thị" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleIcon color="error" />
                            </ListItemIcon>
                            <ListItemText primary="Sự kỳ thị có thể ngăn cản việc xét nghiệm và điều trị HIV" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleIcon color="error" />
                            </ListItemIcon>
                            <ListItemText primary="Mỗi người đều có vai trò trong việc giảm kỳ thị" />
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
                        alt="HIV Stigma Reduction"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '250px',
                            objectFit: 'contain'
                        }}
                    />
                </Box>
            </Paper>

            {/* Testimonials */}
            <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
                Tiếng Nói Từ Cộng Đồng
            </Typography>
            <Grid container spacing={4} sx={{ mb: 6 }}>
                {testimonials.map((testimonial) => (
                    <Grid item xs={12} md={4} key={testimonial.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Avatar
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        sx={{ width: 56, height: 56, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="h6">{testimonial.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{testimonial.role}</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body1" paragraph>
                                    "{testimonial.content}"
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Articles Grid */}
            <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
                Bài Viết Về Giảm Kỳ Thị
            </Typography>
            <Grid container spacing={4}>
                {filteredArticles.map((article) => (
                    <Grid item xs={12} md={6} key={article.id}>
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
                                            color="error"
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
                                    color="error"
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

export default StigmaReductionPage;
