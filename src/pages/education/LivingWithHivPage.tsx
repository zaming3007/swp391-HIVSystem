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
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Search as SearchIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircle as CheckCircleIcon,
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

const articles = [
    {
        id: "arv-therapy",
        title: "Điều Trị ARV: Tất Cả Những Điều Bạn Cần Biết",
        summary: "Tìm hiểu về liệu pháp kháng retrovirus (ARV), cách thức hoạt động và tầm quan trọng của việc tuân thủ điều trị.",
        content: `
        <h3>Liệu pháp ARV là gì?</h3>
        <p>Liệu pháp kháng retrovirus (ARV) là phương pháp điều trị HIV bằng cách sử dụng các loại thuốc để ngăn chặn sự nhân lên của virus. Thuốc ARV không thể loại bỏ hoàn toàn HIV khỏi cơ thể, nhưng có thể giảm lượng virus xuống mức không phát hiện được, giúp người nhiễm sống khỏe mạnh và ngăn ngừa lây truyền.</p>
        
        <h3>Cách thức hoạt động của thuốc ARV</h3>
        <p>Thuốc ARV hoạt động bằng cách can thiệp vào các giai đoạn khác nhau trong chu kỳ sống của HIV, ngăn chặn sự nhân lên của virus:</p>
        <ul>
            <li><strong>Thuốc ức chế men sao chép ngược (NRTIs và NNRTIs):</strong> Ngăn chặn virus chuyển đổi RNA của nó thành DNA</li>
            <li><strong>Thuốc ức chế protease (PIs):</strong> Ngăn chặn enzyme protease cắt protein virus thành các phần nhỏ hơn cần thiết để tạo ra các virus mới</li>
            <li><strong>Thuốc ức chế integrase (INSTIs):</strong> Ngăn chặn DNA của virus tích hợp vào DNA của tế bào người</li>
            <li><strong>Thuốc ức chế dung hợp và ức chế CCR5:</strong> Ngăn chặn HIV gắn kết và xâm nhập vào tế bào CD4</li>
        </ul>
        
        <h3>Tầm quan trọng của việc tuân thủ điều trị</h3>
        <p>Tuân thủ điều trị ARV là việc uống thuốc đúng liều lượng, đúng thời điểm và theo đúng hướng dẫn của bác sĩ. Việc này cực kỳ quan trọng vì:</p>
        <ul>
            <li>Giúp duy trì nồng độ thuốc trong máu ở mức cần thiết để kiểm soát virus</li>
            <li>Ngăn ngừa sự phát triển của HIV kháng thuốc</li>
            <li>Giảm nguy cơ lây truyền HIV cho người khác</li>
            <li>Cải thiện chất lượng cuộc sống và kéo dài tuổi thọ</li>
        </ul>
        
        <h3>Các phác đồ điều trị ARV phổ biến</h3>
        <p>Hiện nay, phác đồ điều trị HIV thường bao gồm kết hợp từ 3 loại thuốc ARV trở lên, thường được gọi là liệu pháp kháng retrovirus kết hợp (cART). Nhiều phác đồ hiện đại chỉ cần uống một viên mỗi ngày, giúp việc tuân thủ điều trị dễ dàng hơn.</p>
        
        <h3>Tác dụng phụ và cách quản lý</h3>
        <p>Thuốc ARV có thể gây ra một số tác dụng phụ, đặc biệt là trong những tuần đầu điều trị. Các tác dụng phụ phổ biến bao gồm:</p>
        <ul>
            <li>Buồn nôn, nôn, tiêu chảy</li>
            <li>Mệt mỏi</li>
            <li>Đau đầu</li>
            <li>Phát ban</li>
            <li>Khó ngủ</li>
        </ul>
        <p>Hầu hết các tác dụng phụ sẽ giảm dần và biến mất sau vài tuần. Nếu tác dụng phụ kéo dài hoặc nghiêm trọng, hãy tham khảo ý kiến bác sĩ để điều chỉnh phác đồ.</p>
        
        <h3>Thời điểm bắt đầu điều trị ARV</h3>
        <p>Theo hướng dẫn hiện nay, việc điều trị ARV được khuyến nghị cho tất cả mọi người được chẩn đoán nhiễm HIV, bất kể tình trạng miễn dịch hay giai đoạn lâm sàng. Việc bắt đầu điều trị càng sớm càng tốt giúp bảo vệ hệ miễn dịch, ngăn ngừa các biến chứng liên quan đến HIV, và giảm nguy cơ lây truyền.</p>
        `,
        imageUrl: "/document/image6.jpg",
        author: "BS. Phạm Thị D",
        publishDate: "2023-08-05",
        tags: ["Điều trị ARV", "Tuân thủ điều trị", "Sức khỏe"]
    },
    {
        id: "nutrition-wellbeing",
        title: "Dinh Dưỡng và Sức Khỏe Cho Người Nhiễm HIV",
        summary: "Hướng dẫn về chế độ dinh dưỡng, luyện tập và chăm sóc sức khỏe tổng thể cho người sống với HIV.",
        content: `
        <h3>Tầm quan trọng của dinh dưỡng đối với người nhiễm HIV</h3>
        <p>Dinh dưỡng đóng vai trò quan trọng trong việc duy trì sức khỏe tổng thể và hỗ trợ hệ miễn dịch của người sống với HIV. Chế độ ăn uống cân bằng, lành mạnh giúp:</p>
        <ul>
            <li>Tăng cường hệ miễn dịch và khả năng chống lại nhiễm trùng</li>
            <li>Duy trì cân nặng và sức mạnh cơ bắp</li>
            <li>Cải thiện hiệu quả của thuốc ARV</li>
            <li>Giảm tác dụng phụ của thuốc</li>
            <li>Cải thiện chất lượng cuộc sống</li>
        </ul>
        
        <h3>Nguyên tắc dinh dưỡng cho người sống với HIV</h3>
        <p><strong>1. Đảm bảo đủ protein:</strong> Protein giúp xây dựng và duy trì khối lượng cơ bắp, và hỗ trợ hệ miễn dịch. Nguồn protein tốt bao gồm thịt nạc, cá, trứng, đậu và các loại hạt.</p>
        
        <p><strong>2. Tiêu thụ đủ calo:</strong> Người nhiễm HIV có thể cần nhiều calo hơn để duy trì cân nặng, đặc biệt khi cơ thể đang chống lại nhiễm trùng.</p>
        
        <p><strong>3. Bổ sung vi chất dinh dưỡng:</strong> Vitamin và khoáng chất đóng vai trò quan trọng trong việc duy trì hệ miễn dịch khỏe mạnh. Ưu tiên thực phẩm giàu vitamin A, B, C, E và khoáng chất như kẽm, selen.</p>
        
        <p><strong>4. Đảm bảo an toàn thực phẩm:</strong> Người nhiễm HIV có nguy cơ cao mắc các bệnh lây truyền qua thực phẩm. Cần rửa tay, thực phẩm kỹ lưỡng, nấu chín thức ăn và tránh các thực phẩm có nguy cơ cao như trứng sống, thịt chưa nấu chín.</p>
        
        <h3>Hoạt động thể chất và tập luyện</h3>
        <p>Hoạt động thể chất đều đặn mang lại nhiều lợi ích cho người nhiễm HIV:</p>
        <ul>
            <li>Tăng cường sức mạnh cơ bắp và sức bền</li>
            <li>Cải thiện sức khỏe tim mạch</li>
            <li>Giảm stress và cải thiện tâm trạng</li>
            <li>Giảm tác dụng phụ của thuốc như lipodystrophy (rối loạn phân bố mỡ)</li>
            <li>Cải thiện chất lượng giấc ngủ</li>
        </ul>
        
        <p>Nên tham khảo ý kiến bác sĩ trước khi bắt đầu chương trình tập luyện. Hầu hết người nhiễm HIV được khuyến khích tập luyện vừa phải, bao gồm cả bài tập sức bền và bài tập tim mạch.</p>
        
        <h3>Quản lý stress và sức khỏe tâm thần</h3>
        <p>Sống với HIV có thể gây ra stress và các vấn đề về sức khỏe tâm thần. Một số chiến lược giúp quản lý stress bao gồm:</p>
        <ul>
            <li>Thực hành mindfulness và thiền định</li>
            <li>Tham gia các nhóm hỗ trợ</li>
            <li>Tìm kiếm tư vấn tâm lý khi cần thiết</li>
            <li>Duy trì kết nối xã hội</li>
            <li>Đảm bảo ngủ đủ giấc</li>
            <li>Hạn chế rượu, thuốc lá và ma túy</li>
        </ul>
        
        <h3>Giấc ngủ và nghỉ ngơi</h3>
        <p>Giấc ngủ chất lượng là yếu tố quan trọng trong việc duy trì sức khỏe tổng thể và hệ miễn dịch khỏe mạnh. Người nhiễm HIV nên cố gắng:</p>
        <ul>
            <li>Ngủ 7-9 giờ mỗi đêm</li>
            <li>Duy trì lịch ngủ đều đặn</li>
            <li>Tạo môi trường ngủ thoải mái</li>
            <li>Tránh caffeine, rượu và màn hình điện tử trước khi đi ngủ</li>
        </ul>
        `,
        imageUrl: "/document/image7.jpg",
        author: "TS. Nguyễn Văn E",
        publishDate: "2023-09-15",
        tags: ["Dinh dưỡng", "Tập luyện", "Sức khỏe tổng thể"]
    },
    {
        id: "hiv-reproduction",
        title: "Kế Hoạch Hóa Gia Đình và Sinh Sản An Toàn",
        summary: "Hướng dẫn về sinh sản an toàn và kế hoạch hóa gia đình cho người sống với HIV.",
        content: `
        <h3>Kế hoạch hóa gia đình cho người nhiễm HIV</h3>
        <p>Người sống với HIV có thể có một cuộc sống tình dục khỏe mạnh và lập kế hoạch gia đình như bất kỳ ai khác. Với sự tiến bộ của y học hiện đại, nguy cơ lây truyền HIV từ mẹ sang con và giữa các bạn tình đã giảm đáng kể.</p>
        
        <h3>Ngăn ngừa lây truyền HIV cho bạn tình</h3>
        <p>Có nhiều chiến lược để ngăn ngừa lây truyền HIV cho bạn tình không nhiễm HIV:</p>
        <ul>
            <li><strong>Điều trị hiệu quả (U=U):</strong> Khi người nhiễm HIV duy trì điều trị ARV và đạt được tải lượng virus không phát hiện được trong thời gian dài (thường là 6 tháng trở lên), họ không thể lây truyền HIV qua đường tình dục.</li>
            <li><strong>PrEP:</strong> Bạn tình không nhiễm HIV có thể sử dụng thuốc dự phòng trước phơi nhiễm để giảm nguy cơ lây nhiễm.</li>
            <li><strong>Sử dụng bao cao su:</strong> Bao cao su vẫn là một phương pháp hiệu quả để ngăn ngừa lây truyền HIV và các bệnh lây truyền qua đường tình dục khác.</li>
        </ul>
        
        <h3>Mang thai khi nhiễm HIV</h3>
        <p>Với việc quản lý y tế thích hợp, phụ nữ nhiễm HIV có thể mang thai và sinh con khỏe mạnh, không bị nhiễm HIV. Các biện pháp phòng ngừa lây truyền từ mẹ sang con bao gồm:</p>
        <ul>
            <li>Điều trị ARV hiệu quả cho người mẹ trước và trong thời gian mang thai</li>
            <li>Đảm bảo tải lượng virus không phát hiện được trong thời gian mang thai và sinh nở</li>
            <li>Trong một số trường hợp, có thể cân nhắc phẫu thuật lấy thai (mổ lấy thai) để giảm nguy cơ lây truyền</li>
            <li>Điều trị dự phòng ARV cho trẻ sơ sinh</li>
            <li>Tư vấn về việc cho con bú (trong nhiều quốc gia phát triển, không khuyến khích cho con bú; tại Việt Nam, cần tuân theo hướng dẫn của bác sĩ)</li>
        </ul>
        
        <h3>Các phương pháp thụ thai an toàn cho cặp đôi nhiễm HIV</h3>
        <p><strong>1. Khi cả hai đều nhiễm HIV:</strong> Vẫn nên thực hiện các biện pháp an toàn để tránh tái nhiễm với các chủng HIV khác có thể kháng thuốc.</p>
        
        <p><strong>2. Khi chỉ một người nhiễm HIV:</strong></p>
        <ul>
            <li><strong>Người nam nhiễm HIV:</strong> Có thể xem xét "rửa tinh trùng" (loại bỏ HIV khỏi tinh dịch) kết hợp với thụ tinh trong ống nghiệm hoặc thụ tinh nhân tạo.</li>
            <li><strong>Người nữ nhiễm HIV:</strong> Có thể thực hiện thụ tinh tại nhà với tinh trùng của bạn tình không nhiễm HIV, kết hợp với điều trị ARV hiệu quả.</li>
            <li><strong>Thụ tinh tự nhiên:</strong> Nếu người nhiễm HIV duy trì tải lượng virus không phát hiện được trong thời gian dài, cặp đôi có thể cân nhắc thụ tinh tự nhiên trong thời điểm rụng trứng.</li>
        </ul>
        
        <h3>Các phương pháp tránh thai</h3>
        <p>Người nhiễm HIV có thể sử dụng hầu hết các phương pháp tránh thai thông thường. Tuy nhiên, cần lưu ý một số tương tác giữa thuốc ARV và các biện pháp tránh thai hormone. Luôn tham khảo ý kiến bác sĩ để chọn phương pháp phù hợp nhất.</p>
        <ul>
            <li><strong>Bao cao su:</strong> Không chỉ ngăn ngừa mang thai mà còn giúp ngăn ngừa lây truyền HIV và các bệnh lây truyền qua đường tình dục khác</li>
            <li><strong>Thuốc tránh thai:</strong> Một số loại thuốc ARV có thể làm giảm hiệu quả của thuốc tránh thai hormone</li>
            <li><strong>Vòng tránh thai (IUD):</strong> An toàn và hiệu quả cho phụ nữ nhiễm HIV</li>
            <li><strong>Tiêm tránh thai:</strong> Có thể là lựa chọn tốt nhưng cần kiểm tra tương tác thuốc</li>
            <li><strong>Triệt sản:</strong> Lựa chọn vĩnh viễn cho những người không muốn có thêm con</li>
        </ul>
        `,
        imageUrl: "/document/image8.jpg",
        author: "BS. CK2. Lê Thị F",
        publishDate: "2023-10-20",
        tags: ["Kế hoạch hóa gia đình", "Mang thai", "Sinh sản"]
    }
];

const LivingWithHivPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFaqChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedFaq(isExpanded ? panel : false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Sống Khỏe Mạnh Với HIV
            </Typography>
            <Typography variant="subtitle1" paragraph sx={{ mb: 4 }}>
                Tìm hiểu cách sống khỏe mạnh, tích cực với HIV thông qua việc quản lý điều trị, dinh dưỡng, chăm sóc sức khỏe toàn diện và các chiến lược để cải thiện chất lượng cuộc sống.
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
                    backgroundImage: 'linear-gradient(to right, #e8f5e9, #c8e6c9)',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center'
                }}
            >
                <Box sx={{ flex: 1, pr: { xs: 0, md: 3 }, mb: { xs: 3, md: 0 } }}>
                    <Typography variant="h4" gutterBottom>
                        Cuộc Sống Với HIV Ngày Nay
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Với những tiến bộ trong điều trị, người nhiễm HIV có thể sống lâu dài và khỏe mạnh như những người không nhiễm HIV. Chất lượng cuộc sống không còn bị ảnh hưởng đáng kể nếu được điều trị kịp thời và đúng cách.
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Tuân thủ điều trị ARV giúp kiểm soát virus HIV hiệu quả" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Chế độ dinh dưỡng cân bằng và luyện tập thể dục đều đặn" />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText primary="Chăm sóc sức khỏe tâm thần cũng quan trọng như sức khỏe thể chất" />
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
                        src="/document/image2.jpg"
                        alt="Living with HIV"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '250px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                        }}
                    />
                </Box>
            </Paper>

            {/* FAQ Section */}
            <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
                Câu Hỏi Thường Gặp
            </Typography>
            <Box sx={{ mb: 5 }}>
                <Accordion expanded={expandedFaq === 'panel1'} onChange={handleFaqChange('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="h6">Tôi có thể sống bao lâu với HIV?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Với điều trị ARV hiệu quả, người nhiễm HIV có thể sống đến tuổi già và có tuổi thọ gần như tương đương với người không nhiễm HIV. Nghiên cứu cho thấy rằng người nhiễm HIV bắt đầu điều trị sớm và duy trì điều trị có thể sống thêm gần 50 năm sau khi được chẩn đoán.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expandedFaq === 'panel2'} onChange={handleFaqChange('panel2')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                    >
                        <Typography variant="h6">Tôi có thể kết hôn và có con không?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Có, người nhiễm HIV có thể kết hôn và có con. Với điều trị ARV hiệu quả, nguy cơ lây truyền HIV cho bạn đời gần như bằng không. Đối với việc có con, có nhiều phương pháp an toàn để giảm thiểu nguy cơ lây truyền từ mẹ sang con xuống dưới 1%. Bạn nên tham khảo ý kiến bác sĩ để được tư vấn cụ thể cho trường hợp của mình.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expandedFaq === 'panel3'} onChange={handleFaqChange('panel3')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3a-content"
                        id="panel3a-header"
                    >
                        <Typography variant="h6">Làm thế nào để tôi đối phó với tác dụng phụ của thuốc ARV?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Thuốc ARV hiện đại ít gây tác dụng phụ hơn nhiều so với trước đây. Tuy nhiên, nếu bạn gặp tác dụng phụ, hãy trao đổi với bác sĩ thay vì tự ý ngừng thuốc. Nhiều tác dụng phụ có thể được quản lý bằng cách điều chỉnh thời gian uống thuốc, thay đổi chế độ ăn uống, hoặc trong một số trường hợp, thay đổi phác đồ điều trị.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expandedFaq === 'panel4'} onChange={handleFaqChange('panel4')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4a-content"
                        id="panel4a-header"
                    >
                        <Typography variant="h6">Tôi có nên tiết lộ tình trạng HIV của mình cho người khác không?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Quyết định tiết lộ tình trạng HIV của bạn là lựa chọn cá nhân và phụ thuộc vào nhiều yếu tố. Bạn có nghĩa vụ pháp lý và đạo đức phải thông báo cho bạn tình. Đối với người khác, bạn có thể cân nhắc mức độ tin cậy của mối quan hệ, sự hỗ trợ tiềm năng, và rủi ro phân biệt đối xử. Các chuyên gia tâm lý hoặc nhóm hỗ trợ HIV có thể giúp bạn đưa ra quyết định và cách tiếp cận phù hợp.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* Articles Grid */}
            <Typography variant="h4" gutterBottom sx={{ mt: 6, mb: 3 }}>
                Bài Viết Về Sống Khỏe Với HIV
            </Typography>
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
                                image={article.imageUrl || '/document/image3.jpg'}
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
                                            color="success"
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
                                    color="success"
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

export default LivingWithHivPage;
