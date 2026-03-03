"use client";

import { useEffect } from "react";

export default function OnlinePing() {
  useEffect(() => {
    const ping = () =>
      fetch("/api/auth/ping", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        keepalive: true,
      }).catch(() => {});

    ping(); // ยิงทันทีเมื่อเข้า (main)
    const i = setInterval(ping, 60_000);
    return () => clearInterval(i);
  }, []);

  return null;
}
