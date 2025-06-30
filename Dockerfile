FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Sao chép file project và khôi phục dependencies
COPY ./AppointmentApi/AppointmentApi.csproj ./AppointmentApi/
RUN dotnet restore ./AppointmentApi/AppointmentApi.csproj

# Sao chép toàn bộ mã nguồn và build ứng dụng
COPY . ./
RUN dotnet publish -c Release -o /app/publish ./AppointmentApi/AppointmentApi.csproj

# Tạo image runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/publish .
COPY entrypoint.sh .

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