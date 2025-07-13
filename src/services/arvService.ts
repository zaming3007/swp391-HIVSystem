import arvApi from './arvApi';

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
    // ARV Drugs - Use AppointmentApi endpoints
    getDrugs: async (): Promise<ARVDrug[]> => {
        // Temporarily return empty array - AuthApi endpoints have type mismatch
        return [];
    },

    getDrug: async (id: number): Promise<ARVDrug> => {
        // Temporarily throw error - AuthApi endpoints have type mismatch
        throw new Error('Drug details not available');
    },

    getDrugsByClass: async (drugClass: string): Promise<ARVDrug[]> => {
        // Temporarily return empty array - AuthApi endpoints have type mismatch
        return [];
    },

    getSuitableDrugs: async (params: {
        age?: number;
        weight?: number;
        isPregnant?: boolean;
        isPediatric?: boolean;
    }): Promise<ARVDrug[]> => {
        // Temporarily return empty array - AuthApi endpoints have type mismatch
        return [];
    },

    searchDrugs: async (query: string): Promise<ARVDrug[]> => {
        // Temporarily return empty array - AuthApi endpoints have type mismatch
        return [];
    },

    getDrugClasses: async (): Promise<string[]> => {
        // Temporarily return empty array - AuthApi endpoints have type mismatch
        return [];
    },

    // ARV Regimens - Use AppointmentApi endpoints
    getRegimens: async (): Promise<ARVRegimen[]> => {
        const response = await arvApi.get('/ARVPrescription/regimens');
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    },

    getRegimen: async (id: number): Promise<ARVRegimen> => {
        // Temporarily throw error - need to implement in AppointmentApi
        throw new Error('Regimen details not available');
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

    createRegimen: async (data: CreateRegimenRequest): Promise<ARVRegimen> => {
        // Temporarily throw error - need to implement in AppointmentApi
        throw new Error('Create regimen not available');
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
        const response = await arvApi.get(`/ARVPrescription/doctor/${doctorId}/patients`);
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
        const response = await arvApi.get('/ARVPrescription/doctor-patients');
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    },

    // Adherence tracking
    recordAdherence: async (data: {
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
    }
};

export default arvService;
