export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface Doctor {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
    email: string;
    phone: string;
    profileImage: string;
    available: boolean;
    bio: string;
    experience: number;
    workingHours: TimeSlot[];
    fullName: string;
}

export interface TimeSlot {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category: string;
    imageUrl: string;
    doctorIds: string[];
}

export type AppointmentType = 'online' | 'offline';

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: number;
    doctorName: string;
    serviceId: string;
    serviceName: string;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    notes: string;
    createdAt: string;
    updatedAt?: string;
    appointmentType?: AppointmentType;
    meetingLink?: string;
}

export enum AppointmentStatus {
    Pending = 0,
    Confirmed = 1,
    Cancelled = 2,
    Completed = 3
}

export interface AppointmentCreateDto {
    patientId: string;
    doctorId: string;
    serviceId: string;
    date: string;
    startTime: string;
    notes: string;
    appointmentType?: AppointmentType;
}

export interface AppointmentUpdateDto {
    date?: string;
    startTime?: string;
    status?: AppointmentStatus;
    notes?: string;
}

export interface AvailableSlot {
    doctorId: number;
    doctorName: string;
    date: string;
    availableTimes: string[];
} 