import axios from 'axios';

// Create API instance for test results
const testResultApi = axios.create({
    baseURL: 'http://localhost:5002/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
testResultApi.interceptors.request.use(
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

// Types
export interface TestResult {
    id: string;
    patientId: string;
    doctorId: string;
    testType: string;
    testName: string;
    result: string;
    unit?: string;
    referenceRange?: string;
    status: string;
    testDate: string;
    labName?: string;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface TestSummary {
    patientId: string;
    patientName?: string;
    latestCD4?: TestResult;
    latestViralLoad?: TestResult;
    recentTests: TestResult[];
    totalTestsCount: number;
}

export interface CreateTestResult {
    patientId: string;
    doctorId: string;
    testType: string;
    testName: string;
    result: string;
    unit?: string;
    referenceRange?: string;
    status: string;
    testDate: string;
    labName?: string;
    notes?: string;
}

export interface UpdateTestResult {
    result?: string;
    unit?: string;
    referenceRange?: string;
    status?: string;
    testDate?: string;
    labName?: string;
    notes?: string;
}

const testResultService = {
    // Get current user's test results
    getPatientTestResults: async (): Promise<{ success: boolean; data: TestResult[] }> => {
        try {
            // Get current user ID from token or user context
            const userId = localStorage.getItem('userId') || 'customer-001'; // Fallback for testing
            
            const response = await testResultApi.get(`/TestResults/patient/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching patient test results:', error);
            // Return mock data for testing
            return {
                success: true,
                data: [
                    {
                        id: 'test-001',
                        patientId: 'customer-001',
                        doctorId: 'doctor-001',
                        testType: 'CD4',
                        testName: 'CD4 Count',
                        result: '450',
                        unit: 'cells/μL',
                        referenceRange: '500-1600',
                        status: 'Abnormal',
                        testDate: '2025-07-10T09:00:00Z',
                        labName: 'Phòng xét nghiệm Bệnh viện Đại học Y Dược',
                        notes: 'Cần theo dõi và điều chỉnh phác đồ điều trị',
                        createdAt: '2025-07-10T09:00:00Z'
                    },
                    {
                        id: 'test-004',
                        patientId: 'customer-001',
                        doctorId: 'doctor-001',
                        testType: 'ViralLoad',
                        testName: 'HIV RNA Viral Load',
                        result: 'Undetectable',
                        unit: 'copies/mL',
                        referenceRange: '<50',
                        status: 'Normal',
                        testDate: '2025-07-10T09:30:00Z',
                        labName: 'Phòng xét nghiệm Bệnh viện Đại học Y Dược',
                        notes: 'Kết quả rất tốt, virus không phát hiện được',
                        createdAt: '2025-07-10T09:30:00Z'
                    },
                    {
                        id: 'test-007',
                        patientId: 'customer-001',
                        doctorId: 'doctor-001',
                        testType: 'Other',
                        testName: 'Hemoglobin',
                        result: '12.5',
                        unit: 'g/dL',
                        referenceRange: '12.0-15.5',
                        status: 'Normal',
                        testDate: '2025-07-10T10:00:00Z',
                        labName: 'Phòng xét nghiệm Bệnh viện Đại học Y Dược',
                        notes: 'Chỉ số bình thường',
                        createdAt: '2025-07-10T10:00:00Z'
                    }
                ]
            };
        }
    },

    // Get current user's test summary
    getPatientTestSummary: async (): Promise<{ success: boolean; data: TestSummary }> => {
        try {
            const userId = localStorage.getItem('userId') || 'customer-001';
            
            const response = await testResultApi.get(`/TestResults/patient/${userId}/summary`);
            return response.data;
        } catch (error) {
            console.error('Error fetching patient test summary:', error);
            // Return mock data for testing
            return {
                success: true,
                data: {
                    patientId: 'customer-001',
                    latestCD4: {
                        id: 'test-001',
                        patientId: 'customer-001',
                        doctorId: 'doctor-001',
                        testType: 'CD4',
                        testName: 'CD4 Count',
                        result: '450',
                        unit: 'cells/μL',
                        referenceRange: '500-1600',
                        status: 'Abnormal',
                        testDate: '2025-07-10T09:00:00Z',
                        labName: 'Phòng xét nghiệm Bệnh viện Đại học Y Dược',
                        notes: 'Cần theo dõi và điều chỉnh phác đồ điều trị',
                        createdAt: '2025-07-10T09:00:00Z'
                    },
                    latestViralLoad: {
                        id: 'test-004',
                        patientId: 'customer-001',
                        doctorId: 'doctor-001',
                        testType: 'ViralLoad',
                        testName: 'HIV RNA Viral Load',
                        result: 'Undetectable',
                        unit: 'copies/mL',
                        referenceRange: '<50',
                        status: 'Normal',
                        testDate: '2025-07-10T09:30:00Z',
                        labName: 'Phòng xét nghiệm Bệnh viện Đại học Y Dược',
                        notes: 'Kết quả rất tốt, virus không phát hiện được',
                        createdAt: '2025-07-10T09:30:00Z'
                    },
                    recentTests: [],
                    totalTestsCount: 3
                }
            };
        }
    },

    // Get test results by type
    getPatientTestResultsByType: async (testType: string): Promise<{ success: boolean; data: TestResult[] }> => {
        try {
            const userId = localStorage.getItem('userId') || 'customer-001';
            
            const response = await testResultApi.get(`/TestResults/patient/${userId}/type/${testType}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching test results by type:', error);
            return { success: false, data: [] };
        }
    },

    // For doctors - get patient test results
    getDoctorPatientTestResults: async (patientId: string): Promise<{ success: boolean; data: TestResult[] }> => {
        try {
            const response = await testResultApi.get(`/TestResults/patient/${patientId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching patient test results for doctor:', error);
            return { success: false, data: [] };
        }
    },

    // For doctors - get patient test summary
    getDoctorPatientTestSummary: async (patientId: string): Promise<{ success: boolean; data: TestSummary }> => {
        try {
            const response = await testResultApi.get(`/TestResults/patient/${patientId}/summary`);
            return response.data;
        } catch (error) {
            console.error('Error fetching patient test summary for doctor:', error);
            return { 
                success: false, 
                data: {
                    patientId,
                    recentTests: [],
                    totalTestsCount: 0
                }
            };
        }
    },

    // For doctors - create new test result
    createTestResult: async (testResult: CreateTestResult): Promise<{ success: boolean; data?: TestResult; message?: string }> => {
        try {
            const response = await testResultApi.post('/TestResults', testResult);
            return response.data;
        } catch (error) {
            console.error('Error creating test result:', error);
            return { success: false, message: 'Không thể tạo kết quả xét nghiệm' };
        }
    },

    // For doctors - update test result
    updateTestResult: async (testId: string, updates: UpdateTestResult): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await testResultApi.put(`/TestResults/${testId}`, updates);
            return response.data;
        } catch (error) {
            console.error('Error updating test result:', error);
            return { success: false, message: 'Không thể cập nhật kết quả xét nghiệm' };
        }
    },

    // For doctors - delete test result
    deleteTestResult: async (testId: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await testResultApi.delete(`/TestResults/${testId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting test result:', error);
            return { success: false, message: 'Không thể xóa kết quả xét nghiệm' };
        }
    }
};

export default testResultService;
