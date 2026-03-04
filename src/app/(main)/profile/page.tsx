/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileRecipeCard from '@/components/profile/ProfileRecipeCard';
import ProfileActions from '@/components/profile/ProfileActions';
import EditProfileModal from '@/components/profile/EditProfileModal';

interface Recipe {
  id: string;
  name: string;
  coverImage: string | null;
  category: string | null;
  createdAt: string;
  author?: { name: string | null } | null;
}

export default function ProfilePage() {
  const { user: authUser, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('recipes');

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);
  const [likedLoading, setLikedLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  // Redirect ถ้าไม่ได้ login
  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login');
    }
  }, [authUser, loading, router]);

  // ดึง recipes ของ user
  useEffect(() => {
    if (!authUser) return;
    let cancelled = false;
    fetch('/api/profile/recipes')
      .then((r) => (r.ok ? r.json() : { recipes: [] }))
      .then((data) => {
        if (!cancelled) setRecipes(data.recipes ?? []);
      })
      .finally(() => {
        if (!cancelled) setRecipesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  // ดึง saved recipes
  useEffect(() => {
    if (!authUser) return;
    let cancelled = false;
    fetch('/api/profile/saved')
      .then((r) => (r.ok ? r.json() : { recipes: [] }))
      .then((data) => {
        if (!cancelled) setSavedRecipes(data.recipes ?? []);
      })
      .finally(() => {
        if (!cancelled) setSavedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  // ดึง liked recipes
  useEffect(() => {
    if (!authUser) return;
    let cancelled = false;
    fetch('/api/profile/liked')
      .then((r) => (r.ok ? r.json() : { recipes: [] }))
      .then((data) => {
        if (!cancelled) setLikedRecipes(data.recipes ?? []);
      })
      .finally(() => {
        if (!cancelled) setLikedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7EB] gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#637402] border-t-transparent" />
        <p className="text-[#637402] font-semibold">กำลังโหลดนะ...</p>
      </div>
    );

  if (!authUser) return null;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleCopyAndEdit = async (recipe: Recipe) => {
    if (!confirm(`คัดลอก "${recipe.name}" มาแก้ไขเป็นสูตรของตัวเองไหม?`))
      return;

    const r = await fetch(`/api/recipes/${recipe.id}`);
    const full = await r.json();

    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: full.name,
        description: full.description,
        category: full.category,
        country: full.country,
        tags: full.tags,
        coverImage: full.coverImage,
        authorId: authUser!.id,
        ingredients: full.ingredients.map(
          (i: {
            name: string;
            amount: number | null;
            unit: string | null;
            sortOrder: number | null;
          }) => ({
            name: i.name,
            amount: i.amount,
            unit: i.unit,
            sortOrder: i.sortOrder,
          }),
        ),
        steps: full.steps.map((s: { text: string }) => s.text),
      }),
    });

    if (res.ok) {
      const newRecipe = await res.json();
      router.push(`/recipes/${newRecipe.id}/edit`);
    } else {
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="bg-[#F9F7EB] min-h-screen pb-20">
      <main className="container mx-auto px-4 pt-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-[#637402]/5 border border-white p-8 flex flex-col items-center">
            <ProfileHeader
              name={authUser.name || 'นักปรุงนิรนาม'}
              username={`@${authUser.name?.toLowerCase().replace(/\s/g, '') || 'user'}`}
              avatar={authUser.image || '/userprofile.png'}
            />
            <div className="w-full mt-6">
              <ProfileActions
                onEditProfile={() => setShowEditModal(true)}
                username={
                  authUser.name?.toLowerCase().replace(/\s/g, '') ?? 'user'
                }
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="w-full mt-10 border-b border-[#637402]/10">
            <div className="flex justify-around items-center max-w-sm mx-auto">
              {/* Recipes Tab */}
              <button
                onClick={() => setActiveTab('recipes')}
                className={`pb-4 flex flex-col items-center gap-1 transition-all relative cursor-pointer ${activeTab === 'recipes' ? 'text-black' : 'text-gray-400'}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                </svg>
                {activeTab === 'recipes' && (
                  <div className="absolute bottom-0 w-8 h-1 bg-black rounded-full" />
                )}
              </button>

              {/* Saved Tab */}
              <button
                onClick={() => setActiveTab('saved')}
                className={`pb-4 flex flex-col items-center gap-1 transition-all relative cursor-pointer ${activeTab === 'saved' ? 'text-black' : 'text-gray-400'}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
                {activeTab === 'saved' && (
                  <div className="absolute bottom-0 w-8 h-1 bg-black rounded-full" />
                )}
              </button>

              {/* Liked Tab */}
              <button
                onClick={() => setActiveTab('liked')}
                className={`pb-4 flex flex-col items-center gap-1 transition-all relative cursor-pointer ${activeTab === 'liked' ? 'text-black' : 'text-gray-400'}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                {activeTab === 'liked' && (
                  <div className="absolute bottom-0 w-8 h-1 bg-black rounded-full" />
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="pt-10">
            {activeTab === 'recipes' && (
              <>
                <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#637402]">
                    สูตรอาหารของฉัน
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-[#FE9F4D] font-medium">
                      {recipes.length} รายการ
                    </span>
                    <button
                      onClick={() => router.push('/recipes/new')}
                      className="bg-[#637402] text-white w-8 h-8 rounded-lg flex items-center justify-center text-xl font-bold hover:opacity-80 transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {recipesLoading ? (
                  <div className="text-center py-20 text-[#637402] animate-pulse">
                    กำลังโหลด...
                  </div>
                ) : recipes.length === 0 ? (
                  <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-[#637402]/10">
                    <p className="text-gray-400">ยังไม่มีสูตรอาหาร</p>
                    <button
                      onClick={() => router.push('/recipes/new')}
                      className="mt-4 bg-[#637402] text-white px-6 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition cursor-pointer"
                    >
                      + เพิ่มสูตรแรก
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="bg-white rounded-3xl p-4 shadow-lg shadow-[#637402]/5 hover:translate-y-[-5px] transition-transform duration-300 cursor-pointer"
                        onClick={() => router.push(`/recipes/${recipe.id}`)}
                      >
                        <ProfileRecipeCard
                          id={recipe.id}
                          showMenu={true}
                          title={recipe.name ?? ''}
                          image={recipe.coverImage || '/placeholder-food.jpg'}
                          category={recipe.category ?? ''}
                          author={authUser.name ?? 'Unknown'}
                          date={formatDate(recipe.createdAt)}
                          avatar={authUser.image || '/userprofile.png'}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'saved' && (
              <>
                <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#637402]">
                    สูตรที่บันทึกไว้
                  </h2>
                  <span className="text-[#FE9F4D] font-medium">
                    {savedRecipes.length} รายการ
                  </span>
                </div>
                {savedLoading ? (
                  <div className="text-center py-20 text-[#637402] animate-pulse">
                    กำลังโหลด...
                  </div>
                ) : savedRecipes.length === 0 ? (
                  <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-[#637402]/10">
                    <p className="text-gray-400">ยังไม่มีสูตรที่บันทึกไว้</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedRecipes.map((recipe) => (
                      <div key={recipe.id} className="relative">
                        <div
                          className="bg-white rounded-3xl p-4 shadow-lg shadow-[#637402]/5 hover:translate-y-[-5px] transition-transform duration-300 cursor-pointer"
                          onClick={() => router.push(`/recipes/${recipe.id}`)}
                        >
                          <ProfileRecipeCard
                            id={recipe.id}
                            title={recipe.name ?? ''}
                            image={recipe.coverImage || '/placeholder-food.jpg'}
                            category={recipe.category ?? ''}
                            author={recipe.author?.name ?? 'Unknown'}
                            date={formatDate(recipe.createdAt)}
                            avatar={authUser.image || '/userprofile.png'}
                            onEdit={() => handleCopyAndEdit(recipe)}
                          />
                        </div>

                        {/* ✅ ปุ่ม Edit */}
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (
                              !confirm(
                                `คัดลอก "${recipe.name}" มาแก้ไขเป็นสูตรของตัวเองไหม?`,
                              )
                            )
                              return;

                            const r = await fetch(`/api/recipes/${recipe.id}`);
                            const full = await r.json();

                            const res = await fetch('/api/recipes', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                name: full.name,
                                description: full.description,
                                category: full.category,
                                country: full.country,
                                tags: full.tags,
                                coverImage: full.coverImage,
                                authorId: authUser!.id,
                                ingredients: full.ingredients.map(
                                  (i: {
                                    name: string;
                                    amount: number | null;
                                    unit: string | null;
                                    sortOrder: number | null;
                                  }) => ({
                                    name: i.name,
                                    amount: i.amount,
                                    unit: i.unit,
                                    sortOrder: i.sortOrder,
                                  }),
                                ),
                                steps: full.steps.map(
                                  (s: { text: string }) => s.text,
                                ),
                              }),
                            });

                            if (res.ok) {
                              const newRecipe = await res.json();
                              router.push(`/recipes/${newRecipe.id}/edit`);
                            } else {
                              alert('เกิดข้อผิดพลาด');
                            }
                          }}
                          className="absolute bottom-8 right-8 bg-[#637402] text-white text-xs px-3 py-1.5 rounded-full hover:opacity-80 transition z-10 shadow cursor-pointer"
                        >
                          ✏️ ก็อปปี้สูตร
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === 'liked' && (
              <>
                <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#637402]">
                    สูตรที่ถูกใจ
                  </h2>
                  <span className="text-[#FE9F4D] font-medium">
                    {likedRecipes.length} รายการ
                  </span>
                </div>
                {likedLoading ? (
                  <div className="text-center py-20 text-[#637402] animate-pulse">
                    กำลังโหลด...
                  </div>
                ) : likedRecipes.length === 0 ? (
                  <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-[#637402]/10">
                    <p className="text-gray-400">ยังไม่มีสูตรที่ถูกใจ</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {likedRecipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        className="bg-white rounded-3xl p-4 shadow-lg shadow-[#637402]/5 hover:translate-y-[-5px] transition-transform duration-300 cursor-pointer"
                        onClick={() => router.push(`/recipes/${recipe.id}`)}
                      >
                        <ProfileRecipeCard
                          id={recipe.id}
                          title={recipe.name ?? ''}
                          image={recipe.coverImage || '/placeholder-food.jpg'}
                          category={recipe.category ?? ''}
                          author={recipe.author?.name ?? 'Unknown'}
                          date={formatDate(recipe.createdAt)}
                          avatar={authUser.image || '/userprofile.png'}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {showEditModal && (
            <EditProfileModal
              user={authUser}
              onClose={() => setShowEditModal(false)}
              onUpdated={(updated: {
                id: number;
                name: string | null;
                email: string;
                image?: string | null;
              }) => {
                window.location.reload();
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
