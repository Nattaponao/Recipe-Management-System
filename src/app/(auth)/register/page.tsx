
import Link from 'next/link'
import { fredoka } from "@/lib/fonts"
import Image from "next/image"
import Footer from '@/components/footer'
import FormRegister from '@/components/formRegister'
function RegisterPage() {

  return (
    <div className={`${fredoka.className} bg-[#F9F7EB]`}>
      <div className='container mx-auto'>
       <div className='flex justify-between items-center py-3.5'>
          <div className=' text-[#637402] text-[48px] font-semibold'>
            Khang Saeb
          </div>
          <div>
            <Link href='/login' className='bg-[#067429] text-white py-1.5 px-6.5 rounded-2xl cursor-pointer'>
              Sign in
            </Link>
          </div>
        </div>
        <h1 className='text-[#DFD3A4] text-[105px] font-semibold mt-4'>Register now</h1>
        <h3 className='text-[#637402] text-[24px] font-semibold mt-4'>Hi, Welcomeback!</h3>


        <FormRegister/>
          
     
      </div>
      <Footer/>
    </div>
  )
}

export default RegisterPage