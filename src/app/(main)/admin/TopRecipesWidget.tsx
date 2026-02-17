"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const FALLBACK =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=200&q=80";

export default function TopRecipesWidget({ items }: { items: any[] }) {
  return (
    <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[#637402] text-xl font-semibold">Top Recipes</h3>
        <Link href="/admin/recipes" className="text-[#637402] hover:underline font-semibold text-sm">
          See all
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((r, idx) => (
          <div key={r.id} className="flex items-center gap-3">
            <div className="w-7 text-[#637402] font-bold">
              {idx === 0 ? "#1" : idx === 1 ? "#2" : idx === 2 ? "#3" : `#${idx + 1}`}
            </div>

            <img
              src={r.coverImage || FALLBACK}
              alt=""
              className="w-11 h-11 rounded-2xl object-cover border border-[#637402]/15"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== FALLBACK) el.src = FALLBACK;
              }}
            />

            <div className="min-w-0 flex-1">
              <div className="text-[#637402] font-semibold truncate">{r.name || "Untitled"}</div>
              <div className="text-xs text-[#637402]/70 truncate">
                {(r.category ? r.category : "—") + (r.country ? ` • ${r.country}` : "")}
              </div>
            </div>

            <div className="text-sm font-semibold text-[#637402]">❤️ {r.likeCount ?? 0}</div>
          </div>
        ))}

        {items.length === 0 && <div className="text-[#637402]/70 text-sm">ยังไม่มีข้อมูล</div>}
      </div>
    </div>
  );
}
