import api from './api';

export interface ARVDrug {
    id: number;
    name: string;
    genericName: string;
    brandName: string;
    drugClass: string;
    description: string;
    dosage: string;
    form: string;
    sideEffects: string;
    contraindications: string;
    instructions: string;
    isActive: boolean;
    isPregnancySafe: boolean;
    isPediatricSafe: boolean;
    minAge: number;
    minWeight: number;
    createdAt: string;
    updatedAt: string;
}

export interface ARVRegimen {
    id: number;
    name: string;
    description: string;
    regimenType: string;
    targetPopulation: string;
    instructions: string;
    monitoring: string;
    isActive: boolean;
    isPregnancySafe: boolean;
    isPediatricSafe: boolean;
    minAge: number;
    minWeight: number;
    createdAt: string;
    updatedAt: string;
    drugs: RegimenDrug[];
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
    id: number;
    patientId: string;
    patientName: string;
    patientEmail: string;
    regimenId: number;
    regimenName: string;
    regimenType: string;
    prescribedDate: string;
    startDate?: string;
    endDate?: string;
    status: string;
    notes: string;
    lastReviewDate?: string;
    nextReviewDate?: string;
    doctorName: string;
    drugCount: number;
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
    // ARV Drugs
    getDrugs: async (): Promise<ARVDrug[]> => {
        const response = await api.get('/ARVDrug');
        return response.data;
    },

    getDrug: async (id: number): Promise<ARVDrug> => {
        const response = await api.get(`/ARVDrug/${id}`);
        return response.data;
    },

    getDrugsByClass: async (drugClass: string): Promise<ARVDrug[]> => {
        const response = await api.get(`/ARVDrug/class/${drugClass}`);
        return response.data;
    },

    getSuitableDrugs: async (params: {
        age?: number;
        weight?: number;
        isPregnant?: boolean;
        isPediatric?: boolean;
    }): Promise<ARVDrug[]> => {
        const response = await api.get('/ARVDrug/suitable-for-patient', { params });
        return response.data;
    },

    searchDrugs: async (query: string): Promise<ARVDrug[]> => {
        const response = await api.get('/ARVDrug/search', { params: { query } });
        return response.data;
    },

    getDrugClasses: async (): Promise<string[]> => {
        const response = await api.get('/ARVDrug/classes');
        return response.data;
    },

    // ARV Regimens
    getRegimens: async (): Promise<ARVRegimen[]> => {
        const response = await api.get('/ARVRegimen');
        return response.data;
    },

    getRegimen: async (id: number): Promise<ARVRegimen> => {
        const response = await api.get(`/ARVRegimen/${id}`);
        return response.data;
    },

    getSuitableRegimens: async (params: {
        age?: number;
        weight?: number;
        isPregnant?: boolean;
        isPediatric?: boolean;
        regimenType?: string;
    }): Promise<ARVRegimen[]> => {
        const response = await api.get('/ARVRegimen/suitable-for-patient', { params });
        return response.data;
    },

    createRegimen: async (data: CreateRegimenRequest): Promise<ARVRegimen> => {
        const response = await api.post('/ARVRegimen', data);
        return response.data;
    },

    updateRegimen: async (id: number, data: CreateRegimenRequest): Promise<void> => {
        await api.put(`/ARVRegimen/${id}`, data);
    },

    deleteRegimen: async (id: number): Promise<void> => {
        await api.delete(`/ARVRegimen/${id}`);
    },

    // Patient Regimens
    getPatientRegimensByDoctor: async (doctorId: string): Promise<PatientRegimen[]> => {
        const response = await api.get(`/PatientRegimen/doctor/${doctorId}`);
        return response.data;
    },

    getPatientRegimens: async (patientId: string): Promise<PatientRegimen[]> => {
        const response = await api.get(`/PatientRegimen/patient/${patientId}`);
        return response.data;
    },

    getPatientRegimen: async (id: number): Promise<PatientRegimenDetail> => {
        const response = await api.get(`/PatientRegimen/${id}`);
        return response.data;
    },

    createPatientRegimen: async (data: CreatePatientRegimenRequest): Promise<PatientRegimen> => {
        const response = await api.post('/PatientRegimen', data);
        return response.data;
    },

    updatePatientRegimenStatus: async (id: number, data: UpdateStatusRequest): Promise<void> => {
        await api.put(`/PatientRegimen/${id}/status`, data);
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
    }
};

export default arvService;
