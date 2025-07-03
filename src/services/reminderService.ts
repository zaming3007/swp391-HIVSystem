import { ApiResponse, Reminder, ReminderFormData } from '../types';
import api from './api';
import authApi from './authApi';

// Flag để quyết định có sử dụng mock data hay không
const USE_MOCK_DATA = true;

// Mock data cho trường hợp API không hoạt động
const MOCK_REMINDERS: Reminder[] = [
    {
        id: '1',
        userId: 'current-user',
        title: 'Uống thuốc ARV',
        description: 'Uống thuốc ARV liều buổi sáng',
        reminderType: 'medication',
        startDate: '2025-06-01',
        time: '08:00',
        recurrence: 'daily',
        isActive: true,
        createdAt: '2025-06-01T00:00:00Z',
        medicationName: 'ARV',
        dosage: '1 viên',
        isRead: false
    },
    {
        id: '2',
        userId: 'current-user',
        title: 'Tái khám tháng 7',
        description: 'Lịch hẹn tái khám với bác sĩ Nguyễn Minh Anh',
        reminderType: 'appointment',
        startDate: '2025-07-15',
        time: '14:30',
        recurrence: 'none',
        isActive: true,
        createdAt: '2025-06-01T00:00:00Z',
        doctorId: '1',
        appointmentId: 'app-123',
        isRead: false
    }
];

// Mock data cho ARV regimens
const MOCK_ARV_REGIMENS: ARVRegimen[] = [
    { id: '1', name: 'TDF + 3TC + DTG', description: 'Phác đồ bậc 1 - Người trưởng thành' },
    { id: '2', name: 'TDF + 3TC + EFV', description: 'Phác đồ bậc 1 - Phụ nữ có thai' },
    { id: '3', name: 'ABC + 3TC + DTG', description: 'Phác đồ thay thế - Người có bệnh thận' },
    { id: '4', name: 'AZT + 3TC + NVP', description: 'Phác đồ bậc 1 - Trẻ em' },
    { id: '5', name: 'TDF + FTC + DTG', description: 'Phác đồ bậc 1 - Thay thế' }
];

// Mock data cho medication reminders
const MOCK_MEDICATION_REMINDERS: any[] = [
    {
        id: '1',
        userId: 'current-user',
        medicineName: 'ARV - TDF + 3TC + DTG',
        schedule: 'Hàng ngày',
        time: '08:00',
        enabled: true,
        notes: 'Uống sau bữa sáng'
    },
    {
        id: '2',
        userId: 'current-user',
        medicineName: 'Cotrimoxazole',
        schedule: 'Thứ 2, 4, 6',
        time: '20:00',
        enabled: true,
        notes: 'Uống sau bữa tối'
    }
];

// Mock data cho appointment reminders
const MOCK_APPOINTMENT_REMINDERS: AppointmentReminder[] = [
    {
        id: '1',
        userId: 'current-user',
        appointmentId: 'apt-1',
        appointmentDate: '2023-12-15',
        reminderDate: '2023-12-14',
        description: 'Tái khám và lấy thuốc ARV',
        notes: 'Mang theo sổ điều trị và kết quả xét nghiệm'
    },
    {
        id: '2',
        userId: 'current-user',
        appointmentId: 'apt-2',
        appointmentDate: '2023-12-28',
        reminderDate: '2023-12-27',
        description: 'Xét nghiệm CD4 và tải lượng virus',
        notes: 'Nhịn ăn 8 tiếng trước khi xét nghiệm'
    }
];

// Custom types for reminders
export interface MedicationReminder {
    id: string;
    userId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    startDate: Date | string;
    reminderTimes: string[] | string; // Có thể là mảng hoặc JSON string
    notes?: string;
    createdAt: Date | string;
}

export interface AppointmentReminder {
    id: string;
    userId: string;
    appointmentId: string;
    appointmentDate: Date | string;
    reminderDate: Date | string;
    notes?: string;
    description: string;
}

