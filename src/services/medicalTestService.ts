import {
    CD4Test,
    ViralLoadTest,
    ARVRegimen,
    ARVDrug,
    MedicalVisit,
    TestHistory,
    TestStatistics
} from '../types';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Mock data cho các loại thuốc ARV
const mockARVDrugs: ARVDrug[] = [
    {
        id: '1',
        name: 'Tenofovir Disoproxil Fumarate',
        abbreviation: 'TDF',
        dosage: '300mg',
        frequency: 'Ngày 1 lần',
        group: 'NRTI',
        description: 'Thuốc kháng virus nucleotide, ức chế enzyme phiên mã ngược của HIV'
    },
    {
        id: '2',
        name: 'Lamivudine',
        abbreviation: '3TC',
        dosage: '300mg',
        frequency: 'Ngày 1 lần',
        group: 'NRTI',
        description: 'Thuốc kháng virus nucleoside, ức chế enzyme phiên mã ngược của HIV'
    },
    {
        id: '3',
        name: 'Dolutegravir',
        abbreviation: 'DTG',
        dosage: '50mg',
        frequency: 'Ngày 1 lần',
        group: 'INSTI',
        description: 'Thuốc ức chế enzyme integrase của HIV'
    },
    {
        id: '4',
        name: 'Efavirenz',
        abbreviation: 'EFV',
        dosage: '600mg',
        frequency: 'Ngày 1 lần (buổi tối)',
        group: 'NNRTI',
        description: 'Thuốc kháng virus non-nucleoside, ức chế enzyme phiên mã ngược của HIV'
    },
    {
        id: '5',
        name: 'Abacavir',
        abbreviation: 'ABC',
        dosage: '600mg',
        frequency: 'Ngày 1 lần',
        group: 'NRTI',
        description: 'Thuốc kháng virus nucleoside, ức chế enzyme phiên mã ngược của HIV'
    },
    {
        id: '6',
        name: 'Lopinavir/Ritonavir',
        abbreviation: 'LPV/r',
        dosage: '400mg/100mg',
        frequency: 'Ngày 2 lần',
        group: 'PI',
        description: 'Thuốc ức chế enzyme protease của HIV, tăng cường với ritonavir'
    },
    {
        id: '7',
        name: 'Atazanavir',
        abbreviation: 'ATV',
        dosage: '300mg',
        frequency: 'Ngày 1 lần',
        group: 'PI',
        description: 'Thuốc ức chế enzyme protease của HIV'
    },
    {
        id: '8',
        name: 'Ritonavir',
        abbreviation: 'RTV',
        dosage: '100mg',
        frequency: 'Ngày 1 lần',
        group: 'PI',
        description: 'Thuốc ức chế enzyme protease của HIV, thường dùng làm chất tăng cường cho PI khác'
    }
];

// Mock data cho phác đồ ARV
const generateMockARVRegimens = (patientId: string): ARVRegimen[] => {
    return [
        {
            id: uuidv4(),
            patientId,
            startDate: '2022-01-15',
            regimenName: 'TDF + 3TC + EFV',
            status: 'changed',
            drugs: [
                mockARVDrugs[0], // TDF
                mockARVDrugs[1], // 3TC
                mockARVDrugs[3]  // EFV
            ],
            endDate: '2023-03-10',
            reason: 'Tác dụng phụ trên thần kinh trung ương',
            doctorId: 'd1',
            doctorName: 'BS. Nguyễn Văn A',
            notes: 'Bệnh nhân gặp tác dụng phụ mất ngủ, ác mộng do EFV'
        },
        {
            id: uuidv4(),
            patientId,
            startDate: '2023-03-10',
            regimenName: 'TDF + 3TC + DTG',
            status: 'active',
            drugs: [
                mockARVDrugs[0], // TDF
                mockARVDrugs[1], // 3TC
                mockARVDrugs[2]  // DTG
            ],
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B',
            notes: 'Chuyển sang phác đồ có DTG để giảm tác dụng phụ'
        }
    ];
};

