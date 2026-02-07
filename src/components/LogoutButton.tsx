"use client"

import axios from "axios"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    await axios.post("/api/auth/logout")
    router.push("/login")
    router.refresh()
  }

  return (
    <button
      onClick={logout}  className="inline-block bg-red-800 text-[#E4D7AA] font-extralight text-[16px] py-2 px-5 mt-5 mb-3 rounded-3xl cursor-pointer"
      
    >
      Logout
    </button>
  )
}
