'use client';

import { useState } from 'react';
import { AIAnalyzeResult } from '@/types/ai';

export function useAIAnalyze() {
  const [results, setResults] = useState<AIAnalyzeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyze(ingredients: string[]) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIngredients: ingredients }),
      });

      if (!res.ok) {
        throw new Error('AI analyze failed');
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError('ไม่สามารถวิเคราะห์เมนูได้');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return { results, loading, error, analyze };
}
