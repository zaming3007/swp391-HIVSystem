const Register = ({ onRegister, error }) => {
    const [formData, setFormData] = React.useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
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
        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        setLoading(true);
        await onRegister(formData);
        setLoading(false);
    };

    return React.createElement('div', { className: 'min-vh-100 d-flex align-items-center', style: { background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' } },
        React.createElement('div', { className: 'container' },
            React.createElement('div', { className: 'row justify-content-center' },
                React.createElement('div', { className: 'col-md-6 col-lg-5' },
                    React.createElement('div', { className: 'card shadow border-0', style: { borderRadius: '15px' } },
                        React.createElement('div', { className: 'card-header text-center bg-success text-white', style: { borderRadius: '15px 15px 0 0' } },
                            React.createElement('h3', null,
                                React.createElement('i', { className: 'fas fa-user-plus' }),
                                ' Đăng ký tài khoản'
                            ),
                            React.createElement('p', { className: 'mb-0' }, 'Tạo tài khoản khách hàng mới')
                        ),
                        React.createElement('div', { className: 'card-body p-4' },
                            error && React.createElement('div', { className: 'alert alert-danger' },
                                React.createElement('i', { className: 'fas fa-exclamation-triangle' }),
                                ' ', error
                            ),
                            React.createElement('form', { onSubmit: handleSubmit },
                                React.createElement('div', { className: 'form-group mb-3' },
                                    React.createElement('label', { className: 'form-label' },
                                        React.createElement('i', { className: 'fas fa-user' }),
                                        ' Tên đăng nhập *'
                                    ),
                                    React.createElement('input', {
                                        type: 'text',
                                        name: 'username',
                                        className: 'form-control',
                                        placeholder: 'Nhập tên đăng nhập',
                                        value: formData.username,
                                        onChange: handleChange,
                                        required: true,
                                        style: { borderRadius: '10px', padding: '12px 15px' }
                                    })
                                ),
                                React.createElement('div', { className: 'form-group mb-3' },
                                    React.createElement('label', { className: 'form-label' },
                                        React.createElement('i', { className: 'fas fa-envelope' }),
                                        ' Email *'
                                    ),
                                    React.createElement('input', {
                                        type: 'email',
                                        name: 'email',
                                        className: 'form-control',
                                        placeholder: 'Nhập địa chỉ email',
                                        value: formData.email,
                                        onChange: handleChange,
                                        required: true,
                                        style: { borderRadius: '10px', padding: '12px 15px' }
                                    })
                                ),
                                React.createElement('div', { className: 'form-group mb-3' },
                                    React.createElement('label', { className: 'form-label' },
                                        React.createElement('i', { className: 'fas fa-lock' }),
                                        ' Mật khẩu *'
                                    ),
                                    React.createElement('input', {
                                        type: 'password',
                                        name: 'password',
                                        className: 'form-control',
                                        placeholder: 'Nhập mật khẩu',
                                        value: formData.password,
                                        onChange: handleChange,
                                        required: true,
                                        style: { borderRadius: '10px', padding: '12px 15px' }
                                    })
                                ),
                                React.createElement('div', { className: 'form-group mb-4' },
                                    React.createElement('label', { className: 'form-label' },
                                        React.createElement('i', { className: 'fas fa-lock' }),
                                        ' Xác nhận mật khẩu *'
                                    ),
                                    React.createElement('input', {
                                        type: 'password',
                                        name: 'confirmPassword',
                                        className: 'form-control',
                                        placeholder: 'Nhập lại mật khẩu',
                                        value: formData.confirmPassword,
                                        onChange: handleChange,
                                        required: true,
                                        style: { borderRadius: '10px', padding: '12px 15px' }
                                    })
                                ),
                                React.createElement('div', { className: 'd-grid' },
                                    React.createElement('button', {
                                        type: 'submit',
                                        className: 'btn btn-success btn-lg',
                                        disabled: loading,
                                        style: { borderRadius: '10px', padding: '12px 20px' }
                                    },
                                        loading ?
                                            React.createElement('span', null,
                                                React.createElement('span', {
                                                    className: 'spinner-border spinner-border-sm me-2',
                                                    role: 'status',
                                                    'aria-hidden': 'true'
                                                }),
                                                'Đang đăng ký...'
                                            ) :
                                            React.createElement('span', null,
                                                React.createElement('i', { className: 'fas fa-user-plus' }),
                                                ' Đăng ký tài khoản'
                                            )
                                    )
                                )
                            ),
                            React.createElement('div', { className: 'text-center my-3' },
                                React.createElement('hr', { className: 'my-3' }),
                                React.createElement('small', { className: 'text-muted' }, 'Đã có tài khoản?')
                            ),
                            React.createElement('div', { className: 'd-grid' },
                                React.createElement('a', {
                                    href: '#',
                                    className: 'btn btn-outline-primary btn-lg',
                                    style: { borderRadius: '10px', padding: '12px 20px' },
                                    onClick: (e) => { e.preventDefault(); window.navigateTo('/login'); }
                                },
                                    React.createElement('i', { className: 'fas fa-sign-in-alt' }),
                                    ' Đăng nhập ngay'
                                )
                            ),
                            React.createElement('div', { className: 'mt-3 text-center' },
                                React.createElement('small', { className: 'text-muted' },
                                    React.createElement('i', { className: 'fas fa-info-circle' }),
                                    ' Sau khi đăng ký, bạn có thể cập nhật thông tin cá nhân trong phần Hồ sơ'
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}; 