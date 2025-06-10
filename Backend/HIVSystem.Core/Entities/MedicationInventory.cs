using System.ComponentModel.DataAnnotations;

namespace HIVSystem.Core.Entities
{
    public class MedicationInventory
    {
        [Key]
        public int InventoryID { get; set; }
        public int? MedicationID { get; set; }
        public int? FacilityID { get; set; }
        public string? BatchNumber { get; set; }
        // Add other properties as needed
    }
} 