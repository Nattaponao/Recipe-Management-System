'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

export default function FooterAuthButton() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setIsAuthed(!!data.user);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  return isAuthed ? (
    <LogoutButton />
  ) : (
    <Link
      href="/login"
      className="inline-block bg-black text-[#E4D7AA] font-extralight text-[14px] md:text-[16px] py-2 px-5 mt-5 mb-3 rounded-3xl"
    >
      Login Now!
    </Link>
  );
}
