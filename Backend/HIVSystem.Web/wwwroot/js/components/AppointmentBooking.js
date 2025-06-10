const AppointmentBooking = ({ user }) => {
    const [doctors, setDoctors] = React.useState([]);
    const [selectedDoctor, setSelectedDoctor] = React.useState('');
    const [availableSlots, setAvailableSlots] = React.useState([]);
    const [selectedDate, setSelectedDate] = React.useState('');
    const [selectedTime, setSelectedTime] = React.useState('');
    const [appointmentType, setAppointmentType] = React.useState('consultation');
    const [isAnonymous, setIsAnonymous] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [messageType, setMessageType] = React.useState('');
    const [formData, setFormData] = React.useState({
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || '',
        dateOfBirth: user?.dateOfBirth || '',
        gender: user?.gender || '',
        address: user?.address || '',
        notes: ''
    });

    // Load available doctors on component mount
    React.useEffect(() => {
        loadAvailableDoctors();
    }, []);

    // Load available time slots when doctor or date changes
    React.useEffect(() => {
        if (selectedDoctor && selectedDate) {
            loadAvailableSlots();
        }
    }, [selectedDoctor, selectedDate]);

    const loadAvailableDoctors = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/appointments/doctors/available');
            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
            } else {
                setMessage('Không thể tải danh sách bác sĩ');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Lỗi kết nối: ' + error.message);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableSlots = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/appointments/doctors/${selectedDoctor}/availability?date=${selectedDate}`);
            if (response.ok) {
                const data = await response.json();
                setAvailableSlots(data.timeSlots || []);
            } else {
                setAvailableSlots([]);
                setMessage('Không có lịch trống cho ngày đã chọn');
                setMessageType('warning');
            }
        } catch (error) {
            setMessage('Lỗi khi tải lịch trống: ' + error.message);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDoctor || !selectedDate || !selectedTime) {
            setMessage('Vui lòng chọn đầy đủ thông tin bác sĩ, ngày và giờ khám');
            setMessageType('error');
            return;
        }

        try {
            setLoading(true);

            const appointmentData = {
                doctorId: parseInt(selectedDoctor),
                appointmentDate: selectedDate,
                appointmentTime: selectedTime,
                appointmentType: appointmentType,
                isAnonymous: isAnonymous,
                patientInfo: isAnonymous ? formData : null,
                notes: formData.notes
            };

            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            });

            if (response.ok) {
                const result = await response.json();
                setMessage(`Đặt lịch thành công! Mã lịch hẹn: ${result.appointmentId}`);
                setMessageType('success');

                // Reset form
                setSelectedDoctor('');
                setSelectedDate('');
                setSelectedTime('');
                setAvailableSlots([]);
                setFormData({
                    fullName: user?.fullName || '',
                    phoneNumber: user?.phoneNumber || '',
                    email: user?.email || '',
                    dateOfBirth: user?.dateOfBirth || '',
                    gender: user?.gender || '',
                    address: user?.address || '',
                    notes: ''
                });
            } else {
                const error = await response.json();
                setMessage(error.message || 'Có lỗi xảy ra khi đặt lịch');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Lỗi kết nối: ' + error.message);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
        return maxDate.toISOString().split('T')[0];
    };

    return React.createElement('div', { className: 'container mt-4' },
        React.createElement('div', { className: 'row justify-content-center' },
            React.createElement('div', { className: 'col-md-10' },
                React.createElement('div', { className: 'card shadow' },
                    React.createElement('div', { className: 'card-header bg-primary text-white' },
                        React.createElement('h3', { className: 'mb-0' },
                            React.createElement('i', { className: 'fas fa-calendar-plus me-2' }),
                            'Đặt Lịch Khám & Điều Trị HIV'
                        )
                    ),
                    React.createElement('div', { className: 'card-body' },
                        // Message display
                        message && React.createElement('div', {
                            className: `alert alert-${messageType === 'error' ? 'danger' : messageType === 'warning' ? 'warning' : 'success'} alert-dismissible fade show`
                        },
                            message,
                            React.createElement('button', {
                                type: 'button',
                                className: 'btn-close',
                                onClick: () => setMessage('')
                            })
                        ),

                        React.createElement('form', { onSubmit: handleSubmit },
                            // Anonymous booking option
                            React.createElement('div', { className: 'row mb-3' },
                                React.createElement('div', { className: 'col-12' },
                                    React.createElement('div', { className: 'form-check' },
                                        React.createElement('input', {
                                            className: 'form-check-input',
                                            type: 'checkbox',
                                            id: 'anonymousBooking',
                                            checked: isAnonymous,
                                            onChange: (e) => setIsAnonymous(e.target.checked)
                                        }),
                                        React.createElement('label', { className: 'form-check-label', htmlFor: 'anonymousBooking' },
                                            React.createElement('i', { className: 'fas fa-user-secret me-1' }),
                                            'Đặt lịch ẩn danh (bảo vệ quyền riêng tư)'
                                        )
                                    )
                                )
                            ),

                            // Doctor selection
                            React.createElement('div', { className: 'row mb-3' },
                                React.createElement('div', { className: 'col-md-6' },
                                    React.createElement('label', { className: 'form-label' },
                                        React.createElement('i', { className: 'fas fa-user-md me-1' }),
                                        'Chọn Bác sĩ *'
                                    ),
                                    React.createElement('select', {
                                        className: 'form-select',
                                        value: selectedDoctor,
                                        onChange: (e) => setSelectedDoctor(e.target.value),
                                        required: true
                                    },
                                        React.createElement('option', { value: '' }, 'Chọn bác sĩ...'),
                                        doctors.map(doctor =>
                                            React.createElement('option', {
                                                key: doctor.id,
                                                value: doctor.id
                                            }, `${doctor.fullName} - ${doctor.specialty}`)
                                        )
                                    )
                                ),
                                React.createElement('div', { className: 'col-md-6' },
                                    React.createElement('label', { className: 'form-label' },
                                        React.createElement('i', { className: 'fas fa-calendar me-1' }),
                                        'Ngày Khám *'
                                    ),
                                    React.createElement('input', {
                                        type: 'date',
                                        className: 'form-control',
                                        value: selectedDate,
                                        onChange: (e) => setSelectedDate(e.target.value),
                                        min: getMinDate(),
                                        max: getMaxDate(),
                                        required: true
                                    })
                                )
                            ),

                            // Time slot selection
                            selectedDoctor && selectedDate && React.createElement('div', { className: 'row mb-3' },
                                React.createElement('div', { className: 'col-12' },
                                    React.createElement('label', { className: 'form-label' },
                                        React.createElement('i', { className: 'fas fa-clock me-1' }),
                                        'Chọn Giờ Khám *'
                                    ),
                                    availableSlots.length > 0 ?
                                        React.createElement('div', { className: 'row' },
                                            availableSlots.map(slot =>
                                                React.createElement('div', { key: slot.time, className: 'col-md-3 mb-2' },
                                                    React.createElement('div', { className: 'form-check' },
                                                        React.createElement('input', {
                                                            className: 'form-check-input',
                                                            type: 'radio',
                                                            name: 'timeSlot',
                                                            id: `time-${slot.time}`,
                                                            value: slot.time,
                                                            checked: selectedTime === slot.time,
                                                            onChange: (e) => setSelectedTime(e.target.value),
                                                            disabled: !slot.isAvailable
                                                        }),
                                                        React.createElement('label', {
                                                            className: `form-check-label ${!slot.isAvailable ? 'text-muted' : ''}`,
                                                            htmlFor: `time-${slot.time}`
                                                        }, slot.time)
                                                    )
                                                )
                                            )
                                        ) :
                                        React.createElement('p', { className: 'text-muted' }, 'Không có lịch trống cho ngày đã chọn')
                                )
                            ),

                            // Appointment type
                            React.createElement('div', { className: 'row mb-3' },
                                React.createElement('div', { className: 'col-md-6' },
                                    React.createElement('label', { className: 'form-label' },
                                        React.createElement('i', { className: 'fas fa-stethoscope me-1' }),
                                        'Loại Khám'
                                    ),
                                    React.createElement('select', {
                                        className: 'form-select',
                                        value: appointmentType,
                                        onChange: (e) => setAppointmentType(e.target.value)
                                    },
                                        React.createElement('option', { value: 'consultation' }, 'Tư vấn'),
                                        React.createElement('option', { value: 'treatment' }, 'Điều trị'),
                                        React.createElement('option', { value: 'followup' }, 'Tái khám'),
                                        React.createElement('option', { value: 'testing' }, 'Xét nghiệm')
                                    )
                                )
                            ),

                            // Patient information (for anonymous booking)
                            isAnonymous && React.createElement('div', { className: 'border rounded p-3 mb-3 bg-light' },
                                React.createElement('h5', { className: 'mb-3' },
                                    React.createElement('i', { className: 'fas fa-user me-1' }),
                                    'Thông Tin Bệnh Nhân'
                                ),
                                React.createElement('div', { className: 'row mb-3' },
                                    React.createElement('div', { className: 'col-md-6' },
                                        React.createElement('label', { className: 'form-label' }, 'Họ và Tên *'),
                                        React.createElement('input', {
                                            type: 'text',
                                            className: 'form-control',
                                            value: formData.fullName,
                                            onChange: (e) => handleInputChange('fullName', e.target.value),
                                            required: isAnonymous
                                        })
                                    ),
                                    React.createElement('div', { className: 'col-md-6' },
                                        React.createElement('label', { className: 'form-label' }, 'Số Điện Thoại *'),
                                        React.createElement('input', {
                                            type: 'tel',
                                            className: 'form-control',
                                            value: formData.phoneNumber,
                                            onChange: (e) => handleInputChange('phoneNumber', e.target.value),
                                            required: isAnonymous
                                        })
                                    )
                                ),
                                React.createElement('div', { className: 'row mb-3' },
                                    React.createElement('div', { className: 'col-md-6' },
                                        React.createElement('label', { className: 'form-label' }, 'Email'),
                                        React.createElement('input', {
                                            type: 'email',
                                            className: 'form-control',
                                            value: formData.email,
                                            onChange: (e) => handleInputChange('email', e.target.value)
                                        })
                                    ),
                                    React.createElement('div', { className: 'col-md-6' },
                                        React.createElement('label', { className: 'form-label' }, 'Ngày Sinh'),
                                        React.createElement('input', {
                                            type: 'date',
                                            className: 'form-control',
                                            value: formData.dateOfBirth,
                                            onChange: (e) => handleInputChange('dateOfBirth', e.target.value)
                                        })
                                    )
                                ),
                                React.createElement('div', { className: 'row mb-3' },
                                    React.createElement('div', { className: 'col-md-6' },
                                        React.createElement('label', { className: 'form-label' }, 'Giới Tính'),
                                        React.createElement('select', {
                                            className: 'form-select',
                                            value: formData.gender,
                                            onChange: (e) => handleInputChange('gender', e.target.value)
                                        },
                                            React.createElement('option', { value: '' }, 'Chọn giới tính'),
                                            React.createElement('option', { value: 'Male' }, 'Nam'),
                                            React.createElement('option', { value: 'Female' }, 'Nữ'),
                                            React.createElement('option', { value: 'Other' }, 'Khác')
                                        )
                                    ),
                                    React.createElement('div', { className: 'col-md-6' },
                                        React.createElement('label', { className: 'form-label' }, 'Địa Chỉ'),
                                        React.createElement('input', {
                                            type: 'text',
                                            className: 'form-control',
                                            value: formData.address,
                                            onChange: (e) => handleInputChange('address', e.target.value)
                                        })
                                    )
                                )
                            ),

                            // Notes
                            React.createElement('div', { className: 'row mb-3' },
                                React.createElement('div', { className: 'col-12' },
                                    React.createElement('label', { className: 'form-label' },
                                        React.createElement('i', { className: 'fas fa-notes-medical me-1' }),
                                        'Ghi Chú'
                                    ),
                                    React.createElement('textarea', {
                                        className: 'form-control',
                                        rows: 3,
                                        value: formData.notes,
                                        onChange: (e) => handleInputChange('notes', e.target.value),
                                        placeholder: 'Mô tả triệu chứng hoặc lý do khám...'
                                    })
                                )
                            ),

                            // Submit button
                            React.createElement('div', { className: 'row' },
                                React.createElement('div', { className: 'col-12 text-center' },
                                    React.createElement('button', {
                                        type: 'submit',
                                        className: 'btn btn-primary btn-lg me-2',
                                        disabled: loading
                                    },
                                        loading ?
                                            React.createElement('span', null,
                                                React.createElement('span', { className: 'spinner-border spinner-border-sm me-2' }),
                                                'Đang xử lý...'
                                            ) :
                                            React.createElement('span', null,
                                                React.createElement('i', { className: 'fas fa-calendar-check me-1' }),
                                                'Đặt Lịch Khám'
                                            )
                                    ),
                                    React.createElement('button', {
                                        type: 'button',
                                        className: 'btn btn-secondary btn-lg',
                                        onClick: () => window.navigateTo('/')
                                    },
                                        React.createElement('i', { className: 'fas fa-arrow-left me-1' }),
                                        'Quay Lại'
                                    )
                                )
                            )
                        )
                    )
                )
            )
        ),

        // Information section
        React.createElement('div', { className: 'row mt-4' },
            React.createElement('div', { className: 'col-md-12' },
                React.createElement('div', { className: 'card border-info' },
                    React.createElement('div', { className: 'card-header bg-info text-white' },
                        React.createElement('h5', { className: 'mb-0' },
                            React.createElement('i', { className: 'fas fa-info-circle me-2' }),
                            'Thông Tin Quan Trọng'
                        )
                    ),
                    React.createElement('div', { className: 'card-body' },
                        React.createElement('div', { className: 'row' },
                            React.createElement('div', { className: 'col-md-6' },
                                React.createElement('h6', null,
                                    React.createElement('i', { className: 'fas fa-shield-alt text-success me-1' }),
                                    'Bảo Mật & Riêng Tư'
                                ),
                                React.createElement('ul', { className: 'list-unstyled' },
                                    React.createElement('li', null, '• Thông tin được mã hóa và bảo mật tuyệt đối'),
                                    React.createElement('li', null, '• Tùy chọn đặt lịch ẩn danh để bảo vệ danh tính'),
                                    React.createElement('li', null, '• Tuân thủ nghiêm ngặt quy định bảo mật y tế')
                                )
                            ),
                            React.createElement('div', { className: 'col-md-6' },
                                React.createElement('h6', null,
                                    React.createElement('i', { className: 'fas fa-clock text-primary me-1' }),
                                    'Lưu Ý Đặt Lịch'
                                ),
                                React.createElement('ul', { className: 'list-unstyled' },
                                    React.createElement('li', null, '• Có thể đặt lịch trước tối đa 30 ngày'),
                                    React.createElement('li', null, '• Vui lòng đến trước 15 phút so với giờ hẹn'),
                                    React.createElement('li', null, '• Liên hệ hotline để thay đổi hoặc hủy lịch')
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}; 