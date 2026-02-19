import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { isAdminEmail } from "@/lib/admin";
import SearchRecipeClient from "./search";

type RecipeCard = {
  id: string;
  name: string;
  description: string | null;
  coverImage: string | null;
  category: string;
  country: string;
  published?: boolean;
};

export default async function SearchRecipeServer({
  initialRecipes,
}: {
  initialRecipes: RecipeCard[];
}) {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === "token")?.value;

  let isAdmin = false;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      isAdmin = isAdminEmail(payload?.email);
    } catch {}
  }

  return <SearchRecipeClient initialRecipes={initialRecipes} isAdmin={isAdmin} />;
}
