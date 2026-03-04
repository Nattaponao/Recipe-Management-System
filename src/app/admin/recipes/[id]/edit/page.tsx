'use client';

import { fredoka } from '@/lib/fonts';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Ingredient {
  id?: string;
  name: string;
  amount: string;
  unit: string;
}

export default function AdminEditRecipePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [foodType, setFoodType] = useState('');
  const [country, setCountry] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' },
  ]);
  const [steps, setSteps] = useState<string[]>(['']);

  const FOOD_TYPES = [
    'curry',
    'ต้ม/แกง',
    'ของหวาน',
    'เส้น',
    'ข้าว',
    'สุขภาพ',
    'อื่นๆ',
  ];

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setName(data.name ?? '');
        setDescription(data.description ?? '');
        setFoodType(data.category ?? '');
        setCountry(data.country ?? '');
        setTags(data.tags ?? '');
        setCoverImage(data.coverImage ?? null);
        if (data.ingredients?.length > 0) {
          setIngredients(
            data.ingredients.map(
              (i: {
                id: string;
                name: string;
                amount: number | null;
                unit: string | null;
              }) => ({
                id: i.id,
                name: i.name ?? '',
                amount: i.amount != null ? String(i.amount) : '',
                unit: i.unit ?? '',
              }),
            ),
          );
        }
        if (data.steps?.length > 0) {
          setSteps(data.steps.map((s: { text: string }) => s.text ?? ''));
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverImage(reader.result as string);
    reader.readAsDataURL(file);
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
    setSaving(true);
    try {
      const r = await fetch(`/api/admin/recipes/${id}`, {
        // ✅ admin API
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          category: foodType,
          country: country || null,
          tags: tags || null,
          coverImage,
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
      if (r.ok) {
        router.push('/admin/recipes'); // ✅ กลับไป admin
      } else {
        alert('บันทึกไม่สำเร็จ');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7EB]">
        <div className="text-[#637402] text-xl font-bold animate-bounce">
          กำลังโหลด...
        </div>
      </div>
    );
  }

  return (
    <div className={fredoka.className}>
      <div className="min-h-screen bg-[#F9F7EB] py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-md">
            <div className="relative mb-12">
              <button
                onClick={() => router.push('/admin/recipes')}
                className="absolute right-0 top-0 text-[red] text-3xl font-bold hover:scale-130 transition cursor-pointer"
              >
                ×
              </button>
              <h1 className="text-4xl font-bold text-[#6B8E23] text-center">
                Edit recipe (Admin)
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* NAME */}
              <div>
                <label className="block text-[#6B8E23] font-bold mb-2 text-lg">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-black rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
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
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateIngredient(index, 'name', e.target.value)
                        }
                        className="border-2 border-black rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                      />
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          updateIngredient(index, 'amount', e.target.value)
                        }
                        className="border-2 border-black rounded-xl px-3 py-2.5 text-sm text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                      />
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) =>
                          updateIngredient(index, 'unit', e.target.value)
                        }
                        className="border-2 border-black rounded-xl px-3 py-2.5 text-sm text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                      />
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
                      <div className="mt-3 w-7 h-7 rounded-full bg-[#6B8E23] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </div>
                      <textarea
                        value={step}
                        onChange={(e) => {
                          const updated = [...steps];
                          updated[index] = e.target.value;
                          setSteps(updated);
                        }}
                        className="flex-1 border-2 border-black rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B8E23] resize-none"
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
                <div>
                  <label className="block text-[#6B8E23] font-bold mb-2 text-lg">
                    COUNTRY
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  />
                </div>
                <div>
                  <label className="block text-[#6B8E23] font-bold mb-2 text-lg">
                    TAGS
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  />
                </div>
              </div>

              {/* FOOD TYPE */}
              <div>
                <label className="block text-[#6B8E23] font-bold mb-3 text-lg">
                  FOOD TYPE
                </label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="w-48 appearance-none border-2 border-black rounded-full px-5 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#6B8E23] cursor-pointer"
                >
                  <option value="">เลือกประเภท</option>
                  {FOOD_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* INSERT PICTURE */}
              <div>
                <label className="block text-[#6B8E23] font-bold mb-3 text-lg">
                  INSERT PICTURE
                </label>
                <div className="w-full h-52 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mb-4">
                  {coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={coverImage}
                      alt="preview"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="text-gray-400">ยังไม่มีรูป</div>
                  )}
                </div>
                <div className="flex justify-center">
                  <label className="cursor-pointer border-2 border-[#6B8E23] text-[#6B8E23] rounded-full px-8 py-2 text-sm font-semibold hover:bg-[#6B8E23] hover:text-white transition">
                    Upload picture
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border-2 border-black rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B8E23]"
                  rows={4}
                />
              </div>

              {/* SAVE */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#6B8E23] text-white px-14 py-4 rounded-full font-bold text-lg hover:opacity-90 active:scale-95 transition cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'กำลังบันทึก...' : 'SAVE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
