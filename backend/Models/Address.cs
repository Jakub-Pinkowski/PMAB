using SQLite;

namespace BackendAPI.Models
{
    public class Address
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }

        public string Street { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string PostalCode { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;
    }
}