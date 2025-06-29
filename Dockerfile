FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các file project và khôi phục các dependency
COPY ./AppointmentApi/AppointmentApi.csproj ./AppointmentApi/
COPY ./AuthApi/AuthApi.csproj ./AuthApi/
RUN dotnet restore ./AppointmentApi/AppointmentApi.csproj
RUN dotnet restore ./AuthApi/AuthApi.csproj

# Sao chép toàn bộ mã nguồn và build ứng dụng
COPY . ./
RUN dotnet publish -c Release -o out ./AppointmentApi/AppointmentApi.csproj
RUN dotnet publish -c Release -o out ./AuthApi/AuthApi.csproj

# Tạo image runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out ./

# Cài đặt supervisor để quản lý nhiều process
RUN apt-get update && apt-get install -y supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose các port
EXPOSE 80 81

# Khởi động supervisor để chạy cả hai API
ENTRYPOINT ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"] 