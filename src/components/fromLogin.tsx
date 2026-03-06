/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function FormLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // 🌟 ใช้ fetch ธรรมดา เพื่อลดภาระ bundle size (ไม่ต้องง้อ axios)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setMessage(data.message || 'Login Success!!');
      const role = data.user?.role as string | undefined;

      // clear form
      setEmail('');
      setPassword('');

      // 🌟 โคตรสำคัญ! ต้องสั่ง refresh เพื่อให้ Server Components (เช่น Navbar) รู้ตัวว่ามี Cookie ใหม่แล้ว
      router.refresh();

      // redirect by role
      if (role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 🌟 ปรับ Layout ให้เป็น 1 column ในมือถือ และ 3 columns ในจอใหญ่ */}
      <div className="grid grid-cols-1 md:grid-cols-3 mt-9 pb-14 gap-8">
        <div className="md:col-span-1 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto md:mx-0">
            <label className="font-semibold text-xl text-black block" htmlFor="email">
              Email
            </label>
            <input
              className="block p-2 border border-black outline-0 rounded-lg w-full mt-2 mb-6 text-gray-700 focus:border-[#637402]"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="font-semibold text-xl text-black block" htmlFor="password">
              Password
            </label>
            <input
              className="block p-2 border border-black outline-0 rounded-lg w-full mt-2 text-gray-700 focus:border-[#637402]"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center gap-2 mt-4 mb-9">
              {/* 🌟 ผูก id ให้ checkbox จะได้กดที่ตัวหนังสือแล้วติ๊กถูกได้เลย */}
              <input type="checkbox" id="remember" className="cursor-pointer w-4 h-4 accent-[#637402]" />
              <label htmlFor="remember" className="text-gray-500 cursor-pointer select-none">
                Remember me
              </label>
            </div>

            {error && <p className="text-red-600 mb-4 bg-red-50 p-3 rounded-lg text-sm">{error}</p>}
            {message && <p className="text-green-700 mb-4 bg-green-50 p-3 rounded-lg text-sm">{message}</p>}

            <button
              type="submit"
              className="bg-[#637402] text-white w-full py-2.5 rounded-2xl cursor-pointer transition-all hover:bg-[#505e01] disabled:opacity-50 font-semibold"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="font-light mt-6 text-black text-center md:text-left text-sm">
              Not registered yet?{' '}
              <Link className="text-[#FE9F4D] hover:underline font-medium" href="/register">
                Create an account
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden md:flex md:col-span-2 items-center justify-end pr-6">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={580}
            height={580}
            className="w-full max-w-[450px] object-contain"
            priority // 🌟 โหลดโลโก้ทันที ไม่ต้องรอ Lazy load
          />
        </div>
      </div>
    </div>
  );
}

export default FormLogin;