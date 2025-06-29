FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build-env

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép các file project và khôi phục các dependency
COPY ./AppointmentApi/AppointmentApi.csproj ./AppointmentApi/
RUN dotnet restore ./AppointmentApi/AppointmentApi.csproj

# Sao chép toàn bộ mã nguồn và build ứng dụng
COPY . ./
RUN dotnet publish -c Release -o /app/out ./AppointmentApi/AppointmentApi.csproj

# Tạo image runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build-env /app/out .

# Expose port
EXPOSE 80

# Khởi động ứng dụng
ENTRYPOINT ["dotnet", "AppointmentApi.dll", "--urls", "http://0.0.0.0:80"] 