const App = () => {
    const [currentRoute, setCurrentRoute] = React.useState('/');
    const [user, setUser] = React.useState(null);
    const [error, setError] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    // Navigation function
    window.navigateTo = (route) => {
        setCurrentRoute(route);
        setError('');
        setSuccessMessage('');
    };

    // Check if user is logged in on app start
    React.useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/auth/status');
            if (response.ok) {
                const userData = await response.json();
                if (userData.isAuthenticated) {
                    setUser(userData.user);
                }
            }
        } catch (error) {
            console.log('Not authenticated');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (formData) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setUser(result.user);
                setSuccessMessage('Đăng nhập thành công!');
                setCurrentRoute('/');
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi đăng nhập');
        }
    };

    const handleRegister = async (formData) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
                setCurrentRoute('/login');
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi đăng ký');
        }
    };

    const handleUpdateProfile = async (formData) => {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                setUser(result.user);
                setSuccessMessage('Cập nhật thông tin thành công!');
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi cập nhật thông tin');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            setSuccessMessage('Đăng xuất thành công!');
            setCurrentRoute('/');
        } catch (error) {
            setError('Có lỗi xảy ra khi đăng xuất');
        }
    };

    window.logout = handleLogout;

    if (loading) {
        return React.createElement('div', { className: 'container text-center mt-5' },
            React.createElement('div', { className: 'spinner-border', role: 'status' },
                React.createElement('span', { className: 'visually-hidden' }, 'Loading...')
            )
        );
    }

    const renderCurrentPage = () => {
        switch (currentRoute) {
            case '/login':
                return React.createElement(Login, {
                    onLogin: handleLogin,
                    error: error
                });
            case '/register':
                return React.createElement(Register, {
                    onRegister: handleRegister,
                    error: error
                });
            case '/profile':
                if (!user) {
                    setCurrentRoute('/login');
                    return null;
                }
                return React.createElement(Profile, {
                    user: user,
                    onUpdateProfile: handleUpdateProfile,
                    successMessage: successMessage,
                    error: error
                });
            case '/dashboard':
                if (!user) {
                    setCurrentRoute('/login');
                    return null;
                }
                return React.createElement(Dashboard, { user: user });
            case '/privacy':
                return React.createElement('div', { className: 'container mt-4' },
                    React.createElement('h2', null, 'Privacy Policy'),
                    React.createElement('p', null, 'Chính sách bảo mật của HIV Healthcare System...')
                );
            default:
                return React.createElement(Home, {
                    user: user,
                    successMessage: successMessage
                });
        }
    };

    return React.createElement('div', null,
        React.createElement(Header, {
            user: user,
            onLogout: handleLogout
        }),
        React.createElement('main', { role: 'main', className: 'pb-3' },
            renderCurrentPage()
        ),
        React.createElement(Footer)
    );
};

// Initialize the React app
document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(React.createElement(App), document.getElementById('react-app'));
}); 