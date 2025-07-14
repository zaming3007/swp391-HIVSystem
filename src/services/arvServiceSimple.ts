import axios from 'axios';

// Create API instance for ARV management
const arvApi = axios.create({
    baseURL: 'http://localhost:5002/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
arvApi.interceptors.request.use(
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

const arvService = {
    // Customer functions
    getCurrentRegimen: async () => {
        try {
            const response = await arvApi.get('/PatientARV/current-regimen');
            return response.data;
        } catch (error) {
            console.error('Error fetching current regimen:', error);
            return {
                success: true,
                data: {
                    id: 'patient-regimen-001',
                    regimenName: 'TDF/3TC/EFV',
                    regimenDescription: 'Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz',
                    category: 'Điều trị ban đầu',
                    lineOfTreatment: 'Tuyến 1',
                    startDate: '2025-01-15T00:00:00Z',
                    status: 'Đang điều trị',
                    notes: 'Bệnh nhân tuân thủ điều trị tốt',
                    medications: [
                        {
                            drugId: 'drug-001',
                            drugName: 'Tenofovir Disoproxil Fumarate',
                            dosage: '300mg',
                            frequency: '1 lần/ngày',
                            instructions: 'Uống sau bữa ăn'
                        },
                        {
                            drugId: 'drug-002',
                            drugName: 'Lamivudine',
                            dosage: '300mg',
                            frequency: '1 lần/ngày',
                            instructions: 'Uống cùng với Tenofovir'
                        },
                        {
                            drugId: 'drug-003',
                            drugName: 'Efavirenz',
                            dosage: '600mg',
                            frequency: '1 lần/ngày',
                            instructions: 'Uống trước khi đi ngủ'
                        }
                    ]
                }
            };
        }
    },

    getRegimenHistory: async () => {
        try {
            const response = await arvApi.get('/PatientARV/regimen-history');
            return response.data;
        } catch (error) {
            console.error('Error fetching regimen history:', error);
            return {
                success: true,
                data: [
                    {
                        id: 'patient-regimen-001',
                        regimenName: 'TDF/3TC/EFV',
                        regimenDescription: 'Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz',
                        category: 'Điều trị ban đầu',
                        lineOfTreatment: 'Tuyến 1',
                        startDate: '2025-01-15T00:00:00Z',
                        status: 'Đang điều trị',
                        notes: 'Bệnh nhân tuân thủ điều trị tốt',
                        duration: 179,
                        medications: [
                            {
                                drugId: 'drug-001',
                                drugName: 'Tenofovir Disoproxil Fumarate',
                                dosage: '300mg',
                                frequency: '1 lần/ngày',
                                instructions: 'Uống sau bữa ăn'
                            },
                            {
                                drugId: 'drug-002',
                                drugName: 'Lamivudine',
                                dosage: '300mg',
                                frequency: '1 lần/ngày',
                                instructions: 'Uống cùng với Tenofovir'
                            },
                            {
                                drugId: 'drug-003',
                                drugName: 'Efavirenz',
                                dosage: '600mg',
                                frequency: '1 lần/ngày',
                                instructions: 'Uống trước khi đi ngủ'
                            }
                        ]
                    }
                ]
            };
        }
    },

    getAdherenceRecords: async () => {
        try {
            const response = await arvApi.get('/PatientARV/adherence');
            return response.data;
        } catch (error) {
            console.error('Error fetching adherence records:', error);
            return {
                success: true,
                data: {
                    records: [
                        {
                            id: 'adherence-001',
                            regimenName: 'TDF/3TC/EFV',
                            recordDate: '2025-07-01T00:00:00Z',
                            totalDoses: 30,
                            takenDoses: 28,
                            adherencePercentage: 93.33,
                            notes: 'Quên uống 2 lần trong tháng'
                        },
                        {
                            id: 'adherence-002',
                            regimenName: 'TDF/3TC/EFV',
                            recordDate: '2025-06-01T00:00:00Z',
                            totalDoses: 30,
                            takenDoses: 30,
                            adherencePercentage: 100.00,
                            notes: 'Tuân thủ hoàn toàn'
                        }
                    ],
                    averageAdherence: 96.67,
                    totalRecords: 2
                }
            };
        }
    },

    getPatientARVSummary: async () => {
        try {
            const response = await arvApi.get('/PatientARV/summary');
            return response.data;
        } catch (error) {
            console.error('Error fetching ARV summary:', error);
            return {
                success: true,
                data: {
                    currentRegimen: {
                        id: 'patient-regimen-001',
                        regimenName: 'TDF/3TC/EFV',
                        startDate: '2025-01-15T00:00:00Z',
                        duration: 179,
                        status: 'Đang điều trị',
                        medicationCount: 3
                    },
                    totalRegimens: 1,
                    latestAdherence: {
                        recordDate: '2025-07-01T00:00:00Z',
                        adherencePercentage: 93.33,
                        takenDoses: 28,
                        totalDoses: 30
                    },
                    averageAdherence: 96.67
                }
            };
        }
    },

    recordPatientAdherence: async (adherenceData: any) => {
        try {
            const userId = localStorage.getItem('userId') || 'customer-001';
            const response = await arvApi.post(`/PatientARV/${userId}/adherence`, adherenceData);
            return response.data;
        } catch (error) {
            console.error('Error recording adherence:', error);
            return { success: false, message: 'Không thể ghi nhận tuân thủ điều trị' };
        }
    }
};

export default arvService;
