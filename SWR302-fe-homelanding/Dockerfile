FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Liệt kê nội dung thư mục để debug
RUN ls -la

# Tạo cấu trúc thư mục
RUN mkdir -p AppointmentApi

# Sao chép file project và khôi phục dependencies
COPY AppointmentApi/*.csproj ./AppointmentApi/
RUN dotnet restore ./AppointmentApi/AppointmentApi.csproj

# Sao chép toàn bộ mã nguồn và build ứng dụng
COPY AppointmentApi/ ./AppointmentApi/
RUN dotnet publish -c Release -o /app/publish ./AppointmentApi/AppointmentApi.csproj

# Tạo image runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/publish .

# Tạo entrypoint script trực tiếp trong Dockerfile
RUN echo '#!/bin/bash\nset -e\n\n# Hiển thị thông tin môi trường\necho "Starting AppointmentApi..."\necho "Environment: $ASPNETCORE_ENVIRONMENT"\necho "ASPNETCORE_URLS: $ASPNETCORE_URLS"\n\n# Kiểm tra biến môi trường DATABASE_URL\nif [ -z "$DATABASE_URL" ]; then\n  echo "WARNING: DATABASE_URL is not set. Using default connection string from appsettings.json"\nelse\n  echo "DATABASE_URL is set. Using environment variable for database connection."\nfi\n\n# Kiểm tra biến môi trường JWT_SECRET_KEY\nif [ -z "$JWT_SECRET_KEY" ]; then\n  echo "WARNING: JWT_SECRET_KEY is not set. Using default key from appsettings.json"\nelse\n  echo "JWT_SECRET_KEY is set. Using environment variable for JWT signing."\nfi\n\n# Khởi động ứng dụng\nexec dotnet AppointmentApi.dll' > /app/entrypoint.sh

# Cài đặt curl và bash để kiểm tra healthcheck
RUN apt-get update && apt-get install -y curl bash && \
    chmod +x /app/entrypoint.sh

# Expose port
EXPOSE 8080

# Thiết lập biến môi trường
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Khởi động ứng dụng
ENTRYPOINT ["/app/entrypoint.sh"] 