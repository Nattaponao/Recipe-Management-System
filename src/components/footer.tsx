import Link from "next/link";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import LogoutButton from "./LogoutButton";
import { isAdminEmail } from "@/lib/admin";

type NavItem = { label: string; href: string };

export default async function Footer() {
  const cookieStore = await cookies();
  const token = cookieStore.getAll().find((c) => c.name === "token")?.value;

  let isAuthed = false;
  let isAdmin = false;

  if (token) {
    isAuthed = true;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
      isAdmin = isAdminEmail(payload?.email);
    } catch {
      isAuthed = false;
      isAdmin = false;
    }
  }

  const userMenu: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Recipes", href: "/recipes" },
    { label: "Ai", href: "/ai" },
    { label: "Contect", href: "/" },
  ];

  const adminMenu: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Recipes", href: "admin/recipes" },
    { label: "Dashboard", href: "/admin" },
    { label: "Users", href: "/admin/users" },
  ];

  const menu = isAdmin ? adminMenu : userMenu;

  return (
    <footer className="bg-[#E4D7AA] pt-9 pb-5">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          <div className="w-full md:w-90">
            <h1 className="text-[#637402] text-[26px] md:text-[30px] font-semibold">
              Khang Saeb
            </h1>

            <hr className="border-0 h-px bg-[#637402]" />

            <div className="text-[#637402] flex flex-col md:flex-row justify-between mt-6 gap-6 md:gap-0">
              <p>อาณาจักรแห่งความอร่อย</p>

              {/* ✅ เมนูให้ตรงกับ NavbarV2 */}
              <ul className="font-semibold">
                {menu.map((item) => (
                  <li key={item.label} className="mb-1 hover:underline">
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex bg-[#637402] w-full md:w-auto py-4 px-6 md:px-9 justify-center rounded-2xl">
            <div className="flex flex-col justify-center items-center text-center">
              <h1 className="text-[#DFD3A4] text-[18px] md:text-[20px] font-semibold">
                Join us in a world of delicious flavors.
              </h1>

              {!isAuthed ? (
                <Link
                  href="/login"
                  className="inline-block bg-black text-[#E4D7AA] font-extralight text-[14px] md:text-[16px] py-2 px-5 mt-5 mb-3 rounded-3xl"
                >
                  Login Now!
                </Link>
              ) : (
                <LogoutButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
