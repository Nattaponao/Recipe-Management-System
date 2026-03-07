/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

// --- TYPES ---
type RecipePick = {
  id: string;
  name: string | null;
  coverImage: string | null;
  category: string | null;
  createdAt?: string | null;
  author?: {
    id: number;
    name: string | null;
    email: string;
    image?: string | null;
  } | null;
};

type SlotData = {
  slot: 1 | 2 | 3 | 4;
  recipe: RecipePick;
};

// --- UTILS & SMALL COMPONENTS ---
function DefaultAvatarSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="0 0 24 24"
    >
      <g fill="#fff" fillRule="evenodd" clipRule="evenodd">
        <path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0" />
        <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0 1 12.065 14a8.98 8.98 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.96 8.96 0 0 1-5.672-2.012A6.99 6.99 0 0 1 12.065 16a6.99 6.99 0 0 1 5.689 2.92A8.96 8.96 0 0 1 12 21" />
      </g>
    </svg>
  );
}

function formatDate(d?: string | null) {
  if (!d) return null;
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ownerName(recipe: RecipePick, fallback: string) {
  const n = recipe.author?.name?.trim();
  if (n) return n;
  const e = recipe.author?.email?.trim();
  if (e) return e.split('@')[0];
  return fallback;
}

const defaultProfile = (slot: 1 | 2 | 3 | 4) => {
  if (slot === 1)
    return {
      name: 'Peter Pan',
      date: 'March 20, 2022',
      avatar: '/person01.jpeg',
    };
  return {
    name: 'Jane Baker',
    date: 'March 13, 2022',
    avatar: '/persin02.jpeg',
  };
};

// 🌟 1. แยก Profile ออกมาข้างนอก
function Profile({
  slot,
  recipe,
}: {
  slot: 1 | 2 | 3 | 4;
  recipe: RecipePick;
}) {
  const def = defaultProfile(slot);
  const name = recipe.author ? ownerName(recipe, def.name) : def.name;
  const date = formatDate(recipe.createdAt) ?? def.date;
  const avatar: string | null = recipe.author?.image ?? null;
  return (
    <div className="flex items-center gap-4">
      <div className="w-[34px] h-[34px] rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center bg-[#637402]">
        {avatar ? (
          <Image
            src={avatar}
            alt="person"
            width={34}
            height={34}
            className="w-full h-full object-cover"
          />
        ) : (
          <DefaultAvatarSVG />
        )}
      </div>
      <div>
        <p>{name}</p>
        <p>{date}</p>
      </div>
    </div>
  );
}

// 🌟 2. แยก Heart ออกมาข้างนอก (รับ Props แทนการดึง State ตรงๆ)
function Heart({
  isLiked,
  count,
  onToggle,
}: {
  isLiked: boolean;
  count?: number;
  onToggle: () => void;
}) {
  return (
    <div
      className="flex items-center gap-1 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      {!isLiked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
        >
          <path
            fill="#1C1C1E"
            d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
        >
          <path
            fill="#db0101"
            d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
          />
        </svg>
      )}
      {count !== undefined && (
        <span className="text-sm text-gray-500">{count}</span>
      )}
    </div>
  );
}

