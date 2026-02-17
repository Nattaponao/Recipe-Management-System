/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import AdminDashboardClientCharts from "./AdminDashboardClientCharts";
import TopRecipesWidget from "./TopRecipesWidget";

function fmtDate(d: Date) {
  try {
    return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function dayLabel(d: Date) {
  return new Intl.DateTimeFormat("th-TH", { month: "2-digit", day: "2-digit" }).format(d);
}

export default async function AdminDashboardPage() {
  // ---- auth guard ----
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === "token")?.value;
  if (!token) redirect("/login");

  let adminEmail = "";
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    adminEmail = String(payload?.email ?? "");
    if (!isAdminEmail(adminEmail)) redirect("/");
  } catch {
    redirect("/login");
  }

  // ---- data ----
  const now = new Date();

  const from14 = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000);
  from14.setHours(0, 0, 0, 0);

  const from7 = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
  from7.setHours(0, 0, 0, 0);

  const fromPrev7 = new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000);
  fromPrev7.setHours(0, 0, 0, 0);

  const [
    userCount,
    recipeCount,
    latestUsers,
    latestRecipes,
    recipeByCategory,
    recipeDaily,
    onlineCount,

    topRecipes,
    likesTotal,
    recipesThis7,
    recipesPrev7,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),

    prisma.user.findMany({
      select: { id: true, email: true, name: true },
      orderBy: { id: "desc" },
      take: 5,
    }),

    prisma.recipe.findMany({
      select: { id: true, name: true, createdAt: true, category: true, country: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

    prisma.recipe.groupBy({
      by: ["category"],
      _count: { _all: true },
    }),

    prisma.recipe.findMany({
      where: { createdAt: { gte: from14 } },
      select: { createdAt: true },
    }),

    // ✅ Online now (5 นาที)
    prisma.user.count({
      where: { lastSeen: { gte: new Date(now.getTime() - 5 * 60 * 1000) } },
    }),

    // 🔥 Top Recipes by likes
    prisma.recipe.findMany({
      take: 5,
      orderBy: { recipe_likes: { _count: "desc" } },
      select: {
        id: true,
        name: true,
        coverImage: true,
        category: true,
        country: true,
        _count: { select: { recipe_likes: true } },
      },
    }),

    // ❤️ total likes
    prisma.recipe_likes.count(),

    // 📈 recipes this 7 days
    prisma.recipe.count({ where: { createdAt: { gte: from7 } } }),

    // 📈 recipes previous 7 days
    prisma.recipe.count({ where: { createdAt: { gte: fromPrev7, lt: from7 } } }),
  ]);

  const growthBase = Math.max(1, recipesPrev7);
  const growthPct = Math.round(((recipesThis7 - recipesPrev7) / growthBase) * 100);
  const growthUp = recipesThis7 >= recipesPrev7;

  // ส่งให้ TopRecipesWidget (client) แบบ clean
  const topRecipeItems = topRecipes.map((r: any) => ({
    id: r.id,
    name: r.name,
    coverImage: r.coverImage,
    category: r.category,
    country: r.country,
    likeCount: r._count?.recipe_likes ?? 0,
  }));

  // ---- build daily series (recipes only) ----
  const dayKeys: string[] = [];
  const dayMap: Record<string, { recipes: number; users: number }> = {};

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    d.setHours(0, 0, 0, 0);
    const key = d.toISOString().slice(0, 10);
    dayKeys.push(key);
    dayMap[key] = { recipes: 0, users: 0 };
  }

  for (const r of recipeDaily) {
    const k = new Date(r.createdAt).toISOString().slice(0, 10);
    if (dayMap[k]) dayMap[k].recipes += 1;
  }

  const daily = dayKeys.map((k) => {
    const d = new Date(k + "T00:00:00.000Z");
    return { day: dayLabel(d), recipes: dayMap[k].recipes, users: 0 };
  });

  const byCategory = recipeByCategory
    .map((x) => ({ name: x.category ?? "Uncategorized", count: x._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F9F7EB]">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-[#637402] text-4xl md:text-5xl font-semibold">Admin Dashboard</h1>
            <p className="text-[#637402]/70 mt-2">
              Logged in as <span className="font-semibold">{adminEmail}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/users"
              className="bg-[#637402] text-white px-5 py-2 rounded-2xl hover:opacity-90 transition"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/recipes"
              className="border border-[#637402] text-[#637402] px-5 py-2 rounded-2xl hover:bg-[#DFD3A4]/40 transition"
            >
              Manage Recipes
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6">
            <div className="text-[#637402]/70 font-semibold">Total Users</div>
            <div className="text-[#637402] text-5xl font-semibold mt-2">{userCount}</div>
            <div className="mt-4">
              <Link href="/admin/users" className="text-[#637402] font-semibold hover:underline">
                View users →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6">
            <div className="text-[#637402]/70 font-semibold">Total Recipes</div>
            <div className="text-[#637402] text-5xl font-semibold mt-2">{recipeCount}</div>
            <div className="mt-4">
              <Link href="/admin/recipes" className="text-[#637402] font-semibold hover:underline">
                View recipes →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6">
            <div className="text-[#637402]/70 font-semibold">Online now</div>
            <div className="text-[#637402] text-5xl font-semibold mt-2">{onlineCount}</div>
            <div className="text-[#637402]/60 mt-2 text-sm">active in last 5 minutes</div>
          </div>

          <div className="bg-[#637402] rounded-3xl shadow-sm p-6 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="text-white/80 font-semibold">Quick Actions</div>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/admin/recipes" className="bg-black/40 hover:bg-black/50 px-4 py-2 rounded-2xl">
                Review Recipes
              </Link>
              <Link href="/admin/users" className="bg-black/40 hover:bg-black/50 px-4 py-2 rounded-2xl">
                Check Users
              </Link>
            </div>
          </div>
        </div>

        {/* Charts + Sidebar Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8 min-w-0">
          {/* Left: Charts */}
          <div className="lg:col-span-8 min-w-0">
            <AdminDashboardClientCharts daily={daily} byCategory={byCategory} />
          </div>

          {/* Right: Sidebar Widgets */}
          <div className="lg:col-span-4 min-w-0 flex flex-col gap-6">
            {/* ✅ Client widget (มี fallback รูป, ทำ interactivity ได้) */}
            <TopRecipesWidget items={topRecipeItems} />
          </div>
        </div>

        {/* Latest Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Latest Recipes */}
          <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#637402] text-2xl font-semibold">Latest Recipes</h2>
              <Link href="/admin/recipes" className="text-[#637402] hover:underline font-semibold">
                See all
              </Link>
            </div>

            <div className="mt-4 divide-y divide-[#637402]/10">
              {latestRecipes.map((r) => (
                <div key={r.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[#637402] font-semibold">{r.name || "Untitled recipe"}</div>
                    <div className="text-sm text-[#637402]/70 mt-1">
                      {fmtDate(r.createdAt)}
                      {r.category ? ` • ${r.category}` : ""}
                      {r.country ? ` • ${r.country}` : ""}
                    </div>
                  </div>

                  <Link
                    href={`/recipes/${r.id}`}
                    className="shrink-0 border border-[#637402] text-[#637402] px-3 py-1.5 rounded-2xl hover:bg-[#DFD3A4]/40 transition text-sm"
                  >
                    View
                  </Link>
                </div>
              ))}

              {latestRecipes.length === 0 && <div className="py-6 text-[#637402]/70">No recipes yet.</div>}
            </div>
          </div>

          {/* Latest Users */}
          <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#637402] text-2xl font-semibold">Latest Users</h2>
              <Link href="/admin/users" className="text-[#637402] hover:underline font-semibold">
                See all
              </Link>
            </div>

            <div className="mt-4 divide-y divide-[#637402]/10">
              {latestUsers.map((u) => (
                <div key={u.id} className="py-3">
                  <div className="text-[#637402] font-semibold">{u.name || "-"}</div>
                  <div className="text-sm text-[#637402]/70">{u.email}</div>
                </div>
              ))}

              {latestUsers.length === 0 && <div className="py-6 text-[#637402]/70">No users yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
