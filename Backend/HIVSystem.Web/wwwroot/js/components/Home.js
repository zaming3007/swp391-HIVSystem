const Home = ({ user, successMessage }) => {
    return React.createElement('div', { className: 'container' },
        // Hero Section
        React.createElement('div', { className: 'text-center py-5' },
            React.createElement('h1', { className: 'display-4' }, '🏥 HIV Healthcare System'),
            React.createElement('p', { className: 'lead' }, 'Hệ thống Quản lý Chăm sóc Sức khỏe HIV/AIDS'),
            React.createElement('p', { className: 'text-muted' }, 'Phát triển bởi Nhóm SWP391_G6')
        ),

        // Success Messages
        successMessage && React.createElement('div', { className: 'alert alert-success alert-dismissible fade show' },
            successMessage,
            React.createElement('button', {
                type: 'button',
                className: 'btn-close',
                'data-bs-dismiss': 'alert'
            })
        ),

        // Logged in user info
        user ? React.createElement('div', { className: 'row' },
            React.createElement('div', { className: 'col-md-8 offset-md-2' },
                React.createElement('div', { className: 'card border-success' },
                    React.createElement('div', { className: 'card-header bg-success text-white text-center' },
                        React.createElement('h4', null, '✅ Đăng nhập thành công!')
                    ),
                    React.createElement('div', { className: 'card-body text-center' },
                        React.createElement('h5', null, 'Chào mừng, ', user.fullName, '!'),
                        React.createElement('p', { className: 'text-muted' }, 'Username: ', user.username),
                        React.createElement('div', { className: 'mt-4' },
                            React.createElement('a', {
                                href: '#',
                                className: 'btn btn-primary btn-lg me-3',
                                onClick: (e) => { e.preventDefault(); window.navigateTo('/dashboard'); }
                            },
                                React.createElement('i', { className: 'fas fa-tachometer-alt' }),
                                ' Vào Bảng điều khiển'
                            ),
                            React.createElement('button', {
                                type: 'button',
                                className: 'btn btn-outline-danger btn-lg',
                                onClick: () => window.logout()
                            },
                                React.createElement('i', { className: 'fas fa-sign-out-alt' }),
                                ' Đăng xuất'
                            )
                        )
                    )
                )
            )
        ) :
            // Login/Register Section for non-logged users
            React.createElement('div', { className: 'row' },
                React.createElement('div', { className: 'col-md-8 offset-md-2' },
                    React.createElement('div', { className: 'card' },
                        React.createElement('div', { className: 'card-header text-center bg-primary text-white' },
                            React.createElement('h3', null, '🔐 Truy cập Hệ thống')
                        ),
                        React.createElement('div', { className: 'card-body text-center' },
                            React.createElement('p', { className: 'mb-4' }, 'Hệ thống quản lý thông tin bệnh nhân HIV, bác sĩ, và các dịch vụ chăm sóc sức khỏe.'),
                            React.createElement('div', { className: 'd-grid gap-2 d-md-flex justify-content-md-center' },
                                React.createElement('a', {
                                    href: '#',
                                    className: 'btn btn-primary btn-lg me-md-2',
                                    onClick: (e) => { e.preventDefault(); window.navigateTo('/login'); }
                                },
                                    React.createElement('i', { className: 'fas fa-sign-in-alt' }),
                                    ' Đăng nhập'
                                ),
                                React.createElement('a', {
                                    href: '#',
                                    className: 'btn btn-success btn-lg',
                                    onClick: (e) => { e.preventDefault(); window.navigateTo('/register'); }
                                },
                                    React.createElement('i', { className: 'fas fa-user-plus' }),
                                    ' Đăng ký tài khoản'
                                )
                            )
                        )
                    )
                )
            ),

        // System Features
        React.createElement('div', { className: 'row mt-5' },
            React.createElement('div', { className: 'col-12' },
                React.createElement('h4', { className: 'text-center mb-4' }, '📋 Tính năng Hệ thống')
            )
        ),

        React.createElement('div', { className: 'row' },
            React.createElement('div', { className: 'col-md-4' },
                React.createElement('div', { className: 'card h-100' },
                    React.createElement('div', { className: 'card-body text-center' },
                        React.createElement('i', { className: 'fas fa-users fa-3x text-primary mb-3' }),
                        React.createElement('h5', { className: 'card-title' }, 'Quản lý Người dùng'),
                        React.createElement('p', { className: 'card-text' }, 'Đăng ký, đăng nhập và quản lý thông tin bác sĩ, bệnh nhân, nhân viên.')
                    )
                )
            ),
            React.createElement('div', { className: 'col-md-4' },
                React.createElement('div', { className: 'card h-100' },
                    React.createElement('div', { className: 'card-body text-center' },
                        React.createElement('i', { className: 'fas fa-calendar-check fa-3x text-success mb-3' }),
                        React.createElement('h5', { className: 'card-title' }, 'Lịch hẹn'),
                        React.createElement('p', { className: 'card-text' }, 'Đặt lịch khám, theo dõi cuộc hẹn và quản lý thời gian khám bệnh.')
                    )
                )
            ),
            React.createElement('div', { className: 'col-md-4' },
                React.createElement('div', { className: 'card h-100' },
                    React.createElement('div', { className: 'card-body text-center' },
                        React.createElement('i', { className: 'fas fa-pills fa-3x text-info mb-3' }),
                        React.createElement('h5', { className: 'card-title' }, 'Thuốc ARV'),
                        React.createElement('p', { className: 'card-text' }, 'Quản lý thuốc kháng virus, theo dõi liều lượng và kế hoạch điều trị.')
                    )
                )
            )
        ),

        React.createElement('div', { className: 'row mt-4' },
            React.createElement('div', { className: 'col-md-6' },
                React.createElement('div', { className: 'card h-100' },
                    React.createElement('div', { className: 'card-body text-center' },
                        React.createElement('i', { className: 'fas fa-flask fa-3x text-warning mb-3' }),
                        React.createElement('h5', { className: 'card-title' }, 'Kết quả Xét nghiệm'),
                        React.createElement('p', { className: 'card-text' }, 'Theo dõi và quản lý kết quả xét nghiệm HIV, CD4, viral load.')
                    )
                )
            ),
            React.createElement('div', { className: 'col-md-6' },
                React.createElement('div', { className: 'card h-100' },
                    React.createElement('div', { className: 'card-body text-center' },
                        React.createElement('i', { className: 'fas fa-chart-line fa-3x text-danger mb-3' }),
                        React.createElement('h5', { className: 'card-title' }, 'Kế hoạch Điều trị'),
                        React.createElement('p', { className: 'card-text' }, 'Lập và theo dõi kế hoạch điều trị cá nhân cho từng bệnh nhân.')
                    )
                )
            )
        )
    );
}; 