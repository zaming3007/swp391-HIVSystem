import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002/api';

// Create axios instance with default config
const arvApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor for error handling
arvApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for testing
const mockRegimens = [
  {
    id: 'regimen-1',
    name: 'TDF/3TC/EFV',
    description: 'Phác đồ điều trị tuyến đầu với Tenofovir + Lamivudine + Efavirenz',
    category: 'Điều trị ban đầu',
    lineOfTreatment: 'Tuyến 1',
    medications: [
      {
        id: 'med-1-1',
        medicationName: 'Tenofovir DF',
        activeIngredient: 'Tenofovir Disoproxil Fumarate',
        dosage: '300mg',
        frequency: '1 lần/ngày',
        instructions: 'Uống cùng bữa ăn',
        sideEffects: 'Buồn nôn, đau đầu, mệt mỏi'
      },
      {
        id: 'med-1-2',
        medicationName: 'Lamivudine',
        activeIngredient: 'Lamivudine',
        dosage: '300mg',
        frequency: '1 lần/ngày',
        instructions: 'Có thể uống với hoặc không có thức ăn',
        sideEffects: 'Buồn nôn, đau bụng, mệt mỏi'
      },
      {
        id: 'med-1-3',
        medicationName: 'Efavirenz',
        activeIngredient: 'Efavirenz',
        dosage: '600mg',
        frequency: '1 lần/ngày',
        instructions: 'Uống trước khi đi ngủ, tránh thức ăn nhiều chất béo',
        sideEffects: 'Chóng mặt, mơ mộng bất thường, mất ngủ'
      }
    ]
  },
  {
    id: 'regimen-2',
    name: 'AZT/3TC/NVP',
    description: 'Phác đồ điều trị với Zidovudine + Lamivudine + Nevirapine',
    category: 'Điều trị ban đầu',
    lineOfTreatment: 'Tuyến 1',
    medications: [
      {
        id: 'med-2-1',
        medicationName: 'Zidovudine',
        activeIngredient: 'Zidovudine',
        dosage: '300mg',
        frequency: '2 lần/ngày',
        instructions: 'Uống cùng bữa ăn',
        sideEffects: 'Thiếu máu, buồn nôn, đau đầu'
      },
      {
        id: 'med-2-2',
        medicationName: 'Lamivudine',
        activeIngredient: 'Lamivudine',
        dosage: '150mg',
        frequency: '2 lần/ngày',
        instructions: 'Có thể uống với hoặc không có thức ăn',
        sideEffects: 'Buồn nôn, đau bụng, mệt mỏi'
      }
    ]
  }
];

const mockPatients = [
  {
    patientId: 'patient-1',
    patientName: 'Nguyễn Văn A',
    lastAppointment: '2025-07-10T10:00:00Z',
    totalAppointments: 5,
    currentRegimen: {
      id: 'regimen-1',
      name: 'TDF/3TC/EFV',
      status: 'Đang điều trị'
    }
  },
  {
    patientId: 'patient-2',
    patientName: 'Trần Thị B',
    lastAppointment: '2025-07-08T14:30:00Z',
    totalAppointments: 3,
    currentRegimen: null
  }
];

const mockCurrentRegimen = {
  id: 'patient-regimen-1',
  doctorName: 'BS. Nguyễn Văn Hùng',
  startDate: '2025-06-01T00:00:00Z',
  status: 'Đang điều trị',
  notes: 'Bệnh nhân cần uống thuốc đúng giờ và theo dõi tác dụng phụ',
  reason: 'Điều trị HIV giai đoạn đầu',
  regimen: mockRegimens[0],
  daysOnTreatment: 42
};

const mockAdherenceStats = {
  totalRecords: 30,
  averageAdherence: 92.5,
  last7DaysAdherence: 95.0,
  last30DaysAdherence: 91.2,
  consecutiveDays: 7,
  recentRecords: [
    { recordDate: '2025-07-12', adherencePercentage: 100, takenDoses: 3, totalDoses: 3 },
    { recordDate: '2025-07-11', adherencePercentage: 100, takenDoses: 3, totalDoses: 3 },
    { recordDate: '2025-07-10', adherencePercentage: 66.7, takenDoses: 2, totalDoses: 3 }
  ]
};

// Use real API calls - mock data removed for production

export default arvApi;
