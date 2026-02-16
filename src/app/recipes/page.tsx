import { fredoka } from "@/lib/fonts";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/footer";
import NavbarV2 from "@/components/navV2";
import SearchNoSSR from "@/components/SearchNoSSR";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { isAdminEmail } from "@/lib/admin";

export default async function RecipesPage() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
  });

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let isAdmin = false;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      isAdmin = isAdminEmail(payload?.email);
    } catch {}
  }

  return (
    <div className={fredoka.className}>
      <NavbarV2 isAdmin={isAdmin} />
      <SearchNoSSR initialRecipes={recipes ?? []} isAdmin={isAdmin} />
      <Footer />
    </div>
  );
}
