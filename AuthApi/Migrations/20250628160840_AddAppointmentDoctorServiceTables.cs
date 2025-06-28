using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAppointmentDoctorServiceTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "doctors",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    specialization = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    phone = table.Column<string>(type: "text", nullable: false),
                    profile_image = table.Column<string>(type: "text", nullable: false),
                    available = table.Column<bool>(type: "boolean", nullable: false),
                    bio = table.Column<string>(type: "text", nullable: false),
                    experience = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctors", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "services",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    duration = table.Column<int>(type: "integer", nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    category = table.Column<string>(type: "text", nullable: false),
                    image_url = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_services", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "time_slots",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    doctor_id = table.Column<string>(type: "text", nullable: false),
                    day_of_week = table.Column<int>(type: "integer", nullable: false),
                    start_time = table.Column<string>(type: "text", nullable: false),
                    end_time = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_time_slots", x => x.id);
                    table.ForeignKey(
                        name: "FK_time_slots_doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "doctors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "appointments",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    patient_id = table.Column<string>(type: "text", nullable: false),
                    patient_name = table.Column<string>(type: "text", nullable: false),
                    doctor_id = table.Column<string>(type: "text", nullable: false),
                    doctor_name = table.Column<string>(type: "text", nullable: false),
                    service_id = table.Column<string>(type: "text", nullable: false),
                    service_name = table.Column<string>(type: "text", nullable: false),
                    date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    start_time = table.Column<string>(type: "text", nullable: false),
                    end_time = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<int>(type: "integer", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_appointments", x => x.id);
                    table.ForeignKey(
                        name: "FK_appointments_doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "doctors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_appointments_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_appointments_users_patient_id",
                        column: x => x.patient_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "doctor_services",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false),
                    doctor_id = table.Column<string>(type: "text", nullable: false),
                    service_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_doctor_services", x => x.id);
                    table.ForeignKey(
                        name: "FK_doctor_services_doctors_doctor_id",
                        column: x => x.doctor_id,
                        principalTable: "doctors",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_doctor_services_services_service_id",
                        column: x => x.service_id,
                        principalTable: "services",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "doctors",
                columns: new[] { "id", "available", "bio", "created_at", "email", "experience", "first_name", "last_name", "phone", "profile_image", "specialization", "updated_at" },
                values: new object[,]
                {
                    { "1", true, "Bác sĩ Minh có hơn 10 năm kinh nghiệm trong lĩnh vực nhi khoa.", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "minh.nguyen@example.com", 10, "Minh", "Nguyễn", "0901234567", "/doctor-profiles/minh-nguyen.jpg", "Nhi khoa", null },
                    { "2", true, "Bác sĩ Hoa chuyên về các vấn đề da liễu và thẩm mỹ.", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "hoa.tran@example.com", 8, "Hoa", "Trần", "0912345678", "/doctor-profiles/hoa-tran.jpg", "Da liễu", null },
                    { "3", true, "Bác sĩ Tuấn là chuyên gia hàng đầu về bệnh tim mạch.", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "tuan.le@example.com", 15, "Tuấn", "Lê", "0923456789", "/doctor-profiles/tuan-le.jpg", "Tim mạch", null }
                });

            migrationBuilder.InsertData(
                table: "services",
                columns: new[] { "id", "category", "created_at", "description", "duration", "image_url", "name", "price", "updated_at" },
                values: new object[,]
                {
                    { "1", "Khám tổng quát", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Khám sức khỏe tổng quát định kỳ", 60, "/services/general-checkup.jpg", "Khám tổng quát", 300000m, null },
                    { "2", "Dinh dưỡng", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Tư vấn chế độ dinh dưỡng phù hợp", 45, "/services/nutrition-consulting.jpg", "Tư vấn dinh dưỡng", 250000m, null },
                    { "3", "Da liễu", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Khám và điều trị các vấn đề về da", 30, "/services/dermatology.jpg", "Khám da liễu", 350000m, null }
                });

            migrationBuilder.InsertData(
                table: "appointments",
                columns: new[] { "id", "created_at", "date", "doctor_id", "doctor_name", "end_time", "notes", "patient_id", "patient_name", "service_id", "service_name", "start_time", "status", "updated_at" },
                values: new object[,]
                {
                    { "1", new DateTime(2024, 12, 27, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc), "1", "Minh Nguyễn", "10:00", "Khám sức khỏe định kỳ hàng năm", "4", "Customer User", "1", "Khám tổng quát", "09:00", 1, null },
                    { "2", new DateTime(2024, 12, 30, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 1, 8, 0, 0, 0, 0, DateTimeKind.Utc), "2", "Hoa Trần", "14:30", "Khám tình trạng dị ứng da", "4", "Customer User", "3", "Khám da liễu", "14:00", 0, null }
                });

            migrationBuilder.InsertData(
                table: "doctor_services",
                columns: new[] { "id", "doctor_id", "service_id" },
                values: new object[,]
                {
                    { "1", "1", "1" },
                    { "2", "1", "2" },
                    { "3", "2", "3" },
                    { "4", "3", "1" }
                });

            migrationBuilder.InsertData(
                table: "time_slots",
                columns: new[] { "id", "day_of_week", "doctor_id", "end_time", "start_time" },
                values: new object[,]
                {
                    { "1", 1, "1", "12:00", "08:00" },
                    { "2", 3, "1", "17:00", "13:00" },
                    { "3", 2, "2", "12:00", "08:00" },
                    { "4", 4, "2", "17:00", "13:00" },
                    { "5", 5, "3", "17:00", "08:00" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_appointments_doctor_id",
                table: "appointments",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_patient_id",
                table: "appointments",
                column: "patient_id");

            migrationBuilder.CreateIndex(
                name: "IX_appointments_service_id",
                table: "appointments",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_services_doctor_id",
                table: "doctor_services",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_doctor_services_service_id",
                table: "doctor_services",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_time_slots_doctor_id",
                table: "time_slots",
                column: "doctor_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "appointments");

            migrationBuilder.DropTable(
                name: "doctor_services");

            migrationBuilder.DropTable(
                name: "time_slots");

            migrationBuilder.DropTable(
                name: "services");

            migrationBuilder.DropTable(
                name: "doctors");
        }
    }
}
