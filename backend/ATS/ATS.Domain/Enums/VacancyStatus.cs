using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace ATS.Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]    
    public enum VacancyStatus
    {
        Draft,
        Open,
        Closed,
        Paused
    }
}
