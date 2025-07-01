import authApi from './authApi';

// Custom types for reminders
export interface MedicationReminder {
    id: string;
    userId: string;
    medicationName: string;
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
    // Medication Reminders
    getMedicationReminders: async (userId: string) => {
        const response = await authApi.get<MedicationReminder[]>(`/reminders/medications/${userId}`);
        return response.data;
    },

    createMedicationReminder: async (reminder: Omit<MedicationReminder, 'id'>) => {
        const response = await authApi.post<MedicationReminder>('/reminders/medications', reminder);
        return response.data;
    },

    updateMedicationReminder: async (reminderId: string, reminder: Partial<MedicationReminder>) => {
        const response = await authApi.put<MedicationReminder>(`/reminders/medications/${reminderId}`, reminder);
        return response.data;
    },

    toggleMedicationReminder: async (reminderId: string, enabled: boolean) => {
        const response = await authApi.patch<MedicationReminder>(`/reminders/medications/${reminderId}/toggle`, { enabled });
        return response.data;
    },

    deleteMedicationReminder: async (reminderId: string) => {
        const response = await authApi.delete(`/reminders/medications/${reminderId}`);
        return response.data;
    },

    // Appointment Reminders
    getAppointmentReminders: async (userId: string) => {
        const response = await authApi.get<AppointmentReminder[]>(`/reminders/appointments/${userId}`);
        return response.data;
    },

    createAppointmentReminder: async (reminder: Omit<AppointmentReminder, 'id'>) => {
        const response = await authApi.post<AppointmentReminder>('/reminders/appointments', reminder);
        return response.data;
    },

    updateAppointmentReminder: async (reminderId: string, reminder: Partial<AppointmentReminder>) => {
        const response = await authApi.put<AppointmentReminder>(`/reminders/appointments/${reminderId}`, reminder);
        return response.data;
    },

    deleteAppointmentReminder: async (reminderId: string) => {
        const response = await authApi.delete(`/reminders/appointments/${reminderId}`);
        return response.data;
    },

    // ARV Regimens
    getARVRegimens: async () => {
        const response = await authApi.get<ARVRegimen[]>('/arv-regimens');
        return response.data;
    }
}; 