/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Image from "next/image"

function formLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      setLoading(true)
      const res = await axios.post('/api/auth/login', { email, password })
      setMessage(res.data?.message || 'Login Success!!')
      setEmail('')
      setPassword('')
      e.target.reset()
      console.log(res.data)
      router.push('/')
    } catch (e: any) {
      console.log("status:", e?.response?.status)
      console.log("data:", e?.response?.data)
      console.log("headers:", e?.response?.headers)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div>
      <div className='grid  grid-cols-3 mt-9 pb-14'>
        <div className='col-span-1'>
          <form onSubmit={handleSubmit}>
            <label className='font-semibold text-xl' htmlFor='email'>Email </label>
            <input className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-6'
              type="email"
              id='email'
              placeholder='Enter your email'
              onChange={(e) => setEmail(e.target.value)} required />
            <label className='font-semibold text-xl ' htmlFor='password'>Password</label>
            <input className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4'
              type="password"
              id='password'
              placeholder='Enter your password'
              onChange={(e) => setPassword(e.target.value)} required />
            <div className='flex gap-2 mt-4 mb-9'>
              <input type="checkbox" /><p className='text-gray-500'>Remember me</p>
            </div>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            <button type="submit" className='bg-[#637402] text-white w-85 py-1.5 rounded-2xl cursor-pointer transition-all hover:bg-[#505e01]'> {loading ? 'Logining...' : 'login'}</button>
            <p className='font-extralight my-1.5'>Not registered yet? <Link className='text-[#FE9F4D] hover:underline' href='/register'> Create an account </Link>Sign up</p>

          </form>
        </div>
        <div className="hidden md:flex col-span-2 items-start justify-end pr-6">
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
  )
}

export default formLogin