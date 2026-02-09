'use client';

import { useState } from 'react';
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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AIResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const ingredients = query
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (ingredients.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!res.ok) throw new Error('Request failed');

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
    <div className="min-h-screen bg-linear-to-b from-lime-800 to-lime-700 text-white">
      {/* HERO */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          AI Chef
        </h1>
        <p className="mt-4 text-lg text-lime-100">
          Let AI turn your ingredients into delicious recipes
        </p>

        {/* SEARCH */}
        <div className="mt-8 flex justify-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ใส่วัตถุดิบ เช่น ไข่, ข้าว, กระเทียม"
            className="w-72 md:w-96 px-4 py-3 rounded-xl text-black outline-none shadow-lg"
          />

          <button
            onClick={handleSearch}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-xl shadow-lg transition active:scale-95"
          >
            ค้นหา
          </button>
        </div>

        {error && <p className="mt-4 text-red-200">{error}</p>}
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
                  className="w-full h-40 object-cover rounded-xl mb-3"
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
      {!loading && results.length === 0 && (
        <p className="text-center text-lime-200 pb-20">
          ลองใส่วัตถุดิบเพื่อให้ AI แนะนำเมนู 👨‍🍳
        </p>
      )}
    </div>
  );
}
