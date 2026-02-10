'use client';

import { useState } from 'react';

export function useRecipeSearch() {
  const [query, setQuery] = useState('');
  return { query, setQuery, results: [], loading: false };
}
