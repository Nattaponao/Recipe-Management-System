"use client";

import { useTransition } from "react";
import { updateUserRoleAction } from "@/app/(main)/admin/users/actions";


export default function RoleToggle({
  id,
  role,
}: {
  id: number;
  role: string; // "USER" | "ADMIN"
}) {
  const [pending, startTransition] = useTransition();
  const isAdmin = (role ?? "USER") === "ADMIN";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-10 text-right">USER</span>

      <button
        type="button"
        disabled={pending}
        aria-pressed={isAdmin}
        onClick={() => {
          const next = isAdmin ? "USER" : "ADMIN";
          startTransition(async () => {
            await updateUserRoleAction(id, next);
          });
        }}
        className={[
          "relative inline-flex h-6 w-11 items-center rounded-full border transition",
          "focus:outline-none focus:ring-2 focus:ring-[#637402]/40",
          pending ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          isAdmin ? "bg-[#637402] border-[#637402]" : "bg-gray-200 border-gray-300",
        ].join(" ")}
      >
        <span
          className={[
            "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
            isAdmin ? "translate-x-5" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>

      <span className="text-xs text-gray-500 w-12">ADMIN</span>
    </div>
  );
}
