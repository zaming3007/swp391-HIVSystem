import api from './api';

// Custom types for reminders
export interface MedicationReminder {
    id: string;
    userId: string;
    medicineName: string;
    schedule: string;
    time: string;
    enabled: boolean;
    notes?: string;
}

export interface AppointmentReminder {
    id: string;
    userId: string;
    title: string;
    date: string;
    time: string;
    doctor: string;
    location: string;
    notes?: string;
}

export interface ARVRegimen {
    id: string;
    name: string;
    description: string;
}

export const reminderService = {
    // Medication Reminders
    getMedicationReminders: async (userId: string) => {
        const response = await api.get<MedicationReminder[]>(`/reminders/medications/${userId}`);
        return response.data;
    },

    createMedicationReminder: async (reminder: Omit<MedicationReminder, 'id'>) => {
        const response = await api.post<MedicationReminder>('/reminders/medications', reminder);
        return response.data;
    },

    updateMedicationReminder: async (reminderId: string, reminder: Partial<MedicationReminder>) => {
        const response = await api.put<MedicationReminder>(`/reminders/medications/${reminderId}`, reminder);
        return response.data;
    },

    toggleMedicationReminder: async (reminderId: string, enabled: boolean) => {
        const response = await api.patch<MedicationReminder>(`/reminders/medications/${reminderId}/toggle`, { enabled });
        return response.data;
    },

    deleteMedicationReminder: async (reminderId: string) => {
        const response = await api.delete(`/reminders/medications/${reminderId}`);
        return response.data;
    },

    // Appointment Reminders
    getAppointmentReminders: async (userId: string) => {
        const response = await api.get<AppointmentReminder[]>(`/reminders/appointments/${userId}`);
        return response.data;
    },

    createAppointmentReminder: async (reminder: Omit<AppointmentReminder, 'id'>) => {
        const response = await api.post<AppointmentReminder>('/reminders/appointments', reminder);
        return response.data;
    },

    updateAppointmentReminder: async (reminderId: string, reminder: Partial<AppointmentReminder>) => {
        const response = await api.put<AppointmentReminder>(`/reminders/appointments/${reminderId}`, reminder);
        return response.data;
    },

    deleteAppointmentReminder: async (reminderId: string) => {
        const response = await api.delete(`/reminders/appointments/${reminderId}`);
        return response.data;
    },

    // ARV Regimens
    getARVRegimens: async () => {
        const response = await api.get<ARVRegimen[]>('/arv-regimens');
        return response.data;
    }
}; 