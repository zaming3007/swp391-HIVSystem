import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    IconButton
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { MedicalVisit } from '../../types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventIcon from '@mui/icons-material/Event';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import VirusIcon from '@mui/icons-material/Coronavirus';
import TimelineIcon from '@mui/icons-material/Timeline';

interface MedicalVisitListProps {
    visits: MedicalVisit[];
    onViewCD4Detail?: (testId: string) => void;
    onViewViralLoadDetail?: (testId: string) => void;
}

const MedicalVisitList: React.FC<MedicalVisitListProps> = ({
    visits,
    onViewCD4Detail,
    onViewViralLoadDetail
}) => {
    const [expandedVisit, setExpandedVisit] = useState<string | false>(false);

    const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedVisit(isExpanded ? panel : false);
    };

    // Format visits by year for grouping
    const visitsByYear = visits.reduce<Record<string, MedicalVisit[]>>((acc, visit) => {
        const year = new Date(visit.date).getFullYear().toString();
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(visit);
        return acc;
    }, {});

    // Sort years in descending order
    const years = Object.keys(visitsByYear).sort((a, b) => parseInt(b) - parseInt(a));

    // Get visit type label and color
    const getVisitTypeLabel = (type: string) => {
        switch (type) {
            case 'regular': return 'Khám định kỳ';
            case 'emergency': return 'Khám khẩn cấp';
            case 'follow-up': return 'Tái khám';
            default: return 'Không xác định';
        }
    };

    const getVisitTypeColor = (type: string) => {
        switch (type) {
            case 'regular': return 'primary';
            case 'emergency': return 'error';
            case 'follow-up': return 'info';
            default: return 'default';
        }
    };

    if (visits.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Không có lịch sử khám bệnh
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Lịch sử khám bệnh
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {years.map((year) => (
                    <Box key={year} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            <TimelineIcon sx={{ mr: 1 }} /> {year}
                        </Typography>

                        {visitsByYear[year]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((visit) => (
                                <Accordion
                                    key={visit.id}
                                    expanded={expandedVisit === visit.id}
                                    onChange={handleChange(visit.id)}
                                    sx={{ mb: 1 }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mr: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                                                <Typography>{format(parseISO(visit.date), 'dd/MM/yyyy')}</Typography>
                                            </Box>
                                            <Chip
                                                label={getVisitTypeLabel(visit.visitType)}
                                                size="small"
                                                color={getVisitTypeColor(visit.visitType) as any}
                                            />
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <MedicalServicesIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                <Typography variant="body2">
                                                    <strong>Bác sĩ:</strong> {visit.doctorName}
                                                </Typography>
                                            </Box>

                                            {visit.diagnosis && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                    <VaccinesIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                    <Typography variant="body2">
                                                        <strong>Chẩn đoán:</strong> {visit.diagnosis}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {visit.symptoms && visit.symptoms.length > 0 && (
                                                <Box sx={{ mb: 1 }}>
                                                    <Typography variant="body2">
                                                        <strong>Triệu chứng:</strong>
                                                    </Typography>
                                                    <Box component="ul" sx={{ pl: 2, mt: 0.5 }}>
                                                        {visit.symptoms.map((symptom, index) => (
                                                            <Typography component="li" variant="body2" key={index}>
                                                                {symptom}
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {visit.arvChanges && (
                                                <Typography variant="body2" sx={{ color: 'warning.main', mb: 1 }}>
                                                    <strong>Thay đổi phác đồ ARV trong lần khám này</strong>
                                                </Typography>
                                            )}

                                            {visit.tests && visit.tests.length > 0 && (
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                        Xét nghiệm:
                                                    </Typography>
                                                    <List disablePadding dense>
                                                        {visit.tests.map((test) => (
                                                            <ListItem
                                                                key={test.id}
                                                                sx={{
                                                                    py: 0.5,
                                                                    px: 1,
                                                                    bgcolor: 'background.default',
                                                                    borderRadius: 1,
                                                                    mb: 0.5
                                                                }}
                                                                secondaryAction={
                                                                    test.type === 'CD4' && onViewCD4Detail ? (
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            onClick={() => onViewCD4Detail(test.testId)}
                                                                            startIcon={<BloodtypeIcon />}
                                                                        >
                                                                            Chi tiết
                                                                        </Button>
                                                                    ) : test.type === 'ViralLoad' && onViewViralLoadDetail ? (
                                                                        <Button
                                                                            size="small"
                                                                            variant="outlined"
                                                                            onClick={() => onViewViralLoadDetail(test.testId)}
                                                                            startIcon={<VirusIcon />}
                                                                        >
                                                                            Chi tiết
                                                                        </Button>
                                                                    ) : null
                                                                }
                                                            >
                                                                <ListItemText
                                                                    primary={
                                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                            {test.type === 'CD4' ? (
                                                                                <BloodtypeIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                                                                            ) : test.type === 'ViralLoad' ? (
                                                                                <VirusIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                                                                            ) : (
                                                                                <MedicalServicesIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                                            )}
                                                                            <Typography variant="body2">
                                                                                {test.type === 'CD4' ? 'Xét nghiệm CD4' :
                                                                                    test.type === 'ViralLoad' ? 'Xét nghiệm tải lượng virus' :
                                                                                        'Xét nghiệm khác'}
                                                                            </Typography>
                                                                        </Box>
                                                                    }
                                                                    secondary={
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {format(parseISO(test.date), 'dd/MM/yyyy')} -
                                                                            {test.status === 'completed' ? ' Đã hoàn thành' :
                                                                                test.status === 'pending' ? ' Đang chờ kết quả' :
                                                                                    ' Đã hủy'}
                                                                        </Typography>
                                                                    }
                                                                />
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Box>
                                            )}

                                            {visit.notes && (
                                                <Box sx={{ mt: 1 }}>
                                                    <Typography variant="body2">
                                                        <strong>Ghi chú:</strong> {visit.notes}
                                                    </Typography>
                                                </Box>
                                            )}

                                            {visit.nextVisitDate && (
                                                <Box sx={{ mt: 1 }}>
                                                    <Typography variant="body2">
                                                        <strong>Lịch tái khám:</strong> {format(parseISO(visit.nextVisitDate), 'dd/MM/yyyy')}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                    </Box>
                ))}
            </CardContent>
        </Card>
    );
};

export default MedicalVisitList; 