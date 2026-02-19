

import HeroSection3Server from "@/components/HeroSection3Server";
import HeroServer from '@/components/HeroServer';
import RecipeOfWeekServer from "@/components/RecipeOfWeekServer";

import { fredoka } from '@/lib/fonts';

export default function Home() {
  return (
    <div className={`${fredoka.className}`}>
      <HeroServer />
      <RecipeOfWeekServer />
      <HeroSection3Server />
    </div>
  );
}
