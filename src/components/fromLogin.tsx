/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

function isAdminEmailClient(email?: string | null) {
  const list = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return !!email && list.includes(email.toLowerCase());
}

function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/login", { email, password });

      setMessage(res.data?.message || "Login Success!!");

      const userEmail = res.data?.user?.email as string | undefined;
      console.log("LOGIN EMAIL:", userEmail, "ADMIN?", isAdminEmailClient(userEmail));

      // clear form
      setEmail("");
      setPassword("");
      (e.target as HTMLFormElement).reset();

      // redirect based on admin email
      if (isAdminEmailClient(userEmail)) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.log("status:", err?.response?.status);
      console.log("data:", err?.response?.data);
      console.log("headers:", err?.response?.headers);
      setError(err?.response?.data?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 mt-9 pb-14">
        <div className="col-span-1">
          <form onSubmit={handleSubmit}>
            <label className="font-semibold text-xl text-black" htmlFor="email">
              Email
            </label>
            <input
              className="block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4 mb-6"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="font-semibold text-xl text-black" htmlFor="password">
              Password
            </label>
            <input
              className="block p-1.5 border border-black outline-0 rounded-sm w-85 mt-4"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex gap-2 mt-4 mb-9">
              <input type="checkbox" />
              <p className="text-gray-500">Remember me</p>
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {message && <p className="text-green-700">{message}</p>}

            <button
              type="submit"
              className="bg-[#637402] text-white w-85 py-1.5 rounded-2xl cursor-pointer transition-all hover:bg-[#505e01]"
              disabled={loading}
            >
              {loading ? "Logining..." : "login"}
            </button>

            <p className="font-extralight my-1.5 text-black">
              Not registered yet?{" "}
              <Link className="text-[#FE9F4D] hover:underline" href="/register">
                Create an account
              </Link>{" "}
              Sign up
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
    </div>
  );
}

export default FormLogin;
