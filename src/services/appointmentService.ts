import { ApiResponse, Appointment, AppointmentCreateDto, AppointmentUpdateDto, Doctor, Service, AvailableSlot, AppointmentType } from '../types';
import { Appointment as AppointmentTypeFromAppointmentD } from '../types/appointment.d';
import appointmentApi from './appointmentApi';
import { store } from '../store';

// Mock data cho trường hợp API không hoạt động
const MOCK_SERVICES: Service[] = [
    {
        id: "1",
        name: "Tư vấn trước xét nghiệm HIV",
        description: "Tư vấn về quy trình xét nghiệm HIV, giải thích về các phương pháp xét nghiệm và lợi ích của việc biết tình trạng nhiễm HIV",
        duration: 30,
        price: 200000,
        category: "hiv-testing",
        imageUrl: "/services/image1.jpg"
    },
    {
        id: "2",
        name: "Xét nghiệm HIV nhanh",
        description: "Xét nghiệm HIV nhanh với kết quả trong vòng 20 phút, được thực hiện bởi nhân viên y tế có chuyên môn",
        duration: 30,
        price: 300000,
        category: "hiv-testing",
        imageUrl: "/services/image2.jpg"
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
        imageUrl: "/services/image3.jpg"
    },
    {
        id: "7",
        name: "Tầm soát nhiễm trùng cơ hội",
        description: "Khám sàng lọc và xét nghiệm các bệnh nhiễm trùng cơ hội thường gặp ở người nhiễm HIV",
        duration: 60,
        price: 600000,
        category: "hiv-care",
        imageUrl: "/services/image4.jpg"
    },
    {
        id: "8",
        name: "Tư vấn PrEP (Dự phòng trước phơi nhiễm)",
        description: "Tư vấn và đánh giá khả năng sử dụng thuốc PrEP để dự phòng HIV trước phơi nhiễm",
        duration: 45,
        price: 350000,
        category: "hiv-prevention",
        imageUrl: "/services/image5.jpg"
    }
];

