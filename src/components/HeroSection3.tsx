'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PopularBlock } from './PopularBlock';

type RecipePick = {
  id: string;
  name: string | null;
  coverImage: string | null;
  category: string | null;
};

const CATEGORIES = [
  { label: 'ของหวาน', value: 'ของหวาน', iconKey: 'breakfast' },
  { label: 'ข้าว', value: 'ข้าว', iconKey: 'baking' },
  { label: 'ต้ม/แกง', value: 'ต้ม/แกง', iconKey: 'curry' },
  { label: 'สุขภาพ', value: 'สุขภาพ', iconKey: 'noodle' },
  { label: 'เส้น', value: 'เส้น', iconKey: 'cocktails' },
  { label: 'อื่นๆ', value: 'อื่นๆ', iconKey: 'drink' },
];

export default function HeroSection3({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [categoryRecipes, setCategoryRecipes] = useState<RecipePick[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  useEffect(() => {
    if (!modalOpen || !activeCategory) return;

    async function fetchRecipes() {
      setLoadingRecipes(true);
      try {
        const r = await fetch(
          `/api/recipes?category=${encodeURIComponent(activeCategory)}`,
        );
        const data = r.ok ? await r.json() : [];
        setCategoryRecipes(Array.isArray(data) ? data : []);
      } finally {
        setLoadingRecipes(false);
      }
    }

    fetchRecipes();
  }, [modalOpen, activeCategory]);

  function openCategory(value: string) {
    setActiveCategory(value);
    setCategoryRecipes([]);
    setModalOpen(true);
  }

  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [modalOpen]);

  const iconMap: Record<string, React.ReactNode> = {
    // ของหวาน - คัพเค้ก
    breakfast: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
      >
        <path
          fill="#637402"
          d="M12 3c-1 0-3 .5-3 3H7c-1.1 0-2 .9-2 2v1c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V8c0-1.1-.9-2-2-2h-2c0-2.5-2-3-3-3M6 11l1.5 9h9L18 11H6m6-6c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1z"
        />
      </svg>
    ),
    // ข้าว - ชามข้าว
    baking: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
      >
        <path
          fill="#637402"
          d="M4 11c0 3.86 3.13 7 7 7s7-3.14 7-7H4m7-9C8.24 2 6 3 6 3l1 2s1.5-.5 4-.5s4 .5 4 .5l1-2s-2.24-1-5-1m-7 7h14c0-2-3.13-3-7-3S4 7 4 9m15.5 3c0 .83-.67 1.5-1.5 1.5S16.5 12.83 16.5 12H19m-1.78 4.26l1.06 1.06l-4.24 4.24l-1.06-1.06l4.24-4.24z"
        />
      </svg>
    ),
    // ต้ม/แกง - หม้อ
    curry: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
      >
        <path
          fill="#637402"
          d="M19 11H5c-1.1 0-2 .9-2 2v2c0 3.31 2.69 6 6 6h6c3.31 0 6-2.69 6-6v-2c0-1.1-.9-2-2-2M9 7c0-1.1.9-2 2-2s2 .9 2 2v1h2V7c0-2.21-1.79-4-4-4S7 4.79 7 7v1h2V7m-4 2H3v2h2V9m14 0h-2v2h2V9z"
        />
      </svg>
    ),
    // สุขภาพ - หัวใจ
    noodle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
      >
        <path
          fill="#637402"
          d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        />
      </svg>
    ),
    // เส้น - ส้อมม้วนเส้น
    cocktails: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
      >
        <path
          fill="#637402"
          d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"
        />
      </svg>
    ),
    // อื่นๆ - ดาว
    drink: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
      >
        <path
          fill="#637402"
          d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27z"
        />
      </svg>
    ),
  };

  return (
    <div className="bg-[#F9F7EB] pb-20">
      <div className="container mx-auto">
        <div className="leading-16 text-[#637402]">
          <h1 className="text-[36px]">IN MY</h1>
          <div className="flex items-center gap-7">
            <h1 className="text-[106px] font-semibold">KITCHEN</h1>
            <hr className="w-full border bg-[#637402]" />
          </div>
        </div>

        {/* Category Icons */}
        <div className="grid grid-cols-6 mt-16 place-items-center mb-16 text-[#101010]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => openCategory(cat.value)}
              className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-80 transition group"
            >
              <div className="p-7 bg-[#DFD3A4] rounded-3xl group-hover:bg-[#c9bc8a] transition">
                {iconMap[cat.iconKey]}
              </div>
              <p className="text-[21px] font-semibold">{cat.label}</p>
            </button>
          ))}
        </div>

        <div className="text-[#637402]">
          <PopularBlock isAdmin={Boolean(isAdmin)} />
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[999]">
          <button
            type="button"
            aria-label="close"
            className="absolute inset-0 bg-black/40"
            onClick={() => setModalOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
              <h2 className="font-bold text-[#637402] text-xl capitalize">
                {activeCategory}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-gray-400 text-black px-3 py-1 text-sm hover:bg-gray-50 cursor-pointer"
              >
                ปิด
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {loadingRecipes ? (
                <div className="py-20 flex flex-col items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <p className="text-[#637402] text-sm">กำลังโหลด...</p>
                </div>
              ) : categoryRecipes.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                  ไม่พบสูตรอาหารในหมวด {activeCategory}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {categoryRecipes.map((recipe) => (
                    <button
                      key={recipe.id}
                      type="button"
                      onClick={() => {
                        setModalOpen(false);
                        router.push(`/recipes/${recipe.id}`);
                      }}
                      className="text-left rounded-2xl bg-[#F9F7EB] overflow-hidden hover:shadow-md transition cursor-pointer"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={recipe.coverImage || '/nodata.png'}
                        alt={recipe.name ?? ''}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <p className="font-semibold text-[#637402] line-clamp-1">
                          {recipe.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {recipe.category}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
