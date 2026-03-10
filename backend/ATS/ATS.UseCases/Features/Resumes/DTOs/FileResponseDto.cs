using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.UseCases.Features.Resumes.DTOs
{
    public class FileResponseDto
    {
        public Stream Content { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
    }
}