const MOCK_DOCTORS: Doctor[] = [
    {
        id: "1",
        firstName: "Nguyễn",
        lastName: "Minh Anh",
        specialization: "Bác sĩ Nhiễm HIV/AIDS",
        imageUrl: "/team-medical/doctor1.jpg",
        biography: "Bác sĩ chuyên khoa Nhiễm với hơn 10 năm kinh nghiệm điều trị HIV/AIDS, chuyên về quản lý điều trị ARV và theo dõi nhiễm trùng cơ hội",
        education: "Tiến sĩ Y khoa, Đại học Y Hà Nội",
        experience: "10 năm"
    },
    {
        id: "2",
        firstName: "Trần",
        lastName: "Hoàng Nam",
        specialization: "Chuyên gia Tư vấn HIV",
        imageUrl: "/team-medical/doctor2.jpg",
        biography: "Chuyên gia tư vấn HIV với kinh nghiệm trong tư vấn xét nghiệm, tư vấn tuân thủ điều trị và hỗ trợ tinh thần cho người nhiễm HIV",
        education: "Thạc sĩ Y tế Công cộng, Đại học Y Dược TP.HCM",
        experience: "8 năm"
    },
    {
        id: "3",
        firstName: "Lê",
        lastName: "Thị Hương",
        specialization: "Tâm lý học Lâm sàng",
        imageUrl: "/team-medical/doctor3.jpg",
        biography: "Nhà tâm lý học lâm sàng chuyên về sức khỏe tâm thần và hỗ trợ tâm lý cho người nhiễm HIV và gia đình",
        education: "Thạc sĩ Tâm lý lâm sàng, Đại học Khoa học Xã hội và Nhân văn",
        experience: "7 năm"
    },
    {
        id: "4",
        firstName: "Phạm",
        lastName: "Văn Khoa",
        specialization: "Bác sĩ Truyền nhiễm",
        imageUrl: "/team-medical/doctor4.jpg",
        biography: "Bác sĩ chuyên khoa Truyền nhiễm với chuyên môn về HIV/AIDS và các bệnh nhiễm trùng cơ hội",
        education: "Bác sĩ Chuyên khoa II, Đại học Y Hà Nội",
        experience: "15 năm"
    },
    {
        id: "5",
        firstName: "Hoàng",
        lastName: "Thị Lan",
        specialization: "Dược sĩ Lâm sàng HIV",
        imageUrl: "/team-medical/doctor5.jpg",
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
const USE_MOCK_DATA = false;

// Service API functions
export const getServices = async (): Promise<Service[]> => {
    if (USE_MOCK_DATA) {
        console.log("Using mock services data");
        return MOCK_SERVICES;
    }
    try {
        console.log("Fetching services from API:", appointmentApi.defaults.baseURL + '/services');
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
    // Lấy userId từ Redux store nếu có
    // Sử dụng store từ redux để lấy thông tin user
    let userId: string | null = null;

    try {
        // Kiểm tra nếu user đã đăng nhập trong Redux store
        const state = store.getState();
        userId = state.auth.user?.id;
        console.log("Got user ID from Redux store:", userId);
    } catch (error) {
        console.error("Error accessing Redux store:", error);
    }

    // Fallback to localStorage if Redux state is not available
    if (!userId) {
        const localStorageUserId = localStorage.getItem('userId');
        userId = localStorageUserId || null;
        console.log("Fallback to localStorage user ID:", userId);
    }

    console.log("Getting appointments for user ID:", userId);

    if (!userId) {
        console.warn("No user ID found in Redux or localStorage");
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
                status: 1 as any, // Confirmed = 1
                notes: "Lần đầu khám",
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
                status: 0 as any, // Pending = 0
                notes: "Xét nghiệm định kỳ",
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
                status: 3 as any, // Completed = 3
                notes: "Tư vấn tâm lý định kỳ",
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
                status: 0 as any, // Pending = 0
                notes: "Khám theo dõi điều trị",
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
                status: 0 as any, // Pending = 0
                notes: "Tư vấn về tác dụng phụ thuốc",
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
                status: 3 as any, // Completed = 3
                notes: "Khám định kỳ",
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
                status: 2 as any, // Cancelled = 2
                notes: "Hủy do lịch cá nhân",
                appointmentType: "offline" as AppointmentType
            }
        ] as unknown as Appointment[];

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
        const response = await appointmentApi.get<ApiResponse<Appointment[]>>('/appointments/patient/' + userId);
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
            status: 1 as any, // Confirmed = 1
            notes: "Lần đầu khám",
            appointmentType: "offline"
        } as unknown as Appointment;
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
            status: 0 as any, // Pending = 0
            notes: appointment.notes || "",
            appointmentType: appointment.appointmentType || "offline"
        } as unknown as Appointment;

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

        console.log("Creating appointment with real API:");
        console.log("- Appointment data:", appointment);
        console.log("- API base URL:", appointmentApi.defaults.baseURL);
        console.log("- Patient name from localStorage:", patientName);

        // Convert appointmentType from string to number (0 for offline, 1 for online)
        const appointmentData = {
            ...appointment,
            appointmentType: appointment.appointmentType === 'online' ? 1 : 0
        };

        console.log("- Modified appointment data for API:", appointmentData);

        // Không sử dụng encodeURIComponent vì patientName sẽ được truyền trực tiếp trong body request
        const response = await appointmentApi.post<ApiResponse<Appointment>>(
            `/appointments`,
            {
                appointmentDto: appointmentData,
                patientId: appointment.patientId,
                patientName: patientName  // Truyền trực tiếp tên người dùng, không cần mã hóa
            }
        );

        console.log("API Response:", response);
        console.log("- Status:", response.status);
        console.log("- Response data:", response.data);

        return response.data.data || null;
    } catch (error: any) {
        console.error("Error creating appointment:", error);
        console.error("- Error name:", error.name);
        console.error("- Error message:", error.message);

        // Xử lý thông báo lỗi đặt lịch trùng
        let errorMessage: string = 'Đã xảy ra lỗi khi đặt lịch';

        // Log chi tiết về lỗi từ API response nếu có
        if (error.response) {
            console.error("- Response status:", error.response.status);
            console.error("- Response headers:", error.response.headers);
            console.error("- Response data:", JSON.stringify(error.response.data, null, 2));

            // Trích xuất thông báo lỗi chi tiết nếu có
            if (error.response.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                    console.error("- Error message from API:", errorMessage);

                    // Đưa ra thông báo cụ thể cho các lỗi phổ biến
                    if (errorMessage.includes('không có lịch trống') ||
                        errorMessage.includes('đã được đặt') ||
                        errorMessage.includes('trùng lịch')) {
                        throw new Error(`Bác sĩ không có lịch trống trong khung giờ này. Vui lòng chọn khung giờ hoặc ngày khác.`);
                    }
                }
            }
        }

        // Log chi tiết cấu hình request
        if (error.config) {
            console.error("- Request URL:", error.config.url);
            console.error("- Request method:", error.config.method);
            console.error("- Request headers:", error.config.headers);
            console.error("- Request data:", error.config.data);
        }

        // Ném lại lỗi để component UI có thể bắt và hiển thị
        throw new Error(errorMessage || "Đã xảy ra lỗi khi đặt lịch");
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
            status: 0 as any, // Pending = 0
            notes: appointment.notes || "",
            appointmentType: "offline"
        } as unknown as Appointment;
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

