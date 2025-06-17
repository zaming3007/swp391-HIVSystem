import React from 'react';
import { Table, Card } from 'antd';

const appointments = [
  { id: 1, patient: 'Nguyễn Văn A', date: '2024-06-15', time: '09:00', note: 'Tái khám' },
  { id: 2, patient: 'Trần Thị B', date: '2024-06-16', time: '10:30', note: 'Lấy thuốc' },
];

const columns = [
  { title: 'Bệnh nhân', dataIndex: 'patient', key: 'patient' },
  { title: 'Ngày', dataIndex: 'date', key: 'date' },
  { title: 'Giờ', dataIndex: 'time', key: 'time' },
  { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
];

const Appointments = () => (
  <div style={{ padding: 24 }}>
    <Card title="Lịch hẹn">
      <Table dataSource={appointments} columns={columns} rowKey="id" />
    </Card>
  </div>
);

export default Appointments; 