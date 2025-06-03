const Profile = ({ user, onUpdateProfile, successMessage, error }) => {
    const [activeTab, setActiveTab] = React.useState('info');
    const [editMode, setEditMode] = React.useState(false);
    const [formData, setFormData] = React.useState({
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user?.gender || '',
        address: user?.address || ''
    });
    const [appointments, setAppointments] = React.useState([]);
    const [loadingAppointments, setLoadingAppointments] = React.useState(false);

    // Set active tab từ external call
    React.useEffect(() => {
        window.setProfileTab = (tab) => {
            setActiveTab(tab);
        };
    }, []);

    // Load appointments when switching to appointments tab
    React.useEffect(() => {
        if (activeTab === 'appointments') {
            loadAppointments();
        }
    }, [activeTab]);

    const loadAppointments = async () => {
        setLoadingAppointments(true);
        try {
            const response = await fetch('/api/appointments/my-appointments');
            if (response.ok) {
                const data = await response.json();
                setAppointments(data.appointments);
            } else {
                console.error('Failed to load appointments');
                setAppointments([]);
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
            setAppointments([]);
        } finally {
            setLoadingAppointments(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateProfile(formData);
        setEditMode(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'Scheduled': { class: 'bg-primary', text: 'Đã Đặt Lịch', icon: 'calendar-check' },
            'Confirmed': { class: 'bg-success', text: 'Đã Xác Nhận', icon: 'check-circle' },
            'Completed': { class: 'bg-secondary', text: 'Hoàn Thành', icon: 'check-double' },
            'Cancelled': { class: 'bg-danger', text: 'Đã Hủy', icon: 'times-circle' },
            'No Show': { class: 'bg-warning', text: 'Không Đến', icon: 'exclamation-triangle' }
        };

        const config = statusConfig[status] || { class: 'bg-secondary', text: status, icon: 'question' };

        return React.createElement('span', {
            className: `badge ${config.class} d-inline-flex align-items-center gap-1`
        }, [
            React.createElement('i', { key: 'icon', className: `fas fa-${config.icon}` }),
            config.text
        ]);
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'Miễn phí';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return React.createElement('div', { className: 'container-fluid py-4' }, [
        // Header với avatar và thông tin cơ bản
        React.createElement('div', { key: 'header', className: 'row mb-4' },
            React.createElement('div', { className: 'col-12' },
                React.createElement('div', { className: 'card border-0 shadow-sm bg-gradient' },
                    React.createElement('div', { className: 'card-body text-center py-5' }, [
                        React.createElement('div', { key: 'avatar', className: 'mb-3' },
                            React.createElement('div', {
                                className: 'rounded-circle mx-auto d-flex align-items-center justify-content-center',
                                style: {
                                    width: '120px',
                                    height: '120px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontSize: '48px',
                                    fontWeight: 'bold'
                                }
                            }, user?.fullName?.charAt(0) || 'U')
                        ),
                        React.createElement('h2', { key: 'name', className: 'mb-2 text-dark' }, user?.fullName),
                        React.createElement('p', { key: 'username', className: 'text-muted mb-1' },
                            React.createElement('i', { className: 'fas fa-user me-2' }),
                            user?.username
                        ),
                        React.createElement('p', { key: 'email', className: 'text-muted mb-3' },
                            React.createElement('i', { className: 'fas fa-envelope me-2' }),
                            user?.email
                        ),
                        React.createElement('div', { key: 'stats', className: 'row justify-content-center' }, [
                            React.createElement('div', { key: 'stat1', className: 'col-md-3 col-6 mb-2' },
                                React.createElement('div', { className: 'text-center p-3 bg-white rounded shadow-sm' }, [
                                    React.createElement('i', { key: 'icon', className: 'fas fa-calendar-check fa-2x text-primary mb-2' }),
                                    React.createElement('h5', { key: 'count', className: 'mb-1' }, appointments.length),
                                    React.createElement('small', { key: 'label', className: 'text-muted' }, 'Lịch Khám')
                                ])
                            ),
                            React.createElement('div', { key: 'stat2', className: 'col-md-3 col-6 mb-2' },
                                React.createElement('div', { className: 'text-center p-3 bg-white rounded shadow-sm' }, [
                                    React.createElement('i', { key: 'icon', className: 'fas fa-shield-check fa-2x text-success mb-2' }),
                                    React.createElement('h5', { key: 'count', className: 'mb-1' }, 'Đã Xác Minh'),
                                    React.createElement('small', { key: 'label', className: 'text-muted' }, 'Tài Khoản')
                                ])
                            )
                        ])
                    ])
                )
            )
        ),

        // Tab Navigation
        React.createElement('div', { key: 'tabs', className: 'row mb-4' },
            React.createElement('div', { className: 'col-12' },
                React.createElement('ul', { className: 'nav nav-pills nav-fill bg-white rounded shadow-sm p-1' }, [
                    React.createElement('li', { key: 'tab1', className: 'nav-item' },
                        React.createElement('button', {
                            className: `nav-link ${activeTab === 'info' ? 'active' : ''}`,
                            onClick: () => setActiveTab('info')
                        }, [
                            React.createElement('i', { key: 'icon', className: 'fas fa-user me-2' }),
                            'Thông Tin Cá Nhân'
                        ])
                    ),
                    React.createElement('li', { key: 'tab2', className: 'nav-item' },
                        React.createElement('button', {
                            className: `nav-link ${activeTab === 'appointments' ? 'active' : ''}`,
                            onClick: () => setActiveTab('appointments')
                        }, [
                            React.createElement('i', { key: 'icon', className: 'fas fa-calendar-alt me-2' }),
                            'Lịch Đã Đặt'
                        ])
                    )
                ])
            )
        ),

        // Success/Error Messages
        successMessage && React.createElement('div', { key: 'success', className: 'row mb-3' },
            React.createElement('div', { className: 'col-12' },
                React.createElement('div', { className: 'alert alert-success alert-dismissible fade show' }, [
                    React.createElement('i', { key: 'icon', className: 'fas fa-check-circle me-2' }),
                    successMessage,
                    React.createElement('button', {
                        key: 'close',
                        type: 'button',
                        className: 'btn-close',
                        'data-bs-dismiss': 'alert'
                    })
                ])
            )
        ),

        error && React.createElement('div', { key: 'error', className: 'row mb-3' },
            React.createElement('div', { className: 'col-12' },
                React.createElement('div', { className: 'alert alert-danger alert-dismissible fade show' }, [
                    React.createElement('i', { key: 'icon', className: 'fas fa-exclamation-triangle me-2' }),
                    error,
                    React.createElement('button', {
                        key: 'close',
                        type: 'button',
                        className: 'btn-close',
                        'data-bs-dismiss': 'alert'
                    })
                ])
            )
        ),

        // Tab Content
        React.createElement('div', { key: 'content', className: 'row' },
            React.createElement('div', { className: 'col-12' },
                activeTab === 'info' ?
                    // Thông tin cá nhân tab
                    React.createElement('div', { className: 'card border-0 shadow-sm' },
                        React.createElement('div', { className: 'card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3' }, [
                            React.createElement('h5', { key: 'title', className: 'mb-0 d-flex align-items-center' }, [
                                React.createElement('i', { key: 'icon', className: 'fas fa-user-edit me-2 text-primary' }),
                                'Thông Tin Cá Nhân'
                            ]),
                            React.createElement('button', {
                                key: 'edit',
                                className: `btn ${editMode ? 'btn-secondary' : 'btn-primary'} btn-sm`,
                                onClick: () => setEditMode(!editMode)
                            }, [
                                React.createElement('i', { key: 'icon', className: `fas fa-${editMode ? 'times' : 'edit'} me-1` }),
                                editMode ? 'Hủy' : 'Chỉnh Sửa'
                            ])
                        ]),
                        React.createElement('div', { className: 'card-body p-4' },
                            editMode ?
                                // Edit form
                                React.createElement('form', { onSubmit: handleSubmit },
                                    React.createElement('div', { className: 'row g-3' }, [
                                        React.createElement('div', { key: 'fullName', className: 'col-md-6' }, [
                                            React.createElement('label', { className: 'form-label fw-semibold' },
                                                React.createElement('i', { className: 'fas fa-user me-2' }), 'Họ và Tên'
                                            ),
                                            React.createElement('input', {
                                                type: 'text',
                                                className: 'form-control',
                                                name: 'fullName',
                                                value: formData.fullName,
                                                onChange: handleInputChange,
                                                required: true
                                            })
                                        ]),
                                        React.createElement('div', { key: 'phoneNumber', className: 'col-md-6' }, [
                                            React.createElement('label', { className: 'form-label fw-semibold' },
                                                React.createElement('i', { className: 'fas fa-phone me-2' }), 'Số Điện Thoại'
                                            ),
                                            React.createElement('input', {
                                                type: 'tel',
                                                className: 'form-control',
                                                name: 'phoneNumber',
                                                value: formData.phoneNumber,
                                                onChange: handleInputChange
                                            })
                                        ]),
                                        React.createElement('div', { key: 'dateOfBirth', className: 'col-md-6' }, [
                                            React.createElement('label', { className: 'form-label fw-semibold' },
                                                React.createElement('i', { className: 'fas fa-birthday-cake me-2' }), 'Ngày Sinh'
                                            ),
                                            React.createElement('input', {
                                                type: 'date',
                                                className: 'form-control',
                                                name: 'dateOfBirth',
                                                value: formData.dateOfBirth,
                                                onChange: handleInputChange
                                            })
                                        ]),
                                        React.createElement('div', { key: 'gender', className: 'col-md-6' }, [
                                            React.createElement('label', { className: 'form-label fw-semibold' },
                                                React.createElement('i', { className: 'fas fa-venus-mars me-2' }), 'Giới Tính'
                                            ),
                                            React.createElement('select', {
                                                className: 'form-select',
                                                name: 'gender',
                                                value: formData.gender,
                                                onChange: handleInputChange
                                            }, [
                                                React.createElement('option', { key: 'empty', value: '' }, 'Chọn giới tính'),
                                                React.createElement('option', { key: 'male', value: 'Male' }, 'Nam'),
                                                React.createElement('option', { key: 'female', value: 'Female' }, 'Nữ'),
                                                React.createElement('option', { key: 'other', value: 'Other' }, 'Khác')
                                            ])
                                        ]),
                                        React.createElement('div', { key: 'address', className: 'col-12' }, [
                                            React.createElement('label', { className: 'form-label fw-semibold' },
                                                React.createElement('i', { className: 'fas fa-map-marker-alt me-2' }), 'Địa Chỉ'
                                            ),
                                            React.createElement('textarea', {
                                                className: 'form-control',
                                                name: 'address',
                                                rows: 3,
                                                value: formData.address,
                                                onChange: handleInputChange
                                            })
                                        ]),
                                        React.createElement('div', { key: 'buttons', className: 'col-12 text-end' }, [
                                            React.createElement('button', {
                                                key: 'cancel',
                                                type: 'button',
                                                className: 'btn btn-outline-secondary me-2',
                                                onClick: () => setEditMode(false)
                                            }, [
                                                React.createElement('i', { key: 'icon', className: 'fas fa-times me-1' }),
                                                'Hủy'
                                            ]),
                                            React.createElement('button', {
                                                key: 'save',
                                                type: 'submit',
                                                className: 'btn btn-primary'
                                            }, [
                                                React.createElement('i', { key: 'icon', className: 'fas fa-save me-1' }),
                                                'Lưu Thay Đổi'
                                            ])
                                        ])
                                    ])
                                ) :
                                // View mode
                                React.createElement('div', { className: 'row g-4' }, [
                                    React.createElement('div', { key: 'col1', className: 'col-md-6' },
                                        React.createElement('div', { className: 'border-start border-primary border-4 ps-3' }, [
                                            React.createElement('h6', { key: 'label', className: 'text-muted mb-1' },
                                                React.createElement('i', { className: 'fas fa-user me-2' }), 'Họ và Tên'
                                            ),
                                            React.createElement('p', { key: 'value', className: 'fs-5 mb-0' }, user?.fullName || 'Chưa cập nhật')
                                        ])
                                    ),
                                    React.createElement('div', { key: 'col2', className: 'col-md-6' },
                                        React.createElement('div', { className: 'border-start border-success border-4 ps-3' }, [
                                            React.createElement('h6', { key: 'label', className: 'text-muted mb-1' },
                                                React.createElement('i', { className: 'fas fa-phone me-2' }), 'Số Điện Thoại'
                                            ),
                                            React.createElement('p', { key: 'value', className: 'fs-5 mb-0' }, user?.phoneNumber || 'Chưa cập nhật')
                                        ])
                                    ),
                                    React.createElement('div', { key: 'col3', className: 'col-md-6' },
                                        React.createElement('div', { className: 'border-start border-info border-4 ps-3' }, [
                                            React.createElement('h6', { key: 'label', className: 'text-muted mb-1' },
                                                React.createElement('i', { className: 'fas fa-birthday-cake me-2' }), 'Ngày Sinh'
                                            ),
                                            React.createElement('p', { key: 'value', className: 'fs-5 mb-0' }, formatDate(user?.dateOfBirth))
                                        ])
                                    ),
                                    React.createElement('div', { key: 'col4', className: 'col-md-6' },
                                        React.createElement('div', { className: 'border-start border-warning border-4 ps-3' }, [
                                            React.createElement('h6', { key: 'label', className: 'text-muted mb-1' },
                                                React.createElement('i', { className: 'fas fa-venus-mars me-2' }), 'Giới Tính'
                                            ),
                                            React.createElement('p', { key: 'value', className: 'fs-5 mb-0' },
                                                user?.gender === 'Male' ? 'Nam' :
                                                    user?.gender === 'Female' ? 'Nữ' :
                                                        user?.gender === 'Other' ? 'Khác' : 'Chưa cập nhật'
                                            )
                                        ])
                                    ),
                                    React.createElement('div', { key: 'col5', className: 'col-12' },
                                        React.createElement('div', { className: 'border-start border-secondary border-4 ps-3' }, [
                                            React.createElement('h6', { key: 'label', className: 'text-muted mb-1' },
                                                React.createElement('i', { className: 'fas fa-map-marker-alt me-2' }), 'Địa Chỉ'
                                            ),
                                            React.createElement('p', { key: 'value', className: 'fs-5 mb-0' }, user?.address || 'Chưa cập nhật')
                                        ])
                                    )
                                ])
                        )
                    ) :
                    // Lịch đã đặt tab
                    React.createElement('div', { className: 'card border-0 shadow-sm' }, [
                        React.createElement('div', { key: 'header', className: 'card-header bg-white border-bottom-0 py-3' },
                            React.createElement('h5', { className: 'mb-0 d-flex align-items-center' }, [
                                React.createElement('i', { key: 'icon', className: 'fas fa-calendar-alt me-2 text-primary' }),
                                `Lịch Đã Đặt (${appointments.length})`
                            ])
                        ),
                        React.createElement('div', { key: 'body', className: 'card-body p-0' },
                            loadingAppointments ?
                                React.createElement('div', { className: 'text-center py-5' }, [
                                    React.createElement('div', { key: 'spinner', className: 'spinner-border text-primary mb-3' }),
                                    React.createElement('p', { key: 'text', className: 'text-muted' }, 'Đang tải danh sách lịch khám...')
                                ]) :
                                appointments.length === 0 ?
                                    React.createElement('div', { className: 'text-center py-5' }, [
                                        React.createElement('i', { key: 'icon', className: 'fas fa-calendar-times fa-3x text-muted mb-3' }),
                                        React.createElement('h5', { key: 'title', className: 'text-muted' }, 'Chưa có lịch khám nào'),
                                        React.createElement('p', { key: 'desc', className: 'text-muted' }, 'Bạn chưa đặt lịch khám nào trong hệ thống'),
                                        React.createElement('button', {
                                            key: 'book',
                                            className: 'btn btn-primary',
                                            onClick: () => window.navigateTo('/appointment-booking')
                                        }, [
                                            React.createElement('i', { key: 'icon', className: 'fas fa-calendar-plus me-2' }),
                                            'Đặt Lịch Khám Ngay'
                                        ])
                                    ]) :
                                    React.createElement('div', { className: 'table-responsive' },
                                        React.createElement('table', { className: 'table table-hover mb-0' }, [
                                            React.createElement('thead', { key: 'thead', className: 'table-light' },
                                                React.createElement('tr', {}, [
                                                    React.createElement('th', { key: 'date', className: 'border-0' }, 'Ngày & Giờ'),
                                                    React.createElement('th', { key: 'doctor', className: 'border-0' }, 'Bác Sĩ'),
                                                    React.createElement('th', { key: 'facility', className: 'border-0' }, 'Cơ Sở Y Tế'),
                                                    React.createElement('th', { key: 'purpose', className: 'border-0' }, 'Mục Đích'),
                                                    React.createElement('th', { key: 'fee', className: 'border-0' }, 'Chi Phí'),
                                                    React.createElement('th', { key: 'status', className: 'border-0' }, 'Trạng Thái')
                                                ])
                                            ),
                                            React.createElement('tbody', { key: 'tbody' },
                                                appointments.map((apt, index) =>
                                                    React.createElement('tr', { key: apt.appointmentID || index }, [
                                                        React.createElement('td', { key: 'date', className: 'py-3' }, [
                                                            React.createElement('div', { key: 'date', className: 'fw-semibold' },
                                                                formatDate(apt.appointmentDate)
                                                            ),
                                                            React.createElement('small', { key: 'time', className: 'text-muted' },
                                                                apt.appointmentTime
                                                            )
                                                        ]),
                                                        React.createElement('td', { key: 'doctor', className: 'py-3' },
                                                            React.createElement('div', { className: 'd-flex align-items-center' }, [
                                                                React.createElement('i', { key: 'icon', className: 'fas fa-user-md me-2 text-primary' }),
                                                                apt.doctorName
                                                            ])
                                                        ),
                                                        React.createElement('td', { key: 'facility', className: 'py-3' }, [
                                                            React.createElement('div', { key: 'name', className: 'fw-semibold' }, apt.facilityName),
                                                            React.createElement('small', { key: 'address', className: 'text-muted d-block' }, apt.facilityAddress)
                                                        ]),
                                                        React.createElement('td', { key: 'purpose', className: 'py-3' }, apt.purpose),
                                                        React.createElement('td', { key: 'fee', className: 'py-3' },
                                                            React.createElement('span', { className: 'fw-semibold text-success' },
                                                                formatCurrency(apt.consultationFee)
                                                            )
                                                        ),
                                                        React.createElement('td', { key: 'status', className: 'py-3' },
                                                            getStatusBadge(apt.status)
                                                        )
                                                    ])
                                                )
                                            )
                                        ])
                                    )
                        )
                    ])
            )
        )
    ]);
}; 