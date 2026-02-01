'use client';

import { useEffect, useState } from 'react';
import { Recipe } from '@/types/recipe';

export function useRecipeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${query}`);
        if (!res.ok) throw new Error('Search failed');
        const data: Recipe[] = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    loading,
  };
}
