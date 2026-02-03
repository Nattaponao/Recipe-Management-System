import Footer from "@/components/footer";
import Hero from "@/components/Hero";
import HeroSection3 from "@/components/HeroSection3";
import Nav from "@/components/nav";
import RecipeOfWeek from "@/components/RecipeOfWeek";
import { fredoka } from "@/lib/fonts"

export default function Home() {
  return (
    <div className={`${fredoka.className}`}>
      <Nav/>
      <Hero/>
      <RecipeOfWeek/>
      <HeroSection3/>
      <Footer/>
    </div>
  );
}
