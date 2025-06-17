import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';

const initialPatients = [
  { id: 1, name: 'Nguyễn Văn A', age: 32, gender: 'Nam', phone: '0123456789' },
  { id: 2, name: 'Trần Thị B', age: 28, gender: 'Nữ', phone: '0987654321' },
];

const Patients = () => {
  const [patients, setPatients] = useState(initialPatients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [form] = Form.useForm();

  const showModal = (patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
    if (patient) form.setFieldsValue(patient);
    else form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingPatient) {
        setPatients(patients.map(p => p.id === editingPatient.id ? { ...editingPatient, ...values } : p));
        message.success('Cập nhật thành công!');
      } else {
        setPatients([...patients, { ...values, id: Date.now() }]);
        message.success('Thêm mới thành công!');
      }
      setIsModalOpen(false);
      setEditingPatient(null);
    });
  };

  const handleDelete = (id) => {
    setPatients(patients.filter(p => p.id !== id));
    message.success('Xóa thành công!');
  };

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Tuổi', dataIndex: 'age', key: 'age' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Button type="primary" onClick={() => showModal(null)} style={{ marginBottom: 16 }}>Thêm bệnh nhân</Button>
      <Table dataSource={patients} columns={columns} rowKey="id" />
      <Modal title={editingPatient ? 'Sửa bệnh nhân' : 'Thêm bệnh nhân'} open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Nhập tên!' }]}><Input /></Form.Item>
          <Form.Item name="age" label="Tuổi" rules={[{ required: true, message: 'Nhập tuổi!' }]}><Input type="number" /></Form.Item>
          <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Nhập giới tính!' }]}><Input /></Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Nhập số điện thoại!' }]}><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Patients; 