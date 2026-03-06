import { Suspense } from 'react';
import HeroSection3Server from "@/components/HeroSection3Server";
import HeroServer from '@/components/HeroServer';
import RecipeOfWeekServer from "@/components/RecipeOfWeekServer";
import { fredoka } from '@/lib/fonts';

export default function Home() {
  return (
    <div className={`${fredoka.className}`}>
      
      {/* 🌟 พระเอกของเราคือกล่อง Suspense! ครอบ HeroServer ไว้เลย */}
      {/* fallback คือสิ่งที่จะโชว์ระหว่างรอเช็คสิทธิ์ Admin (โชว์สีเขียวๆ รอไว้ก่อน) */}
      <Suspense fallback={<div className="h-[500px] bg-[#637402] w-full"></div>}>
        <HeroServer />
      </Suspense>

      <Suspense fallback={<div className="h-64 flex items-center justify-center">กำลังเตรียมสูตรเด็ด...</div>}>
        <RecipeOfWeekServer />
      </Suspense>

      <Suspense fallback={<div className="h-64 flex items-center justify-center">กำลังโหลดข้อมูล...</div>}>
        <HeroSection3Server />
      </Suspense>

    </div>
  );
}