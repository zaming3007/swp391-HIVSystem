import { v4 as uuidv4 } from 'uuid';

// Thống kê tổng quan
export interface DashboardStats {
    totalPatients: number;
    newPatientsThisMonth: number;
    totalAppointments: number;
    completedAppointments: number;
    pendingConsultations: number;
    avgCD4Count: number;
    viralSuppressionRate: number; // Tỷ lệ bệnh nhân có tải lượng virus dưới ngưỡng phát hiện
}

// Dữ liệu theo dõi CD4 theo thời gian
export interface CD4TrendData {
    month: string;
    avgCD4: number;
    minCD4: number;
    maxCD4: number;
}

// Dữ liệu tải lượng virus theo thời gian
export interface ViralLoadTrendData {
    month: string;
    avgViralLoad: number;
    suppressionRate: number; // Tỷ lệ bệnh nhân có tải lượng virus dưới ngưỡng phát hiện
}

// Dữ liệu phân bố bệnh nhân theo tuổi
export interface AgeDistributionData {
    ageGroup: string;
    count: number;
    percentage: number;
}

// Dữ liệu phân bố bệnh nhân theo giới tính
export interface GenderDistributionData {
    gender: string;
    count: number;
    percentage: number;
}

// Dữ liệu hiệu quả điều trị
export interface TreatmentEffectivenessData {
    month: string;
    cd4Improvement: number; // Tỷ lệ bệnh nhân có CD4 tăng
    viralSuppression: number; // Tỷ lệ bệnh nhân có tải lượng virus dưới ngưỡng phát hiện
    adherenceRate: number; // Tỷ lệ tuân thủ điều trị
}

// Dữ liệu lịch hẹn theo tháng
export interface AppointmentTrendData {
    month: string;
    scheduled: number;
    completed: number;
    cancelled: number;
    noShow: number;
}

// Dữ liệu tư vấn trực tuyến
export interface ConsultationStatsData {
    month: string;
    newQuestions: number;
    answeredQuestions: number;
    avgResponseTime: number; // Thời gian phản hồi trung bình (giờ)
}

// Mock data cho thống kê tổng quan
export const MOCK_DASHBOARD_STATS: DashboardStats = {
    totalPatients: 1248,
    newPatientsThisMonth: 37,
    totalAppointments: 3562,
    completedAppointments: 3105,
    pendingConsultations: 18,
    avgCD4Count: 568,
    viralSuppressionRate: 0.83 // 83%
};

// Mock data cho CD4 theo thời gian
export const MOCK_CD4_TREND: CD4TrendData[] = [
    { month: '01/2023', avgCD4: 420, minCD4: 210, maxCD4: 780 },
    { month: '02/2023', avgCD4: 435, minCD4: 220, maxCD4: 790 },
    { month: '03/2023', avgCD4: 450, minCD4: 230, maxCD4: 800 },
    { month: '04/2023', avgCD4: 470, minCD4: 240, maxCD4: 820 },
    { month: '05/2023', avgCD4: 485, minCD4: 245, maxCD4: 830 },
    { month: '06/2023', avgCD4: 500, minCD4: 250, maxCD4: 850 },
    { month: '07/2023', avgCD4: 515, minCD4: 260, maxCD4: 870 },
    { month: '08/2023', avgCD4: 530, minCD4: 270, maxCD4: 890 },
    { month: '09/2023', avgCD4: 545, minCD4: 280, maxCD4: 910 },
    { month: '10/2023', avgCD4: 555, minCD4: 290, maxCD4: 920 },
    { month: '11/2023', avgCD4: 560, minCD4: 300, maxCD4: 930 },
    { month: '12/2023', avgCD4: 568, minCD4: 310, maxCD4: 950 }
];

