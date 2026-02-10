"use client";

import { useState } from "react";


type Step = { id: string; stepNo: number; text: string };

type Ingredient = {
  id: string;
  name: string;
  amount: number | null;
  unit: string | null;
  sortOrder: number | null;
};

type Recipe = {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  category: string;
  country: string;
  steps: Step[];
  ingredients: Ingredient[];

};

export default function RecipeDetailClient({ recipe }: { recipe: Recipe }) {
  const [liked, setLiked] = useState(false);
  const [foverited, setFoverited] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const title = recipe?.name ?? "Recipe";
    const text = recipe?.description ? `ลองดูเมนูนี้: ${recipe.description}` : "ลองดูสูตรนี้";

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("คัดลอกลิงก์แล้ว!");
      }
    } catch (err) {
      console.log("Share canceled / failed:", err);
    }
  };


  return (
    <div className="bg-[#F9F7EB] {fredoka.className}">
      <div className="w-full h-180 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipe.coverImage ?? "/nodata.png"}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-10 left-25 bg-[#637402] p-4 rounded-xl">
          <h1 className="font-bold text-white text-[30px]">{recipe.name}</h1>
          <div className="flex items-center justify-between w-80">
            <p className="text-white text-[18px]">by Wavi</p>
            <button
              type="button"
              className="mt-3 cursor-pointer"
              onClick={() => setLiked((v) => !v)}
              aria-label="like"
            >
              {!liked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                  <path fill="#fff" d="m12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                  <path fill="#db0101" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z" />
                </svg>
              )}
            </button>

          </div>
          <div className="text-[18px] text-white mt-1 flex justify-between items-center">
            <p >ถูกใจทั้งหมด</p>
            <p>999</p>
            
          </div>

        </div>
      </div>

      <div className="mt-9">
        <div className="relative w-full px-5">
          <div className="mx-auto bg-[#637402] py-9 px-4 rounded-2xl max-w-[600px] text-center">
            <p className="leading-7 text-white text-[24px]">
              &quot;{recipe.description}&quot;
            </p>
          </div>
          <div className="absolute right-5 top-0 flex items-start gap-5">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setFoverited((v) => !v)}
              aria-label="Foverites"
            >
              {!foverited ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24">
                  <path fill="#637402" d="M16 2H8a3 3 0 0 0-3 3v16a1 1 0 0 0 .5.87a1 1 0 0 0 1 0l5.5-3.18l5.5 3.18a1 1 0 0 0 .5.13a1 1 0 0 0 .5-.13A1 1 0 0 0 19 21V5a3 3 0 0 0-3-3m1 17.27l-4.5-2.6a1 1 0 0 0-1 0L7 19.27V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24">
                  <path fill="#FFC107" fillRule="evenodd" d="M8 2a3 3 0 0 0-3 3v16a1 1 0 0 0 1.447.894L12 19.118l5.553 2.776A1 1 0 0 0 19 21V5a3 3 0 0 0-3-3z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button type="button" aria-label="Share" className="cursor-pointer" onClick={handleShare}>
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 640 640">
                <path fill="#637402" d="M457.5 71c-6.9-6.9-17.2-8.9-26.2-5.2S416.5 78.3 416.5 88v56h-48c-88.4 0-160 71.6-160 160c0 46.7 20.7 80.4 43.6 103.4c8.1 8.2 16.5 14.9 24.3 20.4c9.2 6.5 21.7 5.7 30.1-1.9s10.2-20 4.5-29.8c-3.6-6.3-6.5-14.9-6.5-26.7c0-36.2 29.3-65.5 65.5-65.5h46.5v56c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l136-136c9.4-9.4 9.4-24.6 0-33.9zm7 97v-22.1l78.1 78.1l-78.1 78.1V280c0-13.3-10.7-24-24-24H370c-50.9 0-93.9 33.5-108.3 79.6c-3.3-9.4-5.2-19.8-5.2-31.6c0-61.9 50.1-112 112-112h72c13.3 0 24-10.7 24-24m-320-8c-44.2 0-80 35.8-80 80v256c0 44.2 35.8 80 80 80h256c44.2 0 80-35.8 80-80v-24c0-13.3-10.7-24-24-24s-24 10.7-24 24v24c0 17.7-14.3 32-32 32h-256c-17.7 0-32-14.3-32-32V240c0-17.7 14.3-32 32-32h24c13.3 0 24-10.7 24-24s-10.7-24-24-24z" strokeWidth="16" stroke="#637402" />
              </svg>
            </button>
          </div>
        </div>

        <div className="container mx-auto mt-28">
          <div className="flex items-center mt-10 mb-4 gap-30">
            <hr className="w-full border-0 h-px bg-[#637402]"/>
            <h2 className="text-[105px] font-semibold  text-[#637402]">INGREDIENTS</h2>
          </div>
          <div className="">
            {recipe.ingredients?.length === 0 ? (
              <p className="text-gray-500 mt-4">ยังไม่มีวัตถุดิบ</p>
            ) : (
              <div className="flex justify-around">
                <ul className="ml-72 space-y-2 bg-[#FEFEF6] py-7 px-4 text-[18px] w-80 rounded-2xl">
                  {recipe.ingredients
                    ?.slice()
                    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                    .map((ing) => (
                      <li key={ing.id} className="">
                        <span>{ing.name}</span>
                        <span className="text-gray-700 font-semibold pl-3">
                          {ing.amount ?? ""}  {ing.unit ?? ""}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          <div>

            <h2 className="text-[105px] font-semibold mt-10 mb-4 text-[#637402]">PREPARATION</h2>
            <div className="flex items-center justify-between pb-32">
              <div>
                {recipe.steps.length === 0 ? (
                  <p className="text-gray-500 mt-4">ยังไม่มีขั้นตอน</p>
                ) : (
                  <ol className="space-y-4">
                    {recipe.steps.map((s) => (
                      <li key={s.id} className="mt-10 flex gap-5">
                        <hr className="w-20 border-0 h-px bg-[#637402] mt-6"/>
                        <div className="flex flex-col">
                          <div className="text-[30px] font-semibold text-[#637402]" >
                          Step {s.stepNo}
                          </div>
                          <div className="text-[22px] font-semibold mt-5">
                            <p >{s.text}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
              <div className="  h-[600px] flex items-center justify-center w-100 pr-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={recipe.coverImage ?? "/nodata.png"}
                  alt={recipe.name}
                  width={400}
                  height={600}
                  className="h-full object-cover"
                />      
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
