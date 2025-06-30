#!/bin/bash
set -e

# Hiển thị thông tin môi trường
echo "Starting AppointmentApi..."
echo "Environment: $ASPNETCORE_ENVIRONMENT"
echo "ASPNETCORE_URLS: $ASPNETCORE_URLS"

# Kiểm tra biến môi trường DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL is not set. Using default connection string from appsettings.json"
else
  echo "DATABASE_URL is set. Using environment variable for database connection."
fi

# Kiểm tra biến môi trường JWT_SECRET_KEY
if [ -z "$JWT_SECRET_KEY" ]; then
  echo "WARNING: JWT_SECRET_KEY is not set. Using default key from appsettings.json"
else
  echo "JWT_SECRET_KEY is set. Using environment variable for JWT signing."
fi

# Khởi động ứng dụng
exec dotnet AppointmentApi.dll 