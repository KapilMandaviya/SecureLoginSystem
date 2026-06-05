using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DtoLayer
{
    public class universityMasterDto
    {
        public int id { get; set; }

        public string uniName { get; set; } = string.Empty;
        public string stateName { get; set; } = string.Empty;

        public string code { get; set; } = string.Empty;


        public string? email { get; set; }
        public string? mobile { get; set; }

        public string? status { get; set; }

        public string? LogoFile { get; set; }

        public IFormFile? Logo { get; set; }  // 🔥 this matches FormData key

        public bool isActive { get; set; }
        public int? createdBy { get; set; }

        public DateTime? createdDate { get; set; }
    }

    public class ApiResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public Dictionary<string, string>? Errors { get; set; }
    }

}
