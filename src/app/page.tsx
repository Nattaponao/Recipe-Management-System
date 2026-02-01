import Footer from "@/components/footer";
import Hero from "@/components/Hero";
import Nav from "@/components/nav";
import { fredoka } from "@/lib/fonts"

export default function Home() {
  return (
    <div className={`${fredoka.className}`}>
      <Nav/>
      <Hero/>
      <Footer/>
    </div>
  );
}
