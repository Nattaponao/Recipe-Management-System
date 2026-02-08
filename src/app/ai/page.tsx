'use client';

import { useState } from 'react';
import { useAIAnalyze } from '@/app/hooks/useAIAnalyze';

export default function AIPage() {
  const [input, setInput] = useState('');
  const { results, loading, error, analyze } = useAIAnalyze();

  function handleSearch() {
    const ingredients = input
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    if (ingredients.length === 0) return;

    analyze(ingredients);
  }

  return (
    <div className="min-h-screen bg-lime-700 text-white p-10">
      {/* TITLE */}
      <h1 className="text-6xl font-bold text-center">AI Chef</h1>
      <p className="text-center mt-2 opacity-80">
        Let AI turn your ingredients into recipes
      </p>

      {/* INPUT */}
      <div className="flex gap-2 mt-8 max-w-xl mx-auto">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="เช่น ไข่, ข้าว, หมู"
          className="flex-1 px-4 py-3 rounded text-black"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-400 text-black px-6 rounded font-semibold"
        >
          ค้นหา
        </button>
      </div>

      {/* STATES */}
      {loading && <p className="text-center mt-8">AI กำลังคิดเมนูให้อยู่...</p>}

      {error && <p className="text-center mt-8 text-red-200">{error}</p>}

      {/* RESULTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
        {results.map((r) => (
          <div
            key={r.recipeId}
            className="bg-white text-black p-4 rounded-xl shadow"
          >
            <p className="font-bold">{r.recipeName}</p>
            <p className="text-sm mt-1">Match {r.matchScore}%</p>

            {r.missingIngredients.length > 0 && (
              <p className="text-xs mt-2 text-gray-500">
                ขาด: {r.missingIngredients.join(', ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
