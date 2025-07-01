import { Consultation } from '../types';
import authApi from './authApi';

// API functions for consultations
export const getConsultations = async (userId: string) => {
    try {
        const response = await authApi.get(`/consultations/patient/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching consultations:', error);
        return [];
    }
};

export const getConsultation = async (consultationId: string) => {
    try {
        const response = await authApi.get(`/consultations/${consultationId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching consultation:', error);
        return null;
    }
};

export const createConsultation = async (consultationData: any) => {
    try {
        const response = await authApi.post('/consultations', consultationData);
        return response.data;
    } catch (error) {
        console.error('Error submitting question:', error);
        throw error;
    }
};

// Admin/Doctor: Get pending consultations
export const getPendingConsultations = async () => {
    const response = await authApi.get<Consultation[]>('/consultations/pending');
    return response.data;
};

// Admin/Doctor: Answer a consultation
export const answerConsultation = async (consultationId: string, answer: string, responderId: string) => {
    const response = await authApi.put<Consultation>(`/consultations/${consultationId}/answer`, {
        response: answer,
        responderId
    });
    return response.data;
};

// Get frequently asked questions
export const getFAQs = async () => {
    const response = await authApi.get<{ question: string; answer: string }[]>('/consultations/faqs');
    return response.data;
};

// Export compatibility object for backward compatibility
export const consultationService = {
    getConsultations,
    getConsultation,
    createConsultation,
    getPendingConsultations,
    answerConsultation,
    getFAQs
}; 