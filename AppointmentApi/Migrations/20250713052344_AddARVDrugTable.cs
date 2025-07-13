using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AppointmentApi.Migrations
{
    /// <inheritdoc />
    public partial class AddARVDrugTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ARVDrugId",
                table: "ARVMedications",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Challenges",
                table: "AdherenceRecords",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Period",
                table: "AdherenceRecords",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ARVDrugs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    GenericName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    BrandName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    DrugClass = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Dosage = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Form = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SideEffects = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Contraindications = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Instructions = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsPregnancySafe = table.Column<bool>(type: "boolean", nullable: false),
                    IsPediatricSafe = table.Column<bool>(type: "boolean", nullable: false),
                    MinAge = table.Column<int>(type: "integer", nullable: false),
                    MinWeight = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ARVDrugs", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ARVMedications_ARVDrugId",
                table: "ARVMedications",
                column: "ARVDrugId");

            migrationBuilder.AddForeignKey(
                name: "FK_ARVMedications_ARVDrugs_ARVDrugId",
                table: "ARVMedications",
                column: "ARVDrugId",
                principalTable: "ARVDrugs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ARVMedications_ARVDrugs_ARVDrugId",
                table: "ARVMedications");

            migrationBuilder.DropTable(
                name: "ARVDrugs");

            migrationBuilder.DropIndex(
                name: "IX_ARVMedications_ARVDrugId",
                table: "ARVMedications");

            migrationBuilder.DropColumn(
                name: "ARVDrugId",
                table: "ARVMedications");

            migrationBuilder.DropColumn(
                name: "Challenges",
                table: "AdherenceRecords");

            migrationBuilder.DropColumn(
                name: "Period",
                table: "AdherenceRecords");
        }
    }
}
