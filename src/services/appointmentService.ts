import axios from 'axios';
import { ApiResponse, Appointment, AppointmentCreateDto, AppointmentUpdateDto, Doctor, Service, AvailableSlot, AppointmentStatus, AppointmentType } from '../types';

// Base API URL
const API_URL = 'https://appointmentapi-production.up.railway.app/api';

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

// Service API functions
export const getServices = async (): Promise<Service[]> => {
    if (USE_MOCK_DATA) {
        console.log("Using mock services data");
        return MOCK_SERVICES;
    }
    try {
        console.log("Fetching services from API:", API_URL + '/services');
        const response = await appointmentApi.get<ApiResponse<Service[]>>('/services');
        console.log("API response:", response.data);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching services:", error);
        console.log("Falling back to mock data");
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
            "3": ["2", "5"],      // Khám da liễu
            "4": ["1", "4"],      // Điều trị ARV
            "5": ["2", "3"],      // Tư vấn tuân thủ điều trị
            "6": ["3"],           // Hỗ trợ tâm lý
            "7": ["4", "1"],      // Tầm soát nhiễm trùng
            "8": ["2", "5"]       // Tư vấn PrEP
        };

        const doctorIds = serviceToDoctorMap[serviceId] || [];
        return MOCK_DOCTORS.filter(doctor => doctorIds.includes(doctor.id));
    }
    try {
        const response = await appointmentApi.get<ApiResponse<Doctor[]>>(`/doctors/service/${serviceId}`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching doctors by service ID:", error);
        // Fallback to mock data
        const serviceToDoctorMap: { [key: string]: string[] } = {
            "1": ["1", "3", "4"],
            "2": ["1", "3"],
            "3": ["2", "5"],
            "4": ["1", "4"],
            "5": ["2", "3"],
            "6": ["3"],
            "7": ["4", "1"],
            "8": ["2", "5"]
        };

        const doctorIds = serviceToDoctorMap[serviceId] || [];
        return MOCK_DOCTORS.filter(doctor => doctorIds.includes(doctor.id));
    }
};

export const getDoctorSchedule = async (doctorId: string): Promise<any[]> => {
    if (USE_MOCK_DATA) {
        // Return mock schedule data
        return [
            { dayOfWeek: 1, startTime: "08:00", endTime: "17:00" },
            { dayOfWeek: 2, startTime: "08:00", endTime: "17:00" },
            { dayOfWeek: 4, startTime: "08:00", endTime: "17:00" },
            { dayOfWeek: 5, startTime: "08:00", endTime: "12:00" }
        ];
    }
    try {
        const response = await appointmentApi.get<ApiResponse<any[]>>(`/doctors/${doctorId}/schedule`);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        return [
            { dayOfWeek: 1, startTime: "08:00", endTime: "17:00" },
            { dayOfWeek: 2, startTime: "08:00", endTime: "17:00" },
            { dayOfWeek: 4, startTime: "08:00", endTime: "17:00" },
            { dayOfWeek: 5, startTime: "08:00", endTime: "12:00" }
        ];
    }
};

