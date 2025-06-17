import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const HeaderBar = () => (
  <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
    Hệ thống quản lý điều trị HIV
  </Header>
);

export default HeaderBar; 