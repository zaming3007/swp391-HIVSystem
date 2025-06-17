import React from 'react';
import { List, Typography, Card } from 'antd';

const notifications = [
  { id: 1, title: 'Thông báo 1', content: 'Nội dung thông báo 1', date: '2024-06-13' },
  { id: 2, title: 'Thông báo 2', content: 'Nội dung thông báo 2', date: '2024-06-12' },
];

const Notifications = () => (
  <div style={{ padding: 24 }}>
    <Card title="Thông báo mới">
      <List
        itemLayout="vertical"
        dataSource={notifications}
        renderItem={item => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={<Typography.Text strong>{item.title}</Typography.Text>}
              description={item.date}
            />
            <div>{item.content}</div>
          </List.Item>
        )}
      />
    </Card>
  </div>
);

export default Notifications; 