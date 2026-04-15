export default function Loader() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="h-16 w-16 rounded-full border-4 border-muted"></div>

      <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
    </div>
  );
}