// Appointment API functions
export const getMyAppointments = async (): Promise<Appointment[]> => {
    const userId = localStorage.getItem('userId');
    console.log("Getting appointments for user ID:", userId);

    if (!userId) {
        console.warn("No user ID found in localStorage");
        return [];
    }

    if (USE_MOCK_DATA) {
        console.log("Using mock appointments data");

        // Kiểm tra xem có lịch hẹn đã lưu trong localStorage không
        let savedAppointments: any[] = [];
        try {
            const savedData = localStorage.getItem('mockAppointments');
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    if (Array.isArray(parsed)) {
                        savedAppointments = parsed;
                        console.log("Found saved appointments in localStorage:", savedAppointments.length);
                    } else {
                        console.warn("mockAppointments is not an array");
                    }
                } catch (parseError) {
                    console.error("Error parsing mockAppointments:", parseError);
                }
            }
        } catch (error) {
            console.error("Error reading saved appointments:", error);
        }

        // Dữ liệu mẫu cố định
        const mockAppointments = [
            {
                id: "1",
                patientId: userId,
                patientName: "Nguyễn Văn A",
                doctorId: "1",
                doctorName: "Nguyễn Minh Anh",
                serviceId: "1",
                serviceName: "Tư vấn trước xét nghiệm HIV",
                date: new Date().toISOString().split('T')[0],
                startTime: "09:00",
                endTime: "09:30",
                status: "confirmed",
                notes: "Lần đầu khám",
                createdAt: new Date().toISOString(),
                appointmentType: "offline" as AppointmentType
            },
            {
                id: "2",
                patientId: userId,
                patientName: "Nguyễn Văn A",
                doctorId: "2",
                doctorName: "Trần Hoàng Nam",
                serviceId: "2",
                serviceName: "Xét nghiệm HIV nhanh",
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
                startTime: "10:00",
                endTime: "10:30",
                status: "pending",
                notes: "Xét nghiệm định kỳ",
                createdAt: new Date().toISOString(),
                appointmentType: "offline" as AppointmentType
            },
            {
                id: "3",
                patientId: userId,
                patientName: "Nguyễn Văn A",
                doctorId: "3",
                doctorName: "Lê Thị Hương",
                serviceId: "6",
                serviceName: "Hỗ trợ tâm lý cho người nhiễm HIV",
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
                startTime: "14:00",
                endTime: "15:00",
                status: "completed",
                notes: "Tư vấn tâm lý định kỳ",
                createdAt: new Date().toISOString(),
                appointmentType: "online" as AppointmentType,
                meetingLink: "https://meet.google.com/abc-defg-hij"
            },
            // Thêm lịch hẹn mới vừa đặt
            {
                id: "4",
                patientId: userId,
                patientName: "Nguyễn Văn A",
                doctorId: "4",
                doctorName: "Phạm Văn Khoa",
                serviceId: "4",
                serviceName: "Điều trị ARV định kỳ",
                date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Ngày kia
                startTime: "11:00",
                endTime: "11:45",
                status: "pending",
                notes: "Khám theo dõi điều trị",
                createdAt: new Date().toISOString(),
                appointmentType: "offline" as AppointmentType
            },
            {
                id: "5",
                patientId: userId,
                patientName: "Nguyễn Văn A",
                doctorId: "5",
                doctorName: "Hoàng Thị Lan",
                serviceId: "5",
                serviceName: "Tư vấn tuân thủ điều trị",
                date: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 ngày sau
                startTime: "15:30",
                endTime: "16:30",
                status: "pending",
                notes: "Tư vấn về tác dụng phụ thuốc",
                createdAt: new Date().toISOString(),
                appointmentType: "online" as AppointmentType,
                meetingLink: "https://meet.google.com/xyz-abcd-efg"
            },
            {
                id: "6",
                patientId: userId,
                patientName: "Nguyễn Văn A",
                doctorId: "1",
                doctorName: "Nguyễn Minh Anh",
                serviceId: "7",
                serviceName: "Tầm soát nhiễm trùng cơ hội",
                date: new Date(Date.now() - 604800000).toISOString().split('T')[0], // 1 tuần trước
                startTime: "13:00",
                endTime: "14:00",
                status: "completed",
                notes: "Khám định kỳ",
                createdAt: new Date().toISOString(),
                appointmentType: "offline" as AppointmentType
            },
            {
                id: "7",
                patientId: userId,
                patientName: "Nguyễn Văn A",
                doctorId: "2",
                doctorName: "Trần Hoàng Nam",
                serviceId: "8",
                serviceName: "Tư vấn PrEP (Dự phòng trước phơi nhiễm)",
                date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 ngày trước
                startTime: "09:30",
                endTime: "10:15",
                status: "cancelled",
                notes: "Hủy do lịch cá nhân",
                createdAt: new Date().toISOString(),
                appointmentType: "offline" as AppointmentType
            }
        ];

        // Kết hợp dữ liệu mẫu cố định với dữ liệu từ localStorage
        const combinedAppointments = [
            ...mockAppointments,
            ...savedAppointments.filter(app =>
                // Chỉ thêm các lịch hẹn chưa có trong dữ liệu mẫu
                !mockAppointments.some(mockApp => mockApp.id === app.id)
            )
        ];

        console.log("Combined appointments:", combinedAppointments.length);

        // Lưu lại danh sách kết hợp vào localStorage để đảm bảo tính nhất quán
        try {
            localStorage.setItem('mockAppointments', JSON.stringify(combinedAppointments));
        } catch (error) {
            console.error("Failed to update mockAppointments in localStorage:", error);
        }

        return combinedAppointments;
    }

    try {
        console.log(`Making API request to /appointments/patient/${userId}`);
        const response = await appointmentApi.get<ApiResponse<Appointment[]>>(`/appointments/patient/${userId}`);
        console.log("API response for appointments:", response.data);
        return response.data.data || [];
    } catch (error) {
        console.error("Error fetching my appointments:", error);
        // Return empty array on error
        return [];
    }
};

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
    if (USE_MOCK_DATA) {
        // Return a mock appointment
        const userId = localStorage.getItem('userId') || "";
        return {
            id: id,
            patientId: userId,
            patientName: "Nguyễn Văn A",
            doctorId: "1",
            doctorName: "Nguyễn Minh Anh",
            serviceId: "1",
            serviceName: "Tư vấn trước xét nghiệm HIV",
            date: new Date().toISOString().split('T')[0],
            startTime: "09:00",
            endTime: "09:30",
            status: "confirmed",
            notes: "Lần đầu khám",
            createdAt: new Date().toISOString(),
            appointmentType: "offline"
        };
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
        console.log("Creating mock appointment:", appointment);

        // Lấy thông tin chi tiết về dịch vụ và bác sĩ
        let serviceName = "Dịch vụ Demo";
        let doctorName = "Bác sĩ Demo";

        try {
            // Lấy tên dịch vụ từ danh sách dịch vụ
            console.log("Fetching service details for ID:", appointment.serviceId);
            const service = await getServiceById(appointment.serviceId);
            console.log("Service details:", service);
            if (service) {
                serviceName = service.name;
            }

            // Lấy tên bác sĩ từ danh sách bác sĩ
            console.log("Fetching doctor details for ID:", appointment.doctorId);
            const doctor = await getDoctorById(appointment.doctorId);
            console.log("Doctor details:", doctor);
            if (doctor) {
                doctorName = `${doctor.firstName} ${doctor.lastName}`;
            }
        } catch (error) {
            console.error("Error fetching service or doctor details:", error);
        }

        // Lấy tên người dùng từ localStorage
        const userName = localStorage.getItem('userName') || "Nguyễn Văn A";
        console.log("User name from localStorage:", userName);

        // Tạo lịch hẹn mới với thông tin đầy đủ
        const newAppointment = {
            id: Math.random().toString(36).substring(2, 9),
            patientId: appointment.patientId,
            patientName: userName,
            doctorId: appointment.doctorId,
            doctorName: doctorName,
            serviceId: appointment.serviceId,
            serviceName: serviceName,
            date: appointment.date,
            startTime: appointment.startTime,
            endTime: calculateEndTime(appointment.startTime, 30), // Giả định thời gian hẹn là 30 phút
            status: "pending",
            notes: appointment.notes || "",
            createdAt: new Date().toISOString(),
            appointmentType: appointment.appointmentType || "offline"
        };

        console.log("Created mock appointment:", newAppointment);

        // Lưu vào localStorage để có thể hiển thị trong danh sách lịch hẹn
        try {
            const existingAppointmentsJson = localStorage.getItem('mockAppointments');
            console.log("Existing appointments in localStorage:", existingAppointmentsJson);

            let appointments = [];

            if (existingAppointmentsJson) {
                try {
                    appointments = JSON.parse(existingAppointmentsJson);
                    console.log("Parsed appointments:", appointments);

                    if (!Array.isArray(appointments)) {
                        console.warn("mockAppointments is not an array, resetting to empty array");
                        appointments = [];
                    }
                } catch (parseError) {
                    console.error("Error parsing mockAppointments:", parseError);
                    appointments = [];
                }
            }

            appointments.push(newAppointment);
            localStorage.setItem('mockAppointments', JSON.stringify(appointments));
            console.log("Saved appointment to localStorage. Total appointments:", appointments.length);

            // Kiểm tra lại dữ liệu đã lưu
            const savedData = localStorage.getItem('mockAppointments');
            console.log("Verification - Saved data in localStorage:", savedData);
        } catch (error) {
            console.error("Failed to save appointment to localStorage:", error);
        }

        return newAppointment;
    }

    try {
        // Lấy thông tin người dùng từ localStorage
        const patientName = localStorage.getItem('userName') || "Bệnh nhân";

        // Chuẩn bị query parameters
        const queryParams = new URLSearchParams({
            patientId: appointment.patientId,
            patientName: patientName
        }).toString();

        const response = await appointmentApi.post<ApiResponse<Appointment>>(
            `/appointments?${queryParams}`,
            appointment
        );

        return response.data.data || null;
    } catch (error) {
        console.error("Error creating appointment:", error);
        return null;
    }
};

