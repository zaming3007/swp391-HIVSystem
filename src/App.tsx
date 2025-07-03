import React, { useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { ToastContainer } from 'react-toastify';

import theme from './theme/theme';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import StaffLayout from './layouts/StaffLayout';

import HomePage from './pages/home/HomePage';
import AboutPage from './pages/about/AboutPage';
import ServicesPage from './pages/services/ServicesPage';
import ContactPage from './pages/contact/ContactPage';
import TeamPage from './pages/team/TeamPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import AppointmentPage from './pages/appointment/AppointmentPage';
import MyAppointmentsPage from './pages/appointment/MyAppointmentsPage';
import ReminderPage from './pages/reminder/ReminderPage';
import ConsultationPage from './pages/consultation/ConsultationPage';
import ConsultationQAPage from './pages/consultation/ConsultationQAPage';
import BasicHivInfoPage from './pages/education/BasicHivInfoPage';
import LivingWithHivPage from './pages/education/LivingWithHivPage';
import StigmaReductionPage from './pages/education/StigmaReductionPage';


import AuthGuard from './components/auth/AuthGuard';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { useSelector } from 'react-redux';
import type { RootState } from './store/index.ts';
import type { AuthState } from './types';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: 'admin' | 'doctor' | 'customer' | 'staff';
  userRole?: string;
}

const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  requiredRole,
  userRole
}) => {
  if (userRole !== requiredRole) {
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'doctor':
        return <Navigate to="/doctor" replace />;
      case 'staff':
        return <Navigate to="/staff" replace />;
      case 'customer':
        return <Navigate to="/app/appointments" replace />;
      default:
        return <Navigate to="/auth/login" replace />;
    }
  }

  return <>{children}</>;
};

class ErrorBoundary extends Component<{ children: ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Đã xảy ra lỗi.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Thử lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppRoutes: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="appointment" element={<AppointmentPage />} />
        <Route path="appointment/my-appointments" element={<MyAppointmentsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="consultation" element={<ConsultationPage />} />
        <Route path="consultation/:id" element={<ConsultationQAPage />} />

        <Route path="education">
          <Route path="basic-hiv-info" element={<BasicHivInfoPage />} />
          <Route path="living-with-hiv" element={<LivingWithHivPage />} />
          <Route path="stigma-reduction" element={<StigmaReductionPage />} />
        </Route>
        <Route path="blog" element={<div>Blog chia sẻ kinh nghiệm</div>} />
      </Route>

      {/* Protected Route for Reminder */}
      <Route element={<AuthGuard />}>
        <Route path="/reminder" element={<ReminderPage />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="reset-password" element={<div>Reset Password Page</div>} />
        <Route path="anonymous" element={<div>Đăng ký Ẩn danh</div>} />
      </Route>

      <Route element={<AuthGuard />}>
        <Route path="/app" element={
          <RoleGuard requiredRole="customer" userRole={user?.role}>
            <MainLayout />
          </RoleGuard>
        }>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="appointments" element={<MyAppointmentsPage />} />
          <Route path="consultations" element={<ConsultationPage />} />
          <Route path="reminder" element={<ReminderPage />} />
          <Route path="test-results" element={<div>Kết quả xét nghiệm & Lịch sử khám</div>} />
          <Route path="medical-history" element={<div>Lịch sử khám và điều trị</div>} />

          <Route path="qa" element={<ConsultationQAPage />} />
        </Route>

        <Route path="/admin" element={
          <RoleGuard requiredRole="admin" userRole={user?.role}>
            <AdminLayout />
          </RoleGuard>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="appointments" element={<div>Quản lý lịch hẹn</div>} />
          <Route path="consultations" element={<div>Quản lý tư vấn trực tuyến</div>} />
          <Route path="services" element={<div>Quản lý dịch vụ</div>} />
          <Route path="doctors" element={<div>Quản lý thông tin bác sĩ</div>} />
          <Route path="arv-regimen" element={<div>Quản lý phác đồ ARV</div>} />
          <Route path="test-results" element={<div>Quản lý kết quả xét nghiệm</div>} />
          <Route path="reports" element={<div>Báo cáo thống kê</div>} />
        </Route>

        <Route path="/doctor" element={
          <RoleGuard requiredRole="doctor" userRole={user?.role}>
            <MainLayout />
          </RoleGuard>
        }>
          <Route index element={<div>Dashboard Bác sĩ</div>} />
          <Route path="patients" element={<div>Quản lý bệnh nhân</div>} />
          <Route path="appointments" element={<div>Lịch hẹn khám</div>} />
          <Route path="consultations" element={<div>Tư vấn trực tuyến</div>} />
          <Route path="arv-regimen" element={<div>Quản lý phác đồ ARV</div>} />
          <Route path="test-results" element={<div>Quản lý kết quả xét nghiệm</div>} />
        </Route>

        <Route path="/staff" element={
          <RoleGuard requiredRole="staff" userRole={user?.role}>
            <StaffLayout />
          </RoleGuard>
        }>
          <Route index element={<div>Dashboard Nhân viên</div>} />
          <Route path="patients" element={<div>Danh sách bệnh nhân</div>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  useEffect(() => {
    document.title = 'HIV Healthcare System';
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <Router>
              <AppRoutes />
            </Router>
            <ToastContainer position="top-right" autoClose={5000} aria-label="Toast notifications" />
          </LocalizationProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
