"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = { label: string; href: string };

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);

  const userMenu: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Recipes", href: "/recipes" },
    { label: "Ai", href: "/ai" },
    { label: "Contect", href: "/" },
  ];

  const adminMenu: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Recipes", href: "/recipes" },
    { label: "Dashboard", href: "/admin" },
    { label: "Users", href: "/admin/users" },
  ];

  const menu = isAdmin ? adminMenu : userMenu;

  return (
    <div className="bg-[#637402]">
      <nav className="container mx-auto">
        <div className="flex justify-between items-center py-4 text-white">
          <div className="font-semibold text-[32px] md:text-[48px]">
            Khang Saeb
          </div>

          <div className="flex items-center">
            <ul className="hidden md:flex font-semibold items-center">
              {menu.map((item) => (
                <li key={item.label} className="ml-12 text-[24px]">
                  <Link
                    href={item.href}
                    className="relative inline-block cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-white after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ไอคอนโปรไฟล์: ถ้าเป็น admin จะเปลี่ยนเป็นไอคอน “โล่/เกียร์” ก็ได้
                ตอนนี้ผมคงของเดิมไว้ */}
            <div className="cursor-pointer ml-12">
              {/* ... SVG เดิมของคุณ ... */}
                 <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24">
                <g fill="#fff" fillRule="evenodd" clipRule="evenodd">
                  <path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"/>
                  <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0 1 12.065 14a8.98 8.98 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.96 8.96 0 0 1-5.672-2.012A6.99 6.99 0 0 1 12.065 16a6.99 6.99 0 0 1 5.689 2.92A8.96 8.96 0 0 1 12 21"/>
                </g>
              </svg>
            </div>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={`md:hidden ${open ? "block" : "hidden"} pb-4`}>
          <ul className="flex flex-col text-white font-semibold gap-3">
            {menu.map((item) => (
              <li key={item.label} className="text-[18px]">
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
