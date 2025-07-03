// Đây là một file backup cho ReminderPage
// Lưu lại để tham khảo khi cần

import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Tabs,
    Tab,
    Paper,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Card,
    CardContent,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Stack,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
    Notifications as NotificationsIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    AlarmOn as AlarmOnIcon,
    EventNote as EventNoteIcon
} from '@mui/icons-material';
import { vi } from 'date-fns/locale';
import { format } from 'date-fns';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`reminder-tabpanel-${index}`}
            aria-labelledby={`reminder-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `reminder-tab-${index}`,
        'aria-controls': `reminder-tabpanel-${index}`,
    };
}

// Mock Data - Phác đồ ARV 
const arvRegimens = [
    { id: 1, name: 'TDF + 3TC + DTG', description: 'Phác đồ bậc 1 - Người trưởng thành' },
    { id: 2, name: 'TDF + 3TC + EFV', description: 'Phác đồ bậc 1 - Phụ nữ có thai' },
    { id: 3, name: 'ABC + 3TC + DTG', description: 'Phác đồ thay thế - Người có bệnh thận' },
    { id: 4, name: 'AZT + 3TC + NVP', description: 'Phác đồ bậc 1 - Trẻ em' },
    { id: 5, name: 'TDF + FTC + DTG', description: 'Phác đồ bậc 1 - Thay thế' }
];

// Mock Data - Nhắc nhở uống thuốc
const initialMedicationReminders = [
    {
        id: 1,
        medicineName: 'ARV - TDF + 3TC + DTG',
        schedule: 'Hàng ngày',
        time: '08:00',
        enabled: true,
        notes: 'Uống sau bữa sáng'
    },
    {
        id: 2,
        medicineName: 'Cotrimoxazole',
        schedule: 'Hàng ngày',
        time: '20:00',
        enabled: true,
        notes: 'Uống sau bữa tối'
    }
];

// Mock Data - Lịch tái khám
const initialAppointments = [
    {
        id: 1,
        title: 'Tái khám và lấy thuốc ARV',
        date: new Date('2023-12-15'),
        time: '09:30',
        doctor: 'BS. Nguyễn Văn A',
        location: 'Phòng khám HIV ngoại trú',
        notes: 'Mang theo sổ điều trị và kết quả xét nghiệm'
    },
    {
        id: 2,
        title: 'Xét nghiệm CD4 và tải lượng virus',
        date: new Date('2023-12-28'),
        time: '10:00',
        doctor: 'BS. Trần Thị B',
        location: 'Phòng xét nghiệm - Tầng 2',
        notes: 'Nhịn ăn 8 tiếng trước khi xét nghiệm'
    }
];

const ReminderPageBackup: React.FC = () => {
    return (
        <Container>
            <Typography variant="h4">
                Trang quản lý nhắc nhở (Bản sao lưu)
            </Typography>
            <Typography>
                File này chỉ là bản sao lưu của ReminderPage để tham khảo khi cần.
            </Typography>
        </Container>
    );
};

export default ReminderPageBackup;
