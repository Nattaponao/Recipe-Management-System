"use client";

import dynamic from "next/dynamic";

const Search = dynamic(() => import("@/components/search"), { ssr: false });

export default function SearchNoSSR(props: any) {
  return <Search {...props} />;
}