export interface ARVRegimen {
    id: string;
    name: string;
    description: string;
}

// Get all reminders for the current user
export const getMyReminders = async () => {
    try {
        const response = await authApi.get('/reminders/my');
        return response.data.data || [];
    } catch (error) {
        console.error('Error fetching reminders:', error);
        return [];
    }
};

// Get a specific reminder
export const getReminderById = async (id: string) => {
    try {
        const response = await authApi.get(`/reminders/${id}`);
        return response.data.data || null;
    } catch (error) {
        console.error('Error fetching reminder:', error);
        return null;
    }
};

// Create a new reminder
export const createReminder = async (reminder: Omit<MedicationReminder, 'id'>) => {
    try {
        const response = await authApi.post('/reminders', reminder);
        return response.data.data;
    } catch (error) {
        console.error('Error creating reminder:', error);
        throw error;
    }
};

// Update an existing reminder
export const updateReminder = async (id: string, reminder: Partial<MedicationReminder>) => {
    try {
        const response = await authApi.put(`/reminders/${id}`, reminder);
        return response.data.data;
    } catch (error) {
        console.error('Error updating reminder:', error);
        throw error;
    }
};

// Delete a reminder
export const deleteReminder = async (id: string) => {
    try {
        await authApi.delete(`/reminders/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting reminder:', error);
        return false;
    }
};

export const reminderService = {
    // Lấy tất cả nhắc nhở
    getAllReminders: async (): Promise<Reminder[]> => {
        if (USE_MOCK_DATA) {
            console.log('Using mock reminders data');
            return MOCK_REMINDERS;
        }
        try {
            const response = await authApi.get<Reminder[]>('/Reminders');
            return response.data;
        } catch (error) {
            console.error('Error fetching reminders:', error);
            return MOCK_REMINDERS; // Fallback to mock data on error
        }
    },

    // Lấy nhắc nhở theo loại
    getRemindersByType: async (reminderType: string): Promise<Reminder[]> => {
        if (USE_MOCK_DATA) {
            return MOCK_REMINDERS.filter(reminder => reminder.reminderType === reminderType);
        }
        try {
            const response = await authApi.get<Reminder[]>(`/Reminders/type/${reminderType}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reminders by type ${reminderType}:`, error);
            return MOCK_REMINDERS.filter(reminder => reminder.reminderType === reminderType);
        }
    },

    // Lấy thông tin chi tiết của một nhắc nhở
    getReminderById: async (id: string): Promise<Reminder | null> => {
        if (USE_MOCK_DATA) {
            const reminder = MOCK_REMINDERS.find(r => r.id === id);
            return reminder || null;
        }
        try {
            const response = await authApi.get<Reminder>(`/Reminders/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reminder with ID ${id}:`, error);
            return MOCK_REMINDERS.find(r => r.id === id) || null;
        }
    },

    // Tạo nhắc nhở mới
    createReminder: async (reminderData: ReminderFormData): Promise<Reminder | null> => {
        if (USE_MOCK_DATA) {
            const newReminder: Reminder = {
                id: `mock-${Date.now()}`,
                userId: 'current-user',
                title: reminderData.title,
                description: reminderData.description,
                reminderType: reminderData.reminderType,
                startDate: reminderData.startDate,
                endDate: reminderData.endDate,
                time: reminderData.time,
                recurrence: reminderData.recurrence,
                recurrenceDays: reminderData.recurrenceDays ? JSON.stringify(reminderData.recurrenceDays) : undefined,
                isActive: true,
                createdAt: new Date().toISOString(),
                medicationName: reminderData.medicationName,
                dosage: reminderData.dosage,
                doctorId: reminderData.doctorId,
                appointmentId: reminderData.appointmentId,
                isRead: false
            };
            MOCK_REMINDERS.push(newReminder);
            return newReminder;
        }
        try {
            // Chuyển đổi recurrenceDays từ mảng sang chuỗi JSON
            const payload = {
                ...reminderData,
                recurrenceDays: reminderData.recurrenceDays ? JSON.stringify(reminderData.recurrenceDays) : undefined
            };

            const response = await authApi.post<Reminder>('/Reminders', payload);
            return response.data;
        } catch (error) {
            console.error('Error creating reminder:', error);
            return null;
        }
    },

    // Cập nhật nhắc nhở
    updateReminder: async (id: string, reminderData: ReminderFormData): Promise<Reminder | null> => {
        if (USE_MOCK_DATA) {
            const index = MOCK_REMINDERS.findIndex(r => r.id === id);
            if (index === -1) return null;

            const updatedReminder: Reminder = {
                ...MOCK_REMINDERS[index],
                title: reminderData.title,
                description: reminderData.description,
                reminderType: reminderData.reminderType,
                startDate: reminderData.startDate,
                endDate: reminderData.endDate,
                time: reminderData.time,
                recurrence: reminderData.recurrence,
                recurrenceDays: reminderData.recurrenceDays ? JSON.stringify(reminderData.recurrenceDays) : undefined,
                updatedAt: new Date().toISOString(),
                medicationName: reminderData.medicationName,
                dosage: reminderData.dosage,
                doctorId: reminderData.doctorId,
                appointmentId: reminderData.appointmentId
            };
            MOCK_REMINDERS[index] = updatedReminder;
            return updatedReminder;
        }
        try {
            // Chuyển đổi recurrenceDays từ mảng sang chuỗi JSON
            const payload = {
                id,
                ...reminderData,
                recurrenceDays: reminderData.recurrenceDays ? JSON.stringify(reminderData.recurrenceDays) : undefined
            };

            const response = await authApi.put<Reminder>(`/Reminders/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error updating reminder with ID ${id}:`, error);
            return null;
        }
    },

    // Xóa nhắc nhở
    deleteReminder: async (id: string): Promise<boolean> => {
        if (USE_MOCK_DATA) {
            const index = MOCK_REMINDERS.findIndex(r => r.id === id);
            if (index === -1) return false;
            MOCK_REMINDERS.splice(index, 1);
            return true;
        }
        try {
            await authApi.delete(`/Reminders/${id}`);
            return true;
        } catch (error) {
            console.error(`Error deleting reminder with ID ${id}:`, error);
            return false;
        }
    },

    // Lấy nhắc nhở sắp tới
    getUpcomingReminders: async (days: number = 7): Promise<Reminder[]> => {
        if (USE_MOCK_DATA) {
            const now = new Date();
            const futureDate = new Date();
            futureDate.setDate(now.getDate() + days);

            return MOCK_REMINDERS.filter(reminder => {
                const reminderDate = new Date(reminder.startDate);
                return reminderDate >= now && reminderDate <= futureDate && reminder.isActive;
            });
        }
        try {
            const response = await authApi.get<Reminder[]>(`/Reminders/upcoming?days=${days}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching upcoming reminders:', error);
            return [];
        }
    },

    // Lấy nhắc nhở hôm nay
    getTodayReminders: async (): Promise<Reminder[]> => {
        if (USE_MOCK_DATA) {
            const today = new Date().toISOString().split('T')[0];
            return MOCK_REMINDERS.filter(reminder =>
                reminder.startDate === today && reminder.isActive
            );
        }
        try {
            const response = await authApi.get<Reminder[]>('/Reminders/today');
            return response.data;
        } catch (error) {
            console.error('Error fetching today reminders:', error);
            return [];
        }
    },

    // Đánh dấu nhắc nhở đã đọc
    markReminderAsRead: async (id: string): Promise<boolean> => {
        if (USE_MOCK_DATA) {
            const reminder = MOCK_REMINDERS.find(r => r.id === id);
            if (!reminder) return false;
            reminder.isRead = true;
            return true;
        }
        try {
            await authApi.put(`/Reminders/${id}/markAsRead`);
            return true;
        } catch (error) {
            console.error(`Error marking reminder ${id} as read:`, error);
            return false;
        }
    },

    // Get medication reminders
    getMedicationReminders: async (userId: string): Promise<MedicationReminder[]> => {
        if (USE_MOCK_DATA) {
            console.log('Using mock medication reminders data');
            // Cập nhật userId trong mock data để phù hợp với người dùng hiện tại
            return MOCK_MEDICATION_REMINDERS.map(reminder => ({
                ...reminder,
                userId: userId
            }));
        }
        try {
            const response = await authApi.get<MedicationReminder[]>(`/reminders/medications?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching medication reminders:', error);
            // Fallback to mock data
            return MOCK_MEDICATION_REMINDERS.map(reminder => ({
                ...reminder,
                userId: userId
            }));
        }
    },

    // Create medication reminder
    createMedicationReminder: async (reminder: Omit<MedicationReminder, 'id'>): Promise<MedicationReminder> => {
        if (USE_MOCK_DATA) {
            const newReminder: MedicationReminder = {
                ...reminder,
                id: `med-${Date.now()}`
            };
            MOCK_MEDICATION_REMINDERS.push(newReminder);
            return newReminder;
        }
        try {
            const response = await authApi.post<MedicationReminder>('/reminders/medications', reminder);
            return response.data;
        } catch (error) {
            console.error('Error creating medication reminder:', error);
            // Simulate API response
            const mockReminder: MedicationReminder = {
                ...reminder,
                id: `med-${Date.now()}`
            };
            MOCK_MEDICATION_REMINDERS.push(mockReminder);
            return mockReminder;
        }
    },

    // Get appointment reminders
    getAppointmentReminders: async (userId: string): Promise<AppointmentReminder[]> => {
        if (USE_MOCK_DATA) {
            console.log('Using mock appointment reminders data');
            return MOCK_APPOINTMENT_REMINDERS.map(reminder => ({
                ...reminder,
                userId: userId
            }));
        }
        try {
            const response = await authApi.get<AppointmentReminder[]>(`/reminders/appointments?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching appointment reminders:', error);
            return MOCK_APPOINTMENT_REMINDERS.map(reminder => ({
                ...reminder,
                userId: userId
            }));
        }
    },

    // ARV Regimens
    getARVRegimens: async () => {
        if (USE_MOCK_DATA) {
            console.log('Using mock ARV regimens data');
            return [
                { id: '1', name: 'TDF + 3TC + DTG', description: 'Phác đồ bậc 1 - Người trưởng thành' },
                { id: '2', name: 'TDF + 3TC + EFV', description: 'Phác đồ bậc 1 - Phụ nữ có thai' },
                { id: '3', name: 'ABC + 3TC + DTG', description: 'Phác đồ thay thế - Người có bệnh thận' },
                { id: '4', name: 'AZT + 3TC + NVP', description: 'Phác đồ bậc 1 - Trẻ em' },
                { id: '5', name: 'TDF + FTC + DTG', description: 'Phác đồ bậc 1 - Thay thế' }
            ];
        }
        try {
            const response = await authApi.get<ARVRegimen[]>('/arv-regimens');
            return response.data;
        } catch (error) {
            console.error('Error fetching ARV regimens:', error);
            return [
                { id: '1', name: 'TDF + 3TC + DTG', description: 'Phác đồ bậc 1 - Người trưởng thành' },
                { id: '2', name: 'TDF + 3TC + EFV', description: 'Phác đồ bậc 1 - Phụ nữ có thai' },
                { id: '3', name: 'ABC + 3TC + DTG', description: 'Phác đồ thay thế - Người có bệnh thận' },
                { id: '4', name: 'AZT + 3TC + NVP', description: 'Phác đồ bậc 1 - Trẻ em' },
                { id: '5', name: 'TDF + FTC + DTG', description: 'Phác đồ bậc 1 - Thay thế' }
            ];
        }
    }
}; 