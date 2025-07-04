import {
    getDashboardStats,
    getCD4Trend,
    getViralLoadTrend,
    getAgeDistribution,
    getGenderDistribution,
    getTreatmentEffectiveness,
    getAppointmentTrend,
    getConsultationStats,
    DashboardStats,
    CD4TrendData,
    ViralLoadTrendData,
    AgeDistributionData,
    GenderDistributionData,
    TreatmentEffectivenessData,
    AppointmentTrendData,
    ConsultationStatsData
} from './mockData/dashboardMockData';

// Cờ để quyết định sử dụng mockData hay API thật
const USE_MOCK_DATA = true;

// Hàm lấy thống kê tổng quan
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    if (USE_MOCK_DATA) {
        return getDashboardStats();
    }

    // Trong tương lai sẽ gọi API thật
    throw new Error('API chưa được triển khai');
};

// Hàm lấy dữ liệu CD4 theo thời gian
export const fetchCD4Trend = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<CD4TrendData[]> => {
    if (USE_MOCK_DATA) {
        return getCD4Trend(period);
    }

    // Trong tương lai sẽ gọi API thật
    throw new Error('API chưa được triển khai');
};

// Hàm lấy dữ liệu tải lượng virus theo thời gian
export const fetchViralLoadTrend = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<ViralLoadTrendData[]> => {
    if (USE_MOCK_DATA) {
        return getViralLoadTrend(period);
    }

    // Trong tương lai sẽ gọi API thật
    throw new Error('API chưa được triển khai');
};

// Hàm lấy dữ liệu phân bố bệnh nhân theo tuổi
export const fetchAgeDistribution = async (): Promise<AgeDistributionData[]> => {
    if (USE_MOCK_DATA) {
        return getAgeDistribution();
    }

    // Trong tương lai sẽ gọi API thật
    throw new Error('API chưa được triển khai');
};

// Hàm lấy dữ liệu phân bố bệnh nhân theo giới tính
export const fetchGenderDistribution = async (): Promise<GenderDistributionData[]> => {
    if (USE_MOCK_DATA) {
        return getGenderDistribution();
    }

    // Trong tương lai sẽ gọi API thật
    throw new Error('API chưa được triển khai');
};

// Hàm lấy dữ liệu hiệu quả điều trị
export const fetchTreatmentEffectiveness = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<TreatmentEffectivenessData[]> => {
    if (USE_MOCK_DATA) {
        return getTreatmentEffectiveness(period);
    }

    // Trong tương lai sẽ gọi API thật
    throw new Error('API chưa được triển khai');
};

// Hàm lấy dữ liệu lịch hẹn theo tháng
export const fetchAppointmentTrend = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<AppointmentTrendData[]> => {
    if (USE_MOCK_DATA) {
        return getAppointmentTrend(period);
    }

    // Trong tương lai sẽ gọi API thật
    throw new Error('API chưa được triển khai');
};

// Hàm lấy dữ liệu tư vấn trực tuyến
export const fetchConsultationStats = async (period: 'month' | 'quarter' | 'year' = 'month'): Promise<ConsultationStatsData[]> => {
    if (USE_MOCK_DATA) {
        return getConsultationStats(period);
    }

    // Trong tương lai sẽ gọi API thật
    throw new Error('API chưa được triển khai');
};

// Export compatibility object
export const dashboardService = {
    fetchDashboardStats,
    fetchCD4Trend,
    fetchViralLoadTrend,
    fetchAgeDistribution,
    fetchGenderDistribution,
    fetchTreatmentEffectiveness,
    fetchAppointmentTrend,
    fetchConsultationStats
}; 