'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/nav';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileRecipeCard from '@/components/profile/ProfileRecipeCard';
import ProfileActions from '@/components/profile/ProfileActions';

export default function ProfilePage() {
  const { user: authUser, loading } = useAuth(); //
  const router = useRouter();

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
          {/* Main Profile Card: รวมข้อมูลส่วนตัวไว้ในการ์ดเดียว */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-[#637402]/5 border border-white p-8 flex flex-col items-center">
            <ProfileHeader
              name={authUser.name || 'นักปรุงนิรนาม'}
              username={`@${authUser.name?.toLowerCase().replace(/\s/g, '') || 'user'}`}
              avatar={authUser.image || '/profilemen.jpg'}
            />

            <div className="w-full mt-8 pt-8 border-t border-gray-100">
              <ProfileStats followers={120} following={45} likes={850} />
            </div>

            <div className="w-full mt-6">
              <ProfileActions />
            </div>
          </div>

          {/* Recipes Section: แสดงสูตรอาหารแบบการ์ดแนวตั้ง */}
          <div className="pt-10">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-bold text-[#637402]">
                สูตรอาหารของฉัน
              </h2>
              <span className="text-[#FE9F4D] font-medium">3 รายการ</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* การ์ดเมนูอาหารแต่ละใบ */}
              <div className="bg-white rounded-3xl p-4 shadow-lg shadow-[#637402]/5 hover:translate-y-[-5px] transition-transform duration-300">
                <ProfileRecipeCard
                  title={'แกงเขียวหวานไก่'}
                  image={'/GreenCurry.png'} //
                  category={'อาหารหลัก'}
                  author={authUser.name}
                  date={'16 Feb 2026'}
                  avatar={authUser.image || '/profilemen.jpg'}
                />
              </div>

              <div className="bg-white rounded-3xl p-4 shadow-lg shadow-[#637402]/5 hover:translate-y-[-5px] transition-transform duration-300">
                <ProfileRecipeCard
                  title={'ผัดไทยกุ้งสด'}
                  image={'/padthai.jpeg'} //
                  category={'เส้น'}
                  author={authUser.name}
                  date={'10 Feb 2026'}
                  avatar={authUser.image || '/profilemen.jpg'}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
