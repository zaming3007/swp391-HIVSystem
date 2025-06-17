import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  NotificationOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  DashboardOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/patients', icon: <UserOutlined />, label: 'Bệnh nhân' },
    { key: '/notifications', icon: <NotificationOutlined />, label: 'Thông báo' },
    { key: '/appointments', icon: <CalendarOutlined />, label: 'Lịch hẹn' },
    { key: '/medicines', icon: <MedicineBoxOutlined />, label: 'Thuốc' },
    { key: '/logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === '/logout') {
      localStorage.removeItem('token');
      navigate('/login');
    } else {
      navigate(key);
    }
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div style={{ height: 32, margin: 16, color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
        HIV System
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar; 