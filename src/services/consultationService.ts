import { Consultation } from '../types';
import authApi from './authApi';
import {
    getConsultationsByUserId,
    getConsultationById as getMockConsultationById,
    getPendingConsultations as getMockPendingConsultations,
    createConsultation as createMockConsultation,
    answerConsultation as answerMockConsultation,
    CONSULTATION_TOPICS
} from './mockData/consultationMockData';

// Cờ để quyết định sử dụng mockData hay API thật
const USE_MOCK_DATA = false; // Chuyển thành false để sử dụng API thực

// API functions for consultations
export const getConsultations = async (userId: string): Promise<Consultation[]> => {
    if (USE_MOCK_DATA) {
        // Giả lập delay mạng
        await new Promise(resolve => setTimeout(resolve, 500));
        return getConsultationsByUserId(userId);
    }

    try {
        const response = await authApi.get(`/consultations/patient/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching consultations:', error);
        return [];
    }
};

export const getConsultation = async (consultationId: string): Promise<Consultation | null> => {
    if (USE_MOCK_DATA) {
        // Giả lập delay mạng
        await new Promise(resolve => setTimeout(resolve, 300));
        return getMockConsultationById(consultationId) || null;
    }

    try {
        const response = await authApi.get(`/consultations/${consultationId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching consultation:', error);
        return null;
    }
};

export const createConsultation = async (consultationData: {
    patientId: string;
    patientName?: string;
    topic: string;
    question: string;
}): Promise<Consultation> => {
    if (USE_MOCK_DATA) {
        // Giả lập delay mạng
        await new Promise(resolve => setTimeout(resolve, 800));
        return createMockConsultation(consultationData);
    }

    try {
        // Đảm bảo gửi dữ liệu theo định dạng backend yêu cầu
        const payload = {
            patientId: consultationData.patientId,
            title: consultationData.topic,
            question: consultationData.question,
            category: consultationData.topic
        };

        console.log('Creating consultation with payload:', payload);
        const response = await authApi.post('/consultations', payload);
        console.log('Consultation created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error submitting question:', error);
        throw error;
    }
};

// Admin/Doctor: Get pending consultations
export const getPendingConsultations = async (): Promise<Consultation[]> => {
    if (USE_MOCK_DATA) {
        // Giả lập delay mạng
        await new Promise(resolve => setTimeout(resolve, 500));
        return getMockPendingConsultations();
    }

    try {
        const response = await authApi.get<Consultation[]>('/consultations/pending');
        return response.data;
    } catch (error) {
        console.error('Error fetching pending consultations:', error);
        return [];
    }
};

// Admin/Doctor: Get answered consultations
export const getAnsweredConsultations = async (): Promise<Consultation[]> => {
    if (USE_MOCK_DATA) {
        // Giả lập delay mạng
        await new Promise(resolve => setTimeout(resolve, 500));
        // Lọc các câu hỏi đã trả lời từ mock data
        return getConsultationsByUserId('all').filter(c => c.status === 'answered');
    }

    try {
        const response = await authApi.get<Consultation[]>('/consultations/answered');
        return response.data;
    } catch (error) {
        console.error('Error fetching answered consultations:', error);
        return [];
    }
};

// Admin/Doctor: Answer a consultation
export const answerConsultation = async (
    consultationId: string,
    answer: string,
    responderId: string
): Promise<Consultation | null> => {
    if (USE_MOCK_DATA) {
        // Giả lập delay mạng
        await new Promise(resolve => setTimeout(resolve, 700));
        return answerMockConsultation(consultationId, answer, responderId) || null;
    }

    try {
        console.log(`Answering consultation ${consultationId} by user ${responderId}`);
        const response = await authApi.post<Consultation>(`/consultations/${consultationId}/answer`, {
            content: answer,
            responderId
        });
        console.log('Answer submitted successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error answering consultation:', error);
        return null;
    }
};

// Get consultation topics
export const getConsultationTopics = async (): Promise<string[]> => {
    if (USE_MOCK_DATA) {
        return CONSULTATION_TOPICS;
    }

    try {
        const response = await authApi.get<{ id: string, name: string }[]>('/consultations/topics');
        // Chỉ trả về tên các chủ đề
        return response.data.map(topic => topic.name);
    } catch (error) {
        console.error('Error fetching consultation topics:', error);
        // Trả về một số chủ đề mặc định trong trường hợp API gặp lỗi
        return ['ARV', 'CD4', 'Tải lượng virus', 'Tác dụng phụ', 'Dinh dưỡng', 'Khác'];
    }
};

// Get frequently asked questions
export const getFAQs = async () => {
    if (USE_MOCK_DATA) {
        // Trả về một số FAQ mẫu
        return [
            {
                question: 'Thuốc ARV có tác dụng phụ gì?',
                answer: 'Thuốc ARV có thể gây một số tác dụng phụ như buồn nôn, mệt mỏi, đau đầu trong giai đoạn đầu điều trị. Các triệu chứng này thường giảm dần sau 4-6 tuần.'
            },
            {
                question: 'Làm thế nào để tăng chỉ số CD4?',
                answer: 'Để tăng chỉ số CD4, bạn cần tuân thủ điều trị ARV, có chế độ dinh dưỡng cân bằng, tập thể dục đều đặn, giảm stress và tránh rượu bia, thuốc lá.'
            },
            {
                question: 'Tôi có thể quan hệ tình dục an toàn không?',
                answer: 'Khi tải lượng virus ở mức không phát hiện được và duy trì ổn định trong ít nhất 6 tháng, nguy cơ lây truyền HIV qua đường tình dục giảm xuống gần như bằng 0. Tuy nhiên, vẫn nên sử dụng bao cao su để phòng ngừa các bệnh lây truyền qua đường tình dục khác.'
            }
        ];
    }

    try {
        const response = await authApi.get<{ question: string; answer: string }[]>('/consultations/faqs');
        return response.data;
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }
};

// Export compatibility object for backward compatibility
export const consultationService = {
    getConsultations,
    getConsultation,
    createConsultation,
    getPendingConsultations,
    getAnsweredConsultations,
    answerConsultation,
    getConsultationTopics,
    getFAQs
}; 