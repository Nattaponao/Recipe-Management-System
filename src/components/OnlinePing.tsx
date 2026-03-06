"use client";

import { useEffect } from "react";

export default function OnlinePing() {
  useEffect(() => {
    const ping = () => {
      // 🌟 ถ้าผู้ใช้สลับไปหน้าอื่น หรือพับจออยู่ ให้ข้ามการ Ping ไปเลยเพื่อประหยัด Database
      if (document.visibilityState === 'hidden') return;

      fetch("/api/auth/ping", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        keepalive: true, // ดีมาก! ช่วยให้ยิงออกแม้ตอนปิด Tab
      }).catch(() => {});
    };

    ping(); // ยิงทันทีเมื่อเข้าเว็บ

    // 🌟 เปลี่ยนจาก 60 วิ เป็น 2 นาที (120_000) ช่วยลดภาระ Server ลงได้ครึ่งนึง
    const i = setInterval(ping, 120_000);

    // 🌟 พระเอกอยู่ตรงนี้: ถ้ายูสเซอร์สลับกลับมาดู Tab เรา ให้ยิง Ping ทันทีไม่ต้องรอรอบ
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') ping();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(i);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}