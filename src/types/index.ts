// User Types
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    gender?: string;
    dateOfBirth?: string;
    role: 'admin' | 'doctor' | 'patient';
    profileImage?: string;
}

// Authentication Types
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    firstName: string;
    lastName: string;
    gender?: string;
    dateOfBirth?: string;
    phone?: string;
}

// Service Types
export interface Service {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    image?: string;
}

// Appointment Types
export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    serviceId: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
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
    experience: number;
    gender: string;
    bio?: string;
    profileImage?: string;
    available: boolean;
}

// Consultation Types
export interface Consultation {
    id: string;
    patientId: string;
    topic: string;
    question: string;
    response?: string;
    status: 'pending' | 'answered';
    createdAt: string;
    respondedAt?: string;
    responderName?: string;
    patientName?: string;
}

export interface ConsultationFormData {
    topic: string;
    question: string;
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