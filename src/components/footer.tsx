import Link from "next/link"
import { cookies } from "next/headers"
import LogoutButton from "./LogoutButton"

export default async function Footer() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  const isAuthed = Boolean(token)

  return (
    <footer className="bg-[#E4D7AA] pt-9 pb-5">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          <div className="w-full md:w-90">
            <h1 className="text-[#637402] text-[26px] md:text-[30px] font-semibold">
              Khang Saeb
            </h1>

            <hr />

            <div className="text-[#637402] flex flex-col md:flex-row justify-between mt-6 gap-6 md:gap-0">
              <p>อาณาจักรแห่งความอร่อย</p>

              <ul className="font-semibold">
                <li className="mb-1 hover:underline"><Link href="/">Home</Link></li>
                <li className="mb-1 hover:underline"><Link href="#">Recipes</Link></li>
                <li className="mb-1 hover:underline"><Link href="#">Tips</Link></li>
                <li className="mb-1 hover:underline"><Link href="#">Contect</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex bg-[#637402] w-full md:w-auto py-4 px-6 md:px-9 justify-center rounded-2xl">
            <div className="flex flex-col justify-center items-center text-center">
              <h1 className="text-[#DFD3A4] text-[18px] md:text-[20px] font-semibold">
                Join us in a world of delicious flavors.
              </h1>

              {!isAuthed ? (
                <Link
                  href="/login"
                  className="inline-block bg-black text-[#E4D7AA] font-extralight text-[14px] md:text-[16px] py-2 px-5 mt-5 mb-3 rounded-3xl"
                >
                  Login Now!
                </Link>
              ) : (
                <LogoutButton />
              )}
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
