'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image"

export default function FormRegister() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confrimPassword, setConfrimPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confrimPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      setLoading(true)
      const res = await axios.post('/api/auth/register', { name, email, password })
      setMessage(res.data?.message || 'Register Success!!')

      // เคลียร์ค่าผ่าน state (ไม่ต้อง reset)
      setName('')
      setEmail('')
      setPassword('')
      setConfrimPassword('')

      router.push('/login')
    } catch (err: unknown) {
      const fallback =
        err instanceof Error ? err.message : "Something went wrong";

      const axiosMsg =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        (err as any).response?.data?.message;

      setError(axiosMsg || fallback);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='grid grid-cols-3 mt-9 pb-14'>
      <div className='col-span-1'>
        <form onSubmit={handleSubmit}>
          <label className='font-semibold text-xl' htmlFor='name'>Name</label>
          <input
            className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-6'
            type="text"
            id='name'
            placeholder='Enter your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className='font-semibold text-xl' htmlFor='email'>Email</label>
          <input
            className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-6'
            type="email"
            id='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className='font-semibold text-xl' htmlFor='password'>Password</label>
          <input
            className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-5'
            type="password"
            id='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className='font-semibold text-xl' htmlFor='confrimPassword'>Confirm Password</label>
          <input
            className='block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-5'
            type="password"
            id='confrimPassword'
            placeholder='Enter your confirmPassword'
            value={confrimPassword}
            onChange={(e) => setConfrimPassword(e.target.value)}
            required
          />

          {error && <p className='text-red-700'>{error}</p>}
          {message && <p className='text-green-700'>{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className='bg-[#637402] text-white w-85 py-1.5 rounded-2xl cursor-pointer transition-all hover:bg-[#505e01] disabled:opacity-60'
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          <p className='font-extralight my-1.5'>
            Do you have an account?{' '}
            <Link className='text-[#FE9F4D] hover:underline' href='/login'>Login</Link>
          </p>
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
  )
}
