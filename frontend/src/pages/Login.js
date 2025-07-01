import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, message } from 'antd';
import axios from 'axios';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', values);
      if (res.data.success) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        message.success('Đăng nhập thành công!');
        navigate('/');
      } else {
        message.error(res.data.message || 'Đăng nhập thất bại!');
      }
    } catch (err) {
      message.error('Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Đăng nhập hệ thống" style={{ width: 350 }}>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}> 
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>Đăng nhập</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 