// Mock data cho xét nghiệm CD4
const generateMockCD4Tests = (patientId: string): CD4Test[] => {
    return [
        {
            id: uuidv4(),
            patientId,
            date: '2022-01-10',
            value: 350,
            referenceRange: '500-1500 cells/mm³',
            doctorId: 'd1',
            doctorName: 'BS. Nguyễn Văn A',
            notes: 'Xét nghiệm ban đầu, trước khi bắt đầu điều trị ARV'
        },
        {
            id: uuidv4(),
            patientId,
            date: '2022-07-15',
            value: 420,
            referenceRange: '500-1500 cells/mm³',
            doctorId: 'd1',
            doctorName: 'BS. Nguyễn Văn A'
        },
        {
            id: uuidv4(),
            patientId,
            date: '2023-01-20',
            value: 510,
            referenceRange: '500-1500 cells/mm³',
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B',
            notes: 'CD4 đã vào vùng bình thường, phản ứng tốt với điều trị'
        },
        {
            id: uuidv4(),
            patientId,
            date: '2023-07-18',
            value: 580,
            referenceRange: '500-1500 cells/mm³',
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B'
        },
        {
            id: uuidv4(),
            patientId,
            date: '2024-01-25',
            value: 650,
            referenceRange: '500-1500 cells/mm³',
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B',
            notes: 'Tiếp tục cải thiện CD4, hiệu quả điều trị tốt'
        }
    ];
};

// Mock data cho xét nghiệm tải lượng virus
const generateMockViralLoadTests = (patientId: string): ViralLoadTest[] => {
    return [
        {
            id: uuidv4(),
            patientId,
            date: '2022-01-10',
            value: 85000,
            isDetectable: true,
            detectionLimit: 20,
            doctorId: 'd1',
            doctorName: 'BS. Nguyễn Văn A',
            notes: 'Tải lượng virus ban đầu cao, bắt đầu điều trị ARV'
        },
        {
            id: uuidv4(),
            patientId,
            date: '2022-07-15',
            value: 1200,
            isDetectable: true,
            detectionLimit: 20,
            doctorId: 'd1',
            doctorName: 'BS. Nguyễn Văn A',
            notes: 'Tải lượng virus giảm đáng kể sau 6 tháng điều trị'
        },
        {
            id: uuidv4(),
            patientId,
            date: '2023-01-20',
            value: 45,
            isDetectable: true,
            detectionLimit: 20,
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B'
        },
        {
            id: uuidv4(),
            patientId,
            date: '2023-07-18',
            value: 0,
            isDetectable: false,
            detectionLimit: 20,
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B',
            notes: 'Không phát hiện virus, điều trị hiệu quả'
        },
        {
            id: uuidv4(),
            patientId,
            date: '2024-01-25',
            value: 0,
            isDetectable: false,
            detectionLimit: 20,
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B',
            notes: 'Tiếp tục không phát hiện virus, duy trì điều trị hiệu quả'
        }
    ];
};

