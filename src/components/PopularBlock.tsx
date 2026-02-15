/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
'use client';
import React, { useEffect, useMemo, useState } from 'react';


type RecipePick = {
  id: string;
  name: string | null;
  description: string | null;
  coverImage: string | null;
  category: string | null;
  likesCount?: number;
};

type SlotRow = { slot: 1 | 2 | 3 | 4 | 5; recipe: RecipePick | null };

type RecipeOption = {
  id: string;
  name: string | null;
  coverImage: string | null;
  category: string | null;
};

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="close" />
      <div className="absolute left-1/2 top-1/2 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="font-semibold text-[#637402]">{title}</div>
          <button onClick={onClose} className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50">
            ปิด
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function PopularBlock({ isAdmin }: { isAdmin: boolean }) {

  console.log("PopularBlock isAdmin =", isAdmin);

  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  // modal
  const [open, setOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [recipes, setRecipes] = useState<RecipeOption[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [q, setQ] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadSlots() {
    setLoadingSlots(true);
    try {
      const r = await fetch('/api/popular', { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      setSlots(Array.isArray(data.slots) ? data.slots : []);
    } finally {
      setLoadingSlots(false);
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  async function ensureRecipesLoaded() {
    if (recipes.length > 0) return;
    setLoadingRecipes(true);
    try {
      const r = await fetch('/api/admin/recipes', { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      setRecipes(Array.isArray(data.recipes) ? data.recipes : []);
    } finally {
      setLoadingRecipes(false);
    }
  }

  function openEditor(slot: 1 | 2 | 3 | 4 | 5) {
    if (!isAdmin) return;
    setActiveSlot(slot);
    setSelectedRecipeId(slots.find((s) => s.slot === slot)?.recipe?.id ?? '');
    setQ('');
    setOpen(true);
    ensureRecipesLoaded();
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return recipes;
    return recipes.filter((x) => (x.name ?? '').toLowerCase().includes(s));
  }, [q, recipes]);

  async function saveSlot() {
    if (!selectedRecipeId) return;

    setSaving(true);
    try {
      const r = await fetch('/api/admin/popular', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot: activeSlot, recipeId: selectedRecipeId }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        alert(data?.message ?? 'save failed');
        return;
      }

      // update local (ไม่ต้องรี)
      setSlots((prev) => prev.map((x) => (x.slot === activeSlot ? { ...x, recipe: data.recipe } : x)));
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  // fallback รูป/ข้อความเดิม (เผื่อ API ยังไม่มีข้อมูล)
  const fallbackCards = [
    { name: 'Green Curry', desc: 'All green and fresh soup' },
    { name: 'Tom Yum Goong', desc: 'Gluten free with potato crust!' },
    { name: 'Pad Thai', desc: 'Easy one-pot meal for dinners.' },
    { name: 'Red pork over rice', desc: 'Fancy flavors and textures you need to try.' },
    { name: 'Stir-fried Chicken with cashew nuts', desc: 'Springy, light and yet comforting bowl of pasta.' },
  ];

  return (
    <div className="text-[#637402]">
      <div className="flex relative">
        <h1 className="text-[36px] absolute right-85 font-semibold">IN</h1>
      </div>

      <div className="flex items-center mt-2 gap-7">
        <hr className="w-full border bg-[#637402]" />
        <h1 className="text-[106px] font-semibold border-[#637402]">Popular</h1>
      </div>

      {loadingSlots ? (
        <div className="py-10 text-center text-gray-500 text-sm">กำลังโหลด...</div>
      ) : (
        <div className="grid grid-cols-5 mt-10 place-items-center cards-focus gap-6">
          {(slots.length ? slots : ([1, 2, 3, 4, 5] as any).map((s: number, i: number) => ({ slot: s, recipe: null }))).map((s, i) => {
            const r = s.recipe;
            const fb = fallbackCards[i] ?? fallbackCards[0];

            return (
              <div key={s.slot} className="bg-[#FEFEF6] rounded-3xl flex flex-col pt-6 w-60 card relative">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => openEditor(s.slot)}
                    className="absolute right-3 top-3 text-xs px-3 py-1 rounded-xl border border-[#637402]/30 text-[#637402] hover:bg-[#DFD3A4]/30 z-10"
                  >
                    Edit
                  </button>
                )}

                {/* รูป — บังคับขนาดให้เท่า mockup */}
                <div className="w-60 h-[190px] overflow-hidden">
                  <img
                    src={(r?.coverImage ?? '/GreenCurry.png') as any}
                    alt={(r?.name ?? fb.name) as any}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="font-semibold p-6 h-32 flex flex-col justify-between">
                  <div>
                    <h1 className="text-black text-[18px] leading-5 line-clamp-1">
                      {r?.name ?? fb.name}
                    </h1>

                    <p className="text-[#B0B0B0] text-[14px] leading-5 line-clamp-2 mt-1">
                      {r?.description ?? fb.desc}
                    </p>
                  </div>

                  {/* ยอดไลก์ */}
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-[#637402]/80">
                      {r?.category ?? '-'}
                    </span>
                    <span className="text-black/60">
                      ♥ {r?.likesCount ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            );

          })}
        </div>
      )}

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title={`เลือกเมนู Popular (slot ${activeSlot})`}>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อเมนู..."
            className="w-full rounded-xl border px-3 py-2 outline-none focus:border-[#637402]"
          />
          <button
            type="button"
            onClick={saveSlot}
            disabled={saving || !selectedRecipeId}
            className="px-4 py-2 rounded-xl bg-[#637402] text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {loadingRecipes ? (
          <div className="py-8 text-center text-gray-500 text-sm">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">ไม่พบเมนู</div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 max-h-[55vh] overflow-auto pr-2">
            {filtered.map((r) => {
              const active = selectedRecipeId === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRecipeId(r.id)}
                  className={`text-left rounded-2xl bg-white overflow-hidden transition-all duration-200
                    ring-1 ring-black/10
                    ${active ? 'ring-2 ring-[#637402] shadow-md' : 'hover:shadow-sm hover:ring-black/20'}
                  `}
                >
                  <div className="h-[120px] w-full bg-gray-100 overflow-hidden">
                    <img src={r.coverImage ?? '/nodata.png'} alt={r.name ?? 'recipe'} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm line-clamp-2">{r.name ?? '(no name)'}</div>
                    <div className="text-xs text-gray-500 mt-1">{r.category ?? '-'}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
}
