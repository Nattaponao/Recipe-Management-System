'use client';

import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const AuthStatus = ({
  user,
  loading,
  isMobile,
  onLogout,
  closeMenu,
}: {
  user: any;
  loading: boolean;
  isMobile?: boolean;
  onLogout: () => void;
  closeMenu: () => void;
}) => {
  if (loading) {
    return (
      <div className="animate-pulse bg-white/20 w-8.5 h-8.5 rounded-full" />
    );
  }

  if (user) {
    return (
      <div
        className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center gap-4'}`}
      >
        <Link
          href="/profile"
          onClick={closeMenu}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {!isMobile && (
            <span className="text-white font-medium hidden lg:inline">
              {user.name}
            </span>
          )}
          <div className="w-8.5 h-8.5 bg-white rounded-full flex items-center justify-center overflow-hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <g fill="#637402" fillRule="evenodd" clipRule="evenodd">
                <path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0" />
                <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0 1 12.065 14a8.98 8.98 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.96 8.96 0 0 1-5.672-2.012A6.99 6.99 0 0 1 12.065 16a6.99 6.99 0 0 1 5.689 2.92A8.96 8.96 0 0 1 12 21" />
              </g>
            </svg>
          </div>
          {isMobile && (
            <span className="text-white font-semibold text-[18px]">
              Profile ({user.name})
            </span>
          )}
        </Link>
        <button
          onClick={onLogout}
          className="text-[14px] bg-[#FE9F4D] text-white px-4 py-1.5 rounded-2xl hover:bg-[#e88f3d] transition-colors w-fit font-semibold"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      onClick={closeMenu}
      className="flex items-center gap-2 hover:scale-105 transition-transform"
    >
      <div className="w-8.5 h-8.5 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="34"
          viewBox="0 0 24 24"
        >
          <g fill="#fff" fillRule="evenodd" clipRule="evenodd">
            <path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 1 1-4 0" />
            <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0 1 12.065 14a8.98 8.98 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.96 8.96 0 0 1-5.672-2.012A6.99 6.99 0 0 1 12.065 16a6.99 6.99 0 0 1 5.689 2.92A8.96 8.96 0 0 1 12 21" />
          </g>
        </svg>
      </div>
      {isMobile && (
        <span className="text-white font-semibold text-[18px]">
          Login / Register
        </span>
      )}
    </Link>
  );
};

// --- Main Component: Navbar ---
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setOpen(false);
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="bg-[#637402] sticky top-0 z-50 shadow-md">
      <nav className="container mx-auto px-4 md:px-0">
        <div className="flex justify-between items-center py-4 text-white">
          <Link
            href="/"
            className="font-semibold text-[32px] md:text-[48px] hover:opacity-90 transition-opacity"
          >
            Khang Saeb
          </Link>

          <div className="hidden md:flex items-center">
            <ul className="flex font-semibold items-center">
              {['Home', 'Recipes', 'Ai', 'Contact'].map((item) => (
                <li key={item} className="ml-10 text-[20px] lg:text-[24px]">
                  <Link
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="relative inline-block cursor-pointer after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-white after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="ml-10">
              <AuthStatus
                user={user}
                loading={loading}
                onLogout={handleLogout}
                closeMenu={() => setOpen(false)}
              />
            </div>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-125 pb-6' : 'max-h-0'}`}
        >
          <ul className="flex flex-col text-white font-semibold gap-5 px-2">
            {['Home', 'Recipes', 'Ai', 'Contact'].map((item) => (
              <li key={item} className="text-[18px]">
                <Link
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  onClick={() => setOpen(false)}
                  className="hover:text-gray-200"
                >
                  {item}
                </Link>
              </li>
            ))}
            <hr className="border-white/20" />
            <li>
              <AuthStatus
                user={user}
                loading={loading}
                isMobile={true}
                onLogout={handleLogout}
                closeMenu={() => setOpen(false)}
              />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
