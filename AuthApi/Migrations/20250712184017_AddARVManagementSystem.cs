using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AuthApi.Migrations
{
    /// <inheritdoc />
    public partial class AddARVManagementSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ARVDrugs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    GenericName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BrandName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DrugClass = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Dosage = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Form = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SideEffects = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Contraindications = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Instructions = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsPregnancySafe = table.Column<bool>(type: "boolean", nullable: false),
                    IsPediatricSafe = table.Column<bool>(type: "boolean", nullable: false),
                    MinAge = table.Column<int>(type: "integer", nullable: false),
                    MinWeight = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ARVDrugs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ARVRegimens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    RegimenType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    TargetPopulation = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Instructions = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Monitoring = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsPregnancySafe = table.Column<bool>(type: "boolean", nullable: false),
                    IsPediatricSafe = table.Column<bool>(type: "boolean", nullable: false),
                    MinAge = table.Column<int>(type: "integer", nullable: false),
                    MinWeight = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ARVRegimens", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ARVRegimenDrugs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RegimenId = table.Column<int>(type: "integer", nullable: false),
                    DrugId = table.Column<int>(type: "integer", nullable: false),
                    Dosage = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Frequency = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Timing = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SpecialInstructions = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ARVRegimenDrugs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ARVRegimenDrugs_ARVDrugs_DrugId",
                        column: x => x.DrugId,
                        principalTable: "ARVDrugs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ARVRegimenDrugs_ARVRegimens_RegimenId",
                        column: x => x.RegimenId,
                        principalTable: "ARVRegimens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PatientRegimens",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RegimenId = table.Column<int>(type: "integer", nullable: false),
                    PrescribedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PrescribedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    DiscontinuationReason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    LastReviewDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    NextReviewDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReviewedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientRegimens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientRegimens_ARVRegimens_RegimenId",
                        column: x => x.RegimenId,
                        principalTable: "ARVRegimens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PatientRegimens_Users_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PatientRegimens_Users_PrescribedBy",
                        column: x => x.PrescribedBy,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PatientAdherences",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientRegimenId = table.Column<int>(type: "integer", nullable: false),
                    RecordDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AdherencePercentage = table.Column<decimal>(type: "numeric", nullable: false),
                    Period = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Challenges = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    RecordedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientAdherences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientAdherences_PatientRegimens_PatientRegimenId",
                        column: x => x.PatientRegimenId,
                        principalTable: "PatientRegimens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientAdherences_Users_RecordedBy",
                        column: x => x.RecordedBy,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PatientRegimenHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientRegimenId = table.Column<int>(type: "integer", nullable: false),
                    Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Details = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    PerformedBy = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PerformedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PatientRegimenHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PatientRegimenHistories_PatientRegimens_PatientRegimenId",
                        column: x => x.PatientRegimenId,
                        principalTable: "PatientRegimens",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PatientRegimenHistories_Users_PerformedBy",
                        column: x => x.PerformedBy,
                        principalTable: "Users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "ARVDrugs",
                columns: new[] { "Id", "BrandName", "Contraindications", "CreatedAt", "CreatedBy", "Description", "Dosage", "DrugClass", "Form", "GenericName", "Instructions", "IsActive", "IsPediatricSafe", "IsPregnancySafe", "MinAge", "MinWeight", "Name", "SideEffects", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, "Sustiva", "Pregnancy (first trimester), severe liver disease", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1", "Non-nucleoside reverse transcriptase inhibitor", "600mg", "NNRTI", "Tablet", "Efavirenz", "Take once daily at bedtime on empty stomach", true, true, false, 3, 10m, "Efavirenz", "Dizziness, drowsiness, trouble concentrating, unusual dreams", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1" },
                    { 2, "Truvada", "Severe kidney disease, lactic acidosis", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1", "Nucleoside reverse transcriptase inhibitor combination", "300mg/200mg", "NRTI", "Tablet", "Tenofovir DF/Emtricitabine", "Take once daily with or without food", true, true, true, 12, 35m, "Tenofovir/Emtricitabine", "Nausea, diarrhea, headache, fatigue", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1" },
                    { 3, "Tivicay", "Hypersensitivity to dolutegravir", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1", "Integrase strand transfer inhibitor", "50mg", "INSTI", "Tablet", "Dolutegravir", "Take once daily with or without food", true, true, true, 6, 20m, "Dolutegravir", "Headache, insomnia, fatigue", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1" }
                });

            migrationBuilder.InsertData(
                table: "ARVRegimens",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Description", "Instructions", "IsActive", "IsPediatricSafe", "IsPregnancySafe", "MinAge", "MinWeight", "Monitoring", "Name", "RegimenType", "TargetPopulation", "UpdatedAt", "UpdatedBy" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1", "First-line regimen for adults and adolescents", "Take all medications once daily, preferably at the same time each day", true, false, true, 18, 50m, "Monitor viral load at 3, 6, and 12 months, then every 6 months", "TDF/FTC + DTG", "FirstLine", "Adult", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1" },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1", "Alternative first-line regimen", "Take TDF/FTC in morning, EFV at bedtime", true, false, false, 18, 50m, "Monitor viral load and liver function regularly", "TDF/FTC + EFV", "FirstLine", "Adult", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "1" }
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 18, 40, 15, 721, DateTimeKind.Utc).AddTicks(2131));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 18, 40, 15, 721, DateTimeKind.Utc).AddTicks(3992));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 18, 40, 15, 721, DateTimeKind.Utc).AddTicks(4021));

            migrationBuilder.InsertData(
                table: "ARVRegimenDrugs",
                columns: new[] { "Id", "CreatedAt", "Dosage", "DrugId", "Frequency", "RegimenId", "SortOrder", "SpecialInstructions", "Timing" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "300mg/200mg", 2, "Once daily", 1, 1, "Take at the same time every day", "With or without food" },
                    { 2, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "50mg", 3, "Once daily", 1, 2, "Can be taken with TDF/FTC", "With or without food" },
                    { 3, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "300mg/200mg", 2, "Once daily", 2, 1, "Take in the morning", "Morning with food" },
                    { 4, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "600mg", 1, "Once daily", 2, 2, "Take 2-3 hours after dinner", "Bedtime on empty stomach" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ARVRegimenDrugs_DrugId",
                table: "ARVRegimenDrugs",
                column: "DrugId");

            migrationBuilder.CreateIndex(
                name: "IX_ARVRegimenDrugs_RegimenId",
                table: "ARVRegimenDrugs",
                column: "RegimenId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientAdherences_PatientRegimenId",
                table: "PatientAdherences",
                column: "PatientRegimenId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientAdherences_RecordedBy",
                table: "PatientAdherences",
                column: "RecordedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PatientRegimenHistories_PatientRegimenId",
                table: "PatientRegimenHistories",
                column: "PatientRegimenId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientRegimenHistories_PerformedBy",
                table: "PatientRegimenHistories",
                column: "PerformedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PatientRegimens_PatientId",
                table: "PatientRegimens",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_PatientRegimens_PrescribedBy",
                table: "PatientRegimens",
                column: "PrescribedBy");

            migrationBuilder.CreateIndex(
                name: "IX_PatientRegimens_RegimenId",
                table: "PatientRegimens",
                column: "RegimenId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ARVRegimenDrugs");

            migrationBuilder.DropTable(
                name: "PatientAdherences");

            migrationBuilder.DropTable(
                name: "PatientRegimenHistories");

            migrationBuilder.DropTable(
                name: "ARVDrugs");

            migrationBuilder.DropTable(
                name: "PatientRegimens");

            migrationBuilder.DropTable(
                name: "ARVRegimens");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "1",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 16, 58, 14, 844, DateTimeKind.Utc).AddTicks(7775));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "2",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 16, 58, 14, 845, DateTimeKind.Utc).AddTicks(30));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "id",
                keyValue: "3",
                column: "created_at",
                value: new DateTime(2025, 7, 12, 16, 58, 14, 845, DateTimeKind.Utc).AddTicks(37));
        }
    }
}
