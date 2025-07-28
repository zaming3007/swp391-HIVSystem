import axios from 'axios';
import { authApi } from './arvApi';

// Create AppointmentApi instance for doctor-related endpoints
const appointmentApi = axios.create({
    baseURL: 'http://localhost:5002/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
appointmentApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Types
export interface DoctorStats {
    todayAppointments: number;
    pendingConsultations: number;
    totalPatients: number;
    completedAppointments: number;
    averageRating: number;
    responseTime: string;
}

export interface TodayAppointment {
    id: string;
    patientId: string;
    patientName: string;
    time: string;
    startTime: string;
    endTime: string;
    service: string;
    status: string;
    notes?: string;
    date: string;
}

export interface DoctorPatient {
    patientId: string;
    patientName: string;
    lastAppointment: string;
    totalAppointments: number;
    phone?: string;
    email?: string;
    status: string;
}

export interface WorkingHours {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export interface DoctorScheduleDto {
    id: string;
    doctorId: string;
    dayOfWeek: number;
    dayName: string;
    isWorking: boolean;
    timeSlots: TimeSlotDto[];
}

export interface TimeSlotDto {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export interface ConsultationForDoctor {
    id: string;
    patientId: string;
    patientName: string;
    title: string;
    question: string;
    category: string;
    status: string;
    createdAt: string;
    response?: string;
    answeredAt?: string;
}

export interface DoctorSimple {
    id: string;
    name: string;
    specialization: string;
    email: string;
}

const doctorService = {
    // Get doctor dashboard statistics
    getDoctorStats: async (): Promise<DoctorStats> => {
        try {
            // Get today's appointments
            const todayResponse = await appointmentApi.get('/DoctorAppointment/today');
            const todayAppointments = todayResponse.data.success ? todayResponse.data.data.length : 0;

            // Get all appointments for completed count
            const allAppointmentsResponse = await appointmentApi.get('/DoctorAppointment/my-appointments');
            const allAppointments = allAppointmentsResponse.data.success ? allAppointmentsResponse.data.data : [];
            const completedAppointments = allAppointments.filter((apt: any) => apt.status === 'completed').length;

            // Get pending consultations
            let pendingConsultations = 0;
            try {
                const consultationsResponse = await authApi.get('/consultations/doctor');
                const consultations = Array.isArray(consultationsResponse.data) ? consultationsResponse.data : [];
                pendingConsultations = consultations.filter((c: any) => c.status === 'pending').length;
            } catch (error) {
                try {
                    const consultationsResponse = await authApi.get('/consultations');
                    const consultations = Array.isArray(consultationsResponse.data) ? consultationsResponse.data : [];
                    pendingConsultations = consultations.filter((c: any) => c.status === 'pending').length;
                } catch (error2) {
                    console.log('Consultations API not available, setting pending consultations to 0');
                    pendingConsultations = 0;
                }
            }

            // Get unique patients count
            const uniquePatients = new Set(allAppointments.map((apt: any) => apt.patientId)).size;

            return {
                todayAppointments,
                pendingConsultations,
                totalPatients: uniquePatients,
                completedAppointments,
                averageRating: 4.7, // TODO: Implement rating system
                responseTime: '2.3 giờ' // TODO: Calculate from consultation response times
            };
        } catch (error) {
            console.error('Error fetching doctor stats:', error);
            return {
                todayAppointments: 0,
                pendingConsultations: 0,
                totalPatients: 0,
                completedAppointments: 0,
                averageRating: 0,
                responseTime: 'N/A'
            };
        }
    },

    // Get today's appointments
    getTodayAppointments: async (): Promise<TodayAppointment[]> => {
        try {
            const response = await appointmentApi.get('/DoctorAppointment/today');
            if (response.data.success) {
                return response.data.data.map((apt: any) => ({
                    id: apt.id,
                    patientId: apt.patientId,
                    patientName: apt.patientName,
                    time: apt.startTime,
                    startTime: apt.startTime,
                    endTime: apt.endTime,
                    service: apt.serviceName || 'Khám tổng quát',
                    status: apt.status,
                    notes: apt.notes,
                    date: apt.date
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching today appointments:', error);
            return [];
        }
    },

    // Get all appointments
    getAllAppointments: async (page: number = 1, pageSize: number = 20, status?: string): Promise<TodayAppointment[]> => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString()
            });
            if (status) {
                params.append('status', status);
            }

            const response = await appointmentApi.get(`/DoctorAppointment/my-appointments?${params.toString()}`);
            if (response.data.success) {
                return response.data.data.map((apt: any) => ({
                    id: apt.id,
                    patientId: apt.patientId,
                    patientName: apt.patientName,
                    time: apt.startTime,
                    startTime: apt.startTime,
                    endTime: apt.endTime,
                    service: apt.serviceName || 'Khám tổng quát',
                    status: apt.status,
                    notes: apt.notes,
                    date: apt.date
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    },

    // Get doctor's patients
    getDoctorPatients: async (): Promise<DoctorPatient[]> => {
        try {
            const response = await appointmentApi.get('/DoctorAppointment/my-appointments');
            if (response.data.success) {
                const appointments = response.data.data;

                // Group appointments by patient
                const patientMap = new Map<string, any>();
                appointments.forEach((apt: any) => {
                    if (!patientMap.has(apt.patientId)) {
                        patientMap.set(apt.patientId, {
                            patientId: apt.patientId,
                            patientName: apt.patientName,
                            appointments: [],
                            phone: apt.patientPhone,
                            email: apt.patientEmail
                        });
                    }
                    patientMap.get(apt.patientId).appointments.push(apt);
                });

                // Convert to DoctorPatient array
                return Array.from(patientMap.values()).map(patient => ({
                    patientId: patient.patientId,
                    patientName: patient.patientName,
                    lastAppointment: patient.appointments
                        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date || '',
                    totalAppointments: patient.appointments.length,
                    phone: patient.phone,
                    email: patient.email,
                    status: 'active'
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching doctor patients:', error);
            return [];
        }
    },

    // Get doctor's working hours
    getWorkingHours: async (doctorId: string): Promise<WorkingHours[]> => {
        try {
            const response = await appointmentApi.get(`/Doctors/${doctorId}/schedule`);
            if (response.data.success) {
                return response.data.data.map((slot: any) => ({
                    id: slot.id || `${slot.dayOfWeek}-${slot.startTime}`,
                    dayOfWeek: slot.dayOfWeek,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isAvailable: slot.isAvailable !== false
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching working hours:', error);
            return [];
        }
    },

    // Get doctor's schedule for schedule management page
    getDoctorSchedule: async (doctorId: string): Promise<DoctorScheduleDto[]> => {
        try {
            const response = await appointmentApi.get(`/DoctorSchedule/${doctorId}`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching doctor schedule:', error);
            return [];
        }
    },

    // Get consultations for doctor
    getConsultationsForDoctor: async (): Promise<ConsultationForDoctor[]> => {
        try {
            // Try different endpoints for consultations
            let response;
            try {
                response = await authApi.get('/consultations/doctor');
            } catch (error) {
                // If /consultations/doctor doesn't exist, try /consultations
                try {
                    response = await authApi.get('/consultations');
                } catch (error2) {
                    console.log('Consultations API not available, returning empty array');
                    return [];
                }
            }

            if (response && Array.isArray(response.data)) {
                return response.data.map((consultation: any) => ({
                    id: consultation.id,
                    patientId: consultation.patientId,
                    patientName: consultation.patientName || 'Bệnh nhân',
                    title: consultation.title,
                    question: consultation.question,
                    category: consultation.category,
                    status: consultation.status,
                    createdAt: consultation.createdAt,
                    response: consultation.response,
                    answeredAt: consultation.answeredAt
                }));
            } else if (response && response.data.success && Array.isArray(response.data.data)) {
                return response.data.data.map((consultation: any) => ({
                    id: consultation.id,
                    patientId: consultation.patientId,
                    patientName: consultation.patientName || 'Bệnh nhân',
                    title: consultation.title,
                    question: consultation.question,
                    category: consultation.category,
                    status: consultation.status,
                    createdAt: consultation.createdAt,
                    response: consultation.response,
                    answeredAt: consultation.answeredAt
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching consultations for doctor:', error);
            return [];
        }
    },

    // Update appointment status
    updateAppointmentStatus: async (appointmentId: string, status: string, notes?: string): Promise<boolean> => {
        try {
            const response = await appointmentApi.put(`/DoctorAppointment/${appointmentId}/status`, {
                status,
                notes
            });
            return response.data.success;
        } catch (error) {
            console.error('Error updating appointment status:', error);
            return false;
        }
    },

    // Answer consultation
    answerConsultation: async (consultationId: string, answer: string): Promise<boolean> => {
        try {
            const response = await authApi.post(`/consultations/${consultationId}/answer`, {
                content: answer
            });
            return response.status === 200;
        } catch (error) {
            console.error('Error answering consultation:', error);
            return false;
        }
    },

    // Get simple list of doctors for dropdowns
    getSimpleDoctors: async (): Promise<DoctorSimple[]> => {
        try {
            // First try AuthApi doctors endpoint
            const response = await authApi.get('/doctors/dropdown');

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                return response.data;
            }

            // If no doctors found, return mock data for now
            return [
                {
                    id: 'doctor-001',
                    name: 'BS. Nguyễn Văn A',
                    specialization: 'Bác sĩ HIV',
                    email: 'doctor@gmail.com'
                },
                {
                    id: 'doctor-002',
                    name: 'BS. Trần Thị B',
                    specialization: 'Bác sĩ HIV',
                    email: 'doctor2@gmail.com'
                },
                {
                    id: 'doctor-003',
                    name: 'BS. Lê Văn C',
                    specialization: 'Bác sĩ HIV',
                    email: 'doctor3@gmail.com'
                }
            ];
        } catch (error) {
            console.error('Error fetching doctors:', error);

            // Return mock data as fallback
            return [
                {
                    id: 'doctor-001',
                    name: 'BS. Nguyễn Văn A',
                    specialization: 'Bác sĩ HIV',
                    email: 'doctor@gmail.com'
                },
                {
                    id: 'doctor-002',
                    name: 'BS. Trần Thị B',
                    specialization: 'Bác sĩ HIV',
                    email: 'doctor2@gmail.com'
                },
                {
                    id: 'doctor-003',
                    name: 'BS. Lê Văn C',
                    specialization: 'Bác sĩ HIV',
                    email: 'doctor3@gmail.com'
                }
            ];
        }
    }
};

export default doctorService;
