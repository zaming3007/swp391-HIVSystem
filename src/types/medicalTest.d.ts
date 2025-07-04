// Types cho kết quả xét nghiệm CD4
export interface CD4Test {
    id: string;
    patientId: string;
    date: string;
    value: number; // Số lượng tế bào CD4 (cells/mm³)
    referenceRange: string; // Khoảng tham chiếu bình thường
    notes?: string;
    doctorId: string;
    doctorName?: string;
}

// Types cho kết quả xét nghiệm tải lượng HIV (Viral Load)
export interface ViralLoadTest {
    id: string;
    patientId: string;
    date: string;
    value: number; // Tải lượng virus (copies/mL)
    isDetectable: boolean; // Có phát hiện được virus không
    detectionLimit: number; // Ngưỡng phát hiện của xét nghiệm
    notes?: string;
    doctorId: string;
    doctorName?: string;
}

// Types cho phác đồ ARV
export interface ARVDrug {
    id: string;
    name: string;
    abbreviation: string;
    dosage: string;
    frequency: string;
    group: string; // Nhóm thuốc (NRTI, NNRTI, PI, INSTI, ...)
    description?: string;
}

export interface ARVRegimen {
    id: string;
    patientId: string;
    startDate: string;
    endDate?: string; // Ngày kết thúc, nếu null thì là phác đồ hiện tại
    drugs: ARVDrug[]; // Các loại thuốc trong phác đồ
    regimenName: string; // Tên phác đồ (ví dụ: TDF + 3TC + DTG)
    status: 'active' | 'discontinued' | 'changed'; // Trạng thái phác đồ
    reason?: string; // Lý do thay đổi/kết thúc
    doctorId: string;
    doctorName?: string;
    notes?: string;
}

// Types cho lịch sử xét nghiệm và khám bệnh
export interface TestHistory {
    id: string;
    patientId: string;
    date: string;
    type: 'CD4' | 'ViralLoad' | 'Other';
    testId: string; // ID của kết quả xét nghiệm
    status: 'completed' | 'pending' | 'cancelled';
}

export interface MedicalVisit {
    id: string;
    patientId: string;
    date: string;
    visitType: 'regular' | 'emergency' | 'follow-up';
    doctorId: string;
    doctorName?: string;
    diagnosis?: string;
    symptoms?: string[];
    notes?: string;
    nextVisitDate?: string;
    tests?: TestHistory[];
    arvChanges?: boolean; // Có thay đổi phác đồ ARV không
    clinicalStage?: number; // Giai đoạn lâm sàng (1-4)
}

// Types cho việc hiển thị thống kê và biểu đồ
export interface TestStatistics {
    averageCD4?: number;
    lowestCD4?: number;
    highestCD4?: number;
    latestViralLoad?: number;
    isViralSuppressed?: boolean; // Tải lượng virus được ức chế (<200 copies/mL)
    adherenceRate?: number; // Tỷ lệ tuân thủ uống thuốc (%)
} 