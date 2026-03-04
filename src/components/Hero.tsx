'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

type HeroStore = {
  title1: string;
  title2: string;
  tag1: string;
  tag2: string;
  readTime: string;
  ctaText: string;
  rightImageDataUrl?: string;
};

const DEFAULT_STORE: HeroStore = {
  title1: 'Pad Krapao',
  title2: 'Moo sub',
  tag1: 'How to',
  tag2: 'Baking',
  readTime: '12 min read',
  ctaText: 'READ NOW',
  rightImageDataUrl: '',
};

async function loadFromDB(): Promise<HeroStore> {
  try {
    const r = await fetch('/api/hero', { cache: 'no-store' });
    const data = await r.json();
    return {
      title1: data.title1,
      title2: data.title2,
      tag1: data.tag1,
      tag2: data.tag2,
      readTime: data.read_time,
      ctaText: data.cta_text,
      rightImageDataUrl: data.right_image_url ?? '',
    };
  } catch {
    return DEFAULT_STORE;
  }
}

async function saveToDB(s: HeroStore) {
  await fetch('/api/hero', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title1: s.title1,
      title2: s.title2,
      tag1: s.tag1,
      tag2: s.tag2,
      read_time: s.readTime,
      cta_text: s.ctaText,
      right_image_url: s.rightImageDataUrl || null,
    }),
  });
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ''));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function InlineText({
  isAdmin,
  initialValue,
  onChange,
  className,
}: {
  isAdmin: boolean;
  initialValue: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (spanRef.current && spanRef.current.innerText !== initialValue) {
      spanRef.current.innerText = initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isAdmin) return <span className={className}>{initialValue}</span>;

  return (
    <span
      ref={spanRef}
      contentEditable
      suppressContentEditableWarning
      className={`outline-none rounded px-0.5 hover:bg-white/10 focus:bg-white/10 ${className ?? ''}`}
      onInput={(e) => onChange((e.currentTarget as HTMLSpanElement).innerText)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLSpanElement).blur();
        }
      }}
    />
  );
}

export default function HeroPage({ isAdmin }: { isAdmin: boolean }) {
  const [data, setData] = useState<HeroStore>(DEFAULT_STORE);
  const [hoverImg, setHoverImg] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadFromDB().then(setData);
  }, []);

  function patch(partial: Partial<HeroStore>) {
    setData((prev) => {
      const next = { ...prev, ...partial };
      saveToDB(next);
      return next;
    });
  }

  async function onPickImage(file?: File | null) {
    if (!file) return;
    patch({ rightImageDataUrl: await fileToDataUrl(file) });
  }

  const rightSrc = data.rightImageDataUrl?.startsWith('data:')
    ? data.rightImageDataUrl
    : '/kapao.jpeg';

  return (
    /* ── Hero wrapper ── ห้ามสูงเกิน 500px และ overflow hidden */
    <div className="bg-[#637402] h-[460px] md:h-[500px] overflow-hidden">
      <div className="max-w-[1400px] mx-auto h-full">
        {/* ── Grid 2 คอลัมน์: ซ้าย auto, ขวา 48% ── */}
        <div className="h-full grid md:grid-cols-[1fr_48%] grid-cols-1 gap-5 p-5">
          {/* ── LEFT: flex column, justify-between ทำให้ title บน / meta ล่าง ── */}
          <div className="flex flex-col justify-between text-white pl-16 pr-10 pt-10 pb-8 min-w-0 overflow-hidden">
            {/* Title */}
            <div className="text-[52px] md:text-[68px] lg:text-[80px] font-bold leading-[1.05]">
              <h1>
                <InlineText
                  isAdmin={isAdmin}
                  initialValue={data.title1}
                  onChange={(v) =>
                    patch({ title1: v.trim() || DEFAULT_STORE.title1 })
                  }
                />
              </h1>
              <h1>
                <InlineText
                  isAdmin={isAdmin}
                  initialValue={data.title2}
                  onChange={(v) =>
                    patch({ title2: v.trim() || DEFAULT_STORE.title2 })
                  }
                />
              </h1>
            </div>

            {/* Bottom meta — hr + tags + CTA */}
            <div className="shrink-0">
              <div className="flex items-center gap-2 mb-4 text-white/65 text-[11px] font-light flex-wrap">
                <button className="border border-white/40 rounded-full py-1 px-3 hover:bg-white/10 transition-colors">
                  <InlineText
                    isAdmin={isAdmin}
                    initialValue={data.tag1}
                    onChange={(v) =>
                      patch({ tag1: v.trim() || DEFAULT_STORE.tag1 })
                    }
                  />
                </button>
                <button className="border border-white/40 rounded-full py-1 px-3 hover:bg-white/10 transition-colors">
                  <InlineText
                    isAdmin={isAdmin}
                    initialValue={data.tag2}
                    onChange={(v) =>
                      patch({ tag2: v.trim() || DEFAULT_STORE.tag2 })
                    }
                  />
                </button>
                <span className="text-[12px]">
                  <InlineText
                    isAdmin={isAdmin}
                    initialValue={data.readTime}
                    onChange={(v) =>
                      patch({ readTime: v.trim() || DEFAULT_STORE.readTime })
                    }
                  />
                </span>
              </div>

              <button className="bg-[#1C1C1E] text-[#DFD3A4] py-2 px-7 rounded-full text-[14px] font-medium hover:bg-[#2c2c2e] transition-colors cursor-pointer tracking-wide">
                <InlineText
                  isAdmin={isAdmin}
                  initialValue={data.ctaText}
                  onChange={(v) =>
                    patch({ ctaText: v.trim() || DEFAULT_STORE.ctaText })
                  }
                />
              </button>
            </div>
          </div>

          {/* ── RIGHT: รูปภาพ rounded ── */}
          <div
            className="relative rounded-[20px] overflow-hidden h-full"
            onMouseEnter={() => isAdmin && setHoverImg(true)}
            onMouseLeave={() => isAdmin && setHoverImg(false)}
            onClick={() => isAdmin && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onPickImage(e.target.files?.[0])}
            />

            {isAdmin && hoverImg && (
              <div className="absolute top-3 right-3 z-10 bg-black/70 text-white text-[11px] px-3 py-1.5 rounded-full cursor-pointer">
                ✏️ เปลี่ยนรูป
              </div>
            )}

            {rightSrc.startsWith('data:') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={rightSrc}
                alt="kapao"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <Image
                src={rightSrc}
                alt="kapao"
                fill
                className="object-cover object-center"
                sizes="48vw"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
