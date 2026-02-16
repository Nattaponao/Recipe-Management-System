/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Row = {
  id: string;
  name: string | null;
  description: string | null;
  coverImage: string | null;
  category: string | null;
  country: string | null;
  createdAt: Date | string;
};

function toDateText(d: Row["createdAt"]) {
  const date = typeof d === "string" ? new Date(d) : d;
  try {
    return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

export default function ManageRecipesClient({ initialRecipes }: { initialRecipes: Row[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return initialRecipes.filter((r) => {
      const okQ =
        !query ||
        (r.name ?? "").toLowerCase().includes(query) ||
        (r.description ?? "").toLowerCase().includes(query);

      const okCat = !category || (r.category ?? "") === category;
      const okCountry = !country || (r.country ?? "") === country;
      return okQ && okCat && okCountry;
    });
  }, [q, category, country, initialRecipes]);

  const categories = useMemo(() => {
    const s = new Set<string>();
    initialRecipes.forEach((r) => r.category && s.add(r.category));
    return Array.from(s);
  }, [initialRecipes]);

  const countries = useMemo(() => {
    const s = new Set<string>();
    initialRecipes.forEach((r) => r.country && s.add(r.country));
    return Array.from(s);
  }, [initialRecipes]);

  async function handleDelete(id: string) {
    const ok = confirm("ลบสูตรนี้เลยไหม?");
    if (!ok) return;

    const res = await fetch(`/api/admin/recipes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(j?.message || "ลบไม่สำเร็จ");
      return;
    }

    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#F9F7EB]">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-[#637402] text-4xl md:text-5xl font-semibold">Manage Recipes</h1>
            <p className="text-[#637402]/70 mt-2">จัดการสูตรอาหารทั้งหมด</p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/recipes/new")}
            className="bg-[#637402] text-white px-5 py-2 rounded-2xl hover:opacity-90 transition"
          >
            + New Recipe
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหา (ชื่อ/คำอธิบาย)..."
              className="w-full rounded-2xl border border-[#637402]/20 px-4 py-2 outline-none"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-[#637402]/20 px-4 py-2 outline-none bg-white"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-2xl border border-[#637402]/20 px-4 py-2 outline-none bg-white"
            >
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-between md:justify-end gap-3">
              <div className="text-[#637402] font-semibold">{filtered.length} items</div>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setCategory("");
                  setCountry("");
                }}
                className="text-[#637402] hover:underline font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="mt-6 bg-white rounded-3xl border border-[#637402]/20 shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 text-[#637402]/70 font-semibold text-sm border-b border-[#637402]/10">
            <div className="col-span-5">Recipe</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Country</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          {filtered.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-b border-[#637402]/10 items-start md:items-center"
            >
              <div className="md:col-span-5">
                <div className="flex items-center gap-3">
                  <img
                    src={r.coverImage ?? "https://picsum.photos/seed/food/120/120"}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border border-[#637402]/15"
                  />
                  <div>
                    <div className="text-[#637402] font-semibold">{r.name ?? "Untitled"}</div>
                    <div className="text-sm text-[#637402]/70 line-clamp-1">
                      {r.description ?? ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 text-[#637402]/80">{r.category ?? "-"}</div>
              <div className="md:col-span-2 text-[#637402]/80">{r.country ?? "-"}</div>
              <div className="md:col-span-2 text-[#637402]/80">{toDateText(r.createdAt)}</div>

              {/* 3-dots menu */}
              <div className="md:col-span-1 flex md:justify-end">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenMenuId((v) => (v === r.id ? null : r.id))}
                    className="w-10 h-10 rounded-2xl border border-[#637402]/20 hover:bg-[#DFD3A4]/30 transition text-[#637402] font-bold"
                    aria-label="Actions"
                  >
                    ⋯
                  </button>

                  {openMenuId === r.id && (
                    <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[#637402]/20 bg-white shadow-lg overflow-hidden z-20">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/recipes/${r.id}/edit`)}
                        className="w-full text-left px-4 py-2 hover:bg-[#DFD3A4]/30 text-[#637402]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenMenuId(null)}
                        className="w-full text-left px-4 py-2 hover:bg-[#DFD3A4]/30 text-[#637402]/80"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 text-[#637402]/70">ไม่พบรายการ</div>
          )}
        </div>
      </div>
    </div>
  );
}
