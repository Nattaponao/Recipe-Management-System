'use client';

import { PopularBlock } from './PopularBlock';

export default function HeroSection3({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="bg-[#F9F7EB] pb-20">
      <div className="container mx-auto">
        <div className="text-[#637402]">
          <PopularBlock isAdmin={Boolean(isAdmin)} />
        </div>
      </div>
    </div>
  );
}
