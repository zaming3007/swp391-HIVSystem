import api from './api';
import { Consultation, ConsultationFormData } from '../types';

export const consultationService = {
    // Get all consultations for a patient
    getConsultations: async (userId: string) => {
        const response = await api.get<Consultation[]>(`/consultations/patient/${userId}`);
        return response.data;
    },

    // Get a specific consultation by ID
    getConsultation: async (consultationId: string) => {
        const response = await api.get<Consultation>(`/consultations/${consultationId}`);
        return response.data;
    },

    // Create a new consultation question
    createConsultation: async (consultationData: ConsultationFormData & { patientId: string }) => {
        const response = await api.post<Consultation>('/consultations', consultationData);
        return response.data;
    },

    // Admin/Doctor: Get pending consultations
    getPendingConsultations: async () => {
        const response = await api.get<Consultation[]>('/consultations/pending');
        return response.data;
    },

    // Admin/Doctor: Answer a consultation
    answerConsultation: async (consultationId: string, answer: string, responderId: string) => {
        const response = await api.put<Consultation>(`/consultations/${consultationId}/answer`, {
            response: answer,
            responderId
        });
        return response.data;
    },

    // Get frequently asked questions
    getFAQs: async () => {
        const response = await api.get<{ question: string; answer: string }[]>('/consultations/faqs');
        return response.data;
    }
}; 