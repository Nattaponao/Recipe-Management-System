import Navbar from '@/components/navV2'
import { fredoka } from "@/lib/fonts"
import { prisma } from "@/lib/prisma"

import SearchNoSSR from "@/components/SearchNoSSR";
import Footer from '@/components/footer';
import NavbarV2Server from '@/components/NavbarV2Server';

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={fredoka.className}>
      <NavbarV2Server />
      <SearchNoSSR initialRecipes={recipes ?? []} />
      <Footer/>
    </div>
  )
}
