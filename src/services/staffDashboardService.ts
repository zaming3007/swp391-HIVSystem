import authApi from './authApi';
import appointmentApi from './appointmentApi';

// Types for Staff Dashboard
export interface StaffStats {
    todayAppointments: number;
    pendingConsultations: number;
    totalBlogPosts: number;
    activeUsers: number;
    appointmentGrowth?: number;
    consultationGrowth?: number;
}

export interface RecentAppointment {
    id: string;
    patientName: string;
    doctorName: string;
    time: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    service: string;
    appointmentDate: string;
}

export interface PendingConsultation {
    id: string;
    customerName: string;
    question: string;
    createdAt: string;
    priority: 'high' | 'medium' | 'low';
}

export interface RecentBlogPost {
    id: string;
    title: string;
    author: string;
    publishedAt: string;
    status: 'published' | 'draft';
    views: number;
}

export interface SystemActivity {
    id: string;
    type: 'appointment' | 'consultation' | 'blog' | 'user';
    description: string;
    timestamp: string;
    user: string;
}

const staffDashboardService = {
    // Get staff dashboard statistics
    getStaffStats: async (): Promise<StaffStats> => {

        try {
            let todayAppointments = 0;
            let pendingConsultations = 0;
            let totalBlogPosts = 0;
            let activeUsers = 0;

            // Get today's appointments
            try {
                const today = new Date().toISOString().split('T')[0];
                const appointmentsResponse = await appointmentApi.get(`/Appointment/by-date?date=${today}`);
                todayAppointments = appointmentsResponse.data.success ? appointmentsResponse.data.data.length : 0;
            } catch (error) {
                console.warn('Could not fetch appointments:', error);
                // Use mock data for demo
                todayAppointments = 12;
            }

            // Get pending consultations
            try {
                const consultationsResponse = await authApi.get('/Consultation/pending');
                pendingConsultations = Array.isArray(consultationsResponse.data) ? consultationsResponse.data.length : 0;
            } catch (error) {
                console.warn('Could not fetch consultations:', error);
                // Use mock data for demo
                pendingConsultations = 8;
            }

            // Get total blog posts
            try {
                const blogsResponse = await authApi.get('/Blog/all');
                totalBlogPosts = Array.isArray(blogsResponse.data) ? blogsResponse.data.length : 0;
            } catch (error) {
                console.warn('Could not fetch blogs:', error);
                // Use mock data for demo
                totalBlogPosts = 25;
            }

            // Get active users (fallback to mock since endpoint doesn't exist)
            try {
                // This endpoint doesn't exist yet, so we'll use mock data
                activeUsers = 156; // Mock data
            } catch (error) {
                console.warn('Could not fetch users:', error);
                // Use mock data for demo
                activeUsers = 156;
            }

            return {
                todayAppointments,
                pendingConsultations,
                totalBlogPosts,
                activeUsers,
                appointmentGrowth: 15.2, // Mock growth data
                consultationGrowth: 8.7  // Mock growth data
            };
        } catch (error) {
            console.error('Error fetching staff stats:', error);
            // Return mock data as fallback
            return {
                todayAppointments: 12,
                pendingConsultations: 8,
                totalBlogPosts: 25,
                activeUsers: 156,
                appointmentGrowth: 15.2,
                consultationGrowth: 8.7
            };
        }
    },

    // Get recent appointments
    getRecentAppointments: async (): Promise<RecentAppointment[]> => {
        try {
            // Try to get appointments from today first
            const today = new Date().toISOString().split('T')[0];
            const response = await appointmentApi.get(`/Appointment/by-date?date=${today}`);

            if (response.data && Array.isArray(response.data)) {
                return response.data.slice(0, 5).map((apt: any) => ({
                    id: apt.id,
                    patientName: apt.patientName || 'Khách hàng',
                    doctorName: apt.doctorName || 'Bác sĩ',
                    time: apt.timeSlot || apt.startTime || '09:00',
                    status: apt.status?.toLowerCase() || 'pending',
                    service: apt.serviceName || 'Tư vấn',
                    appointmentDate: apt.appointmentDate || apt.date
                }));
            }

            // If no appointments today, return empty array (real data)
            return [];
        } catch (error) {
            console.warn('Could not fetch recent appointments:', error);
            // Return empty array instead of mock data
            return [];
        }
    },

    // Get pending consultations
    getPendingConsultations: async (): Promise<PendingConsultation[]> => {
        try {
            const response = await authApi.get('/Consultation/pending');
            if (Array.isArray(response.data)) {
                return response.data.map((consultation: any) => ({
                    id: consultation.id,
                    customerName: consultation.patientName || 'Khách hàng ẩn danh',
                    question: consultation.question,
                    createdAt: consultation.createdAt,
                    priority: consultation.priority || 'medium'
                }));
            }
            // Return empty array if no pending consultations (real data)
            return [];
        } catch (error) {
            console.warn('Could not fetch pending consultations:', error);
            // Return empty array instead of mock data
            return [];
        }
    },

    // Get recent blog posts
    getRecentBlogPosts: async (): Promise<RecentBlogPost[]> => {
        try {
            const response = await authApi.get('/Blog/all');
            if (Array.isArray(response.data)) {
                return response.data.slice(0, 5).map((blog: any) => ({
                    id: blog.id,
                    title: blog.title,
                    author: blog.authorName || 'Staff',
                    publishedAt: blog.publishedAt || blog.createdAt,
                    status: blog.status === 1 ? 'published' : 'draft',
                    views: blog.viewCount || 0
                }));
            }
            return [];
        } catch (error) {
            console.warn('Could not fetch recent blog posts, using mock data:', error);
            // Return mock data as fallback
            return [
                {
                    id: '1',
                    title: 'Cập nhật mới nhất về điều trị HIV',
                    author: 'BS. Nguyễn Văn L',
                    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                    status: 'published',
                    views: 245
                },
                {
                    id: '2',
                    title: 'Hướng dẫn chăm sóc bệnh nhân HIV tại nhà',
                    author: 'BS. Trần Thị M',
                    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'published',
                    views: 189
                },
                {
                    id: '3',
                    title: 'Tầm quan trọng của việc tuân thủ điều trị',
                    author: 'BS. Lê Văn N',
                    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'draft',
                    views: 0
                }
            ];
        }
    },

    // Get system activities
    getSystemActivities: async (): Promise<SystemActivity[]> => {
        try {
            const activities: SystemActivity[] = [];

            try {
                // Get recent consultations (using answered consultations as recent activity)
                const consultationsResponse = await authApi.get('/Consultation/answered');
                if (Array.isArray(consultationsResponse.data)) {
                    consultationsResponse.data.slice(0, 5).forEach((consultation: any) => {
                        activities.push({
                            id: `cons-${consultation.id}`,
                            type: 'consultation',
                            description: `Câu hỏi tư vấn đã được trả lời: ${consultation.question.substring(0, 50)}...`,
                            timestamp: consultation.answeredAt || consultation.createdAt,
                            user: consultation.patientName || 'Khách hàng ẩn danh'
                        });
                    });
                }
            } catch (error) {
                console.warn('Could not fetch consultation activities');
            }

            try {
                // Get recent blog posts
                const blogsResponse = await authApi.get('/Blog/all');
                if (Array.isArray(blogsResponse.data)) {
                    blogsResponse.data.slice(0, 3).forEach((blog: any) => {
                        activities.push({
                            id: `blog-${blog.id}`,
                            type: 'blog',
                            description: `Bài viết: ${blog.title}`,
                            timestamp: blog.publishedAt || blog.createdAt,
                            user: blog.authorName || 'Staff'
                        });
                    });
                }
            } catch (error) {
                console.warn('Could not fetch blog activities');
            }

            // If no activities found, return mock data
            if (activities.length === 0) {
                return [
                    {
                        id: '1',
                        type: 'appointment',
                        description: 'Lịch hẹn mới được đặt với BS. Trần Thị B',
                        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                        user: 'Nguyễn Văn A'
                    },
                    {
                        id: '2',
                        type: 'consultation',
                        description: 'Câu hỏi tư vấn mới về xét nghiệm HIV',
                        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                        user: 'Nguyễn Thị H'
                    },
                    {
                        id: '3',
                        type: 'blog',
                        description: 'Bài viết mới được xuất bản: Cập nhật mới nhất về điều trị HIV',
                        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
                        user: 'BS. Nguyễn Văn L'
                    },
                    {
                        id: '4',
                        type: 'user',
                        description: 'Người dùng mới đăng ký',
                        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                        user: 'Hoàng Thị O'
                    }
                ];
            }

            // Sort by timestamp (newest first)
            return activities.sort((a, b) =>
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            ).slice(0, 10);

        } catch (error) {
            console.warn('Error fetching system activities, using mock data:', error);
            // Return mock data as fallback
            return [
                {
                    id: '1',
                    type: 'appointment',
                    description: 'Lịch hẹn mới được đặt với BS. Trần Thị B',
                    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
                    user: 'Nguyễn Văn A'
                },
                {
                    id: '2',
                    type: 'consultation',
                    description: 'Câu hỏi tư vấn mới về xét nghiệm HIV',
                    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                    user: 'Nguyễn Thị H'
                }
            ];
        }
    }
};

export default staffDashboardService;
