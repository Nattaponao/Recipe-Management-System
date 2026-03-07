'use client';

import { useState } from 'react';
import Link from 'next/link';

import { fredoka } from '@/lib/fonts';

type NavItem = { label: string; href: string };

export default function Navbar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);

  const userMenu: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Recipes', href: '/recipes' },
    { label: 'Ai', href: '/ai' },
    { label: 'Profile', href: '/profile' },
  ];

  const adminMenu: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Manage Recipes', href: '/admin/recipes' },
    { label: 'Dashboard', href: '/admin' },
    { label: 'Manage Users', href: '/admin/users' },
  ];

  const menu = isAdmin ? adminMenu : userMenu;

  return (
    <div className={`bg-[#637402]  ${fredoka.className}`}>
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
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition-colors"
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

        <div className={`md:hidden ${open ? 'block' : 'hidden'} pb-4`}>
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
