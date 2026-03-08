/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

type AIIngredient = { name: string; amount: string };
type AIStep = { stepNumber: number; instruction: string };
type AIResult = {
  recipeName: string;
  originalName?: string;
  cuisine: string;
  description: string;
  spiceLevel: 'mild' | 'medium' | 'hot' | 'very_hot';
  healthNote: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  ingredients: AIIngredient[];
  steps: AIStep[];
  dbRecipeId: string | null;
  inLibrary: boolean;
  coverImage?: string | null;
  dbDescription?: string | null;
};

const SPICE_CONFIG: Record<
  AIResult['spiceLevel'],
  { label: string; color: string; flame: string }
> = {
  mild: { label: 'ไม่เผ็ด', color: 'bg-green-100 text-green-700', flame: '🌿' },
  medium: {
    label: 'เผ็ดนิดหน่อย',
    color: 'bg-yellow-100 text-yellow-700',
    flame: '🌶',
  },
  hot: { label: 'เผ็ด', color: 'bg-orange-100 text-orange-700', flame: '🌶🌶' },
  very_hot: {
    label: 'เผ็ดมาก',
    color: 'bg-red-100 text-red-700',
    flame: '🌶🌶🌶',
  },
};

function SpiceBadge({ level }: { level: AIResult['spiceLevel'] }) {
  const cfg = SPICE_CONFIG[level] ?? SPICE_CONFIG.mild;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}
    >
      {cfg.flame} {cfg.label}
    </span>
  );
}

