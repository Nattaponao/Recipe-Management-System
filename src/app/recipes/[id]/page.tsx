import { notFound } from 'next/navigation';
import NavbarV2 from '@/components/navV2';
import Footer from '@/components/footer';
import RecipeDetailClient from './RecipeDetailClient';
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
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/${id}`,
      { cache: 'no-store' },
    );
    const recipe = await res.json();
    return { title: `Khang Saeb | ${recipe?.name ?? 'Recipe'}` };
  } catch {
    return { title: 'Khang Saeb | Recipe' };
  }
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  if (!id) return notFound();

  let recipeSafe = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/recipes/${id}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return notFound();
    recipeSafe = await res.json();
  } catch {
    return notFound();
  }

  return (
    <div className={fredoka.className}>
      <NavbarV2 />
      <RecipeDetailClient recipe={recipeSafe} />
      <Footer />
    </div>
  );
}
