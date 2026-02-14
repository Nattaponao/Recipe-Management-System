"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

type HeroStore = {
  title1: string;
  title2: string;
  tag1: string;
  tag2: string;
  readTime: string;
  ctaText: string;
  rightImageDataUrl?: string; // เก็บรูปที่อัปโหลดเป็น data url
};

const DEFAULT_STORE: HeroStore = {
  title1: "Pad Krapao",
  title2: "Moo sub",
  tag1: "How to",
  tag2: "Baking",
  readTime: "12 min read",
  ctaText: "READ NOW",
  rightImageDataUrl: "",
};

const LS_KEY = "hero_inline";

function loadStore(): HeroStore {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_STORE;
    return { ...DEFAULT_STORE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STORE;
  }
}

function saveStore(s: HeroStore) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function Pencil({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      className="absolute -top-2 -right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full"
      style={{ lineHeight: 1 }}
    >
      ✏️
    </span>
  );
}

/**
 * Inline editable text:
 * - admin: contentEditable + save on input (realtime)
 * - non-admin: plain text
 */
function InlineText({
  isAdmin,
  value,
  onChange,
  className,
}: {
  isAdmin: boolean;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  if (!isAdmin) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span
      className={`relative inline-block ${className ?? ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Pencil show={hover} />
      <span
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="outline-none rounded-md px-1 -mx-1 hover:bg-white/10 focus:bg-white/10 ring-1 ring-transparent hover:ring-white/25 focus:ring-white/35"
        onInput={(e) => onChange((e.currentTarget as HTMLSpanElement).innerText)}
        onKeyDown={(e) => {
          // กัน Enter ไม่ให้ขึ้นบรรทัดใหม่ใน hero
          if (e.key === "Enter") {
            e.preventDefault();
            (e.currentTarget as HTMLSpanElement).blur();
          }
        }}
      />
    </span>
  );
}

export default function HeroPage({ isAdmin }: { isAdmin: boolean }) {
  const [data, setData] = useState<HeroStore>(DEFAULT_STORE);
  const [hoverImg, setHoverImg] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setData(loadStore());
  }, []);

  function patch(partial: Partial<HeroStore>) {
    setData((prev) => {
      const next = { ...prev, ...partial };
      saveStore(next);
      return next;
    });
  }

  async function onPickImage(file?: File | null) {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    patch({ rightImageDataUrl: dataUrl });
  }

  const rightSrc = data.rightImageDataUrl?.startsWith("data:")
    ? data.rightImageDataUrl
    : "/kapao.jpeg"; // คง UI เดิม: ถ้าไม่ได้อัปโหลด ใช้ไฟล์เดิม

  return (
    <div className={`bg-[#637402] pb-14`}>
      <div className="flex flex-col md:flex-row justify-between items-center text-white">
        <div className="pl-6 md:pl-19  w-full md:w-auto ">
          <div className={`text-[48px] font-semibold leading-tight md:text-[100px] md:leading-28 mb-8 md:mb-16 md:pt-10e `}>
            <h1>
              <InlineText
                isAdmin={isAdmin}
                value={data.title1}
                onChange={(v) => patch({ title1: v.trim() || DEFAULT_STORE.title1 })}
              />
            </h1>
            <h1>
              <InlineText
                isAdmin={isAdmin}
                value={data.title2}
                onChange={(v) => patch({ title2: v.trim() || DEFAULT_STORE.title2 })}
              />
            </h1>
          </div>

          <hr className="opacity-65" />

          <div className="font-extralight flex flex-col md:flex-row md:items-center mt-4 opacity-65 relative">
            <div className="text-[12px] flex gap-4 pl-0 md:pl-16 mb-2 md:mb-0">
              <button className="border rounded-2xl py-1.5 px-7">
                <InlineText
                  isAdmin={isAdmin}
                  value={data.tag1}
                  onChange={(v) => patch({ tag1: v.trim() || DEFAULT_STORE.tag1 })}
                />
              </button>
              <button className="border rounded-2xl py-1.5 px-7">
                <InlineText
                  isAdmin={isAdmin}
                  value={data.tag2}
                  onChange={(v) => patch({ tag2: v.trim() || DEFAULT_STORE.tag2 })}
                />
              </button>
            </div>
            <p className="text-[14px] md:absolute md:right-0">
              <InlineText
                isAdmin={isAdmin}
                value={data.readTime}
                onChange={(v) => patch({ readTime: v.trim() || DEFAULT_STORE.readTime })}
              />
            </p>
          </div>

          <div className="text-[#DFD3A4] font-extralight pl-0 md:pl-16">
            <button className="bg-[#1C1C1E] py-2 px-6 rounded-3xl mt-9 text-[16px] md:text-[18px] cursor-pointer">
              <InlineText
                isAdmin={isAdmin}
                value={data.ctaText}
                onChange={(v) => patch({ ctaText: v.trim() || DEFAULT_STORE.ctaText })}
              />
            </button>
          </div>
        </div>

        {/* รูปขวา: admin hover ขึ้นดินสอ และคลิกเพื่ออัปโหลด */}
        <div className="mt-10 md:mt-0 w-full md:w-auto flex justify-center relative">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickImage(e.target.files?.[0])}
          />

          {isAdmin && (
            <div
              className="absolute top-3 right-8 z-10"
              style={{ pointerEvents: "none" }}
            >
              <Pencil show={hoverImg} />
            </div>
          )}

          <div
            onMouseEnter={() => isAdmin && setHoverImg(true)}
            onMouseLeave={() => isAdmin && setHoverImg(false)}
            onClick={() => isAdmin && fileRef.current?.click()}
            className={isAdmin ? "cursor-pointer" : ""}
            title={isAdmin ? "คลิกเพื่ออัปโหลดรูปใหม่" : undefined}
          >
            {/* ถ้าเป็น data url ใช้ img เพื่อไม่ต้องตั้ง next.config */}
            {rightSrc.startsWith("data:") ? (
              <img
                src={rightSrc}
                alt="kapao"
                className="w-[90%] md:w-[800px] h-auto "
              />
            ) : (
              <Image
                src={rightSrc}
                alt="kapao"
                width={800}
                height={800}
                className="w-[90%] md:w-[800px] h-auto "
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
