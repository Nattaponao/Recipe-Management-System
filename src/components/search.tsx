/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RecipeCard = {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  category: string | null;
  country: string | null;
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function SearchRecipeClient({
  initialRecipes,
  isAdmin = false,
}: {
  initialRecipes: RecipeCard[];
  isAdmin?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(""); // เก็บค่าตรง DB
  const [country, setCountry] = useState("");

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [recipes, setRecipes] = useState<RecipeCard[]>(initialRecipes);
  const [loading, setLoading] = useState(false);

  const safeRecipes = Array.isArray(recipes) ? recipes : [];

  // ✅ option จากข้อมูลจริง (initial)
  const categories = useMemo(() => {
    const set = new Set<string>();
    (Array.isArray(initialRecipes) ? initialRecipes : []).forEach((r) => {
      if (r.category && r.category.trim()) set.add(r.category.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialRecipes]);

  const countries = useMemo(() => {
    const set = new Set<string>();
    (Array.isArray(initialRecipes) ? initialRecipes : []).forEach((r) => {
      if (r.country && r.country.trim()) set.add(r.country.trim());
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialRecipes]);

  // ✅ client-side filter (กันกรณี API ไม่กรอง/ค่าไม่ match)
  const filteredLocal = useMemo(() => {
    const q = normalize(query);
    return safeRecipes.filter((r) => {
      const okQ =
        !q ||
        normalize(r.name ?? "").includes(q) ||
        normalize(r.description ?? "").includes(q);

      const okCat = !category || (r.category ?? "") === category;
      const okCountry = !country || (r.country ?? "") === country;

      return okQ && okCat && okCountry;
    });
  }, [safeRecipes, query, category, country]);

  const itemsText = useMemo(() => `${filteredLocal.length} items`, [filteredLocal.length]);

  // ✅ fetch ใหม่เมื่อมี filter (คงของเดิมไว้ แต่ให้แน่ใจส่งค่าจริงจาก DB)
  useEffect(() => {
    if (!mounted) return;

    const t = setTimeout(async () => {
      setLoading(true);

      try {
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (category) params.set("category", category);
        if (country) params.set("country", country);

        const res = await fetch(`/api/recipes?${params.toString()}`);
        const data = await res.json();
        setRecipes(Array.isArray(data) ? data : []);
      } catch {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [mounted, query, category, country]);

  return (
    <div className="bg-[#F9F7EB]">
      <div className="container mx-auto">
        <h1 className="text-[105px] font-semibold text-[#637402]">Recipes</h1>

        <div className="relative flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาเมนู..."
            className="bg-white w-full px-14 py-3 rounded-3xl outline-none"
            id="search"
          />
          <span className="absolute left-6 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#333"
                d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
              />
            </svg>
          </span>
        </div>

        <hr className="border-0 h-px bg-[#637402] mt-5" />

        <div className="flex justify-between mt-3 text-black">
          <p className="text-[24px] font-semibold">Filter recipes</p>
          <p className="text-[24px] font-semibold">{itemsText}</p>
        </div>

        <div className="flex gap-7 mt-5 items-center">
          {/* Category */}
          <div className="flex items-center relative w-90">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-white rounded-3xl py-3 px-4 pr-10 text-gray-700 outline-none cursor-pointer w-full"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <i className="absolute right-4 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1024 1024">
                <path
                  fill="#aeaeae"
                  d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001c13.2-13.2 34.8-13.2 48 0l451.8 451.8l445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199"
                />
              </svg>
            </i>
          </div>

          {/* Country */}
          <div className="flex items-center relative w-90">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="appearance-none bg-white rounded-3xl py-3 px-4 pr-10 text-gray-700 outline-none cursor-pointer w-full"
            >
              <option value="">All countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <i className="absolute right-4 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1024 1024">
                <path
                  fill="#aeaeae"
                  d="M8.2 275.4c0-8.6 3.4-17.401 10-24.001c13.2-13.2 34.8-13.2 48 0l451.8 451.8l445.2-445.2c13.2-13.2 34.8-13.2 48 0s13.2 34.8 0 48L542 775.399c-13.2 13.2-34.8 13.2-48 0l-475.8-475.8c-6.8-6.8-10-15.4-10-24.199"
                />
              </svg>
            </i>
          </div>

          {/* Reset */}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("");
              setCountry("");
              setRecipes(initialRecipes);
            }}
            className="text-[#637402] font-semibold hover:underline"
          >
            Reset
          </button>

          {/* Add */}
          <div>
            <Link href="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256">
                <path
                  fill="#637402"
                  d="M208 32H48a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h160a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16m-24 104h-48v48a8 8 0 0 1-16 0v-48H72a8 8 0 0 1 0-16h48V72a8 8 0 0 1 16 0v48h48a8 8 0 0 1 0 16"
                  strokeWidth="6.5"
                  stroke="#637402"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-16">
          {loading ? (
            <div className="flex justify-center py-20">
              <img src="/loading.gif" alt="loading" className="w-24 h-24" />
            </div>
          ) : (
            <>
              {!loading && (query.trim() || category || country) && filteredLocal.length === 0 && (
                <div className="flex justify-center mt-10">
                  <Image
                    src="/nodata.png"
                    alt="ไม่พบสูตรอาหาร"
                    width={350}
                    height={350}
                    className="opacity-90"
                    priority
                  />
                </div>
              )}

              <div className="grid grid-cols-4 gap-4 mt-4 pb-10">
                {filteredLocal.map((r) => (
                  <Link key={r.id} href={`/recipes/${r.id}`}>
                    <div className="text-black rounded-xl bg-[#FEFEF6] w-70 overflow-hidden group flex flex-col h-full">
                      <div className="py-4">
                        <h2 className="pl-2 font-semibold">{r.name}</h2>
                      </div>

                      <div className="h-40 overflow-hidden">
                        <img
                          src={r.coverImage ?? "https://picsum.photos/seed/food/800/500"}
                          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                        />
                      </div>

                      <p className="text-sm text-gray-600 py-4 px-3 line-clamp-2">{r.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
