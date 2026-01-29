import Link from "next/link"
import { cookies } from "next/headers"
import LogoutButton from "./LogoutButton"

export default async function Navbar() {
  const token = (await cookies()).get("token")?.value
  const isAuthed = !!token

  return (
    <nav >
      <Link href="/">Home</Link>

      {!isAuthed ? (
        <div >
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      ) : ( 
        <LogoutButton />
      )}
    </nav>
  )
}
