/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image"
function formRegister() {
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
      setError("Passwords don't match")
      return
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
      router.push('/login')
    } catch (err) {
      setError(err?.res?.data?.message || err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className='grid  grid-cols-3 mt-9 pb-14'>
        <div className='col-span-1'>
          <form onSubmit={handleSubmit}>
            <label className='font-semibold text-xl' htmlFor='name'>Name </label>
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
            <label className='font-semibold text-xl ' htmlFor='confrimPassword'>confrimPassword</label>
            <input className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-5'
              type="password"
              id='confrimPassword'
              placeholder='Enter your confrimPassword'
              onChange={(e) => setConfrimPassword(e.target.value)} required />

            {error && <p className='text-red-700'>{error}</p>}
            {message && <p className='text-red-700'>{message}</p>}
            <button type="submit" className='bg-[#637402] text-white w-85 py-1.5 rounded-2xl cursor-pointer transition-all hover:bg-[#505e01]'> {loading ? 'Registering...' : 'Register'}</button>
            <p className='font-extralight my-1.5'>Do you have an account? <Link className='text-[#FE9F4D] hover:underline' href='/login'> Login </Link>Page</p>
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

export default formRegister