// Mock data cho tải lượng virus theo thời gian
export const MOCK_VIRAL_LOAD_TREND: ViralLoadTrendData[] = [
    { month: '01/2023', avgViralLoad: 1200, suppressionRate: 0.65 },
    { month: '02/2023', avgViralLoad: 1100, suppressionRate: 0.67 },
    { month: '03/2023', avgViralLoad: 950, suppressionRate: 0.70 },
    { month: '04/2023', avgViralLoad: 800, suppressionRate: 0.72 },
    { month: '05/2023', avgViralLoad: 650, suppressionRate: 0.74 },
    { month: '06/2023', avgViralLoad: 500, suppressionRate: 0.76 },
    { month: '07/2023', avgViralLoad: 350, suppressionRate: 0.78 },
    { month: '08/2023', avgViralLoad: 200, suppressionRate: 0.80 },
    { month: '09/2023', avgViralLoad: 150, suppressionRate: 0.81 },
    { month: '10/2023', avgViralLoad: 100, suppressionRate: 0.82 },
    { month: '11/2023', avgViralLoad: 75, suppressionRate: 0.82 },
    { month: '12/2023', avgViralLoad: 50, suppressionRate: 0.83 }
];

// Mock data cho phân bố bệnh nhân theo tuổi
export const MOCK_AGE_DISTRIBUTION: AgeDistributionData[] = [
    { ageGroup: '18-24', count: 187, percentage: 0.15 },
    { ageGroup: '25-34', count: 374, percentage: 0.30 },
    { ageGroup: '35-44', count: 312, percentage: 0.25 },
    { ageGroup: '45-54', count: 250, percentage: 0.20 },
    { ageGroup: '55-64', count: 87, percentage: 0.07 },
    { ageGroup: '65+', count: 38, percentage: 0.03 }
];

// Mock data cho phân bố bệnh nhân theo giới tính
export const MOCK_GENDER_DISTRIBUTION: GenderDistributionData[] = [
    { gender: 'Nam', count: 749, percentage: 0.60 },
    { gender: 'Nữ', count: 474, percentage: 0.38 },
    { gender: 'Khác', count: 25, percentage: 0.02 }
];

// Mock data cho hiệu quả điều trị
export const MOCK_TREATMENT_EFFECTIVENESS: TreatmentEffectivenessData[] = [
    { month: '01/2023', cd4Improvement: 0.70, viralSuppression: 0.65, adherenceRate: 0.85 },
    { month: '02/2023', cd4Improvement: 0.71, viralSuppression: 0.67, adherenceRate: 0.85 },
    { month: '03/2023', cd4Improvement: 0.72, viralSuppression: 0.70, adherenceRate: 0.86 },
    { month: '04/2023', cd4Improvement: 0.73, viralSuppression: 0.72, adherenceRate: 0.86 },
    { month: '05/2023', cd4Improvement: 0.74, viralSuppression: 0.74, adherenceRate: 0.87 },
    { month: '06/2023', cd4Improvement: 0.75, viralSuppression: 0.76, adherenceRate: 0.87 },
    { month: '07/2023', cd4Improvement: 0.76, viralSuppression: 0.78, adherenceRate: 0.88 },
    { month: '08/2023', cd4Improvement: 0.77, viralSuppression: 0.80, adherenceRate: 0.88 },
    { month: '09/2023', cd4Improvement: 0.78, viralSuppression: 0.81, adherenceRate: 0.89 },
    { month: '10/2023', cd4Improvement: 0.79, viralSuppression: 0.82, adherenceRate: 0.89 },
    { month: '11/2023', cd4Improvement: 0.80, viralSuppression: 0.82, adherenceRate: 0.90 },
    { month: '12/2023', cd4Improvement: 0.81, viralSuppression: 0.83, adherenceRate: 0.90 }
];

