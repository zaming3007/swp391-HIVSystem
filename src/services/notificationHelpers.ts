import { notificationService } from './notificationService';

// Helper functions để tạo notifications cho các tính năng khác nhau

export class NotificationHelpers {
    // APPOINTMENT NOTIFICATIONS
    static async notifyAppointmentBooked(patientId: string, appointmentId: string, doctorName: string, appointmentDate: string) {
        return notificationService.createAppointmentNotification(
            patientId,
            appointmentId,
            'Đặt lịch hẹn thành công',
            `Lịch hẹn với ${doctorName} vào ${appointmentDate} đã được xác nhận.`,
            `/app/appointments/${appointmentId}`
        );
    }

    static async notifyAppointmentReminder(patientId: string, appointmentId: string, doctorName: string, appointmentDate: string) {
        return notificationService.createNotification({
            userId: patientId,
            title: 'Nhắc nhở lịch hẹn',
            message: `Bạn có lịch hẹn với ${doctorName} vào ${appointmentDate}. Vui lòng đến đúng giờ.`,
            type: 'reminder',
            priority: 'high',
            actionUrl: `/app/appointments/${appointmentId}`,
            actionText: 'Xem chi tiết',
            relatedEntityId: appointmentId,
            relatedEntityType: 'appointment',
            createdBy: 'system'
        });
    }

    static async notifyAppointmentCancelled(patientId: string, appointmentId: string, reason: string) {
        return notificationService.createAppointmentNotification(
            patientId,
            appointmentId,
            'Lịch hẹn đã bị hủy',
            `Lịch hẹn của bạn đã bị hủy. Lý do: ${reason}`,
            '/app/appointments'
        );
    }

    static async notifyDoctorNewAppointment(doctorId: string, appointmentId: string, patientName: string, appointmentDate: string) {
        return notificationService.createAppointmentNotification(
            doctorId,
            appointmentId,
            'Lịch hẹn mới',
            `Bệnh nhân ${patientName} đã đặt lịch hẹn vào ${appointmentDate}.`,
            `/doctor/appointments/${appointmentId}`
        );
    }

    // CONSULTATION NOTIFICATIONS
    static async notifyNewConsultationQuestion(staffId: string, consultationId: string, patientName: string) {
        return notificationService.createConsultationNotification(
            staffId,
            consultationId,
            'Câu hỏi tư vấn mới',
            `${patientName} đã gửi câu hỏi tư vấn mới cần được trả lời.`,
            `/staff/consultations/${consultationId}`
        );
    }

    static async notifyConsultationAnswered(patientId: string, consultationId: string) {
        return notificationService.createConsultationNotification(
            patientId,
            consultationId,
            'Câu hỏi đã được trả lời',
            'Câu hỏi tư vấn của bạn đã được chuyên gia trả lời.',
            `/app/consultations/${consultationId}`
        );
    }

    // ARV NOTIFICATIONS
    static async notifyARVPrescribed(patientId: string, regimenId: string, doctorName: string, regimenName: string) {
        return notificationService.createARVNotification(
            patientId,
            regimenId,
            'Phác đồ ARV mới',
            `Bác sĩ ${doctorName} đã kê đơn phác đồ ${regimenName} cho bạn.`,
            'high',
            `/app/arv-management`
        );
    }

    static async notifyARVAdherenceReminder(patientId: string, regimenId: string) {
        return notificationService.createARVNotification(
            patientId,
            regimenId,
            'Nhắc nhở uống thuốc ARV',
            'Đã đến giờ uống thuốc ARV. Hãy tuân thủ đúng liều lượng và thời gian.',
            'urgent',
            '/app/arv-management'
        );
    }

    static async notifyARVAdherenceLow(doctorId: string, patientId: string, adherenceRate: number) {
        return notificationService.createARVNotification(
            doctorId,
            patientId,
            'Cảnh báo tuân thủ ARV thấp',
            `Bệnh nhân có mức độ tuân thủ ARV thấp (${adherenceRate}%). Cần can thiệp.`,
            'urgent',
            `/doctor/patients/${patientId}/arv`
        );
    }

    static async notifyARVSideEffects(doctorId: string, patientId: string, sideEffects: string) {
        return notificationService.createARVNotification(
            doctorId,
            patientId,
            'Báo cáo tác dụng phụ ARV',
            `Bệnh nhân báo cáo tác dụng phụ: ${sideEffects}`,
            'high',
            `/doctor/patients/${patientId}/arv`
        );
    }

