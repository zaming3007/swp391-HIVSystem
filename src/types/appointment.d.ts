export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface Doctor {
    id: string;
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

export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
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
}

export enum AppointmentStatus {
    Pending = 0,
    Confirmed = 1,
    Cancelled = 2,
    Completed = 3
}

export interface AppointmentCreateDto {
    doctorId: string;
    serviceId: string;
    date: string;
    startTime: string;
    notes: string;
}

export interface AppointmentUpdateDto {
    date?: string;
    startTime?: string;
    status?: AppointmentStatus;
    notes?: string;
}

export interface AvailableSlot {
    doctorId: string;
    doctorName: string;
    date: string;
    availableTimes: string[];
} 