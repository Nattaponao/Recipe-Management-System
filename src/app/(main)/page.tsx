
import HeroSection3 from '@/components/HeroSection3';
import HeroServer from '@/components/HeroServer';
import RecipeOfWeek from '@/components/RecipeOfWeek';
import { fredoka } from '@/lib/fonts';

export default function Home() {
  return (
    <div className={`${fredoka.className}`}>
      <HeroServer />
      <RecipeOfWeek />
      <HeroSection3 />
    </div>
  );
}
