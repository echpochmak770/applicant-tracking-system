using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Domain.Interfaces
{
    public interface IFileService
    {
        Task<string> SaveFileAsync(Stream content, string fileName, string folderName);
        string GetFullPath(string relativeUrl);
    }
}
