import Hero from '@/components/Hero';
import HeroSection3 from '@/components/HeroSection3';
import RecipeOfWeek from '@/components/RecipeOfWeek';
import { fredoka } from '@/lib/fonts';

export default function Home() {
  return (
    <div className={`${fredoka.className}`}>
      <Hero />
      <RecipeOfWeek />
      <HeroSection3 />
    </div>
  );
}
