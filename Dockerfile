FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Liệt kê nội dung thư mục để debug
RUN ls -la

# Sao chép file project và khôi phục dependencies
COPY SWR302-fe-homelanding/AppointmentApi/*.csproj ./
RUN dotnet restore

# Sao chép toàn bộ mã nguồn và build ứng dụng
COPY SWR302-fe-homelanding/AppointmentApi/ ./
RUN dotnet publish -c Release -o /app/publish

# Tạo image runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/publish .

# Tạo entrypoint script trực tiếp trong Dockerfile
RUN echo '#!/bin/bash\nset -e\necho "Starting AppointmentApi..."\nexec dotnet AppointmentApi.dll' > /app/entrypoint.sh

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