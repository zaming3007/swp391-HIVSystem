FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env
WORKDIR /app

# Sao chép file project và khôi phục dependencies
COPY *.csproj ./
RUN dotnet restore

# Sao chép toàn bộ mã nguồn và build ứng dụng
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Tạo image runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/publish .

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