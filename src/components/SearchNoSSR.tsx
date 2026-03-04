/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import dynamic from 'next/dynamic';

const Search = dynamic(() => import('@/components/search'), {
  ssr: false,
  loading: () => (
    <div className="bg-[#F9F7EB]">
      <div className="container mx-auto">
        <div className="h-[105px] w-[400px] bg-[#637402]/10 rounded-lg animate-pulse mb-6" />
        <div className="h-12 w-full bg-white rounded-3xl animate-pulse mb-5" />
        <div className="h-px bg-[#637402] mb-3" />
        <div className="flex justify-between mb-5">
          <div className="h-8 w-36 bg-[#637402]/10 rounded animate-pulse" />
          <div className="h-8 w-24 bg-[#637402]/10 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-16 pb-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#FEFEF6] h-[280px] animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  ),
});

export default function SearchNoSSR(props: any) {
  return <Search {...props} />;
}
