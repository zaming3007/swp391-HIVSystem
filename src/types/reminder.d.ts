export interface Reminder {
    id: string;
    userId: string;
    title: string;
    description?: string;
    reminderType: 'medication' | 'appointment';
    startDate: string;
    endDate?: string;
    time: string;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'none';
    recurrenceDays?: string; // JSON array của các ngày trong tuần [0-6]
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    medicationName?: string;
    dosage?: string;
    doctorId?: string;
    appointmentId?: string;
    isRead: boolean;
    lastNotificationSent?: string;
}

export interface ReminderFormData {
    title: string;
    description?: string;
    reminderType: 'medication' | 'appointment';
    startDate: string;
    endDate?: string;
    time: string;
    recurrence?: 'daily' | 'weekly' | 'monthly' | 'none';
    recurrenceDays?: number[]; // [0-6] với 0 là Chủ nhật, 1 là Thứ 2, ...
    medicationName?: string;
    dosage?: string;
    doctorId?: string;
    appointmentId?: string;
}

export interface ReminderState {
    reminders: Reminder[];
    upcomingReminders: Reminder[];
    todayReminders: Reminder[];
    selectedReminder: Reminder | null;
    isLoading: boolean;
    error: string | null;
}

export type RecurrenceOption = {
    value: 'daily' | 'weekly' | 'monthly' | 'none';
    label: string;
}; 