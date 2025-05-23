import React from 'react';
import './App.css';

function App() {
    return (
        <div className="app-container">
            <header className="app-header">
                <div className="logo-container">
                    <h1>HIV Treatment System</h1>
                </div>
                <nav className="app-nav">
                    <ul>
                        <li><a href="#home">Trang chủ</a></li>
                        <li><a href="#patients">Bệnh nhân</a></li>
                        <li><a href="#appointments">Lịch hẹn</a></li>
                        <li><a href="#medicines">Thuốc</a></li>
                        <li><a href="#reports">Báo cáo</a></li>
                    </ul>
                </nav>
                <div className="user-profile">
                    <button className="login-button">Đăng nhập</button>
                </div>
            </header>

            <main className="app-main">
                <div className="dashboard-container">
                    <h2>Chào mừng đến với Hệ thống Quản lý Điều trị HIV</h2>
                    <p>Hệ thống giúp quản lý thông tin bệnh nhân, lịch hẹn và thuốc men</p>

                    <div className="stats-container">
                        <div className="stat-card">
                            <h3>Bệnh nhân</h3>
                            <p className="stat-number">152</p>
                            <p>Tổng số bệnh nhân</p>
                        </div>
                        <div className="stat-card">
                            <h3>Lịch hẹn</h3>
                            <p className="stat-number">28</p>
                            <p>Lịch hẹn hôm nay</p>
                        </div>
                        <div className="stat-card">
                            <h3>Thuốc</h3>
                            <p className="stat-number">45</p>
                            <p>Loại thuốc có sẵn</p>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="primary-button">Thêm bệnh nhân mới</button>
                        <button className="secondary-button">Xem lịch hẹn</button>
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <p>&copy; 2025 HIV Treatment and Medical Services System - Group 6 (SWP391)</p>
            </footer>
        </div>
    );
}

export default App; 