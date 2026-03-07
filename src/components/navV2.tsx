'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { fredoka } from '@/lib/fonts';

type NavItem = { label: string; href: string };

type User = {
  name?: string | null;
  image?: string | null;
};

export default function NavbarV2({
  isAdmin = false,
  user,
}: {
  isAdmin?: boolean;
  user?: User | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const userMenu: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Recipes', href: '/recipes' },
    { label: 'Ai', href: '/ai' },
  ];

  const adminMenu: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Manage Recipes', href: '/admin/recipes' },
    { label: 'Dashboard', href: '/admin' },
    { label: 'Manage Users', href: '/admin/users' },
  ];

  const menu = isAdmin ? adminMenu : userMenu;

  const userGreenPages = ['/', '/ai'];
  const isGreen = isAdmin
    ? pathname === '/'
    : userGreenPages.includes(pathname);

  const bg = isGreen ? 'bg-[#637402]' : 'bg-[#F9F7EB]';
  const textColor = isGreen ? 'text-white' : 'text-[#637402]';
  const underlineColor = isGreen ? 'after:bg-white' : 'after:bg-[#637402]';
  const strokeColor = isGreen ? 'white' : '#637402';

  return (
    <div className={`${bg} ${fredoka.className}`}>
      <nav className="container mx-auto">
        <div className={`flex justify-between items-center py-4 ${textColor}`}>
          <div className="font-semibold text-[32px] md:text-[48px]">
            Khang Saeb
          </div>

          <div className="flex items-center gap-8">
            <ul className="hidden md:flex font-semibold items-center">
              {menu.map((item) => (
                <li key={item.label} className="ml-12 text-[24px]">
                  <Link
                    href={item.href}
                    className={`relative inline-block cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full ${underlineColor} after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Profile */}
            {user ? (
              <Link
                href="/profile"
                className="hidden md:flex items-center ml-8 hover:opacity-80 transition-opacity"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-current">
                  <Image
                    src={user.image ?? '/userprofile.png'}
                    alt={user.name ?? 'profile'}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:block ml-8 text-[18px] font-semibold px-5 py-2 rounded-full transition-all duration-200"
                style={{
                  border: `2px solid ${isGreen ? 'white' : '#637402'}`,
                  color: isGreen ? 'white' : '#637402',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isGreen
                    ? 'white'
                    : '#637402';
                  e.currentTarget.style.color = isGreen ? '#637402' : 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = isGreen ? 'white' : '#637402';
                }}
              >
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className={`md:hidden ${open ? 'block' : 'hidden'} pb-4`}>
          <ul className={`flex flex-col font-semibold gap-3 ${textColor}`}>
            {menu.map((item) => (
              <li key={item.label} className="text-[18px]">
                <Link href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            {user && (
              <li className="text-[18px]">
                <Link href="/profile" onClick={() => setOpen(false)}>
                  สวัสดี, {user.name?.split(' ')[0] ?? 'คุณ'}
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}
