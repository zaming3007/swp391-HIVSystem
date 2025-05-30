const Header = ({ user, onLogout }) => {
    return React.createElement('header', null,
        // Top bar với hotline
        React.createElement('div', { className: 'bg-primary text-white py-2' },
            React.createElement('div', { className: 'container-fluid' },
                React.createElement('div', { className: 'row align-items-center' },
                    React.createElement('div', { className: 'col-md-6' },
                        React.createElement('small', null,
                            React.createElement('i', { className: 'fas fa-shield-alt' }),
                            ' Hệ thống chăm sóc sức khỏe HIV uy tín'
                        )
                    ),
                    React.createElement('div', { className: 'col-md-6 text-end' },
                        React.createElement('small', null,
                            React.createElement('i', { className: 'fas fa-phone' }),
                            ' Hotline 24/7: ',
                            React.createElement('strong', null, '1900 1234'),
                            React.createElement('span', { className: 'ms-3' },
                                React.createElement('i', { className: 'fas fa-envelope' }),
                                ' support@hivsystem.com'
                            )
                        )
                    )
                )
            )
        ),

        // Main navigation
        React.createElement('nav', { className: 'navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3' },
            React.createElement('div', { className: 'container-fluid' },
                React.createElement('a', {
                    className: 'navbar-brand',
                    href: '#',
                    onClick: (e) => { e.preventDefault(); window.navigateTo('/'); }
                },
                    React.createElement('i', { className: 'fas fa-heart-pulse text-danger' }),
                    ' HIV Healthcare System'
                ),
                React.createElement('button', {
                    className: 'navbar-toggler',
                    type: 'button',
                    'data-bs-toggle': 'collapse',
                    'data-bs-target': '.navbar-collapse'
                },
                    React.createElement('span', { className: 'navbar-toggler-icon' })
                ),
                React.createElement('div', { className: 'navbar-collapse collapse d-sm-inline-flex justify-content-between' },
                    React.createElement('ul', { className: 'navbar-nav flex-grow-1' },
                        React.createElement('li', { className: 'nav-item' },
                            React.createElement('a', {
                                className: 'nav-link text-dark',
                                href: '#',
                                onClick: (e) => { e.preventDefault(); window.navigateTo('/'); }
                            },
                                React.createElement('i', { className: 'fas fa-home' }),
                                ' Trang chủ'
                            )
                        ),

                        // Dropdown Dịch vụ
                        React.createElement('li', { className: 'nav-item dropdown' },
                            React.createElement('a', {
                                className: 'nav-link dropdown-toggle text-dark',
                                href: '#',
                                id: 'servicesDropdown',
                                role: 'button',
                                'data-bs-toggle': 'dropdown'
                            },
                                React.createElement('i', { className: 'fas fa-stethoscope' }),
                                ' Dịch vụ'
                            ),
                            React.createElement('ul', { className: 'dropdown-menu' },
                                React.createElement('li', null, React.createElement('h6', { className: 'dropdown-header' }, 'Xét nghiệm HIV')),
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-vial' }), ' Xét nghiệm nhanh')),
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-microscope' }), ' Xét nghiệm ELISA')),
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-dna' }), ' Xét nghiệm PCR')),
                                React.createElement('li', null, React.createElement('hr', { className: 'dropdown-divider' })),
                                React.createElement('li', null, React.createElement('h6', { className: 'dropdown-header' }, 'Tư vấn & Hỗ trợ')),
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-comments' }), ' Tư vấn trực tuyến')),
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-phone' }), ' Hotline hỗ trợ'))
                            )
                        ),

                        // Dropdown Thông tin
                        React.createElement('li', { className: 'nav-item dropdown' },
                            React.createElement('a', {
                                className: 'nav-link dropdown-toggle text-dark',
                                href: '#',
                                id: 'infoDropdown',
                                role: 'button',
                                'data-bs-toggle': 'dropdown'
                            },
                                React.createElement('i', { className: 'fas fa-info-circle' }),
                                ' Thông tin'
                            ),
                            React.createElement('ul', { className: 'dropdown-menu' },
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-book-medical' }), ' Kiến thức HIV')),
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-shield-alt' }), ' Phòng ngừa')),
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-heart' }), ' Hỗ trợ tâm lý')),
                                React.createElement('li', null, React.createElement('hr', { className: 'dropdown-divider' })),
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-question-circle' }), ' FAQ'))
                            )
                        ),

                        // Auth links
                        !user ? [
                            React.createElement('li', { className: 'nav-item', key: 'login' },
                                React.createElement('a', {
                                    className: 'nav-link text-dark',
                                    href: '#',
                                    onClick: (e) => { e.preventDefault(); window.navigateTo('/login'); }
                                },
                                    React.createElement('i', { className: 'fas fa-sign-in-alt' }),
                                    ' Đăng nhập'
                                )
                            ),
                            React.createElement('li', { className: 'nav-item', key: 'register' },
                                React.createElement('a', {
                                    className: 'nav-link text-success',
                                    href: '#',
                                    onClick: (e) => { e.preventDefault(); window.navigateTo('/register'); }
                                },
                                    React.createElement('i', { className: 'fas fa-user-plus' }),
                                    ' Đăng ký'
                                )
                            )
                        ] : [
                            React.createElement('li', { className: 'nav-item', key: 'dashboard' },
                                React.createElement('a', {
                                    className: 'nav-link text-dark',
                                    href: '#',
                                    onClick: (e) => { e.preventDefault(); window.navigateTo('/dashboard'); }
                                },
                                    React.createElement('i', { className: 'fas fa-tachometer-alt' }),
                                    ' Bảng điều khiển'
                                )
                            )
                        ]
                    ),

                    // User dropdown
                    user && React.createElement('ul', { className: 'navbar-nav' },
                        React.createElement('li', { className: 'nav-item dropdown' },
                            React.createElement('a', {
                                className: 'nav-link dropdown-toggle text-primary',
                                href: '#',
                                id: 'navbarDropdown',
                                role: 'button',
                                'data-bs-toggle': 'dropdown'
                            },
                                React.createElement('i', { className: 'fas fa-user-circle' }),
                                ' ', user.fullName
                            ),
                            React.createElement('ul', { className: 'dropdown-menu' },
                                React.createElement('li', null, React.createElement('h6', { className: 'dropdown-header' }, 'Tài khoản: ', user.username)),
                                React.createElement('li', null, React.createElement('hr', { className: 'dropdown-divider' })),
                                React.createElement('li', null,
                                    React.createElement('a', {
                                        className: 'dropdown-item',
                                        href: '#',
                                        onClick: (e) => { e.preventDefault(); window.navigateTo('/profile'); }
                                    },
                                        React.createElement('i', { className: 'fas fa-user' }),
                                        ' Hồ sơ cá nhân'
                                    )
                                ),
                                React.createElement('li', null, React.createElement('a', { className: 'dropdown-item', href: '#' }, React.createElement('i', { className: 'fas fa-cog' }), ' Cài đặt')),
                                React.createElement('li', null, React.createElement('hr', { className: 'dropdown-divider' })),
                                React.createElement('li', null,
                                    React.createElement('button', {
                                        className: 'dropdown-item text-danger',
                                        onClick: onLogout
                                    },
                                        React.createElement('i', { className: 'fas fa-sign-out-alt' }),
                                        ' Đăng xuất'
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}; 