// Helper function to calculate end time
const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    let endHours = hours + Math.floor((minutes + durationMinutes) / 60);
    const endMinutes = (minutes + durationMinutes) % 60;

    if (endHours >= 24) endHours -= 24;

    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
};

export const updateAppointment = async (id: string, appointment: AppointmentUpdateDto): Promise<Appointment | null> => {
    if (USE_MOCK_DATA) {
        // Mock update response
        return {
            id: id,
            patientId: "user123",
            patientName: "Nguyễn Văn A",
            doctorId: "doctor123",
            doctorName: "Bác sĩ Demo",
            serviceId: "service123",
            serviceName: "Dịch vụ Demo",
            date: appointment.date || new Date().toISOString().split('T')[0],
            startTime: appointment.startTime || "09:00",
            endTime: "09:30",
            status: "pending",
            notes: appointment.notes || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            appointmentType: "offline"
        };
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
        // Mock cancellation
        return true;
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
        // Return mock available slots
        return generateMockTimeSlots(date);
    }

    try {
        const response = await appointmentApi.get<ApiResponse<AvailableSlot[]>>(
            `/appointments/available-slots?doctorId=${doctorId}&date=${date}`
        );

        if (response.data.data && response.data.data.length > 0) {
            return response.data.data[0].availableTimes || [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching available slots:", error);
        return generateMockTimeSlots(date); // Fallback to mock data
    }
};

// Helper function to reset localStorage appointments
export const resetMockAppointments = (): void => {
    try {
        localStorage.removeItem('mockAppointments');
        console.log("Removed mockAppointments from localStorage");
    } catch (error) {
        console.error("Error removing mockAppointments from localStorage:", error);
    }
}; 