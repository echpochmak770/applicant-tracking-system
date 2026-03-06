using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Common.Models
{
    public class SortModel
    {
        public string Field { get; set; } = "CreatedAt";
        public string Direction { get; set; } = "desc";
    }
}
