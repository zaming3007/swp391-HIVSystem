import { v4 as uuidv4 } from 'uuid';
import { Consultation } from '../../types';

// Danh sách vai trò người trả lời
export type ResponderRole = 'doctor' | 'staff' | 'counselor';

// Thông tin người trả lời
export interface Responder {
    id: string;
    firstName: string;
    lastName: string;
    role: ResponderRole;
    specialization?: string;
    imageUrl?: string;
}

// Danh sách các chủ đề tư vấn
export const CONSULTATION_TOPICS = [
    'ARV',
    'CD4',
    'Tải lượng virus',
    'Tác dụng phụ',
    'Dinh dưỡng',
    'Sức khỏe tinh thần',
    'Phòng ngừa',
    'Khác'
];

// Danh sách các người trả lời mẫu
export const MOCK_RESPONDERS: Responder[] = [
    {
        id: '1',
        firstName: 'Nguyễn',
        lastName: 'Văn A',
        role: 'doctor',
        specialization: 'Bác sĩ chuyên khoa HIV/AIDS',
        imageUrl: '/images/doctors/doctor1.jpg'
    },
    {
        id: '2',
        firstName: 'Trần',
        lastName: 'Thị B',
        role: 'doctor',
        specialization: 'Bác sĩ nội khoa',
        imageUrl: '/images/doctors/doctor2.jpg'
    },
    {
        id: '3',
        firstName: 'Lê',
        lastName: 'Văn C',
        role: 'staff',
        specialization: 'Tư vấn viên',
        imageUrl: '/images/staff/staff1.jpg'
    },
    {
        id: '4',
        firstName: 'Phạm',
        lastName: 'Thị D',
        role: 'counselor',
        specialization: 'Chuyên viên tâm lý',
        imageUrl: '/images/staff/staff2.jpg'
    }
];

