#!/bin/bash
set -e

# Kiểm tra AppointmentApi
echo "Checking AppointmentApi health..."
if curl -f http://localhost:80/ > /dev/null 2>&1; then
    echo "AppointmentApi is healthy!"
else
    echo "AppointmentApi is not responding!"
    exit 1
fi

# Kiểm tra AuthApi
echo "Checking AuthApi health..."
if curl -f http://localhost:81/ > /dev/null 2>&1; then
    echo "AuthApi is healthy!"
else
    echo "AuthApi is not responding!"
    exit 1
fi

echo "All services are healthy!"
exit 0 