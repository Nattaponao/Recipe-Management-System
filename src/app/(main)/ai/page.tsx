'use client';

import { useState, KeyboardEvent } from 'react';
import Image from 'next/image';

type AIResult = {
  recipeId: string;
  recipeName: string;
  matchScore: number;
  missingIngredients: string[];
  reason: string;
  image?: string;
};

export default function AIPage() {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [results, setResults] = useState<AIResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`);
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

      {/* RESULTS */}
      {!loading && results.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <div
              key={r.recipeId}
              className="bg-white text-black rounded-2xl shadow-xl overflow-hidden hover:scale-[1.02] transition"
            >
              {r.image && (
                <Image
                  src={r.image}
                  alt={r.recipeName}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover"
                />
              )}

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{r.recipeName}</h3>

                  <span className="text-sm bg-lime-600 text-white px-2 py-1 rounded-lg">
                    {r.matchScore}%
                  </span>
                </div>

                <p className="text-sm text-gray-600">{r.reason}</p>

                {r.missingIngredients.length > 0 && (
                  <p className="text-sm text-red-500">
                    ขาด: {r.missingIngredients.join(', ')}
                  </p>
                )}
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
