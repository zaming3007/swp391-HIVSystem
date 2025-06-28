// User Types
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    role: 'admin' | 'doctor' | 'customer' | 'staff';
    profileImage?: string;
}

// Authentication Types
export interface AuthState {
    isAuthenticated: boolean;
    user: UserInfo | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

// Service Types
export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category?: string;
    imageUrl?: string;
}

// Appointment Types
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type AppointmentType = 'online' | 'offline';

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    appointmentType: AppointmentType;
    meetingLink?: string;
    patientName?: string;
    doctorName?: string;
    serviceName?: string;
    notes?: string;
}

export interface AppointmentFormData {
    serviceId: string;
    doctorId: string;
    date: string;
    startTime: string;
    notes?: string;
}

// Doctor Types
export interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    imageUrl?: string;
    biography?: string;
    education?: string;
    experience?: string;
}

// Consultation Types
export interface Consultation {
    id: string;
    patientId: string;
    patientName?: string;
    title: string;
    question: string;
    category: string;
    response?: string;
    responderId?: string;
    responderName?: string;
    status: 'pending' | 'answered';
    createdAt: string;
    answeredAt?: string;
}

export interface ConsultationFormData {
    title: string;
    question: string;
    category: string;
}

// Admin Dashboard Types
export interface DashboardStats {
    totalUsers: number;
    totalAppointments: number;
    totalConsultations: number;
    recentAppointments: Appointment[];
    pendingConsultations: number;
}

// Medical Record Types
export interface MedicalRecord {
    id: string;
    patientId: string;
    doctorId: string;
    date: string;
    diagnosis: string;
    treatment: string;
    notes: string;
    followUp?: string;
}

// Re-export các types từ app
export * from './appointment.d';

// Các loại khác sẽ được export thêm sau này
export interface UserInfo {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}

// Redux store state
export interface AppState {
    auth: AuthState;
}

export interface AppointmentCreateDto {
    patientId: string;
    doctorId: string;
    serviceId: string;
    date: string;
    startTime: string;
    appointmentType: AppointmentType;
    notes?: string;
}

export interface AppointmentUpdateDto {
    status?: AppointmentStatus;
    date?: string;
    startTime?: string;
    notes?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
} 