// Dữ liệu cho chatbot dựa trên rule-based
const ChatbotData = {
    // Các câu chào và phản hồi mặc định
    greetings: [
        "Xin chào",
        "Chào bạn",
        "Hi",
        "Hello",
        "Xin chào bạn",
        "Chào",
    ],

    greetingResponses: [
        "Xin chào! Tôi là trợ lý ảo của Trung tâm HIV/AIDS. Tôi có thể giúp gì cho bạn?",
        "Chào bạn! Tôi có thể giúp bạn trả lời các câu hỏi về HIV/AIDS, các dịch vụ của chúng tôi hoặc đặt lịch hẹn.",
        "Xin chào! Tôi ở đây để hỗ trợ bạn với các thắc mắc về HIV/AIDS và các dịch vụ của trung tâm."
    ],

    // Các câu trả lời khi không hiểu câu hỏi
    fallbackResponses: [
        "Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể hỏi về HIV/AIDS, các dịch vụ của chúng tôi, hoặc cách đặt lịch hẹn.",
        "Tôi chưa được lập trình để trả lời câu hỏi đó. Bạn có thể hỏi về các chủ đề liên quan đến HIV/AIDS, xét nghiệm, điều trị hoặc phòng ngừa.",
        "Câu hỏi của bạn hơi phức tạp với tôi. Bạn có thể thử hỏi về các thông tin cơ bản về HIV/AIDS, các dịch vụ của trung tâm, hoặc cách đặt lịch hẹn."
    ],

    // Các câu hỏi và trả lời thường gặp
    faqs: [
        {
            keywords: ["hiv", "là gì", "là sao", "là như thế nào"],
            response: "HIV (Human Immunodeficiency Virus) là virus gây suy giảm miễn dịch ở người. HIV tấn công hệ thống miễn dịch và làm suy yếu khả năng chống lại các bệnh nhiễm trùng và một số loại ung thư. Nếu không được điều trị, HIV có thể dẫn đến AIDS (Acquired Immunodeficiency Syndrome)."
        },
        {
            keywords: ["aids", "là gì", "là sao", "là như thế nào"],
            response: "AIDS (Acquired Immunodeficiency Syndrome) là giai đoạn cuối của quá trình nhiễm HIV. Khi hệ thống miễn dịch bị suy yếu nghiêm trọng, cơ thể không thể chống lại các bệnh nhiễm trùng cơ hội và một số loại ung thư. Với sự tiến bộ trong điều trị, nhiều người nhiễm HIV có thể không bao giờ phát triển thành AIDS nếu được điều trị đúng cách."
        },
        {
            keywords: ["lây", "truyền", "lây nhiễm", "lây lan", "bị lây", "nhiễm"],
            response: "HIV có thể lây truyền qua các đường sau: 1) Quan hệ tình dục không bảo vệ với người nhiễm HIV; 2) Dùng chung kim tiêm hoặc các vật dụng tiêm chích với người nhiễm HIV; 3) Từ mẹ sang con trong quá trình mang thai, sinh con hoặc cho con bú; 4) Tiếp xúc với máu hoặc các dịch cơ thể có chứa HIV. HIV KHÔNG lây qua: nước mắt, nước bọt, mồ hôi, nước tiểu, phân, côn trùng đốt, dùng chung nhà vệ sinh, ôm, bắt tay hoặc dùng chung đồ dùng sinh hoạt."
        },
        {
            keywords: ["phòng", "ngừa", "phòng tránh", "bảo vệ", "không bị lây"],
            response: "Để phòng ngừa HIV: 1) Sử dụng bao cao su đúng cách khi quan hệ tình dục; 2) Không dùng chung kim tiêm hoặc dụng cụ tiêm chích; 3) Sử dụng PrEP (thuốc dự phòng trước phơi nhiễm) nếu bạn có nguy cơ cao; 4) Xét nghiệm HIV định kỳ nếu bạn có hành vi nguy cơ; 5) Điều trị sớm cho người nhiễm HIV để giảm khả năng lây truyền."
        },
        {
            keywords: ["xét nghiệm", "test", "kiểm tra"],
            response: "Trung tâm chúng tôi cung cấp các dịch vụ xét nghiệm HIV nhanh, bảo mật và miễn phí. Bạn có thể đến trực tiếp hoặc đặt lịch hẹn trước qua website hoặc điện thoại. Kết quả xét nghiệm nhanh có thể có trong vòng 20-30 phút. Chúng tôi cũng cung cấp tư vấn trước và sau xét nghiệm để hỗ trợ bạn."
        },
        {
            keywords: ["điều trị", "thuốc", "arv", "kháng virus", "thuốc kháng virus"],
            response: "Hiện nay, HIV có thể được kiểm soát hiệu quả bằng thuốc kháng virus (ARV). Người nhiễm HIV cần uống thuốc đều đặn theo chỉ định của bác sĩ. Điều trị ARV giúp giảm lượng virus trong máu xuống mức không phát hiện được, giúp người nhiễm sống khỏe mạnh và không lây truyền HIV cho người khác. Trung tâm chúng tôi cung cấp dịch vụ điều trị ARV và theo dõi định kỳ cho người nhiễm HIV."
        },
        {
            keywords: ["triệu chứng", "dấu hiệu", "nhận biết"],
            response: "Nhiều người nhiễm HIV có thể không có triệu chứng trong nhiều năm. Một số người có thể có các triệu chứng giống như cúm trong vài tuần đầu sau khi nhiễm, như sốt, đau họng, phát ban, đau cơ, mệt mỏi, sưng hạch. Cách duy nhất để biết chắc chắn là xét nghiệm HIV. Nếu không được điều trị, HIV có thể dẫn đến các triệu chứng nghiêm trọng hơn khi hệ miễn dịch suy yếu."
        },
        {
            keywords: ["đặt lịch", "hẹn", "đăng ký", "khám"],
            response: "Bạn có thể đặt lịch hẹn tại trung tâm chúng tôi bằng cách: 1) Đặt lịch trực tuyến qua website; 2) Gọi điện thoại đến số hotline; 3) Đến trực tiếp trung tâm. Khi đặt lịch, vui lòng cung cấp thông tin cá nhân cơ bản và lý do bạn muốn đến trung tâm để chúng tôi có thể phục vụ bạn tốt nhất."
        },
        {
            keywords: ["bảo mật", "riêng tư", "kín đáo"],
            response: "Trung tâm chúng tôi cam kết bảo mật thông tin của tất cả khách hàng. Mọi thông tin cá nhân, kết quả xét nghiệm và hồ sơ y tế đều được bảo mật nghiêm ngặt theo quy định của pháp luật. Chúng tôi cũng cung cấp các dịch vụ tư vấn và xét nghiệm ẩn danh nếu bạn mong muốn."
        },
        {
            keywords: ["prep", "dự phòng", "phơi nhiễm", "trước phơi nhiễm"],
            response: "PrEP (Pre-Exposure Prophylaxis) là thuốc dự phòng trước phơi nhiễm HIV. Đây là phương pháp dự phòng hiệu quả cho người có nguy cơ cao nhiễm HIV. PrEP cần được uống đều đặn theo chỉ định của bác sĩ và kết hợp với các biện pháp phòng ngừa khác như sử dụng bao cao su. Trung tâm chúng tôi cung cấp dịch vụ tư vấn và kê đơn PrEP."
        },
        {
            keywords: ["pep", "sau phơi nhiễm"],
            response: "PEP (Post-Exposure Prophylaxis) là thuốc dự phòng sau phơi nhiễm HIV. Đây là biện pháp khẩn cấp khi bạn nghĩ rằng mình vừa tiếp xúc với HIV (như quan hệ tình dục không an toàn, bị kim tiêm đâm). PEP cần được sử dụng trong vòng 72 giờ sau khi phơi nhiễm và uống liên tục trong 28 ngày. Hãy đến trung tâm chúng tôi ngay nếu bạn nghĩ mình cần PEP."
        },
        {
            keywords: ["tư vấn", "hỗ trợ", "tâm lý"],
            response: "Trung tâm chúng tôi cung cấp dịch vụ tư vấn tâm lý cho người nhiễm HIV và người có nguy cơ. Các chuyên gia tư vấn của chúng tôi có thể giúp bạn đối phó với các vấn đề tâm lý, xã hội liên quan đến HIV/AIDS, giảm kỳ thị và phân biệt đối xử. Bạn có thể đặt lịch tư vấn trực tiếp hoặc trực tuyến."
        },
        {
            keywords: ["chi phí", "phí", "giá", "bảo hiểm", "miễn phí"],
            response: "Nhiều dịch vụ tại trung tâm chúng tôi được cung cấp miễn phí hoặc với chi phí thấp, bao gồm xét nghiệm HIV, tư vấn, và một số trường hợp điều trị. Chúng tôi cũng chấp nhận bảo hiểm y tế. Vui lòng liên hệ trực tiếp với chúng tôi để biết thêm chi tiết về chi phí cụ thể cho các dịch vụ bạn quan tâm."
        },
        {
            keywords: ["địa chỉ", "ở đâu", "đường", "đến"],
            response: "Trung tâm HIV/AIDS của chúng tôi tọa lạc tại địa chỉ [địa chỉ của trung tâm]. Chúng tôi mở cửa từ thứ Hai đến thứ Sáu, từ 8:00 sáng đến 5:00 chiều. Bạn có thể đến bằng phương tiện công cộng hoặc xe cá nhân, có bãi đỗ xe miễn phí cho khách hàng."
        },
        {
            keywords: ["kỳ thị", "phân biệt", "đối xử"],
            response: "Kỳ thị và phân biệt đối xử là những thách thức lớn mà người nhiễm HIV phải đối mặt. Trung tâm chúng tôi cam kết tạo môi trường an toàn, tôn trọng cho tất cả mọi người. Chúng tôi cũng tổ chức các hoạt động giáo dục cộng đồng để giảm kỳ thị và phân biệt đối xử liên quan đến HIV/AIDS. Nếu bạn gặp phải kỳ thị, hãy liên hệ với chúng tôi để được hỗ trợ."
        }
    ],

    // Các chủ đề gợi ý để hiển thị cho người dùng
    suggestedTopics: [
        "HIV là gì?",
        "Cách lây truyền HIV",
        "Phòng ngừa HIV",
        "Xét nghiệm HIV",
        "Điều trị HIV",
        "Đặt lịch hẹn",
        "PrEP và PEP"
    ]
};

export default ChatbotData; 