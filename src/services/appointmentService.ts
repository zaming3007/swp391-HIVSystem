import axios from 'axios';
import { ApiResponse, Appointment, AppointmentCreateDto, AppointmentUpdateDto, Doctor, Service } from '../types';

const API_URL = 'http://localhost:5002/api';

// Mock data cho trường hợp API không hoạt động
const MOCK_SERVICES: Service[] = [
    {
        id: "1",
        name: "Tư vấn trước xét nghiệm HIV",
        description: "Tư vấn về quy trình xét nghiệm HIV, giải thích về các phương pháp xét nghiệm và lợi ích của việc biết tình trạng nhiễm HIV",
        duration: 30,
        price: 200000,
        category: "hiv-testing",
        imageUrl: "/counseling.svg"
    },
    {
        id: "2",
        name: "Xét nghiệm HIV nhanh",
        description: "Xét nghiệm HIV nhanh với kết quả trong vòng 20 phút, được thực hiện bởi nhân viên y tế có chuyên môn",
        duration: 30,
        price: 300000,
        category: "hiv-testing",
        imageUrl: "/service-1.svg"
    },
    {
        id: "3",
        name: "Tư vấn sau xét nghiệm HIV",
        description: "Tư vấn kết quả xét nghiệm HIV, hỗ trợ tâm lý và hướng dẫn các bước tiếp theo",
        duration: 45,
        price: 250000,
        category: "hiv-testing",
        imageUrl: "/mental.png"
    },
    {
        id: "4",
        name: "Điều trị ARV định kỳ",
        description: "Khám định kỳ, theo dõi điều trị thuốc kháng virus (ARV) và quản lý tác dụng phụ",
        duration: 45,
        price: 500000,
        category: "hiv-treatment",
        imageUrl: "/primaryhealthy.png"
    },
    {
        id: "5",
        name: "Tư vấn tuân thủ điều trị",
        description: "Tư vấn về tầm quan trọng của việc tuân thủ điều trị ARV và các chiến lược để duy trì tuân thủ điều trị",
        duration: 60,
        price: 350000,
        category: "hiv-treatment",
        imageUrl: "/counseling.svg"
    },
    {
        id: "6",
        name: "Hỗ trợ tâm lý cho người nhiễm HIV",
        description: "Tư vấn tâm lý chuyên sâu giúp đối phó với các vấn đề tâm lý, căng thẳng và kỳ thị liên quan đến HIV",
        duration: 60,
        price: 400000,
        category: "mental-health",
        imageUrl: "/mental.png"
    },
    {
        id: "7",
        name: "Tầm soát nhiễm trùng cơ hội",
        description: "Khám sàng lọc và xét nghiệm các bệnh nhiễm trùng cơ hội thường gặp ở người nhiễm HIV",
        duration: 60,
        price: 600000,
        category: "hiv-care",
        imageUrl: "/primaryhealthy.png"
    },
    {
        id: "8",
        name: "Tư vấn PrEP (Dự phòng trước phơi nhiễm)",
        description: "Tư vấn và đánh giá khả năng sử dụng thuốc PrEP để dự phòng HIV trước phơi nhiễm",
        duration: 45,
        price: 350000,
        category: "hiv-prevention",
        imageUrl: "/service-1.svg"
    }
];

const MOCK_DOCTORS: Doctor[] = [
    {
        id: "1",
        firstName: "Nguyễn",
        lastName: "Minh Anh",
        specialization: "Bác sĩ Nhiễm HIV/AIDS",
        imageUrl: "/dv1.jpg",
        biography: "Bác sĩ chuyên khoa Nhiễm với hơn 10 năm kinh nghiệm điều trị HIV/AIDS, chuyên về quản lý điều trị ARV và theo dõi nhiễm trùng cơ hội",
        education: "Tiến sĩ Y khoa, Đại học Y Hà Nội",
        experience: "10 năm"
    },
    {
        id: "2",
        firstName: "Trần",
        lastName: "Hoàng Nam",
        specialization: "Chuyên gia Tư vấn HIV",
        imageUrl: "/dv2.jpg",
        biography: "Chuyên gia tư vấn HIV với kinh nghiệm trong tư vấn xét nghiệm, tư vấn tuân thủ điều trị và hỗ trợ tinh thần cho người nhiễm HIV",
        education: "Thạc sĩ Y tế Công cộng, Đại học Y Dược TP.HCM",
        experience: "8 năm"
    },
    {
        id: "3",
        firstName: "Lê",
        lastName: "Thị Hương",
        specialization: "Tâm lý học Lâm sàng",
        imageUrl: "/dv3.jpg",
        biography: "Nhà tâm lý học lâm sàng chuyên về sức khỏe tâm thần và hỗ trợ tâm lý cho người nhiễm HIV và gia đình",
        education: "Thạc sĩ Tâm lý lâm sàng, Đại học Khoa học Xã hội và Nhân văn",
        experience: "7 năm"
    },
    {
        id: "4",
        firstName: "Phạm",
        lastName: "Văn Khoa",
        specialization: "Bác sĩ Truyền nhiễm",
        imageUrl: "/dv4.jpg",
        biography: "Bác sĩ chuyên khoa Truyền nhiễm với chuyên môn về HIV/AIDS và các bệnh nhiễm trùng cơ hội",
        education: "Bác sĩ Chuyên khoa II, Đại học Y Hà Nội",
        experience: "15 năm"
    },
    {
        id: "5",
        firstName: "Hoàng",
        lastName: "Thị Lan",
        specialization: "Dược sĩ Lâm sàng HIV",
        imageUrl: "/dv5.jpg",
        biography: "Dược sĩ lâm sàng chuyên về quản lý thuốc ARV, tương tác thuốc và tư vấn tuân thủ điều trị",
        education: "Thạc sĩ Dược lâm sàng, Đại học Y Dược TP.HCM",
        experience: "5 năm"
    }
];

