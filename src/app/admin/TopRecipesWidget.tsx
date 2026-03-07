/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

const FALLBACK =
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=200&q=80';

export default function TopRecipesWidget({ items }: { items: any[] }) {
  return (
    // 🌟 เพิ่ม h-full เพื่อให้มันยืดขยายเต็มพื้นที่คอลัมน์ถ้าจำเป็น
    <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#637402] text-xl font-semibold">Top 10 Recipes</h3>
        <Link
          href="/admin/recipes"
          className="text-[#637402] hover:underline font-semibold text-sm"
        >
          See all
        </Link>
      </div>

      <div className="space-y-4 flex-1">
        {' '}
        {/* 🌟 ปรับ gap จาก space-y-3 เป็น 4 */}
        {items.map((r, idx) => (
          <div
            key={r.id}
            className="flex items-center gap-4 group cursor-default"
          >
            {/* อันดับ - ปรับสีให้เด่นตามลำดับ */}
            <div
              className={`w-8 font-bold text-sm ${
                idx < 3 ? 'text-[#637402]' : 'text-[#637402]/40'
              }`}
            >
              {idx < 9 ? `0${idx + 1}` : idx + 1}
            </div>

            {/* รูปภาพ - ขยายขนาดขึ้นนิดหน่อยจาก w-11 เป็น w-12 */}
            <div className="relative overflow-hidden rounded-2xl border border-[#637402]/10 shadow-sm">
              <img
                src={r.coverImage || FALLBACK}
                alt=""
                className="w-12 h-12 object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  const el = e.currentTarget;
                  if (el.src !== FALLBACK) el.src = FALLBACK;
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[#637402] font-semibold truncate group-hover:text-[#8AA603] transition-colors">
                {r.name || 'Untitled'}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[#637402]/50 font-medium truncate mt-0.5">
                {(r.category ? r.category : 'General') +
                  (r.country ? ` • ${r.country}` : '')}
              </div>
            </div>

            {/* ยอดไลก์ - ทำให้ดูสะอาดขึ้น */}
            <div className="flex items-center gap-1 text-xs font-bold text-[#637402] bg-[#F9F7EB] px-2 py-1 rounded-lg">
              <span className="text-red-500 text-[10px]">❤️</span>
              {r.likeCount?.toLocaleString() ?? 0}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="py-10 text-center text-[#637402]/40 text-sm">
            ยังไม่มีข้อมูล
          </div>
        )}
      </div>
    </div>
  );
}
