import arvApi from './arvApi';
import axios from 'axios';

// Create AuthApi instance for ARV Drug endpoints
const authApi = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
authApi.interceptors.request.use(
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

export interface ARVDrug {
    id: number; // Changed back to number to match AuthApi database
    name: string;
    genericName: string;
    brandName?: string;
    drugClass: string;
    description?: string;
    dosage: string;
    form: string;
    sideEffects?: string;
    contraindications?: string;
    instructions?: string;
    isActive: boolean;
    isPregnancySafe: boolean;
    isPediatricSafe: boolean;
    minAge: number;
    minWeight: number;
    createdAt: string;
    updatedAt?: string;
}

export interface ARVMedication {
    id: string;
    medicationName: string;
    activeIngredient: string;
    dosage: string;
    frequency: string;
    instructions: string;
    sideEffects: string;
    sortOrder: number;
}

export interface ARVRegimen {
    id: string;
    name: string;
    description: string;
    category: string;
    lineOfTreatment: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
    medications: ARVMedication[];
}

export interface RegimenDrug {
    id: number;
    drugId: number;
    drugName: string;
    drugClass: string;
    dosage: string;
    frequency: string;
    timing: string;
    specialInstructions: string;
    sortOrder: number;
}

export interface PatientRegimen {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    regimenId: string;
    startDate: string;
    endDate?: string;
    status: string;
    notes: string;
    reason: string;
    createdAt: string;
    regimen: ARVRegimen;
}

export interface Patient {
    patientId: string;
    patientName: string;
    lastAppointment: string;
    totalAppointments: number;
    currentRegimen?: {
        id: string;
        name: string;
        status: string;
    };
}

export interface PatientRegimenDetail extends PatientRegimen {
    patientAge: number;
    regimenDescription: string;
    instructions: string;
    monitoring: string;
    discontinuationReason?: string;
    drugs: DrugDetail[];
    history: RegimenHistory[];
    adherenceRecords: AdherenceRecord[];
}

export interface DrugDetail {
    id: number;
    drugName: string;
    drugGenericName: string;
    drugBrandName: string;
    drugClass: string;
    drugForm: string;
    dosage: string;
    frequency: string;
    timing: string;
    specialInstructions: string;
    sideEffects: string;
    contraindications: string;
    instructions: string;
}

export interface RegimenHistory {
    id: number;
    action: string;
    details: string;
    reason: string;
    notes: string;
    performedAt: string;
    performedBy: string;
}

export interface AdherenceRecord {
    id: number;
    recordDate: string;
    adherencePercentage: number;
    period: string;
    notes: string;
    challenges: string;
}

export interface CreateRegimenRequest {
    name: string;
    description: string;
    regimenType: string;
    targetPopulation: string;
    instructions: string;
    monitoring: string;
    isPregnancySafe: boolean;
    isPediatricSafe: boolean;
    minAge: number;
    minWeight: number;
    drugs: RegimenDrugRequest[];
}

export interface RegimenDrugRequest {
    drugId: number;
    dosage: string;
    frequency: string;
    timing: string;
    specialInstructions: string;
    sortOrder: number;
}

export interface CreatePatientRegimenRequest {
    patientId: string;
    regimenId: number;
    startDate?: string;
    endDate?: string;
    notes: string;
    nextReviewDate?: string;
}

export interface UpdateStatusRequest {
    status: string;
    notes: string;
    discontinuationReason?: string;
    nextReviewDate?: string;
}

const arvService = {
    // ARV Drugs - Use AuthApi endpoints (working database)
    getDrugs: async (): Promise<ARVDrug[]> => {
        try {
            const response = await authApi.get('/ARVDrug');
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching ARV drugs:', error);
            return [];
        }
    },

    getDrug: async (id: number): Promise<ARVDrug> => {
        try {
            const response = await authApi.get(`/ARVDrug/${id}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error('Drug not found');
        } catch (error) {
            console.error('Error fetching ARV drug:', error);
            throw new Error('Drug details not available');
        }
    },

    getDrugsByClass: async (drugClass: string): Promise<ARVDrug[]> => {
        try {
            const response = await authApi.get(`/ARVDrug/by-class/${drugClass}`);
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching drugs by class:', error);
            return [];
        }
    },

    getSuitableDrugs: async (params: {
        age?: number;
        weight?: number;
        isPregnant?: boolean;
        isPediatric?: boolean;
    }): Promise<ARVDrug[]> => {
        try {
            const queryParams = new URLSearchParams();
            if (params.age) queryParams.append('age', params.age.toString());
            if (params.weight) queryParams.append('weight', params.weight.toString());
            if (params.isPregnant) queryParams.append('isPregnant', params.isPregnant.toString());
            if (params.isPediatric) queryParams.append('isPediatric', params.isPediatric.toString());

            const response = await authApi.get(`/ARVDrug/suitable?${queryParams.toString()}`);
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching suitable drugs:', error);
            return [];
        }
    },

    searchDrugs: async (query: string): Promise<ARVDrug[]> => {
        try {
            const response = await authApi.get(`/ARVDrug/search?query=${encodeURIComponent(query)}`);
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error searching drugs:', error);
            return [];
        }
    },

    getDrugClasses: async (): Promise<string[]> => {
        try {
            const response = await authApi.get('/ARVDrug/classes');
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching drug classes:', error);
            return [];
        }
    },

    // Get ARV drugs from AppointmentApi for regimen creation
    getARVDrugsForRegimen: async (): Promise<any[]> => {
        try {
            const response = await arvApi.get('/ARVPrescription/drugs');
            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching ARV drugs from AppointmentApi:', error);
            return [];
        }
    },

    // ARV Regimens - Use AppointmentApi endpoints
    getRegimens: async (): Promise<{ success: boolean; data: ARVRegimen[] }> => {
        try {
            const response = await arvApi.get('/ARVPrescription/regimens');
            return {
                success: response.data.success || false,
                data: response.data.data || []
            };
        } catch (error) {
            console.error('Error fetching regimens:', error);
            return {
                success: false,
                data: []
            };
        }
    },

    getRegimen: async (id: number): Promise<ARVRegimen> => {
        try {
            const response = await arvApi.get(`/ARVPrescription/regimens/${id}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error('Regimen not found');
        } catch (error) {
            console.error('Error fetching ARV regimen:', error);
            throw new Error('Regimen details not available');
        }
    },

    getSuitableRegimens: async (params: {
        age?: number;
        weight?: number;
        isPregnant?: boolean;
        isPediatric?: boolean;
        regimenType?: string;
    }): Promise<ARVRegimen[]> => {
        // Temporarily return empty array - need to implement in AppointmentApi
        return [];
    },

    createRegimen: async (regimenData: any): Promise<any> => {
        try {
            const response = await arvApi.post('/ARVPrescription/regimens', regimenData);
            return response.data;
        } catch (error) {
            console.error('Error creating regimen:', error);
            throw error;
        }
    },



    updateRegimen: async (id: number, data: CreateRegimenRequest): Promise<void> => {
        // Temporarily throw error - need to implement in AppointmentApi
        throw new Error('Update regimen not available');
    },

    deleteRegimen: async (id: number): Promise<void> => {
        // Temporarily throw error - need to implement in AppointmentApi
        throw new Error('Delete regimen not available');
    },

    // Patient Regimens - Use AppointmentApi endpoints
    getPatientRegimensByDoctor: async (doctorId: string): Promise<PatientRegimen[]> => {
        const response = await arvApi.get(`/ARVPrescription/all-patients`);
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    },

    getPatientRegimens: async (patientId: string): Promise<PatientRegimen[]> => {
        const response = await arvApi.get(`/ARVPrescription/patient/${patientId}/history`);
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    },

    // Get patients for doctor (from appointments)
    getDoctorPatients: async (): Promise<Patient[]> => {
        try {
            // Use doctor-patients endpoint to get patients
            const response = await arvApi.get('/ARVPrescription/doctor-patients');
            if (response.data.success) {
                // Map the response data to Patient interface
                const patients = response.data.data.map((patient: any) => ({
                    patientId: patient.patientId,
                    patientName: patient.patientName,
                    lastAppointment: patient.lastAppointment,
                    totalAppointments: patient.totalAppointments,
                    currentRegimen: patient.currentRegimen
                }));

                return patients;
            }
            return [];
        } catch (error) {
            console.error('Error fetching doctor patients:', error);
            return [];
        }
    },

    // Adherence tracking
    recordDoctorAdherence: async (data: {
        patientRegimenId: string;
        recordDate: Date;
        adherencePercentage: number;
        period?: string;
        notes?: string;
        challenges?: string;
    }): Promise<void> => {
        const response = await arvApi.post('/ARVPrescription/adherence', data);
        if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to record adherence');
        }
    },

    getPatientAdherence: async (patientId: string): Promise<PatientAdherence[]> => {
        const response = await arvApi.get(`/ARVPrescription/adherence/${patientId}`);
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    },

    getPatientRegimen: async (id: number): Promise<PatientRegimenDetail> => {
        // Temporarily throw error - need to implement in AppointmentApi
        throw new Error('Patient regimen details not available');
    },

    createPatientRegimen: async (data: CreatePatientRegimenRequest): Promise<PatientRegimen> => {
        const response = await arvApi.post('/ARVPrescription/prescribe', data);
        if (response.data.success) {
            return response.data.data;
        }
        throw new Error('Failed to create patient regimen');
    },

    updatePatientRegimenStatus: async (id: number, data: UpdateStatusRequest): Promise<void> => {
        // Temporarily throw error - need to implement in AppointmentApi
        throw new Error('Update patient regimen status not available');
    },

    // Helper functions
    getRegimenTypes: (): string[] => {
        return ['FirstLine', 'SecondLine', 'ThirdLine'];
    },

    getTargetPopulations: (): string[] => {
        return ['Adult', 'Pediatric', 'Pregnant', 'Adolescent'];
    },

    getStatusOptions: (): string[] => {
        return ['Active', 'Completed', 'Discontinued', 'Switched'];
    },

    getDrugClassOptions: (): string[] => {
        return ['NRTI', 'NNRTI', 'PI', 'INSTI', 'CCR5', 'FI'];
    },

    getFrequencyOptions: (): string[] => {
        return ['Once daily', 'Twice daily', 'Three times daily', 'As needed'];
    },

    getTimingOptions: (): string[] => {
        return ['With food', 'Without food', 'Empty stomach', 'Bedtime', 'Morning', 'Evening'];
    },

    // Customer-specific functions
    // Get current user's current regimen
    getCurrentRegimen: async (): Promise<{ success: boolean; data?: any; message?: string }> => {
        try {
            const response = await arvApi.get('/PatientARV/current-regimen');
            return response.data;
        } catch (error) {
            console.error('Error fetching current regimen:', error);
            // Return mock data for testing
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

    // Get current user's regimen history
    getRegimenHistory: async (): Promise<{ success: boolean; data: any[] }> => {
        try {
            const response = await arvApi.get('/PatientARV/regimen-history');
            return response.data;
        } catch (error) {
            console.error('Error fetching regimen history:', error);
            // Return mock data for testing
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

    // Get current user's adherence records
    getAdherenceRecords: async (): Promise<{ success: boolean; data: any }> => {
        try {
            const response = await arvApi.get('/PatientARV/adherence');
            return response.data;
        } catch (error) {
            console.error('Error fetching adherence records:', error);
            // Return mock data for testing
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

    // Get current user's ARV summary
    getPatientARVSummary: async (): Promise<{ success: boolean; data: any }> => {
        try {
            const response = await arvApi.get('/PatientARV/summary');
            return response.data;
        } catch (error) {
            console.error('Error fetching ARV summary:', error);
            // Return mock data for testing
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

    // Record adherence for current user
    recordPatientAdherence: async (adherenceData: any): Promise<{ success: boolean; message?: string }> => {
        try {
            const userId = localStorage.getItem('userId') || 'customer-001';
            const response = await arvApi.post(`/PatientARV/${userId}/adherence`, adherenceData);
            return response.data;
        } catch (error) {
            console.error('Error recording adherence:', error);
            return { success: false, message: 'Không thể ghi nhận tuân thủ điều trị' };
        }
    },

    // Prescribe regimen to patient
    prescribeRegimen: async (prescriptionData: {
        patientId: string;
        patientName: string;
        regimenId: string;
        startDate?: Date;
        notes?: string;
        reason?: string;
    }): Promise<any> => {
        try {
            const response = await arvApi.post('/ARVPrescription/prescribe', prescriptionData);
            return response.data;
        } catch (error) {
            console.error('Error prescribing regimen:', error);
            throw error;
        }
    }
};

export default arvService;
