import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ARVRegimen } from '../../types';
import MedicationIcon from '@mui/icons-material/Medication';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import NoteIcon from '@mui/icons-material/Note';

interface ARVRegimenCardProps {
    regimen: ARVRegimen;
}

const ARVRegimenCard: React.FC<ARVRegimenCardProps> = ({ regimen }) => {
    // Format dates
    const startDate = format(parseISO(regimen.startDate), 'dd/MM/yyyy');
    const endDate = regimen.endDate ? format(parseISO(regimen.endDate), 'dd/MM/yyyy') : 'Hiện tại';

    // Get status color and label
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'changed': return 'warning';
            case 'discontinued': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Đang sử dụng';
            case 'changed': return 'Đã thay đổi';
            case 'discontinued': return 'Đã ngưng';
            default: return 'Không xác định';
        }
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MedicationIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="h6">
                            {regimen.regimenName}
                        </Typography>
                    </Box>
                    <Chip
                        label={getStatusLabel(regimen.status)}
                        color={getStatusColor(regimen.status) as any}
                        size="small"
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                <strong>Bắt đầu:</strong> {startDate}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                <strong>Kết thúc:</strong> {endDate}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">
                                <strong>Bác sĩ điều trị:</strong> {regimen.doctorName}
                            </Typography>
                        </Box>
                    </Grid>

                    {regimen.reason && (
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <NoteIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                    <strong>Lý do thay đổi:</strong> {regimen.reason}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                    Thành phần thuốc
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Thuốc</strong></TableCell>
                                <TableCell><strong>Viết tắt</strong></TableCell>
                                <TableCell><strong>Liều lượng</strong></TableCell>
                                <TableCell><strong>Tần suất</strong></TableCell>
                                <TableCell><strong>Nhóm thuốc</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {regimen.drugs.map((drug) => (
                                <TableRow key={drug.id}>
                                    <TableCell>{drug.name}</TableCell>
                                    <TableCell>{drug.abbreviation}</TableCell>
                                    <TableCell>{drug.dosage}</TableCell>
                                    <TableCell>{drug.frequency}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={drug.group}
                                            size="small"
                                            color={
                                                drug.group === 'NRTI' ? 'primary' :
                                                    drug.group === 'NNRTI' ? 'secondary' :
                                                        drug.group === 'PI' ? 'warning' :
                                                            drug.group === 'INSTI' ? 'success' :
                                                                'default'
                                            }
                                            sx={{ fontSize: '0.7rem' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {regimen.notes && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            <strong>Ghi chú:</strong> {regimen.notes}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ARVRegimenCard; 