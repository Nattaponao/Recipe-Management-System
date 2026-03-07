'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NavbarV2 from './navV2';

type User = {
  name?: string | null;
  image?: string | null;
  role?: string;
};

export default function NavbarAuthClient() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setIsAdmin(data.user?.role === 'ADMIN' || false);
        setUser(data.user ?? null);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) {
    const isGreen = ['/', '/ai'].includes(pathname);
    return (
      <div
        className={`${isGreen ? 'bg-[#637402]' : 'bg-[#F9F7EB]'} h-[104px]`}
      />
    );
  }

  return <NavbarV2 isAdmin={isAdmin} user={user} />;
}
