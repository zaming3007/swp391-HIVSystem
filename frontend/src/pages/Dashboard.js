import React from 'react';
import { Card, Row, Col } from 'antd';

const Dashboard = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Chào mừng đến với hệ thống quản lý điều trị HIV</h1>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card title="Tổng số bệnh nhân" bordered={false}>123</Card>
        </Col>
        <Col span={8}>
          <Card title="Lịch hẹn hôm nay" bordered={false}>5</Card>
        </Col>
        <Col span={8}>
          <Card title="Thông báo mới" bordered={false}>2</Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 