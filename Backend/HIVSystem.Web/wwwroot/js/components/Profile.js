const Profile = ({ user, onUpdateProfile, successMessage, error }) => {
    const [formData, setFormData] = React.useState({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        dateOfBirth: user?.dateOfBirth || '',
        gender: user?.gender || ''
    });
    const [loading, setLoading] = React.useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onUpdateProfile(formData);
        setLoading(false);
    };

    return React.createElement('div', { className: 'container mt-4' },
        React.createElement('div', { className: 'row justify-content-center' },
            React.createElement('div', { className: 'col-md-8' },
                React.createElement('div', { className: 'card shadow' },
                    React.createElement('div', { className: 'card-header bg-primary text-white text-center' },
                        React.createElement('h3', null,
                            React.createElement('i', { className: 'fas fa-user' }),
                            ' Hồ sơ cá nhân'
                        )
                    ),
                    React.createElement('div', { className: 'card-body p-4' },
                        successMessage && React.createElement('div', { className: 'alert alert-success' },
                            React.createElement('i', { className: 'fas fa-check-circle' }),
                            ' ', successMessage
                        ),
                        error && React.createElement('div', { className: 'alert alert-danger' },
                            React.createElement('i', { className: 'fas fa-exclamation-triangle' }),
                            ' ', error
                        ),
                        React.createElement('form', { onSubmit: handleSubmit },
                            React.createElement('div', { className: 'row' },
                                React.createElement('div', { className: 'col-md-6 mb-3' },
                                    React.createElement('label', { className: 'form-label' }, 'Họ và tên'),
                                    React.createElement('input', {
                                        type: 'text',
                                        name: 'fullName',
                                        className: 'form-control',
                                        value: formData.fullName,
                                        onChange: handleChange
                                    })
                                ),
                                React.createElement('div', { className: 'col-md-6 mb-3' },
                                    React.createElement('label', { className: 'form-label' }, 'Email'),
                                    React.createElement('input', {
                                        type: 'email',
                                        name: 'email',
                                        className: 'form-control',
                                        value: formData.email,
                                        onChange: handleChange
                                    })
                                )
                            ),
                            React.createElement('div', { className: 'row' },
                                React.createElement('div', { className: 'col-md-6 mb-3' },
                                    React.createElement('label', { className: 'form-label' }, 'Số điện thoại'),
                                    React.createElement('input', {
                                        type: 'tel',
                                        name: 'phoneNumber',
                                        className: 'form-control',
                                        value: formData.phoneNumber,
                                        onChange: handleChange
                                    })
                                ),
                                React.createElement('div', { className: 'col-md-6 mb-3' },
                                    React.createElement('label', { className: 'form-label' }, 'Ngày sinh'),
                                    React.createElement('input', {
                                        type: 'date',
                                        name: 'dateOfBirth',
                                        className: 'form-control',
                                        value: formData.dateOfBirth,
                                        onChange: handleChange
                                    })
                                )
                            ),
                            React.createElement('div', { className: 'mb-3' },
                                React.createElement('label', { className: 'form-label' }, 'Địa chỉ'),
                                React.createElement('textarea', {
                                    name: 'address',
                                    className: 'form-control',
                                    rows: 3,
                                    value: formData.address,
                                    onChange: handleChange
                                })
                            ),
                            React.createElement('div', { className: 'mb-3' },
                                React.createElement('label', { className: 'form-label' }, 'Giới tính'),
                                React.createElement('select', {
                                    name: 'gender',
                                    className: 'form-control',
                                    value: formData.gender,
                                    onChange: handleChange
                                },
                                    React.createElement('option', { value: '' }, 'Chọn giới tính'),
                                    React.createElement('option', { value: 'Nam' }, 'Nam'),
                                    React.createElement('option', { value: 'Nữ' }, 'Nữ'),
                                    React.createElement('option', { value: 'Khác' }, 'Khác')
                                )
                            ),
                            React.createElement('div', { className: 'd-grid' },
                                React.createElement('button', {
                                    type: 'submit',
                                    className: 'btn btn-primary btn-lg',
                                    disabled: loading
                                },
                                    loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}; 