// Mock data cho lịch sử khám bệnh
const generateMockMedicalVisits = (patientId: string): MedicalVisit[] => {
    return [
        {
            id: uuidv4(),
            patientId,
            date: '2022-01-10',
            visitType: 'regular',
            doctorId: 'd1',
            doctorName: 'BS. Nguyễn Văn A',
            diagnosis: 'HIV giai đoạn lâm sàng 2',
            symptoms: ['Sụt cân nhẹ', 'Viêm loét miệng tái phát', 'Mệt mỏi'],
            notes: 'Bệnh nhân mới được chẩn đoán, bắt đầu điều trị ARV.',
            nextVisitDate: '2022-02-10',
            clinicalStage: 2,
            arvChanges: true,
            tests: [
                {
                    id: uuidv4(),
                    patientId,
                    date: '2022-01-10',
                    type: 'CD4',
                    testId: '1', // Liên kết đến CD4Test
                    status: 'completed'
                },
                {
                    id: uuidv4(),
                    patientId,
                    date: '2022-01-10',
                    type: 'ViralLoad',
                    testId: '1', // Liên kết đến ViralLoadTest
                    status: 'completed'
                }
            ]
        },
        {
            id: uuidv4(),
            patientId,
            date: '2022-07-15',
            visitType: 'follow-up',
            doctorId: 'd1',
            doctorName: 'BS. Nguyễn Văn A',
            symptoms: ['Không có triệu chứng đáng kể'],
            notes: 'Bệnh nhân tuân thủ điều trị tốt, khám định kỳ.',
            nextVisitDate: '2023-01-15',
            tests: [
                {
                    id: uuidv4(),
                    patientId,
                    date: '2022-07-15',
                    type: 'CD4',
                    testId: '2', // Liên kết đến CD4Test
                    status: 'completed'
                },
                {
                    id: uuidv4(),
                    patientId,
                    date: '2022-07-15',
                    type: 'ViralLoad',
                    testId: '2', // Liên kết đến ViralLoadTest
                    status: 'completed'
                }
            ]
        },
        {
            id: uuidv4(),
            patientId,
            date: '2023-01-20',
            visitType: 'regular',
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B',
            notes: 'Bệnh nhân phản ánh tác dụng phụ từ EFV, cân nhắc chuyển phác đồ.',
            nextVisitDate: '2023-07-20',
            arvChanges: true,
            tests: [
                {
                    id: uuidv4(),
                    patientId,
                    date: '2023-01-20',
                    type: 'CD4',
                    testId: '3', // Liên kết đến CD4Test
                    status: 'completed'
                },
                {
                    id: uuidv4(),
                    patientId,
                    date: '2023-01-20',
                    type: 'ViralLoad',
                    testId: '3', // Liên kết đến ViralLoadTest
                    status: 'completed'
                }
            ]
        },
        {
            id: uuidv4(),
            patientId,
            date: '2023-03-10',
            visitType: 'follow-up',
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B',
            notes: 'Thay đổi phác đồ từ TDF+3TC+EFV sang TDF+3TC+DTG do tác dụng phụ.',
            nextVisitDate: '2023-07-10',
            arvChanges: true
        },
        {
            id: uuidv4(),
            patientId,
            date: '2023-07-18',
            visitType: 'regular',
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B',
            notes: 'Bệnh nhân dung nạp tốt phác đồ mới, không có tác dụng phụ.',
            nextVisitDate: '2024-01-18',
            tests: [
                {
                    id: uuidv4(),
                    patientId,
                    date: '2023-07-18',
                    type: 'CD4',
                    testId: '4', // Liên kết đến CD4Test
                    status: 'completed'
                },
                {
                    id: uuidv4(),
                    patientId,
                    date: '2023-07-18',
                    type: 'ViralLoad',
                    testId: '4', // Liên kết đến ViralLoadTest
                    status: 'completed'
                }
            ]
        },
        {
            id: uuidv4(),
            patientId,
            date: '2024-01-25',
            visitType: 'regular',
            doctorId: 'd2',
            doctorName: 'BS. Trần Thị B',
            notes: 'Bệnh nhân khỏe mạnh, tuân thủ điều trị tốt.',
            nextVisitDate: '2024-07-25',
            tests: [
                {
                    id: uuidv4(),
                    patientId,
                    date: '2024-01-25',
                    type: 'CD4',
                    testId: '5', // Liên kết đến CD4Test
                    status: 'completed'
                },
                {
                    id: uuidv4(),
                    patientId,
                    date: '2024-01-25',
                    type: 'ViralLoad',
                    testId: '5', // Liên kết đến ViralLoadTest
                    status: 'completed'
                }
            ]
        }
    ];
};

// Mock data cho tài khoản hiện tại
let currentPatientId: string | null = null;
let mockCD4Tests: CD4Test[] = [];
let mockViralLoadTests: ViralLoadTest[] = [];
let mockARVRegimens: ARVRegimen[] = [];
let mockMedicalVisits: MedicalVisit[] = [];

// Khởi tạo mock data cho một bệnh nhân
const initMockData = (patientId: string) => {
    currentPatientId = patientId;
    mockCD4Tests = generateMockCD4Tests(patientId);
    mockViralLoadTests = generateMockViralLoadTests(patientId);
    mockARVRegimens = generateMockARVRegimens(patientId);
    mockMedicalVisits = generateMockMedicalVisits(patientId);

    // Lưu vào localStorage để giữ dữ liệu giữa các phiên
    localStorage.setItem('mockCD4Tests', JSON.stringify(mockCD4Tests));
    localStorage.setItem('mockViralLoadTests', JSON.stringify(mockViralLoadTests));
    localStorage.setItem('mockARVRegimens', JSON.stringify(mockARVRegimens));
    localStorage.setItem('mockMedicalVisits', JSON.stringify(mockMedicalVisits));
};