// Danh sách các câu hỏi mẫu
export const MOCK_CONSULTATIONS: Consultation[] = [
    {
        id: uuidv4(),
        patientId: 'user1',
        patientName: 'Hoàng Văn Nam',
        title: 'Tác dụng phụ của thuốc ARV',
        question: 'Tôi mới bắt đầu điều trị ARV được 2 tuần và gặp một số vấn đề như buồn nôn, mệt mỏi và đau đầu. Đây có phải là tác dụng phụ bình thường không và tôi nên làm gì để giảm bớt các triệu chứng này?',
        category: 'Tác dụng phụ',
        topic: 'ARV',
        response: 'Các triệu chứng bạn đang gặp phải là tác dụng phụ khá phổ biến khi bắt đầu điều trị ARV. Thông thường, các tác dụng phụ này sẽ giảm dần sau 4-6 tuần khi cơ thể thích nghi với thuốc. Để giảm bớt các triệu chứng:\n\n1. Uống thuốc cùng với bữa ăn (trừ khi bác sĩ chỉ định uống lúc đói)\n2. Uống đủ nước\n3. Nghỉ ngơi hợp lý\n4. Tránh rượu bia và các chất kích thích\n\nNếu các triệu chứng trở nên nghiêm trọng hơn hoặc kéo dài quá 4 tuần, bạn nên liên hệ với bác sĩ điều trị để được tư vấn thêm. Trong một số trường hợp, có thể cần điều chỉnh phác đồ điều trị.',
        responderId: '1',
        responderName: 'Bs. Nguyễn Văn A',
        status: 'answered',
        createdAt: new Date(2023, 5, 15).toISOString(),
        answeredAt: new Date(2023, 5, 16).toISOString()
    },
    {
        id: uuidv4(),
        patientId: 'user1',
        patientName: 'Hoàng Văn Nam',
        title: 'Chỉ số CD4 thấp',
        question: 'Kết quả xét nghiệm gần đây cho thấy chỉ số CD4 của tôi là 320 cells/mm³. Tôi đã điều trị ARV được 6 tháng. Chỉ số này có quá thấp không và tôi cần làm gì để cải thiện?',
        category: 'CD4',
        topic: 'CD4',
        response: 'Chỉ số CD4 của bạn (320 cells/mm³) hiện đang thấp hơn mức bình thường (500-1500 cells/mm³), nhưng điều này không hiếm gặp trong 6 tháng đầu điều trị. Điều quan trọng là theo dõi xu hướng thay đổi của chỉ số CD4 theo thời gian.\n\nĐể cải thiện chỉ số CD4:\n\n1. Tuân thủ điều trị ARV một cách nghiêm ngặt, không bỏ liều\n2. Cải thiện chế độ dinh dưỡng với nhiều protein, vitamin và khoáng chất\n3. Tập thể dục đều đặn nhưng vừa phải\n4. Giảm stress và đảm bảo ngủ đủ giấc\n5. Tránh hút thuốc và rượu bia\n\nChúng tôi sẽ tiếp tục theo dõi chỉ số CD4 của bạn trong các lần khám tiếp theo. Nếu sau 3-6 tháng nữa mà chỉ số không tăng, chúng ta có thể cân nhắc điều chỉnh phác đồ điều trị.',
        responderId: '2',
        responderName: 'Bs. Trần Thị B',
        status: 'answered',
        createdAt: new Date(2023, 6, 10).toISOString(),
        answeredAt: new Date(2023, 6, 11).toISOString()
    },
    {
        id: uuidv4(),
        patientId: 'user1',
        patientName: 'Hoàng Văn Nam',
        title: 'Tiết lộ tình trạng HIV cho người thân',
        question: 'Tôi đang gặp khó khăn trong việc quyết định có nên tiết lộ tình trạng HIV của mình cho gia đình và bạn bè không. Tôi lo lắng về phản ứng của họ và sợ bị kỳ thị. Tôi nên làm thế nào và khi nào là thời điểm thích hợp để chia sẻ?',
        category: 'Sức khỏe tinh thần',
        topic: 'Khác',
        response: 'Quyết định tiết lộ tình trạng HIV là một quyết định cá nhân và không có câu trả lời đúng hay sai. Đây là một số điều bạn có thể cân nhắc:\n\n1. Trước tiên, hãy đảm bảo bạn đã chấp nhận tình trạng của mình và có đủ thông tin về HIV để giải thích cho người khác\n\n2. Bắt đầu với những người bạn tin tưởng nhất và những người có khả năng hỗ trợ bạn\n\n3. Chuẩn bị cho các phản ứng khác nhau - một số người có thể cần thời gian để hiểu và chấp nhận\n\n4. Cân nhắc tham gia các nhóm hỗ trợ nơi bạn có thể chia sẻ kinh nghiệm với những người khác đang trong tình huống tương tự\n\nTrung tâm chúng tôi có dịch vụ tư vấn tâm lý chuyên sâu về vấn đề này. Bạn có thể đặt lịch hẹn để được hỗ trợ trong quá trình ra quyết định và chuẩn bị cho các cuộc trò chuyện với người thân.',
        responderId: '4',
        responderName: 'CV. Phạm Thị D',
        status: 'answered',
        createdAt: new Date(2023, 7, 5).toISOString(),
        answeredAt: new Date(2023, 7, 7).toISOString()
    },
    {
        id: uuidv4(),
        patientId: 'user1',
        patientName: 'Hoàng Văn Nam',
        title: 'Chế độ dinh dưỡng phù hợp',
        question: 'Tôi muốn biết về chế độ dinh dưỡng phù hợp cho người sống chung với HIV. Có những thực phẩm nào nên ăn nhiều và những thực phẩm nào nên hạn chế? Làm thế nào để tăng cường hệ miễn dịch thông qua chế độ ăn?',
        category: 'Dinh dưỡng',
        topic: 'Dinh dưỡng',
        status: 'pending',
        createdAt: new Date(2023, 8, 1).toISOString()
    },
    {
        id: uuidv4(),
        patientId: 'user2',
        patientName: 'Nguyễn Thị Hương',
        title: 'Khả năng lây truyền khi tải lượng virus không phát hiện',
        question: 'Tôi đã điều trị ARV được 1 năm và kết quả xét nghiệm gần đây cho thấy tải lượng virus của tôi đã ở mức không phát hiện được. Tôi muốn biết về khả năng lây truyền HIV trong trường hợp này và liệu tôi có thể quan hệ tình dục an toàn mà không cần sử dụng biện pháp bảo vệ không?',
        category: 'Tải lượng virus',
        topic: 'Tải lượng virus',
        response: 'Khi tải lượng virus ở mức không phát hiện được (thường là dưới 20 bản sao/ml) và duy trì ổn định trong ít nhất 6 tháng, nguy cơ lây truyền HIV qua đường tình dục giảm xuống gần như bằng 0. Đây là khái niệm được gọi là U=U (Undetectable = Untransmittable) hay "Không phát hiện = Không lây truyền".\n\nTuy nhiên, có một số điểm quan trọng cần lưu ý:\n\n1. Cần duy trì việc uống thuốc ARV đều đặn để giữ tải lượng virus ở mức không phát hiện\n\n2. Xét nghiệm tải lượng virus định kỳ (3-6 tháng/lần) để đảm bảo nó vẫn ở mức không phát hiện\n\n3. U=U chỉ áp dụng cho lây truyền HIV, không bảo vệ bạn khỏi các bệnh lây truyền qua đường tình dục khác\n\nVì vậy, mặc dù nguy cơ lây truyền HIV rất thấp, việc sử dụng bao cao su vẫn được khuyến nghị để bảo vệ bạn và bạn tình khỏi các bệnh lây truyền qua đường tình dục khác.',
        responderId: '1',
        responderName: 'Bs. Nguyễn Văn A',
        status: 'answered',
        createdAt: new Date(2023, 7, 20).toISOString(),
        answeredAt: new Date(2023, 7, 21).toISOString()
    },
    {
        id: uuidv4(),
        patientId: 'user2',
        patientName: 'Nguyễn Thị Hương',
        title: 'Tương tác thuốc ARV với các thuốc khác',
        question: 'Tôi đang điều trị ARV và gần đây bác sĩ chẩn đoán tôi bị viêm xoang và kê đơn kháng sinh. Tôi lo lắng về tương tác giữa thuốc ARV và kháng sinh. Tôi có nên thông báo cho bác sĩ về việc tôi đang dùng ARV không? Có nguy cơ nào khi dùng đồng thời hai loại thuốc này?',
        category: 'ARV',
        topic: 'ARV',
        status: 'pending',
        createdAt: new Date(2023, 8, 5).toISOString()
    }
];

