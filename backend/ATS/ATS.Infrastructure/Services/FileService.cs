using ATS.Domain.Interfaces;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.Text;

namespace ATS.Infrastructure.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _env;

        public FileService(IWebHostEnvironment env) => _env = env;

        public async Task<string> SaveFileAsync(Stream content, string fileName, string folderName)
        {
            var rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var relativePath = Path.Combine("uploads", folderName, $"{Guid.NewGuid()}_{fileName}");
            var fullPath = Path.Combine(rootPath, relativePath);

            Directory.CreateDirectory(Path.GetDirectoryName(fullPath)!);

            using (var fileStream = new FileStream(fullPath, FileMode.Create))
            {
                await content.CopyToAsync(fileStream);
            }

            return "/" + relativePath.Replace("\\", "/");
        }

        public string GetFullPath(string relativeUrl)
        {
            var rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            return Path.Combine(rootPath, relativeUrl.TrimStart('/'));
        }

        public async Task DeleteFileAsync(string? relativeUrl)
        {
            if (string.IsNullOrWhiteSpace(relativeUrl))
            {
                return;
            }

            var fullPath = GetFullPath(relativeUrl);

            if (File.Exists(fullPath))
            {
                try
                {
                    await Task.Run(() => File.Delete(fullPath));
                }
                catch (IOException)
                {
                    throw;
                }
            }
        }
    }
}