export interface TimeSlotStatus {
    time: string;
    isAvailable: boolean;
    isBooked: boolean;
    patientName?: string;
}

export const getAvailableSlots = async (doctorId: string, date: string, serviceId: string): Promise<string[]> => {
    if (USE_MOCK_DATA) {
        // Return mock available slots
        return generateMockTimeSlots(date);
    }

    try {
        console.log(`Fetching available slots for doctorId=${doctorId}, date=${date}`);

        const response = await appointmentApi.get<ApiResponse<AvailableSlot[]>>(
            `/appointments/available-slots?doctorId=${doctorId}&date=${date}`
        );

        console.log("Available slots API response:", response.data);

        if (response.data.data && response.data.data.length > 0) {
            // Lọc ra các khung giờ mà bác sĩ có thể khám
            const availableTimes = response.data.data[0].availableTimes || [];
            console.log(`Found ${availableTimes.length} available time slots`);

            // Kiểm tra và lấy các lịch hẹn đã được đặt cho bác sĩ này vào ngày này
            try {
                const existingAppointmentsResponse = await appointmentApi.get<ApiResponse<Appointment[]>>(
                    `/appointments/doctor/${doctorId}/date/${date}`
                );

                if (existingAppointmentsResponse.data.success && existingAppointmentsResponse.data.data) {
                    const bookedTimes = existingAppointmentsResponse.data.data.map(app => app.startTime);
                    console.log(`Found ${bookedTimes.length} already booked slots for this doctor and date:`, bookedTimes);

                    // Lọc bỏ các khung giờ đã được đặt
                    const filteredAvailableTimes = availableTimes.filter(time => !bookedTimes.includes(time));
                    console.log(`After filtering booked slots, ${filteredAvailableTimes.length} slots remain available`);

                    return filteredAvailableTimes;
                }
            } catch (checkError) {
                console.warn("Error checking existing appointments, returning all available slots:", checkError);
            }

            return availableTimes;
        }

        console.log("No available time slots found in API response");
        return [];
    } catch (error) {
        console.error("Error fetching available slots:", error);
        return generateMockTimeSlots(date); // Fallback to mock data
    }
};

export const getDetailedTimeSlots = async (doctorId: string, date: string, serviceId: string): Promise<TimeSlotStatus[]> => {
    try {
        console.log(`Fetching detailed time slots for doctorId=${doctorId}, date=${date}`);

        // Lấy tất cả khung giờ làm việc của bác sĩ (bao gồm cả đã đặt và chưa đặt)
        const response = await appointmentApi.get<ApiResponse<AvailableSlot[]>>(
            `/appointments/available-slots?doctorId=${doctorId}&date=${date}`
        );

        // Lấy các lịch hẹn đã được đặt
        const existingAppointmentsResponse = await appointmentApi.get<ApiResponse<Appointment[]>>(
            `/appointments/doctor/${doctorId}/date/${date}`
        );

        const allTimeSlots: TimeSlotStatus[] = [];

        if (response.data.data && response.data.data.length > 0) {
            // Lấy tất cả khung giờ làm việc (chỉ những khung giờ available)
            const availableWorkingTimes = response.data.data[0].availableTimes || [];
            const bookedAppointments = existingAppointmentsResponse.data.data || [];

            // Tạo Set để lưu tất cả khung giờ (cả available và booked)
            const allWorkingTimes = new Set<string>();

            // Thêm các khung giờ available
            availableWorkingTimes.forEach(time => allWorkingTimes.add(time));

            // Thêm các khung giờ đã đặt
            bookedAppointments.forEach(app => allWorkingTimes.add(app.startTime));

            // Sắp xếp theo thời gian
            const sortedTimes = Array.from(allWorkingTimes).sort();

            // Tạo danh sách tất cả khung giờ với trạng thái
            sortedTimes.forEach(time => {
                const bookedAppointment = bookedAppointments.find(app => app.startTime === time);

                allTimeSlots.push({
                    time: time,
                    isAvailable: !bookedAppointment,
                    isBooked: !!bookedAppointment,
                    patientName: bookedAppointment?.patientName
                });
            });
        }

        console.log(`Found ${allTimeSlots.length} total time slots (available + booked)`);
        return allTimeSlots;
    } catch (error) {
        console.error('Error fetching detailed time slots:', error);
        return [];
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