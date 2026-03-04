import { prisma } from "@/lib/prisma";
import ManageRecipesClient from "@/components/admin/ManageRecipesClient";

export default async function AdminRecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      coverImage: true,
      category: true,
      country: true,
      createdAt: true,
    },
  });

  return <ManageRecipesClient initialRecipes={recipes} />;
}
