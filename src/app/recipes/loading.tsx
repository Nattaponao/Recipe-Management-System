export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7EB]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#637402] border-t-transparent" />
        <p className="text-[#637402] font-semibold">กำลังโหลด...</p>
      </div>
    </div>
  );
}
