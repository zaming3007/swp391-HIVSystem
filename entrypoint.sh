#!/bin/bash
set -e

echo "Starting entrypoint script..."
echo "Listing directory contents:"
ls -la /app

echo "Checking supervisord configuration:"
cat /etc/supervisor/conf.d/supervisord.conf

echo "Starting supervisord in the background..."
/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf &

# Đợi một chút để các dịch vụ khởi động
echo "Waiting for services to start..."
sleep 30

# Kiểm tra xem các dịch vụ có chạy không
echo "Checking if services are running..."
ps aux | grep dotnet

# Kiểm tra xem các cổng có được lắng nghe không
echo "Checking if ports are being listened to..."
netstat -tulpn | grep LISTEN

# Thử truy cập các endpoint
echo "Trying to access endpoints..."
curl -v http://localhost:80/ || echo "AppointmentApi not responding"
curl -v http://localhost:81/ || echo "AuthApi not responding"

# Tiếp tục chạy để giữ container hoạt động
echo "Container is now running. Press Ctrl+C to stop."
tail -f /dev/null 