// Hàm lấy danh sách câu hỏi theo userId
export const getConsultationsByUserId = (userId: string): Consultation[] => {
    return MOCK_CONSULTATIONS.filter(consultation => consultation.patientId === userId);
};

// Hàm lấy chi tiết một câu hỏi theo id
export const getConsultationById = (id: string): Consultation | undefined => {
    return MOCK_CONSULTATIONS.find(consultation => consultation.id === id);
};

// Hàm lấy danh sách câu hỏi đang chờ trả lời
export const getPendingConsultations = (): Consultation[] => {
    return MOCK_CONSULTATIONS.filter(consultation => consultation.status === 'pending');
};

// Hàm tạo câu hỏi mới
export const createConsultation = (data: {
    patientId: string;
    patientName?: string;
    topic: string;
    question: string;
}): Consultation => {
    const newConsultation: Consultation = {
        id: uuidv4(),
        patientId: data.patientId,
        patientName: data.patientName || 'Bệnh nhân',
        title: data.topic,
        question: data.question,
        category: data.topic,
        topic: data.topic,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    MOCK_CONSULTATIONS.unshift(newConsultation);
    return newConsultation;
};

// Hàm trả lời câu hỏi
export const answerConsultation = (
    consultationId: string,
    response: string,
    responderId: string
): Consultation | undefined => {
    const index = MOCK_CONSULTATIONS.findIndex(c => c.id === consultationId);
    if (index === -1) return undefined;

    const responder = MOCK_RESPONDERS.find(r => r.id === responderId);
    if (!responder) return undefined;

    const responderName = responder.role === 'doctor'
        ? `Bs. ${responder.firstName} ${responder.lastName}`
        : responder.role === 'staff'
            ? `NV. ${responder.firstName} ${responder.lastName}`
            : `CV. ${responder.firstName} ${responder.lastName}`;

    MOCK_CONSULTATIONS[index] = {
        ...MOCK_CONSULTATIONS[index],
        response,
        responderId,
        responderName,
        status: 'answered',
        answeredAt: new Date().toISOString()
    };

    return MOCK_CONSULTATIONS[index];
}; 