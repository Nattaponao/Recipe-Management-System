"use client";

import { useTransition } from "react";
import { deleteUserAction } from "@/app/(main)/admin/users/actions";


export default function DeleteUserButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className=" 00 px-4 py-2  hover:bg-red-50 transition text-sm disabled:opacity-50 cursor-pointer"
      onClick={() => {
        const ok = confirm("ลบผู้ใช้นี้จริงไหม? การลบจะย้อนกลับไม่ได้");
        if (!ok) return;

        startTransition(async () => {
          await deleteUserAction(id);
        });
      }}
    >
      {pending ? "Deleting..." : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#df0000" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zM8 9h8v10H8zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"/></svg>}
    </button>
  );
}
