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
      onClick={logout}
      
    >
      Logout
    </button>
  )
}
