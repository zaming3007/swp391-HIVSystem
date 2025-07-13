using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AppointmentApi.Migrations
{
    /// <inheritdoc />
    public partial class AddARVManagementSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Doctors_DoctorId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Services_ServiceId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_TimeSlots_Doctors_DoctorId",
                table: "TimeSlots");

            migrationBuilder.DeleteData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "Appointments",
                keyColumn: "Id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: "3");

            migrationBuilder.DeleteData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: "4");

            migrationBuilder.DeleteData(
                table: "TimeSlots",
                keyColumn: "Id",
                keyValue: "5");

            migrationBuilder.DeleteData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: "3");

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: "1");

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: "3");

            migrationBuilder.CreateTable(
                name: "ARVRegimens",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LineOfTreatment = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ARVRegimens", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ARVMedications",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    RegimenId = table.Column<string>(type: "text", nullable: false),
                    MedicationName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ActiveIngredient = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Dosage = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Frequency = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Instructions = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SideEffects = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ARVMedications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ARVMedications_ARVRegimens_RegimenId",
                        column: x => x.RegimenId,
                        principalTable: "ARVRegimens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientRegimens",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    PatientId = table.Column<string>(type: "text", nullable: false),
                    PatientName = table.Column<string>(type: "text", nullable: false),
                    DoctorId = table.Column<string>(type: "text", nullable: false),
                    DoctorName = table.Column<string>(type: "text", nullable: false),
                    RegimenId = table.Column<string>(type: "text", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientRegimens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientRegimens_ARVRegimens_RegimenId",
                        column: x => x.RegimenId,
                        principalTable: "ARVRegimens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AdherenceRecords",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    PatientRegimenId = table.Column<string>(type: "text", nullable: false),
                    RecordDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TotalDoses = table.Column<int>(type: "integer", nullable: false),
                    TakenDoses = table.Column<int>(type: "integer", nullable: false),
                    AdherencePercentage = table.Column<decimal>(type: "numeric", nullable: false),
                    Notes = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    RecordedBy = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdherenceRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AdherenceRecords_PatientRegimens_PatientRegimenId",
                        column: x => x.PatientRegimenId,
                        principalTable: "PatientRegimens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SideEffectRecords",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    PatientRegimenId = table.Column<string>(type: "text", nullable: false),
                    SideEffect = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Severity = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    OnsetDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ResolvedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Treatment = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ReportedBy = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SideEffectRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SideEffectRecords_PatientRegimens_PatientRegimenId",
                        column: x => x.PatientRegimenId,
                        principalTable: "PatientRegimens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdherenceRecords_PatientRegimenId",
                table: "AdherenceRecords",
                column: "PatientRegimenId");

            migrationBuilder.CreateIndex(
                name: "IX_ARVMedications_RegimenId",
                table: "ARVMedications",
                column: "RegimenId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientRegimens_RegimenId",
                table: "PatientRegimens",
                column: "RegimenId");

            migrationBuilder.CreateIndex(
                name: "IX_SideEffectRecords_PatientRegimenId",
                table: "SideEffectRecords",
                column: "PatientRegimenId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdherenceRecords");

            migrationBuilder.DropTable(
                name: "ARVMedications");

            migrationBuilder.DropTable(
                name: "SideEffectRecords");

            migrationBuilder.DropTable(
                name: "PatientRegimens");

            migrationBuilder.DropTable(
                name: "ARVRegimens");

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

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Doctors_DoctorId",
                table: "Appointments",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Services_ServiceId",
                table: "Appointments",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TimeSlots_Doctors_DoctorId",
                table: "TimeSlots",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
