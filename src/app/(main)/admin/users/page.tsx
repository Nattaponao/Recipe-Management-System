import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import DeleteUserButton from "@/components/admin/DeleteUserButton";
import RoleSelect from "@/components/admin/RoleSelect";

type Props = {
  searchParams?: Promise<{ q?: string }>;
};

function normalizeQ(q: string) {
  return q.toLowerCase().trim();
}

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === "token")?.value;
  if (!token) redirect("/login");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const email = String(payload?.email ?? "");
    if (!isAdminEmail(email)) redirect("/");
    return { email };
  } catch {
    redirect("/login");
  }
}

export default async function AdminUsersPage({ searchParams }: Props) {
  await requireAdmin();

  const sp = (await searchParams) ?? {};
  const q = normalizeQ(sp.q ?? "");

  const users = await prisma.user.findMany({
    where: q
      ? {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: { id: true, email: true, name: true, role: true },
    orderBy: { id: "desc" },
    take: 200,
  });

  return (
    <div className="min-h-screen bg-[#F9F7EB]">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-[#637402] text-4xl md:text-5xl font-semibold">
              Manage Users
            </h1>
            <p className="text-[#637402]/70 mt-2">ค้นหา/ลบ/เปลี่ยนสิทธิ์ผู้ใช้</p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="border border-[#637402] text-[#637402] px-5 py-2 rounded-lg hover:bg-[#DFD3A4]/40 transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Search */}
        <form className="mt-6">
          <div className="bg-white rounded-lg border border-[#637402]/20 shadow-sm p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#637402]/80">
                Search (email / name)
              </label>
              <input
                name="q"
                defaultValue={sp.q ?? ""}
                placeholder="เช่น admin@gmail.com หรือ Peter"
                className="mt-2 w-full border border-[#637402]/30 rounded-lg px-4 py-2 outline-none focus:border-[#637402]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#637402] text-white px-6 py-2 rounded-lg hover:opacity-90 transition md:self-end"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"/></svg>
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="mt-6 bg-white rounded-lg border border-[#637402]/20 shadow-sm overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="text-[#637402] font-semibold">
              Users ({users.length})
            </div>
            <div className="text-sm text-[#637402]/60">แสดงสูงสุด 200 รายการ</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#DFD3A4]/40">
                <tr className="text-left text-[#637402]">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#637402]/10">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F9F7EB]">
                    <td className="p-4 text-[#637402] font-semibold">{u.name ?? "-"}</td>
                    <td className="p-4 text-[#637402]/80">{u.email}</td>
                    <td className="p-4">
                      <RoleSelect id={u.id} role={u.role ?? "USER"} />
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end">
                        <DeleteUserButton id={u.id} />
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td className="p-6 text-[#637402]/70" colSpan={4}>
                      ไม่พบผู้ใช้ตามคำค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

         
        </div>
      </div>
    </div>
  );
}
