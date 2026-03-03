/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, KeyboardEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

type AIResult = {
  recipeId: string;
  recipeName: string;
  matchScore: number;
  missingIngredients: string[];
  reason: string;
  coverImage?: string;
  description?: string;
};

export default function AIPage() {
  const [input, setInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [results, setResults] = useState<AIResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
    }
  }, [authUser, authLoading, router]);

  if (authLoading)
    return (
      <div className="min-h-screen bg-[#F9F7EB] flex flex-col items-center justify-center gap-4">
        <p className="text-[#637402] font-semibold">กำลังโหลดนะ...</p>
      </div>
    );

  if (!authUser) return null;

  const addIngredient = () => {
    const value = input.trim();
    if (!value) return;
    if (!ingredients.includes(value)) {
      setIngredients((prev) => [...prev, value]);
    }
    setInput('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const removeIngredient = (name: string) => {
    setIngredients((prev) => prev.filter((i) => i !== name));
  };

  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    setSearched(true);
    try {
      setLoadingSearch(true);
      setError(null);

      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Request failed: ${res.status} ${res.statusText} - ${text}`,
        );
      }

      const data: AIResult[] = await res.json();
      const sorted = [...data].sort((a, b) => b.matchScore - a.matchScore);
      const canCook = sorted.filter((item) => item.matchScore >= 50);
      setResults(canCook.length > 0 ? canCook : sorted.slice(0, 1));
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการวิเคราะห์เมนู');
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#637402] text-white">
      <section className="text-center pt-24 pb-12 px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold text-yellow-400">
          AI Chef
        </h1>
        <p className="mt-4 text-lg text-lime-100 max-w-2xl mx-auto">
          &#34;No more menu headaches! Let AI Super Chef turn your ingredients
          into recipes.&#34;
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 w-full max-w-3xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="พิมพ์วัตถุดิบแล้วกด Enter"
            className="w-full bg-white text-gray-700 px-5 py-3 rounded-full shadow-md outline-none placeholder:text-gray-400"
          />
          <button
            onClick={handleSearch}
            className="bg-white text-[#637402] font-bold px-10 py-3 rounded-full shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 active:scale-95 cursor-pointer text-lg tracking-wide"
          >
            🔍 ค้นหาเมนู
          </button>

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
                    className="text-gray-400 hover:text-red-500 ml-1 cursor-pointer"
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

      {loadingSearch && (
        <div className="flex justify-center pb-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
        </div>
      )}

      {!loadingSearch && results.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-center text-2xl font-bold mb-8">recommend</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {results.map((r) => (
              <div
                key={r.recipeId}
                onClick={() => router.push(`/recipes/${r.recipeId}`)}
                className="w-56 bg-white text-black rounded-2xl shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition cursor-pointer"
              >
                <div className="h-40 w-full overflow-hidden rounded-t-2xl">
                  {r.coverImage ? (
                    <img
                      src={r.coverImage}
                      alt={r.recipeName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-200">
                      ไม่มีรูปภาพ
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm font-semibold line-clamp-1">
                    {r.recipeName}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {r.description ?? r.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loadingSearch &&
        searched &&
        results.length === 0 &&
        ingredients.length > 0 && (
          <p className="text-center text-lime-200 pb-20">
            ไม่พบเมนูที่เหมาะกับวัตถุดิบนี้ 😢
          </p>
        )}
    </div>
  );
}
