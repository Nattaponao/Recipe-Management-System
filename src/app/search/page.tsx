'use client';

import { useRecipeSearch } from '@/hooks/useRecipeSearch';

export default function SearchRecipePage() {
  const { query, setQuery, results, loading } = useRecipeSearch();

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ค้นหาเมนู"
      />

      {loading && <p>กำลังค้นหา...</p>}

      {!loading && query && results.length === 0 && <p>ไม่พบเมนู</p>}

      <ul>
        {results.map((r) => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  );
}
