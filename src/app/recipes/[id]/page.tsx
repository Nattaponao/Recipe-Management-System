import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RecipeDetailClient from "./RecipeDetailClient";
import NavbarV2 from "@/components/navV2";
import { fredoka } from "@/lib/fonts"
import Footer from "@/components/footer";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  if (!id) return notFound();

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: true,
      steps: { orderBy: { stepNo: "asc" } },
    },
  });

  if (!recipe) return notFound();

  return(
    <div className={fredoka.className}>
      <NavbarV2 />
      <RecipeDetailClient recipe={recipe} />
      <Footer/>
    </div>
    )
    ;
}
