/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// --- TYPES ---
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

// --- MODAL COMPONENT ---
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
      <button
        className="absolute inset-0 bg-black/40 cursor-pointer"
        onClick={onClose}
        aria-label="close"
      />
      <div className="absolute left-1/2 top-1/2 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="font-semibold text-[#637402]">{title}</div>
          <button
            onClick={onClose}
            className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-50 cursor-pointer"
          >
            ปิด
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function PopularBlock({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();

  // State
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [recipes, setRecipes] = useState<RecipeOption[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [q, setQ] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [saving, setSaving] = useState(false);

  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  // 🌟 ใช้ Promise.all โหลดไลก์ทีเดียว ป้องกัน N+1 Request
  useEffect(() => {
    if (!slots.length) return;
    const ids = slots
      .map((s) => s.recipe?.id)
      .filter((id): id is string => !!id);
    if (ids.length === 0) return;

    Promise.all(
      ids.map((id) =>
        fetch(`/api/recipes/${id}/like`).then((r) => (r.ok ? r.json() : null)),
      ),
    ).then((results) => {
      const newLikes: Record<string, boolean> = {};
      const newCounts: Record<string, number> = {};
      results.forEach((data, i) => {
        if (data) {
          newLikes[ids[i]] = data.liked;
          newCounts[ids[i]] = data.count;
        }
      });
      setLikes((prev) => ({ ...prev, ...newLikes }));
      setLikeCounts((prev) => ({ ...prev, ...newCounts }));
    });
  }, [slots]);

  // Handle Like (Optimistic UI update possible, but keeping it simple for now)
  async function handleLike(id: string) {
    const r = await fetch(`/api/recipes/${id}/like`, { method: 'POST' });
    if (r.ok) {
      const data = await r.json();
      setLikes((prev) => ({ ...prev, [id]: data.liked }));
      setLikeCounts((prev) => ({ ...prev, [id]: data.count }));
    }
  }

  // Load Initial Slots
  useEffect(() => {
    (async () => {
      setLoadingSlots(true);
      try {
        const r = await fetch('/api/popular', { cache: 'no-store' });
        const data = await r.json().catch(() => ({}));
        setSlots(Array.isArray(data.slots) ? data.slots : []);
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, []);

  // Ensure Admin Recipes Loaded
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

  // Open Modal
  function openEditor(slot: 1 | 2 | 3 | 4 | 5) {
    if (!isAdmin) return;
    setActiveSlot(slot);
    setSelectedRecipeId(slots.find((s) => s.slot === slot)?.recipe?.id ?? '');
    setQ('');
    setOpen(true);
    ensureRecipesLoaded();
  }

  // Save changes
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
      setSlots((prev) =>
        prev.map((x) =>
          x.slot === activeSlot ? { ...x, recipe: data.recipe } : x,
        ),
      );
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return recipes;
    return recipes.filter((x) => (x.name ?? '').toLowerCase().includes(s));
  }, [q, recipes]);

  // Fallbacks
  const fallbackCards = [
    { name: 'Green Curry', desc: 'All green and fresh soup' },
    { name: 'Tom Yum Goong', desc: 'Gluten free with potato crust!' },
    { name: 'Pad Thai', desc: 'Easy one-pot meal for dinners.' },
    {
      name: 'Red pork over rice',
      desc: 'Fancy flavors and textures you need to try.',
    },
    {
      name: 'Stir-fried Chicken with cashew nuts',
      desc: 'Springy, light and yet comforting bowl of pasta.',
    },
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
        <div className="py-10 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#637402] border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-5 mt-10 items-stretch cards-focus gap-6">
          {(slots.length
            ? slots
            : [1, 2, 3, 4, 5].map((s) => ({ slot: s, recipe: null }))
          ).map((s: any, i) => {
            const r = s.recipe;
            const fb = fallbackCards[i] ?? fallbackCards[0];
            const isLiked = !!likes[r?.id ?? ''];
            const likeCount = likeCounts[r?.id ?? ''] ?? r?.likesCount ?? 0;

            return (
              <div
                key={s.slot}
                onClick={() => r && router.push(`/recipes/${r.id}`)}
                className="bg-[#FEFEF6] rounded-3xl flex flex-col w-full card relative overflow-hidden cursor-pointer hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 group min-h-[340px]"
              >
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditor(s.slot);
                    }}
                    className="absolute right-2 top-2 text-xs px-2 py-1 rounded-lg bg-white/80 border border-[#637402]/40 text-[#637402] hover:bg-white z-10 cursor-pointer shadow-sm"
                  >
                    Edit
                  </button>
                )}

                <div className="w-full h-[190px] overflow-hidden relative">
                  <Image
                    src={r?.coverImage ?? '/GreenCurry.png'}
                    alt={r?.name ?? fb.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="font-semibold p-6 flex flex-col flex-1">
                  <div>
                    <h1 className="text-black text-[18px] leading-5 line-clamp-1">
                      {r?.name ?? fb.name}
                    </h1>
                    <p className="text-[#B0B0B0] text-[14px] leading-5 line-clamp-2 mt-1">
                      {r?.description ?? fb.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full border border-[#637402]/30 text-[#637402]">
                      {r?.category ?? '-'}
                    </span>
                    <button
                      type="button"
                      aria-label={isLiked ? 'Unlike recipe' : 'Like recipe'}
                      onClick={(e) => {
                        e.stopPropagation();
                        r && handleLike(r.id);
                      }}
                      className="flex items-center gap-1 text-sm cursor-pointer"
                    >
                      {isLiked ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#db0101"
                            d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#9ca3af"
                            d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3"
                          />
                        </svg>
                      )}
                      <span className="text-black/60">{likeCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`เลือกเมนู Popular (slot ${activeSlot})`}
      >
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
            className="px-4 py-2 rounded-xl bg-[#637402] text-white disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>

        {loadingRecipes ? (
          <div className="py-16 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#637402] border-t-transparent" />
            <span className="text-sm text-gray-500">กำลังโหลดเมนู...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">
            ไม่พบเมนู
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 max-h-[55vh] overflow-auto pr-2 pb-2">
            {filtered.map((r) => {
              const active = selectedRecipeId === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRecipeId(r.id)}
                  className={`text-left rounded-2xl bg-white overflow-hidden transition-all duration-200 ring-1 ring-black/10 cursor-pointer ${
                    active
                      ? 'ring-2 ring-[#637402] shadow-md'
                      : 'hover:shadow-sm hover:ring-black/20'
                  }`}
                >
                  <div className="h-[120px] w-full bg-gray-100 overflow-hidden relative">
                    <Image
                      src={r.coverImage ?? '/nodata.png'}
                      alt={r.name ?? 'recipe'}
                      fill
                      sizes="(max-width: 768px) 50vw, 460px"
                      className="object-cover"
                    />
                    {active && (
                      <div className="absolute top-2 right-2 text-[11px] px-2 py-1 rounded-full bg-[#637402] text-white shadow">
                        เลือกแล้ว
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm line-clamp-2">
                      {r.name ?? '(no name)'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {r.category ?? '-'}
                    </div>
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