// Lấy CD4 tests từ mock data
export const getCD4Tests = async (): Promise<CD4Test[]> => {
    await simulateApiCall();
    const userId = localStorage.getItem('userId');

    // Kiểm tra xem có dữ liệu trong localStorage không
    const storedTests = localStorage.getItem('mockCD4Tests');
    if (storedTests) {
        return JSON.parse(storedTests);
    }

    // Nếu không, khởi tạo dữ liệu mới
    if (userId && (!currentPatientId || currentPatientId !== userId)) {
        initMockData(userId);
    }

    return mockCD4Tests;
};

// Lấy Viral Load tests từ mock data
export const getViralLoadTests = async (): Promise<ViralLoadTest[]> => {
    await simulateApiCall();
    const userId = localStorage.getItem('userId');

    // Kiểm tra xem có dữ liệu trong localStorage không
    const storedTests = localStorage.getItem('mockViralLoadTests');
    if (storedTests) {
        return JSON.parse(storedTests);
    }

    // Nếu không, khởi tạo dữ liệu mới
    if (userId && (!currentPatientId || currentPatientId !== userId)) {
        initMockData(userId);
    }

    return mockViralLoadTests;
};

// Lấy phác đồ ARV từ mock data
export const getARVRegimens = async (): Promise<ARVRegimen[]> => {
    await simulateApiCall();
    const userId = localStorage.getItem('userId');

    // Kiểm tra xem có dữ liệu trong localStorage không
    const storedRegimens = localStorage.getItem('mockARVRegimens');
    if (storedRegimens) {
        return JSON.parse(storedRegimens);
    }

    // Nếu không, khởi tạo dữ liệu mới
    if (userId && (!currentPatientId || currentPatientId !== userId)) {
        initMockData(userId);
    }

    return mockARVRegimens;
};

// Lấy lịch sử khám bệnh từ mock data
export const getMedicalVisits = async (): Promise<MedicalVisit[]> => {
    await simulateApiCall();
    const userId = localStorage.getItem('userId');

    // Kiểm tra xem có dữ liệu trong localStorage không
    const storedVisits = localStorage.getItem('mockMedicalVisits');
    if (storedVisits) {
        return JSON.parse(storedVisits);
    }

    // Nếu không, khởi tạo dữ liệu mới
    if (userId && (!currentPatientId || currentPatientId !== userId)) {
        initMockData(userId);
    }

    return mockMedicalVisits;
};

// Lấy thống kê xét nghiệm từ dữ liệu có sẵn
export const getTestStatistics = async (): Promise<TestStatistics> => {
    await simulateApiCall();

    const cd4Tests = await getCD4Tests();
    const viralLoadTests = await getViralLoadTests();

    // Tính toán các thống kê
    const cd4Values = cd4Tests.map(test => test.value);
    const averageCD4 = cd4Values.reduce((sum, val) => sum + val, 0) / cd4Values.length;
    const lowestCD4 = Math.min(...cd4Values);
    const highestCD4 = Math.max(...cd4Values);

    // Lấy giá trị viral load mới nhất
    const sortedViralLoadTests = [...viralLoadTests].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const latestViralLoad = sortedViralLoadTests.length > 0 ? sortedViralLoadTests[0].value : undefined;
    const isViralSuppressed = latestViralLoad !== undefined && latestViralLoad < 200;

    // Giả lập tỷ lệ tuân thủ uống thuốc
    const adherenceRate = 95;

    return {
        averageCD4,
        lowestCD4,
        highestCD4,
        latestViralLoad,
        isViralSuppressed,
        adherenceRate
    };
};

// Hàm giả lập độ trễ API
const simulateApiCall = async (): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, 500);
    });
};

// Export các hàm và mock data để sử dụng
export {
    mockARVDrugs,
    initMockData
}; 