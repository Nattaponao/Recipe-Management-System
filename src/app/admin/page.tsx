import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";

function fmtDate(d: Date) {
  try {
    return new Intl.DateTimeFormat("th-TH", { dateStyle: "medium" }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
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
  const [userCount, recipeCount, latestUsers, latestRecipes] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),
    prisma.user.findMany({
      select: { id: true, email: true, name: true },
      orderBy: { id: "desc" }, // ถ้าไม่มี createdAt ใช้ id แทน
      take: 5,
    }),
    prisma.recipe.findMany({
      select: { id: true, name: true, createdAt: true, category: true, country: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#F9F7EB]">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-[#637402] text-4xl md:text-5xl font-semibold">
              Admin Dashboard
            </h1>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6">
            <div className="text-[#637402]/70 font-semibold">Total Users</div>
            <div className="text-[#637402] text-5xl font-semibold mt-2">{userCount}</div>
            <div className="mt-4">
              <Link
                href="/admin/users"
                className="text-[#637402] font-semibold hover:underline"
              >
                View users →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#637402]/20 shadow-sm p-6">
            <div className="text-[#637402]/70 font-semibold">Total Recipes</div>
            <div className="text-[#637402] text-5xl font-semibold mt-2">{recipeCount}</div>
            <div className="mt-4">
              <Link
                href="/admin/recipes"
                className="text-[#637402] font-semibold hover:underline"
              >
                View recipes →
              </Link>
            </div>
          </div>

          <div className="bg-[#637402] rounded-3xl shadow-sm p-6 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="text-white/80 font-semibold">Quick Actions</div>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/admin/recipes"
                className="bg-black/40 hover:bg-black/50 px-4 py-2 rounded-2xl"
              >
                Review Recipes
              </Link>
              <Link
                href="/admin/users"
                className="bg-black/40 hover:bg-black/50 px-4 py-2 rounded-2xl"
              >
                Check Users
              </Link>
            </div>
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
                    <div className="text-[#637402] font-semibold">
                      {r.name || "Untitled recipe"}
                    </div>
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

              {latestRecipes.length === 0 && (
                <div className="py-6 text-[#637402]/70">No recipes yet.</div>
              )}
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
                  <div className="text-[#637402] font-semibold">
                    {u.name || "-"}
                  </div>
                  <div className="text-sm text-[#637402]/70">
                    {u.email}
                  </div>
                </div>
              ))}

              {latestUsers.length === 0 && (
                <div className="py-6 text-[#637402]/70">No users yet.</div>
              )}
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
}
