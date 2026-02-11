import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server"; // (ไม่ต้องมีถ้าไม่ได้ใช้)
import NavbarV2 from "@/components/navV2";
import Footer from "@/components/footer";
import RecipeDetailClient from "./RecipeDetailClient";
import { Prisma } from "@prisma/client";


type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params; // ✅ unwrap promise
  if (!id) return notFound();

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: { orderBy: { sortOrder: "asc" } },
      steps: { orderBy: { stepNo: "asc" } },
    },
  });

  if (!recipe) return notFound();

  const recipeSafe = JSON.parse(
  JSON.stringify(recipe, (_key, value) => {
    // BigInt -> string
    if (typeof value === "bigint") return value.toString();

    // Prisma Decimal -> string (หรือ toNumber() ก็ได้)
    if (value instanceof Prisma.Decimal) return value.toString();

    return value;
  })
);

  return (
    <div>
      <NavbarV2 />
      <RecipeDetailClient recipe={recipeSafe} />
      <Footer />
    </div>
  );
}
