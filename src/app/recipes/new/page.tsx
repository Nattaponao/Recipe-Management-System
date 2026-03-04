'use client';

import { fredoka } from '@/lib/fonts';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavbarV2 from '@/components/navV2';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export default function AddRecipePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.id) setUserId(data.user.id);
      });
  }, []);

  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' },
    { name: '', amount: '', unit: '' },
    { name: '', amount: '', unit: '' },
  ]);
  const [steps, setSteps] = useState(['', '', '']);
  const [foodType, setFoodType] = useState('');
  const [country, setCountry] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const FOOD_TYPES = [
    'curry',
    'ต้ม/แกง',
    'ของหวาน',
    'เส้น',
    'ข้าว',
    'สุขภาพ',
    'อื่นๆ',
  ];
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setCoverImage(data.url);
      }
    } finally {
      setUploading(false);
    }
  };

  const addIngredient = () =>
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);

  const removeIngredient = (index: number) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index: number) =>
    setSteps(steps.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        category: foodType,
        country: country || null,
        tags: tags || null,
        coverImage,
        authorId: userId,
        ingredients: ingredients
          .filter((i) => i.name.trim() !== '')
          .map((i, index) => ({
            name: i.name.trim(),
            amount: parseFloat(i.amount) || null,
            unit: i.unit.trim() || null,
            sortOrder: index + 1,
          })),
        steps: steps.filter((s) => s.trim() !== ''),
      }),
    });

    router.push('/recipes');
  };

  return (
    <div className={fredoka.className}>
      <NavbarV2 />

      <div className="min-h-screen bg-[#F9F7EB] py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {/* CARD */}
          <div className="bg-white rounded-3xl p-12 shadow-md">
            {/* HEADER (อยู่ในกล่องสีขาว) */}
            <div className="relative mb-12">
              {/* ❌ Close button */}
              <button
                onClick={() => router.push('/recipes')}
                className="absolute right-0 top-0 text-[red] text-3xl font-bold hover:scale-130 transition cursor-pointer"
              >
                ×
              </button>

              {/* Title */}
              <h1 className="text-4xl font-bold text-[#6B8E23] text-center">
                Add a recipe
              </h1>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* NAME */}
              <div>
                <label className="block text-[#6B8E23] font-bold mb-2 text-lg">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Add text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-black rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                />
              </div>

              {/* INGREDIENTS */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[#6B8E23] font-bold text-lg">
                    INGREDIENTS
                  </label>
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="bg-[#6B8E23] text-white w-8 h-8 rounded-lg flex items-center justify-center text-xl font-bold hover:opacity-80 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Column labels */}
                <div className="grid grid-cols-[1fr_90px_90px_32px] gap-2 mb-2 px-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    วัตถุดิบ
                  </span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    ปริมาณ
                  </span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    หน่วย
                  </span>
                  <span />
                </div>

                <div className="space-y-2">
                  {ingredients.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_90px_90px_32px] gap-2 items-center"
                    >
                      {/* Name */}
                      <input
                        type="text"
                        placeholder="เช่น ไก่, กุ้ง"
                        value={item.name}
                        onChange={(e) =>
                          updateIngredient(index, 'name', e.target.value)
                        }
                        className="border-2 border-black rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                      />
                      {/* Amount */}
                      <input
                        type="number"
                        placeholder="100"
                        min="0"
                        value={item.amount}
                        onChange={(e) =>
                          updateIngredient(index, 'amount', e.target.value)
                        }
                        className="border-2 border-black rounded-xl px-3 py-2.5 text-sm text-center text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                      />
                      {/* Unit */}
                      <input
                        type="text"
                        placeholder="กรัม"
                        value={item.unit}
                        onChange={(e) =>
                          updateIngredient(index, 'unit', e.target.value)
                        }
                        className="border-2 border-black rounded-xl px-3 py-2.5 text-sm text-center text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                      />
                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-lg font-bold transition cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PREPARATION */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[#6B8E23] font-bold text-lg">
                    PREPARATION
                  </label>
                  <button
                    type="button"
                    onClick={addStep}
                    className="bg-[#6B8E23] text-white w-8 h-8 rounded-lg flex items-center justify-center text-xl font-bold hover:opacity-80 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      {/* Step number badge */}
                      <div className="mt-3 w-7 h-7 rounded-full bg-[#6B8E23] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <textarea
                        placeholder={`อธิบายขั้นตอนที่ ${index + 1}`}
                        value={step}
                        onChange={(e) => {
                          const updated = [...steps];
                          updated[index] = e.target.value;
                          setSteps(updated);
                        }}
                        className="flex-1 border-2 border-black rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B8E23] resize-none"
                        rows={2}
                      />
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="mt-3 w-7 h-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-lg font-bold transition flex-shrink-0 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* COUNTRY & TAGS */}
              <div className="grid grid-cols-2 gap-4">
                {/* COUNTRY */}
                <div>
                  <label className="block text-[#6B8E23] font-bold mb-2 text-lg">
                    COUNTRY
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น Thailand, Italy"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  />
                </div>

                {/* TAGS */}
                <div>
                  <label className="block text-[#6B8E23] font-bold mb-2 text-lg">
                    TAGS
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น spicy,soup,easy"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  />
                  <p className="text-xs text-gray-400 mt-1 px-1">
                    คั่นด้วยคอมม่า เช่น spicy,soup
                  </p>
                </div>
              </div>

              {/* FOOD TYPE */}
              <div>
                <label className="block text-[#6B8E23] font-bold mb-3 text-lg">
                  FOOD TYPE
                </label>
                <div className="relative">
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="w-48 appearance-none border-2 border-black rounded-full px-5 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#6B8E23] cursor-pointer pr-10"
                  >
                    <option value="">เลือกประเภท</option>
                    {FOOD_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute left-[168px] top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                    ▼
                  </span>
                </div>
              </div>

              {/* INSERT PICTURE */}
              <div>
                <label className="block text-[#6B8E23] font-bold mb-3 text-lg">
                  INSERT PICTURE
                </label>

                {/* Preview box */}
                <div className="w-full h-52 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mb-4">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt="preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <div className="flex justify-center">
                  <label className="cursor-pointer border-2 border-[#6B8E23] text-[#6B8E23] rounded-full px-8 py-2 text-sm font-semibold hover:bg-[#6B8E23] hover:text-white transition">
                    {uploading ? 'กำลัง upload...' : 'Upload picture'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-[#6B8E23] font-bold mb-2 text-lg">
                  DESCRIPTION
                </label>
                <textarea
                  placeholder="Add text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  rows={4}
                />
              </div>

              {/* SAVE */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-[#6B8E23] text-white px-14 py-4 rounded-full font-bold text-lg hover:opacity-90 active:scale-95 transition cursor-pointer"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
