/* eslint-disable @next/next/no-img-element */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F9F7EB] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/loading.gif"
          alt="loading"
          className="w-32 h-32"
        />
        <p className="text-[#637402] font-semibold">
          กำลังโหลดนะ...
        </p>
      </div>
    </div>
  );
}
