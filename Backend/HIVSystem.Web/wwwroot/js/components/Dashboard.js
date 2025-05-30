const Dashboard = ({ user }) => {
    return React.createElement('div', { className: 'container mt-4' },
        React.createElement('div', { className: 'row' },
            React.createElement('div', { className: 'col-12' },
                React.createElement('h2', { className: 'mb-4' },
                    React.createElement('i', { className: 'fas fa-tachometer-alt' }),
                    ' Bảng điều khiển'
                )
            )
        ),
        React.createElement('div', { className: 'row' },
            React.createElement('div', { className: 'col-md-4' },
                React.createElement('div', { className: 'card text-white bg-primary mb-3' },
                    React.createElement('div', { className: 'card-header' },
                        React.createElement('i', { className: 'fas fa-user' }),
                        ' Thông tin cá nhân'
                    ),
                    React.createElement('div', { className: 'card-body' },
                        React.createElement('h5', { className: 'card-title' }, user?.fullName || 'Chưa cập nhật'),
                        React.createElement('p', { className: 'card-text' }, 'Role: ', user?.roleName || 'Customer'),
                        React.createElement('a', {
                            href: '#',
                            className: 'btn btn-light',
                            onClick: (e) => { e.preventDefault(); window.navigateTo('/profile'); }
                        }, 'Cập nhật hồ sơ')
                    )
                )
            ),
            React.createElement('div', { className: 'col-md-4' },
                React.createElement('div', { className: 'card text-white bg-success mb-3' },
                    React.createElement('div', { className: 'card-header' },
                        React.createElement('i', { className: 'fas fa-calendar-check' }),
                        ' Lịch hẹn'
                    ),
                    React.createElement('div', { className: 'card-body' },
                        React.createElement('h5', { className: 'card-title' }, '0'),
                        React.createElement('p', { className: 'card-text' }, 'Lịch hẹn sắp tới'),
                        React.createElement('a', { href: '#', className: 'btn btn-light' }, 'Xem chi tiết')
                    )
                )
            ),
            React.createElement('div', { className: 'col-md-4' },
                React.createElement('div', { className: 'card text-white bg-info mb-3' },
                    React.createElement('div', { className: 'card-header' },
                        React.createElement('i', { className: 'fas fa-flask' }),
                        ' Kết quả xét nghiệm'
                    ),
                    React.createElement('div', { className: 'card-body' },
                        React.createElement('h5', { className: 'card-title' }, '0'),
                        React.createElement('p', { className: 'card-text' }, 'Kết quả mới'),
                        React.createElement('a', { href: '#', className: 'btn btn-light' }, 'Xem kết quả')
                    )
                )
            )
        ),
        React.createElement('div', { className: 'row mt-4' },
            React.createElement('div', { className: 'col-12' },
                React.createElement('div', { className: 'card' },
                    React.createElement('div', { className: 'card-header' },
                        React.createElement('h5', null,
                            React.createElement('i', { className: 'fas fa-chart-line' }),
                            ' Hoạt động gần đây'
                        )
                    ),
                    React.createElement('div', { className: 'card-body' },
                        React.createElement('p', { className: 'text-muted' }, 'Chưa có hoạt động nào được ghi nhận.')
                    )
                )
            )
        )
    );
}; 