FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Sao chép các file đã được build sẵn
COPY bin/Release/net8.0/publish/ .

# Cài đặt curl để kiểm tra healthcheck
RUN apt-get update && apt-get install -y curl

# Expose port
EXPOSE 8080

# Thiết lập biến môi trường
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Khởi động ứng dụng
ENTRYPOINT ["dotnet", "AppointmentApi.dll"] 