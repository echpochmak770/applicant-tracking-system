export default function Loader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-4 border-muted"></div>

          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Загрузка ATS...
          </h2>
        </div>
      </div>
    </div>
  );
}
