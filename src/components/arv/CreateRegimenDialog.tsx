import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    Grid,
    Chip,
    Alert,
    Autocomplete,
    Divider
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Medication as MedicationIcon,
    Save as SaveIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import arvService from '../../services/arvService';

interface Drug {
    id: string;
    name: string;
    genericName: string;
    dosage: string;
    category: string;
    instructions: string;
    sideEffects: string;
}

interface Medication {
    medicationName: string;
    activeIngredient: string;
    dosage: string;
    frequency: string;
    instructions: string;
    sideEffects: string;
}

interface CreateRegimenDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateRegimenDialog: React.FC<CreateRegimenDialogProps> = ({
    open,
    onClose,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        lineOfTreatment: ''
    });
    const [medications, setMedications] = useState<Medication[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            loadDrugs();
            resetForm();
        }
    }, [open]);

    const loadDrugs = async () => {
        try {
            // Try to get drugs from AuthApi first
            const drugsData = await arvService.getDrugs();
            if (drugsData && drugsData.length > 0) {
                setDrugs(drugsData);
            } else {
                // Fallback to AppointmentApi
                const regimenDrugs = await arvService.getARVDrugsForRegimen();
                setDrugs(regimenDrugs);
            }
        } catch (error) {
            console.error('Error loading drugs:', error);
            setError('Không thể tải danh sách thuốc');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            lineOfTreatment: ''
        });
        setMedications([]);
        setError('');
    };

    const handleAddMedication = () => {
        setMedications([...medications, {
            medicationName: '',
            activeIngredient: '',
            dosage: '',
            frequency: '',
            instructions: '',
            sideEffects: ''
        }]);
    };

    const handleRemoveMedication = (index: number) => {
        setMedications(medications.filter((_, i) => i !== index));
    };

    const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
        const updatedMedications = [...medications];
        updatedMedications[index] = {
            ...updatedMedications[index],
            [field]: value
        };

        // Auto-fill drug information when drug is selected
        if (field === 'medicationName') {
            const selectedDrug = drugs.find(d => d.name === value);
            if (selectedDrug) {
                updatedMedications[index] = {
                    ...updatedMedications[index],
                    medicationName: selectedDrug.name,
                    activeIngredient: selectedDrug.genericName,
                    sideEffects: selectedDrug.sideEffects
                };
            }
        }

        setMedications(updatedMedications);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            // Enhanced Validation
            if (!formData.name.trim()) {
                setError('Vui lòng nhập tên phác đồ');
                return;
            }

            if (!formData.description.trim()) {
                setError('Vui lòng nhập mô tả phác đồ');
                return;
            }

            if (!formData.category.trim()) {
                setError('Vui lòng chọn danh mục phác đồ');
                return;
            }

            if (!formData.lineOfTreatment.trim()) {
                setError('Vui lòng chọn tuyến điều trị');
                return;
            }

            if (medications.length === 0) {
                setError('Vui lòng thêm ít nhất một thuốc vào phác đồ');
                return;
            }

            for (let i = 0; i < medications.length; i++) {
                const med = medications[i];
                if (!med.medicationName.trim()) {
                    setError(`Vui lòng chọn tên thuốc cho thuốc thứ ${i + 1}`);
                    return;
                }
                if (!med.dosage.trim()) {
                    setError(`Vui lòng nhập liều dùng cho thuốc thứ ${i + 1}`);
                    return;
                }
                if (!med.frequency.trim()) {
                    setError(`Vui lòng nhập tần suất sử dụng cho thuốc thứ ${i + 1}`);
                    return;
                }
                if (!med.instructions.trim()) {
                    setError(`Vui lòng nhập hướng dẫn sử dụng cho thuốc thứ ${i + 1}`);
                    return;
                }
            }

            // Chuyển đổi medications thành selectedDrugs format
            const selectedDrugs = medications.map(med => med.medicationName);

            const response = await arvService.createRegimen({
                name: formData.name,
                description: formData.description,
                category: formData.category,
                lineOfTreatment: formData.lineOfTreatment,
                selectedDrugs
            });

            if (response.success) {
                onSuccess();
                onClose();
            } else {
                setError(response.message || 'Có lỗi xảy ra khi tạo phác đồ');
            }
        } catch (error: any) {
            setError(error.message || 'Có lỗi xảy ra khi tạo phác đồ');
        } finally {
            setLoading(false);
        }
    };

    const frequencyOptions = [
        '1 lần/ngày',
        '2 lần/ngày',
        '3 lần/ngày',
        '1 lần/12 giờ',
        '1 lần/8 giờ',
        'Theo chỉ định'
    ];

    const categoryOptions = [
        'Điều trị ban đầu',
        'Điều trị tuyến hai',
        'Điều trị thay thế',
        'Điều trị đặc biệt'
    ];

    const lineOfTreatmentOptions = [
        'Tuyến 1',
        'Tuyến 2',
        'Tuyến 3'
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: { minHeight: '80vh' }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <MedicationIcon color="primary" />
                    <Typography variant="h6">Tạo Phác Đồ ARV Mới</Typography>
                    <Box sx={{ ml: 'auto' }}>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Basic Information */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Thông Tin Cơ Bản
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Tên Phác Đồ *"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: TDF/FTC/EFV"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Tuyến Điều Trị</InputLabel>
                                    <Select
                                        value={formData.lineOfTreatment}
                                        onChange={(e) => setFormData({ ...formData, lineOfTreatment: e.target.value })}
                                        label="Tuyến Điều Trị"
                                    >
                                        {lineOfTreatmentOptions.map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Danh Mục</InputLabel>
                                    <Select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        label="Danh Mục"
                                    >
                                        {categoryOptions.map(option => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Mô Tả"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả chi tiết về phác đồ điều trị..."
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Medications */}
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                                Danh Sách Thuốc ({medications.length})
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddMedication}
                            >
                                Thêm Thuốc
                            </Button>
                        </Box>

                        {medications.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Chưa có thuốc nào. Nhấn "Thêm Thuốc" để bắt đầu.
                                </Typography>
                            </Box>
                        ) : (
                            medications.map((medication, index) => (
                                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle1">
                                                Thuốc {index + 1}
                                            </Typography>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveMedication(index)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Autocomplete
                                                    options={drugs}
                                                    getOptionLabel={(option) => `${option.name} (${option.category})`}
                                                    value={drugs.find(d => d.name === medication.medicationName) || null}
                                                    onChange={(_, newValue) => {
                                                        handleMedicationChange(index, 'medicationName', newValue?.name || '');
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Chọn Thuốc *"
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <TextField
                                                    fullWidth
                                                    label="Liều Lượng *"
                                                    value={medication.dosage}
                                                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                                    placeholder="VD: 300mg"
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Tần Suất *</InputLabel>
                                                    <Select
                                                        value={medication.frequency}
                                                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                                        label="Tần Suất *"
                                                    >
                                                        {frequencyOptions.map(option => (
                                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="Hướng Dẫn Sử Dụng"
                                                    value={medication.instructions}
                                                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                                                    placeholder="VD: Uống sau bữa ăn"
                                                />
                                            </Grid>
                                            {medication.medicationName && (
                                                <Grid item xs={12}>
                                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                        <Chip
                                                            label={drugs.find(d => d.name === medication.medicationName)?.category}
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                        <Chip
                                                            label={medication.activeIngredient}
                                                            size="small"
                                                            color="secondary"
                                                            variant="outlined"
                                                        />
                                                    </Box>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </CardContent>
                </Card>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} disabled={loading}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Đang tạo...' : 'Tạo Phác Đồ'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateRegimenDialog;
