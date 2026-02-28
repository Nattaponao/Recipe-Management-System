/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, KeyboardEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type AIResult = {
  recipeId: string;
  recipeName: string;
  matchScore: number;
  missingIngredients: string[];
  reason: string;
  coverImage?: string;
};

export default function AIPage() {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [results, setResults] = useState<AIResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ➕ เพิ่ม ingredient ด้วย Enter
  const addIngredient = () => {
    const value = input.trim();
    if (!value) return;

    if (!ingredients.includes(value)) {
      setIngredients((prev) => [...prev, value]);
    }
    setInput('');
  };

  // ⌨️ กด Enter
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  // ❌ ลบ ingredient
  const removeIngredient = (name: string) => {
    setIngredients((prev) => prev.filter((i) => i !== name));
  };

  // 🔍 ค้นหา AI
  const handleSearch = async () => {
    if (ingredients.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!res.ok) {
        const text = await res.text(); // อ่าน error body
        throw new Error(
          `Request failed: ${res.status} ${res.statusText} - ${text}`,
        );
      }

      const data: AIResult[] = await res.json();

      const sorted = [...data].sort((a, b) => b.matchScore - a.matchScore);
      setResults(sorted);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการวิเคราะห์เมนู');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#637402] text-white">
      {/* HERO */}
      <section className="text-center pt-24 pb-12 px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold text-yellow-400">
          AI Chef
        </h1>

        <p className="mt-4 text-lg text-lime-100 max-w-2xl mx-auto">
          “No more menu headaches! Let AI Super Chef turn your ingredients into
          recipes.”
        </p>

        {/* SEARCH BAR */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 w-full max-w-3xl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="พิมพ์วัตถุดิบแล้วกด Enter"
              className="flex-1 bg-white text-gray-700 px-5 py-3 rounded-md shadow-md outline-none placeholder:text-gray-400"
            />

            <button
              onClick={handleSearch}
              className="bg-yellow-400 hover:bg-yellow-300 text-black rounded-full w-12 h-12 flex items-center justify-center shadow-md transition active:scale-95"
            >
              ➤
            </button>
          </div>

          {/* INGREDIENT CHIPS */}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
              {ingredients.map((item) => (
                <div
                  key={item}
                  className="bg-white text-gray-700 px-4 py-2 rounded-full shadow text-sm flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-black rounded-full" />

                  {item}

                  <button
                    onClick={() => removeIngredient(item)}
                    className="text-gray-400 hover:text-red-500 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-200 mt-2">{error}</p>}
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center pb-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </div>
      )}

      {/* RESULTS SECTION - CARD LAYOUT */}
      {!loading && results.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <div
              key={r.recipeId}
              className="bg-white text-black rounded-4xl shadow-2xl shadow-black/20 overflow-hidden hover:scale-[1.03] transition-transform duration-300 flex flex-col"
            >
              {/* รูปภาพเมนู */}
              <div className="relative h-48 w-full bg-gray-200">
                {r.coverImage ? (
                  <img
                    src={r.coverImage}
                    alt={r.recipeName}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    ไม่มีรูปภาพ
                  </div>
                )}
                {/* Badge คะแนนความเข้ากัน */}
                <div className="absolute top-4 right-4 bg-[#637402] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  {r.matchScore}% Match
                </div>
              </div>

              {/* รายละเอียดข้อมูล */}
              <div className="p-6 flex flex-col flex-1 space-y-4">
                <h3 className="text-xl font-bold text-[#637402] line-clamp-1">
                  {r.recipeName}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed italic">
                  &#34;{r.reason}&#34;
                </p>

                {/* ส่วนแสดงวัตถุดิบที่ขาด */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    วัตถุดิบที่ต้องหาเพิ่ม
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {r.missingIngredients.length > 0 ? (
                      r.missingIngredients.map((ing, idx) => (
                        <span
                          key={idx}
                          className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-semibold border border-red-100"
                        >
                          + {ing}
                        </span>
                      ))
                    ) : (
                      <span className="text-lime-600 text-xs font-bold">
                        ✓ ครบถ้วน พร้อมทำเลย!
                      </span>
                    )}
                  </div>
                </div>

                {/* ปุ่มดูรายละเอียดสูตร (Optionally) */}
                <button
                  onClick={() => router.push(`/recipes/${r.recipeId}`)}
                  className="mt-auto w-full py-3 bg-[#FE9F4D] hover:bg-[#e88e3d] text-white rounded-xl font-bold transition-colors"
                >
                  ดูวิธีทำ
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* EMPTY STATE */}
      {!loading && results.length === 0 && ingredients.length > 0 && (
        <p className="text-center text-lime-200 pb-20">
          ไม่พบเมนูที่เหมาะกับวัตถุดิบนี้ 😢
        </p>
      )}
    </div>
  );
}
