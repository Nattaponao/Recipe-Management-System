import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import NavbarV2 from '@/components/navV2';
import Footer from '@/components/footer';
import RecipeDetailClient from './RecipeDetailClient';
import { Prisma } from '@prisma/client';
import { fredoka } from '@/lib/fonts';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: { name: true },
  });
  return {
    title: `Khang Saeb | ${recipe?.name ?? 'Recipe'}`,
  };
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  if (!id) return notFound();

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: { orderBy: { sortOrder: 'asc' } },
      steps: { orderBy: { stepNo: 'asc' } },
      author: {
        select: { id: true, name: true },
      },
    },
  });

  if (!recipe) return notFound();

  const recipeSafe = JSON.parse(
    JSON.stringify(recipe, (_key, value) => {
      if (typeof value === 'bigint') return value.toString();
      if (value instanceof Prisma.Decimal) return value.toString();
      return value;
    }),
  );

  return (
    <div className={fredoka.className}>
      <NavbarV2 />
      <RecipeDetailClient recipe={recipeSafe} />
      <Footer />
    </div>
  );
}