// Mock data cho lịch hẹn theo tháng
export const MOCK_APPOINTMENT_TREND: AppointmentTrendData[] = [
    { month: '01/2023', scheduled: 280, completed: 240, cancelled: 25, noShow: 15 },
    { month: '02/2023', scheduled: 285, completed: 245, cancelled: 25, noShow: 15 },
    { month: '03/2023', scheduled: 290, completed: 250, cancelled: 25, noShow: 15 },
    { month: '04/2023', scheduled: 295, completed: 255, cancelled: 25, noShow: 15 },
    { month: '05/2023', scheduled: 300, completed: 260, cancelled: 25, noShow: 15 },
    { month: '06/2023', scheduled: 305, completed: 265, cancelled: 25, noShow: 15 },
    { month: '07/2023', scheduled: 310, completed: 270, cancelled: 25, noShow: 15 },
    { month: '08/2023', scheduled: 315, completed: 275, cancelled: 25, noShow: 15 },
    { month: '09/2023', scheduled: 320, completed: 280, cancelled: 25, noShow: 15 },
    { month: '10/2023', scheduled: 325, completed: 285, cancelled: 25, noShow: 15 },
    { month: '11/2023', scheduled: 330, completed: 290, cancelled: 25, noShow: 15 },
    { month: '12/2023', scheduled: 335, completed: 295, cancelled: 25, noShow: 15 }
];

// Mock data cho tư vấn trực tuyến
export const MOCK_CONSULTATION_STATS: ConsultationStatsData[] = [
    { month: '01/2023', newQuestions: 45, answeredQuestions: 42, avgResponseTime: 24 },
    { month: '02/2023', newQuestions: 48, answeredQuestions: 45, avgResponseTime: 23 },
    { month: '03/2023', newQuestions: 52, answeredQuestions: 49, avgResponseTime: 22 },
    { month: '04/2023', newQuestions: 55, answeredQuestions: 52, avgResponseTime: 21 },
    { month: '05/2023', newQuestions: 58, answeredQuestions: 55, avgResponseTime: 20 },
    { month: '06/2023', newQuestions: 62, answeredQuestions: 59, avgResponseTime: 19 },
    { month: '07/2023', newQuestions: 65, answeredQuestions: 62, avgResponseTime: 18 },
    { month: '08/2023', newQuestions: 68, answeredQuestions: 65, avgResponseTime: 17 },
    { month: '09/2023', newQuestions: 72, answeredQuestions: 69, avgResponseTime: 16 },
    { month: '10/2023', newQuestions: 75, answeredQuestions: 72, avgResponseTime: 15 },
    { month: '11/2023', newQuestions: 78, answeredQuestions: 75, avgResponseTime: 14 },
    { month: '12/2023', newQuestions: 82, answeredQuestions: 79, avgResponseTime: 12 }
];

// Hàm lấy thống kê tổng quan
export const getDashboardStats = async (): Promise<DashboardStats> => {
    // Giả lập delay mạng
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_DASHBOARD_STATS;
};

// Hàm lấy dữ liệu CD4 theo thời gian
export const getCD4Trend = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<CD4TrendData[]> => {
    // Giả lập delay mạng
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_CD4_TREND;
};

// Hàm lấy dữ liệu tải lượng virus theo thời gian
export const getViralLoadTrend = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<ViralLoadTrendData[]> => {
    // Giả lập delay mạng
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_VIRAL_LOAD_TREND;
};

// Hàm lấy dữ liệu phân bố bệnh nhân theo tuổi
export const getAgeDistribution = async (): Promise<AgeDistributionData[]> => {
    // Giả lập delay mạng
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_AGE_DISTRIBUTION;
};

// Hàm lấy dữ liệu phân bố bệnh nhân theo giới tính
export const getGenderDistribution = async (): Promise<GenderDistributionData[]> => {
    // Giả lập delay mạng
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_GENDER_DISTRIBUTION;
};

// Hàm lấy dữ liệu hiệu quả điều trị
export const getTreatmentEffectiveness = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<TreatmentEffectivenessData[]> => {
    // Giả lập delay mạng
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_TREATMENT_EFFECTIVENESS;
};

// Hàm lấy dữ liệu lịch hẹn theo tháng
export const getAppointmentTrend = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<AppointmentTrendData[]> => {
    // Giả lập delay mạng
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_APPOINTMENT_TREND;
};

// Hàm lấy dữ liệu tư vấn trực tuyến
export const getConsultationStats = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<ConsultationStatsData[]> => {
    // Giả lập delay mạng
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_CONSULTATION_STATS;
}; 