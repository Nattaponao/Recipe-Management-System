'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { fredoka } from "@/lib/fonts"
import Image from "next/image"
function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confrimPassword, setConfrimPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password != confrimPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      setLoading(true)
      const res = await axios.post('/api/auth/register', { name, email, password })
      setMessage(res.data?.message || 'Register Success!!')
      setName('')
      setEmail('')
      setPassword('')
      setConfrimPassword('')
      e.target.reset()
      console.log(res.data)
      router.push('/login')
    } catch (err) {
      console.log(err?.res?.data)
      setError(err?.res?.data?.message || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }

  }
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

        <div className='grid  grid-cols-3 mt-9 pb-14'>
          <div className='col-span-1'>
            <form onSubmit={handleSubmit}>
              <label className='font-semibold text-xl' htmlFor='name'>name </label>
              <input className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-6'
                type="text"
                id='name'
                placeholder='Enter your name'
                onChange={(e) => setName(e.target.value)} required />

              <label className='font-semibold text-xl' htmlFor='email'>Email </label>
              <input className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-6'
                type="email"
                id='email'
                placeholder='Enter your email'
                onChange={(e) => setEmail(e.target.value)} required />

              <label className='font-semibold text-xl ' htmlFor='password'>Password</label>
              <input className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-5'
                type="password"
                id='password'
                placeholder='Enter your password'
                onChange={(e) => setPassword(e.target.value)} required />

              <label className='font-semibold text-xl mt-4' htmlFor='confrimPassword'>ConfrimPassword</label>
              <input className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-6'
                type="password"
                id='confrimPassword'
                placeholder='Enter your ConfrimPassword'
                onChange={(e) => setConfrimPassword(e.target.value)} required />

              {error && <p>{error}</p>}
              {message && <p>{message}</p>}
              <button type="submit" className='bg-[#637402] text-white w-85 py-1.5 rounded-2xl cursor-pointer transition-all hover:bg-[#505e01]'> {loading ? 'Registering...' : 'Register'}</button>
              <p className='font-extralight my-1.5'>Do You have an account? <Link className='text-[#FE9F4D] hover:underline' href='/login'> Login </Link>page</p>

            </form>
          </div>
          <div className="col-span-2 flex items-start justify-end pr-6">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={580}
              height={580}
              className="w-145"
            />
          </div>
        </div>

      </div>
      <footer className='bg-[#E4D7AA] pt-9  pb-5'>
        <div className='container mx-auto'>

          <div className='flex justify-between items-center'>
            <div className='w-90'>
              <h1 className=' text-[#637402] text-[30px] font-semibold'>Khang Saeb</h1>
              <hr />
              <div className='text-[#637402] flex justify-between mt-6'>
                <p>อาณาจักรแห่งความอร่อย</p>
                <ul className='font-semibold '>
                  <li className='mb-1 hover:underline'><Link href='#'>Home</Link></li>
                  <li className='mb-1 hover:underline'><Link href='#'>Recipes</Link></li>
                  <li className='mb-1 hover:underline'><Link href='#'>Tips</Link></li>
                  <li className='mb-1 hover:underline'><Link href='#'>Contect</Link></li>
                </ul>
              </div>

            </div>
            <div className='flex bg-[#637402] h-1/2 py-4 px-9 justify-center rounded-2xl'>
              <div className='flex flex-col justify-center items-center'>
                <h1 className='text-[#DFD3A4] text-[20px] font-semibold'>Join us in a world of delicious flavors.</h1>
                <Link href='/login' className='bg-black text-[#E4D7AA] font-extralight text-[16px] py-2 px-5 mt-5 mb-3 rounded-3xl'>Login Now!</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default RegisterPage