import React from 'react';
import { Table, Card } from 'antd';

const medicines = [
  { id: 1, name: 'ARV', quantity: 100, unit: 'viên', note: 'Thuốc điều trị HIV' },
  { id: 2, name: 'Vitamin C', quantity: 50, unit: 'viên', note: 'Bổ sung sức khỏe' },
];

const columns = [
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
  { title: 'Đơn vị', dataIndex: 'unit', key: 'unit' },
  { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
];

const Medicines = () => (
  <div style={{ padding: 24 }}>
    <Card title="Quản lý thuốc">
      <Table dataSource={medicines} columns={columns} rowKey="id" />
    </Card>
  </div>
);

export default Medicines; 