function LibraryCard({
  result,
  onNavigate,
}: {
  result: AIResult;
  onNavigate: (id: string) => void;
}) {
  return (
    <div
      onClick={() => result.dbRecipeId && onNavigate(result.dbRecipeId)}
      className="w-56 bg-white text-black rounded-2xl shadow-md overflow-hidden hover:scale-105 hover:shadow-xl transition cursor-pointer"
    >
      <div className="h-40 w-full overflow-hidden rounded-t-2xl bg-gray-200">
        {result.coverImage ? (
          <img
            src={result.coverImage}
            alt={result.recipeName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            ไม่มีรูปภาพ
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold line-clamp-1">
          {result.recipeName}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2">
          {result.dbDescription || result.description}
        </p>
      </div>
    </div>
  );
}

function RecipeCard({
  result,
  onNavigate,
  cardHeight,
}: {
  result: AIResult;
  onNavigate: (id: string) => void;
  cardHeight?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const heightStyle =
    !expanded && cardHeight && cardHeight > 0
      ? { minHeight: `${cardHeight}px` }
      : {};

  return (
    <div
      data-card
      className="bg-white text-gray-800 rounded-3xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      style={heightStyle}
    >
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-bold text-base leading-snug line-clamp-1">
            {result.recipeName}
          </h3>
          {result.originalName && (
            <p className="text-xs text-gray-400 mt-0.5">
              {result.originalName}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <SpiceBadge level={result.spiceLevel} />
          <span className="text-xs bg-lime-100 text-lime-700 font-semibold px-2 py-0.5 rounded-full">
            🌍 {result.cuisine}
          </span>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {result.dbDescription || result.description}
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2">
          <p className="text-xs text-green-700 leading-relaxed">
            <span className="font-semibold">💚 สุขภาพ:</span>{' '}
            {result.healthNote}
          </p>
        </div>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>⏱ เตรียม {result.prepTime}</span>
          <span>🔥 ทำ {result.cookTime}</span>
          <span>👤 {result.servings}</span>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-auto w-full text-sm font-semibold text-[#637402] border border-[#637402] rounded-full py-1.5 hover:bg-[#637402] hover:text-white transition-all duration-200 cursor-pointer"
        >
          {expanded ? '▲ ซ่อนสูตร' : '▼ ดูสูตรทำอาหาร'}
        </button>
        {result.inLibrary && result.dbRecipeId && (
          <button
            onClick={() => onNavigate(result.dbRecipeId!)}
            className="w-full text-sm font-semibold bg-yellow-400 text-black rounded-full py-1.5 hover:bg-yellow-500 transition-all duration-200 cursor-pointer"
          >
            🔗 ไปหน้าสูตรนี้
          </button>
        )}
      </div>
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-5 pt-4 flex flex-col gap-4 bg-gray-50">
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-2">
              🧂 วัตถุดิบ
            </h4>
            <ul className="space-y-1">
              {result.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex justify-between text-xs text-gray-600"
                >
                  <span>{ing.name}</span>
                  <span className="text-gray-400">{ing.amount}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-2">👨‍🍳 วิธีทำ</h4>
            <ol className="space-y-2">
              {result.steps.map((step) => (
                <li
                  key={step.stepNumber}
                  className="flex gap-2 text-xs text-gray-600 leading-relaxed"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#637402] text-white flex items-center justify-center font-bold text-[10px]">
                    {step.stepNumber}
                  </span>
                  <span>{step.instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

function RowsWithEqualHeight({
  row1,
  row2,
  onNavigate,
}: {
  row1: AIResult[];
  row2: AIResult[];
  onNavigate: (id: string) => void;
}) {
  const [cardHeight, setCardHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!containerRef.current) return;
      const cards =
        containerRef.current.querySelectorAll<HTMLElement>('[data-card]');
      if (cards.length === 0) return;
      const maxH = Math.max(...Array.from(cards).map((c) => c.offsetHeight));
      if (maxH > 0) setCardHeight(maxH);
    }, 150);
    return () => clearTimeout(id);
  }, [row1, row2]);

  return (
    <div className="flex flex-col gap-6" ref={containerRef}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(row1.length, 3)}, 1fr)`,
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {row1.map((r, idx) => (
          <RecipeCard
            key={idx}
            result={r}
            onNavigate={onNavigate}
            cardHeight={cardHeight}
          />
        ))}
      </div>
      {row2.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${row2.length}, 1fr)`,
            gap: '24px',
            alignItems: 'start',
            maxWidth: '672px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {row2.map((r, idx) => (
            <RecipeCard
              key={idx + 3}
              result={r}
              onNavigate={onNavigate}
              cardHeight={cardHeight}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AIPage() {
  const [userRequest, setUserRequest] = useState('');
  const [results, setResults] = useState<AIResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !authUser) router.push('/login');
  }, [authUser, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#637402] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-400 border-t-transparent" />
        <p className="text-yellow-400 font-semibold">กำลังโหลด...</p>
      </div>
    );
  }

  if (!authUser) return null;

  const handleSearch = async () => {
    const trimmed = userRequest.trim();
    if (!trimmed) return;
    setSearched(true);
    setLoading(true);
    setNotFound(false);
    setResults([]);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRequest: trimmed, count: 5 }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? `Error ${res.status}`);
      }
      const data = await res.json();
      const list: AIResult[] = data.results ?? [];
      if (list.length === 0) setNotFound(true);
      else setResults(list);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-[#637402] text-white">
      <section className="text-center pt-24 pb-12 px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold text-yellow-400 drop-shadow-lg">
          AI Chef
        </h1>
        <p className="mt-4 text-lg text-lime-100 max-w-2xl mx-auto">
          บอกความต้องการของคุณ แล้ว AI จะแนะนำเมนูพร้อมสูตรให้เลย
        </p>
        <div className="mt-10 flex flex-col items-center gap-5 w-full max-w-2xl mx-auto">
          <textarea
            value={userRequest}
            onChange={(e) => setUserRequest(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="เช่น อยากกินอาหารเผ็ดจากอินเดีย เป็นเบาหวาน, อาหารญี่ปุ่นทำง่าย ไม่แพ้กลูเตน..."
            className="w-full bg-white text-gray-700 px-5 py-4 rounded-2xl shadow-md outline-none placeholder:text-gray-400 resize-none text-sm leading-relaxed"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-white text-[#637402] font-bold px-12 py-3 rounded-full shadow-lg hover:bg-yellow-400 hover:text-black transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide cursor-pointer"
          >
            {loading ? '⏳ กำลังค้นหา...' : '🔍 ค้นหาเมนู'}
          </button>
        </div>
      </section>

      {loading && (
        <div className="flex flex-col items-center justify-center pb-16 gap-3">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-yellow-400 border-t-transparent" />
          <p className="text-lime-100 text-sm">AI กำลังคิดเมนูให้คุณ...</p>
        </div>
      )}

      {!loading && searched && notFound && (
        <div className="flex flex-col items-center justify-center pb-20 gap-3">
          <img
            src="/nodata.png"
            alt="ไม่พบเมนู"
            className="w-56 h-56 object-contain opacity-80"
          />
          {errorMsg && <p className="text-red-300 text-sm">{errorMsg}</p>}
          <p className="text-lime-200 text-sm">
            ลองเปลี่ยนคำค้นหาหรือเงื่อนไขดูนะครับ
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-40">
          <h2 className="text-center text-2xl font-bold mb-8 text-yellow-300">
            🍴 เมนูแนะนำสำหรับคุณ
          </h2>
          {(() => {
            const regular = results.filter((r) => !r.inLibrary);
            const featured = results.filter((r) => r.inLibrary);
            const row1 = regular.slice(0, 3);
            const row2 = regular.slice(3);
            return (
              <div className="flex flex-col gap-10">
                {regular.length > 0 && (
                  <RowsWithEqualHeight
                    row1={row1}
                    row2={row2}
                    onNavigate={(id) => router.push(`/recipes/${id}`)}
                  />
                )}
                {featured.length > 0 && (
                  <div>
                    <h3 className="text-center text-lg font-bold text-yellow-200 mb-4">
                      📖 มีในคลังสูตรของเรา
                    </h3>
                    <div className="flex flex-wrap justify-center gap-6">
                      {featured.map((r, idx) => (
                        <LibraryCard
                          key={idx}
                          result={r}
                          onNavigate={(id) => router.push(`/recipes/${id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </section>
      )}
    </div>
  );
}
