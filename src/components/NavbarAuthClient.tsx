'use client';

import { useEffect, useState } from 'react';
import NavbarV2 from './navV2';

export default function NavbarAuthClient() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setIsAdmin(data.user?.role === 'ADMIN' || false);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (!loaded) return <div className="h-[72px]" />;

  return <NavbarV2 isAdmin={isAdmin} />;
}
