"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-[#637402]">
      <nav className="container mx-auto">
        <div className="flex justify-between items-center py-4 text-white">
          {/* Logo - desktop คงเดิม, mobile ลดขนาดเฉพาะจอเล็ก */}
          <div className="font-semibold text-[32px] md:text-[48px]">
            Khang Saeb
          </div>

          {/* Desktop menu (คงโค้ด/สไตล์เดิมไว้ทั้งหมด) */}
          <ul className="hidden md:flex font-semibold items-center">
            <li className="ml-12 text-[24px]"><Link href="/">Home</Link></li>
            <li className="ml-12 text-[24px]"><Link href="/">Recipes</Link></li>
            <li className="ml-12 text-[24px]"><Link href="/">Ai</Link></li>
            <li className="ml-12 text-[24px]"><Link href="/">Contect</Link></li>
            <li className="ml-12 text-[24px]">
              <Image src="/search.svg" alt="search" width={24} height={24} />
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {/* icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <div className={`md:hidden ${open ? "block" : "hidden"} pb-4`}>
          <ul className="flex flex-col text-white font-semibold gap-3">
            <li className="text-[18px]">
              <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            </li>
            <li className="text-[18px]">
              <Link href="/" onClick={() => setOpen(false)}>Recipes</Link>
            </li>
            <li className="text-[18px]">
              <Link href="/" onClick={() => setOpen(false)}>Ai</Link>
            </li>
            <li className="text-[18px]">
              <Link href="/" onClick={() => setOpen(false)}>Contect</Link>
            </li>
            <li className="text-[18px] flex items-center gap-2">
              <Image src="/search.svg" alt="search" width={20} height={20} />
              <span>Search</span>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