// Tạo các time slots mẫu
const generateMockTimeSlots = (date: string): string[] => {
    return [
        "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "13:30", "14:00",
        "14:30", "15:00", "15:30", "16:00"
    ];
};

// Flag để quyết định có sử dụng mock data hay không
const USE_MOCK_DATA = true;

// Tạo axios instance với interceptor để thêm token vào header
const appointmentApi = axios.create({
    baseURL: API_URL,
});

appointmentApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Service API functions
export const getServices = async (): Promise<Service[]> => {
    if (USE_MOCK_DATA) {
        return MOCK_SERVICES;
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Service[]>>('/services');
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching services:", error);
        return MOCK_SERVICES; // Fallback to mock data on error
    }
};

export const getServiceById = async (id: string): Promise<Service | null> => {
    if (USE_MOCK_DATA) {
        return MOCK_SERVICES.find(service => service.id === id) || null;
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Service>>(`/services/${id}`);
        return response.data.data || null;
    } catch (error) {
        console.error("Error fetching service by ID:", error);
        return MOCK_SERVICES.find(service => service.id === id) || null;
    }
};

export const getServicesByCategory = async (category: string): Promise<Service[]> => {
    if (USE_MOCK_DATA) {
        return MOCK_SERVICES.filter(service => service.category === category);
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Service[]>>(`/services/category/${category}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching services by category:", error);
        return MOCK_SERVICES.filter(service => service.category === category);
    }
};

// Doctor API functions
export const getDoctors = async (): Promise<Doctor[]> => {
    if (USE_MOCK_DATA) {
        return MOCK_DOCTORS;
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Doctor[]>>('/doctors');
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return MOCK_DOCTORS;
    }
};

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
    if (USE_MOCK_DATA) {
        return MOCK_DOCTORS.find(doctor => doctor.id === id) || null;
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Doctor>>(`/doctors/${id}`);
        return response.data.data || null;
    } catch (error) {
        console.error("Error fetching doctor by ID:", error);
        return MOCK_DOCTORS.find(doctor => doctor.id === id) || null;
    }
};

export const getDoctorsBySpecialization = async (specialization: string): Promise<Doctor[]> => {
    if (USE_MOCK_DATA) {
        return MOCK_DOCTORS.filter(doctor => doctor.specialization === specialization);
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Doctor[]>>(`/doctors/specialization/${specialization}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching doctors by specialization:", error);
        return MOCK_DOCTORS.filter(doctor => doctor.specialization === specialization);
    }
};

export const getDoctorsByServiceId = async (serviceId: string): Promise<Doctor[]> => {
    if (USE_MOCK_DATA) {
        // Mock logic để map service đến doctors
        const serviceToDoctorMap: { [key: string]: string[] } = {
            "1": ["1", "3", "4"], // Khám tổng quát
            "2": ["1", "3"],      // Tư vấn sức khỏe tâm thần
            "3": ["2"],           // Liệu pháp hormone
            "4": ["4"],           // Tư vấn HIV/AIDS
            "5": ["5"],           // Luyện giọng
            "6": ["2", "4"]       // Sức khỏe tình dục
        };

        const doctorIds = serviceToDoctorMap[serviceId] || [];
        return MOCK_DOCTORS.filter(doctor => doctorIds.includes(doctor.id));
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Doctor[]>>(`/doctors/service/${serviceId}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching doctors by service ID:", error);
        return [];
    }
};

export const getDoctorSchedule = async (doctorId: string): Promise<any[]> => {
    // Mock schedule always returns same data
    if (USE_MOCK_DATA) {
        return [
            { day: "Monday", startTime: "09:00", endTime: "17:00" },
            { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
            { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
            { day: "Thursday", startTime: "09:00", endTime: "17:00" },
            { day: "Friday", startTime: "09:00", endTime: "17:00" }
        ];
    }
    try {
        const response = await appointmentApi.get<ApiResponse<any[]>>(`/doctors/${doctorId}/schedule`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        return [];
    }
};

// Appointment API functions
export const getMyAppointments = async (): Promise<Appointment[]> => {
    if (USE_MOCK_DATA) {
        // Lấy appointments từ localStorage
        const savedAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
        return savedAppointments;
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Appointment[]>>('/appointments/patient');
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
    if (USE_MOCK_DATA) {
        return null; // No mock appointments yet
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Appointment>>(`/appointments/${id}`);
        return response.data.data || null;
    } catch (error) {
        console.error("Error fetching appointment by ID:", error);
        return null;
    }
};

export const createAppointment = async (appointment: AppointmentCreateDto): Promise<Appointment | null> => {
    if (USE_MOCK_DATA) {
        // Create a mock appointment
        const mockAppointment: Appointment = {
            id: Math.random().toString(36).substring(7),
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            serviceId: appointment.serviceId,
            date: appointment.date,
            startTime: appointment.startTime,
            endTime: new Date(new Date(`${appointment.date}T${appointment.startTime}`).getTime() + 3600000).toTimeString().slice(0, 5),
            status: 'pending',
            appointmentType: appointment.appointmentType,
            // Tạo link meeting nếu là hẹn online
            meetingLink: appointment.appointmentType === 'online' ?
                `https://meet.google.com/${Math.random().toString(36).substring(2, 10)}` : undefined,
            notes: appointment.notes,
            // Get names from mock data
            serviceName: MOCK_SERVICES.find(s => s.id === appointment.serviceId)?.name,
            doctorName: MOCK_DOCTORS.find(d => d.id === appointment.doctorId)?.firstName + ' ' +
                MOCK_DOCTORS.find(d => d.id === appointment.doctorId)?.lastName
        };

        // Save to localStorage to persist between refreshes
        const savedAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
        savedAppointments.push(mockAppointment);
        localStorage.setItem('mockAppointments', JSON.stringify(savedAppointments));

        return mockAppointment;
    }
    try {
        const response = await appointmentApi.post<ApiResponse<Appointment>>('/appointments', appointment);
        return response.data.data || null;
    } catch (error) {
        console.error("Error creating appointment:", error);
        return null;
    }
};

export const updateAppointment = async (id: string, appointment: AppointmentUpdateDto): Promise<Appointment | null> => {
    if (USE_MOCK_DATA) {
        // Update mock appointment in localStorage
        const savedAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
        const index = savedAppointments.findIndex((a: Appointment) => a.id === id);

        if (index !== -1) {
            savedAppointments[index] = { ...savedAppointments[index], ...appointment };
            localStorage.setItem('mockAppointments', JSON.stringify(savedAppointments));
            return savedAppointments[index];
        }
        return null;
    }
    try {
        const response = await appointmentApi.put<ApiResponse<Appointment>>(`/appointments/${id}`, appointment);
        return response.data.data || null;
    } catch (error) {
        console.error("Error updating appointment:", error);
        return null;
    }
};

export const cancelAppointment = async (id: string): Promise<boolean> => {
    if (USE_MOCK_DATA) {
        // Cancel mock appointment in localStorage
        const savedAppointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
        const index = savedAppointments.findIndex((a: Appointment) => a.id === id);

        if (index !== -1) {
            savedAppointments[index].status = 'cancelled';
            localStorage.setItem('mockAppointments', JSON.stringify(savedAppointments));
            return true;
        }
        return false;
    }
    try {
        const response = await appointmentApi.delete<ApiResponse<boolean>>(`/appointments/${id}`);
        return response.data.data || false;
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        return false;
    }
};

export const getAvailableSlots = async (doctorId: string, date: string, serviceId: string): Promise<string[]> => {
    if (USE_MOCK_DATA) {
        // Return mock time slots
        return generateMockTimeSlots(date);
    }
    try {
        const response = await appointmentApi.get<ApiResponse<string[]>>(
            `/appointments/available-slots?doctorId=${doctorId}&date=${date}&serviceId=${serviceId}`
        );
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching available slots:", error);
        return [];
    }
}; 