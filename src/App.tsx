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
import DoctorLayout from './layouts/DoctorLayout';

import HomePage from './pages/home/HomePage';
import AboutPage from './pages/about/AboutPage';
import ServicesPage from './pages/services/ServicesPage';
import ContactPage from './pages/contact/ContactPage';
import TeamPage from './pages/team/TeamPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyCodePage from './pages/auth/VerifyCodePage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
// import DashboardPage from './pages/admin/DashboardPage';

import ProfilePage from './pages/profile/ProfilePage';
import AppointmentPage from './pages/appointment/AppointmentPage';
import MyAppointmentsPage from './pages/appointment/MyAppointmentsPage';
import ReminderPage from './pages/reminder/ReminderPage';
import ConsultationPage from './pages/consultation/ConsultationPage';
import ConsultationQAPage from './pages/consultation/ConsultationQAPage';
import BasicHivInfoPage from './pages/education/BasicHivInfoPage';
import LivingWithHivPage from './pages/education/LivingWithHivPage';
import StigmaReductionPage from './pages/education/StigmaReductionPage';
import TestResultsPage from './pages/medical/TestResultsPage';
import TestResults from './pages/customer/TestResults';
import ARVManagement from './pages/customer/ARVManagement';
import CustomerARVPage from './pages/customer/CustomerARVPage';
import HIVSystemDemo from './pages/demo/HIVSystemDemo';
import NotificationDemo from './pages/demo/NotificationDemo';
import NotificationPage from './pages/notifications/NotificationPage';
import BlogPage from './pages/blog/BlogPage';
import BlogDetailPage from './pages/blog/BlogDetailPage';
import BlogManagementPage from './pages/admin/BlogManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffAppointments from './pages/staff/StaffAppointments';
import StaffConsultationManagement from './pages/staff/StaffConsultationManagement';
import StaffReports from './pages/staff/StaffReports';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatientManagement from './pages/doctor/DoctorPatientManagement';
import ARVRegimenManagement from './pages/doctor/ARVRegimenManagement';
import DoctorAppointmentManagement from './pages/doctor/DoctorAppointmentManagement';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorARVManagement from './pages/doctor/DoctorARVManagement';
import DoctorConsultationManagement from './pages/doctor/DoctorConsultationManagement';
import PatientARVManagement from './pages/customer/PatientARVManagement';
import PatientMedicalRecord from './pages/doctor/PatientMedicalRecord';
import DoctorScheduleManagement from './pages/doctor/DoctorScheduleManagement';
import AdminDoctorManagement from './pages/admin/AdminDoctorManagement';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import ServiceManagementPage from './pages/admin/ServiceManagementPage';
import SystemSettingsPage from './pages/admin/SystemSettings';

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

        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogDetailPage />} />
        <Route path="demo" element={<HIVSystemDemo />} />
        <Route path="demo/notifications" element={<NotificationDemo />} />
        <Route path="notifications" element={<NotificationPage />} />
      </Route>

      {/* Protected Route for Reminder */}
      <Route element={<AuthGuard />}>
        <Route path="/reminder" element={<ReminderPage />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="verify-code" element={<VerifyCodePage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
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
          <Route path="arv-treatment" element={<PatientARVManagement />} />
          <Route path="arv-management" element={<ARVManagement />} />
          <Route path="my-arv" element={<CustomerARVPage />} />
          <Route path="consultations" element={<ConsultationPage />} />
          <Route path="reminder" element={<ReminderPage />} />
          <Route path="test-results" element={<TestResults />} />
          <Route path="medical-history" element={<div>Lịch sử khám và điều trị</div>} />

          <Route path="qa" element={<ConsultationQAPage />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={
          <RoleGuard requiredRole="admin" userRole={user?.role}>
            <AdminLayout />
          </RoleGuard>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />


          <Route path="services" element={<ServiceManagementPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="doctors" element={<AdminDoctorManagement />} />
          <Route path="settings" element={<SystemSettingsPage />} />
        </Route>



        <Route path="/staff" element={
          <RoleGuard requiredRole="staff" userRole={user?.role}>
            <StaffLayout />
          </RoleGuard>
        }>
          <Route index element={<StaffDashboard />} />
          <Route path="appointments" element={<StaffAppointments />} />
          <Route path="consultations" element={<StaffConsultationManagement />} />
          <Route path="blog" element={<BlogManagementPage />} />
          <Route path="reports" element={<StaffReports />} />
        </Route>

        <Route path="/doctor" element={
          <RoleGuard requiredRole="doctor" userRole={user?.role}>
            <DoctorLayout />
          </RoleGuard>
        }>
          <Route index element={<DoctorDashboard />} />
          <Route path="appointments" element={<DoctorAppointments />} />
          <Route path="appointments-old" element={<DoctorAppointmentManagement />} />
          <Route path="consultations" element={<DoctorConsultationManagement />} />
          <Route path="patients" element={<DoctorPatientManagement />} />
          <Route path="patients/:patientId/medical-record" element={<PatientMedicalRecord />} />

          <Route path="arv-management" element={<DoctorARVManagement />} />
          <Route path="schedule" element={<DoctorScheduleManagement />} />
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