    // TEST RESULT NOTIFICATIONS
    static async notifyNewTestResult(patientId: string, testResultId: string, testType: string, status: string) {
        const priority = status === 'Abnormal' ? 'high' : 'normal';
        return notificationService.createNotification({
            userId: patientId,
            title: 'Kết quả xét nghiệm mới',
            message: `Kết quả xét nghiệm ${testType} đã có. Trạng thái: ${status}`,
            type: 'test_result',
            priority,
            actionUrl: `/app/test-results`,
            actionText: 'Xem kết quả',
            relatedEntityId: testResultId,
            relatedEntityType: 'test_result',
            createdBy: 'system'
        });
    }

    static async notifyDoctorAbnormalResult(doctorId: string, patientId: string, testType: string, result: string) {
        return notificationService.createNotification({
            userId: doctorId,
            title: 'Kết quả xét nghiệm bất thường',
            message: `Bệnh nhân có kết quả ${testType} bất thường: ${result}`,
            type: 'test_result',
            priority: 'high',
            actionUrl: `/doctor/patients/${patientId}/test-results`,
            actionText: 'Xem chi tiết',
            relatedEntityId: patientId,
            relatedEntityType: 'patient',
            createdBy: 'system'
        });
    }

    // BLOG NOTIFICATIONS
    static async notifyNewBlogPost(userId: string, blogId: string, title: string) {
        return notificationService.createNotification({
            userId,
            title: 'Bài viết mới',
            message: `Bài viết mới đã được đăng: ${title}`,
            type: 'blog',
            priority: 'low',
            actionUrl: `/blog/${blogId}`,
            actionText: 'Đọc bài viết',
            relatedEntityId: blogId,
            relatedEntityType: 'blog_post',
            createdBy: 'system'
        });
    }

    static async notifyBlogCommentReply(userId: string, blogId: string, commenterName: string) {
        return notificationService.createNotification({
            userId,
            title: 'Phản hồi bình luận',
            message: `${commenterName} đã phản hồi bình luận của bạn.`,
            type: 'blog',
            priority: 'normal',
            actionUrl: `/blog/${blogId}#comments`,
            actionText: 'Xem phản hồi',
            relatedEntityId: blogId,
            relatedEntityType: 'blog_comment',
            createdBy: 'system'
        });
    }

    // SYSTEM NOTIFICATIONS
    static async notifySystemMaintenance(userId: string, maintenanceDate: string) {
        return notificationService.createSystemNotification(
            userId,
            'Bảo trì hệ thống',
            `Hệ thống sẽ được bảo trì vào ${maintenanceDate}. Vui lòng lưu ý thời gian.`,
            'normal'
        );
    }

    static async notifyPasswordChanged(userId: string) {
        return notificationService.createSystemNotification(
            userId,
            'Mật khẩu đã được thay đổi',
            'Mật khẩu tài khoản của bạn đã được thay đổi thành công.',
            'normal'
        );
    }

    static async notifyProfileUpdated(userId: string) {
        return notificationService.createSystemNotification(
            userId,
            'Thông tin cá nhân đã cập nhật',
            'Thông tin cá nhân của bạn đã được cập nhật thành công.',
            'low'
        );
    }

    // BULK NOTIFICATIONS
    static async notifyAllUsers(title: string, message: string, type = 'system', priority = 'normal') {
        // This would typically get all user IDs from the database
        // For now, we'll return a placeholder
        console.log('Bulk notification to all users:', { title, message, type, priority });
        return Promise.resolve({ success: true, message: 'Bulk notification queued' });
    }

    static async notifyUsersByRole(role: string, title: string, message: string, type = 'system', priority = 'normal') {
        // This would typically get user IDs by role from the database
        console.log('Bulk notification to role:', { role, title, message, type, priority });
        return Promise.resolve({ success: true, message: 'Role-based notification queued' });
    }

    // REMINDER NOTIFICATIONS
    static async createMedicationReminder(patientId: string, medicationName: string, dosage: string, time: string) {
        return notificationService.createNotification({
            userId: patientId,
            title: 'Nhắc nhở uống thuốc',
            message: `Đã đến giờ uống ${medicationName} (${dosage}) lúc ${time}.`,
            type: 'reminder',
            priority: 'high',
            actionUrl: '/app/medications',
            actionText: 'Ghi nhận đã uống',
            createdBy: 'system'
        });
    }

    static async createAppointmentReminder(patientId: string, appointmentId: string, doctorName: string, appointmentTime: string) {
        return notificationService.createNotification({
            userId: patientId,
            title: 'Nhắc nhở lịch hẹn',
            message: `Bạn có lịch hẹn với ${doctorName} lúc ${appointmentTime}.`,
            type: 'reminder',
            priority: 'high',
            actionUrl: `/app/appointments/${appointmentId}`,
            actionText: 'Xem chi tiết',
            relatedEntityId: appointmentId,
            relatedEntityType: 'appointment',
            createdBy: 'system'
        });
    }
}

export default NotificationHelpers;
