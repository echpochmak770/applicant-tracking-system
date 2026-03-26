namespace ATS.WebApi.Requests
{
    public class UpdateApplicationStageRequest
    {
        public Guid TargetStageId { get; set; }
        public string? Comment { get; set; }
        public bool IsRejection { get; set; }
    }
}
