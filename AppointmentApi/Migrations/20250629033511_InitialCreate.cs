using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AppointmentApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Doctors",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: false),
                    LastName = table.Column<string>(type: "text", nullable: false),
                    Specialization = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Phone = table.Column<string>(type: "text", nullable: false),
                    ProfileImage = table.Column<string>(type: "text", nullable: false),
                    Available = table.Column<bool>(type: "boolean", nullable: false),
                    Bio = table.Column<string>(type: "text", nullable: false),
                    Experience = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Doctors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TimeSlots",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    DoctorId = table.Column<string>(type: "text", nullable: false),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<string>(type: "text", nullable: false),
                    EndTime = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeSlots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimeSlots_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    PatientId = table.Column<string>(type: "text", nullable: false),
                    PatientName = table.Column<string>(type: "text", nullable: false),
                    DoctorId = table.Column<string>(type: "text", nullable: false),
                    DoctorName = table.Column<string>(type: "text", nullable: false),
                    ServiceId = table.Column<string>(type: "text", nullable: false),
                    ServiceName = table.Column<string>(type: "text", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartTime = table.Column<string>(type: "text", nullable: false),
                    EndTime = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointments_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Doctors",
                columns: new[] { "Id", "Available", "Bio", "CreatedAt", "Email", "Experience", "FirstName", "LastName", "Phone", "ProfileImage", "Specialization", "UpdatedAt" },
                values: new object[,]
                {
                    { "1", true, "Bác sĩ Minh có hơn 10 năm kinh nghiệm trong lĩnh vực nhi khoa.", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "minh.nguyen@example.com", 10, "Minh", "Nguyễn", "0901234567", "/doctor-profiles/minh-nguyen.jpg", "Nhi khoa", null },
                    { "2", true, "Bác sĩ Hoa chuyên về các vấn đề da liễu và thẩm mỹ.", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "hoa.tran@example.com", 8, "Hoa", "Trần", "0912345678", "/doctor-profiles/hoa-tran.jpg", "Da liễu", null },
                    { "3", true, "Bác sĩ Tuấn là chuyên gia hàng đầu về bệnh tim mạch.", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "tuan.le@example.com", 15, "Tuấn", "Lê", "0923456789", "/doctor-profiles/tuan-le.jpg", "Tim mạch", null }
                });

            migrationBuilder.InsertData(
                table: "Services",
                columns: new[] { "Id", "Category", "CreatedAt", "Description", "Duration", "ImageUrl", "Name", "Price", "UpdatedAt" },
                values: new object[,]
                {
                    { "1", "Khám tổng quát", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Khám sức khỏe tổng quát định kỳ", 60, "/services/general-checkup.jpg", "Khám tổng quát", 300000m, null },
                    { "2", "Dinh dưỡng", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Tư vấn chế độ dinh dưỡng phù hợp", 45, "/services/nutrition-consulting.jpg", "Tư vấn dinh dưỡng", 250000m, null },
                    { "3", "Da liễu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Khám và điều trị các vấn đề về da", 30, "/services/dermatology.jpg", "Khám da liễu", 350000m, null }
                });

            migrationBuilder.InsertData(
                table: "Appointments",
                columns: new[] { "Id", "CreatedAt", "Date", "DoctorId", "DoctorName", "EndTime", "Notes", "PatientId", "PatientName", "ServiceId", "ServiceName", "StartTime", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { "1", new DateTime(2024, 12, 27, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc), "1", "Minh Nguyễn", "10:00", "Khám sức khỏe định kỳ hàng năm", "patient1", "Khách hàng Mẫu", "1", "Khám tổng quát", "09:00", "Confirmed", null },
                    { "2", new DateTime(2024, 12, 30, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 1, 8, 0, 0, 0, 0, DateTimeKind.Utc), "2", "Hoa Trần", "14:30", "Khám tình trạng dị ứng da", "patient1", "Khách hàng Mẫu", "3", "Khám da liễu", "14:00", "Pending", null }
                });

            migrationBuilder.InsertData(
                table: "TimeSlots",
                columns: new[] { "Id", "DayOfWeek", "DoctorId", "EndTime", "StartTime" },
                values: new object[,]
                {
                    { "1", 1, "1", "12:00", "08:00" },
                    { "2", 3, "1", "17:00", "13:00" },
                    { "3", 2, "2", "12:00", "08:00" },
                    { "4", 4, "2", "17:00", "13:00" },
                    { "5", 5, "3", "17:00", "08:00" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_DoctorId",
                table: "Appointments",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ServiceId",
                table: "Appointments",
                column: "ServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_TimeSlots_DoctorId",
                table: "TimeSlots",
                column: "DoctorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Appointments");

            migrationBuilder.DropTable(
                name: "TimeSlots");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Doctors");
        }
    }
}
