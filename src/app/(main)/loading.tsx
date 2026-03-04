import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F9F7EB] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image src="/loading.webp" alt="loading" width={128} height={128} />
        <p className="text-[#637402] font-semibold">กำลังโหลดนะ...</p>
      </div>
    </div>
  );
}