// 🌟 3. แยก RightCard ออกมาข้างนอก
function RightCard({
  slot,
  recipe,
  isAdmin,
  onEdit,
  isLiked,
  likeCount,
  onToggleLike,
}: {
  slot: 2 | 3 | 4;
  recipe: RecipePick;
  isAdmin: boolean;
  onEdit: (s: 1 | 2 | 3 | 4) => void;
  isLiked: boolean;
  likeCount?: number;
  onToggleLike: () => void;
}) {
  return (
    <div className="flex w-full bg-[#FEFEF6] px-4 rounded-xl relative overflow-hidden min-w-0">
      {isAdmin && (
        <button
          type="button"
          onClick={() => onEdit(slot)}
          className="absolute right-3 top-3 text-xs px-3 py-1 rounded-xl border border-[#637402]/30 text-[#637402] hover:bg-[#DFD3A4]/30 z-10 cursor-pointer bg-white/80"
        >
          Edit
        </button>
      )}
      {/* 🌟 เพิ่ม min-h ตรงนี้กันรูปหดหายไป */}
      <div className="shrink-0 w-[275px] min-h-[180px] relative group overflow-hidden">
        <Image
          src={recipe.coverImage ?? '/nodata.png'}
          alt={recipe.name ?? 'Recipe'}
          sizes="275px"
          fill
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>
      <div className="p-5 flex-1 min-w-0 flex flex-col justify-center">
        <p className="font-semibold line-clamp-2">
          {recipe.name ?? 'Untitled'}
        </p>
        <div className="flex items-center justify-between mt-5">
          <p className="py-1.5 px-3 border rounded-3xl text-[14px] font-semibold">
            {recipe.category ?? '-'}
          </p>
          <Heart isLiked={isLiked} count={likeCount} onToggle={onToggleLike} />
        </div>
        <hr className="border border-[#DFD3A4] my-3.5" />
        <Profile slot={slot} recipe={recipe} />
      </div>
    </div>
  );
}

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
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
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
        type="button"
        aria-label="close overlay"
        className="absolute inset-0 bg-black/40 cursor-pointer"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="font-semibold text-[#637402]">{title}</div>
          <button
            type="button"
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
export default function RecipeOfWeek({
  isAdmin = false,
  initialSlots,
}: {
  isAdmin?: boolean;
  initialSlots: Record<1 | 2 | 3 | 4, SlotData>;
}) {
  const [likes, setLikes] = useState<{ [key: string]: boolean }>({});
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [slots, setSlots] =
    useState<Record<1 | 2 | 3 | 4, SlotData>>(initialSlots);
  const [loadingSlots, setLoadingSlots] = useState(true);

  const [open, setOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<1 | 2 | 3 | 4>(1);
  const [recipeList, setRecipeList] = useState<RecipePick[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [q, setQ] = useState('');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  async function handleToggle(id: string) {
    const r = await fetch(`/api/recipes/${id}/like`, { method: 'POST' });
    if (r.ok) {
      const data = await r.json();
      setLikes((prev) => ({ ...prev, [id]: data.liked }));
      setLikeCounts((prev) => ({ ...prev, [id]: data.count }));
    }
  }

  // 🌟 ใช้ Promise.all โหลดไลก์ทีเดียว ป้องกันเบราว์เซอร์ค้าง
  useEffect(() => {
    if (!slots) return;
    const ids = [
      slots[1]?.recipe?.id,
      slots[2]?.recipe?.id,
      slots[3]?.recipe?.id,
      slots[4]?.recipe?.id,
    ].filter((id): id is string => !!id && id !== '[id]');

    if (ids.length === 0) return;

    Promise.all(
      ids.map((id) =>
        fetch(`/api/recipes/${id}/like`).then((r) => (r.ok ? r.json() : null)),
      ),
    ).then((results) => {
      const newLikes: any = {};
      const newCounts: any = {};
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

  useEffect(() => {
    (async () => {
      setLoadingSlots(true);
      try {
        const r = await fetch('/api/featured', { cache: 'no-store' });
        const data = await r.json().catch(() => ({}));
        const arr: SlotData[] = Array.isArray(data.slots) ? data.slots : [];
        const map: any = {};
        for (const s of arr) map[s.slot] = s;
        setSlots(map);
      } finally {
        setLoadingSlots(false);
      }
    })();
  }, []);

  async function ensureRecipesLoaded() {
    if (recipeList.length > 0) return;
    setLoadingRecipes(true);
    try {
      const r = await fetch('/api/admin/recipes', { cache: 'no-store' });
      const data = await r.json().catch(() => ({}));
      setRecipeList(Array.isArray(data.recipes) ? data.recipes : []);
    } finally {
      setLoadingRecipes(false);
    }
  }

  function openEditor(slot: 1 | 2 | 3 | 4) {
    if (!isAdmin) return;
    setActiveSlot(slot);
    setSelectedRecipeId(slots?.[slot]?.recipe?.id ?? '');
    setQ('');
    setOpen(true);
    ensureRecipesLoaded();
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return recipeList;
    return recipeList.filter((x) => (x.name ?? '').toLowerCase().includes(s));
  }, [q, recipeList]);

  async function saveSlot() {
    if (!selectedRecipeId) {
      alert('เลือกเมนูก่อน');
      return;
    }
    setSaving(true);
    try {
      const r = await fetch('/api/admin/featured', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot: activeSlot, recipeId: selectedRecipeId }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        alert(data?.message ?? 'save failed');
        return;
      }
      const rr = await fetch('/api/featured', { cache: 'no-store' });
      const dd = await rr.json().catch(() => ({}));
      const arr: SlotData[] = Array.isArray(dd.slots) ? dd.slots : [];
      const map: any = {};
      for (const s of arr) map[s.slot] = s;
      setSlots(map);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  if (loadingSlots || !slots) {
    return (
      <div className="bg-[#F9F7EB] h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#637402] border-t-transparent" />
          <p className="text-[#637402] font-semibold">
            กำลังโหลดข้อมูลเมนูแนะนำ...
          </p>
        </div>
      </div>
    );
  }

  const left = slots[1].recipe;

  return (
    <div className="bg-[#F9F7EB] text-black">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 py-20 gap-5">
          {/* LEFT (Slot 1) */}
          <div className="bg-[#FEFEF6] p-5 rounded-2xl flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-[30px] font-semibold">Recipe of Week</h1>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => openEditor(1)}
                  className="text-sm px-3 py-1 rounded-xl border border-[#637402]/30 text-[#637402] hover:bg-[#DFD3A4]/30 cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="flex justify-center flex-1">
              <div className="w-full max-w-[520px] flex flex-col justify-center">
                <div
                  className="my-5 w-full overflow-hidden rounded-xl relative"
                  style={{ aspectRatio: '5 / 4' }}
                >
                  <Image
                    src={left.coverImage ?? '/nodata.png'}
                    alt={left.name ?? 'Recipe'}
                    fill
                    sizes="520px"
                    priority
                    className="object-cover transition-transform duration-300 ease-out hover:scale-105"
                  />
                </div>
                <h2 className="text-[20px] font-semibold text-black mb-3 line-clamp-1">
                  {left.name ?? 'Untitled'}
                </h2>
                <div className="flex justify-between items-center">
                  <p className="text-[14px] font-semibold py-1 px-7 border rounded-3xl">
                    {left.category ?? 'curry'}
                  </p>
                  <Heart
                    isLiked={!!likes[left.id]}
                    count={likeCounts[left.id]}
                    onToggle={() => handleToggle(left.id)}
                  />
                </div>
                <hr className="border border-[#DFD3A4] my-5" />
                <Profile slot={1} recipe={left} />
              </div>
            </div>
          </div>

          {/* RIGHT (Slots 2, 3, 4) */}
          <div className="grid grid-rows-3 gap-6 h-full">
            {[2, 3, 4].map((slotNumber) => {
              const r = slots[slotNumber as 2 | 3 | 4].recipe;
              return (
                <RightCard
                  key={slotNumber}
                  slot={slotNumber as 2 | 3 | 4}
                  recipe={r}
                  isAdmin={isAdmin}
                  onEdit={openEditor}
                  isLiked={!!likes[r.id]}
                  likeCount={likeCounts[r.id]}
                  onToggleLike={() => handleToggle(r.id)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* MODAL (สำหรับ Admin เลือกเมนู) */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`เลือกเมนู (slot ${activeSlot})`}
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
          <div className="py-10 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#637402] border-t-transparent" />
            <p className="text-[#637402] font-semibold">กำลังโหลด...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            ไม่พบเมนู
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-5 max-h-[55vh] overflow-auto pr-2">
            {filtered.map((r) => {
              const active = selectedRecipeId === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRecipeId(r.id)}
                  className={`group text-left rounded-2xl bg-white overflow-hidden transition-all duration-200 ring-1 ring-black/10 cursor-pointer ${
                    active
                      ? 'ring-2 ring-[#637402] shadow-lg'
                      : 'hover:shadow-md hover:ring-black/20'
                  }`}
                >
                  <div className="relative h-[150px] w-full bg-gray-100">
                    <Image
                      src={r.coverImage ?? '/nodata.png'}
                      alt={r.name ?? 'recipe'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    {active && (
                      <div className="absolute top-2 right-2 text-[11px] px-2 py-1 rounded-full bg-[#637402] text-white shadow">
                        เลือกแล้ว
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm leading-snug line-clamp-2">
                      {r.name ?? '(no name)'}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 flex items-center justify-between">
                      <span className="truncate">{r.category ?? '-'}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition text-[#637402]">
                        เลือก →
                      </span>
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
