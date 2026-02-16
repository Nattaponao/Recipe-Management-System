'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/nav';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileRecipeCard from '@/components/profile/ProfileRecipeCard';
import ProfileActions from '@/components/profile/ProfileActions';

export default function ProfilePage() {
  const { user: authUser, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('recipes');

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/login');
    }
  }, [authUser, loading, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7EB]">
        <div className="text-[#637402] text-xl font-bold animate-bounce">
          กำลังเปิดคลังแซ่บ...
        </div>
      </div>
    );

  if (!authUser) return null;

  return (
    <div className="bg-[#F9F7EB] min-h-screen pb-20">
      <Navbar />

      <main className="container mx-auto px-4 pt-10">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* 1. Profile Card Area */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-[#637402]/5 border border-white p-8 flex flex-col items-center">
            {/* แก้ Error โดยการส่ง props ให้ตรงกับที่ Component รับ (ถ้ามันรับ object user) */}
            <ProfileHeader
              name={authUser.name || 'นักปรุงนิรนาม'}
              username={`@${authUser.name?.toLowerCase().replace(/\s/g, '') || 'user'}`}
              avatar={authUser.image || '/profilemen.jpg'}
            />

            <div className="w-full mt-8 pt-8 border-t border-gray-100 text-[#637402]">
              <ProfileStats followers={120} following={45} likes={850} />
            </div>

            <div className="w-full mt-6">
              <ProfileActions />
            </div>
          </div>

          {/* 2. Bottom Navigation Tabs - UI ตามภาพที่คุณต้องการ */}
          <div className="w-full mt-10 border-b border-[#637402]/10">
            <div className="flex justify-around items-center max-w-sm mx-auto">
              {/* Tab: My Recipes */}
              <button
                onClick={() => setActiveTab('recipes')}
                className={`pb-4 flex flex-col items-center gap-1 transition-all relative ${
                  activeTab === 'recipes' ? 'text-[#000000]' : 'text-gray-400'
                }`}
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
                  <div className="absolute bottom-0 w-8 h-1 bg-[#000000] rounded-full"></div>
                )}
              </button>

              {/* Tab: Saved */}
              <button
                onClick={() => setActiveTab('saved')}
                className={`pb-4 flex flex-col items-center gap-1 transition-all relative ${
                  activeTab === 'saved' ? 'text-[#000000]' : 'text-gray-400'
                }`}
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
                  <div className="absolute bottom-0 w-8 h-1 bg-[#000000] rounded-full"></div>
                )}
              </button>

              {/* Tab: Liked */}
              <button
                onClick={() => setActiveTab('liked')}
                className={`pb-4 flex flex-col items-center gap-1 transition-all relative ${
                  activeTab === 'liked' ? 'text-[#000000]' : 'text-gray-400'
                }`}
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
                  <div className="absolute bottom-0 w-8 h-1 bg-[#000000] rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          {/* 3. Conditional Content Section */}
          <div className="pt-10">
            {activeTab === 'recipes' ? (
              <>
                <div className="flex justify-between items-center mb-6 px-2">
                  <h2 className="text-2xl font-bold text-[#637402]">
                    สูตรอาหารของฉัน
                  </h2>
                  <span className="text-[#FE9F4D] font-medium">2 รายการ</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-4 shadow-lg shadow-[#637402]/5 hover:translate-y-[-5px] transition-transform duration-300">
                    <ProfileRecipeCard
                      title={'แกงเขียวหวานไก่'}
                      image={'/GreenCurry.png'}
                      category={'อาหารหลัก'}
                      author={authUser.name}
                      date={'16 Feb 2026'}
                      avatar={authUser.image || '/profilemen.jpg'}
                    />
                  </div>
                  <div className="bg-white rounded-3xl p-4 shadow-lg shadow-[#637402]/5 hover:translate-y-[-5px] transition-transform duration-300">
                    <ProfileRecipeCard
                      title={'ผัดไทยกุ้งสด'}
                      image={'/padthai.jpeg'}
                      category={'เส้น'}
                      author={authUser.name}
                      date={'10 Feb 2026'}
                      avatar={authUser.image || '/profilemen.jpg'}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white/40 rounded-3xl border-2 border-dashed border-[#637402]/10">
                <p className="text-gray-400">ยังไม่มีข้อมูลในส่วนนี้</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
